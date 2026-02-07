'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { projectCommentSchema } from '@/lib/validations/project'

export async function addComment(data: {
  projectId: string
  content: string
  parentId?: string
}): Promise<{
  success: boolean
  comment?: any
  error?: string
}> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    const validated = projectCommentSchema.parse(data)

    // Verify project access
    const project = await prisma.project.findUnique({
      where: { id: validated.projectId, deletedAt: null },
      select: {
        id: true,
        clientId: true,
        managerId: true,
      },
    })

    if (!project) {
      return { success: false, error: 'Project not found' }
    }

    // Get user role for authorization
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    const isAdmin = user?.role === 'ADMIN'
    const hasAccess =
      isAdmin ||
      project.clientId === session.user.id ||
      project.managerId === session.user.id

    if (!hasAccess) {
      return {
        success: false,
        error: 'Not authorized to comment on this project',
      }
    }

    // If replying to a comment, verify parent exists
    if (validated.parentId) {
      const parentComment = await prisma.projectComment.findUnique({
        where: { id: validated.parentId },
      })

      if (!parentComment) {
        return { success: false, error: 'Parent comment not found' }
      }
    }

    const comment = await prisma.$transaction(async (tx) => {
      const newComment = await tx.projectComment.create({
        data: {
          projectId: validated.projectId,
          authorId: session.user.id!,
          content: validated.content,
          parentId: validated.parentId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
            },
          },
        },
      })

      await tx.projectActivity.create({
        data: {
          projectId: validated.projectId,
          userId: session.user.id!,
          action: validated.parentId ? 'comment_replied' : 'comment_added',
          description: validated.parentId
            ? 'Replied to a comment'
            : 'Added a comment',
          metadata: {
            commentId: newComment.id,
            parentId: validated.parentId,
          },
        },
      })

      return newComment
    })

    revalidatePath(`/dashboard/projects/${validated.projectId}`)
    return { success: true, comment }
  } catch (error) {
    console.error('Error adding comment:', error)
    return { success: false, error: 'Failed to add comment' }
  }
}

export async function deleteComment(commentId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    const comment = await prisma.projectComment.findUnique({
      where: { id: commentId },
      include: {
        author: true,
      },
    })

    if (!comment) {
      return { success: false, error: 'Comment not found' }
    }

    // Check if user is the author or admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    const isAuthor = comment.authorId === session.user.id
    const isAdmin = user?.role === 'ADMIN'

    if (!isAuthor && !isAdmin) {
      return {
        success: false,
        error: 'Unauthorized: Only the author or admin can delete this comment',
      }
    }

    await prisma.$transaction(async (tx) => {
      // Delete replies first
      await tx.projectComment.deleteMany({
        where: { parentId: commentId },
      })

      await tx.projectComment.delete({
        where: { id: commentId },
      })

      await tx.projectActivity.create({
        data: {
          projectId: comment.projectId,
          userId: session.user.id!,
          action: 'comment_deleted',
          description: 'Deleted a comment',
        },
      })
    })

    revalidatePath(`/dashboard/projects/${comment.projectId}`)
    return { success: true }
  } catch (error) {
    console.error('Error deleting comment:', error)
    return { success: false, error: 'Failed to delete comment' }
  }
}

'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { projectFileSchema } from '@/lib/validations/project'
import { cloudinary } from '@/lib/cloudinary'

export async function getUploadSignature(projectId: string): Promise<{
  success: boolean
  signature?: string
  timestamp?: number
  apiKey?: string
  cloudName?: string
  error?: string
}> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    // Verify project access
    const project = await prisma.project.findUnique({
      where: { id: projectId, deletedAt: null },
      select: { id: true },
    })

    if (!project) {
      return { success: false, error: 'Project not found' }
    }

    const timestamp = Math.round(new Date().getTime() / 1000)
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: `projects/${projectId}`,
      },
      process.env.CLOUDINARY_API_SECRET!
    )

    return {
      success: true,
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    }
  } catch (error) {
    console.error('Error generating upload signature:', error)
    return { success: false, error: 'Failed to generate upload signature' }
  }
}

export async function saveFileRecord(data: {
  projectId: string
  name: string
  url: string
  type: string
  size: number
  cloudinaryId?: string
}): Promise<{
  success: boolean
  file?: any
  error?: string
}> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    const validated = projectFileSchema.parse(data)

    const file = await prisma.$transaction(async (tx) => {
      const newFile = await tx.projectFile.create({
        data: {
          projectId: validated.projectId,
          uploadedById: session.user.id!,
          name: validated.name,
          url: validated.url,
          type: validated.type,
          size: validated.size,
          cloudinaryId: validated.cloudinaryId,
        },
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      await tx.projectActivity.create({
        data: {
          projectId: validated.projectId,
          userId: session.user.id!,
          action: 'file_uploaded',
          description: `Uploaded file: ${validated.name}`,
          metadata: {
            fileId: newFile.id,
            fileName: validated.name,
            fileType: validated.type,
          },
        },
      })

      return newFile
    })

    revalidatePath(`/dashboard/projects/${validated.projectId}`)
    return { success: true, file }
  } catch (error) {
    console.error('Error saving file record:', error)
    return { success: false, error: 'Failed to save file record' }
  }
}

export async function deleteFile(fileId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (user?.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin access required' }
    }

    const file = await prisma.projectFile.findUnique({
      where: { id: fileId },
    })

    if (!file) {
      return { success: false, error: 'File not found' }
    }

    // Delete from Cloudinary if cloudinaryId exists
    if (file.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(file.cloudinaryId)
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError)
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.projectFile.delete({
        where: { id: fileId },
      })

      await tx.projectActivity.create({
        data: {
          projectId: file.projectId,
          userId: session.user.id!,
          action: 'file_deleted',
          description: `Deleted file: ${file.name}`,
        },
      })
    })

    revalidatePath(`/dashboard/projects/${file.projectId}`)
    return { success: true }
  } catch (error) {
    console.error('Error deleting file:', error)
    return { success: false, error: 'Failed to delete file' }
  }
}

'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import {
  updateProjectStatusSchema,
  milestoneUpdateSchema,
} from '@/lib/validations/project'
import { ProjectStatus } from '@prisma/client'

type ProjectWithDetails = {
  id: string
  name: string
  description: string
  status: ProjectStatus
  priority: string
  budget: number
  currency: string
  startDate: Date | null
  endDate: Date | null
  kanbanOrder: number
  createdAt: Date
  updatedAt: Date
  client: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  manager: {
    id: string
    name: string | null
    email: string
  }
  milestones: Array<{
    id: string
    title: string
    description: string
    dueDate: Date
    completed: boolean
    completedAt: Date | null
    order: number
  }>
  _count: {
    files: number
    comments: number
  }
}

export async function getProjects(): Promise<{
  success: boolean
  projects?: ProjectWithDetails[]
  error?: string
}> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get user role for filtering
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    const isAdmin = user?.role === 'ADMIN'

    const projects = await prisma.project.findMany({
      where: {
        deletedAt: null,
        // Non-admin users only see projects they're associated with
        ...(isAdmin
          ? {}
          : {
              OR: [
                { clientId: session.user.id },
                { managerId: session.user.id },
              ],
            }),
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        milestones: {
          select: {
            id: true,
            title: true,
            description: true,
            dueDate: true,
            completed: true,
            completedAt: true,
            order: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            files: true,
            comments: true,
          },
        },
      },
      orderBy: [{ status: 'asc' }, { kanbanOrder: 'asc' }],
    })

    return {
      success: true,
      projects: projects.map((p) => ({
        ...p,
        budget: Number(p.budget),
      })),
    }
  } catch (error) {
    console.error('Error fetching projects:', error)
    return { success: false, error: 'Failed to fetch projects' }
  }
}

export async function getProject(projectId: string): Promise<{
  success: boolean
  project?: any
  error?: string
}> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get user role for authorization
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    const project = await prisma.project.findUnique({
      where: { id: projectId, deletedAt: null },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        milestones: {
          orderBy: { order: 'asc' },
        },
        files: {
          include: {
            uploadedBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        comments: {
          where: { parentId: null },
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
            replies: {
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
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        activities: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    })

    if (!project) {
      return { success: false, error: 'Project not found' }
    }

    // Check authorization: admins can view all, others only their own projects
    const isAdmin = user?.role === 'ADMIN'
    const hasAccess =
      isAdmin ||
      project.clientId === session.user.id ||
      project.managerId === session.user.id

    if (!hasAccess) {
      return { success: false, error: 'Not authorized to view this project' }
    }

    return {
      success: true,
      project: {
        ...project,
        budget: Number(project.budget),
      },
    }
  } catch (error) {
    console.error('Error fetching project:', error)
    return { success: false, error: 'Failed to fetch project' }
  }
}

export async function updateProjectStatus(data: {
  projectId: string
  status: string
  kanbanOrder?: number
}): Promise<{
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

    const validated = updateProjectStatusSchema.parse(data)

    await prisma.$transaction(async (tx) => {
      await tx.project.update({
        where: { id: validated.projectId },
        data: {
          status: validated.status as ProjectStatus,
          ...(validated.kanbanOrder !== undefined && {
            kanbanOrder: validated.kanbanOrder,
          }),
        },
      })

      await tx.projectActivity.create({
        data: {
          projectId: validated.projectId,
          userId: session.user.id!,
          action: 'status_changed',
          description: `Changed status to ${validated.status}`,
        },
      })
    })

    revalidatePath('/dashboard/projects')
    return { success: true }
  } catch (error) {
    console.error('Error updating project status:', error)
    return { success: false, error: 'Failed to update project status' }
  }
}

export async function toggleMilestone(data: {
  milestoneId: string
  completed: boolean
}): Promise<{
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

    const validated = milestoneUpdateSchema.parse(data)

    const milestone = await prisma.milestone.update({
      where: { id: validated.milestoneId },
      data: {
        completed: validated.completed,
        completedAt: validated.completed ? new Date() : null,
      },
      include: {
        project: true,
      },
    })

    await prisma.projectActivity.create({
      data: {
        projectId: milestone.projectId,
        userId: session.user.id!,
        action: 'milestone_toggled',
        description: `${validated.completed ? 'Completed' : 'Reopened'} milestone: ${milestone.title}`,
      },
    })

    revalidatePath(`/dashboard/projects/${milestone.projectId}`)
    return { success: true }
  } catch (error) {
    console.error('Error toggling milestone:', error)
    return { success: false, error: 'Failed to toggle milestone' }
  }
}

export async function reorderKanban(
  updates: Array<{
    projectId: string
    status: string
    kanbanOrder: number
  }>
): Promise<{
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

    await prisma.$transaction(
      updates.map((update) =>
        prisma.project.update({
          where: { id: update.projectId },
          data: {
            status: update.status as ProjectStatus,
            kanbanOrder: update.kanbanOrder,
          },
        })
      )
    )

    revalidatePath('/dashboard/projects')
    return { success: true }
  } catch (error) {
    console.error('Error reordering kanban:', error)
    return { success: false, error: 'Failed to reorder kanban' }
  }
}

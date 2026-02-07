import { z } from 'zod'

export const projectStatusSchema = z.enum([
  'PLANNING',
  'IN_PROGRESS',
  'REVIEW',
  'COMPLETED',
  'ON_HOLD',
  'CANCELLED',
])

export const projectPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])

export const updateProjectStatusSchema = z.object({
  projectId: z.string(),
  status: projectStatusSchema,
  kanbanOrder: z.number().int().min(0).optional(),
})

export const projectCommentSchema = z.object({
  projectId: z.string(),
  content: z.string().min(1).max(5000),
  parentId: z.string().optional(),
})

export const projectFileSchema = z.object({
  projectId: z.string(),
  name: z.string().min(1).max(255),
  url: z.string().url(),
  type: z.string(),
  size: z.number().int().min(0),
  cloudinaryId: z.string().optional(),
})

export const milestoneUpdateSchema = z.object({
  milestoneId: z.string(),
  completed: z.boolean(),
})

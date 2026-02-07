import { z } from "zod";

// Match the existing ProjectStatus enum in schema.prisma:
// PLANNING, IN_PROGRESS, REVIEW, COMPLETED, ON_HOLD, CANCELLED
export const projectStatusSchema = z.enum([
  "PLANNING",
  "IN_PROGRESS",
  "REVIEW",
  "COMPLETED",
  "ON_HOLD",
  "CANCELLED",
]);

// Match the existing Priority enum in schema.prisma:
// LOW, MEDIUM, HIGH, URGENT
export const projectPrioritySchema = z.enum([
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
]);

export const updateProjectStatusSchema = z.object({
  projectId: z.string().cuid(),
  status: projectStatusSchema,
  kanbanOrder: z.number().int().min(0).optional(),
});

export const projectCommentSchema = z.object({
  projectId: z.string().cuid(),
  content: z.string().min(1, "Comment cannot be empty").max(5000),
  parentId: z.string().cuid().optional(),
});

export const projectFileSchema = z.object({
  projectId: z.string().cuid(),
  name: z.string().min(1).max(255),
  url: z.string().url(),
  type: z.string(),
  size: z.number().int().min(0),
  cloudinaryId: z.string().optional(),
});

export const milestoneUpdateSchema = z.object({
  milestoneId: z.string().cuid(),
  completed: z.boolean(),
});

export type ProjectStatus = z.infer<typeof projectStatusSchema>;
export type ProjectPriority = z.infer<typeof projectPrioritySchema>;

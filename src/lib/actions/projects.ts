"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  milestoneUpdateSchema,
  updateProjectStatusSchema,
} from "@/lib/validations/project";
import { revalidatePath } from "next/cache";

async function requireAuth(): Promise<{
  id: string;
  role: string;
}> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return { id: session.user.id, role: session.user.role ?? "STUDENT" };
}

async function requireProjectAccess(
  projectId: string,
  userId: string,
  role: string,
): Promise<boolean> {
  if (role === "ADMIN") return true;
  const project = await prisma.project.findFirst({
    where: { id: projectId, clientId: userId },
  });
  if (!project) throw new Error("Project not found or access denied");
  return true;
}

export async function getProjects() {
  const user = await requireAuth();

  const where =
    user.role === "ADMIN"
      ? { deletedAt: null }
      : { clientId: user.id, deletedAt: null };

  return prisma.project.findMany({
    where,
    include: {
      client: { select: { id: true, name: true, email: true, image: true } },
      milestones: { orderBy: { order: "asc" } },
      _count: { select: { files: true, comments: true } },
    },
    orderBy: [{ status: "asc" }, { kanbanOrder: "asc" }, { updatedAt: "desc" }],
  });
}

export async function getProject(projectId: string) {
  const user = await requireAuth();
  await requireProjectAccess(projectId, user.id, user.role);

  return prisma.project.findUniqueOrThrow({
    where: { id: projectId },
    include: {
      client: { select: { id: true, name: true, email: true, image: true } },
      milestones: { orderBy: { order: "asc" } },
      files: {
        include: { uploadedBy: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
      comments: {
        where: { parentId: null },
        include: {
          author: { select: { id: true, name: true, image: true, role: true } },
          replies: {
            include: {
              author: {
                select: { id: true, name: true, image: true, role: true },
              },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      activities: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      _count: { select: { files: true, comments: true } },
    },
  });
}

export async function updateProjectStatus(data: {
  projectId: string;
  status: string;
  kanbanOrder?: number;
}) {
  const user = await requireAuth();
  if (user.role !== "ADMIN")
    throw new Error("Only admins can update project status");

  const validated = updateProjectStatusSchema.parse(data);

  // Get current project to log activity
  const currentProject = await prisma.project.findUniqueOrThrow({
    where: { id: validated.projectId },
    select: { status: true },
  });

  const project = await prisma.project.update({
    where: { id: validated.projectId },
    data: {
      status: validated.status,
      kanbanOrder: validated.kanbanOrder ?? 0,
    },
  });

  // Log activity
  await prisma.projectActivity.create({
    data: {
      projectId: validated.projectId,
      userId: user.id,
      action: "status_changed",
      description: `Status changed to ${validated.status.replace("_", " ")}`,
      metadata: { from: currentProject.status, to: validated.status },
    },
  });

  revalidatePath("/dashboard/projects");
  return { success: true };
}

export async function toggleMilestone(data: {
  milestoneId: string;
  completed: boolean;
}) {
  const user = await requireAuth();
  const validated = milestoneUpdateSchema.parse(data);

  const milestone = await prisma.milestone.update({
    where: { id: validated.milestoneId },
    data: { completedAt: validated.completed ? new Date() : null },
    include: { project: true },
  });

  await prisma.projectActivity.create({
    data: {
      projectId: milestone.projectId,
      userId: user.id,
      action: "milestone_completed",
      description: `Milestone "${milestone.title}" ${validated.completed ? "completed" : "reopened"}`,
    },
  });

  revalidatePath(`/dashboard/projects/${milestone.projectId}`);
  return { success: true };
}

export async function reorderKanban(
  updates: Array<{ projectId: string; status: string; kanbanOrder: number }>,
) {
  const user = await requireAuth();
  if (user.role !== "ADMIN")
    throw new Error("Only admins can reorder projects");

  await prisma.$transaction(
    updates.map(({ projectId, status, kanbanOrder }) =>
      prisma.project.update({
        where: { id: projectId },
        data: {
          status: status as
            | "PLANNING"
            | "IN_PROGRESS"
            | "REVIEW"
            | "COMPLETED"
            | "ON_HOLD"
            | "CANCELLED",
          kanbanOrder,
        },
      }),
    ),
  );

  revalidatePath("/dashboard/projects");
  return { success: true };
}

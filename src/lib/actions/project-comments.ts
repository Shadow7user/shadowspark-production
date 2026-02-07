"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectCommentSchema } from "@/lib/validations/project";
import { revalidatePath } from "next/cache";

async function requireAuth(): Promise<{ id: string; role: string }> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return { id: session.user.id, role: session.user.role ?? "STUDENT" };
}

export async function addComment(data: {
  projectId: string;
  content: string;
  parentId?: string;
}) {
  const user = await requireAuth();
  const validated = projectCommentSchema.parse(data);

  // Verify project access
  if (user.role !== "ADMIN") {
    const project = await prisma.project.findFirst({
      where: { id: validated.projectId, clientId: user.id },
    });
    if (!project) throw new Error("Access denied");
  }

  const comment = await prisma.projectComment.create({
    data: {
      projectId: validated.projectId,
      authorId: user.id,
      content: validated.content,
      parentId: validated.parentId,
    },
    include: {
      author: { select: { id: true, name: true, image: true, role: true } },
    },
  });

  await prisma.projectActivity.create({
    data: {
      projectId: validated.projectId,
      userId: user.id,
      action: "comment_added",
      description: validated.parentId
        ? "Replied to a comment"
        : "Added a comment",
    },
  });

  revalidatePath(`/dashboard/projects/${validated.projectId}`);
  return { success: true, comment };
}

export async function deleteComment(commentId: string) {
  const user = await requireAuth();

  const comment = await prisma.projectComment.findUniqueOrThrow({
    where: { id: commentId },
  });

  // Only author or admin can delete
  if (comment.authorId !== user.id && user.role !== "ADMIN") {
    throw new Error("Cannot delete this comment");
  }

  await prisma.projectComment.delete({ where: { id: commentId } });

  revalidatePath(`/dashboard/projects/${comment.projectId}`);
  return { success: true };
}

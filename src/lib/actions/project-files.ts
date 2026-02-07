"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectFileSchema } from "@/lib/validations/project";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function requireAuth(): Promise<{ id: string; role: string }> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return { id: session.user.id, role: session.user.role ?? "STUDENT" };
}

export async function getUploadSignature(projectId: string) {
  const user = await requireAuth();

  // Verify project access
  if (user.role !== "ADMIN") {
    const project = await prisma.project.findFirst({
      where: { id: projectId, clientId: user.id },
    });
    if (!project) throw new Error("Access denied");
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = `shadowspark/projects/${projectId}`;

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!,
  );

  return {
    signature,
    timestamp,
    folder,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
  };
}

export async function saveFileRecord(data: {
  projectId: string;
  name: string;
  url: string;
  type: string;
  size: number;
  cloudinaryId?: string;
}) {
  const user = await requireAuth();
  const validated = projectFileSchema.parse(data);

  const file = await prisma.projectFile.create({
    data: {
      ...validated,
      uploadedById: user.id,
    },
  });

  await prisma.projectActivity.create({
    data: {
      projectId: validated.projectId,
      userId: user.id,
      action: "file_uploaded",
      description: `Uploaded "${validated.name}"`,
      metadata: { fileId: file.id, type: validated.type, size: validated.size },
    },
  });

  revalidatePath(`/dashboard/projects/${validated.projectId}`);
  return { success: true, fileId: file.id };
}

export async function deleteFile(fileId: string) {
  const user = await requireAuth();
  if (user.role !== "ADMIN") throw new Error("Only admins can delete files");

  const file = await prisma.projectFile.findUniqueOrThrow({
    where: { id: fileId },
  });

  // Delete from Cloudinary if we have the ID
  if (file.cloudinaryId) {
    try {
      await cloudinary.uploader.destroy(file.cloudinaryId);
    } catch (err) {
      console.error("Cloudinary delete failed:", err);
      // Continue with DB deletion even if Cloudinary fails
    }
  }

  await prisma.projectFile.delete({ where: { id: fileId } });

  revalidatePath(`/dashboard/projects/${file.projectId}`);
  return { success: true };
}

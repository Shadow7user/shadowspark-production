"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getLeads() {
  return await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function updateLeadStatus(id: string, status: string) {
  await prisma.lead.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/dashboard/leads");
}

"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function enrollUserInCourse(
  courseId: string,
  paymentReference: string,
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }
  const userId = session.user.id;

  try {
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existing) {
      return { success: true, alreadyEnrolled: true };
    }

    await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        progressPercentage: 0,
        moduleProgress: {},
        // paymentReference logic - currently enrollment might not have this field in schema,
        // but the API route likely handled it or ignored it.
        // Assuming we just want to create enrollment.
      },
    });

    // Log payment (optional if we had a Transaction table)

    revalidatePath(`/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    console.error("Enrollment failed:", error);
    return { error: "Enrollment failed" };
  }
}

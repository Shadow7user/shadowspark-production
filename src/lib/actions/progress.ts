"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateLessonProgress({
  courseId,
  moduleId,
  lessonId,
  progress,
}: {
  courseId: string;
  moduleId: string;
  lessonId: string;
  progress: number;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;

  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return { error: "Not enrolled" };
    }

    const currentModuleProgress =
      (enrollment.moduleProgress as Record<string, any>) || {};
    const moduleData = currentModuleProgress[moduleId] || {};
    const updatedModuleData = {
      ...moduleData,
      [lessonId]: progress,
    };
    const newModuleProgress: Record<string, any> = {
      ...currentModuleProgress,
      [moduleId]: updatedModuleData,
    };

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: { lessons: true },
        },
      },
    });

    let newOverallProgress = 0;

    if (course && course.modules.length > 0) {
      let totalLessons = 0;
      let completedLessonValue = 0;

      course.modules.forEach((mod) => {
        const modKey = mod.id;
        const modProg = newModuleProgress[modKey] || {};

        mod.lessons.forEach((les) => {
          totalLessons++;
          const p = typeof modProg[les.id] === "number" ? modProg[les.id] : 0;
          completedLessonValue += p;
        });
      });

      if (totalLessons > 0) {
        newOverallProgress = completedLessonValue / totalLessons;
      }
    } else {
      newOverallProgress = Number(enrollment.progressPercentage);
    }

    const isCompleted = newOverallProgress >= 100;
    const updateData: any = {
      moduleProgress: newModuleProgress,
      progressPercentage: newOverallProgress,
    };

    if (isCompleted && !enrollment.completed) {
      updateData.completed = true;
      updateData.completedAt = new Date();
    } else if (isCompleted) {
      updateData.completed = true;
    }

    // Also track individual lesson completion if 100%
    if (progress >= 100) {
      await prisma.lessonCompletion.upsert({
        where: {
          userId_lessonId: { userId, lessonId },
        },
        create: {
          userId,
          lessonId,
          completedAt: new Date(),
        },
        update: {},
      });
    }

    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: updateData,
    });

    revalidatePath(`/courses/${courseId}/learn`);
    return { success: true, progress: newOverallProgress };
  } catch (error) {
    console.error("Progress update failed:", error);
    return { error: "Failed to update progress" };
  }
}

export async function markLessonComplete(lessonId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true },
    });

    if (!lesson) {
      return { error: "Lesson not found" };
    }

    const { moduleId } = lesson;
    const { courseId } = lesson.module;

    // Reuse calculation logic
    const result = await updateLessonProgress({
      courseId,
      moduleId,
      lessonId,
      progress: 100,
    });

    if (result.error) {
      return { error: result.error };
    }

    // Determine completion status based on progress
    const progress = result.progress ?? 0;
    const completed = progress >= 100;

    return { success: true, progress, completed };
  } catch (error) {
    console.error("Failed to mark complete", error);
    return { error: "Failed to mark complete" };
  }
}

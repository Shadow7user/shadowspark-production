// app/api/progress/update/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId, moduleId, lessonId, progress } = await request.json(); // progress 0-100

  // Validate input
  if (!courseId || !moduleId || !lessonId || typeof progress !== "number") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    });

    if (!enrollment)
      return NextResponse.json({ error: "Not enrolled" }, { status: 404 });

    // Handle JSON moduleProgress
    // We treat existing moduleProgress as an object: { [moduleId]: { [lessonId]: percentage } }
    const currentModuleProgress =
      (enrollment.moduleProgress as Record<string, any>) || {};
    const moduleData = currentModuleProgress[moduleId] || {};

    // Update the specific lesson
    const updatedModuleData = {
      ...moduleData,
      [lessonId]: progress,
    };

    // Update the main object
    const newModuleProgress: Record<string, any> = {
      ...currentModuleProgress,
      [moduleId]: updatedModuleData,
    };

    // Recalc overall progress
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

      // Calculate total steps
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

    // Only mark completed if not already completed (preserve original date)
    if (isCompleted && !enrollment.completed) {
      updateData.completed = true;
      updateData.completedAt = new Date();
    } else if (isCompleted) {
      // Ensure specific floating point errors don't un-complete it
      updateData.completed = true;
    }

    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, progress: newOverallProgress });
  } catch (error) {
    console.error("Progress update failed:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 },
    );
  }
}

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: Props) {
  try {
    const { id: lessonId } = await params;
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get lesson and its course/module
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              include: {
                modules: {
                  include: { lessons: true },
                },
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Find or create lesson completion record
    const completion = await prisma.lessonCompletion.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
      update: {
        completedAt: new Date(),
      },
      create: {
        userId: user.id,
        lessonId,
        completedAt: new Date(),
      },
    });

    // Calculate enrollment progress
    const courseId = lesson.module.course.id;
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId,
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Not enrolled in this course" },
        { status: 403 }
      );
    }

    // Get all lessons in course
    const allLessons = lesson.module.course.modules.flatMap((m) => m.lessons);

    // Count completed lessons
    const completedCount = await prisma.lessonCompletion.count({
      where: {
        userId: user.id,
        lesson: {
          module: {
            courseId,
          },
        },
      },
    });

    const progressPercentage = Math.round(
      (completedCount / allLessons.length) * 100
    );

    // Update enrollment progress
    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress: progressPercentage,
        completed: progressPercentage === 100,
      },
    });

    return NextResponse.json({
      completion,
      progress: updatedEnrollment.progress,
      completed: updatedEnrollment.completed,
    });
  } catch (error) {
    console.error("Error marking lesson complete:", error);
    return NextResponse.json(
      { error: "Failed to mark lesson complete" },
      { status: 500 }
    );
  }
}

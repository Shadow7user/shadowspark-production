"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getRecommendations({
  excludeCourseId,
  limit = 3,
}: {
  excludeCourseId?: string;
  limit?: number;
}) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    // Logic from api/recommendations/route.ts
    // 1. Get user enrollments to exclude
    let excludedIds: string[] = [];
    if (userId) {
      const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        select: { courseId: true },
      });
      excludedIds = enrollments.map((e) => e.courseId);
    }

    if (excludeCourseId) {
      excludedIds.push(excludeCourseId);
    }

    const recommendations = await prisma.course.findMany({
      where: {
        id: { notIn: excludedIds },
        published: true,
      },
      take: limit,
      orderBy: { createdAt: "desc" }, // Simple logic for now
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        price: true,
        thumbnail: true,
        level: true,
        category: true,
        _count: {
          select: { enrollments: true },
        },
      },
    });

    const mapped = recommendations.map((c) => ({
      ...c,
      studentCount: c._count.enrollments,
    }));

    return { recommendations: mapped, personalized: !!userId };
  } catch (error) {
    console.error("Failed to get recommendations:", error);
    return { recommendations: [], personalized: false };
  }
}

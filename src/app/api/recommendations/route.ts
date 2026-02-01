import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type CourseRecommendation = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: unknown;
  thumbnail: string | null;
  level: string;
  category: string;
  studentCount: number;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6', 10);
    const excludeCourseId = searchParams.get('exclude'); // Exclude current course

    const session = await auth();

    let recommendations: CourseRecommendation[] = [];

    if (session?.user?.id) {
      // Authenticated: Personalize based on enrollments
      const userEnrollments = await prisma.enrollment.findMany({
        where: { userId: session.user.id },
        select: { courseId: true },
      });

      const enrolledCourseIds = userEnrollments.map((e) => e.courseId);
      const excludeIds = excludeCourseId
        ? [...enrolledCourseIds, excludeCourseId]
        : enrolledCourseIds;

      if (enrolledCourseIds.length > 0) {
        // Get categories of enrolled courses
        const enrolledCourses = await prisma.course.findMany({
          where: { id: { in: enrolledCourseIds } },
          select: { category: true, level: true },
        });

        const categories = [...new Set(enrolledCourses.map((c) => c.category))];
        const levels = [...new Set(enrolledCourses.map((c) => c.level))];

        // Determine next level progression
        const nextLevels: string[] = [];
        if (levels.includes('BEGINNER')) nextLevels.push('INTERMEDIATE');
        if (levels.includes('INTERMEDIATE')) nextLevels.push('ADVANCED');
        if (levels.includes('ADVANCED')) nextLevels.push('PROFESSIONAL');

        // Recommend: same category, not enrolled, same or higher level
        recommendations = await prisma.course.findMany({
          where: {
            published: true,
            id: { notIn: excludeIds },
            OR: [
              // Same category courses
              { category: { in: categories } },
              // Next level progression
              { level: { in: nextLevels as any[] } },
            ],
          },
          orderBy: { studentCount: 'desc' },
          take: limit,
          select: {
            id: true,
            slug: true,
            title: true,
            description: true,
            price: true,
            thumbnail: true,
            level: true,
            category: true,
            studentCount: true,
          },
        });
      }
    }

    // Fallback: Popular courses (for unauthenticated or users with no enrollments)
    if (recommendations.length < limit) {
      const excludeIds = recommendations.map((r) => r.id);
      if (excludeCourseId) excludeIds.push(excludeCourseId);

      const currentCount = recommendations.length;
      const popular = await prisma.course.findMany({
        where: {
          published: true,
          id: { notIn: excludeIds },
        },
        orderBy: { studentCount: 'desc' },
        take: limit - currentCount,
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          price: true,
          thumbnail: true,
          level: true,
          category: true,
          studentCount: true,
        },
      });

      recommendations = [...recommendations, ...popular].slice(0, limit);
    }

    return NextResponse.json({
      recommendations,
      personalized: !!session?.user?.id,
    });
  } catch (error) {
    console.error('Recommendations API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

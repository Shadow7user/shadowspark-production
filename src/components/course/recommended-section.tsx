import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CourseCard } from "@/components/course-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface RecommendedSectionProps {
  excludeCourseId?: string;
  limit?: number;
  title?: string;
}

export async function RecommendedSection({
  excludeCourseId,
  limit = 6,
  title = "Recommended for You",
}: RecommendedSectionProps) {
  const session = await auth();

  let recommendations: any[] = [];
  let isPersonalized = false;

  try {
    // Get user enrollments for progress tracking
    let userProgressMap: Record<string, number> = {};
    let enrolledCourseIds: string[] = [];

    if (session?.user?.id) {
      const userEnrollments = await prisma.enrollment.findMany({
        where: { userId: session.user.id },
        select: { courseId: true, progressPercentage: true },
      });

      enrolledCourseIds = userEnrollments.map((e) => e.courseId);
      userProgressMap = Object.fromEntries(
        userEnrollments.map((e) => [
          e.courseId,
          Number(e.progressPercentage ?? 0),
        ]),
      );

      // Personalized recommendations
      if (enrolledCourseIds.length > 0) {
        const enrolledCourses = await prisma.course.findMany({
          where: { id: { in: enrolledCourseIds } },
          select: { category: true, level: true },
        });

        const categories = [...new Set(enrolledCourses.map((c) => c.category))];
        const levels = [...new Set(enrolledCourses.map((c) => c.level))];

        // Determine progression levels
        const nextLevels: string[] = [];
        if (levels.includes("BEGINNER")) nextLevels.push("INTERMEDIATE");
        if (levels.includes("INTERMEDIATE")) nextLevels.push("ADVANCED");
        if (levels.includes("ADVANCED")) nextLevels.push("PROFESSIONAL");

        const excludeIds = excludeCourseId
          ? [...enrolledCourseIds, excludeCourseId]
          : enrolledCourseIds;

        recommendations = await prisma.course.findMany({
          where: {
            published: true,
            id: { notIn: excludeIds },
            OR: [
              { category: { in: categories } },
              { level: { in: nextLevels as any[] } },
            ],
          },
          orderBy: { studentCount: "desc" },
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

        isPersonalized = recommendations.length > 0;
      }
    }

    // Fallback: Popular courses
    if (recommendations.length < limit) {
      const excludeIds = recommendations.map((r) => r.id);
      if (excludeCourseId) excludeIds.push(excludeCourseId);

      const popular = await prisma.course.findMany({
        where: {
          published: true,
          id: { notIn: excludeIds },
        },
        orderBy: { studentCount: "desc" },
        take: limit - recommendations.length,
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

    if (recommendations.length === 0) {
      return null;
    }

    return (
      <section className="my-12">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {title}
          </h2>
          <Badge
            variant="outline"
            className="border-purple-500/50 text-purple-400 bg-purple-500/10"
          >
            {isPersonalized ? "🤖 Powered by AI" : "🔥 Trending"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              slug={course.slug}
              title={course.title}
              description={course.description}
              price={Number(course.price)}
              level={course.level}
              enrollment={course.studentCount}
              thumbnail={course.thumbnail}
              isRecommended={isPersonalized}
              progress={userProgressMap[course.id] ?? null}
              isEnrolled={enrolledCourseIds.includes(course.id)}
            />
          ))}
        </div>
      </section>
    );
  } catch (error) {
    console.error("RecommendedSection error:", error);
    return null;
  }
}

// Loading skeleton for Suspense fallback
export function RecommendedSectionSkeleton() {
  return (
    <section className="my-12">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden border-border/50">
            <Skeleton className="aspect-video w-full" />
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-9 w-28" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CourseAnalyticsPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.email) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        include: {
          lessons: {
            include: {
              completions: true,
            },
          },
        },
        orderBy: { order: "asc" },
      },
      enrollments: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { enrolledAt: "desc" },
      },
    },
  });

  if (!course) notFound();

  // Calculate analytics
  const totalEnrollments = course.enrollments.length;
  const completedCount = course.enrollments.filter((e) => e.completed).length;
  const completionRate = totalEnrollments > 0 
    ? Math.round((completedCount / totalEnrollments) * 100) 
    : 0;
  const avgProgress = totalEnrollments > 0
    ? Math.round(
        course.enrollments.reduce((acc, e) => acc + e.progress, 0) / totalEnrollments
      )
    : 0;

  // Progress distribution
  const progressBuckets = {
    "0-25%": course.enrollments.filter((e) => e.progress <= 25).length,
    "26-50%": course.enrollments.filter((e) => e.progress > 25 && e.progress <= 50).length,
    "51-75%": course.enrollments.filter((e) => e.progress > 50 && e.progress <= 75).length,
    "76-100%": course.enrollments.filter((e) => e.progress > 75).length,
  };

  // Lesson completion rates
  const lessonStats = course.modules.flatMap((mod) =>
    mod.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      moduleTitle: mod.title,
      completions: lesson.completions.length,
      rate: totalEnrollments > 0
        ? Math.round((lesson.completions.length / totalEnrollments) * 100)
        : 0,
    }))
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/admin/courses" className="text-muted-foreground hover:underline text-sm">
            ← Back to Courses
          </Link>
          <h1 className="text-3xl font-bold mt-2">{course.title}</h1>
          <p className="text-muted-foreground">Course Analytics & Insights</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalEnrollments}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{completionRate}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{avgProgress}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                ₦{(Number(course.price) * totalEnrollments).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Progress Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Progress Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(progressBuckets).map(([range, count]) => (
                  <div key={range} className="flex items-center gap-4">
                    <span className="w-20 text-sm text-muted-foreground">{range}</span>
                    <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all"
                        style={{
                          width: `${totalEnrollments > 0 ? (count / totalEnrollments) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="w-12 text-sm font-medium text-right">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* At-Risk Students */}
          <Card>
            <CardHeader>
              <CardTitle>At-Risk Students (&lt;25% progress)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {course.enrollments
                  .filter((e) => e.progress < 25 && !e.completed)
                  .slice(0, 10)
                  .map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="flex items-center justify-between border-b pb-2 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {enrollment.user.name || enrollment.user.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-red-600">
                        {enrollment.progress}%
                      </span>
                    </div>
                  ))}
                {course.enrollments.filter((e) => e.progress < 25 && !e.completed).length === 0 && (
                  <p className="text-muted-foreground text-sm">No at-risk students!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lesson Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Lesson Completion Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {lessonStats.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-4 py-2 border-b last:border-0"
                >
                  <span className="w-8 text-sm text-muted-foreground">{idx + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{lesson.title}</p>
                    <p className="text-xs text-muted-foreground">{lesson.moduleTitle}</p>
                  </div>
                  <div className="w-32 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        lesson.rate > 75 ? "bg-green-500" :
                        lesson.rate > 50 ? "bg-yellow-500" :
                        lesson.rate > 25 ? "bg-orange-500" : "bg-red-500"
                      }`}
                      style={{ width: `${lesson.rate}%` }}
                    />
                  </div>
                  <span className="w-16 text-sm text-right">
                    {lesson.completions}/{totalEnrollments}
                  </span>
                </div>
              ))}
              {lessonStats.length === 0 && (
                <p className="text-muted-foreground text-sm">No lessons yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Student List */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>All Students ({totalEnrollments})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Student</th>
                    <th className="text-left py-2 font-medium">Enrolled</th>
                    <th className="text-left py-2 font-medium">Progress</th>
                    <th className="text-left py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {course.enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="border-b last:border-0">
                      <td className="py-3">
                        <p className="font-medium">
                          {enrollment.user.name || "No name"}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {enrollment.user.email}
                        </p>
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-primary h-full"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                          <span>{enrollment.progress}%</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            enrollment.completed
                              ? "bg-green-100 text-green-800"
                              : enrollment.progress > 0
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {enrollment.completed
                            ? "Completed"
                            : enrollment.progress > 0
                              ? "In Progress"
                              : "Not Started"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {course.enrollments.length === 0 && (
                <p className="text-muted-foreground text-sm py-4 text-center">
                  No students enrolled yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function AdminCoursesPage() {
  const session = await auth();

  if (!session?.user?.email) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const courses = await prisma.course.findMany({
    include: {
      _count: { select: { enrollments: true, modules: true } },
      modules: { include: { _count: { select: { lessons: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Course Management</h1>
            <p className="text-muted-foreground">
              {courses.length} courses total
            </p>
          </div>
          <Link
            href="/admin/courses/new"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            + New Course
          </Link>
        </div>

        <div className="grid gap-4">
          {courses.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No courses yet</p>
                <Link
                  href="/admin/courses/new"
                  className="text-primary hover:underline mt-2 inline-block"
                >
                  Create your first course
                </Link>
              </CardContent>
            </Card>
          ) : (
            courses.map((course) => {
              const totalLessons = course.modules.reduce(
                (acc, mod) => acc + mod._count.lessons,
                0
              );
              return (
                <Card key={course.id} className="hover:border-primary/50 transition">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {course.category} • {course.level}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            course.published
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {course.published ? "Published" : "Draft"}
                        </span>
                        {course.featured && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-6 text-sm text-muted-foreground">
                        <span>{course._count.modules} modules</span>
                        <span>{totalLessons} lessons</span>
                        <span>{course._count.enrollments} students</span>
                        <span>₦{Number(course.price).toLocaleString()}</span>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/courses/${course.id}`}
                          className="text-sm text-primary hover:underline"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/admin/courses/${course.id}/analytics`}
                          className="text-sm text-muted-foreground hover:underline"
                        >
                          Analytics
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <div className="mt-6">
          <Link href="/admin" className="text-muted-foreground hover:underline text-sm">
            ← Back to Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

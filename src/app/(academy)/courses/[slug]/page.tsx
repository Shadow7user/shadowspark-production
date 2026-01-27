import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CourseProgress } from "@/components/course-progress";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        include: { lessons: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) notFound();

  const enrollment = session?.user?.email
    ? await prisma.enrollment.findFirst({
        where: {
          course: { slug },
          user: { email: session.user.email },
        },
      })
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="inline-block px-3 py-1 bg-muted rounded-full text-sm font-medium mb-4">
            {course.category}
          </div>
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-lg text-muted-foreground">{course.description}</p>
        </div>

        {/* Course Info Card */}
        <div className="mb-8 p-6 bg-card rounded-lg border sticky top-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Course Price</p>
              <p className="text-3xl font-bold">₦{course.price.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {course.modules.length} modules • {course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0)} lessons
              </p>
            </div>
            <div>
              {enrollment ? (
                <>
                  <p className="text-sm text-muted-foreground text-right mb-2">
                    Your Progress
                  </p>
                  <div className="mb-4">
                    <CourseProgress progress={enrollment.progress} completed={enrollment.completed} />
                  </div>
                  <Button className="w-full" asChild>
                    <a href={`/courses/${slug}/learn`}>Continue Learning</a>
                  </Button>
                </>
              ) : (
                <Button className="w-full" size="lg">
                  Enroll Now
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Curriculum */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Curriculum</h2>
          <div className="space-y-4">
            {course.modules.map((mod, idx) => (
              <div key={mod.id} className="border rounded-lg overflow-hidden hover:border-primary transition">
                <div className="p-4 bg-muted">
                  <h3 className="font-semibold">
                    Module {idx + 1}: {mod.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {mod.lessons.length} lessons
                  </p>
                </div>
                <div className="p-4 space-y-2">
                  {mod.lessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center gap-3 p-2 hover:bg-muted rounded transition">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{lesson.title}</p>
                        {lesson.duration && (
                          <p className="text-xs text-muted-foreground">
                            {lesson.duration} min
                          </p>
                        )}
                      </div>
                      {lesson.isFree && (
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          Preview
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        {!enrollment && (
          <div className="mt-12 p-6 bg-primary/5 rounded-lg border border-primary/20">
            <h3 className="text-lg font-semibold mb-2">Ready to get started?</h3>
            <p className="text-muted-foreground mb-4">
              Enroll now to access all {course.modules.length} modules and {course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0)} lessons
            </p>
            <Button size="lg">Enroll Now for ₦{course.price.toLocaleString()}</Button>
          </div>
        )}
      </div>
    </div>
  );
}

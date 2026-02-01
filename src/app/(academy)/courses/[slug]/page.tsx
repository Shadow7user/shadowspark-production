import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CourseProgress } from "@/components/course-progress";
import {
  RecommendedSection,
  RecommendedSectionSkeleton,
} from "@/components/course/recommended-section";

// Sample testimonials - in production, fetch from DB
const testimonials = [
  {
    id: "1",
    name: "Adaeze Okonkwo",
    title: "Data Analyst",
    company: "GTBank",
    testimonial:
      "This course transformed my career. I went from zero AI knowledge to automating reports for my team in Lagos. The Nigerian examples made everything relatable!",
    location: "Lagos",
  },
  {
    id: "2",
    name: "Emeka Nwosu",
    title: "Software Developer",
    company: "Andela",
    testimonial:
      "Finally, an AI course that understands our context. The Paystack integration examples and local datasets made learning practical and immediately applicable.",
    location: "Abuja",
  },
  {
    id: "3",
    name: "Fatima Ibrahim",
    title: "Product Manager",
    company: "Flutterwave",
    testimonial:
      "I completed this while commuting on 3G in Lagos traffic. The offline mode was a lifesaver. Now I use AI tools daily in my product work.",
    location: "Lagos",
  },
];

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
      {/* Hero Section - Build Trust */}
      <section className="py-12 bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border-b border-cyan-500/20">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="inline-block px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-sm font-medium text-cyan-400 mb-4">
            {course.category.replace(/_/g, " ")}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {course.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            {course.description}
          </p>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold text-lg">
                {course.studentCount}+
              </span>
              <span className="text-muted-foreground">Nigerian Students</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold text-lg">4.8★</span>
              <span className="text-muted-foreground">Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400 font-bold text-lg">
                {course.modules.length}
              </span>
              <span className="text-muted-foreground">Modules</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400 font-bold text-lg">
                {course.modules.reduce(
                  (sum, mod) => sum + mod.lessons.length,
                  0,
                )}
              </span>
              <span className="text-muted-foreground">Lessons</span>
            </div>
          </div>

          {/* CTA */}
          {enrollment ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-48">
                <CourseProgress
                  progress={Number(enrollment.progressPercentage ?? 0)}
                  completed={enrollment.completed}
                />
              </div>
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30"
              >
                <a href={`/courses/${slug}/learn`}>Continue Learning →</a>
              </Button>
            </div>
          ) : (
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-4 font-bold hover:scale-105 transition-transform shadow-lg shadow-cyan-500/50"
            >
              Enroll Now – ₦{course.price.toLocaleString()}
            </Button>
          )}
        </div>
      </section>

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Curriculum */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Curriculum</h2>
          <div className="space-y-4">
            {course.modules.map((mod, idx) => (
              <div
                key={mod.id}
                className="border rounded-lg overflow-hidden hover:border-primary transition"
              >
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
                    <div
                      key={lesson.id}
                      className="flex items-center gap-3 p-2 hover:bg-muted rounded transition"
                    >
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
          <div className="mt-12 p-6 bg-gradient-to-r from-purple-900/20 to-cyan-900/20 rounded-lg border border-cyan-500/20">
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              Ready to get started?
            </h3>
            <p className="text-muted-foreground mb-4">
              Enroll now to access all {course.modules.length} modules and{" "}
              {course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0)}{" "}
              lessons
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-105 transition-transform shadow-lg shadow-cyan-500/50"
            >
              Enroll Now for ₦{course.price.toLocaleString()}
            </Button>
          </div>
        )}

        {/* Success Stories / Testimonials */}
        <section className="mt-12 pt-12 border-t border-cyan-500/20">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            🇳🇬 Student Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.slice(0, 4).map((story) => (
              <div
                key={story.id}
                className="p-4 bg-card border border-border rounded-lg hover:border-cyan-500/30 transition"
              >
                <p className="text-muted-foreground italic mb-3">
                  &quot;{story.testimonial}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-cyan-400 font-bold text-sm">
                      {story.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {story.title} at {story.company} • {story.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI-Personalized Recommendations (Server Component with Suspense) */}
        <Suspense fallback={<RecommendedSectionSkeleton />}>
          <RecommendedSection excludeCourseId={course.id} limit={3} />
        </Suspense>
      </div>
    </div>
  );
}

import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { Clock, Users, Star, CheckCircle, PlayCircle } from "lucide-react";
import { CourseProgress } from "@/components/course-progress";
import {
  RecommendedSection,
  RecommendedSectionSkeleton,
} from "@/components/course/recommended-section";

const testimonials = [
  {
    id: "1",
    name: "Adaeze Okonkwo",
    title: "Data Analyst",
    company: "GTBank",
    testimonial: "This course transformed my career. I went from zero AI knowledge to automating reports for my team in Lagos.",
    location: "Lagos",
  },
  {
    id: "2",
    name: "Emeka Nwosu",
    title: "Software Developer",
    company: "Andela",
    testimonial: "Finally, an AI course that understands our context. The Paystack integration examples made learning practical.",
    location: "Abuja",
  },
  {
    id: "3",
    name: "Fatima Ibrahim",
    title: "Product Manager",
    company: "Flutterwave",
    testimonial: "I completed this while commuting on 3G in Lagos traffic. The offline mode was a lifesaver.",
    location: "Lagos",
  },
];

const learningOutcomes = [
  "Build AI chatbots that handle customer inquiries 24/7",
  "Integrate with WhatsApp Business API and Instagram",
  "Train AI models on custom business data",
  "Automate repetitive workflows and save 20+ hours/week",
  "Deploy production-ready AI solutions in 2 weeks",
  "Optimize chatbot performance and track analytics",
];

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) return { title: "Course Not Found" };
  return {
    title: `${course.title} | ShadowSpark Academy`,
    description: course.description,
  };
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: { include: { lessons: true }, orderBy: { order: "asc" } },
      _count: { select: { enrollments: true } },
    },
  });

  if (!course) notFound();

  const enrollment = session?.user?.email
    ? await prisma.enrollment.findFirst({
        where: { course: { slug }, user: { email: session.user.email } },
      })
    : null;

  const totalLessons = course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);
  const totalDuration = course.modules.reduce(
    (sum, mod) => sum + mod.lessons.reduce((s, l) => s + (l.duration || 0), 0), 0
  );

  const firstModule = course.modules[0];
  const firstLesson = firstModule?.lessons[0];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-cyan-900/20" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span className="px-3 py-1 border border-border rounded-full">{course.level}</span>
                <span>&#8226;</span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {course._count.enrollments || course.studentCount || 0} students
                </span>
                <span>&#8226;</span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  4.8 (120 reviews)
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{course.description}</p>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-cyan-400" />
                  <span>{totalLessons} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-400" />
                  <span>{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</span>
                </div>
              </div>
              {enrollment && (
                <div className="mt-6 md:hidden">
                  <CourseProgress progress={Number(enrollment.progressPercentage ?? 0)} completed={enrollment.completed} />
                </div>
              )}
            </div>
            <div className="md:col-span-1">
              <div className="sticky top-20 p-6 border border-border rounded-2xl bg-card/80 backdrop-blur">
                <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-cyan-900/20 rounded-xl flex items-center justify-center mb-6">
                  <PlayCircle className="h-16 w-16 text-cyan-400" />
                </div>
                <div className="text-3xl font-bold mb-1">&#8358;{course.price.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground mb-6">One-time payment &#8226; Lifetime access</div>
                {enrollment ? (
                  <>
                    <div className="mb-4 hidden md:block">
                      <CourseProgress progress={Number(enrollment.progressPercentage ?? 0)} completed={enrollment.completed} />
                    </div>
                    <Link
                      href={firstModule && firstLesson ? `/courses/${slug}/modules/${firstModule.id}/lessons/${firstLesson.id}` : `/courses/${slug}/learn`}
                      className="block w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-center rounded-xl font-semibold hover:scale-105 transition-transform"
                    >
                      Continue Learning
                    </Link>
                  </>
                ) : session?.user ? (
                  <form action={`/api/checkout/${course.id}`} method="POST">
                    <button type="submit" className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform">
                      Enroll Now
                    </button>
                  </form>
                ) : (
                  <Link href={`/login?redirect=/courses/${slug}`} className="block w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-center rounded-xl font-semibold hover:scale-105 transition-transform">
                    Login to Enroll
                  </Link>
                )}
                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-cyan-400" /><span>Lifetime access</span></div>
                  <div className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-cyan-400" /><span>Certificate of completion</span></div>
                  <div className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-cyan-400" /><span>7-day money-back guarantee</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">What You&apos;ll Learn</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {learningOutcomes.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-cyan-400 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">Course Curriculum</h2>
          <div className="space-y-4">
            {course.modules.map((module, modIndex) => (
              <div key={module.id} className="p-6 border border-border rounded-2xl bg-card/50 backdrop-blur">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Module {modIndex + 1}: {module.title}</h3>
                    <p className="text-sm text-muted-foreground">{module.lessons.length} lessons &#8226; {module.lessons.reduce((sum, l) => sum + (l.duration || 0), 0)} min</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div key={lesson.id} className="flex items-center justify-between py-3 border-t border-border first:border-t-0">
                      <div className="flex items-center gap-3">
                        <PlayCircle className="h-4 w-4 text-cyan-400" />
                        <span className="text-sm">{lessonIndex + 1}. {lesson.title}</span>
                        {lesson.isFree && <span className="text-xs px-2 py-0.5 border border-cyan-500/30 rounded-full text-cyan-400">Preview</span>}
                      </div>
                      <span className="text-xs text-muted-foreground">{lesson.duration || 10} min</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">&#127475;&#127468; Student Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((story) => (
              <div key={story.id} className="p-6 bg-card border border-border rounded-2xl hover:border-cyan-500/30 transition">
                <p className="text-muted-foreground italic mb-4">&quot;{story.testimonial}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-cyan-400 font-bold text-sm">{story.name}</p>
                    <p className="text-muted-foreground text-xs">{story.title} at {story.company} &#8226; {story.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!enrollment && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Enroll now to access all {course.modules.length} modules and {totalLessons} lessons. Start building AI-powered solutions today.
            </p>
            {session?.user ? (
              <form action={`/api/checkout/${course.id}`} method="POST" className="inline-block">
                <button type="submit" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform">
                  Enroll Now &#8211; &#8358;{course.price.toLocaleString()}
                </button>
              </form>
            ) : (
              <Link href={`/login?redirect=/courses/${slug}`} className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform">
                Login to Enroll &#8211; &#8358;{course.price.toLocaleString()}
              </Link>
            )}
          </div>
        </section>
      )}

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Suspense fallback={<RecommendedSectionSkeleton />}>
            <RecommendedSection excludeCourseId={course.id} limit={3} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}


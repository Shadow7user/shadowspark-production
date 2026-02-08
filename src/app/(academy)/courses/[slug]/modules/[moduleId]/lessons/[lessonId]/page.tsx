
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { LessonVideoPlayer } from "@/components/course/lesson-video-player";

export const dynamic = "force-dynamic";

interface LessonPageProps {
  params: Promise<{
    slug: string;
    moduleId: string;
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const session = await auth();

  // Await params in Next 15+
  const { slug, moduleId, lessonId } = await params;

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch Lesson + Enrollment
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { include: { course: true } } },
  });

  if (!lesson) {
    notFound();
  }

  // Verify enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: slug,
      },
    },
  });

  if (!enrollment) {
    // Redirect to course page with alert? Or generic 403
    redirect(`/courses/${slug}`);
  }

  // Extract progress: Json type needs cast
  const currentModuleProgress =
    (enrollment.moduleProgress as Record<string, any>) || {};
  const currentLessonProgress =
    currentModuleProgress[moduleId]?.[lessonId] ?? 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          asChild
          className="pl-0 hover:pl-2 transition-all"
        >
          <Link href={`/courses/${slug}`}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Course
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
            {lesson.title}
          </h1>

          {lesson.videoUrl ? (
            <LessonVideoPlayer
              videoUrl={lesson.videoUrl}
              initialProgress={Number(currentLessonProgress)}
              courseId={slug}
              moduleId={moduleId}
              lessonId={lessonId}
            />
          ) : (
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center border border-gray-800">
              <p className="text-gray-500">No video content available</p>
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            <h3 className="text-xl font-bold text-gray-200">
              About this lesson
            </h3>
            <p className="text-gray-400">
              {lesson.description || "No description provided."}
            </p>
            {lesson.content && (
              <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                {lesson.content}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Sidebar? Resource list? Next lesson? */}
          <div className="bg-gray-900/50 p-6 rounded-xl border border-cyan-900/30">
            <h3 className="font-bold text-lg mb-4 text-cyan-100">
              Lesson Resources
            </h3>
            {/* Placeholder for resources */}
            <p className="text-sm text-gray-500 italic">
              No resources attached to this lesson.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

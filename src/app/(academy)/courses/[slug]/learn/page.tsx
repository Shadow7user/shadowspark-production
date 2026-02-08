
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { LearnContent } from "./learn-content";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lesson?: string }>;
}

export default async function LearnPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { lesson: lessonId } = await searchParams;
  const session = await auth();

  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) redirect("/login");

  const enrollment = await prisma.enrollment.findFirst({
    where: { course: { slug }, user: { email: session.user.email } },
    include: {
      course: {
        include: {
          modules: { include: { lessons: true }, orderBy: { order: "asc" } },
        },
      },
    },
  });

  if (!enrollment) redirect(`/courses/${slug}`);

  const allLessons = enrollment.course.modules.flatMap((m) => m.lessons);
  const currentLesson = lessonId
    ? allLessons.find((l) => l.id === lessonId)
    : allLessons[0];

  if (!currentLesson) notFound();

  // Fetch completion status for all lessons
  const completions = await prisma.lessonCompletion.findMany({
    where: {
      userId: user.id,
      lesson: { module: { courseId: enrollment.courseId } },
    },
    select: { lessonId: true },
  });

  const completedLessonIds = new Set(
    completions.map((c: { lessonId: string }) => c.lessonId)
  );

  return (
    <LearnContent
      slug={slug}
      enrollment={enrollment}
      currentLesson={currentLesson}
      allLessons={allLessons}
      completedLessonIds={Array.from(completedLessonIds)}
      userEmail={session.user.email}
      userName={user.name || undefined}
      courseTitle={enrollment.course.title}
      enrollmentId={enrollment.id}
    />
  );
}

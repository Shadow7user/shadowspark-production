import { Button } from '@/components/ui/button'
import { QuizPlayer } from '@/components/quiz/quiz-player'
import { auth } from '@/lib/auth'
import { getQuizForLesson } from '@/lib/actions/quizzes'
import { prisma } from '@/lib/prisma'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function QuizPage({
  params,
}: {
  params: Promise<{
    slug: string
    moduleId: string
    lessonId: string
  }>
}) {
  const session = await auth()
  const { slug, moduleId, lessonId } = await params

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Verify enrollment
  const course = await prisma.course.findUnique({
    where: { slug },
  })

  if (!course) {
    redirect('/courses')
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: course.id,
      },
    },
  })

  if (!enrollment) {
    redirect(`/courses/${slug}`)
  }

  // Get quiz
  const quiz = await getQuizForLesson(lessonId)

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            asChild
            className="pl-0 hover:pl-2 transition-all"
          >
            <Link href={`/courses/${slug}/modules/${moduleId}/lessons/${lessonId}`}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Lesson
            </Link>
          </Button>
        </div>

        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-300 mb-4">
            No Quiz Available
          </h1>
          <p className="text-gray-500 mb-6">
            This lesson doesn't have a quiz yet.
          </p>
          <Button asChild variant="outline">
            <Link href={`/courses/${slug}/modules/${moduleId}/lessons/${lessonId}`}>
              Back to Lesson
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          asChild
          className="pl-0 hover:pl-2 transition-all"
        >
          <Link href={`/courses/${slug}/modules/${moduleId}/lessons/${lessonId}`}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Lesson
          </Link>
        </Button>
      </div>

      <QuizPlayer quiz={quiz as any} />
    </div>
  )
}

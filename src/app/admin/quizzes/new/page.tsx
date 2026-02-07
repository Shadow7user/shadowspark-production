import { QuizForm } from '@/components/quiz/quiz-form'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function NewQuizPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  // Get all lessons without quizzes
  const lessons = await prisma.lesson.findMany({
    where: {
      quiz: null,
    },
    include: {
      module: {
        include: {
          course: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedLessons = lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    moduleName: lesson.module.title,
    courseName: lesson.module.course.title,
  }))

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
          Create New Quiz
        </h1>
        <p className="text-gray-400">
          Add a quiz to assess student understanding
        </p>
      </div>

      {formattedLessons.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">
            All lessons already have quizzes. Create a new lesson first.
          </p>
        </div>
      ) : (
        <QuizForm lessons={formattedLessons} />
      )}
    </div>
  )
}

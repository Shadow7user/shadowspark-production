import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function AdminQuizzesPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  // Get all quizzes with lesson info
  const quizzes = await prisma.quiz.findMany({
    include: {
      lesson: {
        include: {
          module: {
            include: {
              course: true,
            },
          },
        },
      },
      _count: {
        select: {
          questions: true,
          attempts: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
            Quiz Management
          </h1>
          <p className="text-gray-400">Create and manage course quizzes</p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
        >
          <Link href="/admin/quizzes/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Quiz
          </Link>
        </Button>
      </div>

      {quizzes.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-400 mb-4">No quizzes created yet.</p>
            <Button asChild variant="outline">
              <Link href="/admin/quizzes/new">Create Your First Quiz</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{quiz.title}</CardTitle>
                    <p className="text-sm text-gray-400 mt-1">
                      {quiz.lesson.module.course.title} → {quiz.lesson.module.title} →{' '}
                      {quiz.lesson.title}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/quizzes/${quiz.id}/edit`}>Edit</Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-3 bg-gray-900/50 rounded-lg border border-cyan-900/30">
                    <p className="text-xs text-gray-400">Questions</p>
                    <p className="text-xl font-bold text-cyan-400">
                      {quiz._count.questions}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-900/50 rounded-lg border border-purple-900/30">
                    <p className="text-xs text-gray-400">Passing Score</p>
                    <p className="text-xl font-bold text-purple-400">
                      {quiz.passingScore}%
                    </p>
                  </div>
                  <div className="p-3 bg-gray-900/50 rounded-lg border border-green-900/30">
                    <p className="text-xs text-gray-400">Time Limit</p>
                    <p className="text-xl font-bold text-green-400">
                      {quiz.timeLimit ? `${quiz.timeLimit}m` : 'None'}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-900/50 rounded-lg border border-blue-900/30">
                    <p className="text-xs text-gray-400">Attempts</p>
                    <p className="text-xl font-bold text-blue-400">
                      {quiz._count.attempts}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

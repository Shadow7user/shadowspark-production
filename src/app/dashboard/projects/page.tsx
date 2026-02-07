import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getProjects } from '@/lib/actions/projects'
import { KanbanBoard } from '@/components/projects/kanban-board'
import { prisma } from '@/lib/prisma'

export default async function ProjectsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Get user role
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  const isAdmin = user?.role === 'ADMIN'

  const result = await getProjects()

  if (!result.success || !result.projects) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Failed to load projects: {result.error || 'Unknown error'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-gray-600 mt-2">
          Manage your projects with our Kanban board
          {isAdmin ? ' (drag to reorder)' : ''}
        </p>
      </div>

      <KanbanBoard initialProjects={result.projects} isAdmin={isAdmin} />
    </div>
  )
}

import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getProject } from '@/lib/actions/projects'
import { prisma } from '@/lib/prisma'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MilestoneTracker } from '@/components/projects/milestone-tracker'
import { FileUploader } from '@/components/projects/file-uploader'
import { CommentThread } from '@/components/projects/comment-thread'
import { format } from 'date-fns'
import { Calendar, DollarSign, User } from 'lucide-react'

interface Props {
  params: Promise<{ projectId: string }>
}

const statusColors = {
  PLANNING: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  REVIEW: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  ON_HOLD: 'bg-orange-100 text-orange-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

const priorityColors = {
  LOW: 'bg-blue-100 text-blue-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  URGENT: 'bg-red-100 text-red-800',
}

export default async function ProjectDetailPage({ params }: Props) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const { projectId } = await params

  // Get user role
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  const isAdmin = user?.role === 'ADMIN'

  const result = await getProject(projectId)

  if (!result.success || !result.project) {
    if (result.error === 'Project not found') {
      notFound()
    }
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Failed to load project: {result.error || 'Unknown error'}
          </p>
        </div>
      </div>
    )
  }

  const { project } = result

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <Badge
            className={`${statusColors[project.status as keyof typeof statusColors]}`}
            variant="secondary"
          >
            {project.status.replace('_', ' ')}
          </Badge>
          <Badge
            className={`${priorityColors[project.priority as keyof typeof priorityColors]}`}
            variant="secondary"
          >
            {project.priority}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <User className="h-4 w-4" />
            <span>
              Client: {project.client.name || project.client.email}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span>
              Budget: {project.currency} {project.budget.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {project.startDate
                ? `${format(new Date(project.startDate), 'MMM dd, yyyy')} - ${project.endDate ? format(new Date(project.endDate), 'MMM dd, yyyy') : 'Ongoing'}`
                : 'No dates set'}
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones">
            Milestones ({project.milestones?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="files">
            Files ({project.files?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="communication">
            Communication ({project.comments?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {project.activities && project.activities.length > 0 ? (
                project.activities.slice(0, 10).map((activity: any) => (
                  <div key={activity.id} className="flex items-start gap-3 text-sm">
                    <div className="flex-shrink-0 w-2 h-2 mt-1.5 rounded-full bg-blue-500" />
                    <div className="flex-1">
                      <p className="text-gray-700">
                        <span className="font-medium">
                          {activity.user.name || activity.user.email}
                        </span>{' '}
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {format(new Date(activity.createdAt), 'MMM dd, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No activity yet</p>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="milestones">
          <Card className="p-6">
            <MilestoneTracker
              milestones={project.milestones || []}
              isAdmin={isAdmin}
            />
          </Card>
        </TabsContent>

        <TabsContent value="files">
          <Card className="p-6">
            <FileUploader
              projectId={projectId}
              files={project.files || []}
              currentUserId={session.user.id}
              isAdmin={isAdmin}
            />
          </Card>
        </TabsContent>

        <TabsContent value="communication">
          <Card className="p-6">
            <CommentThread
              projectId={projectId}
              comments={project.comments || []}
              currentUserId={session.user.id}
              currentUserRole={user?.role || 'STUDENT'}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { FileText, MessageSquare } from 'lucide-react'

interface ProjectCardProps {
  project: {
    id: string
    name: string
    priority: string
    client: {
      id: string
      name: string | null
      email: string
      image: string | null
    }
    milestones: Array<{
      completed: boolean
    }>
    _count: {
      files: number
      comments: number
    }
  }
}

const priorityColors = {
  LOW: 'bg-blue-100 text-blue-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  URGENT: 'bg-red-100 text-red-800',
}

export function ProjectCard({ project }: ProjectCardProps) {
  const completedMilestones = project.milestones.filter((m) => m.completed).length
  const totalMilestones = project.milestones.length
  const progressPercentage =
    totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0

  return (
    <Link href={`/dashboard/projects/${project.id}`}>
      <Card className="cursor-pointer p-4 hover:shadow-lg transition-shadow">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-sm line-clamp-2">{project.name}</h3>
            <Badge
              className={`ml-2 ${priorityColors[project.priority as keyof typeof priorityColors]}`}
              variant="secondary"
            >
              {project.priority}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              {project.client.image ? (
                <img
                  src={project.client.image}
                  alt={project.client.name || project.client.email}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xs">
                  {(project.client.name || project.client.email)[0].toUpperCase()}
                </div>
              )}
            </Avatar>
            <span className="text-xs text-gray-600">
              {project.client.name || project.client.email}
            </span>
          </div>

          {totalMilestones > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Milestones</span>
                <span>
                  {completedMilestones}/{totalMilestones}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-1.5" />
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              <span>{project._count.files}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{project._count.comments}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

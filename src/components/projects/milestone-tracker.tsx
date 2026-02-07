'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { toggleMilestone } from '@/lib/actions/projects'
import { format, isPast } from 'date-fns'

interface Milestone {
  id: string
  title: string
  description: string
  dueDate: Date
  completed: boolean
  completedAt: Date | null
  order: number
}

interface MilestoneTrackerProps {
  milestones: Milestone[]
  isAdmin: boolean
}

export function MilestoneTracker({ milestones, isAdmin }: MilestoneTrackerProps) {
  const [localMilestones, setLocalMilestones] = useState(milestones)
  const [toggling, setToggling] = useState<string | null>(null)

  const completedCount = localMilestones.filter((m) => m.completed).length
  const progressPercentage =
    localMilestones.length > 0 ? (completedCount / localMilestones.length) * 100 : 0

  const handleToggle = async (milestoneId: string, currentCompleted: boolean) => {
    if (!isAdmin) return

    setToggling(milestoneId)

    // Store original milestone for revert
    const originalMilestone = localMilestones.find((m) => m.id === milestoneId)
    if (!originalMilestone) return

    // Optimistic update
    setLocalMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              completed: !currentCompleted,
              completedAt: !currentCompleted ? new Date() : null,
            }
          : m
      )
    )

    try {
      const result = await toggleMilestone({
        milestoneId,
        completed: !currentCompleted,
      })

      if (!result.success) {
        // Revert on error with original data
        setLocalMilestones((prev) =>
          prev.map((m) =>
            m.id === milestoneId
              ? {
                  ...m,
                  completed: originalMilestone.completed,
                  completedAt: originalMilestone.completedAt,
                }
              : m
          )
        )
        console.error(result.error || 'Failed to update milestone')
      }
    } catch (error) {
      // Revert on error with original data
      setLocalMilestones((prev) =>
        prev.map((m) =>
          m.id === milestoneId
            ? {
                ...m,
                completed: originalMilestone.completed,
                completedAt: originalMilestone.completedAt,
              }
            : m
        )
      )
      console.error('Failed to update milestone', error)
    } finally {
      setToggling(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Overall Progress</h3>
          <span className="text-sm text-gray-600">
            {completedCount} / {localMilestones.length} completed
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <div className="space-y-3">
        {localMilestones.map((milestone) => {
          const isOverdue = !milestone.completed && isPast(new Date(milestone.dueDate))
          const isToggling = toggling === milestone.id

          return (
            <div
              key={milestone.id}
              className={`border rounded-lg p-4 transition-all ${
                milestone.completed
                  ? 'bg-green-50 border-green-200'
                  : isOverdue
                    ? 'bg-red-50 border-red-200'
                    : 'bg-white border-gray-200'
              } ${isAdmin ? 'cursor-pointer hover:shadow-md' : ''} ${isToggling ? 'opacity-50' : ''}`}
              onClick={() =>
                isAdmin && !isToggling && handleToggle(milestone.id, milestone.completed)
              }
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {milestone.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <h4
                      className={`font-medium ${milestone.completed ? 'line-through text-gray-500' : ''}`}
                    >
                      {milestone.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs">
                      {isOverdue && !milestone.completed && (
                        <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                      )}
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      <span
                        className={`${isOverdue && !milestone.completed ? 'text-red-600 font-medium' : 'text-gray-600'}`}
                      >
                        {format(new Date(milestone.dueDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                  <p
                    className={`text-sm ${milestone.completed ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {milestone.description}
                  </p>
                  {milestone.completed && milestone.completedAt && (
                    <p className="text-xs text-green-600">
                      Completed on {format(new Date(milestone.completedAt), 'MMM dd, yyyy')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {localMilestones.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No milestones defined for this project.
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { ProjectCard } from './project-card'
import { reorderKanban } from '@/lib/actions/projects'

interface Project {
  id: string
  name: string
  status: string
  priority: string
  kanbanOrder: number
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

interface KanbanBoardProps {
  initialProjects: Project[]
  isAdmin: boolean
}

const columns = [
  { id: 'PLANNING', title: 'Planning' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'REVIEW', title: 'Review' },
  { id: 'COMPLETED', title: 'Completed' },
]

export function KanbanBoard({ initialProjects, isAdmin }: KanbanBoardProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setProjects(initialProjects)
  }, [initialProjects])

  const organizeProjects = (projectsList: Project[]) => {
    const organized: Record<string, Project[]> = {
      PLANNING: [],
      IN_PROGRESS: [],
      REVIEW: [],
      COMPLETED: [],
    }

    projectsList.forEach((project) => {
      if (organized[project.status]) {
        organized[project.status].push(project)
      }
    })

    // Sort each column by kanbanOrder
    Object.keys(organized).forEach((status) => {
      organized[status].sort((a, b) => a.kanbanOrder - b.kanbanOrder)
    })

    return organized
  }

  const onDragEnd = async (result: DropResult) => {
    if (!isAdmin) return

    const { source, destination, draggableId } = result

    // Dropped outside the list
    if (!destination) return

    // Dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    const projectId = draggableId
    const newStatus = destination.droppableId
    const organized = organizeProjects(projects)

    // Create new arrays for source and destination columns
    const sourceColumn = [...organized[source.droppableId]]
    const destColumn =
      source.droppableId === destination.droppableId
        ? sourceColumn
        : [...organized[destination.droppableId]]

    // Remove from source
    const [movedProject] = sourceColumn.splice(source.index, 1)

    // Add to destination
    destColumn.splice(destination.index, 0, {
      ...movedProject,
      status: newStatus,
    })

    // Update kanbanOrder for affected projects
    const updates: Array<{
      projectId: string
      status: string
      kanbanOrder: number
    }> = []

    // Update source column orders
    sourceColumn.forEach((project, index) => {
      if (project.kanbanOrder !== index) {
        updates.push({
          projectId: project.id,
          status: project.status,
          kanbanOrder: index,
        })
      }
    })

    // Update destination column orders (if different from source)
    if (source.droppableId !== destination.droppableId) {
      destColumn.forEach((project, index) => {
        if (project.id === projectId || project.kanbanOrder !== index) {
          updates.push({
            projectId: project.id,
            status: newStatus,
            kanbanOrder: index,
          })
        }
      })
    }

    // Optimistically update UI
    const updatedProjects = projects.map((p) => {
      const update = updates.find((u) => u.projectId === p.id)
      if (update) {
        return {
          ...p,
          status: update.status,
          kanbanOrder: update.kanbanOrder,
        }
      }
      return p
    })

    setProjects(updatedProjects)

    // Save to server
    setIsSaving(true)
    try {
      const result = await reorderKanban(updates)
      if (!result.success) {
        // Revert on error
        setProjects(projects)
        console.error(result.error || 'Failed to update project status')
      }
    } catch (error) {
      // Revert on error
      setProjects(projects)
      console.error('Failed to update project status', error)
    } finally {
      setIsSaving(false)
    }
  }

  const organized = organizeProjects(projects)

  return (
    <div className="relative">
      {isSaving && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
            Saving...
          </div>
        </div>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((column) => (
            <div key={column.id} className="space-y-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-lg">{column.title}</h2>
                <span className="text-sm text-gray-500">
                  {organized[column.id].length}
                </span>
              </div>
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] space-y-2 p-2 rounded-lg transition-colors ${
                      snapshot.isDraggingOver
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    {organized[column.id].map((project, index) => (
                      <Draggable
                        key={project.id}
                        draggableId={project.id}
                        index={index}
                        isDragDisabled={!isAdmin}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={snapshot.isDragging ? 'opacity-50' : ''}
                          >
                            <ProjectCard project={project} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}

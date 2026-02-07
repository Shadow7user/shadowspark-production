"use client";

import { reorderKanban } from "@/lib/actions/projects";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { ProjectCard } from "./project-card";

type ProjectWithRelations = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  priority: string;
  kanbanOrder: number;
  client: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  milestones: Array<{ id: string; title: string; completedAt: Date | null }>;
  _count: { files: number; comments: number };
  updatedAt: Date;
};

const COLUMNS = [
  { id: "PLANNING", title: "Planning", color: "border-blue-500/50" },
  { id: "IN_PROGRESS", title: "In Progress", color: "border-yellow-500/50" },
  { id: "REVIEW", title: "In Review", color: "border-purple-500/50" },
  { id: "COMPLETED", title: "Completed", color: "border-green-500/50" },
] as const;

interface KanbanBoardProps {
  projects: ProjectWithRelations[];
  isAdmin: boolean;
}

export function KanbanBoard({ projects, isAdmin }: KanbanBoardProps) {
  const [items, setItems] = useState(projects);
  const [isPending, startTransition] = useTransition();

  const getColumnProjects = (status: string) =>
    items
      .filter((p) => p.status === status)
      .sort((a, b) => a.kanbanOrder - b.kanbanOrder);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !isAdmin) return;

    const { source, destination, draggableId } = result;
    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    // Clone items
    const updated = items.map((p) => {
      if (p.id === draggableId) {
        return { ...p, status: destStatus, kanbanOrder: destination.index };
      }
      return p;
    });

    // Recalculate orders within destination column
    const destItems = updated
      .filter((p) => p.status === destStatus && p.id !== draggableId)
      .sort((a, b) => a.kanbanOrder - b.kanbanOrder);

    // Insert dragged item at destination index
    const draggedItem = updated.find((p) => p.id === draggableId);
    if (!draggedItem) return;
    destItems.splice(destination.index, 0, draggedItem);

    // Update kanbanOrder for all items in destination column
    const reordered = destItems.map((p, i) => ({ ...p, kanbanOrder: i }));

    // Merge back
    const finalItems = updated.map((p) => {
      const found = reordered.find((r) => r.id === p.id);
      return found ?? p;
    });

    setItems(finalItems);

    // Persist to server
    startTransition(async () => {
      const updates = reordered.map((p) => ({
        projectId: p.id,
        status: p.status,
        kanbanOrder: p.kanbanOrder,
      }));

      // Also include source column reorder if different
      if (sourceStatus !== destStatus) {
        const sourceItems = finalItems
          .filter((p) => p.status === sourceStatus)
          .sort((a, b) => a.kanbanOrder - b.kanbanOrder)
          .map((p, i) => ({
            projectId: p.id,
            status: p.status,
            kanbanOrder: i,
          }));
        updates.push(...sourceItems);
      }

      await reorderKanban(updates);
    });
  };

  return (
    <div className="relative">
      {isPending && (
        <div className="absolute top-2 right-2 z-10">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {COLUMNS.map((column) => {
            const columnProjects = getColumnProjects(column.id);
            return (
              <div
                key={column.id}
                className={`border-t-2 ${column.color} rounded-lg bg-card`}
              >
                <div className="flex items-center justify-between px-3 py-2">
                  <h3 className="text-sm font-semibold">{column.title}</h3>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {columnProjects.length}
                  </span>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[200px] space-y-2 p-2 rounded-b-lg transition-colors
                        ${snapshot.isDraggingOver ? "bg-muted/50" : ""}`}
                    >
                      {columnProjects.map((project, index) => (
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
                            >
                              <ProjectCard
                                project={project}
                                isDragging={snapshot.isDragging}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}

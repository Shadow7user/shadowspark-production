"use client";

import { toggleMilestone } from "@/lib/actions/projects";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useTransition } from "react";

interface Milestone {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  completedAt: Date | null;
  order: number;
}

interface MilestoneTrackerProps {
  milestones: Milestone[];
  isAdmin: boolean;
}

export function MilestoneTracker({
  milestones,
  isAdmin,
}: MilestoneTrackerProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (milestoneId: string, currentlyCompleted: boolean) => {
    if (!isAdmin) return;
    startTransition(async () => {
      await toggleMilestone({ milestoneId, completed: !currentlyCompleted });
    });
  };

  const completed = milestones.filter((m) => m.completedAt).length;
  const progress =
    milestones.length > 0 ? (completed / milestones.length) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-mono text-muted-foreground">
          {completed}/{milestones.length}
        </span>
      </div>

      <div className="space-y-1">
        {milestones.map((milestone) => {
          const isCompleted = !!milestone.completedAt;
          const isOverdue =
            !isCompleted &&
            milestone.dueDate &&
            new Date(milestone.dueDate) < new Date();

          return (
            <div
              key={milestone.id}
              className={`flex items-start gap-3 p-3 rounded-lg transition-colors
                ${isAdmin ? "cursor-pointer hover:bg-muted/50" : ""}
                ${isCompleted ? "opacity-60" : ""}`}
              onClick={() => handleToggle(milestone.id, isCompleted)}
            >
              <div className="shrink-0 mt-0.5">
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                ) : isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                ) : (
                  <Circle
                    className={`h-5 w-5 ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${isCompleted ? "line-through" : ""}`}
                >
                  {milestone.title}
                </p>
                {milestone.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {milestone.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  {milestone.dueDate && (
                    <span
                      className={`text-xs ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      Due{" "}
                      {formatDistanceToNow(new Date(milestone.dueDate), {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                  {milestone.completedAt && (
                    <span className="text-xs text-green-400">
                      Completed{" "}
                      {formatDistanceToNow(new Date(milestone.completedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

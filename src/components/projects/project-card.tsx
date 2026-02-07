import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Paperclip } from "lucide-react";
import Link from "next/link";

const priorityColors: Record<string, string> = {
  LOW: "bg-slate-500/20 text-slate-400",
  MEDIUM: "bg-blue-500/20 text-blue-400",
  HIGH: "bg-orange-500/20 text-orange-400",
  URGENT: "bg-red-500/20 text-red-400",
};

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    priority: string;
    client: { name: string | null; image: string | null };
    milestones: Array<{ completedAt: Date | null }>;
    _count: { files: number; comments: number };
    updatedAt: Date;
  };
  isDragging?: boolean;
}

export function ProjectCard({ project, isDragging }: ProjectCardProps) {
  const completedMilestones = project.milestones.filter(
    (m) => m.completedAt,
  ).length;
  const totalMilestones = project.milestones.length;

  return (
    <Link href={`/dashboard/projects/${project.id}`}>
      <Card
        className={`cursor-pointer hover:border-primary/50 transition-all
          ${isDragging ? "shadow-lg shadow-primary/20 rotate-2 scale-105" : ""}`}
      >
        <CardContent className="p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold line-clamp-2">
              {project.name}
            </h4>
            <Badge
              className={`text-[10px] shrink-0 ${priorityColors[project.priority] ?? ""}`}
            >
              {project.priority}
            </Badge>
          </div>

          {totalMilestones > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{
                    width: `${(completedMilestones / totalMilestones) * 100}%`,
                  }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">
                {completedMilestones}/{totalMilestones}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Avatar className="h-5 w-5">
                <AvatarImage src={project.client.image ?? undefined} />
                <AvatarFallback className="text-[8px]">
                  {project.client.name?.charAt(0) ?? "?"}
                </AvatarFallback>
              </Avatar>
              <span className="text-[11px] text-muted-foreground truncate max-w-[80px]">
                {project.client.name ?? "Unknown"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              {project._count.files > 0 && (
                <span className="flex items-center gap-0.5 text-[10px]">
                  <Paperclip className="h-3 w-3" />
                  {project._count.files}
                </span>
              )}
              {project._count.comments > 0 && (
                <span className="flex items-center gap-0.5 text-[10px]">
                  <MessageSquare className="h-3 w-3" />
                  {project._count.comments}
                </span>
              )}
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground">
            Updated{" "}
            {formatDistanceToNow(project.updatedAt, { addSuffix: true })}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

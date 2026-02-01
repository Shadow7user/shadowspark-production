import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface CourseProgressProps {
  progress: number;
  completed: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function CourseProgress({ 
  progress, 
  completed, 
  showLabel = true,
  size = 'md' 
}: CourseProgressProps) {
  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }[size];

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">
            Progress
          </span>
          <Badge 
            variant="secondary" 
            className={completed 
              ? "bg-green-500/20 text-green-400 border-green-500/30" 
              : "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
            }
          >
            {progress}%
          </Badge>
        </div>
      )}
      <Progress value={progress} className={`${heightClass} bg-muted`} />
      {completed && (
        <div className="mt-2 p-3 bg-gradient-to-r from-green-900/30 to-cyan-900/30 rounded-lg border border-green-500/30">
          <p className="text-sm font-medium text-green-400 flex items-center gap-2">
            <span>🎓</span>
            Course Completed! Your certificate is ready.
          </p>
        </div>
      )}
    </div>
  );
}

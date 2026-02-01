import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'success';
  className?: string;
}

export function ProgressBar({ 
  value, 
  showLabel = true,
  size = 'md',
  variant = 'gradient',
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  
  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }[size];

  const isComplete = clamped >= 100;

  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <Badge 
            variant="secondary" 
            className={cn(
              "text-xs",
              isComplete 
                ? "bg-green-500/20 text-green-400 border-green-500/30" 
                : "bg-cyan-900/50 text-cyan-300 border-cyan-500/30"
            )}
          >
            {clamped.toFixed(0)}%
          </Badge>
        </div>
      )}
      <div className={cn("relative w-full overflow-hidden rounded-full bg-muted", heightClass)}>
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out",
            variant === 'gradient' && "bg-gradient-to-r from-purple-600 to-cyan-500",
            variant === 'success' && "bg-green-500",
            variant === 'default' && "bg-primary"
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

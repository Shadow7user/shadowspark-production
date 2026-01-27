import { Progress } from "@/components/ui/progress";

interface CourseProgressProps {
  progress: number;
  completed: boolean;
}

export function CourseProgress({ progress, completed }: CourseProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">
          Course Progress
        </span>
        <span className="text-sm font-bold text-gray-900">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      {completed && (
        <div className="mt-2 p-2 bg-green-50 rounded-md">
          <p className="text-sm font-medium text-green-800">
            ✓ Course Completed! Certificate ready.
          </p>
        </div>
      )}
    </div>
  );
}

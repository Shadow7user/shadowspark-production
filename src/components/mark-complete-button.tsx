"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface MarkCompleteButtonProps {
  lessonId: string;
  isCompleted: boolean;
  onComplete: (progress: number, completed: boolean) => void;
}

export function MarkCompleteButton({
  lessonId,
  isCompleted,
  onComplete,
}: MarkCompleteButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleMarkComplete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to mark lesson complete");
      }

      const data = await response.json();
      onComplete(data.progress, data.completed);
    } catch (error) {
      console.error("Error marking lesson complete:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleMarkComplete}
      disabled={loading || isCompleted}
      variant={isCompleted ? "outline" : "default"}
      size="lg"
      className="w-full sm:w-auto"
    >
      {isCompleted ? (
        <>
          <CheckCircle className="w-5 h-5 mr-2" />
          Completed
        </>
      ) : (
        <>Mark Lesson Complete</>
      )}
    </Button>
  );
}

'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react"; 
import Link from 'next/link';

// Detailed Lesson interface matching UI needs, adapted for Prisma compatibility
export interface Lesson {
  id: string;
  title: string;
  duration?: string | number | null;
  type?: "video" | "quiz" | "reading"; // Optional as it might not be in DB yet
}

interface LessonProgressAccordionProps {
  lessons: Lesson[];
  lessonProgress: Record<string, number>; // { "lesson1": 100, "lesson3": 0 }
  moduleId: string; // For keying
  courseId: string;
}

export function LessonProgressAccordion({
  lessons,
  lessonProgress = {},
  moduleId,
  courseId,
}: LessonProgressAccordionProps) {
  return (
    <Accordion type="multiple" className="space-y-2">
      {lessons.map((lesson, idx) => {
        const progress = lessonProgress[lesson.id] ?? 0;
        const isComplete = progress >= 100;
        
        // Format duration if it's a number (minutes)
        const durationDisplay = typeof lesson.duration === 'number' 
          ? `${lesson.duration} min` 
          : lesson.duration || "10 min";

        // Default type if missing
        const type = lesson.type || "video";

        return (
          <AccordionItem value={lesson.id} key={lesson.id} className="border-cyan-500/20">
            <AccordionTrigger className="hover:text-cyan-300 py-3">
              <div className="flex items-center gap-4 w-full">
                <div className="flex items-center gap-3">
                  {isComplete ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <span className="text-sm font-medium text-muted-foreground">
                      {idx + 1}
                    </span>
                  )}
                  <span className="font-medium text-left">{lesson.title}</span>
                </div>
                <div className="flex items-center gap-3 ml-auto text-sm text-muted-foreground whitespace-nowrap">
                  <span>{durationDisplay}</span>
                  {isComplete && <span className="text-green-400 hidden sm:inline">Complete</span>}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {type === "video" ? "Watch time tracked" : "Complete to mark progress"}
                </span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <ProgressBar value={progress} />
              <Button 
                variant="outline" 
                className="w-full"
                asChild
              >
                <Link href={`/courses/${courseId}/learn/${lesson.id}`}>
                  {progress > 0 ? "Continue" : "Start"} Lesson
                </Link>
              </Button>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

'use client';

import { ProgressBar } from "@/components/ui/progress-bar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { LessonProgressAccordion, Lesson } from "./lesson-progress-accordion";

// Extended Module interface that includes lessons
interface Module {
  id: string;
  title: string;
  description?: string | null;
  lessons?: Lesson[];
  // If we just have lessonCount from DB count
  _count?: {
    lessons: number;
  };
}

interface ModuleProgressListProps {
  courseId: string;
  modules: Module[];
  moduleProgress: Record<string, number | Record<string, number>>; // e.g., { "intro-to-ai": 100, "neural-nets": { "lesson1": 50 } }
  overallProgress: number;
}

export function ModuleProgressList({
  courseId,
  modules,
  moduleProgress = {},
  overallProgress,
}: ModuleProgressListProps) {
  const sortedModules = modules; // Assume ordered by parent

  return (
    <div className="my-12 rounded-lg border border-cyan-500/20 bg-background/50 p-6 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-2xl font-bold text-foreground">Course Progress</h3>
        <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600 text-lg border-0 text-white">
          {overallProgress.toFixed(0)}% Complete
        </Badge>
      </div>

      <ProgressBar value={overallProgress} showLabel={false} className="mb-8" size="lg" />

      <Accordion type="single" collapsible defaultValue="0" className="space-y-4">
        {sortedModules.map((module, index) => {
          // Check if moduleProgress is a number (legacy/simple) or object (nested)
          const rawProgress = moduleProgress[module.id];
          
          let progressVal = 0;
          let lessonProgress: Record<string, number> = {};

          if (typeof rawProgress === 'number') {
            progressVal = rawProgress;
          } else if (typeof rawProgress === 'object' && rawProgress !== null) {
            // Calculate average if object
            lessonProgress = rawProgress as Record<string, number>;
            const values = Object.values(lessonProgress);
            if (values.length > 0) {
              progressVal = values.reduce((a, b) => a + b, 0) / (module.lessons?.length || values.length || 1);
            }
          }

          const isComplete = progressVal >= 100;
          const lessonCount = module.lessons?.length || module._count?.lessons || 0;

          return (
            <AccordionItem value={index.toString()} key={module.id} className="border-cyan-500/30 border rounded-lg px-2">
              <AccordionTrigger className="hover:text-cyan-300 px-2">
                <div className="flex items-center gap-4 text-left">
                  <Badge variant={isComplete ? "default" : "secondary"} className={isComplete ? "bg-green-600 hover:bg-green-700" : ""}>
                    Module {index + 1}
                  </Badge>
                  <span className="font-medium">{module.title}</span>
                  {isComplete && <span className="text-green-400 text-sm hidden sm:inline">✓ Complete</span>}
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4 px-2">
                {module.description && (
                  <p className="text-muted-foreground text-sm">{module.description}</p>
                )}
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{lessonCount} lessons</span>
                  <span>{progressVal.toFixed(0)}% complete</span>
                </div>
                
                <ProgressBar value={progressVal} />

                {/* Nested Lesson Progress */}
                {module.lessons && module.lessons.length > 0 && (
                  <div className="mt-6 pl-2 sm:pl-4 border-l-2 border-cyan-500/10">
                    <h4 className="text-sm font-semibold mb-3 text-cyan-200">Lesson Details</h4>
                    <LessonProgressAccordion
                      lessons={module.lessons}
                      lessonProgress={lessonProgress}
                      moduleId={module.id}
                      courseId={courseId}
                    />
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

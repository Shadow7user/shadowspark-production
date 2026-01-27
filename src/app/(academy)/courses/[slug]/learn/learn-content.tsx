"use client";

import { useState } from "react";
import { MarkCompleteButton } from "@/components/mark-complete-button";
import { CourseProgress } from "@/components/course-progress";

interface LearnContentProps {
  slug: string;
  enrollment: any;
  currentLesson: any;
  allLessons: any[];
  completedLessonIds: string[];
  userEmail: string;
}

export function LearnContent({
  slug,
  enrollment,
  currentLesson,
  allLessons,
  completedLessonIds,
  userEmail,
}: LearnContentProps) {
  const [progress, setProgress] = useState(enrollment.progress);
  const [completed, setCompleted] = useState(enrollment.completed);
  const [completedLessons, setCompletedLessons] = useState(
    new Set(completedLessonIds)
  );

  const currentLessonIndex = allLessons.findIndex((l) => l.id === currentLesson.id);

  const handleLessonComplete = (newProgress: number, newCompleted: boolean) => {
    setProgress(newProgress);
    setCompleted(newCompleted);
    setCompletedLessons((prev) => new Set([...prev, currentLesson.id]));
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Course Modules */}
      <aside className="w-72 border-r bg-card overflow-y-auto">
        <div className="sticky top-0 bg-card border-b p-4 space-y-3">
          <div>
            <h2 className="font-bold text-lg mb-2">{enrollment.course.title}</h2>
            <CourseProgress progress={progress} completed={completed} />
          </div>
        </div>

        <div className="p-4 space-y-6">
          {enrollment.course.modules.map((mod: any, modIdx: number) => (
            <div key={mod.id}>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Module {modIdx + 1}: {mod.title}
              </h3>
              <ul className="space-y-2">
                {mod.lessons.map((lesson: any) => {
                  const isLessonCompleted = completedLessons.has(lesson.id);
                  return (
                    <li key={lesson.id}>
                      <a
                        href={`/courses/${slug}/learn?lesson=${lesson.id}`}
                        className={`block p-2 rounded text-sm transition-colors ${
                          lesson.id === currentLesson.id
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <span className="inline-block w-5 text-center">
                          {isLessonCompleted ? "✓" : "▶"}
                        </span>
                        {lesson.title}
                        {lesson.duration && (
                          <span className="text-xs ml-2 opacity-60">
                            {lesson.duration}m
                          </span>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content - Lesson Viewer */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Lesson Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{currentLesson.title}</h1>
            {currentLesson.description && (
              <p className="text-muted-foreground">{currentLesson.description}</p>
            )}
            {currentLesson.duration && (
              <p className="text-sm text-muted-foreground mt-2">
                Duration: {currentLesson.duration} minutes
              </p>
            )}
          </div>

          {/* Video Player */}
          {currentLesson.videoUrl && (
            <div className="mb-8 rounded-lg overflow-hidden border bg-black">
              <video
                src={currentLesson.videoUrl}
                controls
                className="w-full aspect-video"
              />
            </div>
          )}

          {/* Lesson Content */}
          {currentLesson.content && (
            <div className="prose dark:prose-invert max-w-none mb-8">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {currentLesson.content}
              </div>
            </div>
          )}

          {/* Lesson Resources */}
          {currentLesson.resources && Array.isArray(currentLesson.resources) && (
            <div className="mb-8 p-6 bg-card rounded-lg border">
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                {currentLesson.resources.map((resource: any, idx: number) => (
                  <li key={idx}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {resource.title || `Resource ${idx + 1}`} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mark Complete Button */}
          <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
              Mark this lesson as complete to track your progress and unlock
              certificates.
            </p>
            <MarkCompleteButton
              lessonId={currentLesson.id}
              isCompleted={completedLessons.has(currentLesson.id)}
              onComplete={handleLessonComplete}
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t">
            <div>
              {currentLessonIndex > 0 && (
                <a
                  href={`/courses/${slug}/learn?lesson=${allLessons[currentLessonIndex - 1].id}`}
                  className="text-primary hover:underline"
                >
                  ← Previous Lesson
                </a>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Lesson {currentLessonIndex + 1} of {allLessons.length}
            </div>
            <div>
              {currentLessonIndex < allLessons.length - 1 && (
                <a
                  href={`/courses/${slug}/learn?lesson=${allLessons[currentLessonIndex + 1].id}`}
                  className="text-primary hover:underline"
                >
                  Next Lesson →
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

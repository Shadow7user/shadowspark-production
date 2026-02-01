"use client";

import { useState } from "react";
import { MarkCompleteButton } from "@/components/mark-complete-button";
import { CourseProgress } from "@/components/course-progress";
import { CertificateBuilder } from "@/components/certificate/certificate-builder";
import { LessonVideoPlayer } from "@/components/course/lesson-video-player";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";

interface LearnContentProps {
  slug: string;
  enrollment: any;
  currentLesson: any;
  allLessons: any[];
  completedLessonIds: string[];
  userEmail: string;
  userName?: string;
  courseTitle: string;
  enrollmentId: string;
}

export function LearnContent({
  slug,
  enrollment,
  currentLesson,
  allLessons,
  completedLessonIds,
  userEmail,
  userName,
  courseTitle,
  enrollmentId,
}: LearnContentProps) {
  const [progress, setProgress] = useState<number>(
    Number(enrollment.progressPercentage ?? 0),
  );
  const [completed, setCompleted] = useState(enrollment.completed);
  const [completedLessons, setCompletedLessons] = useState(
    new Set(completedLessonIds),
  );
  const [showCertificate, setShowCertificate] = useState(false);

  const currentLessonIndex = allLessons.findIndex(
    (l) => l.id === currentLesson.id,
  );

  const handleLessonComplete = (newProgress: number, newCompleted: boolean) => {
    setProgress(newProgress);
    setCompleted(newCompleted);
    setCompletedLessons((prev) => new Set([...prev, currentLesson.id]));

    // Auto-show certificate when course is completed
    if (newCompleted) {
      setShowCertificate(true);
    }
  };

  const studentName = userName || userEmail?.split("@")[0] || "Student";
  const completionDate = new Date().toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex h-screen bg-background">
      {/* Certificate Modal */}
      {showCertificate && completed && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-auto">
          <div className="max-w-4xl w-full">
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                onClick={() => setShowCertificate(false)}
                className="text-white border-white/50 hover:bg-white/10"
              >
                ✕ Close
              </Button>
            </div>
            <CertificateBuilder
              studentName={studentName}
              courseTitle={courseTitle}
              completionDate={completionDate}
              certificateId={enrollmentId}
            />
          </div>
        </div>
      )}

      {/* Sidebar - Course Modules */}
      <aside className="w-72 border-r bg-card overflow-y-auto">
        <div className="sticky top-0 bg-card border-b p-4 space-y-3">
          <div>
            <h2 className="font-bold text-lg mb-2">
              {enrollment.course.title}
            </h2>
            <CourseProgress progress={progress} completed={completed} />
            {completed && (
              <Button
                onClick={() => setShowCertificate(true)}
                className="w-full mt-3 bg-gradient-to-r from-cyan-500 to-purple-600"
                size="sm"
              >
                🎓 View Certificate
              </Button>
            )}
          </div>
        </div>

        <div className="p-4 space-y-6">
          {enrollment.course.modules.map((mod: any, modIdx: number) => {
            // Calculate module progress
            const moduleLessons = mod.lessons || [];
            const completedInModule = moduleLessons.filter((l: any) =>
              completedLessons.has(l.id),
            ).length;
            const moduleProgress =
              moduleLessons.length > 0
                ? Math.round((completedInModule / moduleLessons.length) * 100)
                : 0;

            return (
              <div key={mod.id}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    Module {modIdx + 1}: {mod.title}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {completedInModule}/{moduleLessons.length}
                  </span>
                </div>
                <ProgressBar
                  value={moduleProgress}
                  showLabel={false}
                  size="sm"
                  className="mb-3"
                />
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
            );
          })}
        </div>
      </aside>

      {/* Main Content - Lesson Viewer */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Lesson Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{currentLesson.title}</h1>
            {currentLesson.description && (
              <p className="text-muted-foreground">
                {currentLesson.description}
              </p>
            )}
            {currentLesson.duration && (
              <p className="text-sm text-muted-foreground mt-2">
                Duration: {currentLesson.duration} minutes
              </p>
            )}
          </div>

          {/* Video Player with Auto-Progress Tracking */}
          {currentLesson.videoUrl && (
            <div className="mb-8">
              <LessonVideoPlayer
                videoUrl={currentLesson.videoUrl}
                lessonId={currentLesson.id}
                courseId={enrollment.courseId}
                moduleId={currentLesson.moduleId}
                initialProgress={
                  completedLessons.has(currentLesson.id) ? 100 : 0
                }
                onProgressUpdate={(courseProgress, isCompleted) => {
                  setProgress(courseProgress);
                  if (isCompleted && !completed) {
                    setCompleted(true);
                  }
                }}
                onComplete={() => {
                  setCompletedLessons(
                    (prev) => new Set([...prev, currentLesson.id]),
                  );
                }}
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
          {currentLesson.resources &&
            Array.isArray(currentLesson.resources) && (
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

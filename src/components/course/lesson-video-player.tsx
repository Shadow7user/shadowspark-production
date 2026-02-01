"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactPlayer from "react-player";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { PlayCircle, RotateCcw } from "lucide-react";
import { updateLessonProgress } from "@/lib/actions/progress";

interface LessonVideoPlayerProps {
  videoUrl: string;
  initialProgress: number; // 0-100
  courseId: string;
  moduleId: string;
  lessonId: string;
  onProgressUpdate?: (progress: number, isCompleted: boolean) => void;
  onComplete?: () => void;
}

export function LessonVideoPlayer({
  videoUrl,
  initialProgress,
  courseId,
  moduleId,
  lessonId,
  onProgressUpdate,
  onComplete,
}: LessonVideoPlayerProps) {
  const [played, setPlayed] = useState(0); // 0-1 fraction
  const [progress, setProgress] = useState(initialProgress); // 0-100 integer
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const [hasResumed, setHasResumed] = useState(false);
  const lastUpdateRef = useRef<number>(Date.now());
  const hasCompletedRef = useRef(false);

  // Convert initial 0-100 to 0-1 for player seek
  const initialFraction = initialProgress / 100;

  useEffect(() => {
    // Sync local state if prop changes significantly (optional)
  }, [initialProgress]);

  const saveProgress = async (percent: number) => {
    try {
      await updateLessonProgress({
        courseId,
        moduleId,
        lessonId,
        progress: percent,
      });
    } catch (e) {
      console.error("Failed to save progress", e);
    }
  };

  const handleProgress = useCallback(
    (state: {
      played: number;
      playedSeconds: number;
      loaded: number;
      loadedSeconds: number;
    }) => {
      if (!isReady) return;

      setPlayed(state.played);
      const currentPercent = Math.round(state.played * 100);

      // Only update if progress increased
      if (currentPercent > progress) {
        setProgress(currentPercent);
        onProgressUpdate?.(currentPercent, currentPercent >= 100);

        // Save to DB every 5%
        // Debounce database updates: only save if 5 seconds passed OR completed
        const timeSinceLastUpdate = Date.now() - lastUpdateRef.current;
        if (timeSinceLastUpdate > 5000 || currentPercent >= 100) {
          saveProgress(currentPercent);
          lastUpdateRef.current = Date.now();
        }
      }

      // Mark complete if > 95%
      if (state.played > 0.95 && progress < 100) {
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          saveProgress(100);
          setProgress(100);
          onProgressUpdate?.(100, true);
          onComplete?.();
        }
      }
    },
    [isReady, progress, onProgressUpdate, onComplete],
  );

  const handleResume = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(initialFraction, "fraction");
      setHasResumed(true);
    }
  };

  const handleReady = () => {
    setIsReady(true);
  };

  const handleEnded = () => {
    if (!hasCompletedRef.current) {
      hasCompletedRef.current = true;
      saveProgress(100);
      setProgress(100);
      onProgressUpdate?.(100, true);
      onComplete?.();
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-cyan-900/50 shadow-lg shadow-cyan-900/20">
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          width="100%"
          height="100%"
          controls={true}
          onProgress={handleProgress}
          onReady={handleReady}
          onEnded={handleEnded}
          config={{
            file: {
              attributes: {
                controlsList: "nodownload",
              },
            },
          }}
        />

        {!hasResumed &&
          isReady &&
          initialProgress > 0 &&
          initialProgress < 100 && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="text-center space-y-4 p-6 bg-gray-900/90 border border-cyan-500/30 rounded-xl">
                <p className="text-cyan-100 font-medium">
                  Resume where you left off?
                </p>
                <p className="text-2xl font-bold text-white">
                  {initialProgress}% Complete
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={handleResume}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> Resume
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setHasResumed(true)}
                    className="border-cyan-500/30 text-cyan-300"
                  >
                    <PlayCircle className="mr-2 h-4 w-4" /> Start Over
                  </Button>
                </div>
              </div>
            </div>
          )}
      </div>

      <div className="flex items-center gap-4 bg-gray-900/50 p-4 rounded-lg border border-white/5">
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Lesson Progress</span>
            <span className="text-cyan-400 font-mono">{progress}%</span>
          </div>
          <ProgressBar value={progress} size="sm" showLabel={false} />
        </div>
      </div>
    </div>
  );
}

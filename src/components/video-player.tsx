"use client";

import {
  Maximize,
  Pause,
  Play,
  Settings,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  videoUrl: string;
  lessonId: string;
  onProgress: (seconds: number) => void;
  initialProgress?: number;
  onComplete?: () => void;
}

export function VideoPlayer({
  videoUrl,
  lessonId,
  onProgress,
  initialProgress = 0,
  onComplete,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffered, setBuffered] = useState(0);
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastSaveRef = useRef<number>(0);

  // Resume from initial progress
  useEffect(() => {
    if (videoRef.current && initialProgress > 0) {
      videoRef.current.currentTime = initialProgress;
    }
  }, [initialProgress]);

  // Auto-hide controls
  const resetHideTimeout = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    if (playing) {
      hideControlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [playing]);

  useEffect(() => {
    return () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
    resetHideTimeout();
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    setProgress(current);

    // Save progress every 5 seconds
    if (Math.floor(current) - lastSaveRef.current >= 5) {
      onProgress(current);
      lastSaveRef.current = Math.floor(current);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleProgress = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      setBuffered((bufferedEnd / video.duration) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newTime = parseFloat(e.target.value);
    videoRef.current.currentTime = newTime;
    setProgress(newTime);
    onProgress(newTime);
  };

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    videoRef.current.currentTime = newTime;
    setProgress(newTime);
    onProgress(newTime);
  };

  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(
      0,
      Math.min(duration, videoRef.current.currentTime + seconds),
    );
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const changeSpeed = (newSpeed: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = newSpeed;
    setSpeed(newSpeed);
    setShowSettings(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  const handleEnded = () => {
    setPlaying(false);
    onProgress(duration);
    onComplete?.();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative group bg-black rounded-xl overflow-hidden"
      onMouseMove={resetHideTimeout}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full aspect-video cursor-pointer"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onProgress={handleProgress}
        onEnded={handleEnded}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onClick={togglePlay}
        playsInline
      />

      {/* Play button overlay when paused */}
      {!playing && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          <div className="w-20 h-20 bg-cyan-500/80 rounded-full flex items-center justify-center hover:bg-cyan-500 transition">
            <Play className="h-10 w-10 text-white ml-1" />
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Progress Bar */}
        <div
          className="relative h-1 mb-4 cursor-pointer group/progress"
          onClick={handleSeekClick}
        >
          {/* Buffered */}
          <div
            className="absolute top-0 left-0 h-full bg-white/20 rounded"
            style={{ width: `${buffered}%` }}
          />
          {/* Progress */}
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded"
            style={{ width: `${(progress / duration) * 100}%` }}
          />
          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition"
            style={{ left: `calc(${(progress / duration) * 100}% - 6px)` }}
          />
          {/* Hidden range input for accessibility */}
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={progress}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            {/* Skip back */}
            <button
              onClick={() => skip(-10)}
              className="text-white hover:text-cyan-400 transition hidden sm:block"
              title="Skip back 10s"
            >
              <SkipBack className="h-5 w-5" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-cyan-400 transition"
            >
              {playing ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </button>

            {/* Skip forward */}
            <button
              onClick={() => skip(10)}
              className="text-white hover:text-cyan-400 transition hidden sm:block"
              title="Skip forward 10s"
            >
              <SkipForward className="h-5 w-5" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={toggleMute}
                className="text-white hover:text-cyan-400 transition"
              >
                {muted || volume === 0 ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/volume:w-20 transition-all duration-200 accent-cyan-500 hidden sm:block"
              />
            </div>

            {/* Time */}
            <span className="text-white text-sm">
              {formatTime(progress)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Speed settings */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:text-cyan-400 transition flex items-center gap-1"
              >
                <Settings className="h-5 w-5" />
                <span className="text-xs hidden sm:inline">{speed}x</span>
              </button>

              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 p-2 bg-card border border-border rounded-lg shadow-lg min-w-[100px]">
                  <div className="text-xs text-muted-foreground mb-2">
                    Speed
                  </div>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => changeSpeed(s)}
                      className={`block w-full text-left px-3 py-1.5 text-sm rounded hover:bg-cyan-500/20 transition ${
                        speed === s
                          ? "text-cyan-400 bg-cyan-500/10"
                          : "text-white"
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-cyan-400 transition"
            >
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

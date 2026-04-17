import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CinematicBackgroundProps {
  children: ReactNode;
  className?: string;
  videoSrc?: string;
  fallbackColor?: string;
}

export function CinematicBackground({
  children,
  className,
  videoSrc = "/assets/veo-cinematic-trailer.mp4",
  fallbackColor = "bg-[#050505]",
}: CinematicBackgroundProps) {
  return (
    <div className={cn("relative w-full overflow-hidden", fallbackColor, className)}>
      {/* Video Layer */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen grayscale-[0.2] contrast-125"
      >
        <source src={videoSrc} type="video/mp4" />
        {/* Optional WebM fallback */}
        {/* <source src={videoSrc.replace('.mp4', '.webm')} type="video/webm" /> */}
      </video>

      {/* Obsidian Glass & Cyan Scanner Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.9)_0%,rgba(5,5,5,0.6)_50%,rgba(5,5,5,1)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,229,255,0.1)_0%,transparent_70%)] pointer-events-none mix-blend-screen" />
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,1)] pointer-events-none" />

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}

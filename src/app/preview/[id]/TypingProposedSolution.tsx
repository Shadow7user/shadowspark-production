"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export type TypingProposedSolutionProps = {
  text: string;
  startDelayMs?: number;
  speedMs?: number;
  className?: string;
};

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export default function TypingProposedSolution({
  text,
  startDelayMs = 250,
  speedMs = 12,
  className,
}: TypingProposedSolutionProps) {
  const reduceMotion = useReducedMotion();
  const normalized = useMemo(() => text ?? "", [text]);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (reduceMotion) return;

    if (normalized.length === 0) return;

    const safeSpeed = clampNumber(speedMs, 5, 40);
    const safeDelay = clampNumber(startDelayMs, 0, 2000);

    let intervalId: number | null = null;
    const startTimeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setCount((prev) => {
          if (prev >= normalized.length) return prev;
          const remaining = normalized.length - prev;
          const step = remaining > 1200 ? 10 : remaining > 400 ? 5 : 2;
          return Math.min(normalized.length, prev + step);
        });
      }, safeSpeed);
    }, safeDelay);

    return () => {
      window.clearTimeout(startTimeoutId);
      if (intervalId !== null) window.clearInterval(intervalId);
    };
  }, [normalized, reduceMotion, speedMs, startDelayMs]);

  const visible = reduceMotion ? normalized : normalized.slice(0, count);
  const done = reduceMotion ? true : count >= normalized.length;

  return (
    <div className={className}>
      <pre className="whitespace-pre-wrap text-xs leading-relaxed text-[#E0E0E0]/85 sm:text-sm">
        {visible}
        <span className={done ? "opacity-0" : "opacity-100"}>
          <span className="ml-0.5 inline-block h-4 w-[2px] align-middle bg-[#00F2FF] animate-pulse" />
        </span>
      </pre>
    </div>
  );
}

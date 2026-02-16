"use client";

import React, { useEffect, useRef } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Stagger children entrances */
  stagger?: boolean;
  /** IntersectionObserver rootMargin — default '0px 0px -60px 0px' */
  rootMargin?: string;
  /** Threshold at which element is considered visible — default 0.12 */
  threshold?: number;
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Wraps children in a scroll-triggered reveal.
 * Adds the 'reveal' CSS class on mount and 'visible' when the element
 * enters the viewport via IntersectionObserver.
 *
 * Respects prefers-reduced-motion: the CSS handles instant-on via the
 * global override in globals.css.
 */
export default function Reveal({
  children,
  className = "",
  style,
  stagger = false,
  rootMargin = "0px 0px -60px 0px",
  threshold = 0.12,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  const classes = [
    "reveal",
    stagger ? "reveal-stagger" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={classes} style={style}>
      {children}
    </Tag>
  );
}

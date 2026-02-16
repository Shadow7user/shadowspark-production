"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";

// Demonstration Environment Metrics — validated in controlled test conditions
const stats = [
  {
    label: "Avg Response Time (Demo)",
    // target number + suffix for the counter
    target: 118,
    suffix: "ms",
    display: null,         // null = animate numerically
    note: "Demo",
  },
  {
    label: "Workflow Test Runs",
    target: 1200,
    suffix: "+",
    display: null,
    note: "Tested",
    format: (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1).replace(".0", "")}k` : String(n),
  },
  {
    label: "Automation Reliability",
    target: 100,
    suffix: "%",
    display: null,
    note: "Tested",
  },
  {
    label: "Setup Complexity",
    target: null,          // non-numeric — no counter
    suffix: "",
    display: "Zero-code",
    note: "No dev required",
  },
];

/* ── Animated counter hook ──────────────────────────────────── */

function useCounter(
  target: number | null,
  isVisible: boolean,
  duration = 1400
) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!isVisible || target === null) return;

    const start = performance.now();
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.round(easeOut(progress) * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isVisible, target, duration]);

  return value;
}

/* ── Stat card ──────────────────────────────────────────────── */

function StatCard({
  stat,
  delay,
}: {
  stat: (typeof stats)[number];
  delay: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCounter(stat.target, visible);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const formattedValue =
    stat.display !== null
      ? stat.display
      : stat.format
      ? `${stat.format(count)}${stat.suffix}`
      : `${count}${stat.suffix}`;

  return (
    <div
      ref={cardRef}
      className="card-lift glass-card rounded-2xl p-8 text-center"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span
        className={`text-4xl font-bold text-white sm:text-5xl tabular-nums ${
          visible ? "counter-enter" : "opacity-0"
        }`}
      >
        {formattedValue}
      </span>
      <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
      <span className="mt-3 inline-block rounded-full border border-[#d4a843]/20 bg-[#d4a843]/5 px-2.5 py-0.5 text-xs text-[#d4a843]">
        {stat.note}
      </span>
    </div>
  );
}

/* ── Section ────────────────────────────────────────────────── */

export default function StatsSection() {
  return (
    <section id="stats" className="bg-[#0f1521] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="section-accent text-xs font-semibold uppercase tracking-widest text-[#d4a843]">
            Performance
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Demonstration Environment{" "}
            <span className="gradient-text">Metrics</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500">
            Figures below reflect validated performance in a controlled test
            environment. Production results vary by workflow and data volume.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <StatCard key={s.label} stat={s} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

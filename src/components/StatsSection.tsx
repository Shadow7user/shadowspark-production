"use client";
import { useEffect, useState } from "react";

const stats = [
  { label: "Messages Processed", target: 12480, suffix: "+" },
  { label: "Active Businesses", target: 38, suffix: "" },
  { label: "Avg Response Time", target: 1.2, suffix: "s", decimal: true },
  { label: "Customer Satisfaction", target: 97, suffix: "%" },
];

function AnimatedCounter({
  target,
  suffix,
  decimal,
}: {
  target: number;
  suffix: string;
  decimal?: boolean;
}) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    const el = document.getElementById(`stat-${target}`);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  useEffect(() => {
    if (!visible) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(decimal ? Math.round(current * 10) / 10 : Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [visible, target, decimal]);

  return (
    <span id={`stat-${target}`} className="text-4xl font-bold text-white sm:text-5xl">
      {decimal ? count.toFixed(1) : count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section id="stats" className="bg-[#0f1521] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Results that <span className="gradient-text">speak for themselves</span>
          </h2>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="glass-card rounded-2xl p-8 text-center">
              <AnimatedCounter target={s.target} suffix={s.suffix} decimal={s.decimal} />
              <p className="mt-2 text-sm text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

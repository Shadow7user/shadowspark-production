"use client";

import { useEffect, useState } from "react";

type Metrics = {
  totalLeads: number;
  pendingDemos: number;
  conversionRate: number;
  pipelineValueUsd: number;
  activity: Array<{ id: string; label: string; timestamp: string }>;
  sparkline: number[];
};

function Sparkline({ values }: { values: number[] }) {
  const width = 120;
  const height = 36;
  const max = Math.max(...values, 1);
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - (value / max) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-9 w-28">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        points={points}
        className="text-cyan-300"
      />
    </svg>
  );
}

export default function StatsRow() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadMetrics() {
      try {
        const response = await fetch("/api/operator/metrics", { cache: "no-store" });
        const result = await response.json().catch(() => null);

        if (!response.ok || !result) {
          throw new Error(result?.error || "Unable to load operator metrics.");
        }

        if (active) setMetrics(result);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load operator metrics.");
        }
      }
    }

    loadMetrics();
    return () => {
      active = false;
    };
  }, []);

  const cards = [
    {
      label: "Total Leads",
      value: metrics?.totalLeads ?? "—",
    },
    {
      label: "Pending Demos",
      value: metrics?.pendingDemos ?? "—",
    },
    {
      label: "Conversion Rate",
      value: metrics ? `${metrics.conversionRate}%` : "—",
    },
    {
      label: "Pipeline Value",
      value: metrics ? `$${metrics.pipelineValueUsd.toLocaleString()}` : "—",
    },
  ];

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-[0_0_30px_rgba(0,229,255,0.04)] backdrop-blur-md"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{card.label}</p>
              <Sparkline values={metrics?.sparkline ?? [5, 10, 7, 12, 18, 13, 20]} />
            </div>
            <p className="mt-4 text-3xl font-black text-white">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

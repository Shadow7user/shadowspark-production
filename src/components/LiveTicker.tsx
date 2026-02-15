"use client";
import { useEffect, useState } from "react";
import { Activity, MessageSquare, Bot, Clock, Shield } from "lucide-react";

const tickerItems = [
  { icon: MessageSquare, text: "messages processed today", base: 847 },
  { icon: Bot, text: "active chatbots running", base: 24 },
  { icon: Clock, text: "avg response time", base: 1.2, unit: "s", fixed: true },
  { icon: Shield, text: "platform uptime", base: 99.9, unit: "%", fixed: true },
];

export default function LiveTicker() {
  const [values, setValues] = useState(tickerItems.map((t) => t.base));

  useEffect(() => {
    const interval = setInterval(() => {
      setValues((prev) =>
        prev.map((v, i) => {
          const item = tickerItems[i];
          if (item.fixed) return item.base;
          return v + Math.floor(Math.random() * 3);
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-y border-white/5 bg-[#0f1521]/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-8 overflow-x-auto text-sm">
          <div className="flex shrink-0 items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-emerald-400 font-medium">Live</span>
          </div>
          {tickerItems.map((item, i) => (
            <div
              key={item.text}
              className="flex shrink-0 items-center gap-2 text-slate-400"
            >
              <item.icon size={14} className="text-[#d4a843]" />
              <span className="font-semibold text-white tabular-nums">
                {item.fixed
                  ? values[i].toFixed(1)
                  : values[i].toLocaleString()}
                {item.unit ?? ""}
              </span>
              <span className="hidden sm:inline">{item.text}</span>
            </div>
          ))}
          <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1">
            <Activity size={12} className="text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

// Demonstration Environment Metrics — validated in controlled test conditions
const stats = [
  { label: "Avg Response Time (Demo)", value: "118ms", note: "Demo" },
  { label: "Workflow Test Runs", value: "1,200+", note: "Tested" },
  { label: "Automation Reliability", value: "100%", note: "Tested" },
  { label: "Setup Complexity", value: "Zero-code", note: "No dev required" },
];

export default function StatsSection() {
  return (
    <section id="stats" className="bg-[#0f1521] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Demonstration Environment{" "}
            <span className="gradient-text">Metrics</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500">
            Figures below reflect validated performance in a controlled test
            environment. Production results vary by workflow and data volume.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="glass-card rounded-2xl p-8 text-center">
              <span className="text-4xl font-bold text-white sm:text-5xl">
                {s.value}
              </span>
              <p className="mt-2 text-sm text-slate-400">{s.label}</p>
              <span className="mt-3 inline-block rounded-full border border-[#d4a843]/20 bg-[#d4a843]/5 px-2.5 py-0.5 text-xs text-[#d4a843]">
                {s.note}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

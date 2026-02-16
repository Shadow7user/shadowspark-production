"use client";
import { ArrowRight, Clock, CheckCircle2, TrendingDown } from "lucide-react";

// ─── Primary hero example — displayed large at the top ───────────────────────
const hero = {
  workflow: "Manual Follow-ups",
  before: {
    metric: "4 hours / day",
    description:
      "Sales staff manually writing, sending, and tracking follow-up messages to every lead — across WhatsApp, email, and SMS. Most leads go cold before a reply is sent.",
  },
  after: {
    metric: "15 minutes / day",
    description:
      "Automated sequences handle initial follow-ups, reminders, and status updates. Staff review a prioritised list of leads that need human attention only.",
  },
  saved: "87%",
  savedLabel: "time saved on follow-ups",
};

// ─── Supporting examples — displayed as compact rows below ───────────────────
const supporting = [
  {
    workflow: "Customer Support Triage",
    beforeMetric: "4–6 hrs / day",
    afterMetric: "18 min / day",
    saved: "93%",
    savedLabel: "time saved",
    beforeDetail:
      "Staff manually reading and routing every inbound WhatsApp, email, and SMS query.",
    afterDetail:
      "AI classifies and routes all queries automatically. Staff handle escalations only.",
  },
  {
    workflow: "Lead Response Time",
    beforeMetric: "2–3 days",
    afterMetric: "< 2 minutes",
    saved: "98%",
    savedLabel: "faster response",
    beforeDetail:
      "Sales team manually following up on web enquiries. High drop-off from slow response.",
    afterDetail:
      "AI qualifies leads instantly, scores by intent, and books discovery calls automatically.",
  },
  {
    workflow: "Order Status Queries",
    beforeMetric: "30–50 manual replies / day",
    afterMetric: "0 manual replies",
    saved: "100%",
    savedLabel: "queries automated",
    beforeDetail:
      "Customer service agents answering repetitive 'Where is my order?' messages individually.",
    afterDetail:
      "Automated order lookup and reply via WhatsApp. Zero agent involvement required.",
  },
];

export default function AutomationImpactSection() {
  return (
    <section id="impact" className="bg-[#080d18] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Heading ──────────────────────────────────────────── */}
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How We Measure{" "}
            <span className="gradient-text">Automation Impact</span>
          </h2>
          <p className="mt-4 text-slate-400">
            Every engagement starts with a documented baseline of your current
            process. These are representative results from Nigerian business
            workflows we have already mapped and automated.
          </p>
        </div>

        {/* ── Hero example ─────────────────────────────────────── */}
        <div className="mt-12 rounded-2xl border border-slate-800 bg-[#0d1320] p-8 sm:p-10">

          {/* Workflow label */}
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Example workflow — {hero.workflow}
          </p>

          {/* Before / After side by side */}
          <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_64px_1fr]">

            {/* Before */}
            <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Clock size={13} />
                Before
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-300 sm:text-4xl">
                {hero.before.metric}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                {hero.before.description}
              </p>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center">
              <ArrowRight size={24} className="text-[#d4a843]" />
            </div>

            {/* After */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                <CheckCircle2 size={13} />
                After
              </div>
              <p className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                {hero.after.metric}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {hero.after.description}
              </p>
            </div>
          </div>

          {/* Headline percentage */}
          <div className="mt-8 flex items-center gap-4 rounded-xl border border-[#d4a843]/20 bg-[#d4a843]/5 px-6 py-5">
            <TrendingDown size={28} className="shrink-0 text-[#d4a843]" />
            <div>
              <p className="text-4xl font-bold text-white sm:text-5xl">
                {hero.saved}
              </p>
              <p className="mt-0.5 text-sm text-slate-400">
                {hero.savedLabel}
              </p>
            </div>
            <p className="ml-auto max-w-sm text-sm leading-relaxed text-slate-500 text-right hidden sm:block">
              That is roughly 3 hours and 45 minutes returned to your team
              every single working day — from a single automated workflow.
            </p>
          </div>
        </div>

        {/* ── Supporting examples ──────────────────────────────── */}
        <div className="mt-8 space-y-4">
          {supporting.map((ex) => (
            <div
              key={ex.workflow}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-white">
                  {ex.workflow}
                </h3>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">
                  {ex.saved} {ex.savedLabel}
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr]">
                {/* Before */}
                <div className="rounded-lg border border-slate-700/50 bg-slate-800/20 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Before
                  </p>
                  <p className="mt-1.5 text-base font-bold text-slate-300">
                    {ex.beforeMetric}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{ex.beforeDetail}</p>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center">
                  <ArrowRight size={16} className="text-slate-600" />
                </div>

                {/* After */}
                <div className="rounded-lg border border-[#d4a843]/15 bg-[#d4a843]/5 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#d4a843]">
                    After
                  </p>
                  <p className="mt-1.5 text-base font-bold text-white">
                    {ex.afterMetric}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{ex.afterDetail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footnote */}
        <p className="mt-8 text-xs text-slate-700">
          Results shown are representative of structured workflow analysis
          conducted during client onboarding. Your baseline audit will produce
          figures specific to your actual processes and staff capacity.
        </p>
      </div>
    </section>
  );
}

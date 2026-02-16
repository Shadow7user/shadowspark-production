import { ArrowRight, Clock, CheckCircle } from "lucide-react";

const examples = [
  {
    workflow: "Customer Support Triage",
    before: { label: "Before", time: "4–6 hours/day", detail: "Staff manually reading, categorising, and routing inbound messages across WhatsApp, email, and SMS." },
    after:  { label: "After",  time: "18 min/day",   detail: "AI classifies and routes all inbound queries automatically. Staff only handle escalations requiring human judgment." },
    saved: "93%",
    savedLabel: "time saved on triage",
  },
  {
    workflow: "Lead Qualification",
    before: { label: "Before", time: "2–3 days",   detail: "Sales team manually following up on every web enquiry. High drop-off rate due to delayed response." },
    after:  { label: "After",  time: "Under 2 min", detail: "AI chatbot qualifies leads instantly, scores them by intent, and books discovery calls automatically." },
    saved: "98%",
    savedLabel: "reduction in lead response time",
  },
  {
    workflow: "Order Status Updates",
    before: { label: "Before", time: "30–50 replies/day", detail: "Customer service agents answering repetitive 'Where is my order?' queries individually." },
    after:  { label: "After",  time: "0 manual replies", detail: "Fully automated order status lookup and response via WhatsApp. Zero agent involvement." },
    saved: "100%",
    savedLabel: "of status queries automated",
  },
];

export default function AutomationImpactSection() {
  return (
    <section id="impact" className="bg-[#080d18] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How We Measure{" "}
            <span className="gradient-text">Automation Impact</span>
          </h2>
          <p className="mt-4 text-slate-400">
            Every deployment begins with a process audit. Below are
            representative before-and-after examples from common Nigerian
            business workflows. Actual results depend on your current process
            maturity and data quality.
          </p>
        </div>

        {/* Examples */}
        <div className="mt-12 space-y-6">
          {examples.map((ex) => (
            <div key={ex.workflow} className="glass-card rounded-2xl p-6 sm:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-base font-semibold text-white">
                  {ex.workflow}
                </h3>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">
                  {ex.saved} {ex.savedLabel}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr]">
                {/* Before */}
                <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <Clock size={13} /> {ex.before.label}
                  </div>
                  <p className="mt-3 text-lg font-bold text-slate-300">
                    {ex.before.time}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {ex.before.detail}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center text-[#d4a843]">
                  <ArrowRight size={20} />
                </div>

                {/* After */}
                <div className="rounded-xl border border-[#d4a843]/20 bg-[#d4a843]/5 p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#d4a843]">
                    <CheckCircle size={13} /> {ex.after.label}
                  </div>
                  <p className="mt-3 text-lg font-bold text-white">
                    {ex.after.time}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {ex.after.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-slate-600">
          * Examples are based on structured workflow analysis. Your baseline
          audit will produce figures specific to your business processes.
        </p>
      </div>
    </section>
  );
}

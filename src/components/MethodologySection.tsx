import Reveal from "@/components/Reveal";
import { Search, Wrench, TrendingUp } from "lucide-react";

const phases = [
  {
    phase: "Phase 1",
    duration: "Weeks 1–2",
    Icon: Search,
    title: "Assess",
    summary:
      "Every engagement begins with structured documentation of the current state. No configuration begins until the baseline is agreed in writing.",
    steps: [
      {
        label: "Discovery call",
        detail:
          "30-minute structured conversation covering team size, interaction volume by channel, existing systems, and the primary workflows you want to automate.",
      },
      {
        label: "Baseline documentation",
        detail:
          "We map the current workflow: where time is spent, where handoffs occur, what triggers follow-up, and what falls through the cracks. Delivered as a written document you retain.",
      },
      {
        label: "Integration scoping",
        detail:
          "Identify which of your existing systems (CRM, order database, payment gateway) need to connect to the automation engine and confirm API availability for each.",
      },
      {
        label: "ROI projection sign-off",
        detail:
          "Projected time savings and automation rates are calculated against your baseline figures and presented as explicit targets. You approve the targets before deployment begins.",
      },
    ],
    output: "Signed baseline document · agreed automation targets · integration map",
  },
  {
    phase: "Phase 2",
    duration: "Weeks 2–4",
    Icon: Wrench,
    title: "Deploy",
    summary:
      "Configuration, connection, and go-live. Every step is staged in a non-production environment before promotion.",
    steps: [
      {
        label: "Workflow configuration",
        detail:
          "Workflow logic, business rules, AI response scope, and escalation thresholds are configured in the staging environment using your approved baseline documentation.",
      },
      {
        label: "Integration connections",
        detail:
          "Your existing systems are connected via the Integration Layer. Credentials are tested, data mappings are verified, and edge cases are handled in staging.",
      },
      {
        label: "User acceptance testing",
        detail:
          "You or a nominated member of your team tests the workflows in the staging environment against realistic message scenarios. Issues are resolved before promotion.",
      },
      {
        label: "Team onboarding",
        detail:
          "Your team receives a structured walkthrough of the admin dashboard: workflow visibility, escalation handling, queue monitoring, and how to submit change requests.",
      },
      {
        label: "Go-live",
        detail:
          "Promotion to production after written sign-off. Live monitoring is active from the first interaction. ShadowSpark remains on standby for the first 48 hours post-launch.",
      },
    ],
    output: "Live production deployment · onboarded team · 48-hour hypercare window",
  },
  {
    phase: "Phase 3",
    duration: "Ongoing",
    Icon: TrendingUp,
    title: "Optimise",
    summary:
      "Performance against the agreed baseline targets is reviewed on a structured cycle. Improvements are data-driven, not speculative.",
    steps: [
      {
        label: "30-day performance review",
        detail:
          "Actual metrics compared against agreed targets: automated resolution rate, average response latency, staff time saved, escalation rate. Gaps trigger a structured remediation process.",
      },
      {
        label: "Workflow iteration",
        detail:
          "Patterns in escalated or unresolved interactions are reviewed. Workflow branches, business rules, or AI response scope are adjusted to reduce failure rates.",
      },
      {
        label: "90-day optimisation cycle",
        detail:
          "Quarterly review covering: performance trend, new interaction patterns, changes to your product or operations that require workflow updates, and expansion opportunities.",
      },
      {
        label: "Capability expansion",
        detail:
          "Once baseline workflows are stable, additional use cases — new channels, additional integration points, new workflow types — are scoped through the same Assess → Deploy process.",
      },
    ],
    output: "Monthly performance reports · quarterly review · structured expansion pathway",
  },
];

export default function MethodologySection() {
  return (
    <section id="methodology" className="bg-[#080d18] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <Reveal className="max-w-2xl">
          <p className="section-accent text-xs font-semibold uppercase tracking-widest text-[#d4a843]">
            Implementation Methodology
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How We Deploy
          </h2>
          <p className="mt-4 text-slate-400">
            ShadowSpark deployments follow a three-phase methodology
            regardless of client size. Each phase has defined inputs, defined
            outputs, and a client approval gate before the next phase begins.
            There is no black-box configuration period.
          </p>
        </Reveal>

        {/* Phase cards */}
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {phases.map(({ phase, duration, Icon, title, summary, steps, output }, i) => (
            <Reveal key={phase} className="flex flex-col" style={{ transitionDelay: `${i * 0.08}s` }}>
              <article className="card-lift flex h-full flex-col rounded-2xl border border-slate-800 bg-[#0d1320] hover:border-slate-700">

                {/* Card header */}
                <div className="border-b border-slate-800 px-7 py-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#d4a843]/10 text-[#d4a843]">
                      <Icon size={18} />
                    </div>
                    <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-500">
                      {duration}
                    </span>
                  </div>
                  <p className="mt-4 font-mono text-xs text-slate-600">{phase}</p>
                  <h3 className="mt-1 text-xl font-bold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{summary}</p>
                </div>

                {/* Steps */}
                <div className="flex-1 space-y-0 divide-y divide-slate-800/60 px-7 py-2">
                  {steps.map(({ label, detail }) => (
                    <div key={label} className="py-4">
                      <p className="text-sm font-semibold text-slate-200">{label}</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">{detail}</p>
                    </div>
                  ))}
                </div>

                {/* Output footer */}
                <div className="border-t border-slate-800 bg-slate-900/30 px-7 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Deliverables
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{output}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Timeline note */}
        <Reveal className="mt-10">
          <p className="text-xs text-slate-700">
            Timeline is indicative for standard Starter and Growth deployments.
            Enterprise deployments involving custom integrations or on-premise
            infrastructure are scoped individually — typical lead time is 4–8
            weeks. Complexity drives timeline; we do not artificially accelerate
            at the cost of accuracy.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

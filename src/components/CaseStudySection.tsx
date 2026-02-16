import { AlertCircle, Lightbulb, TrendingUp, FlaskConical } from "lucide-react";

// Both case studies are structured demo scenarios.
// Labelled clearly as demonstration environment throughout.
const caseStudies = [
  {
    id: "CS-001",
    sector: "Fintech · Lending Operations",
    title: "Workflow Automation for Loan Verification",
    environment: "Demonstration Environment",
    context:
      "A mid-sized Nigerian microfinance institution processing 80–120 loan applications per week. Verification was handled manually across three departments — document review, identity check, and credit scoring — with no shared system between them.",
    problem: {
      headline: "Manual verification delays slowing approval cycles",
      detail:
        "Each application moved between departments via email and WhatsApp. Handoff delays averaged 2–3 days per stage. Agents duplicated data entry across systems. Applications frequently stalled due to missing documents with no automated follow-up mechanism. End-to-end processing time: 9–14 working days.",
    },
    solution: {
      headline: "Automated workflow routing with AI document validation",
      detail:
        "ShadowSpark modelled a three-stage automation pipeline: (1) an intake bot collecting and pre-validating required documents via WhatsApp before the application enters the queue; (2) a workflow orchestrator routing complete applications directly to the correct department queue with zero manual handoff; (3) an AI validation layer flagging incomplete submissions and triggering automated follow-up messages to applicants.",
    },
    results: [
      { metric: "65%", label: "Reduction in end-to-end processing time" },
      { metric: "82%", label: "Of applications routed without manual handoff" },
      { metric: "3 days", label: "Average cycle time (down from 9–14 days)" },
      { metric: "0", label: "Manual follow-up messages sent by staff" },
    ],
    disclaimer:
      "Results are modelled against representative workflow data in a controlled demonstration environment. Production results depend on existing system architecture and data quality.",
  },
  {
    id: "CS-002",
    sector: "Retail & E-commerce · Customer Operations",
    title: "AI-Assisted Customer Support Automation",
    environment: "Demonstration Environment",
    context:
      "A Lagos-based e-commerce business processing 200–300 inbound WhatsApp messages per day with a customer service team of 6. The business operated across Lagos, Abuja, and Port Harcourt with a single shared inbox.",
    problem: {
      headline: "Support team consumed by repetitive, low-complexity queries",
      detail:
        "Approximately 70% of daily messages were order status enquiries, repeat FAQs, and return requests — all requiring the same information available in the order management system. Response times ranged from 3 to 12 hours. High volumes of unread messages during peak periods caused order abandonment. Staff had no visibility into backlog volume or resolution rate.",
    },
    solution: {
      headline: "WhatsApp automation integrated with order management system",
      detail:
        "ShadowSpark modelled a deployment connecting the business WhatsApp inbox to their order database via API. An AI layer handles classification: order status queries trigger automated lookup and response; FAQ requests resolve against a trained knowledge base; complaints and escalations route to the appropriate human agent with full context attached. A live BI dashboard surfaces queue depth, response time, and resolution rate in real time.",
    },
    results: [
      { metric: "91%", label: "Of queries resolved without staff involvement" },
      { metric: "18 min", label: "Daily staff time on order status (from 3 hrs)" },
      { metric: "< 90 sec", label: "Average automated response time" },
      { metric: "34%", label: "Increase in completed orders in modelled scenario" },
    ],
    disclaimer:
      "Figures represent a modelled demonstration scenario based on representative operational data. Live deployment results will be established through a baseline audit specific to your business.",
  },
];

export default function CaseStudySection() {
  return (
    <section id="case-studies" className="bg-[#0a0f1a] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#d4a843]">
            Case Studies
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Structured Automation Scenarios
          </h2>
          <p className="mt-4 text-slate-400">
            The following case studies are built from representative Nigerian
            business workflows and modelled in a controlled demonstration
            environment. Each follows the same structured methodology we apply
            to live client engagements: baseline documentation, solution
            scoping, and measurable outcome targets.
          </p>
          {/* Demo environment callout */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-xs text-slate-400">
            <FlaskConical size={13} className="shrink-0 text-[#d4a843]" />
            Both case studies are demonstration environment scenarios. Figures
            are modelled, not live client data.
          </div>
        </div>

        {/* Case study cards */}
        <div className="mt-14 space-y-12">
          {caseStudies.map((cs) => (
            <article
              key={cs.id}
              className="rounded-2xl border border-slate-800 bg-[#0d1320] overflow-hidden"
            >
              {/* Card header */}
              <div className="border-b border-slate-800 px-8 py-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-mono text-slate-600">{cs.id}</p>
                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-[#d4a843]">
                      {cs.sector}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs text-slate-400">
                    <FlaskConical size={11} />
                    {cs.environment}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-white">
                  {cs.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500">{cs.context}</p>
              </div>

              {/* Problem / Solution / Results grid */}
              <div className="grid md:grid-cols-3">

                {/* Problem */}
                <div className="border-b border-slate-800 px-8 py-7 md:border-b-0 md:border-r">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <AlertCircle size={13} className="text-red-400/70" />
                    Problem
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-200">
                    {cs.problem.headline}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {cs.problem.detail}
                  </p>
                </div>

                {/* Solution */}
                <div className="border-b border-slate-800 px-8 py-7 md:border-b-0 md:border-r">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <Lightbulb size={13} className="text-[#d4a843]" />
                    Solution
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-200">
                    {cs.solution.headline}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {cs.solution.detail}
                  </p>
                </div>

                {/* Results */}
                <div className="px-8 py-7">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <TrendingUp size={13} className="text-emerald-400" />
                    Result
                  </div>
                  <ul className="mt-4 space-y-4">
                    {cs.results.map((r) => (
                      <li key={r.label} className="flex items-start gap-3">
                        <span className="text-lg font-bold leading-none text-white">
                          {r.metric}
                        </span>
                        <span className="text-xs leading-snug text-slate-500">
                          {r.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="border-t border-slate-800 bg-slate-900/30 px-8 py-3">
                <p className="text-xs text-slate-700">{cs.disclaimer}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom note */}
        <p className="mt-10 text-xs text-slate-700">
          Live engagement case studies will be published as clients complete
          their 90-day review period. Full references available to enterprise
          prospects on request.
        </p>
      </div>
    </section>
  );
}

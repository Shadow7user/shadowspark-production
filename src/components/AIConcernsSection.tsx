import {
  DollarSign,
  ShieldCheck,
  Layers,
  BarChart2,
  CheckCircle2,
} from "lucide-react";

const concerns = [
  {
    icon: DollarSign,
    title: "Cost Transparency",
    summary:
      "You know exactly what you will pay before you commit. No surprises at invoice time.",
    points: [
      {
        label: "Modular pricing",
        detail:
          "Every plan is built from defined components — chatbot channels, message volume, dashboards, and workflow automations. You only pay for what you activate. If your needs grow, you add a module; you do not renegotiate the entire contract.",
      },
      {
        label: "No hidden fees",
        detail:
          "There are no setup charges, per-message surcharges beyond your tier, or mid-contract rate adjustments. The price on the pricing page is the price on your invoice. If you approach a usage limit, you receive advance notice — never a retroactive bill.",
      },
      {
        label: "Clear implementation roadmap",
        detail:
          "Before work begins, you receive a scoped document listing every deliverable, timeline, and cost. Changes to scope are agreed in writing before any additional cost is incurred. You control the engagement from day one.",
      },
    ],
  },
  {
    icon: ShieldCheck,
    title: "Security & Compliance",
    summary:
      "Your customer data is protected at every layer — technically and operationally.",
    points: [
      {
        label: "Encryption in transit & at rest",
        detail:
          "All data moving between your systems and ours is encrypted with TLS 1.3. Data stored in our databases and backups is encrypted with AES-256. Encryption keys are managed separately from data and rotated on a scheduled basis.",
      },
      {
        label: "NDPR awareness",
        detail:
          "We design our data handling processes in alignment with Nigeria's National Data Protection Regulation (NDPR). We do not sell, share, or use your customer data for any purpose outside your service agreement. Data Processing Addendums are available on request.",
      },
      {
        label: "Role-based access",
        detail:
          "Internal access to your data is restricted by role. No employee can access production data without a logged, authorised reason. Access rights are reviewed quarterly and revoked immediately when roles change.",
      },
      {
        label: "Secure hosting",
        detail:
          "Our infrastructure runs on enterprise-grade cloud providers with SOC 2 compliance, automatic failover, and isolated environments per client. Enterprise clients can request on-premise deployment within their own controlled infrastructure.",
      },
    ],
  },
  {
    icon: Layers,
    title: "Complexity Reduction",
    summary:
      "You do not need an in-house IT team to deploy or maintain our solutions.",
    points: [
      {
        label: "Guided onboarding",
        detail:
          "Every engagement begins with a structured onboarding session. We map your current workflow, identify automation opportunities, and configure the system to match how your team already works — not the other way around. You have a single named contact throughout.",
      },
      {
        label: "Integration support",
        detail:
          "We handle connection to your existing tools — WhatsApp Business, CRM systems, payment platforms, and spreadsheets. If an integration requires custom work, it is included in your scoped deliverables, not billed separately as an afterthought.",
      },
      {
        label: "Phased deployment",
        detail:
          "We do not go live with everything on day one. Each automation is deployed, tested, and signed off in phases. This protects your business from disruption and gives your team time to build confidence with each new capability before adding the next.",
      },
    ],
  },
  {
    icon: BarChart2,
    title: "ROI Measurement",
    summary:
      "You will know whether the investment is working — in numbers, not anecdotes.",
    points: [
      {
        label: "Before/after baseline analysis",
        detail:
          "Before deployment, we document your current process: time spent per task, volume of manual interactions, response times, and staff hours consumed. This baseline becomes the benchmark against which every improvement is measured.",
      },
      {
        label: "Time savings",
        detail:
          "After go-live, your 30-day performance report shows hours recovered per workflow. Common results include full elimination of repetitive support queries and multi-hour reductions in daily manual processing — each line item traced to a specific automation.",
      },
      {
        label: "Cost reduction tracking",
        detail:
          "We translate time savings into Naira value using your actual staff cost data (provided by you during onboarding). This gives you a direct comparison between the monthly subscription cost and the operational cost you have removed.",
      },
      {
        label: "Performance dashboards",
        detail:
          "Your live dashboard shows message volumes, response times, workflow completion rates, and lead conversion metrics in real time. You do not have to wait for a monthly report to know if something is underperforming — and neither do we.",
      },
    ],
  },
];

export default function AIConcernsSection() {
  return (
    <section id="concerns" className="bg-[#0a0f1a] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Addressing Your{" "}
            <span className="gradient-text">AI Concerns</span>
          </h2>
          <p className="mt-4 text-slate-400">
            Nigerian business owners ask the same four questions before
            committing to any technology investment. Below is exactly how we
            answer each one — with specifics, not marketing copy.
          </p>
        </div>

        {/* Blocks */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {concerns.map(({ icon: Icon, title, summary, points }) => (
            <div key={title} className="glass-card rounded-2xl p-8">

              {/* Block header */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#d4a843]/10 text-[#d4a843]">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{summary}</p>
                </div>
              </div>

              {/* Sub-points */}
              <ul className="mt-6 space-y-5">
                {points.map((pt) => (
                  <li key={pt.label} className="flex items-start gap-3">
                    <CheckCircle2
                      size={15}
                      className="mt-0.5 shrink-0 text-[#d4a843]"
                    />
                    <div>
                      <span className="text-sm font-medium text-slate-200">
                        {pt.label}
                      </span>
                      <p className="mt-1 text-sm leading-relaxed text-slate-400">
                        {pt.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

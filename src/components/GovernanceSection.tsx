import Reveal from "@/components/Reveal";
import {
  ClipboardCheck,
  SlidersHorizontal,
  GitMerge,
  HeadphonesIcon,
} from "lucide-react";

const pillars = [
  {
    number: "01",
    Icon: ClipboardCheck,
    title: "Pre-Deployment Sign-Off",
    description:
      "No workflow goes live without a documented sign-off. Before the first message is processed in production, the client reviews and approves: the workflow logic, the escalation rules, the integration connections, and the fallback behaviour for unrecognised inputs. Changes to any of these require a new approval cycle.",
    details: [
      "Written workflow specification delivered before configuration begins",
      "UAT environment mirrors production — client tests against real message scenarios",
      "Go-live gate: sign-off required from named client stakeholder",
      "All approved configurations are version-controlled and auditable",
    ],
  },
  {
    number: "02",
    Icon: SlidersHorizontal,
    title: "Client-Controlled Permissions",
    description:
      "The platform does not operate autonomously beyond the boundaries clients define. Clients retain direct control over which workflows are active, which channels are open, what the AI is permitted to respond to, and when to route to a human agent.",
    details: [
      "Workflow activation and deactivation via admin dashboard — no ShadowSpark action required",
      "AI response scope is configurable: restrict to defined topic categories",
      "Human escalation thresholds are set by the client, not defaulted by the platform",
      "Role-based dashboard access: define who on your team can view, edit, or approve",
    ],
  },
  {
    number: "03",
    Icon: GitMerge,
    title: "Change Management",
    description:
      "Post-deployment changes — new workflow branches, updated business rules, additional integrations — follow the same structured process as the initial deployment. No changes are pushed to production workflows without review.",
    details: [
      "Change requests submitted via the admin dashboard or support channel",
      "All changes staged in a non-production environment before promotion",
      "Client review and approval required before production push",
      "Change log maintained with timestamps, actor, and before/after states",
    ],
  },
  {
    number: "04",
    Icon: HeadphonesIcon,
    title: "SLA & Escalation Framework",
    description:
      "Support response times and escalation paths are defined by plan tier and are contractually committed on Enterprise. Operational issues — workflow failures, integration errors, delivery failures — are classified by severity with corresponding response obligations.",
    details: [
      "Critical (workflow down, data issue): 1-hour response, 4-hour resolution target",
      "High (degraded performance, partial failure): 4-hour response, 24-hour resolution target",
      "Standard (configuration question, change request): 1 business day response",
      "Enterprise clients receive a named account contact and scheduled review cadence",
    ],
  },
];

export default function GovernanceSection() {
  return (
    <section id="governance" className="bg-[#0a0f1a] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <Reveal className="max-w-2xl">
          <p className="section-accent text-xs font-semibold uppercase tracking-widest text-[#d4a843]">
            Control Framework
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Governance & Control Framework
          </h2>
          <p className="mt-4 text-slate-400">
            Enterprise automation deployments require defined governance
            boundaries — not just capable technology. ShadowSpark operates
            under four structural controls that define who can authorise what,
            when changes take effect, and what obligations the platform carries
            once deployed.
          </p>
        </Reveal>

        {/* Pillars */}
        <div className="mt-14 space-y-5">
          {pillars.map(({ number, Icon, title, description, details }, i) => (
            <Reveal key={number}>
              <div className="card-lift grid rounded-2xl border border-slate-800 bg-[#0d1320] hover:border-slate-700 lg:grid-cols-[72px_1fr_1fr]">

                {/* Number + icon column */}
                <div className="flex items-start gap-3 border-b border-slate-800 px-6 py-6 lg:flex-col lg:items-start lg:border-b-0 lg:border-r lg:gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#d4a843]/10 text-[#d4a843]">
                    <Icon size={18} />
                  </div>
                  <span className="font-mono text-xs text-slate-600 lg:mt-auto">{number}</span>
                </div>

                {/* Title + description */}
                <div className="border-b border-slate-800 px-7 py-6 lg:border-b-0 lg:border-r">
                  <h3 className="text-base font-semibold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{description}</p>
                </div>

                {/* Detail list */}
                <div className="px-7 py-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    In practice
                  </p>
                  <ul className="space-y-2.5">
                    {details.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-sm text-slate-400">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a843]/40" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

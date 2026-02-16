import {
  DollarSign,
  ShieldCheck,
  Layers,
  BarChart2,
} from "lucide-react";

const concerns = [
  {
    icon: DollarSign,
    title: "Cost Transparency",
    body: "Every plan has a fixed monthly price in Naira with no hidden setup fees, per-message surcharges, or mid-contract rate changes. You see the full cost before you sign. If your usage grows beyond a tier, we notify you in advance—never retroactively.",
  },
  {
    icon: ShieldCheck,
    title: "Security & Compliance",
    body: "All customer data is encrypted in transit (TLS 1.3) and at rest (AES-256). We operate in accordance with Nigeria's NDPR framework and do not sell or share your data with third parties. Access to production systems is role-based and fully audited.",
  },
  {
    icon: Layers,
    title: "Complexity Reduction",
    body: "Our onboarding process is structured to require zero in-house technical expertise. We handle integration, deployment, and maintenance. You receive a working automation within days, not months—and a single point of contact for all support.",
  },
  {
    icon: BarChart2,
    title: "ROI Measurement",
    body: "We provide a baseline audit before deployment and a 30-day performance report after go-live. Reports include time saved per workflow, cost-per-response reduction, and lead conversion delta—giving you concrete numbers to evaluate return.",
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
            We have spoken with Nigerian business owners. The concerns below
            come up consistently. Here is exactly how we address each one.
          </p>
        </div>

        {/* Blocks */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {concerns.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="glass-card rounded-2xl p-8"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#d4a843]/10 text-[#d4a843]">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

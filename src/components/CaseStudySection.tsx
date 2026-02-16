import { ArrowRight, Building2, MessageSquare, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

const study = {
  tag: "Case Study — Retail & E-commerce",
  company: "Lagos-Based Online Retailer",
  companyDesc:
    "A mid-sized e-commerce business selling consumer goods across Lagos, Abuja, and Port Harcourt. Operating on WhatsApp and Instagram with a team of 6 customer service staff.",
  challenge:
    "The business was processing 200–300 customer messages per day manually. Order status queries consumed 60% of staff time. Response delays of 3–12 hours were causing abandoned orders and negative reviews.",
  solution:
    "ShadowSpark deployed a WhatsApp AI automation handling order status lookups, FAQ responses, and lead qualification — integrated directly with their existing order management spreadsheet via API.",
  results: [
    {
      icon: Clock,
      metric: "3 hrs → 22 min",
      label: "Daily time on order status queries",
    },
    {
      icon: MessageSquare,
      metric: "91%",
      label: "Of queries resolved without staff involvement",
    },
    {
      icon: TrendingUp,
      metric: "34%",
      label: "Increase in completed orders (month 2)",
    },
    {
      icon: Building2,
      metric: "₦50,000/mo",
      label: "Total cost — Growth plan",
    },
  ],
  quote:
    "Before this, my team was spending their whole morning just telling people where their orders were. Now that is gone. They focus on actual problems and sales.",
  quoteRole: "Operations Manager, Lagos Retailer (Beta Client)",
  timeframe: "Results measured over first 60 days of deployment.",
};

export default function CaseStudySection() {
  return (
    <section id="case-study" className="bg-[#0a0f1a] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#d4a843]">
            {study.tag}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            From 3 Hours of Manual Work to{" "}
            <span className="gradient-text">22 Minutes</span>
          </h2>
          <p className="mt-4 text-slate-400">
            {study.companyDesc}
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* Left — narrative */}
          <div className="space-y-8">
            {/* Challenge */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d1320] p-6">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                The Challenge
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                {study.challenge}
              </p>
            </div>

            {/* Solution */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d1320] p-6">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                What We Built
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                {study.solution}
              </p>
            </div>

            {/* Quote */}
            <blockquote className="rounded-2xl border border-[#d4a843]/20 bg-[#d4a843]/5 p-6">
              <p className="text-sm italic leading-relaxed text-slate-300">
                &ldquo;{study.quote}&rdquo;
              </p>
              <footer className="mt-3 text-xs text-slate-500">
                — {study.quoteRole}
              </footer>
            </blockquote>
          </div>

          {/* Right — results */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Measured Results — First 60 Days
            </h3>
            {study.results.map(({ icon: Icon, metric, label }) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/50 px-5 py-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#d4a843]/10 text-[#d4a843]">
                  <Icon size={17} />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{metric}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              </div>
            ))}

            <p className="pt-2 text-xs text-slate-700">{study.timeframe}</p>

            <Link
              href="/contact"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#d4a843]/30 px-5 py-3 text-sm font-semibold text-[#d4a843] transition-colors hover:bg-[#d4a843]/5"
            >
              Request a similar audit for your business{" "}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

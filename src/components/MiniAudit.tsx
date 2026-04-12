"use client";

import Link from "next/link";

type RecommendedPackage = "launch" | "growth" | "automation";

type MiniAuditProps = {
  businessType: string;
  goals: string;
  features: string[];
  recommendedPackage: RecommendedPackage;
};

const packageMeta: Record<
  RecommendedPackage,
  { name: string; price: string; summary: string }
> = {
  launch: {
    name: "Launch",
    price: "₦30k/mo",
    summary: "Best for businesses that need a strong website foundation and cleaner lead capture.",
  },
  growth: {
    name: "Growth",
    price: "₦50k/mo",
    summary: "Best for teams ready to improve analytics, funnels, and conversion tracking.",
  },
  automation: {
    name: "Automation",
    price: "₦85k/mo",
    summary: "Best for businesses ready to automate WhatsApp, workflows, and qualification at scale.",
  },
};

export default function MiniAudit({
  businessType,
  goals,
  features,
  recommendedPackage,
}: MiniAuditProps) {
  const selectedPackage = packageMeta[recommendedPackage];
  const featureText =
    features.length > 0 ? features.join(", ") : "website and automation essentials";

  return (
    <section className="w-full max-w-3xl rounded-[2rem] border border-zinc-800 bg-zinc-950/90 p-6 text-zinc-100 shadow-[0_0_50px_rgba(0,229,255,0.08)] sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
        Your ShadowSpark Audit
      </p>

      <p className="mt-5 text-lg leading-8 text-zinc-300">
        Based on your <span className="text-white">{businessType}</span> business, your goal to{" "}
        <span className="text-white">{goals}</span>, and your need for{" "}
        <span className="text-white">{featureText}</span>, the best next step is a structured setup
        that turns more enquiries into qualified opportunities without slowing your team down.
      </p>

      <div className="mt-8 rounded-[1.5rem] border border-cyan-400/30 bg-cyan-400/10 p-6">
        <p className="text-sm uppercase tracking-[0.18em] text-cyan-100">Recommended Package</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-black text-white">{selectedPackage.name}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-200">{selectedPackage.summary}</p>
          </div>
          <p className="text-2xl font-black text-white">{selectedPackage.price}</p>
        </div>
      </div>

      <Link
        href="/checkout/new"
        className="mt-8 inline-flex rounded-full bg-[#00E5FF] px-6 py-3 text-sm font-bold text-black transition hover:brightness-110"
      >
        Proceed to Demo
      </Link>
    </section>
  );
}

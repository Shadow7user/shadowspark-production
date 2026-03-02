"use client";
import { usePageView, useTrackEvent } from "@/hooks/useAnalytics";
import WhatsAppLink from "@/components/WhatsAppLink";
import Link from "next/link";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCalculator from "@/components/PricingCalculator";

type Plan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  popular: boolean;
};

type FAQ = { q: string; a: string };

type Props = {
  plans: Plan[];
  faqs: FAQ[];
};

export default function PricingClient({ plans, faqs }: Props) {
  usePageView("Pricing");
  const trackEvent = useTrackEvent();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0f1a] pt-24">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Choose the plan that matches your growth stage. All plans include onboarding and access to the ShadowSpark AI support team.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500">
            <span>14-day free trial</span>
            <span>•</span>
            <span>Month-to-month billing</span>
            <span>•</span>
            <span>No hidden fees</span>
          </div>
        </section>

        {/* Plans */}
        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border border-slate-800 bg-[#0f1521] p-6 shadow-2xl transition-all hover:-translate-y-1 hover:border-[#d4a843]/40 ${
                  plan.popular ? "border-[#d4a843]/50 bg-gradient-to-b from-[#d4a843]/5 to-[#0f1521]" : ""
                }`}
              >
                {plan.popular && (
                  <span className="absolute right-4 top-4 rounded-full bg-[#d4a843]/20 px-3 py-1 text-xs font-semibold text-[#d4a843]">
                    Most popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-slate-500">{plan.period}</span>
                </div>
                <p className="mt-3 text-sm text-slate-400">{plan.description}</p>
                <ul className="mt-5 space-y-2 text-sm text-slate-300">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check size={16} className="mt-0.5 text-[#d4a843]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-col gap-3">
                  {plan.href.startsWith("http") ? (
                    <WhatsAppLink
                      href={plan.href}
                      source="pricing_plan"
                      className="w-full rounded-lg border border-[#d4a843]/30 px-4 py-2 text-center text-sm font-semibold text-[#d4a843] transition-colors hover:border-[#d4a843] hover:bg-[#d4a843]/10"
                      onClick={async () => {
                        await trackEvent("pricing_cta_clicked", { plan: plan.name.toLowerCase() });
                      }}
                    >
                      {plan.cta}
                    </WhatsAppLink>
                  ) : (
                    <Link
                      href={plan.href}
                      onClick={async () => {
                        await trackEvent("pricing_cta_clicked", { plan: plan.name.toLowerCase() });
                      }}
                      className="block rounded-lg bg-gradient-to-r from-[#d4a843] to-[#c0935a] px-4 py-2 text-center text-sm font-semibold text-white transition-all hover:from-[#e8c56d] hover:to-[#d4a843]"
                    >
                      {plan.cta}
                    </Link>
                  )}
                  <p className="text-center text-xs text-slate-500">
                    {plan.popular ? "Priority support included" : "Upgrade anytime"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cost estimator */}
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-800 bg-[#0f1521] p-6 shadow-2xl lg:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#d4a843]">
                  Plan simulator
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">Estimate your monthly cost</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Adjust your expected monthly messages to see a rough cost estimate before speaking with sales.
                </p>
              </div>
              <WhatsAppLink
                href="https://wa.me/2349037621612?text=Hi%2C%20I%20want%20to%20discuss%20pricing"
                source="pricing_hero"
                className="flex items-center gap-2 rounded-lg border border-[#d4a843]/30 px-4 py-2 text-sm font-semibold text-[#d4a843] transition-colors hover:border-[#d4a843] hover:bg-[#d4a843]/10"
              >
                Talk to sales on WhatsApp
              </WhatsAppLink>
            </div>
            <div className="mt-6">
              <PricingCalculator />
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-800 bg-[#0f1521] p-6 shadow-2xl lg:p-10">
            <h2 className="text-2xl font-bold text-white">Frequently asked questions</h2>
            <div className="mt-6 grid gap-4">
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3 text-sm text-slate-300 transition-all hover:border-slate-700"
                >
                  <summary className="flex cursor-pointer items-center justify-between text-white">
                    {faq.q}
                    <span className="text-[#d4a843] transition-transform group-open:rotate-180">⌄</span>
                  </summary>
                  <p className="mt-2 text-slate-400">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

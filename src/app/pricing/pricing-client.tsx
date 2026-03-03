"use client";

import WhatsAppLink from "@/components/WhatsAppLink";
import Link from "next/link";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCalculator, { LeadCapturePayload } from "@/components/PricingCalculator";
import { usePageView, useTrackEvent } from '@/hooks/useAnalytics';

const salesPhone = "2349037621612";
const salesHref = `https://wa.me/${salesPhone}?text=Hi%2C%20I%27d%20like%20a%20pricing%20quote%20for%20ShadowSpark`;

const plans = [
  {
    name: "Starter",
    price: "₦25,000",
    period: "/month",
    description: "For small businesses deploying a single AI automation channel",
    features: [
      "1 WhatsApp AI chatbot",
      "Up to 1,000 messages/month",
      "Basic analytics dashboard",
      "Email support",
      "Pre-built response templates",
      "Onboarding walkthrough included",
    ],
    cta: "Get Started",
    href: "/register",
    popular: false,
  },
  {
    name: "Growth",
    price: "₦50,000",
    period: "/month",
    description: "For businesses scaling across multiple channels and workflows",
    features: [
      "3 AI chatbots (WhatsApp, Web, SMS)",
      "Up to 10,000 messages/month",
      "Full BI dashboard with reports",
      "Lead capture & CRM integration",
      "Priority support (1-business-day SLA)",
      "Custom response training",
    ],
    cta: "Get Started",
    href: "/register",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Scoped solutions for organisations with complex or regulated workflows",
    features: [
      "Unlimited chatbots & channels",
      "Unlimited messages",
      "RPA workflow automation",
      "Dedicated account manager",
      "Custom AI model training",
      "SLA & uptime guarantee",
      "On-premise deployment option",
      "NDPR compliance documentation",
    ],
    cta: "Contact Sales",
    href: `https://wa.me/${salesPhone}?text=Hi%2C%20I%27m%20interested%20in%20the%20Enterprise%20plan`,
    popular: false,
  },
];

const faqs = [
  {
    q: "Can I try before I buy?",
    a: "Yes! Every plan comes with a 14-day free trial. No credit card required. You can also test our chatbot live on WhatsApp right now.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept bank transfers, card payments via Paystack, and USD payments for international clients.",
  },
  {
    q: "Can I upgrade or downgrade anytime?",
    a: "Absolutely. You can change your plan at any time. Upgrades take effect immediately, and downgrades apply at the next billing cycle.",
  },
  {
    q: "Do you offer custom integrations?",
    a: "Yes. Our Growth and Enterprise plans support custom integrations with your existing CRM, ERP, or payment systems.",
  },
];

export default function PricingClient() {
  usePageView('Pricing');
  const trackEvent = useTrackEvent();

  const handleLeadCapture = async (payload: LeadCapturePayload) => {
    const response = await fetch("/api/leads/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to capture lead");
    }
  };

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
            Fixed monthly prices in Naira. No hidden setup fees, no per-message
            surcharges, no long-term lock-in. Every plan includes onboarding
            and a 30-day performance report.
          </p>
        </section>

        {/* Plans */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? "border-2 border-[#d4a843] bg-[#0f1521]"
                    : "glass-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#d4a843] to-[#c0935a] px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-white">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  {plan.description}
                </p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-slate-500">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check
                        size={16}
                        className="mt-1 rounded-full bg-emerald-500/10 p-1 text-emerald-400"
                      />
                      <span className="text-slate-300">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-[#d4a843] to-[#c0935a] text-[#0f1521]"
                      : "border border-slate-700 text-white hover:border-[#d4a843]/60"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Calculator */}
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-800 bg-[#0d1320] p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-left">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#d4a843]">
                  ROI Calculator
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Estimate your payback period
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Model subscription fees, message volume, and support load to
                  quantify savings.
                </p>
              </div>
              <WhatsAppLink
                href={salesHref}
                source="pricing_page"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                onClick={async () => {
                  await trackEvent('whatsapp_cta_clicked', { source: 'pricing_page', phone: salesPhone });
                }}
              >
                Talk to sales →
              </WhatsAppLink>
            </div>

            <div className="mt-8">
              <PricingCalculator onCalculate={handleLeadCapture} />
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="mx-auto max-w-5xl px-4 pb-28 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#d4a843]">
                FAQ
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Pricing questions
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Answers to common questions about billing, upgrades, and
                onboarding.
              </p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-xl border border-slate-800 bg-[#0d1320] p-5"
                >
                  <h3 className="text-base font-semibold text-white">
                    {faq.q}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import WhatsAppLink from "@/components/WhatsAppLink";
import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCalculator from "@/components/PricingCalculator";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Affordable AI chatbot, BI dashboard, and automation plans for Nigerian businesses. Starting from \u20A650,000/month.",
  openGraph: {
    title: "ShadowSpark Pricing",
    description:
      "Affordable AI solutions for Nigerian businesses. Plans from \u20A650,000/month.",
  },
};

const plans = [
  {
    name: "Starter",
    price: "\u20A650,000",
    period: "/month",
    description: "Perfect for small businesses getting started with AI",
    features: [
      "1 WhatsApp AI chatbot",
      "Up to 1,000 messages/month",
      "Basic analytics dashboard",
      "Email support",
      "Pre-built response templates",
    ],
    cta: "Start Free Trial",
    href: "/register",
    popular: false,
  },
  {
    name: "Growth",
    price: "\u20A6150,000",
    period: "/month",
    description: "For growing businesses that need more power",
    features: [
      "3 AI chatbots (WhatsApp, Web, SMS)",
      "Up to 10,000 messages/month",
      "Full BI dashboard with reports",
      "Lead capture & CRM integration",
      "Priority support",
      "Custom response training",
    ],
    cta: "Start Free Trial",
    href: "/register",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for large organizations",
    features: [
      "Unlimited chatbots & channels",
      "Unlimited messages",
      "RPA workflow automation",
      "Dedicated account manager",
      "Custom AI model training",
      "SLA & uptime guarantee",
      "On-premise deployment option",
    ],
    cta: "Contact Sales",
    href: "https://wa.me/2349037621612?text=Hi%2C%20I%27m%20interested%20in%20the%20Enterprise%20plan",
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

export default function PricingPage() {
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
            No hidden fees. No long-term contracts. Start with a free trial and
            scale as you grow.
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
                        className="mt-0.5 shrink-0 text-[#d4a843]"
                      />
                      <span className="text-slate-300">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  {plan.href.startsWith("/") ? (
                    <Link
                      href={plan.href}
                      className={`block rounded-lg px-4 py-3 text-center text-sm font-semibold transition-all ${
                        plan.popular
                          ? "bg-gradient-to-r from-[#d4a843] to-[#c0935a] text-white hover:from-[#e8c56d] hover:to-[#d4a843]"
                          : "border border-slate-700 text-slate-300 hover:border-[#d4a843] hover:text-[#d4a843]"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  ) : (
                    <WhatsAppLink
                      href={plan.href}
                      source="pricing_page"
                      className={`block rounded-lg px-4 py-3 text-center text-sm font-semibold transition-all ${
                        plan.popular
                          ? "bg-gradient-to-r from-[#d4a843] to-[#c0935a] text-white hover:from-[#e8c56d] hover:to-[#d4a843]"
                          : "border border-slate-700 text-slate-300 hover:border-[#d4a843] hover:text-[#d4a843]"
                      }`}
                    >
                      {plan.cta}
                    </WhatsAppLink>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Calculator */}
        <PricingCalculator />

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-white">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
          <div className="mt-12 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="glass-card rounded-xl p-6">
                <h3 className="font-semibold text-white">{faq.q}</h3>
                <p className="mt-2 text-sm text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-[#d4a843]/10 to-[#c0935a]/10 p-8 text-center md:p-12">
            <h2 className="text-2xl font-bold text-white">
              Not sure which plan is right?
            </h2>
            <p className="mt-2 text-slate-400">
              Chat with us on WhatsApp and we&apos;ll recommend the best fit for
              your business.
            </p>
            <WhatsAppLink
              href="https://wa.me/2349037621612?text=Hi%2C%20I%20need%20help%20choosing%20a%20plan"
              source="pricing_page"
              className="mt-6 inline-block rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Chat on WhatsApp
            </WhatsAppLink>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

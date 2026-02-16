import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import WhatsAppLink from "@/components/WhatsAppLink";

const plans = [
  {
    name: "Starter",
    price: "₦25,000",
    period: "/month",
    tagline: "One channel. One automation. Immediate results.",
    highlight: false,
    features: [
      "1 WhatsApp AI chatbot",
      "Up to 1,000 messages/month",
      "Analytics dashboard",
      "Pre-built response templates",
      "Onboarding walkthrough",
    ],
    cta: "Get Started",
    href: "/register",
    waLink: null,
  },
  {
    name: "Growth",
    price: "₦50,000",
    period: "/month",
    tagline: "Multiple channels. Full automation. Priority support.",
    highlight: true,
    features: [
      "3 chatbots — WhatsApp, Web, SMS",
      "Up to 10,000 messages/month",
      "Full BI dashboard & reports",
      "Lead capture & CRM integration",
      "1-business-day support SLA",
      "Custom response training",
    ],
    cta: "Get Started",
    href: "/register",
    waLink: null,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    tagline: "Complex workflows. Dedicated support. NDPR docs.",
    highlight: false,
    features: [
      "Unlimited chatbots & channels",
      "RPA workflow automation",
      "Dedicated account manager",
      "Custom AI model training",
      "SLA & uptime guarantee",
      "NDPR compliance documentation",
    ],
    cta: "Contact Sales",
    href: null,
    waLink:
      "https://wa.me/2349037621612?text=Hi%2C%20I%27m%20interested%20in%20the%20Enterprise%20plan",
  },
];

export default function PricingPreview() {
  return (
    <section id="pricing-preview" className="bg-[#0a0f1a] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Transparent Pricing —{" "}
            <span className="gradient-text">Fixed in Naira</span>
          </h2>
          <p className="mt-4 text-slate-400">
            No setup fees. No per-message charges beyond your tier. No
            mid-contract increases. The price you see is the price you pay.
          </p>
        </div>

        {/* Plans */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-8 ${
                plan.highlight
                  ? "border-2 border-[#d4a843] bg-[#0f1521]"
                  : "glass-card"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#d4a843] to-[#c0935a] px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}

              {/* Name + price */}
              <div>
                <h3 className="text-base font-semibold text-white">
                  {plan.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500">{plan.tagline}</p>
                <div className="mt-5">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="ml-1 text-sm text-slate-500">
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check
                      size={14}
                      className="mt-0.5 shrink-0 text-[#d4a843]"
                    />
                    <span className="text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-8">
                {plan.waLink ? (
                  <WhatsAppLink
                    href={plan.waLink}
                    source="pricing_preview"
                    className="block rounded-lg border border-slate-700 px-4 py-3 text-center text-sm font-semibold text-slate-300 transition-all hover:border-[#d4a843] hover:text-[#d4a843]"
                  >
                    {plan.cta}
                  </WhatsAppLink>
                ) : (
                  <Link
                    href={plan.href!}
                    className={`block rounded-lg px-4 py-3 text-center text-sm font-semibold transition-all ${
                      plan.highlight
                        ? "bg-gradient-to-r from-[#d4a843] to-[#c0935a] text-white hover:from-[#e8c56d] hover:to-[#d4a843]"
                        : "border border-slate-700 text-slate-300 hover:border-[#d4a843] hover:text-[#d4a843]"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Link to full pricing page */}
        <div className="mt-8 text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-[#d4a843]"
          >
            View full pricing page with calculator and FAQ
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

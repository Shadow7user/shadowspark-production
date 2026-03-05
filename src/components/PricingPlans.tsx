'use client';
import Link from "next/link";
import { Check } from "lucide-react";
import WhatsAppLink from "@/components/WhatsAppLink";
import { useTrackEvent } from '@/hooks/useAnalytics';

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  popular: boolean;
}

export default function PricingPlans({ plans }: { plans: Plan[] }) {
  const trackEvent = useTrackEvent();

  return (
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
          <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
          <p className="mt-1 text-sm text-slate-400">{plan.description}</p>
          <div className="mt-6">
            <span className="text-4xl font-bold text-white">{plan.price}</span>
            <span className="text-slate-500">{plan.period}</span>
          </div>
          <ul className="mt-6 space-y-3">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check size={16} className="mt-0.5 shrink-0 text-[#d4a843]" />
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
                onClick={async () => {
                  await trackEvent('pricing_cta_clicked', { plan: plan.name.toLowerCase() });
                }}
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
                onClick={async () => {
                  await trackEvent('pricing_cta_clicked', { plan: plan.name.toLowerCase() });
                }}
              >
                {plan.cta}
              </WhatsAppLink>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

import type { Metadata } from "next";
import PricingClient from "./pricing-client";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent AI automation pricing for Nigerian businesses. Starter from ₦25,000/month. No hidden fees. Month-to-month billing.",
  alternates: {
    canonical: "https://shadowspark-tech.org/pricing",
  },
  openGraph: {
    title: "Pricing | ShadowSpark",
    description:
      "Transparent AI automation pricing for Nigerian businesses. Plans from ₦25,000/month. No long-term contracts.",
    url: "https://shadowspark-tech.org/pricing",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Pricing | ShadowSpark",
    description: "AI automation plans from ₦25,000/month. No hidden fees. Month-to-month.",
  },
};

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
  return <PricingClient plans={plans} faqs={faqs} />;
}

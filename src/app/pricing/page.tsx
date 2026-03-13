import type { Metadata } from "next";
import PricingPageClient from "./PricingPageClient";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent AI automation pricing for Nigerian businesses. Starter from ₦25,000/month. No hidden fees. Month-to-month billing.",
  alternates: {
    canonical: "https://shadowspark-tech.site/pricing",
  },
  openGraph: {
    title: "Pricing | ShadowSpark",
    description:
      "Transparent AI automation pricing for Nigerian businesses. Plans from ₦25,000/month. No long-term contracts.",
    url: "https://shadowspark-tech.site/pricing",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Pricing | ShadowSpark",
    description: "AI automation plans from ₦25,000/month. No hidden fees. Month-to-month.",
  },
};

export default function PricingPage() {
  return <PricingPageClient />;
}

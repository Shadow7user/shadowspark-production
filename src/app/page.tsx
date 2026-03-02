import type { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "Enterprise AI Automation for Nigerian Businesses",
  description:
    "ShadowSpark Technologies delivers enterprise-structured AI automation — WhatsApp chatbots, workflow orchestration, and BI dashboards — built for measurable growth in Nigeria.",
  alternates: {
    canonical: "https://shadowspark-tech.org",
  },
  openGraph: {
    title: "Enterprise AI Automation for Nigerian Businesses | ShadowSpark",
    description:
      "AI chatbots, workflow automation, and BI dashboards for Nigerian SMEs and enterprises. Transparent pricing. Measurable ROI from day one.",
    url: "https://shadowspark-tech.org",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Enterprise AI Automation for Nigerian Businesses | ShadowSpark",
    description:
      "AI chatbots, workflow automation, and BI dashboards for Nigerian businesses. Measurable ROI from day one.",
  },
};

export default function Home() {
  return <HomeClient />;
}

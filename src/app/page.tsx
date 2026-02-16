import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LiveTicker from "@/components/LiveTicker";
import FeaturesSection from "@/components/FeaturesSection";
import SolutionsSection from "@/components/SolutionsSection";
import TechLogos from "@/components/TechLogos";
import PlatformArchitecture from "@/components/PlatformArchitecture";
import TechStackSection from "@/components/TechStackSection";
import SecurityBadges from "@/components/SecurityBadges";
import AIConcernsSection from "@/components/AIConcernsSection";
import AutomationImpactSection from "@/components/AutomationImpactSection";
import CaseStudySection from "@/components/CaseStudySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import StatsSection from "@/components/StatsSection";
import PricingPreview from "@/components/PricingPreview";
import RequestDemoSection from "@/components/RequestDemoSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Enterprise AI Automation for Nigerian Businesses",
  description:
    "ShadowSpark Technologies delivers enterprise-structured AI automation — WhatsApp chatbots, workflow orchestration, and BI dashboards — built for measurable growth in Nigeria.",
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
  return (
    <ErrorBoundary>
      <Navbar />
      <HeroSection />
      <LiveTicker />
      <SecurityBadges />        {/* Trust anchors early — right after the hook */}
      <FeaturesSection />
      <SolutionsSection />
      <PlatformArchitecture />  {/* How the system works — enterprise buyers */}
      <TechStackSection />      {/* Infrastructure transparency */}
      <TechLogos />
      <AIConcernsSection />     {/* Neutralise objections */}
      <AutomationImpactSection /> {/* Prove ROI with numbers */}
      <CaseStudySection />       {/* Validate with a real story */}
      <TestimonialsSection />    {/* Social proof */}
      <StatsSection />
      <PricingPreview />         {/* Remove price ambiguity */}
      <RequestDemoSection />     {/* Clear, low-friction CTA */}
      <CTASection />
      <Footer />
      <ChatWidget />
    </ErrorBoundary>
  );
}

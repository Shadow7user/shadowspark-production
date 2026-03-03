"use client";

import { usePageView } from '@/hooks/useAnalytics';

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
import FAQSection from "@/components/FAQSection";
import IndustrySectorsSection from "@/components/IndustrySectorsSection";
import GovernanceSection from "@/components/GovernanceSection";
import MethodologySection from "@/components/MethodologySection";

export default function HomeClient() {
  usePageView('Homepage');

  return (
    <ErrorBoundary>
      <Navbar />
      <HeroSection />
      <LiveTicker />
      <SecurityBadges />        {/* Trust anchors early — right after the hook */}
      <IndustrySectorsSection /> {/* Sector breadth — who this is for */}
      <FeaturesSection />
      <SolutionsSection />
      <PlatformArchitecture />  {/* How the system works — enterprise buyers */}
      <TechStackSection />      {/* Infrastructure transparency */}
      <GovernanceSection />     {/* Control framework — enterprise buyers */}
      <TechLogos />
      <AIConcernsSection />     {/* Neutralise objections */}
      <MethodologySection />    {/* Structured process after concerns */}
      <AutomationImpactSection /> {/* Prove ROI with numbers */}
      <CaseStudySection />       {/* Validate with a real story */}
      <TestimonialsSection />    {/* Social proof */}
      <StatsSection />
      <PricingPreview />         {/* Remove price ambiguity */}
      <FAQSection />              {/* Cost · Security · ROI · Implementation */}
      <RequestDemoSection />     {/* Clear, low-friction CTA */}
      <CTASection />
      <Footer />
      <ChatWidget />
    </ErrorBoundary>
  );
}

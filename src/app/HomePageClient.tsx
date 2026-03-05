'use client';
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

export default function HomePageClient() {
  usePageView('Homepage');

  return (
    <ErrorBoundary>
      <Navbar />
      <HeroSection />
      <LiveTicker />
      <SecurityBadges />
      <IndustrySectorsSection />
      <FeaturesSection />
      <SolutionsSection />
      <PlatformArchitecture />
      <TechStackSection />
      <GovernanceSection />
      <TechLogos />
      <AIConcernsSection />
      <MethodologySection />
      <AutomationImpactSection />
      <CaseStudySection />
      <TestimonialsSection />
      <StatsSection />
      <PricingPreview />
      <FAQSection />
      <RequestDemoSection />
      <CTASection />
      <Footer />
      <ChatWidget />
    </ErrorBoundary>
  );
}

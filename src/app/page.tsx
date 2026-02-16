import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LiveTicker from "@/components/LiveTicker";
import FeaturesSection from "@/components/FeaturesSection";
import SolutionsSection from "@/components/SolutionsSection";
import TechLogos from "@/components/TechLogos";
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

export default function Home() {
  return (
    <ErrorBoundary>
      <Navbar />
      <HeroSection />
      <LiveTicker />
      <SecurityBadges />        {/* Trust anchors early — right after the hook */}
      <FeaturesSection />
      <SolutionsSection />
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

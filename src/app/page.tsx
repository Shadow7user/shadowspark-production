import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LiveTicker from "@/components/LiveTicker";
import FeaturesSection from "@/components/FeaturesSection";
import SolutionsSection from "@/components/SolutionsSection";
import TechLogos from "@/components/TechLogos";
import AIConcernsSection from "@/components/AIConcernsSection";
import AutomationImpactSection from "@/components/AutomationImpactSection";
import StatsSection from "@/components/StatsSection";
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
      <FeaturesSection />
      <SolutionsSection />
      <TechLogos />
      <AIConcernsSection />
      <AutomationImpactSection />
      <StatsSection />
      <CTASection />
      <Footer />
      <ChatWidget />
    </ErrorBoundary>
  );
}

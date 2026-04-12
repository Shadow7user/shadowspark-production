'use client';
import { usePageView } from '@/hooks/useAnalytics';

import Hero from "@/components/marketing/Hero";
import CTABlock from "@/components/marketing/CTABlock";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import ErrorBoundary from "@/components/ErrorBoundary";
import WhatWeDoSlideshow from "@/components/marketing/WhatWeDoSlideshow";

export default function HomePageClient() {
  usePageView('Homepage');

  return (
    <ErrorBoundary>
      <Hero />
      <WhatWeDoSlideshow />
      <CTABlock />
      <Footer />
      <ChatWidget />
    </ErrorBoundary>
  );
}

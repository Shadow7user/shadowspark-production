"use client";

// ...existing code...
import FreeAIAuditSection from "@/components/marketing/FreeAIAuditSection";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <HeroSection />
      {/* <ChatbotDemo id="demo" /> */}
      {/* <MetricsCarousel /> */}
      <FreeAIAuditSection />
    </main>
  );
}

function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Subtle animated grid background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      {/* Pulsing orb for depth */}
      {!shouldReduceMotion && (
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-125 md:w-200 h-125 md:h-200 bg-linear-to-br from-cyan-600/20 to-purple-600/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <div className="relative z-10 container mx-auto px-6 text-center space-y-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-cyan-500/40 bg-black/40 backdrop-blur-md"
        >
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span className="text-sm md:text-base font-medium text-cyan-200">
            Agentic AI Automation – Enterprise-Grade Intelligence
          </span>
        </motion.div>

        <h1
          id="hero-heading"
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none"
        >
          Unlock Infinite Scale with
          <br className="hidden md:block" />
          <span className="bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Autonomous AI Workflows
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Deploy intelligent agents that plan, reason, and execute autonomously
          — handling customer interactions, operations, and platforms 24/7.
          Achieve up to 95% automation with seamless integration and
          governance-first design. Built on proven, scalable stacks trusted by
          global innovators.
        </p>

        {/* CTA + urgency block remains the same – strong multi-path funnel */}
        {/* ... rest of your CTA grid, avatars, limited slots ... */}
      </div>
    </section>
  );
}

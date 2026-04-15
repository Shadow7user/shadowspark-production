"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Eye,
  Globe,
  MessageSquare,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { AuroraBackground } from "@/components/ui/templates/AuroraBackground";
import { GlassCard } from "@/components/ui/templates/GlassCard";
import { SovereignHero } from "@/components/ui/templates/SovereignHero";
import { AppleCardsCarousel } from "@/components/ui/apple-cards-carousel";

const layers = [
  {
    id: "presence",
    step: "Layer 1",
    title: "Presence Infrastructure",
    shortLabel: "The Foundation",
    icon: Globe,
    problem:
      "Most websites are slow, generic, and act as passive information boards. They don't guide the user towards a conversion, causing high bounce rates and wasted ad spend.",
    solution:
      "High-performance, edge-deployed digital environments designed exclusively for conversion. We build the optimal path for user action.",
    features: [
      "Sub-second global page loads (Next.js 15).",
      "Conversion-architected layouts and psychology-driven UI.",
      "Frictionless lead capture forms and smart CTAs.",
      "Enterprise-grade security and hosting.",
    ],
  },
  {
    id: "conversation",
    step: "Layer 2",
    title: "Conversation Intelligence",
    shortLabel: "The AI Operator",
    icon: MessageSquare,
    problem:
      "Leads expect replies in seconds, not hours. Manual handling of WhatsApp and web chat leads to dropped conversations, cold prospects, and overwhelmed staff.",
    solution:
      "An intelligent, always-on AI assistant integrated directly into WhatsApp and your website, instantly engaging and qualifying every inquiry.",
    features: [
      "Instant AI response to WhatsApp & Web inquiries (24/7/365).",
      "Dynamic lead qualification flows (budget, timeline, intent).",
      "Multi-lingual support and natural conversation handling.",
      "Spam filtering and basic FAQ resolution.",
    ],
  },
  {
    id: "automation",
    step: "Layer 3",
    title: "Automation Engine",
    shortLabel: "The Workflow",
    icon: Workflow,
    problem:
      "Getting the lead is only half the battle. Follow-ups are inconsistent, data gets lost between platforms, and manual scheduling causes endless back-and-forth.",
    solution:
      "Invisible background logic that connects the dots. We automate the repetitive tasks between capture and closing.",
    features: [
      "Automated multi-channel follow-up sequences.",
      "Seamless booking and calendar integration.",
      "Direct payment processing within conversational flows.",
      "Conditional routing (e.g., send high-value leads directly to senior reps).",
    ],
  },
  {
    id: "visibility",
    step: "Layer 4",
    title: "Operator Visibility",
    shortLabel: "The Command Center",
    icon: Eye,
    problem:
      "Sales teams are flying blind, lacking context when they finally take over a conversation. Data is siloed, making it impossible to measure system performance or pinpoint drop-offs.",
    solution:
      "A centralized, unified dashboard where human operators take control. See exactly what the AI has done and step in seamlessly.",
    features: [
      "Unified lead pipeline and conversation history.",
      "Real-time system health and conversion analytics.",
      "\"Handoff\" alerts for high-value or complex queries.",
      "One-click approval flows for quotes and proposals.",
    ],
  },
];

const architectureChecks = [
  "If one layer is broken, revenue leaks.",
  "Every layer contributes to a single conversion path.",
  "Zero leakage from first click to final conversion.",
];

export default function SolutionsPage() {
  const [activeLayerId, setActiveLayerId] = useState(layers[0].id);
  const activeLayer = layers.find((layer) => layer.id === activeLayerId) ?? layers[0];

  return (
    <AuroraBackground className="min-h-screen font-sans text-zinc-400 selection:bg-cyan-500/30">
      <SovereignHero
        headline={
          <>
            The Anatomy of an <span className="text-cyan-500">Autonomous Revenue System</span>
          </>
        }
        subheadline="Four integrated layers working in unison to capture attention, qualify intent, and convert leads without manual delay."
        ctaText="Start Qualification Audit"
        ctaLink="/checkout/new"
        secondaryCtaText="View Industry Applications"
        secondaryCtaLink="/industries"
      />

      <section className="border-t border-zinc-900 bg-zinc-950/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45 }}
            className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.28em] text-cyan-400/80">
                Architecture Overview
              </p>
              <h2 className="mt-4 text-3xl font-bold text-white md:text-5xl">
                Beyond the Website.
              </h2>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-300">
                A website alone is a digital brochure—it waits for customers to act.
                ShadowSpark deploys an active infrastructure. We break revenue generation
                down into four distinct, automated layers. If one layer is broken, revenue
                leaks. Our systems ensure zero leakage from first click to final conversion.
              </p>
            </div>

            <GlassCard
              title="System Integrity"
              description="Autonomous revenue systems do not rely on one page or one channel. They rely on layer coordination."
              icon={<ShieldCheck className="h-6 w-6" />}
              highlighted
            >
              <div className="space-y-3">
                {architectureChecks.map((check) => (
                  <div
                    key={check}
                    className="rounded-2xl border border-cyan-500/15 bg-black/30 px-4 py-4"
                  >
                    <p className="text-sm leading-6 text-zinc-300">{check}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-mono uppercase tracking-[0.28em] text-cyan-400/80">
              Four Layers of Growth
            </p>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-5xl">
              Revenue systems fail where layers disconnect.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-zinc-300">
              Select a layer to inspect the leakage point, the ShadowSpark system response,
              and the exact feature set that closes the gap.
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              {layers.map((layer, index) => {
                const isActive = layer.id === activeLayerId;

                return (
                  <motion.button
                    key={layer.id}
                    type="button"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    onClick={() => setActiveLayerId(layer.id)}
                    className="text-left"
                  >
                    <GlassCard
                      title={layer.title}
                      description={layer.shortLabel}
                      icon={<layer.icon className="h-6 w-6" />}
                      highlighted={isActive}
                      className={
                        isActive
                          ? "h-full border-cyan-400/40 bg-cyan-400/[0.08]"
                          : "h-full"
                      }
                    >
                      <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                        <p className="text-xs font-mono uppercase tracking-[0.22em] text-cyan-300/80">
                          {layer.step}
                        </p>
                        <span className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500">
                          {isActive ? "Active Layer" : "Inspect"}
                        </span>
                      </div>
                    </GlassCard>
                  </motion.button>
                );
              })}
            </div>

            <motion.div
              key={activeLayer.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <GlassCard
                title={`${activeLayer.title} (${activeLayer.shortLabel})`}
                description={activeLayer.solution}
                icon={<activeLayer.icon className="h-6 w-6" />}
                highlighted
                className="h-full"
              >
                <div className="grid gap-6">
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                    <p className="text-xs font-mono uppercase tracking-[0.22em] text-red-300/80">
                      Problem Statement
                    </p>
                    <p className="mt-3 text-sm leading-6 text-zinc-300">
                      {activeLayer.problem}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5">
                    <p className="text-xs font-mono uppercase tracking-[0.22em] text-cyan-300/80">
                      ShadowSpark Solution
                    </p>
                    <p className="mt-3 text-sm leading-6 text-zinc-200">
                      {activeLayer.solution}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-mono uppercase tracking-[0.22em] text-zinc-500">
                      Specific Features
                    </p>
                    <div className="mt-4 grid gap-3">
                      {activeLayer.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-4"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                          <p className="text-sm leading-6 text-zinc-300">{feature}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-900 bg-zinc-950/45 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-xs font-mono uppercase tracking-[0.28em] text-cyan-400/80">
              AI-Human Bridge
            </p>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-5xl">
              AI when you need speed. Humans when you need empathy.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-zinc-300">
              Our systems aren't designed to replace your sales team; they are designed
              to protect their time. The system handles the 80% of repetitive, low-value
              interactions, seamlessly handing off the qualified 20% to your operators
              with full context.
            </p>
          </motion.div>

          <GlassCard
            title="Autonomous Systems + Human Oversight"
            description="Automation owns speed, repetition, and qualification. Operators step in where judgment and trust matter most."
            icon={<Bot className="h-6 w-6" />}
            highlighted
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-cyan-500/15 bg-black/30 p-4">
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-cyan-300/80">
                  Autonomous 80%
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  Instant replies, qualification, routing, reminders, and repetitive follow-up.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500">
                  Human 20%
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  Complex objections, pricing nuance, approvals, and relationship-driven closing.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="py-24 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45 }}
            className="rounded-[2rem] border border-cyan-500/20 bg-gradient-to-b from-cyan-500/10 to-transparent px-8 py-12"
          >
            <p className="text-xs font-mono uppercase tracking-[0.28em] text-cyan-300/80">
              Final CTA
            </p>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-5xl">
              Stop losing leads to slow responses.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300">
              Deploy the four layers and start converting traffic on autopilot.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/checkout/new"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-8 py-4 font-bold text-black transition-all hover:bg-cyan-400"
              >
                Deploy My System
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-zinc-700 px-8 py-4 font-medium text-white transition-all hover:bg-white/5"
              >
                Book Enterprise Call
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </AuroraBackground>
  );
}

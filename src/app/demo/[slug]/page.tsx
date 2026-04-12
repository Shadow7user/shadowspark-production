"use client";
export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import MiniAudit from "@/components/MiniAudit";
import AssistantBubble from "@/components/ui/AssistantBubble";

import GlassCard from "@/components/ui/GlassCard";

type DemoData = {
  id: string;
  businessName: string;
  niche: string;
  packageRecommendation: string;
  createdAt: string;
};

function isExpired(createdAt: string) {
  const createdTime = new Date(createdAt).getTime();
  if (Number.isNaN(createdTime)) return false;
  return Date.now() - createdTime > 48 * 60 * 60 * 1000;
}

function normalizeTier(tier: string): "launch" | "growth" | "automation" {
  const normalized = tier.toLowerCase();
  if (normalized.includes("auto")) return "automation";
  if (normalized.includes("growth")) return "growth";
  return "launch";
}

function displayTier(tier: "launch" | "growth" | "automation") {
  if (tier === "automation") return "Autonomous";
  if (tier === "growth") return "Growth";
  return "Launch";
}

export default function DemoPreviewPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const [demo, setDemo] = useState<DemoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDemo() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/demo/${encodeURIComponent(slug)}`);
        const result = await response.json().catch(() => null);

        if (!response.ok || !result) {
          throw new Error(result?.error || "Unable to load demo preview.");
        }

        if (active) setDemo(result);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load demo preview.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    if (slug) loadDemo();

    return () => {
      active = false;
    };
  }, [slug]);

  const recommendedTier = useMemo(
    () => normalizeTier(demo?.packageRecommendation ?? "launch"),
    [demo?.packageRecommendation]
  );
  const expiresSoon = useMemo(
    () => (demo ? isExpired(demo.createdAt) : false),
    [demo]
  );

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-zinc-100">
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950/90 px-8 py-10 text-center shadow-[0_0_60px_rgba(0,229,255,0.08)]">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-cyan-300" />
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">
            Synchronizing Preview Environment
          </p>
        </div>
      </main>
    );
  }

  if (error || !demo) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-zinc-100">
        <div className="max-w-lg rounded-[2rem] border border-zinc-800 bg-zinc-950/90 p-8 text-center">
          <p className="text-xs font-mono uppercase tracking-[0.22em] text-red-400">Preview Unavailable</p>
          <h1 className="mt-4 text-3xl font-black text-white">Preview access could not be established</h1>
          <p className="mt-4 text-zinc-400">
            {error || "The requested autonomous system preview is unavailable."}
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-cyan-400 px-6 py-3 text-sm font-bold text-black transition hover:bg-cyan-300"
          >
            Return to Homepage
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-cyan-500/30">
      <div className="mx-auto max-w-7xl px-6 py-10 relative z-10">
        <div className="pointer-events-none absolute inset-0 -z-10 flex justify-center overflow-hidden [mask-image:radial-gradient(ellipse_at_top,white,transparent)]">
          <div className="absolute top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[100px]" />
          <div className="absolute top-0 h-[400px] w-[400px] translate-x-1/3 rounded-full bg-blue-500/10 blur-[80px]" />
        </div>
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <GlassCard className="px-6 py-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.24em] text-cyan-300">
                  <span className="h-2 w-2 rounded-full bg-cyan-300" />
                  System Status: Preview Mode
                </div>
                <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
                  Your Autonomous System Preview
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-300">
                  This live simulation demonstrates how ShadowSpark infrastructure captures and
                  qualifies your traffic.
                </p>
              </div>

              <GlassCard className="border-cyan-400/30 bg-cyan-400/5 p-5">
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-200">
                  Recommended System Tier
                </p>
                <p className="mt-3 text-3xl font-black text-white">{displayTier(recommendedTier)}</p>
                <Link
                  href={`/checkout/new?tier=${encodeURIComponent(recommendedTier)}`}
                  className="mt-5 inline-flex rounded-full bg-[#00E5FF] px-5 py-3 text-sm font-bold text-black transition hover:brightness-110 shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                >
                  Deploy This System
                </Link>
              </GlassCard>
            </div>
          </GlassCard>
        </motion.header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-5">
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.22em] text-cyan-300">
                    System Context
                  </p>
                  <h2 className="mt-3 text-3xl font-black text-white">{demo.businessName}</h2>
                  <p className="mt-2 text-zinc-400">{demo.niche}</p>
                </div>
                <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-mono uppercase tracking-[0.16em] text-cyan-200">
                  {displayTier(recommendedTier)}
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Capture Layer", value: "Website + WhatsApp" },
                  { label: "Qualification Logic", value: "AI Guided" },
                  { label: "Sales Handoff", value: "Operator Ready" },
                ].map((item) => (
                  <GlassCard
                    key={item.label}
                    className="border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{item.label}</p>
                    <p className="mt-2 text-lg font-bold text-white">{item.value}</p>
                  </GlassCard>
                ))}
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-zinc-800 bg-zinc-950/70 p-6">
                <p className="text-xs font-mono uppercase tracking-[0.22em] text-cyan-300">
                  Simulation Summary
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-300">
                  ShadowSpark has modeled a revenue path for {demo.businessName} that routes traffic
                  through a controlled website experience, pushes high-intent prospects into WhatsApp,
                  and qualifies them before a human handoff. This preview represents the operating
                  state after deployment, not a static mockup.
                </p>
              </div>
            </GlassCard>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="space-y-6"
          >
            <GlassCard className="p-6">
              <MiniAudit
                businessType={demo.niche}
                goals="capture, qualify, and route traffic into a controlled sales system"
                features={["Website", "WhatsApp AI", "Operator Dashboard"]}
                recommendedPackage={recommendedTier}
                showCta={false}
              />
            </GlassCard>

            <GlassCard className="border-zinc-800 bg-zinc-950/80 p-6">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-300">
                Deployment Path
              </p>
              <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                <li>System preview reviewed and approved by your team.</li>
                <li>Selected tier moved into managed deployment.</li>
                <li>Tracking, qualification logic, and handoff activated.</li>
              </ul>
            </GlassCard>
          </motion.aside>
        </div>

        <footer className="mt-8 flex flex-col gap-3 rounded-[1.5rem] border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm text-amber-100 sm:flex-row sm:items-center sm:justify-between">
          <span>Preview expires in 48 hours.</span>
          <span>{expiresSoon ? "This preview is already nearing expiry." : "Deployment window is active."}</span>
        </footer>
      </div>

      <AssistantBubble />
    </main>
  );
}

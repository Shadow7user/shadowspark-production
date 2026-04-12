"use client";

import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Cpu, Globe } from "lucide-react";
import HeroVoid from "@/components/ui/HeroVoid";
import BentoFeatures from "@/components/ui/BentoFeatures";
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <span className="text-black font-black text-xl">S</span>
            </div>
            <span className="text-xl font-bold tracking-tighter">SHADOWSPARK</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#features" className="hover:text-cyan-400 transition-colors">System Audit</Link>
            <Link href="#automation" className="hover:text-cyan-400 transition-colors">AI Agents</Link>
            <Link href="#pricing" className="hover:text-cyan-400 transition-colors">Ecosystems</Link>
          </div>
          <Button variant="default" size="sm" asChild>
            <Link href="/checkout/new">Deploy Audit</Link>
          </Button>
        </div>
      </nav>

      <main className="relative flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full">
          <HeroVoid />
        </section>

        {/* Trust Bar */}
        <div className="w-full border-y border-zinc-900 bg-zinc-950/50 py-10">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-12 px-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span className="font-mono text-xs tracking-widest uppercase">Powered by Gemini 3.1</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-cyan-400" />
              <span className="font-mono text-xs tracking-widest uppercase">Secured by GCP</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs tracking-widest uppercase">
              <span className="text-cyan-400 font-bold">V1</span> 
              <span>Charter Compliant</span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="w-full max-w-7xl px-6 py-32 flex flex-col items-center">
          <div className="text-center mb-16">
            <h2 className="text-sm font-mono text-cyan-400 tracking-[0.3em] uppercase mb-4">Precision Intelligence</h2>
            <p className="text-3xl md:text-5xl font-bold tracking-tight">The Sovereign Business OS</p>
          </div>
          <BentoFeatures />
        </section>

        {/* CTA Section */}
        <section id="pricing" className="w-full max-w-5xl px-6 py-32">
          <GlassCard className="p-12 md:p-20 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
            <h3 className="text-3xl md:text-6xl font-black mb-8 leading-tight">
              Stop Guessing.<br/>
              <span className="text-cyan-400">Start Quantifying.</span>
            </h3>
            <p className="text-zinc-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Get a high-fidelity business intelligence audit tailored to your operations. 
              The ₦1,000 fee is fully credited toward your first automation module.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Button size="lg" className="h-16 px-12 text-lg group-hover:scale-105 transition-transform" asChild>
                <Link href="/checkout/new" className="flex items-center gap-3">
                  Initialize Audit <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <div className="text-sm font-mono text-zinc-600">
                LATEST MODULE: WHATSAPP REVENUE OPS 2026
              </div>
            </div>
          </GlassCard>
        </section>
      </main>

      <footer className="w-full border-t border-zinc-900 bg-black py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
            © 2026 ShadowSpark Technologies. All rights reserved.
          </div>
          <div className="flex gap-8 text-zinc-500 text-xs font-mono uppercase tracking-widest">
            <Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

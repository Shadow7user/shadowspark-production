"use client"

import Link from "next/link";
import { ArrowRight, Bot, Zap } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-b from-[#0a0f1a] via-[#111827] to-[#0a0f1a] pt-16">
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,168,67,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,168,67,0.02)_1px,transparent_1px)] bg-[size:72px_72px]" />
      {/* Soft glow */}
      <div className="absolute left-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-[#d4a843]/5 blur-[120px]" />
      <div className="absolute right-1/3 bottom-1/4 h-[400px] w-[400px] rounded-full bg-slate-600/5 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Copy */}
          <div className="animate-slide-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d4a843]/20 bg-[#d4a843]/5 px-4 py-1.5 text-sm text-[#d4a843]">
              <Zap size={14} /> AI-Powered Business Automation
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Build Smarter.
              <br />
              <span className="gradient-text">Grow Faster.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-slate-400">
              We help Nigerian businesses automate customer support, generate
              leads, and make data-driven decisions with AI chatbots, BI
              dashboards, and RPA workflows.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                onClick={() => trackCTAClick("start_free_trial", "hero")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4a843] to-[#c0935a] px-8 py-4 text-lg font-semibold text-slate-900 shadow-lg shadow-[#d4a843]/15 transition-all hover:shadow-[#d4a843]/25 hover:from-[#e8c56d] hover:to-[#d4a843]"
              >
                Start Free Trial <ArrowRight size={20} />
              </Link>
              <a
                href="#solutions"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-8 py-4 text-lg text-slate-300 transition-all hover:border-[#d4a843]/30 hover:text-white"
              >
                See Solutions
              </a>
            </div>
          </div>

          {/* Visual */}
          <div className="animate-float hidden lg:block">
            <div className="relative rounded-2xl border border-white/5 bg-[#111827]/80 p-6 backdrop-blur-sm shadow-2xl">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <div className="h-3 w-3 rounded-full bg-green-400/80" />
                <span className="ml-2">ShadowSpark AI</span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d4a843]/10 text-[#d4a843]">
                    <Bot size={16} />
                  </div>
                  <div className="rounded-lg rounded-tl-none bg-white/5 px-4 py-2 text-sm text-slate-300">
                    Hello! Welcome to ShadowSpark. How can I help you today?
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <div className="rounded-lg rounded-tr-none bg-[#d4a843]/10 px-4 py-2 text-sm text-[#e8c56d]">
                    I need a chatbot for my e-commerce store
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d4a843]/10 text-[#d4a843]">
                    <Bot size={16} />
                  </div>
                  <div className="rounded-lg rounded-tl-none bg-white/5 px-4 py-2 text-sm text-slate-300">
                    Great choice! Our AI chatbot handles orders, FAQs, and
                    customer support 24/7. Pricing starts at &#8358;50,000/mo.
                    Want a demo?
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 text-sm text-slate-500">
                Type a message...
                <span className="ml-auto rounded bg-[#d4a843]/10 px-2 py-0.5 text-xs text-[#d4a843]">
                  AI
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

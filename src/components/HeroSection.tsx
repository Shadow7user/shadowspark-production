import Link from "next/link";
import { ArrowRight, Bot, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 pt-16">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      {/* Glow orbs */}
      <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Copy */}
          <div className="animate-slide-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-400">
              <Zap size={14} /> AI-Powered Business Automation
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Build Smarter.
              <br />
              <span className="gradient-text">Grow Faster.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-slate-400">
              We help Nigerian businesses automate customer support, generate leads,
              and make data-driven decisions with AI chatbots, BI dashboards, and RPA workflows.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:from-cyan-600 hover:to-purple-700"
              >
                Start Free Trial <ArrowRight size={20} />
              </Link>
              <a
                href="#solutions"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-8 py-4 text-lg text-slate-300 transition-all hover:border-cyan-500/50 hover:text-white"
              >
                See Solutions
              </a>
            </div>
          </div>

          {/* Visual */}
          <div className="animate-float hidden lg:block">
            <div className="relative rounded-2xl border border-purple-500/20 bg-slate-800/50 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="ml-2">ShadowSpark AI</span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                    <Bot size={16} />
                  </div>
                  <div className="rounded-lg rounded-tl-none bg-slate-700/50 px-4 py-2 text-sm text-slate-300">
                    Hello! Welcome to ShadowSpark. How can I help you today?
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <div className="rounded-lg rounded-tr-none bg-cyan-600/20 px-4 py-2 text-sm text-cyan-300">
                    I need a chatbot for my e-commerce store
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                    <Bot size={16} />
                  </div>
                  <div className="rounded-lg rounded-tl-none bg-slate-700/50 px-4 py-2 text-sm text-slate-300">
                    Great choice! Our AI chatbot handles orders, FAQs, and customer support 24/7. Pricing starts at &#8358;50,000/mo. Want a demo?
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-700/30 px-3 py-2 text-sm text-slate-500">
                Type a message...
                <span className="ml-auto rounded bg-cyan-500/20 px-2 py-0.5 text-xs text-cyan-400">AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

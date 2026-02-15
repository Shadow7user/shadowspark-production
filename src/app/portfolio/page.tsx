import type { Metadata } from "next";
import Link from "next/link";
import {
  MessageSquare,
  BarChart3,
  Workflow,
  TrendingUp,
  Clock,
  Users,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "See how ShadowSpark AI solutions help Nigerian businesses automate support, capture leads, and make data-driven decisions.",
  openGraph: {
    title: "ShadowSpark Portfolio & Case Studies",
    description:
      "Real results from real Nigerian businesses using AI chatbots, BI dashboards, and RPA.",
  },
};

const caseStudies = [
  {
    icon: MessageSquare,
    industry: "E-Commerce",
    client: "Lagos Fashion Retailer",
    title: "WhatsApp Chatbot for Customer Support",
    challenge:
      "A fast-growing online fashion brand was losing sales due to slow WhatsApp response times. Their 3-person support team couldn't keep up with 300+ daily messages about sizing, delivery, and returns.",
    solution:
      "We deployed an AI chatbot on WhatsApp that handles sizing inquiries, tracks deliveries via API, processes return requests, and escalates complex issues to the human team with full context.",
    results: [
      { label: "Response Time", value: "< 2s", sub: "from 45 min avg" },
      { label: "Messages Handled", value: "8,500+", sub: "per month" },
      { label: "Support Cost", value: "-60%", sub: "reduction" },
      { label: "Customer Satisfaction", value: "96%", sub: "CSAT score" },
    ],
    gradient: "from-[#d4a843]/8 to-transparent",
    border: "border-[#d4a843]/15",
  },
  {
    icon: BarChart3,
    industry: "Fintech",
    client: "Payment Processing Startup",
    title: "Real-Time BI Dashboard",
    challenge:
      "A fintech startup was managing transaction data across 5 spreadsheets. Monthly reports took 3 days to compile, and fraud detection relied on manual spot-checks.",
    solution:
      "We built a real-time BI dashboard connecting their payment gateway, bank reconciliation, and customer database. Live fraud alerts flag suspicious patterns within seconds.",
    results: [
      { label: "Report Time", value: "3 days → instant", sub: "real-time" },
      { label: "Fraud Detection", value: "12x faster", sub: "alert speed" },
      { label: "Revenue Tracked", value: "\u20A62.1B+", sub: "monthly volume" },
      { label: "Data Sources", value: "5 → 1", sub: "unified view" },
    ],
    gradient: "from-white/[0.03] to-transparent",
    border: "border-white/8",
  },
  {
    icon: Workflow,
    industry: "Healthcare",
    client: "Port Harcourt Clinic Chain",
    title: "RPA for Appointment & Billing",
    challenge:
      "A clinic chain with 4 locations was drowning in manual appointment scheduling, insurance verification, and invoice generation. Staff spent 5+ hours daily on paperwork.",
    solution:
      "We automated the entire patient flow: WhatsApp booking → calendar sync → insurance verification → post-visit invoice generation → payment reminders. All running 24/7.",
    results: [
      { label: "Admin Hours", value: "-70%", sub: "time saved" },
      { label: "Appointments", value: "1,200+", sub: "per month automated" },
      { label: "Billing Errors", value: "0", sub: "since deployment" },
      { label: "Patient NPS", value: "+35", sub: "point increase" },
    ],
    gradient: "from-[#c0935a]/8 to-transparent",
    border: "border-[#c0935a]/15",
  },
];

const capabilities = [
  {
    icon: MessageSquare,
    title: "AI Chatbots",
    desc: "WhatsApp, Web, SMS — multilingual, 24/7",
  },
  {
    icon: BarChart3,
    title: "BI Dashboards",
    desc: "Real-time analytics from any data source",
  },
  {
    icon: Workflow,
    title: "RPA Workflows",
    desc: "End-to-end process automation",
  },
  {
    icon: TrendingUp,
    title: "Lead Generation",
    desc: "Capture, qualify, and nurture automatically",
  },
];

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0f1a] pt-24">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Our <span className="gradient-text">Portfolio</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Real results from Nigerian businesses using ShadowSpark AI
            solutions. See how automation transforms operations.
          </p>
        </section>

        {/* Capabilities bar */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {capabilities.map((c) => (
              <div
                key={c.title}
                className="glass-card flex items-center gap-3 rounded-xl p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#d4a843]/10">
                  <c.icon size={20} className="text-[#d4a843]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{c.title}</p>
                  <p className="text-xs text-slate-500">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Case Studies */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">
            Case <span className="gradient-text">Studies</span>
          </h2>
          <div className="space-y-12">
            {caseStudies.map((cs) => (
              <div
                key={cs.title}
                className={`glass-card overflow-hidden rounded-2xl ${cs.border}`}
              >
                <div
                  className={`bg-gradient-to-r ${cs.gradient} p-8 md:p-12`}
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs font-medium text-slate-300">
                      <cs.icon size={14} /> {cs.industry}
                    </div>
                    <span className="text-xs text-slate-500">{cs.client}</span>
                  </div>

                  <h3 className="mt-4 text-2xl font-bold text-white">
                    {cs.title}
                  </h3>

                  {/* Challenge / Solution */}
                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <Clock size={14} className="text-rose-400" />
                        <h4 className="text-sm font-semibold text-rose-400">
                          Challenge
                        </h4>
                      </div>
                      <p className="text-sm text-slate-400">{cs.challenge}</p>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <TrendingUp size={14} className="text-emerald-400" />
                        <h4 className="text-sm font-semibold text-emerald-400">
                          Solution
                        </h4>
                      </div>
                      <p className="text-sm text-slate-400">{cs.solution}</p>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {cs.results.map((r) => (
                      <div
                        key={r.label}
                        className="rounded-lg border border-slate-700/50 bg-slate-800/60 p-4 text-center"
                      >
                        <p className="text-2xl font-bold text-white">
                          {r.value}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {r.label}
                        </p>
                        <p className="text-xs text-slate-600">{r.sub}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonial */}
        <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="glass-card rounded-2xl p-8 text-center md:p-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#d4a843]/10">
              <Users size={24} className="text-[#d4a843]" />
            </div>
            <blockquote className="mt-6 text-lg italic text-slate-300">
              &ldquo;ShadowSpark&apos;s chatbot handles 80% of our customer
              queries automatically. Our team now focuses on complex issues and
              closing sales instead of answering the same questions
              repeatedly.&rdquo;
            </blockquote>
            <p className="mt-4 text-sm font-semibold text-white">
              — Operations Manager, Lagos E-Commerce Brand
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-[#d4a843]/10 to-[#c0935a]/10 p-8 text-center md:p-12">
            <h2 className="text-2xl font-bold text-white">
              Want similar results for your business?
            </h2>
            <p className="mt-2 text-slate-400">
              Let&apos;s build your custom AI solution. Start with a free
              consultation.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#d4a843] to-[#c0935a] px-6 py-3 text-sm font-semibold text-white transition-all hover:from-[#e8c56d] hover:to-[#d4a843]"
              >
                Start Free Trial <ArrowRight size={16} />
              </Link>
              <a
                href="https://wa.me/2349037621612?text=Hi%2C%20I%20saw%20your%20portfolio%20and%20I%27m%20interested"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-emerald-500/20 px-6 py-3 text-sm font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/10"
              >
                Discuss on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

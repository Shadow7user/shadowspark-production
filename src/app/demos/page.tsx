import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, School, ShoppingBag, Home, Pill, Truck, CreditCard, Scale, TrendingUp, Wheat } from "lucide-react";

export const metadata: Metadata = {
  title: "Live Demos | ShadowSpark",
  description:
    "Interactive demos showing exactly what ShadowSpark builds for Nigerian SMEs — with real numbers, live data, and ROI calculators.",
};

const liveDemos = [
  {
    href: "/demos/school",
    icon: School,
    title: "School Management System",
    sector: "Education",
    desc: "Automate fee collection, attendance tracking, result processing and parent communications for Nigerian private schools.",
    metrics: ["₦2.4M saved/yr", "3× faster invoicing", "Zero paper registers"],
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
  {
    href: "/demos/retail",
    icon: ShoppingBag,
    title: "AI Retail Hub",
    sector: "E-commerce / Retail",
    desc: "WhatsApp-first inventory management, order tracking, and customer engagement for Nigerian product retailers.",
    metrics: ["40% more repeat orders", "Real-time stock sync", "Auto-reorder triggers"],
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
  {
    href: "/demos/shortlet",
    icon: Home,
    title: "Short-let Portal",
    sector: "Real Estate / Hospitality",
    desc: "Full booking management, automated tenant communication, and revenue analytics for Airbnb-style short-let operators.",
    metrics: ["98% booking automation", "₦1.8M avg monthly revenue", "15-min check-in flow"],
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
  },
];

const comingSoon = [
  { icon: Pill, title: "Pharmacy System", sector: "Healthcare", href: "/demos/pharmacy" },
  { icon: Truck, title: "Logistics Platform", sector: "Logistics", href: "/demos/logistics" },
  { icon: CreditCard, title: "Loan Application", sector: "Fintech / Lending", href: "/demos/lending" },
  { icon: Scale, title: "Legal Management", sector: "Professional Services", href: "/demos/legal" },
  { icon: TrendingUp, title: "Investment Platform", sector: "Finance", href: "/demos/investment" },
  { icon: TrendingUp, title: "Banking Dashboard", sector: "Banking", href: "/demos/banking" },
  { icon: Wheat, title: "Agri Supply Chain", sector: "Agriculture", href: "/demos/agri" },
];

export default function DemosIndexPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0f1a] pt-24">

        {/* Header */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#d4a843]">
              Live interactive demos
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              See exactly what we build
            </h1>
            <p className="mt-5 text-lg text-slate-400">
              Every demo below is a fully working product — not a slideshow.
              Click through, use the ROI calculators, and see the real numbers
              before booking a call.
            </p>
          </div>
        </section>

        {/* Live demos grid */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {liveDemos.map(({ href, icon: Icon, title, sector, desc, metrics, color, bg, border }) => (
              <Link
                key={href}
                href={href}
                className={`group flex flex-col rounded-2xl border ${border} bg-[#0d1320] p-7 transition-all hover:border-[#d4a843]/30 hover:shadow-lg hover:shadow-[#d4a843]/5`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg} ${color} mb-5`}>
                  <Icon size={22} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  {sector}
                </p>
                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-[#d4a843] transition-colors">
                  {title}
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed mb-5 flex-1">
                  {desc}
                </p>
                <ul className="space-y-1.5 mb-6">
                  {metrics.map((m) => (
                    <li key={m} className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d4a843]" />
                      {m}
                    </li>
                  ))}
                </ul>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-[#d4a843]">
                  Open demo <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Coming soon */}
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-slate-400 mb-6">
            Coming in Phase 2
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {comingSoon.map(({ icon: Icon, title, sector }) => (
              <div
                key={title}
                className="flex items-center gap-4 rounded-xl border border-slate-800 bg-[#0d1320]/50 px-5 py-4 opacity-60"
              >
                <Icon size={18} className="shrink-0 text-slate-600" />
                <div>
                  <p className="text-sm font-medium text-slate-400">{title}</p>
                  <p className="text-xs text-slate-600">{sector}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

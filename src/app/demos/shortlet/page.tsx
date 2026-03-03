"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ROICalculator from "@/components/ROICalculator";
import {
  Home,
  Calendar,
  DollarSign,
  CheckCircle2,
  ArrowLeft,
  MessageSquare,
  Star,
  MapPin,
  TrendingUp,
} from "lucide-react";

/* ── Demo data ─────────────────────────────────────────── */
const stats = [
  { label: "Active listings", value: "24" },
  { label: "Revenue (this month)", value: "₦4.8M" },
  { label: "Occupancy rate", value: "88%" },
  { label: "Avg stay (nights)", value: "3.2" },
];

const listings = [
  {
    name: "Lekki Phase 1 — 2BR Luxury",
    location: "Lagos",
    nightly: "₦45,000",
    rating: 4.9,
    status: "occupied",
    nextFree: "Mar 8",
  },
  {
    name: "GRA Port Harcourt — Studio",
    location: "Port Harcourt",
    nightly: "₦22,000",
    rating: 4.7,
    status: "available",
    nextFree: "Now",
  },
  {
    name: "Maitama Abuja — 3BR Executive",
    location: "Abuja",
    nightly: "₦65,000",
    rating: 4.8,
    status: "occupied",
    nextFree: "Mar 6",
  },
  {
    name: "VI Lagos — 1BR Serviced",
    location: "Lagos",
    nightly: "₦38,000",
    rating: 4.6,
    status: "maintenance",
    nextFree: "Mar 5",
  },
];

const bookings = [
  {
    guest: "Chukwuemeka A.",
    property: "Lekki Phase 1 — 2BR",
    checkin: "Mar 3",
    checkout: "Mar 7",
    total: "₦180,000",
    status: "confirmed",
    channel: "WhatsApp",
  },
  {
    guest: "Mrs Suleiman",
    property: "Maitama Abuja — 3BR",
    checkin: "Mar 4",
    checkout: "Mar 6",
    total: "₦130,000",
    status: "confirmed",
    channel: "Web",
  },
  {
    guest: "Dr Okafor",
    property: "GRA Port Harcourt",
    checkin: "Mar 9",
    checkout: "Mar 11",
    total: "₦44,000",
    status: "pending",
    channel: "WhatsApp",
  },
  {
    guest: "Aisha Bello",
    property: "VI Lagos — 1BR",
    checkin: "Mar 12",
    checkout: "Mar 14",
    total: "₦76,000",
    status: "confirmed",
    channel: "WhatsApp",
  },
];

const features = [
  "WhatsApp booking flow — quote to payment in 15 min",
  "Automated check-in instructions and access codes",
  "Cleaning/maintenance staff scheduling",
  "Multi-property revenue dashboard",
  "Guest review collection and follow-up",
  "Airbnb/Booking.com calendar sync",
];

/* ── Helpers ───────────────────────────────────────────── */
function listingStatusBadge(status: string) {
  const map: Record<string, string> = {
    occupied: "bg-blue-500/15 text-blue-400",
    available: "bg-emerald-500/15 text-emerald-400",
    maintenance: "bg-yellow-500/15 text-yellow-400",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${map[status] ?? "bg-slate-500/15 text-slate-400"}`}>
      {status}
    </span>
  );
}

function bookingStatusBadge(status: string) {
  const map: Record<string, string> = {
    confirmed: "bg-emerald-500/15 text-emerald-400",
    pending: "bg-yellow-500/15 text-yellow-400",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${map[status] ?? "bg-slate-500/15 text-slate-400"}`}>
      {status}
    </span>
  );
}

export default function ShortletDemoPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "listings" | "bookings">("dashboard");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0f1a] pt-24">

        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/demos"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            <ArrowLeft size={14} /> Back to demos
          </Link>
        </div>

        {/* Header */}
        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <div className="flex items-start gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-purple-400/10 text-purple-400">
              <Home size={26} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#d4a843]">
                Real Estate / Hospitality · Live demo
              </p>
              <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">
                Short-let Portal
              </h1>
              <p className="mt-2 text-slate-400 max-w-xl">
                Full booking management, automated guest communications, and revenue
                analytics for Nigerian Airbnb-style short-let operators.
              </p>
            </div>
          </div>
        </section>

        {/* Demo area + ROI calculator */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

            {/* ── Left: interactive demo ─────────────────── */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d1320] overflow-hidden">

              {/* Tabs */}
              <div className="flex border-b border-slate-800">
                {(["dashboard", "listings", "bookings"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-3.5 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? "border-b-2 border-[#d4a843] text-[#d4a843]"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Dashboard tab */}
                {activeTab === "dashboard" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {stats.map(({ label, value }) => (
                        <div key={label} className="rounded-xl bg-slate-800/50 p-4">
                          <p className="text-xs text-slate-500 leading-tight">{label}</p>
                          <p className="mt-1.5 text-2xl font-bold text-white">{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Quick actions */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
                        Quick actions
                      </p>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {[
                          { icon: MessageSquare, label: "Send check-in codes", color: "text-purple-400 bg-purple-400/10" },
                          { icon: Calendar, label: "Block dates", color: "text-blue-400 bg-blue-400/10" },
                          { icon: DollarSign, label: "Generate revenue report", color: "text-emerald-400 bg-emerald-400/10" },
                        ].map(({ icon: Icon, label, color }) => (
                          <button
                            key={label}
                            className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/30 px-4 py-3 text-sm text-slate-300 hover:border-[#d4a843]/30 hover:text-white transition-all"
                          >
                            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color}`}>
                              <Icon size={15} />
                            </span>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="rounded-xl border border-slate-800 p-5">
                      <p className="text-sm font-semibold text-white mb-4">What&apos;s included</p>
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-slate-400">
                            <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-[#d4a843]" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Listings tab */}
                {activeTab === "listings" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-semibold text-white">Your properties</p>
                      <span className="text-xs text-slate-500">24 total</span>
                    </div>
                    <div className="space-y-3">
                      {listings.map(({ name, location, nightly, rating, status }) => (
                        <div key={name} className="flex items-center justify-between rounded-xl bg-slate-800/30 px-4 py-3.5">
                          <div className="flex-1 min-w-0 mr-4">
                            <p className="text-sm font-medium text-white truncate">{name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="flex items-center gap-1 text-xs text-slate-500">
                                <MapPin size={10} /> {location}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-slate-500">
                                <Star size={10} className="text-[#d4a843]" /> {rating}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right hidden sm:block">
                              <p className="text-sm font-semibold text-white">{nightly}</p>
                              <p className="text-xs text-slate-500">per night</p>
                            </div>
                            {listingStatusBadge(status)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 rounded-xl bg-[#d4a843]/5 border border-[#d4a843]/20 p-4 text-sm text-slate-400">
                      💡 Guests receive check-in codes automatically 2 hours before arrival via WhatsApp.
                    </div>
                  </div>
                )}

                {/* Bookings tab */}
                {activeTab === "bookings" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-semibold text-white">Upcoming bookings</p>
                      <span className="text-xs text-slate-500">Next 30 days</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-800">
                            <th className="pb-2.5 text-left text-xs font-medium text-slate-500">Guest</th>
                            <th className="pb-2.5 text-right text-xs font-medium text-slate-500">Check-in</th>
                            <th className="pb-2.5 text-right text-xs font-medium text-slate-500">Check-out</th>
                            <th className="pb-2.5 text-right text-xs font-medium text-slate-500">Total</th>
                            <th className="pb-2.5 text-right text-xs font-medium text-slate-500">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {bookings.map(({ guest, checkin, checkout, total, status }) => (
                            <tr key={guest}>
                              <td className="py-3 font-medium text-white">{guest}</td>
                              <td className="py-3 text-right text-slate-400">{checkin}</td>
                              <td className="py-3 text-right text-slate-400">{checkout}</td>
                              <td className="py-3 text-right text-white">{total}</td>
                              <td className="py-3 text-right">{bookingStatusBadge(status)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 rounded-xl bg-[#d4a843]/5 border border-[#d4a843]/20 p-4 text-sm text-slate-400">
                      💡 98% of bookings confirmed via WhatsApp — guests pay with bank transfer and receive instant confirmation.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: ROI Calculator ─────────────────── */}
            <div className="space-y-6">
              <ROICalculator
                hoursLabel="Hours spent managing bookings manually"
                hourlyRate={1500}
                solutionName="Short-let Portal"
                whatsappHref="https://wa.me/2349037621612?text=I%27d%20like%20a%20demo%20of%20the%20Short-let%20Portal"
              />

              <div className="rounded-2xl border border-slate-800 bg-[#0d1320] p-6">
                <p className="text-sm font-semibold text-white mb-3">
                  Revenue potential
                </p>
                <ul className="space-y-3">
                  {[
                    { stat: "₦1.8M", desc: "average monthly revenue for 10-unit operators" },
                    { stat: "15 min", desc: "from inquiry to confirmed booking on WhatsApp" },
                    { stat: "98%", desc: "booking automation — no manual back-and-forth" },
                  ].map(({ stat, desc }) => (
                    <li key={stat} className="flex items-center gap-3">
                      <span className="text-xl font-bold text-[#d4a843] shrink-0">{stat}</span>
                      <span className="text-sm text-slate-400">{desc}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="https://wa.me/2349037621612?text=I%27d%20like%20a%20demo%20of%20the%20Short-let%20Portal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 hover:border-[#d4a843]/40 hover:text-[#d4a843] transition-all"
                >
                  <MessageSquare size={14} />
                  Chat with Reginald on WhatsApp
                </a>
              </div>

              <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
                <p className="text-xs font-semibold text-purple-400 mb-2">Works with your existing setup</p>
                <ul className="space-y-1.5">
                  {["Airbnb", "Booking.com", "Jumia Travel", "Direct WhatsApp"].map((s) => (
                    <li key={s} className="flex items-center gap-2 text-sm text-slate-400">
                      <CheckCircle2 size={12} className="shrink-0 text-purple-400" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-slate-800">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#d4a843] mb-3">
              Manage all your properties in one place
            </p>
            <h2 className="text-2xl font-bold text-white mb-4">
              Scale your short-let business with automation
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Whether you have 2 apartments or 50 — we&apos;ll configure the platform to match your operation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/2349037621612?text=I%27d%20like%20a%20demo%20of%20the%20Short-let%20Portal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4a843] to-[#c0935a] px-6 py-3 text-sm font-semibold text-slate-900 hover:from-[#e8c56d] hover:to-[#d4a843] transition-all"
              >
                <MessageSquare size={14} />
                Book a demo on WhatsApp
              </a>
              <Link
                href="/demos"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 hover:border-[#d4a843]/40 hover:text-[#d4a843] transition-all"
              >
                <TrendingUp size={14} />
                See other demos
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

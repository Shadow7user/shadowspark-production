"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ROICalculator from "@/components/ROICalculator";
import {
  ShoppingBag,
  TrendingUp,
  Bell,
  CheckCircle2,
  ArrowLeft,
  MessageSquare,
  RefreshCw,
  Star,
} from "lucide-react";

/* ── Demo data ─────────────────────────────────────────── */
const stats = [
  { label: "Products tracked", value: "1,240" },
  { label: "Orders this month", value: "387" },
  { label: "Revenue (MTD)", value: "₦18.6M" },
  { label: "Reorder alerts", value: "12" },
];

const products = [
  { name: "Indomie Super Pack (40 units)", sku: "IND-040", stock: 320, reorder: 50, trend: "↑" },
  { name: "Nescafé Gold 200g", sku: "NES-200", stock: 48, reorder: 60, trend: "↓" },
  { name: "Dano Full Cream 1kg", sku: "DAN-1KG", stock: 15, reorder: 40, trend: "↓" },
  { name: "Milo 750g", sku: "MIL-750", stock: 180, reorder: 50, trend: "↑" },
  { name: "Peak Milk 400g", sku: "PEK-400", stock: 210, reorder: 60, trend: "→" },
];

const recentOrders = [
  { customer: "Mama Chidi Store", items: 8, total: "₦124,000", status: "delivered", channel: "WhatsApp" },
  { customer: "Tunde Supermart", items: 23, total: "₦340,000", status: "processing", channel: "Web" },
  { customer: "Mrs Bello Kiosk", items: 4, total: "₦58,000", status: "delivered", channel: "WhatsApp" },
  { customer: "Eze Cold Room", items: 15, total: "₦210,000", status: "shipped", channel: "WhatsApp" },
];

const features = [
  "WhatsApp order intake — no app download needed",
  "Real-time inventory sync across multiple stores",
  "Automated low-stock alerts & reorder triggers",
  "Customer loyalty points & repeat-order nudges",
  "Daily/weekly sales report on WhatsApp",
  "Supplier invoice reconciliation",
];

/* ── Helpers ───────────────────────────────────────────── */
function stockBadge(stock: number, reorder: number) {
  if (stock <= reorder)
    return <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-medium text-red-400">Low stock</span>;
  if (stock <= reorder * 2)
    return <span className="rounded-full bg-yellow-500/15 px-2 py-0.5 text-xs font-medium text-yellow-400">Watch</span>;
  return <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">OK</span>;
}

function orderStatusBadge(status: string) {
  const map: Record<string, string> = {
    delivered: "bg-emerald-500/15 text-emerald-400",
    processing: "bg-yellow-500/15 text-yellow-400",
    shipped: "bg-blue-500/15 text-blue-400",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${map[status] ?? "bg-slate-500/15 text-slate-400"}`}>
      {status}
    </span>
  );
}

export default function RetailDemoPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "inventory" | "orders">("dashboard");

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
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
              <ShoppingBag size={26} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#d4a843]">
                E-commerce / Retail · Live demo
              </p>
              <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">
                AI Retail Hub
              </h1>
              <p className="mt-2 text-slate-400 max-w-xl">
                WhatsApp-first inventory, orders, and customer loyalty for Nigerian
                product retailers — FMCG, cosmetics, electronics, and more.
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
                {(["dashboard", "inventory", "orders"] as const).map((tab) => (
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
                          { icon: Bell, label: "Send reorder alerts", color: "text-yellow-400 bg-yellow-400/10" },
                          { icon: RefreshCw, label: "Sync stock levels", color: "text-blue-400 bg-blue-400/10" },
                          { icon: Star, label: "Run loyalty promo", color: "text-emerald-400 bg-emerald-400/10" },
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

                {/* Inventory tab */}
                {activeTab === "inventory" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-semibold text-white">Stock levels</p>
                      <span className="text-xs text-slate-500">Live sync</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-800">
                            <th className="pb-2.5 text-left text-xs font-medium text-slate-500">Product</th>
                            <th className="pb-2.5 text-left text-xs font-medium text-slate-500">SKU</th>
                            <th className="pb-2.5 text-right text-xs font-medium text-slate-500">Stock</th>
                            <th className="pb-2.5 text-right text-xs font-medium text-slate-500">Trend</th>
                            <th className="pb-2.5 text-right text-xs font-medium text-slate-500">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {products.map(({ name, sku, stock, reorder, trend }) => (
                            <tr key={sku}>
                              <td className="py-3 font-medium text-white max-w-[180px] truncate">{name}</td>
                              <td className="py-3 text-slate-500 font-mono text-xs">{sku}</td>
                              <td className="py-3 text-right text-white">{stock}</td>
                              <td className="py-3 text-right text-slate-400">{trend}</td>
                              <td className="py-3 text-right">{stockBadge(stock, reorder)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 rounded-xl bg-[#d4a843]/5 border border-[#d4a843]/20 p-4 text-sm text-slate-400">
                      💡 Low-stock items trigger automatic supplier WhatsApp messages with pre-filled order quantities.
                    </div>
                  </div>
                )}

                {/* Orders tab */}
                {activeTab === "orders" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-semibold text-white">Recent orders</p>
                      <span className="text-xs text-slate-500">This week</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-800">
                            <th className="pb-2.5 text-left text-xs font-medium text-slate-500">Customer</th>
                            <th className="pb-2.5 text-right text-xs font-medium text-slate-500">Items</th>
                            <th className="pb-2.5 text-right text-xs font-medium text-slate-500">Total</th>
                            <th className="pb-2.5 text-right text-xs font-medium text-slate-500">Channel</th>
                            <th className="pb-2.5 text-right text-xs font-medium text-slate-500">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {recentOrders.map(({ customer, items, total, status, channel }) => (
                            <tr key={customer}>
                              <td className="py-3 font-medium text-white">{customer}</td>
                              <td className="py-3 text-right text-slate-400">{items}</td>
                              <td className="py-3 text-right text-white">{total}</td>
                              <td className="py-3 text-right">
                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${channel === "WhatsApp" ? "bg-emerald-500/15 text-emerald-400" : "bg-blue-500/15 text-blue-400"}`}>
                                  {channel}
                                </span>
                              </td>
                              <td className="py-3 text-right">{orderStatusBadge(status)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 rounded-xl bg-[#d4a843]/5 border border-[#d4a843]/20 p-4 text-sm text-slate-400">
                      💡 73% of orders placed via WhatsApp — customers don&apos;t need to download any app.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: ROI Calculator ─────────────────── */}
            <div className="space-y-6">
              <ROICalculator
                hoursLabel="Hours spent on manual order processing"
                hourlyRate={1200}
                solutionName="AI Retail Hub"
                whatsappHref="https://wa.me/2349037621612?text=I%27d%20like%20a%20demo%20of%20the%20AI%20Retail%20Hub"
              />

              <div className="rounded-2xl border border-slate-800 bg-[#0d1320] p-6">
                <p className="text-sm font-semibold text-white mb-3">
                  Results from live clients
                </p>
                <ul className="space-y-3">
                  {[
                    { stat: "40%", desc: "increase in repeat orders within 90 days" },
                    { stat: "₦6M+", desc: "monthly GMV on WhatsApp channel alone" },
                    { stat: "3×", desc: "faster order processing vs manual WhatsApp" },
                  ].map(({ stat, desc }) => (
                    <li key={stat} className="flex items-center gap-3">
                      <span className="text-xl font-bold text-[#d4a843] shrink-0">{stat}</span>
                      <span className="text-sm text-slate-400">{desc}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="https://wa.me/2349037621612?text=I%27d%20like%20a%20demo%20of%20the%20AI%20Retail%20Hub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 hover:border-[#d4a843]/40 hover:text-[#d4a843] transition-all"
                >
                  <MessageSquare size={14} />
                  Chat with Reginald on WhatsApp
                </a>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-xs font-semibold text-emerald-400 mb-1">Live on WhatsApp</p>
                <p className="text-sm text-slate-400">
                  Send <span className="font-mono text-white">DEMO</span> to{" "}
                  <span className="font-mono text-white">+234 903 762 1612</span>{" "}
                  to see the WhatsApp order flow in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-slate-800">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#d4a843] mb-3">
              Ready to automate your retail operations?
            </p>
            <h2 className="text-2xl font-bold text-white mb-4">
              Get a live demo scoped to your products
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              We&apos;ll configure the platform using your actual SKUs, supplier list, and customer base — not a generic template.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/2349037621612?text=I%27d%20like%20a%20demo%20of%20the%20AI%20Retail%20Hub"
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

"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ROICalculator from "@/components/ROICalculator";
import {
  School,
  Users,
  CreditCard,
  Bell,
  CheckCircle2,
  ArrowLeft,
  MessageSquare,
  FileText,
} from "lucide-react";

/* ── Demo data ─────────────────────────────────────────── */
const stats = [
  { label: "Students enrolled", value: "847" },
  { label: "Fees collected (term)", value: "₦34.2M" },
  { label: "Outstanding balance", value: "₦2.1M" },
  { label: "Attendance today", value: "96%" },
];

const recentPayments = [
  { name: "Adaeze Okonkwo", class: "JSS 2A", amount: "₦45,000", status: "paid", date: "Today" },
  { name: "Emeka Nwosu", class: "SS 1B", amount: "₦55,000", status: "paid", date: "Today" },
  { name: "Fatima Ibrahim", class: "JSS 3C", amount: "₦45,000", status: "pending", date: "3 days ago" },
  { name: "Chidi Eze", class: "SS 2A", amount: "₦55,000", status: "paid", date: "Yesterday" },
  { name: "Ngozi Adeleke", class: "Primary 5", amount: "₦35,000", status: "overdue", date: "2 weeks ago" },
];

const notifications = [
  { icon: Bell, text: "Fee reminder sent to 43 parents via WhatsApp", time: "10 min ago" },
  { icon: FileText, text: "Term 2 results uploaded for SS3 — 67 students", time: "1 hr ago" },
  { icon: MessageSquare, text: "12 parents replied to the fee reminder", time: "25 min ago" },
  { icon: CheckCircle2, text: "Attendance marked for all 18 classes", time: "8:15 AM" },
];

const features = [
  "Automated fee invoicing via WhatsApp & email",
  "Real-time attendance with parent notification",
  "Result processing and report card generation",
  "Staff payroll and leave management",
  "WAEC/NECO result checker integration",
  "School bus tracking and parent alerts",
];

/* ── Helpers ───────────────────────────────────────────── */
function statusBadge(status: string) {
  if (status === "paid")
    return <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">Paid</span>;
  if (status === "pending")
    return <span className="rounded-full bg-yellow-500/15 px-2 py-0.5 text-xs font-medium text-yellow-400">Pending</span>;
  return <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-medium text-red-400">Overdue</span>;
}

export default function SchoolDemoPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "payments" | "notifications">("dashboard");

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
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400">
              <School size={26} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#d4a843]">
                Education · Live demo
              </p>
              <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">
                School Management System
              </h1>
              <p className="mt-2 text-slate-400 max-w-xl">
                Built for Nigerian private schools — automate fees, attendance, results
                and parent communications in one WhatsApp-native platform.
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
                {(["dashboard", "payments", "notifications"] as const).map((tab) => (
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
                          { icon: Bell, label: "Send fee reminders", color: "text-yellow-400 bg-yellow-400/10" },
                          { icon: FileText, label: "Generate report cards", color: "text-blue-400 bg-blue-400/10" },
                          { icon: Users, label: "Mark attendance", color: "text-emerald-400 bg-emerald-400/10" },
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

                {/* Payments tab */}
                {activeTab === "payments" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-semibold text-white">Recent fee payments</p>
                      <span className="text-xs text-slate-500">Term 2, 2025</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-800">
                            <th className="pb-2.5 text-left text-xs font-medium text-slate-500">Student</th>
                            <th className="pb-2.5 text-left text-xs font-medium text-slate-500">Class</th>
                            <th className="pb-2.5 text-right text-xs font-medium text-slate-500">Amount</th>
                            <th className="pb-2.5 text-right text-xs font-medium text-slate-500">Status</th>
                            <th className="pb-2.5 text-right text-xs font-medium text-slate-500">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {recentPayments.map(({ name, class: cls, amount, status, date }) => (
                            <tr key={name}>
                              <td className="py-3 font-medium text-white">{name}</td>
                              <td className="py-3 text-slate-400">{cls}</td>
                              <td className="py-3 text-right text-white">{amount}</td>
                              <td className="py-3 text-right">{statusBadge(status)}</td>
                              <td className="py-3 text-right text-slate-500">{date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 rounded-xl bg-[#d4a843]/5 border border-[#d4a843]/20 p-4 text-sm text-slate-400">
                      💡 Overdue families automatically receive a WhatsApp reminder at 9 AM every Monday.
                    </div>
                  </div>
                )}

                {/* Notifications tab */}
                {activeTab === "notifications" && (
                  <div className="space-y-3">
                    {notifications.map(({ icon: Icon, text, time }) => (
                      <div key={text} className="flex items-start gap-3 rounded-xl bg-slate-800/30 px-4 py-3">
                        <Icon size={15} className="mt-0.5 shrink-0 text-[#d4a843]" />
                        <div>
                          <p className="text-sm text-slate-300">{text}</p>
                          <p className="text-xs text-slate-600 mt-0.5">{time}</p>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 text-xs text-center text-slate-600">
                      All notifications sent via WhatsApp — no app download required
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: ROI Calculator ─────────────────── */}
            <div className="space-y-6">
              <ROICalculator
                hoursLabel="Admin hours saved per month"
                hourlyRate={1500}
                solutionName="School Management System"
                whatsappHref="https://wa.me/2349037621612?text=I%27d%20like%20a%20demo%20of%20the%20School%20Management%20System"
              />

              <div className="rounded-2xl border border-slate-800 bg-[#0d1320] p-6">
                <p className="text-sm font-semibold text-white mb-3">
                  Trusted by schools across Nigeria
                </p>
                <ul className="space-y-2">
                  {[
                    "Port Harcourt — 3 schools, 1,200 students",
                    "Lagos — 5 schools, 2,800 students",
                    "Abuja — 2 schools, 640 students",
                  ].map((s) => (
                    <li key={s} className="flex items-center gap-2 text-sm text-slate-400">
                      <CreditCard size={12} className="shrink-0 text-[#d4a843]" />
                      {s}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://wa.me/2349037621612?text=I%27d%20like%20a%20demo%20of%20the%20School%20Management%20System"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 hover:border-[#d4a843]/40 hover:text-[#d4a843] transition-all"
                >
                  <MessageSquare size={14} />
                  Chat with Reginald on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

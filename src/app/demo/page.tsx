"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, ArrowRight, MessageSquare, BarChart2, CalendarCheck, ShieldCheck } from "lucide-react";

const businessTypes = [
  "Fintech / Lending",
  "E-commerce / Retail",
  "Healthcare / Medtech",
  "Logistics / Courier",
  "Real Estate",
  "Education / EdTech",
  "Professional Services",
  "Manufacturing",
  "Other",
];

const challenges = [
  "Slow or manual customer support",
  "High volume of repetitive queries",
  "Manual data entry and handoffs",
  "Lead follow-up and conversion",
  "Order tracking and status updates",
  "Document collection and verification",
  "Reporting and analytics visibility",
  "Other",
];

const steps = [
  {
    icon: MessageSquare,
    title: "30-min discovery call",
    body: "We review your current workflow, team structure, and automation goals. No obligation.",
  },
  {
    icon: BarChart2,
    title: "Baseline audit",
    body: "You receive a written summary of automation opportunities and projected time savings for your specific operation.",
  },
  {
    icon: CalendarCheck,
    title: "Live demo on your data",
    body: "We configure a working demo using your actual products, services, or FAQ content — not a generic template.",
  },
];

const reassurances = [
  "No credit card required",
  "Response within 1 business day",
  "Demo scoped to your specific business",
  "No obligation to proceed",
];

type FormState = "idle" | "submitting" | "success";

export default function DemoPage() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    businessType: "",
    challenge: "",
    message: "",
  });
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  function validate() {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.company.trim()) e.company = "Required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email";
    if (!form.businessType) e.businessType = "Select one";
    if (!form.challenge) e.challenge = "Select one";
    return e;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setState("submitting");
    // No backend — simulate brief delay then show success
    await new Promise((r) => setTimeout(r, 900));
    setState("success");
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0f1a] pt-24">

        {/* ── Page header ─────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#d4a843]">
              No commitment required
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Request a Demo
            </h1>
            <p className="mt-5 text-lg text-slate-400">
              Tell us about your business and we will configure a working
              demonstration around your specific workflow — not a generic
              product tour.
            </p>
          </div>
        </section>

        {/* ── Main grid ───────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[1fr_420px]">

            {/* ── Left: form ──────────────────────────────── */}
            <div>
              {state === "success" ? (
                <SuccessCard name={form.name} />
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-6 rounded-2xl border border-slate-800 bg-[#0d1320] p-8"
                >
                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Name */}
                    <Field label="Full Name" error={errors.name}>
                      <input
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Stephen Okoronwko"
                        value={form.name}
                        onChange={handleChange}
                        className={inputClass(!!errors.name)}
                      />
                    </Field>

                    {/* Company */}
                    <Field label="Company / Organisation" error={errors.company}>
                      <input
                        name="company"
                        type="text"
                        autoComplete="organization"
                        placeholder="Acme Microfinance Ltd"
                        value={form.company}
                        onChange={handleChange}
                        className={inputClass(!!errors.company)}
                      />
                    </Field>
                  </div>

                  {/* Email */}
                  <Field label="Business Email" error={errors.email}>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@yourcompany.com"
                      value={form.email}
                      onChange={handleChange}
                      className={inputClass(!!errors.email)}
                    />
                  </Field>

                  {/* Business Type */}
                  <Field label="Business Type" error={errors.businessType}>
                    <select
                      name="businessType"
                      value={form.businessType}
                      onChange={handleChange}
                      className={inputClass(!!errors.businessType)}
                    >
                      <option value="">Select your sector…</option>
                      {businessTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </Field>

                  {/* Primary Challenge */}
                  <Field label="Primary Challenge" error={errors.challenge}>
                    <select
                      name="challenge"
                      value={form.challenge}
                      onChange={handleChange}
                      className={inputClass(!!errors.challenge)}
                    >
                      <option value="">What do you most want to fix?</option>
                      {challenges.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </Field>

                  {/* Optional message */}
                  <Field label="Additional context (optional)">
                    <textarea
                      name="message"
                      rows={3}
                      placeholder="E.g. We process 200 WhatsApp messages per day and spend 3 hours on manual follow-ups…"
                      value={form.message}
                      onChange={handleChange}
                      className={`${inputClass(false)} resize-none`}
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={state === "submitting"}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4a843] to-[#c0935a] px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition-all hover:from-[#e8c56d] hover:to-[#d4a843] disabled:opacity-60"
                  >
                    {state === "submitting" ? (
                      <>
                        <Spinner /> Submitting…
                      </>
                    ) : (
                      <>
                        Request My Demo <ArrowRight size={15} />
                      </>
                    )}
                  </button>

                  {/* Reassurances */}
                  <ul className="flex flex-wrap gap-x-6 gap-y-1.5 pt-1">
                    {reassurances.map((r) => (
                      <li key={r} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <ShieldCheck size={11} className="text-[#d4a843]/60" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </form>
              )}

              {/* WhatsApp alternative */}
              <p className="mt-6 text-center text-sm text-slate-500">
                Prefer to message us directly?{" "}
                <a
                  href="https://wa.me/2349037621612?text=Hi%2C%20I%27d%20like%20to%20request%20a%20demo%20of%20ShadowSpark"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  Open WhatsApp →
                </a>
              </p>
            </div>

            {/* ── Right: what happens next ─────────────────── */}
            <aside className="space-y-8">
              {/* Process */}
              <div className="rounded-2xl border border-slate-800 bg-[#0d1320] p-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#d4a843]">
                  What happens next
                </p>
                <div className="mt-6 space-y-6">
                  {steps.map(({ icon: Icon, title, body }, i) => (
                    <div key={title} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#d4a843]/10 text-[#d4a843]">
                          <Icon size={16} />
                        </div>
                        {i < steps.length - 1 && (
                          <div className="mt-2 h-full w-px bg-slate-800" style={{ minHeight: 24 }} />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-semibold text-white">{title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Who this is for */}
              <div className="rounded-2xl border border-slate-800 bg-[#0d1320] p-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#d4a843]">
                  Who this is for
                </p>
                <ul className="mt-4 space-y-3">
                  {[
                    "Nigerian SMEs processing 50+ customer messages per day",
                    "Operations teams spending 2+ hours on manual follow-ups",
                    "Businesses that have outgrown WhatsApp shared inboxes",
                    "Companies that want measurable ROI before committing",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-400">
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#d4a843]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing pointer */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-6 py-5">
                <p className="text-xs text-slate-500">
                  Demo is free and requires no commitment. If you want to review
                  pricing before the call,{" "}
                  <Link href="/pricing" className="text-[#d4a843] hover:underline">
                    see our plans →
                  </Link>
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/* ── Sub-components ─────────────────────────────────────── */

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-300">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return [
    "block w-full rounded-lg border bg-slate-800/50 px-3.5 py-2.5 text-sm text-white placeholder-slate-500",
    "focus:outline-none focus:ring-2 focus:ring-[#d4a843]/40 transition-colors",
    hasError
      ? "border-red-500/60 focus:border-red-400"
      : "border-slate-700 focus:border-[#d4a843]/60",
  ].join(" ");
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
    </svg>
  );
}

function SuccessCard({ name }: { name: string }) {
  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
        <CheckCircle2 size={28} className="text-emerald-400" />
      </div>
      <h2 className="mt-5 text-xl font-semibold text-white">
        Request received, {name.split(" ")[0]}.
      </h2>
      <p className="mt-3 text-sm text-slate-400">
        We will review your submission and get back to you within one business
        day to schedule the demo. Check your inbox — or message us on WhatsApp
        if you need a faster response.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <a
          href="https://wa.me/2349037621612?text=Hi%2C%20I%20just%20submitted%20a%20demo%20request"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.525 5.847L0 24l6.336-1.501A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.802 9.802 0 01-5.034-1.387l-.361-.214-3.74.885.934-3.617-.235-.374A9.786 9.786 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.431 0 9.818 4.388 9.818 9.818 0 5.431-4.387 9.818-9.818 9.818z"/>
          </svg>
          Message us on WhatsApp
        </a>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition-all hover:border-[#d4a843]/40 hover:text-[#d4a843]"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

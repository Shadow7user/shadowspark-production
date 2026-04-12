"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const DEMO_FEE = 1000;

function parseListParam(value: string | null, fallback: string[]) {
  if (!value) return fallback;
  const items = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length > 0 ? items : fallback;
}

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const miniAudit = useMemo(
    () => ({
      leadId: searchParams.get("leadId") ?? "new",
      email: searchParams.get("email") ?? "",
      businessType: searchParams.get("businessType") ?? "Nigerian business",
      goal: searchParams.get("goal") ?? "turn more conversations into qualified leads",
      recommendation: searchParams.get("recommendation") ?? "Growth",
      priorities: parseListParam(searchParams.get("priorities"), [
        "Set up a stronger lead capture journey",
        "Automate follow-up on WhatsApp",
        "Track conversions with a cleaner funnel",
      ]),
      features: parseListParam(searchParams.get("features"), ["Website", "Chatbot", "CRM"]),
    }),
    [searchParams]
  );

  async function handlePayment() {
    if (!acceptedTerms || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: miniAudit.email || "demo@shadowspark.dev",
          amount: DEMO_FEE,
          leadId: miniAudit.leadId,
        }),
      });

      const result = await response.json().catch(() => null);
      const paymentUrl = result?.data?.authorization_url;

      if (!response.ok || !paymentUrl) {
        throw new Error(result?.error || "Unable to initialize Paystack payment.");
      }

      window.location.href = paymentUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to initialize Paystack payment.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-10 text-zinc-100 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950/90 p-6 shadow-[0_0_60px_rgba(0,229,255,0.08)] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Mini-Audit Summary
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Your recommended setup is {miniAudit.recommendation}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-300">
            Based on your {miniAudit.businessType.toLowerCase()} workflow, the priority is to{" "}
            {miniAudit.goal.toLowerCase()} with a tighter website-to-WhatsApp handoff and clearer
            follow-up automation.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
                Priority Actions
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
                {miniAudit.priorities.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-cyan-300">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.5rem] border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
                Recommended Features
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
                {miniAudit.features.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-cyan-300">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <aside className="rounded-[2rem] border border-zinc-800 bg-zinc-950/90 p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Demo Access
          </p>
          <div className="mt-5 rounded-[1.5rem] border border-cyan-400/30 bg-cyan-400/10 p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-cyan-100">Demo Fee</p>
            <p className="mt-3 text-4xl font-black text-white">₦1,000</p>
            <p className="mt-3 text-sm leading-6 text-zinc-200">
              Credited toward any plan if you proceed.
            </p>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-zinc-800 bg-zinc-900 p-5">
            <label className="flex items-start gap-3 text-sm leading-6 text-zinc-300">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-cyan-400 focus:ring-cyan-400"
              />
              <span>
                I agree to the{" "}
                <Link href="#" className="text-cyan-300 hover:text-cyan-200">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-cyan-300 hover:text-cyan-200">
                  Privacy
                </Link>
                . I understand the fee is a credited deposit for my demo environment.
              </span>
            </label>
          </div>

          {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

          <button
            type="button"
            onClick={handlePayment}
            disabled={!acceptedTerms || loading}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#00E5FF] px-6 py-4 text-base font-bold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Redirecting to Paystack..." : "Pay with Paystack"}
          </button>
        </aside>
      </div>
    </main>
  );
}

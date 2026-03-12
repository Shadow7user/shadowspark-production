"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function DemoClaimPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("id") || "";
  const organizationName = searchParams.get("organizationName") || "your organization";

  const whatsappHref = useMemo(() => {
    const text = `Hello, I generated an AI demo for ${organizationName} and want to deploy it. Session ID: ${sessionId}`;
    return `https://wa.me/2349045770572?text=${encodeURIComponent(text)}`;
  }, [organizationName, sessionId]);

  const [loading, setLoading] = useState(!!sessionId);
  const [error, setError] = useState("");
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    async function claimDemo() {
      try {
        const res = await fetch("/api/demo-claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to claim demo");
        }

        if (!cancelled) setClaimed(true);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    claimDemo();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-[#03120F] px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl rounded-3xl border border-[#00FFD5]/20 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#00FFD5]">
          ShadowSpark Deployment
        </p>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          We’ll build this for you
        </h1>

        <p className="mt-5 text-lg text-white/75">
          {organizationName} can now move from demo to real deployment. ShadowSpark can build,
          host, manage, and optimize this system for your team.
        </p>

        {loading ? (
          <div className="mt-8 rounded-2xl border border-[#00FFD5]/20 bg-[#00FFD5]/10 p-4 text-sm text-[#9FFFEF]">
            Claiming your demo session...
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-[#00FFD5]/20 bg-[#00FFD5]/10 p-4 text-sm text-[#9FFFEF]">
            {claimed ? "Your demo has been marked for follow-up." : "Ready for deployment follow-up."}
          </div>
        )}

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center rounded-2xl bg-[#00FFD5] px-6 py-4 text-base font-semibold text-black transition hover:opacity-90"
          >
            Continue on WhatsApp
          </Link>

          <Link
            href="https://calendly.com/morontomornica7/audit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center rounded-2xl border border-[#00FFD5]/40 px-6 py-4 text-base font-semibold text-[#00FFD5] transition hover:bg-[#00FFD5]/10"
          >
            Book an audit call
          </Link>
        </div>

        <p className="mt-6 text-sm text-white/50">
          Session ID: <span className="font-mono">{sessionId || "missing"}</span>
        </p>
      </div>
    </main>
  );
}

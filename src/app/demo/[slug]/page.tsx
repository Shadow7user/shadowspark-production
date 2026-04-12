"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type DemoData = {
  businessName: string;
  niche: string;
  packageRecommendation: string;
  websitePreviewUrl?: string | null;
  websiteHeadline?: string | null;
  websiteSummary?: string | null;
  createdAt: string;
};

function isExpired(createdAt: string) {
  const createdTime = new Date(createdAt).getTime();
  if (Number.isNaN(createdTime)) return false;
  return Date.now() - createdTime > 48 * 60 * 60 * 1000;
}

export default function DemoPreviewPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const [demo, setDemo] = useState<DemoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDemo() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/demo/${encodeURIComponent(slug)}`);
        const result = await response.json().catch(() => null);

        if (!response.ok || !result) {
          throw new Error(result?.error || "Unable to load demo preview.");
        }

        if (!cancelled) {
          setDemo(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load demo preview.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (slug) {
      loadDemo();
    } else {
      setLoading(false);
      setError("Missing demo slug.");
    }

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const expired = useMemo(() => (demo ? isExpired(demo.createdAt) : false), [demo]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-6 text-zinc-100">
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950/90 px-8 py-10 text-center shadow-[0_0_60px_rgba(0,229,255,0.08)]">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-cyan-300" />
          <p className="mt-4 text-sm uppercase tracking-[0.2em] text-cyan-300">Loading Demo Preview</p>
        </div>
      </main>
    );
  }

  if (error || !demo) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-6 text-zinc-100">
        <div className="max-w-lg rounded-[2rem] border border-zinc-800 bg-zinc-950/90 p-8 text-center">
          <p className="text-sm uppercase tracking-[0.22em] text-red-400">Preview Unavailable</p>
          <h1 className="mt-4 text-3xl font-black text-white">This demo could not be loaded</h1>
          <p className="mt-4 text-zinc-400">{error || "The preview is unavailable right now."}</p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-[#00E5FF] px-6 py-3 text-sm font-bold text-black transition hover:brightness-110"
          >
            Return Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-10 text-zinc-100 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950/90 p-6 shadow-[0_0_70px_rgba(0,229,255,0.08)] sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
                ShadowSpark Demo
              </p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                {demo.businessName}
              </h1>
              <p className="mt-3 text-lg text-zinc-300">{demo.niche}</p>
            </div>

            <div className="rounded-[1.5rem] border border-cyan-400/30 bg-cyan-400/10 p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-cyan-100">Recommended Package</p>
              <p className="mt-3 text-3xl font-black text-white">{demo.packageRecommendation}</p>
              <Link
                href={`/checkout/select?plan=${encodeURIComponent(demo.packageRecommendation)}`}
                className="mt-5 inline-flex rounded-full bg-[#00E5FF] px-5 py-3 text-sm font-bold text-black transition hover:brightness-110"
              >
                Choose This Plan
              </Link>
            </div>
          </div>

          {expired ? (
            <div className="mt-6 rounded-[1.25rem] border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-sm text-amber-100">
              This demo preview is older than 48 hours and may expire soon. Regenerate it if you need a fresh version.
            </div>
          ) : null}

          <section className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="overflow-hidden rounded-[1.75rem] border border-zinc-800 bg-zinc-900">
              <div className="flex items-center gap-2 border-b border-zinc-800 px-5 py-4">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-amber-300" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <div className="ml-3 rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
                  {demo.websitePreviewUrl || `${demo.businessName.toLowerCase().replace(/\s+/g, "")}.demo`}
                </div>
              </div>

              {demo.websitePreviewUrl ? (
                <iframe
                  src={demo.websitePreviewUrl}
                  title={`${demo.businessName} website preview`}
                  className="h-[560px] w-full bg-white"
                />
              ) : (
                <div className="flex min-h-[560px] flex-col justify-between bg-[radial-gradient(circle_at_top,rgba(0,229,255,0.12),transparent_30%),#111111] p-8">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">Mock Website Preview</p>
                    <h2 className="mt-5 max-w-xl text-4xl font-black tracking-tight text-white">
                      {demo.websiteHeadline || `A sharper digital storefront for ${demo.businessName}`}
                    </h2>
                    <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
                      {demo.websiteSummary ||
                        `This preview shows how ShadowSpark can package ${demo.businessName} into a cleaner website and conversion flow for ${demo.niche.toLowerCase()} customers.`}
                    </p>
                  </div>

                  <div className="mt-10 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-[1.25rem] border border-zinc-800 bg-zinc-950/70 p-4">
                      <p className="text-sm text-zinc-400">Lead Capture</p>
                      <p className="mt-2 text-xl font-bold text-white">Always On</p>
                    </div>
                    <div className="rounded-[1.25rem] border border-zinc-800 bg-zinc-950/70 p-4">
                      <p className="text-sm text-zinc-400">WhatsApp Routing</p>
                      <p className="mt-2 text-xl font-bold text-white">Automated</p>
                    </div>
                    <div className="rounded-[1.25rem] border border-zinc-800 bg-zinc-950/70 p-4">
                      <p className="text-sm text-zinc-400">Sales Handoff</p>
                      <p className="mt-2 text-xl font-bold text-white">Structured</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-[1.5rem] border border-zinc-800 bg-zinc-900 p-6">
                <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">Business Snapshot</p>
                <dl className="mt-4 space-y-4 text-sm text-zinc-300">
                  <div>
                    <dt className="text-zinc-500">Business Name</dt>
                    <dd className="mt-1 text-white">{demo.businessName}</dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500">Niche</dt>
                    <dd className="mt-1 text-white">{demo.niche}</dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500">Created</dt>
                    <dd className="mt-1 text-white">{new Date(demo.createdAt).toLocaleString()}</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-[1.5rem] border border-zinc-800 bg-zinc-900 p-6">
                <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">Next Step</p>
                <p className="mt-4 text-sm leading-6 text-zinc-300">
                  Lock in the {demo.packageRecommendation} package to turn this demo into a working website, automation flow, and launch-ready conversion system.
                </p>
                <Link
                  href={`/checkout/select?plan=${encodeURIComponent(demo.packageRecommendation)}`}
                  className="mt-5 inline-flex rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/60 hover:text-cyan-300"
                >
                  Review Plan Details
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

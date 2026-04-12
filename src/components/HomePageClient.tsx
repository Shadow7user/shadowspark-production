"use client";

import Link from "next/link";

const packages = [
  {
    name: "Launch",
    price: "₦30k/mo or ₦150k/yr",
    description: "Website + Hosting + Lead Capture",
  },
  {
    name: "Growth",
    price: "₦50k/mo or ₦300k/yr",
    description: "Everything in Launch + Analytics + Funnel",
  },
  {
    name: "Automation",
    price: "₦85k/mo or ₦550k/yr",
    description: "Growth + Chatbot + Workflows",
  },
];

const whatsappUrl = "https://wa.me/2340000000000";

export default function HomePageClient() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-zinc-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-10 sm:px-10 lg:px-12">
        <section className="relative overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950/70 px-6 py-16 shadow-[0_0_80px_rgba(0,229,255,0.08)] sm:px-10 lg:px-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,229,255,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(0,229,255,0.08),transparent_28%)]" />
          <div className="relative mx-auto max-w-4xl text-center">
            <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#00E5FF]">
              ShadowSpark
            </span>
            <h1 className="mt-8 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
              Turn WhatsApp Conversations into Revenue
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-300 sm:text-xl">
              Websites, Automation &amp; AI Systems for Nigerian Businesses
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/checkout/new"
                className="inline-flex min-w-[240px] items-center justify-center rounded-full bg-[#00E5FF] px-7 py-4 text-base font-bold text-black transition hover:brightness-110"
              >
                Start Qualification Audit
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-w-[240px] items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 px-7 py-4 text-base font-semibold text-white transition hover:border-cyan-400/60 hover:text-[#00E5FF]"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#00E5FF]">
                Packages
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                Built for businesses ready to convert faster
              </h2>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {packages.map((pkg, index) => (
              <article
                key={pkg.name}
                className={[
                  "rounded-[1.75rem] border bg-zinc-950 p-8",
                  index === 2
                    ? "border-cyan-400/50 shadow-[0_0_60px_rgba(0,229,255,0.12)]"
                    : "border-zinc-800",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{pkg.name}</h3>
                    <p className="mt-4 text-3xl font-black text-[#00E5FF]">{pkg.price}</p>
                  </div>
                  {index === 2 ? (
                    <span className="rounded-full bg-cyan-400 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-black">
                      Popular
                    </span>
                  ) : null}
                </div>
                <p className="mt-8 text-base leading-7 text-zinc-300">{pkg.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-zinc-800 bg-zinc-950 px-6 py-12 sm:px-10">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#00E5FF]">
                Demo Fee
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                Start with a ₦1,000 qualification demo
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-300">
                We use the demo to map your funnel, configure the right automation, and show you how the system fits your business. The ₦1,000 fee is credited toward any plan you choose after the audit.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-cyan-400/30 bg-cyan-400/10 p-8">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-100">What you get</p>
              <ul className="mt-5 space-y-4 text-zinc-100">
                <li>Lead capture and website fit review</li>
                <li>WhatsApp automation recommendation</li>
                <li>Plan recommendation with credited fee</li>
              </ul>
            </div>
          </div>
        </section>

        <footer className="mt-16 flex flex-col gap-4 border-t border-zinc-800 pt-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 ShadowSpark. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="#" className="transition hover:text-[#00E5FF]">
              Terms
            </Link>
            <Link href="#" className="transition hover:text-[#00E5FF]">
              Privacy
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}

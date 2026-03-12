import Link from "next/link";

const bg = "#050508";
const primary = "#00FFD5";
const accent = "#BD00FF";

const services = [
  {
    title: "Same-day dispatch",
    body: "Bike and van network across Lagos mainland/island with live rider tracking and POD photos.",
  },
  {
    title: "Nationwide line haul",
    body: "Daily departures to Abuja, PH, Enugu, Owerri, Kano with cash-on-delivery reconciliation.",
  },
  {
    title: "Returns + RTO automation",
    body: "Automated customer nudges, reverse pickups, and reason codes synced to your dashboard.",
  },
];

const steps = [
  {
    title: "Share manifest",
    body: "Upload CSV or connect Shopify/WooCommerce. We validate addresses and flag risky deliveries.",
  },
  {
    title: "Auto-assign riders",
    body: "Our AI routes by traffic heatmaps, distance, and COD risk. Customers get WhatsApp status updates.",
  },
  {
    title: "Cash reconciliation",
    body: "End-of-day COD summary, discrepancies flagged, and payouts initiated to your bank.",
  },
];

export default function LogisticsDemoPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: bg }}>
      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-20 pt-24 text-white md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: primary }}>
            SwiftMove Logistics · Demo
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Turn WhatsApp orders into <span style={{ color: primary }}>same-day deliveries</span> with full visibility.
          </h1>
          <p className="text-lg text-slate-300">
            SwiftMove powers Lagos merchants with automated dispatching, rider tracking, and cash-on-delivery reconciliation.
            See how your ops would run on day one.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://wa.me/2349045770572"
              className="rounded-xl px-5 py-3 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5"
              style={{ backgroundColor: primary, color: bg }}
            >
              Chat on WhatsApp
            </a>
            <Link
              href="/demo"
              className="rounded-xl border px-5 py-3 text-sm font-semibold transition hover:border-transparent"
              style={{ borderColor: primary, color: primary }}
            >
              See full demo flow
            </Link>
          </div>
        </div>
        <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full blur-3xl" style={{ backgroundColor: accent }} />
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-slate-200">Live fleet snapshot</p>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <StatCard label="Riders active" value="142" />
              <StatCard label="On-time" value="96%" highlight />
              <StatCard label="Avg. ETA" value="41m" />
            </div>
            <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-3">
              <p className="text-[13px] text-slate-200">Next-up</p>
              <ul className="mt-2 space-y-2 text-[12px] text-slate-300">
                <li className="flex items-center justify-between">
                  Lekki → Yaba <span style={{ color: primary }}>ETA 18m</span>
                </li>
                <li className="flex items-center justify-between">
                  Ikeja → Surulere <span style={{ color: primary }}>ETA 23m</span>
                </li>
                <li className="flex items-center justify-between">
                  Ajah → VI <span style={{ color: primary }}>ETA 34m</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">What SwiftMove handles</h2>
          <span className="text-xs uppercase tracking-[0.2em]" style={{ color: primary }}>
            Lagos-first. Nigeria-wide.
          </span>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl border border-white/5 bg-white/5 p-5 shadow-lg"
              style={{ boxShadow: `0 20px 60px -24px ${primary}33` }}
            >
              <h3 className="text-lg font-semibold text-white">{service.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{service.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="flex items-center gap-3">
          <div className="h-1 w-10 rounded-full" style={{ backgroundColor: accent }} />
          <p className="text-sm font-semibold text-white">How it works</p>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-white/5 bg-[#0b0b12] p-6"
            >
              <span
                className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                style={{ backgroundColor: `${primary}22`, color: primary }}
              >
                {idx + 1}
              </span>
              <h3 className="text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#0d0d16] via-[#0b0b12] to-[#0d0d16] px-8 py-10 shadow-2xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: primary }}>
                Ready for Lagos speed
              </p>
              <h3 className="mt-2 text-2xl font-bold text-white">See SwiftMove running on your orders</h3>
              <p className="text-sm text-slate-300">
                Share your top routes and COD share. We will configure routing rules and a live rider view within 24 hours.
              </p>
            </div>
            <a
              href="https://wa.me/2349045770572"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{ backgroundColor: accent, color: bg }}
            >
              Talk to SwiftMove on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className="rounded-xl border border-white/10 bg-black/30 px-3 py-2"
      style={highlight ? { borderColor: primary } : undefined}
    >
      <p className="text-[11px] text-slate-400">{label}</p>
      <p className="text-base font-semibold text-white">{value}</p>
    </div>
  );
}

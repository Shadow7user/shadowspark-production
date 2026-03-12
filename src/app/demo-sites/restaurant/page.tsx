import Link from "next/link";

const bg = "#050508";
const primary = "#00FFD5";
const accent = "#BD00FF";

const menuHighlights = [
  { name: "Port Harcourt Bole & Fish", note: "Fire-grilled plantain, spicy pepper sauce, smoked catfish." },
  { name: "Goat Meat Pepper Soup", note: "Light, herby broth with utazi — served with agidi or yam." },
  { name: "Native Jollof", note: "Palm-oil jollof with periwinkle, smoked prawns, and scent leaf." },
];

const features = [
  "WhatsApp ordering with automatic payment links for card or transfer.",
  "Kitchen display tickets and prep timers for dine-in and delivery.",
  "Driver handoff flow with OTP to reduce wrong deliveries.",
  "End-of-day sales summary and stock depletion alerts.",
];

export default function RestaurantDemoPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: bg }}>
      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-20 pt-24 text-white lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: primary }}>
            Mama&apos;s Kitchen PH · Demo
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            From WhatsApp order to{" "}
            <span style={{ color: primary }}>doorstep in 35 minutes</span>.
          </h1>
          <p className="text-lg text-slate-300">
            Port Harcourt&apos;s favorite bole spot now runs on automated ordering, kitchen routing, and delivery tracking.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://wa.me/2349045770572"
              className="rounded-xl px-5 py-3 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5"
              style={{ backgroundColor: primary, color: bg }}
            >
              Order on WhatsApp
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
          <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl" style={{ backgroundColor: accent }} />
          <div className="space-y-3 text-sm">
            <p className="font-semibold text-slate-200">Live tickets</p>
            <div className="grid gap-2 text-[12px] text-slate-200">
              <TicketCard item="Bole & Fish x2" status="Grilling" eta="12m" />
              <TicketCard item="Native Jollof" status="Plating" eta="6m" />
              <TicketCard item="Pepper Soup" status="Driver waiting" eta="Pick up now" highlight />
            </div>
          </div>
        </div>
      </section>

      {/* Menu highlights */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Menu highlights</h2>
          <span className="text-xs uppercase tracking-[0.2em]" style={{ color: primary }}>
            Port Harcourt
          </span>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {menuHighlights.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-white/5 bg-white/5 p-5 shadow-lg"
              style={{ boxShadow: `0 20px 60px -24px ${primary}33` }}
            >
              <h3 className="text-lg font-semibold text-white">{item.name}</h3>
              <p className="mt-2 text-sm text-slate-300">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="flex items-center gap-3">
          <div className="h-1 w-10 rounded-full" style={{ backgroundColor: accent }} />
          <p className="text-sm font-semibold text-white">Why operations run smoother</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature}
              className="flex gap-3 rounded-xl border border-white/5 bg-[#0b0b12] p-4"
            >
              <span className="mt-0.5 h-2 w-2 rounded-full" style={{ backgroundColor: primary }} />
              <p className="text-sm text-slate-300">{feature}</p>
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
                Delivery that feels premium
              </p>
              <h3 className="mt-2 text-2xl font-bold text-white">See Mama&apos;s Kitchen in your area</h3>
              <p className="text-sm text-slate-300">
                Share your top five dishes and average order volume. We will configure ordering, kitchen tickets, and driver handoff in under 24 hours.
              </p>
            </div>
            <a
              href="https://wa.me/2349045770572"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{ backgroundColor: accent, color: bg }}
            >
              Order from Mama&apos;s on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function TicketCard({ item, status, eta, highlight = false }: { item: string; status: string; eta: string; highlight?: boolean }) {
  return (
    <div
      className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-2"
      style={highlight ? { borderColor: primary } : undefined}
    >
      <div>
        <p className="text-sm font-semibold text-white">{item}</p>
        <p className="text-[11px] text-slate-400">{status}</p>
      </div>
      <span className="text-xs font-semibold" style={{ color: primary }}>
        {eta}
      </span>
    </div>
  );
}

import Link from "next/link";

const bg = "#050508";
const primary = "#00FFD5";
const accent = "#BD00FF";

const programs = [
  {
    title: "Sunday Celebration",
    body: "Two services (8am, 10:30am) with kids church, teen hub, and live stream for members on the road.",
  },
  {
    title: "Midweek Recharge",
    body: "Wednesday teaching + prayer clinic; testimonies and prayer requests collected via WhatsApp forms.",
  },
  {
    title: "Impact Groups",
    body: "Neighborhood cells across Lekki, Ajah, Yaba, Ikeja meeting weekly with shared devotional plans.",
  },
];

const features = [
  "WhatsApp-first comms: service updates, devotionals, and rosters sent automatically.",
  "Volunteer scheduling with shift confirmations and swap requests handled in-chat.",
  "New guest follow-up journeys with pastoral assignments and visit reminders.",
  "Giving links for card/transfer with instant receipts and pledge tracking.",
];

export default function ChurchDemoPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: bg }}>
      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-20 pt-24 text-white lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: primary }}>
            Covenant Life Assembly · Demo
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Keep every member <span style={{ color: primary }}>in the loop</span> — services, groups, and giving.
          </h1>
          <p className="text-lg text-slate-300">
            Covenant Life Assembly uses WhatsApp automations to welcome guests, coordinate volunteers, and share updates instantly.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://wa.me/2349045770572"
              className="rounded-xl px-5 py-3 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5"
              style={{ backgroundColor: primary, color: bg }}
            >
              Connect on WhatsApp
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
            <p className="font-semibold text-slate-200">Today at Covenant Life</p>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <StatCard label="Volunteers checked in" value="86" />
              <StatCard label="New guests" value="24" highlight />
              <StatCard label="Prayer requests" value="57 open" />
            </div>
            <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-3">
              <p className="text-[13px] text-slate-200">Live updates</p>
              <ul className="mt-2 space-y-2 text-[12px] text-slate-300">
                <li className="flex items-center justify-between">
                  Choir roster <span style={{ color: primary }}>All confirmed</span>
                </li>
                <li className="flex items-center justify-between">
                  Midweek prayer <span style={{ color: primary }}>Broadcast 7pm</span>
                </li>
                <li className="flex items-center justify-between">
                  Youth hangout <span style={{ color: primary }}>Venue update sent</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Programs members love</h2>
          <span className="text-xs uppercase tracking-[0.2em]" style={{ color: primary }}>
            Lekki · Mainland · Online
          </span>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {programs.map((program) => (
            <div
              key={program.title}
              className="rounded-2xl border border-white/5 bg-white/5 p-5 shadow-lg"
              style={{ boxShadow: `0 20px 60px -24px ${primary}33` }}
            >
              <h3 className="text-lg font-semibold text-white">{program.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{program.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="flex items-center gap-3">
          <div className="h-1 w-10 rounded-full" style={{ backgroundColor: accent }} />
          <p className="text-sm font-semibold text-white">Operational flow</p>
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
                Stay connected all week
              </p>
              <h3 className="mt-2 text-2xl font-bold text-white">See Covenant Life automations on your lists</h3>
              <p className="text-sm text-slate-300">
                Send us your rota and event calendar. We will configure broadcasts, reminders, and guest follow-ups within 24 hours.
              </p>
            </div>
            <a
              href="https://wa.me/2349045770572"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{ backgroundColor: accent, color: bg }}
            >
              Connect on WhatsApp
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

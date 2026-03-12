import Link from "next/link";

const bg = "#050508";
const primary = "#00FFD5";
const accent = "#BD00FF";

const demos = [
  { href: "/demo-sites/logistics", name: "SwiftMove Logistics", summary: "Same-day dispatch, nationwide line haul, COD reconciliation." },
  { href: "/demo-sites/school", name: "Brightmind Academy", summary: "Parent-first school ops with attendance, fees, and progress alerts." },
  { href: "/demo-sites/restaurant", name: "Mama's Kitchen PH", summary: "WhatsApp ordering, kitchen tickets, and driver handoff in PH." },
  { href: "/demo-sites/hospital", name: "MedCare Specialist Clinic", summary: "Triage, scheduling, and secure results delivery for clinics." },
  { href: "/demo-sites/church", name: "Covenant Life Assembly", summary: "Guest follow-up, volunteer rosters, and giving links on WhatsApp." },
];

export default function DemoSitesIndexPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: bg }}>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-24 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: primary }}>
          ShadowSpark · Live Demo Sites
        </p>
        <h1 className="mt-3 text-4xl font-bold">Live Demo Sites</h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          Explore sector-specific demos configured for Nigerian SMEs. Each site showcases automation, messaging flows, and operational dashboards.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {demos.map((demo) => (
            <Link
              key={demo.href}
              href={demo.href}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 transition hover:-translate-y-1"
              style={{ boxShadow: `0 24px 60px -28px ${primary}33` }}
            >
              <div className="absolute -right-16 -top-20 h-40 w-40 rounded-full blur-3xl opacity-60" style={{ backgroundColor: accent }} />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white group-hover:text-[#00ffd5]" style={{ color: "white" }}>
                    {demo.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-300">{demo.summary}</p>
                </div>
                <span
                  className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] transition"
                  style={{ backgroundColor: `${primary}22`, color: primary }}
                >
                  View
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

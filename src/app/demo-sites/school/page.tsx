import Link from "next/link";

const bg = "#050508";
const primary = "#00FFD5";
const accent = "#BD00FF";

const programs = [
  {
    title: "STEM Plus",
    body: "Hands-on science and robotics for JSS/SSS with weekly lab time and project showcases.",
  },
  {
    title: "Literacy Boost",
    body: "Reading and writing clinics with phonics drills, comprehension games, and weekly book clubs.",
  },
  {
    title: "After-School Care",
    body: "Homework supervision, coding clubs, and safe transport coordination for working parents.",
  },
];

const features = [
  "Daily attendance + pickup alerts on WhatsApp for parents.",
  "Termly fee reminders with auto-issued receipts and payment links.",
  "Progress reports with teacher voice notes and rubric-based grading.",
  "Clubs and excursions sign-up forms that sync to class lists automatically.",
];

export default function SchoolDemoPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: bg }}>
      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-20 pt-24 text-white lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: primary }}>
            Brightmind Academy · Demo
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Parent-first schooling with{" "}
            <span style={{ color: primary }}>instant updates</span> and reliable fee collection.
          </h1>
          <p className="text-lg text-slate-300">
            Brightmind Academy in Lekki automates attendance, payments, and parent comms so teachers focus on teaching.
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
          <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full blur-3xl" style={{ backgroundColor: accent }} />
          <div className="space-y-3 text-sm">
            <p className="font-semibold text-slate-200">Today at Brightmind</p>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <StatCard label="Students in" value="428" />
              <StatCard label="Attendance" value="98%" highlight />
              <StatCard label="Fees collected" value="₦7.2m" />
            </div>
            <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-3">
              <p className="text-[13px] text-slate-200">Parent inbox</p>
              <ul className="mt-2 space-y-2 text-[12px] text-slate-300">
                <li className="flex items-center justify-between">
                  Grade 5 Robotics <span style={{ color: primary }}>Project videos sent</span>
                </li>
                <li className="flex items-center justify-between">
                  Grade 3 Literacy <span style={{ color: primary }}>3 absences flagged</span>
                </li>
                <li className="flex items-center justify-between">
                  SSS 2 Fees <span style={{ color: primary }}>12 reminders paid</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Programs families love</h2>
          <span className="text-xs uppercase tracking-[0.2em]" style={{ color: primary }}>
            Lekki · VI · Ajah
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
          <p className="text-sm font-semibold text-white">Why admins pick Brightmind</p>
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
                Parent comms that run themselves
              </p>
              <h3 className="mt-2 text-2xl font-bold text-white">See Brightmind on your school calendar</h3>
              <p className="text-sm text-slate-300">
                Send us your current timetable and fee schedule. We will spin up the alerts, reminders, and receipts in under 24 hours.
              </p>
            </div>
            <a
              href="https://wa.me/2349045770572"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{ backgroundColor: accent, color: bg }}
            >
              Talk to Brightmind on WhatsApp
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

import Link from "next/link";

const team = [
  {
    name: "Okoronkwo Stephen Chijioke",
    initials: "OSC",
    role: "Founder & Architect",
    gradient: "from-cyan-400 to-purple-500",
    phone: "2349045770572",
    desc: "Leads platform architecture, AI systems, and high-stakes delivery.",
  },
  {
    name: "Emmanuel",
    initials: "EM",
    role: "Co-Owner & Support Architect",
    gradient: "from-purple-400 to-pink-500",
    phone: "2349040014125",
    desc: "Keeps client projects healthy and ships quality experiences.",
  },
  {
    name: "Reginald",
    initials: "RG",
    role: "Sales Lead",
    gradient: "from-emerald-400 to-cyan-400",
    phone: "2348107677660",
    desc: "Guides prospects, demos ShadowSpark, and drives client success.",
  },
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-[#080d18] text-white">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.12),_transparent_40%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
          <header className="text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/70">Core Team</p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
              The Team – ShadowSpark Technologies
            </h1>
            <p className="mt-3 text-base text-slate-400">
              Cyberpunk-grade builders based in Port Harcourt, Nigeria.
              We blend AI, automation, and WhatsApp experiences for businesses.
            </p>
          </header>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.name}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-md transition hover:border-cyan-300/50 hover:bg-white/8"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${member.gradient} text-sm font-semibold text-slate-900 shadow-lg`}
                  >
                    {member.initials}
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{member.name}</p>
                    <p className="text-sm text-cyan-200/80">{member.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-400">{member.desc}</p>
                <div className="mt-5 flex items-center gap-3">
                  <Link
                    href={`https://wa.me/${member.phone}?text=${encodeURIComponent("Hi! Let's talk about ShadowSpark.")}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/20"
                  >
                    WhatsApp
                  </Link>
                  <span className="text-xs text-slate-500">+{member.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Lock, ShieldCheck, Server, Eye, RefreshCw, FileCheck } from "lucide-react";
import Reveal from "@/components/Reveal";

const badges = [
  { icon: Lock,       label: "TLS 1.3 Encrypted",    sub: "Data in transit" },
  { icon: ShieldCheck, label: "AES-256 at Rest",      sub: "Data in storage" },
  { icon: FileCheck,  label: "NDPR Aligned",          sub: "Nigeria Data Protection" },
  { icon: Server,     label: "Isolated Environments", sub: "Per-client data separation" },
  { icon: Eye,        label: "Full Audit Logging",    sub: "Every access recorded" },
  { icon: RefreshCw,  label: "99.9% Uptime Target",   sub: "Automatic failover" },
];

export default function SecurityBadges() {
  return (
    <section id="trust" className="border-y border-slate-800/60 bg-[#0a0f1a] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">
            Security & Trust Standards
          </p>
        </Reveal>

        <Reveal stagger className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {badges.map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="card-lift flex flex-col items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-5 text-center hover:border-slate-700"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d4a843]/10 text-[#d4a843]">
                <Icon size={18} />
              </div>
              <p className="text-xs font-semibold text-slate-300">{label}</p>
              <p className="text-xs text-slate-600">{sub}</p>
            </div>
          ))}
        </Reveal>

        <p className="mt-6 text-center text-xs text-slate-600">
          Full details on our{" "}
          <a
            href="/security"
            className="text-[#d4a843] underline-offset-2 hover:underline"
          >
            security &amp; data protection page
          </a>
          .
        </p>
      </div>
    </section>
  );
}

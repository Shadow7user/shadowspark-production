import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Users, Zap, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet the ShadowSpark Technologies team. Based in Port Harcourt, Nigeria, we build AI-powered business solutions for African SMEs.",
  openGraph: {
    title: "About ShadowSpark Technologies",
    description:
      "Meet the team building AI-powered business solutions for African SMEs.",
  },
};

const team = [
  {
    name: "ShadowWeaver",
    role: "Founder & Lead Engineer",
    bio: "Full-stack developer passionate about bringing AI automation to Nigerian businesses. Builds end-to-end systems from WhatsApp bots to BI dashboards.",
  },
];

const values = [
  {
    icon: Zap,
    title: "Speed to Value",
    description:
      "We ship production-ready AI solutions in weeks, not months. Your business starts benefiting from day one.",
  },
  {
    icon: Users,
    title: "Built for Nigeria",
    description:
      "Every product is designed for the Nigerian market — WhatsApp-first, Naira pricing, and local payment integrations.",
  },
  {
    icon: Globe,
    title: "Open & Scalable",
    description:
      "We use battle-tested open-source tools (Next.js, Prisma, BullMQ) so your stack scales without vendor lock-in.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0f1a] pt-24">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              About <span className="gradient-text">ShadowSpark</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
              We&apos;re an AI engineering studio based in Port Harcourt,
              Nigeria. We build chatbots, dashboards, and automation tools that
              help African businesses compete globally.
            </p>
          </div>
        </section>

        {/* Location */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-2xl p-8 md:p-12">
            <div className="flex items-center gap-3 text-[#d4a843]">
              <MapPin size={24} />
              <h2 className="text-2xl font-bold text-white">
                Port Harcourt, Nigeria
              </h2>
            </div>
            <p className="mt-4 max-w-3xl text-slate-400">
              ShadowSpark Technologies operates from the heart of Nigeria&apos;s
              Garden City. We serve clients across Lagos, Abuja, Port Harcourt,
              and the broader West African market — all remotely, all
              efficiently. Our infrastructure runs on global cloud platforms
              (Vercel, Railway, Neon) ensuring 99.9% uptime for every client.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-white">
            Our <span className="gradient-text">Values</span>
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="glass-card rounded-2xl p-6 transition-transform hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#d4a843]/10">
                  <v.icon size={24} className="text-[#d4a843]" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm text-slate-400">{v.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-white">
            The <span className="gradient-text">Team</span>
          </h2>
          <div className="mx-auto mt-12 max-w-md">
            {team.map((member) => (
              <div
                key={member.name}
                className="glass-card rounded-2xl p-8 text-center"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#d4a843] to-[#c0935a] text-3xl font-bold text-white">
                  {member.name[0]}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">
                  {member.name}
                </h3>
                <p className="text-sm text-[#d4a843]">{member.role}</p>
                <p className="mt-3 text-sm text-slate-400">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-[#d4a843]/10 to-[#c0935a]/10 p-8 text-center md:p-12">
            <h2 className="text-2xl font-bold text-white">
              Ready to work with us?
            </h2>
            <p className="mt-2 text-slate-400">
              Let&apos;s discuss how AI can transform your business operations.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="rounded-lg bg-gradient-to-r from-[#d4a843] to-[#c0935a] px-6 py-3 text-sm font-semibold text-white transition-all hover:from-[#e8c56d] hover:to-[#d4a843]"
              >
                Start Free Trial
              </Link>
              <a
                href="https://wa.me/2349037621612?text=Hi%2C%20I%27d%20like%20to%20discuss%20a%20project"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-emerald-500/20 px-6 py-3 text-sm font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/10"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

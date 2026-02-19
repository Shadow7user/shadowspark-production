import WhatsAppLink from "@/components/WhatsAppLink";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Users,
  Zap,
  Globe,
  Linkedin,
  Github,
  Terminal,
  Cpu,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Us | ShadowSpark Technologies - AI Solutions for African SMEs",
  description:
    "Meet the ShadowSpark Technologies team. Based in Port Harcourt, Nigeria, we build AI-powered business solutions, WhatsApp chatbots, and automation tools for African SMEs. Our expert team specializes in AI automation, custom chatbot development, and business intelligence dashboards.",
  keywords: [
    "AI solutions Nigeria",
    "WhatsApp chatbot Africa",
    "business automation Nigeria",
    "AI-powered business tools",
    "Nigerian tech startup",
    "ShadowSpark Technologies",
    "AI chatbot development Port Harcourt",
    "business intelligence dashboards",
    "African SME solutions",
    "AI automation services Nigeria",
  ],
  authors: [
    { name: "ShadowSpark Technologies", url: "https://shadowspark-tech.org" },
  ],
  creator: "ShadowSpark Technologies",
  publisher: "ShadowSpark Technologies",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://shadowspark-tech.org/about",
    siteName: "ShadowSpark Technologies",
    title: "About ShadowSpark Technologies - AI Solutions for African SMEs",
    description:
      "Meet the team building AI-powered business solutions for African SMEs. Based in Port Harcourt, Nigeria, we create WhatsApp chatbots, automation tools, and business intelligence dashboards.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ShadowSpark Technologies - AI Solutions for African Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About ShadowSpark Technologies - AI Solutions for African SMEs",
    description:
      "Meet the team building AI-powered business solutions for African SMEs. WhatsApp chatbots, automation tools, and business intelligence dashboards.",
    creator: "@shadowspark_ng",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://shadowspark-tech.org/about",
  },
};

const team = [
  {
    name: "Okoronkwo Stephen Chijioke",
    role: "Founder & Lead Engineer",
    nickname: "ShadowWeaver",
    bio: "Systems Architect and AI Strategist passionate about bringing AI automation to Nigerian businesses. Builds end-to-end systems from WhatsApp bots to BI dashboards.",
    linkedin: "https://linkedin.com/in/stephen-chijioke-okoronkwo",
    github: "https://github.com/ShadowWeaver",
    location: "Port Harcourt, Nigeria",
    image: "/images/founder.jpg",
  },
  {
    name: "ShadowWeaver",
    role: "AI Engineer & Full-Stack Developer",
    nickname: "ShadowDev",
    bio: "Full-stack developer specializing in AI integration, WhatsApp bot development, and scalable web applications for African businesses.",
    linkedin: "https://linkedin.com/in/shadowweaver",
    github: "https://github.com/shadowweaver",
    location: "Port Harcourt, Nigeria",
    image: null,
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

const timeline = [
  {
    year: "2023 - Present",
    title: "Founder & AI Strategist",
    company: "ShadowSpark Technologies",
    description: "Leading transformative AI projects across Africa",
  },
  {
    year: "2020 - 2023",
    title: "Lead Systems Architect",
    company: "TechNova Solutions",
    description: "Architected enterprise systems for Fortune 500 companies",
  },
  {
    year: "2017 - 2020",
    title: "AI Researcher",
    company: "InnovateAI Labs",
    description: "Pioneered ML models for African language processing",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0f1a] pt-24 relative overflow-hidden">
        {/* Cyberpunk background effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-40 right-10 w-96 h-96 bg-magenta-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-cyan-500/3 to-transparent rounded-full" />
        </div>

        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center animate-slide-up">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              About{" "}
              <span
                className="gradient-text glitch-text"
                data-text="ShadowSpark"
              >
                ShadowSpark
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
              We're an AI engineering studio based in Port Harcourt, Nigeria. We
              build chatbots, dashboards, and automation tools that help African
              businesses compete globally.
            </p>
          </div>

          {/* Animated terminal-style decoration */}
          <div className="mt-8 flex justify-center animate-slide-up delay-200">
            <div className="cyber-border rounded-lg bg-black/50 p-4 font-mono text-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-cyan-400">
                  root@shadowspark:~/about
                </span>
              </div>
              <div className="text-cyan-300">
                <span className="text-magenta-400">const</span> mission ={" "}
                <span className="text-yellow-300">
                  "Democratizing AI for African businesses"
                </span>
                <span className="cursor-blink"></span>
              </div>
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="futuristic-card rounded-2xl p-8 md:p-12 cyber-border animate-slide-up delay-300">
            <div className="flex items-center gap-3 text-cyan-400">
              <MapPin size={24} className="neon-glow" />
              <h2 className="text-2xl font-bold text-white">
                Port Harcourt, Nigeria
              </h2>
            </div>
            <p className="mt-4 max-w-3xl text-slate-400">
              ShadowSpark Technologies operates from the heart of Nigeria's
              Garden City. We serve clients across Lagos, Abuja, Port Harcourt,
              and the broader West African market — all remotely, all
              efficiently. Our infrastructure runs on global cloud platforms
              (Vercel, Railway, Neon) ensuring 99.9% uptime for every client.
            </p>

            {/* Decorative circuit lines */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-cyan-400/60">
                <Cpu size={16} />
                <span>Serving:</span>
              </div>
              <div className="flex gap-3">
                {["Lagos", "Abuja", "Kano", "Ibadan", "Onitsha"].map((city) => (
                  <span
                    key={city}
                    className="px-3 py-1 text-xs rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-center text-3xl font-bold text-white animate-slide-up">
            Our <span className="gradient-text">Values</span>
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {values.map((v, index) => (
              <div
                key={v.title}
                className={`futuristic-card rounded-2xl p-6 cyber-border hover:neon-glow transition-all duration-300 group animate-slide-up delay-${(index + 1) * 100}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 group-hover:neon-glow transition-all">
                  <v.icon size={24} className="text-cyan-400" />
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
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 relative z-10">
          <div className="animate-slide-up">
            <h2 className="text-center text-3xl font-bold text-white">
              The <span className="gradient-text">Team</span>
            </h2>
            <p className="mt-4 text-center text-slate-400 max-w-2xl mx-auto">
              Meet the experts behind ShadowSpark Technologies
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div
                key={member.name}
                className={`futuristic-card rounded-2xl p-8 cyber-border relative overflow-hidden animate-slide-up delay-${(index + 2) * 100}`}
              >
                {/* Holographic overlay */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-magenta-500/10 rounded-full blur-2xl" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      {member.image ? (
                        <div className="relative h-20 w-20 rounded-full overflow-hidden neon-glow">
                          <Image
                            src={member.image}
                            alt={`${member.name} - ${member.role} at ShadowSpark Technologies`}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-magenta-500 text-3xl font-bold text-white neon-glow">
                          {member.name[0]}
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {member.name}
                        </h3>
                        <p className="text-sm text-cyan-400">{member.role}</p>
                        <p className="text-xs text-magenta-400 mt-1">
                          aka {member.nickname}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-slate-400">{member.bio}</p>

                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={14} />
                    <span>{member.location}</span>
                  </div>

                  {/* Social Links */}
                  <div className="mt-6 flex gap-4">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:neon-glow transition-all duration-300"
                    >
                      <Linkedin size={18} />
                      <span className="text-sm font-medium">LinkedIn</span>
                    </a>
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-300"
                    >
                      <Github size={18} />
                      <span className="text-sm font-medium">GitHub</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Timeline */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 relative z-10">
          <div className="futuristic-card rounded-2xl p-8 md:p-12 cyber-border circuit-pattern animate-slide-up delay-500">
            <div className="flex items-center gap-3 mb-8">
              <Terminal size={28} className="text-cyan-400 neon-glow" />
              <h2 className="text-2xl font-bold text-white">
                Experience Timeline
              </h2>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-magenta-500 to-cyan-500" />

              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div
                    key={item.year}
                    className={`relative pl-12 animate-slide-up delay-${(index + 3) * 100}`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-2 top-2 w-5 h-5 rounded-full bg-cyan-500/20 border-2 border-cyan-500 neon-glow" />

                    <div className="glass-card rounded-lg p-4">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="px-3 py-1 text-xs font-mono rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                          {item.year}
                        </span>
                        <Sparkles size={14} className="text-magenta-400" />
                        <h3 className="text-lg font-semibold text-white">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-cyan-400 text-sm font-medium">
                        {item.company}
                      </p>
                      <p className="text-slate-400 text-sm mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 relative z-10">
          <div className="rounded-2xl bg-gradient-to-r from-cyan-500/10 to-magenta-500/10 p-8 text-center md:p-12 cyber-border futuristic-card animate-slide-up delay-600">
            <h2 className="text-2xl font-bold text-white">
              Ready to work with us?
            </h2>
            <p className="mt-2 text-slate-400">
              Let's discuss how AI can transform your business operations.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="cyber-button rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105"
              >
                Start Free Trial
              </Link>
              <WhatsAppLink
                href="https://wa.me/2349037621612?text=Hi%2C%20I%27d%20like%20to%20discuss%20a%20project"
                source="about_page"
                className="rounded-lg border border-emerald-500/20 px-6 py-3 text-sm font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/10"
              >
                Chat on WhatsApp
              </WhatsAppLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

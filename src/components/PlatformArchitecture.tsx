import { Monitor, Plug, Cpu, BarChart2, Shield } from "lucide-react";

const layers = [
  {
    number: "01",
    icon: Monitor,
    title: "Client Layer",
    channels: "Web · WhatsApp · REST APIs",
    description:
      "The entry point for all customer and system interactions. Requests arrive via web chat, WhatsApp Business, or direct API calls from your existing tools and are authenticated before entering the pipeline.",
  },
  {
    number: "02",
    icon: Plug,
    title: "Integration Layer",
    channels: "CRM · Payment Platforms · Third-party APIs",
    description:
      "Connects your existing business systems — CRM records, order databases, payment gateways, and spreadsheets — to the automation engine. No rip-and-replace required; we work with what you already have.",
  },
  {
    number: "03",
    icon: Cpu,
    title: "Automation Engine",
    channels: "Workflow Orchestrator · AI Model · Rules Engine",
    description:
      "The core processing layer. Classifies incoming requests, applies business rules, triggers the appropriate workflow, and coordinates responses across channels. Handles branching logic, escalation routing, and fallback paths.",
  },
  {
    number: "04",
    icon: BarChart2,
    title: "Analytics Engine",
    channels: "BI Dashboard · Reporting · Performance Alerts",
    description:
      "Captures every interaction, workflow outcome, and response metric in real time. Surfaces data through your BI dashboard — response times, resolution rates, lead conversion, and cost-per-interaction — without requiring a data team.",
  },
  {
    number: "05",
    icon: Shield,
    title: "Infrastructure Layer",
    channels: "Cloud Hosting · Encryption · Audit Logging",
    description:
      "All layers run on enterprise-grade cloud infrastructure with TLS 1.3 in transit, AES-256 at rest, per-client data isolation, and immutable audit logs. Designed for availability, not just performance.",
  },
];

export default function PlatformArchitecture() {
  return (
    <section id="architecture" className="bg-[#0a0f1a] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#d4a843]">
            Technical Overview
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Platform Architecture
          </h2>
          <p className="mt-4 text-slate-400">
            ShadowSpark is built as a layered automation platform. Each layer
            has a defined responsibility — from the channels your customers use
            to the infrastructure that keeps everything secure and measurable.
            Enterprise buyers can request a full technical specification document.
          </p>
        </div>

        {/* Layer cards */}
        <div className="mt-12 space-y-4">
          {layers.map(({ number, icon: Icon, title, channels, description }) => (
            <div
              key={number}
              className="grid grid-cols-[48px_1fr] gap-6 rounded-2xl border border-slate-800 bg-[#0d1320] px-6 py-6 sm:grid-cols-[48px_200px_1fr] sm:items-start"
            >
              {/* Layer number + icon */}
              <div className="flex flex-col items-center gap-2 pt-0.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#d4a843]/10 text-[#d4a843]">
                  <Icon size={18} />
                </div>
                <span className="text-xs font-mono text-slate-700">{number}</span>
              </div>

              {/* Title + channels */}
              <div className="sm:border-r sm:border-slate-800 sm:pr-6">
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  {channels}
                </p>
              </div>

              {/* Description */}
              <p className="col-span-2 text-sm leading-relaxed text-slate-400 sm:col-span-1 sm:pl-0">
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-8 text-xs text-slate-700">
          Architecture diagram and full technical specification available on
          request for Enterprise prospects.
        </p>
      </div>
    </section>
  );
}

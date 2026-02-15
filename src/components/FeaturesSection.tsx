import { Bot, BarChart3, Cog, MessageSquare, Users, Shield } from "lucide-react";

const features = [
  { icon: Bot, title: "AI Chatbots", description: "WhatsApp & web chatbots that understand Pidgin and Nigerian English. Handle orders, FAQs, and support 24/7." },
  { icon: BarChart3, title: "BI Dashboards", description: "Real-time analytics on leads, revenue, and customer behaviour. Make data-driven decisions with beautiful visualizations." },
  { icon: Cog, title: "RPA Workflows", description: "Automate repetitive tasks — invoice generation, follow-ups, data entry. Save hours every week." },
  { icon: MessageSquare, title: "Multi-Channel", description: "One platform for WhatsApp, Telegram, and web chat. Unified inbox, unified customer view." },
  { icon: Users, title: "Lead Management", description: "Track leads from first contact to conversion. AI-scored leads, automated follow-up sequences." },
  { icon: Shield, title: "Enterprise Security", description: "End-to-end encryption, SOC 2 practices, NDPR compliant. Your data stays in your control." },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-[#0f1521] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Everything you need to <span className="gradient-text">scale your business</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            AI-powered tools built specifically for Nigerian SMEs
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group glass-card rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-[#d4a843]/20"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4a843]/8 transition-colors group-hover:bg-[#d4a843]/15">
                <f.icon size={24} className="text-[#d4a843]" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

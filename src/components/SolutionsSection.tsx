import { FileText, PieChart, Workflow } from "lucide-react";

const solutions = [
  {
    icon: FileText,
    tag: "Templates",
    title: "Pre-Built Business Templates",
    description:
      "Launch in minutes with industry-specific templates for e-commerce, logistics, healthcare, and fintech. Each template includes chatbot scripts, lead forms, and dashboard layouts.",
    items: ["E-Commerce Support Bot", "Logistics Tracker", "Clinic Booking System", "Fintech FAQ Agent"],
    gradient: "from-[#d4a843]/8 to-transparent",
    border: "border-[#d4a843]/15",
  },
  {
    icon: PieChart,
    tag: "BI Dashboard",
    title: "Real-Time Business Intelligence",
    description:
      "See your business at a glance. Live lead counts, revenue trends, conversion funnels, and customer sentiment — all updated in real time.",
    items: ["Live Lead Counter", "Revenue Heatmaps", "Conversion Funnels", "Sentiment Analysis"],
    gradient: "from-white/[0.03] to-transparent",
    border: "border-white/8",
  },
  {
    icon: Workflow,
    tag: "RPA",
    title: "Robotic Process Automation",
    description:
      "Automate the boring stuff. Invoice generation, WhatsApp follow-ups, data sync between systems — set it up once and let it run.",
    items: ["Auto-Invoice on Payment", "Scheduled Follow-Ups", "CRM Data Sync", "Report Generation"],
    gradient: "from-[#c0935a]/8 to-transparent",
    border: "border-[#c0935a]/15",
  },
];

export default function SolutionsSection() {
  return (
    <section id="solutions" className="bg-gradient-to-b from-[#0f1521] to-[#0a0f1a] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Solutions that <span className="gradient-text">deliver results</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Proven frameworks for Nigerian businesses of every size
          </p>
        </div>

        <div className="mt-16 space-y-8">
          {solutions.map((s) => (
            <div
              key={s.tag}
              className={`glass-card overflow-hidden rounded-2xl ${s.border}`}
            >
              <div className={`grid items-center gap-8 bg-gradient-to-r ${s.gradient} p-8 md:grid-cols-2 md:p-12`}>
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                    <s.icon size={14} /> {s.tag}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{s.title}</h3>
                  <p className="mt-3 text-slate-400">{s.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {s.items.map((item) => (
                    <div
                      key={item}
                      className="rounded-lg border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-slate-300"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

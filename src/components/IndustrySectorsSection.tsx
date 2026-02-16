import Reveal from "@/components/Reveal";
import {
  Banknote,
  ShoppingCart,
  HeartPulse,
  Truck,
  Building2,
  GraduationCap,
  Briefcase,
  Factory,
  Landmark,
  Package,
} from "lucide-react";

const sectors = [
  {
    Icon: Banknote,
    name: "Fintech & Lending",
    context: "Loan intake, verification workflows, customer follow-up",
  },
  {
    Icon: ShoppingCart,
    name: "E-commerce & Retail",
    context: "Order tracking, return handling, support triage",
  },
  {
    Icon: HeartPulse,
    name: "Healthcare & Medtech",
    context: "Appointment scheduling, patient query routing",
  },
  {
    Icon: Truck,
    name: "Logistics & Courier",
    context: "Shipment status, dispatch notifications, claims",
  },
  {
    Icon: Building2,
    name: "Real Estate",
    context: "Lead qualification, viewing scheduling, follow-up sequences",
  },
  {
    Icon: GraduationCap,
    name: "Education & EdTech",
    context: "Admissions enquiries, payment reminders, student support",
  },
  {
    Icon: Briefcase,
    name: "Professional Services",
    context: "Client intake, document collection, project updates",
  },
  {
    Icon: Factory,
    name: "Manufacturing",
    context: "Procurement queries, order confirmation, supplier comms",
  },
  {
    Icon: Landmark,
    name: "Banking & Finance",
    context: "Account enquiries, onboarding verification, compliance flows",
  },
  {
    Icon: Package,
    name: "FMCG & Distribution",
    context: "Distributor comms, stock queries, invoice follow-up",
  },
];

export default function IndustrySectorsSection() {
  return (
    <section id="sectors" className="bg-[#080d18] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <Reveal className="max-w-2xl">
          <p className="section-accent text-xs font-semibold uppercase tracking-widest text-[#d4a843]">
            Sector Coverage
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Trusted By Forward-Thinking Teams
          </h2>
          <p className="mt-4 text-slate-400">
            ShadowSpark is deployed across operations-heavy sectors where
            customer interaction volume exceeds manual handling capacity. The
            platform is sector-agnostic; the automation logic is configured to
            match the specific workflows and data structures of each
            deployment.
          </p>
        </Reveal>

        {/* Sector grid */}
        <Reveal stagger className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {sectors.map(({ Icon, name, context }) => (
            <div
              key={name}
              className="card-lift group rounded-xl border border-slate-800 bg-[#0d1320] px-5 py-5 hover:border-slate-700"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#d4a843]/10 text-[#d4a843] transition-colors duration-200 group-hover:bg-[#d4a843]/18">
                  <Icon size={16} />
                </div>
                <p className="text-sm font-semibold text-slate-200">{name}</p>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                {context}
              </p>
            </div>
          ))}
        </Reveal>

        {/* Qualifier */}
        <Reveal className="mt-8">
          <p className="text-xs text-slate-700">
            Sector applicability is determined during the baseline audit.
            Deployments where interaction volume does not justify automation
            are declined — we prefer to decline a poor fit than oversell a
            marginal one.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

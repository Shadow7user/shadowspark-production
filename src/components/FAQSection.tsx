"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    category: "Cost",
    items: [
      {
        q: "What does ShadowSpark actually cost?",
        a: "Pricing starts at ₦25,000/month for the Starter plan (up to 500 automated interactions). The Growth plan is ₦50,000/month (up to 2,000 interactions). Enterprise is custom-priced based on interaction volume, integration complexity, and deployment configuration. All plans are month-to-month — there are no annual lock-in requirements on Starter and Growth. Full pricing is on the Pricing page.",
      },
      {
        q: "Are there setup fees or hidden costs?",
        a: "No setup fee on Starter or Growth. The implementation on those plans involves configuring your workflow templates, connecting your existing systems, and configuring your WhatsApp or web chat channel — all covered within the plan. Enterprise deployments involving custom integrations or on-premise deployment are scoped separately, with costs disclosed in full before contract signing. There are no per-seat fees, no usage surcharges within the included interaction allocation, and no charges for support on Growth and Enterprise.",
      },
      {
        q: "What happens if I exceed my monthly interaction limit?",
        a: "Interactions above your plan allocation are billed at a per-interaction overage rate disclosed on the Pricing page. You are notified when you reach 80% of your monthly allocation. You can upgrade your plan at any point in the billing cycle — the price difference is prorated.",
      },
      {
        q: "Can I cancel at any time?",
        a: "Yes. Starter and Growth plans are month-to-month with no cancellation penalty. You can cancel before the next billing cycle from your account dashboard. Upon cancellation, you retain access until the end of the paid period. Your data remains available for export for 90 days post-cancellation, after which it is permanently deleted per our data retention policy.",
      },
    ],
  },
  {
    category: "Security",
    items: [
      {
        q: "Where is my business data stored?",
        a: "Your data is stored in a Neon-managed PostgreSQL database on AWS infrastructure in the EU Frankfurt (eu-central-1) region. Each client's data is logically isolated using PostgreSQL row-level security — one client cannot access another's data regardless of application-layer behaviour. All data is encrypted at rest using AES-256 and in transit using TLS 1.3.",
      },
      {
        q: "Does ShadowSpark use my customer data to train AI models?",
        a: "No. Customer interaction data processed through the platform is not used for AI model training. The AI inference layer uses OpenAI's API. Under our agreement with OpenAI for API access, data submitted via the API is not used to train OpenAI's models. We do not share your customer data with any third party for purposes outside the direct delivery of the service.",
      },
      {
        q: "Is ShadowSpark compliant with the NDPR?",
        a: "We operate in an NDPR-aware manner and implement technical controls consistent with the regulation's requirements — data minimisation, purpose limitation, encryption, access control, audit logging, and breach notification procedures. We do not currently hold formal NDPR certification from a third-party auditor. As the data controller, you are responsible for establishing lawful basis for processing. We provide data processing addendums (DPAs) to Enterprise clients. See the Security page for the full NDPR awareness statement.",
      },
      {
        q: "What happens if there is a security incident?",
        a: "We maintain a documented incident response framework with four severity levels and defined notification timelines. Affected clients are notified within 72 hours of a Critical or High severity incident being confirmed — consistent with NDPR notification requirements. A summary of the incident, affected data categories, and remediation actions is provided. The full framework is documented on the Security page.",
      },
    ],
  },
  {
    category: "Return on Investment",
    items: [
      {
        q: "How do you measure ROI for automation?",
        a: "We start with a baseline audit before any deployment. We document the current time your team spends on the tasks you want to automate, the current response times your customers experience, and the volume of interactions your team handles manually. After deployment, the platform tracks the same metrics automatically. Your BI dashboard shows the before/after comparison — time saved per day, automated resolution rate, response latency, and interactions handled without staff involvement.",
      },
      {
        q: "How long before I see measurable results?",
        a: "For standard deployments (WhatsApp automation, FAQ resolution, order status queries), clients typically see measurable reduction in manual handling volume within the first two weeks of go-live. The baseline audit we conduct before deployment gives you projected numbers specific to your workflow — not industry averages — so you have a defined target to measure against.",
      },
      {
        q: "What if the automation does not deliver the projected results?",
        a: "The baseline audit establishes agreed performance targets before any commitment. If those targets are not met within 60 days of go-live, we conduct a structured review, identify the gap, and implement corrective configuration changes at no additional cost. Month-to-month billing means you are not locked in if performance does not meet expectations.",
      },
    ],
  },
  {
    category: "Implementation",
    items: [
      {
        q: "How long does implementation take?",
        a: "Starter and Growth deployments follow a three-phase process: discovery call (30 minutes), baseline audit and solution scoping (3–5 business days), and configuration and go-live (5–10 business days depending on integration complexity). Most clients are live within 2–3 weeks of the initial call. Enterprise deployments involving custom integrations or on-premise infrastructure are scoped individually — typical lead time is 4–8 weeks.",
      },
      {
        q: "Does my team need to write any code?",
        a: "No. Workflow configuration, business rules, and channel setup are all done through the ShadowSpark configuration interface. Connecting to your existing systems (CRM, order database, payment gateway) requires API credentials from your existing provider — not custom development work on your end. If your current systems do not have APIs, we support spreadsheet-based connectors as an integration path.",
      },
      {
        q: "What do we need to have in place before starting?",
        a: "A WhatsApp Business account (or a web property where we can embed the chat widget), API credentials for any existing systems you want to connect, and a list of the top 10–20 customer queries or workflow scenarios you want to automate. Everything else is handled during the baseline audit and configuration phase.",
      },
      {
        q: "What ongoing support is included?",
        a: "All plans include email and WhatsApp support for configuration questions and issue resolution. Growth and Enterprise plans include a dedicated account contact and scheduled review calls. Enterprise plans include SLA-backed response times and access to audit exports on demand. Workflow updates and rule changes can be submitted as support requests — we implement them, you do not need technical staff to manage the platform post-deployment.",
      },
    ],
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="bg-[#0a0f1a] py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#d4a843]">
            Common Questions
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-slate-400">
            Direct answers to the questions we hear most often — on cost,
            security, ROI, and implementation. If your question is not here,
            ask us directly.
          </p>
        </div>

        {/* FAQ groups */}
        <div className="mt-14 space-y-10">
          {faqs.map(({ category, items }) => (
            <div key={category}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {category}
              </p>
              <div className="space-y-px overflow-hidden rounded-2xl border border-slate-800">
                {items.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 flex flex-col items-start gap-4 rounded-2xl border border-slate-800 bg-[#0d1320] p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Still have questions?</p>
            <p className="mt-1 text-sm text-slate-500">
              We answer questions on the same business day — no sales call required.
            </p>
          </div>
          <Link
            href="/demo"
            className="shrink-0 rounded-xl bg-gradient-to-r from-[#d4a843] to-[#c0935a] px-6 py-3 text-sm font-semibold text-slate-900 transition-all hover:from-[#e8c56d] hover:to-[#d4a843]"
          >
            Request a Demo
          </Link>
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#0d1320]">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-sm font-medium text-slate-200">{q}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="border-t border-slate-800/60 px-6 pb-6 pt-4">
          <p className="text-sm leading-relaxed text-slate-400">{a}</p>
        </div>
      )}
    </div>
  );
}

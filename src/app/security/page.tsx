import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Server, Lock, Users, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Security & Data Protection",
  description:
    "How ShadowSpark Technologies protects your business data: encryption, NDPR awareness, access controls, audit logging, and hosting infrastructure.",
  openGraph: {
    title: "Security & Data Protection | ShadowSpark",
    description:
      "TLS 1.3 in transit, AES-256 at rest, NDPR-aware data handling, role-based access control, and immutable audit logging — how ShadowSpark protects your business.",
    url: "https://shadowspark-tech.org/security",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Security & Data Protection | ShadowSpark",
    description:
      "TLS 1.3, AES-256, NDPR awareness, RBAC, and audit logging. How ShadowSpark protects your data.",
  },
};

const sections = [
  {
    icon: Lock,
    id: "encryption",
    title: "Data Encryption",
    content: [
      {
        heading: "In Transit",
        body: "All data transmitted between your systems, your customers, and ShadowSpark infrastructure is encrypted using TLS 1.3. This applies to API calls, webhook deliveries, dashboard traffic, and WhatsApp message routing.",
      },
      {
        heading: "At Rest",
        body: "Data stored in our databases and object storage is encrypted using AES-256. Encryption keys are managed separately from the data they protect and are rotated on a scheduled basis.",
      },
      {
        heading: "Backups",
        body: "Automated database backups are encrypted using the same AES-256 standard. Backups are retained for 30 days and stored in a separate availability zone from primary data.",
      },
    ],
  },
  {
    icon: Server,
    id: "hosting",
    title: "Hosting & Infrastructure",
    content: [
      {
        heading: "Cloud Provider",
        body: "ShadowSpark services are hosted on Vercel (application layer) and Neon (database layer), both of which operate on AWS infrastructure in the EU (Frankfurt) and US East regions. Enterprise clients may request dedicated deployment configurations.",
      },
      {
        heading: "Availability",
        body: "Application infrastructure is deployed with automatic failover and horizontal scaling. Our architecture avoids single points of failure at the application layer. Database infrastructure uses connection pooling and read replicas for high availability.",
      },
      {
        heading: "On-Premise Option",
        body: "Enterprise plan clients can request an on-premise or private-cloud deployment. This places all processing and storage within your own controlled environment. Contact sales for architecture details.",
      },
    ],
  },
  {
    icon: ShieldCheck,
    id: "ndpr",
    title: "NDPR Awareness",
    content: [
      {
        heading: "What NDPR Means for Your Business",
        body: "Nigeria's National Data Protection Regulation (NDPR), issued by NITDA in 2019, requires organisations processing personal data of Nigerian residents to implement appropriate technical and organisational safeguards and to have a lawful basis for processing.",
      },
      {
        heading: "How We Support Compliance",
        body: "ShadowSpark does not process personal data beyond what is operationally necessary. Data collected through AI chatbots (names, phone numbers, query content) is retained only for the period required to deliver the service and is not sold or shared with third parties. We provide data processing addendums (DPAs) on request for Enterprise clients.",
      },
      {
        heading: "Your Responsibilities",
        body: "As the data controller, you are responsible for informing your customers that their interactions may be processed by an AI system and for obtaining necessary consents. We can provide standard disclosure language upon request.",
      },
    ],
  },
  {
    icon: Users,
    id: "access-control",
    title: "Access Control Policy",
    content: [
      {
        heading: "Role-Based Access",
        body: "Access to customer data, system configuration, and administrative functions is restricted by role. Staff members receive only the minimum permissions required for their function. Access rights are reviewed quarterly and revoked immediately upon role change or departure.",
      },
      {
        heading: "Authentication",
        body: "All internal system access requires multi-factor authentication (MFA). Dashboard and API access uses token-based authentication with expiry and scope restrictions. No password-only access is permitted to production systems.",
      },
      {
        heading: "Client Data Isolation",
        body: "Each client's data is logically isolated at the database level using row-level security. One client cannot access another client's data. This applies to message history, workflow configurations, analytics, and contact records.",
      },
    ],
  },
  {
    icon: FileText,
    id: "audit-logging",
    title: "Audit Logging",
    content: [
      {
        heading: "What We Log",
        body: "All authentication events, API requests, data access operations, configuration changes, and administrative actions are logged with a timestamp, actor identity, source IP, and action description. Logs are immutable once written.",
      },
      {
        heading: "Retention",
        body: "Audit logs are retained for a minimum of 90 days in hot storage and 12 months in cold storage. Enterprise clients can configure extended retention periods or log export to their own SIEM systems.",
      },
      {
        heading: "Access to Logs",
        body: "Clients on the Growth and Enterprise plans can request an audit trail export for their own account activity at any time. Exports are delivered as signed, tamper-evident JSON files.",
      },
    ],
  },
];

export default function SecurityPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0f1a] pt-24">
        {/* Page header */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d4a843]/20 bg-[#d4a843]/5 px-4 py-1.5 text-sm text-[#d4a843]">
            <ShieldCheck size={14} /> Security & Data Protection
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            How We Protect{" "}
            <span className="gradient-text">Your Data</span>
          </h1>
          <p className="mt-6 text-lg text-slate-400">
            This page describes the technical and organisational measures
            ShadowSpark Technologies applies to protect client and end-user
            data. If you have specific security questions or require
            documentation for a procurement review, contact us directly.
          </p>
        </section>

        {/* Table of contents */}
        <section className="mx-auto max-w-3xl px-4 pb-10 sm:px-6 lg:px-8">
          <nav aria-label="Page sections" className="glass-card rounded-xl p-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              On this page
            </p>
            <ol className="space-y-1.5 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-slate-400 transition-colors hover:text-[#d4a843]"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </section>

        {/* Content sections */}
        <div className="mx-auto max-w-3xl space-y-16 px-4 pb-24 sm:px-6 lg:px-8">
          {sections.map(({ icon: Icon, id, title, content }) => (
            <section key={id} id={id} className="scroll-mt-24">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d4a843]/10 text-[#d4a843]">
                  <Icon size={18} />
                </div>
                <h2 className="text-xl font-semibold text-white">{title}</h2>
              </div>
              <div className="mt-8 space-y-6">
                {content.map((item) => (
                  <div key={item.heading}>
                    <h3 className="text-sm font-semibold text-slate-300">
                      {item.heading}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Contact row */}
          <section className="rounded-2xl border border-[#d4a843]/20 bg-[#d4a843]/5 p-8">
            <h2 className="text-base font-semibold text-white">
              Security Questions or Disclosure Reports
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              If you have identified a potential security vulnerability or have
              compliance documentation requirements, please contact us via
              WhatsApp or email. We respond to security reports within one
              business day.
            </p>
            <a
              href="https://wa.me/2349037621612?text=Hi%2C%20I%20have%20a%20security%20question"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Contact Security Team
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

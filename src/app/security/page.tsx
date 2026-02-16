import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  ShieldCheck,
  Server,
  Lock,
  Users,
  FileText,
  Trash2,
  AlertTriangle,
  Activity,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Security & Data Protection",
  description:
    "How ShadowSpark Technologies protects your business data: encryption standards, RBAC, audit logging, data retention policy, incident response, and NDPR awareness.",
  alternates: {
    canonical: "https://shadowspark-tech.org/security",
  },
  openGraph: {
    title: "Security & Data Protection | ShadowSpark",
    description:
      "TLS 1.3 in transit, AES-256 at rest, NDPR-aware data handling, role-based access control, immutable audit logging, and a documented incident response framework.",
    url: "https://shadowspark-tech.org/security",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Security & Data Protection | ShadowSpark",
    description:
      "TLS 1.3, AES-256, NDPR awareness, RBAC, audit logging, data retention policy, and incident response framework.",
  },
};

/* ── Section data ───────────────────────────────────────── */

const sections = [
  {
    icon: Lock,
    id: "encryption",
    title: "Encryption Standards",
    content: [
      {
        heading: "Data in Transit — TLS 1.3",
        body: "All data transmitted between client systems, end users, and ShadowSpark infrastructure is encrypted using TLS 1.3. This applies to API calls, webhook deliveries, dashboard traffic, and WhatsApp message routing. TLS 1.2 is the minimum accepted version on all endpoints; older protocol versions are rejected at the connection negotiation stage. Cipher suites are restricted to those offering forward secrecy (ECDHE-based key exchange).",
      },
      {
        heading: "Data at Rest — AES-256",
        body: "All data stored in primary databases, backup stores, and object storage is encrypted using AES-256. Encryption is applied at the storage layer by the cloud provider (Neon for PostgreSQL, Vercel for function artifacts) and is independent of application-level access controls. Encryption keys are managed separately from the data they protect and are not accessible at the application tier.",
      },
      {
        heading: "Key Management",
        body: "Encryption keys for database storage are managed by Neon's key management infrastructure, which operates on AWS KMS. Keys are rotated on a scheduled basis according to the provider's standard rotation policy. Enterprise clients requiring customer-managed encryption keys (CMEK) or bring-your-own-key (BYOK) arrangements can request a dedicated deployment configuration.",
      },
      {
        heading: "Backup Encryption",
        body: "Automated database backups are encrypted using the same AES-256 standard applied to primary data. Backups are retained for 30 days and stored in a separate availability zone from primary storage. Backup restoration procedures are tested quarterly.",
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
        body: "ShadowSpark application services are hosted on Vercel (application and API function layer) and Neon (PostgreSQL database layer). Both platforms operate on AWS infrastructure. The primary database region is EU (Frankfurt, eu-central-1). Static assets and edge function deployments use Vercel's global CDN. Enterprise clients may request deployment to a specific region or a dedicated infrastructure configuration.",
      },
      {
        heading: "Availability Architecture",
        body: "Application functions are deployed to Vercel's serverless edge network with automatic failover and horizontal scaling. The database tier uses Neon's multi-region replication with automatic promotion of a read replica in the event of primary failure. A Redis-backed job queue (Upstash) ensures that in-flight workflow jobs survive application restarts without data loss.",
      },
      {
        heading: "Network Isolation",
        body: "Each client's data is logically isolated at the database layer using PostgreSQL row-level security (RLS) policies. Application-layer filtering is applied as a secondary control, but the database enforces tenant boundaries independently of application code correctness. There is no shared database user between tenants.",
      },
      {
        heading: "On-Premise & Private Cloud",
        body: "Enterprise plan clients can request an on-premise or private-cloud deployment where all processing and storage runs within their own controlled environment. This configuration places no client data on ShadowSpark-managed infrastructure. Contact the sales team for architecture requirements and lead time.",
      },
    ],
  },
  {
    icon: Users,
    id: "access-control",
    title: "Role-Based Access Control",
    content: [
      {
        heading: "Permission Model",
        body: "Access to client data, system configuration, analytics, and administrative functions is governed by a role-based access control (RBAC) model. Roles are defined at the platform level (Super Admin, Account Admin, Operator, Read-Only Analyst) and are configurable per client deployment. Each role carries an explicit permission set — no implicit inheritance. Permissions are additive, not subtractive: a user's effective permissions are exactly the union of the permissions assigned to their roles.",
      },
      {
        heading: "Authentication Requirements",
        body: "All platform access requires authenticated sessions using token-based authentication with configurable expiry (default: 8-hour session, 30-day refresh). All internal system-to-system calls use scoped service tokens with restricted permission sets. Password-only authentication is not permitted on production systems. Multi-factor authentication (MFA) is required for Account Admin and Super Admin roles.",
      },
      {
        heading: "Principle of Least Privilege",
        body: "Staff members receive only the minimum permissions required for their assigned function. Access rights are reviewed quarterly. Upon role change or departure, access is revoked within one business day via automated off-boarding procedures tied to the identity provider.",
      },
      {
        heading: "API Access Control",
        body: "Client API keys are scoped to a defined set of operations at the time of creation. A key issued for reading analytics data cannot be used to trigger workflow actions or access configuration settings. All API keys are rotatable on demand via the dashboard without service interruption. Key creation and rotation events are written to the immutable audit log.",
      },
    ],
  },
  {
    icon: Activity,
    id: "logging-monitoring",
    title: "Logging & Monitoring",
    content: [
      {
        heading: "Structured Application Logging",
        body: "All application events are logged in structured JSON format. Each log entry includes: timestamp (ISO 8601, UTC), request ID (correlation ID propagated across service boundaries), tenant ID, user or service actor, HTTP method and path, response status code, latency in milliseconds, and environment tag. Logs are immutable once written and are retained for 90 days in hot storage.",
      },
      {
        heading: "Audit Trail",
        body: "A separate audit log table records every authentication event, data access operation, configuration change, workflow state transition, and administrative action. Audit entries are written to an append-only table — the application database user has INSERT and SELECT permissions only; UPDATE and DELETE are not granted. This ensures audit records cannot be modified or deleted through application-layer operations.",
      },
      {
        heading: "Real-Time Error Monitoring",
        body: "Exception tracking is in place across all application tiers. Unhandled errors are captured with full stack traces, release tags, and environment context. Alerts are routed to the on-call engineering team with a target acknowledgement time of 15 minutes for critical severity issues. Error rates and latency percentiles are monitored continuously against defined thresholds.",
      },
      {
        heading: "Infrastructure Monitoring",
        body: "Database query performance, connection pool utilisation, queue depth, and function execution duration are monitored with automated alerting on threshold breaches. Anomalous patterns — such as a sudden increase in failed authentication attempts or an unusual spike in API call volume from a single tenant — trigger automated investigation workflows. Uptime is monitored from multiple geographic locations with a target SLA of 99.9% monthly availability.",
      },
      {
        heading: "Client Visibility",
        body: "Clients on Growth and Enterprise plans can request an export of their account's audit trail at any time. Exports are delivered as signed, tamper-evident JSON files. Enterprise clients can also configure log streaming to their own SIEM or log aggregation system.",
      },
    ],
  },
  {
    icon: FileText,
    id: "data-retention",
    title: "Data Retention & Deletion Policy",
    content: [
      {
        heading: "Active Data Retention",
        body: "Operational data — including message logs, workflow execution records, analytics events, and client configuration — is retained for the duration of the active client relationship plus a 90-day post-termination window. During this window, clients may request a full data export. After the 90-day window, all client data is permanently deleted from primary storage, backup storage, and any derived analytics tables.",
      },
      {
        heading: "Hot and Cold Storage Tiers",
        body: "Raw event data and interaction logs are retained in hot storage (queryable database) for 90 days. Summarised analytics aggregates — which contain no personally identifiable information — are retained in cold storage for up to 12 months to support performance reporting. Raw event data older than 90 days is either deleted or, with explicit client consent, archived to cold storage at reduced granularity.",
      },
      {
        heading: "Personal Data Handling",
        body: "Personal data collected through AI chatbot interactions (names, phone numbers, message content) is retained only for the minimum period necessary to deliver the service and resolve disputes. No personal data is used for model training without explicit, documented consent from the data controller. Personal data is not sold, licensed, or transferred to third parties outside the defined subprocessor chain.",
      },
      {
        heading: "Right to Erasure",
        body: "Enterprise clients can submit a verified erasure request for specific data subjects. Upon verification, personally identifiable data associated with the identified subject is deleted from primary storage within 30 days. Immutable audit log entries referencing that subject are anonymised (actor identity replaced with a hashed identifier) rather than deleted, to preserve audit trail integrity. Clients receive written confirmation of deletion completion.",
      },
      {
        heading: "Subprocessor Data Handling",
        body: "ShadowSpark uses a defined set of subprocessors (Vercel, Neon, Upstash, OpenAI, Twilio) to deliver the service. Each subprocessor operates under data processing terms consistent with the commitments in this policy. A current subprocessor list is available to Enterprise clients on request. Clients are notified of subprocessor changes with a minimum of 30 days' notice.",
      },
    ],
  },
  {
    icon: AlertTriangle,
    id: "incident-response",
    title: "Incident Response Framework",
    content: [
      {
        heading: "Incident Classification",
        body: "Security incidents are classified on a four-level severity scale: Critical (active data breach or system compromise with confirmed client impact), High (confirmed vulnerability or unauthorised access without confirmed data exfiltration), Medium (anomalous activity requiring investigation with no confirmed breach), Low (policy violation or misconfiguration with no external impact). Classification determines response timelines and escalation paths.",
      },
      {
        heading: "Detection & Triage",
        body: "Incidents are detected through automated monitoring alerts, manual reports from clients or staff, or third-party vulnerability disclosures. All potential incidents are triaged within 1 hour of detection, 24 hours a day. Triage produces a preliminary classification, an initial scope assessment, and an assigned incident owner responsible for driving resolution.",
      },
      {
        heading: "Containment & Eradication",
        body: "Containment actions for Critical and High severity incidents begin immediately upon classification. Depending on the nature of the incident, containment may include: revoking affected credentials, isolating affected tenant data, disabling compromised API endpoints, or suspending specific workflow execution paths. Containment actions are logged in the incident record with timestamps and actor identity.",
      },
      {
        heading: "Client Notification",
        body: "Clients affected by a Critical or High severity incident will be notified within 72 hours of the incident being classified, consistent with NDPR notification requirements. Notification includes: a description of the incident, the categories of data affected, the actions taken to contain the incident, and the actions clients should take. Medium and Low severity incidents are communicated via the platform status page and monthly security summary.",
      },
      {
        heading: "Post-Incident Review",
        body: "All Critical and High severity incidents undergo a written post-incident review within 14 days of resolution. The review documents: root cause, timeline, impact scope, containment and eradication actions, and preventive measures implemented to reduce recurrence probability. Summaries of completed reviews are available to Enterprise clients on request.",
      },
      {
        heading: "Reporting a Vulnerability",
        body: "If you have identified a potential security vulnerability in the ShadowSpark platform, contact the security team directly via WhatsApp or email before any public disclosure. We commit to acknowledging all reports within one business day, providing a status update within 7 days, and crediting reporters (with consent) in post-incident documentation.",
      },
    ],
  },
  {
    icon: ShieldCheck,
    id: "ndpr",
    title: "NDPR Awareness Statement",
    content: [
      {
        heading: "Regulatory Context",
        body: "Nigeria's National Data Protection Regulation (NDPR), issued by the National Information Technology Development Agency (NITDA) in 2019, establishes requirements for organisations processing personal data of Nigerian residents. It mandates lawful basis for processing, appropriate technical and organisational safeguards, data subject rights (access, correction, erasure), and notification requirements in the event of a data breach. The NDPR is supplemented by the Nigeria Data Protection Act (NDPA) 2023, which established the Nigeria Data Protection Commission (NDPC) as the supervisory authority.",
      },
      {
        heading: "ShadowSpark's Position",
        body: "ShadowSpark Technologies processes personal data as a data processor on behalf of its clients, who are data controllers. We do not determine the purpose or means of processing beyond what is operationally necessary to deliver the contracted service. We maintain data processing addendums (DPAs) for Enterprise clients that document our processing activities, data categories, retention periods, and subprocessor chain in terms compatible with NDPR requirements.",
      },
      {
        heading: "Technical Safeguards in Place",
        body: "The platform implements technical measures relevant to NDPR compliance: data minimisation (only data necessary for the service is collected and processed), purpose limitation (data collected for one workflow is not repurposed for another without controller instruction), storage limitation (personal data is deleted at end of retention period), and integrity and confidentiality (encryption, access control, and audit logging as described in this document).",
      },
      {
        heading: "Client Responsibilities",
        body: "As the data controller, the client is responsible for: establishing a lawful basis for processing end-user personal data through the ShadowSpark platform; providing adequate privacy notices to end users informing them that their interactions may be processed by an AI system; obtaining any required consents; and managing data subject rights requests. ShadowSpark can provide standard disclosure language and data subject rights request templates upon request.",
      },
      {
        heading: "No Formal Certification",
        body: "ShadowSpark Technologies does not currently hold formal NDPR certification or any third-party compliance audit certification. We operate in an NDPR-aware manner and implement controls consistent with the regulation's requirements. Enterprise clients requiring formal third-party audit documentation should contact the sales team to discuss available options, including the provision of infrastructure specification documents for their own compliance review.",
      },
    ],
  },
];

/* ── Page ───────────────────────────────────────────────── */

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
            How We Protect Your Data
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-400">
            This document describes the technical and organisational security
            measures ShadowSpark Technologies applies to protect client and
            end-user data. It covers encryption standards, access controls,
            logging, data retention, incident response, and our position
            relative to the NDPR.
          </p>
          <p className="mt-3 text-sm text-slate-600">
            For procurement reviews or security questionnaires, contact us
            directly. A full infrastructure specification document is available
            to Enterprise prospects on request.
          </p>
        </section>

        {/* Table of contents */}
        <section className="mx-auto max-w-3xl px-4 pb-10 sm:px-6 lg:px-8">
          <nav aria-label="Page sections" className="rounded-2xl border border-slate-800 bg-[#0d1320] p-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              On this page
            </p>
            <ol className="grid gap-1.5 sm:grid-cols-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-[#d4a843]"
                  >
                    <s.icon size={13} className="shrink-0 text-slate-600" />
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </section>

        {/* Content sections */}
        <div className="mx-auto max-w-3xl space-y-0 px-4 sm:px-6 lg:px-8">
          {sections.map(({ icon: Icon, id, title, content }, i) => (
            <section
              key={id}
              id={id}
              className={`scroll-mt-24 border-t border-slate-800 py-14 ${
                i === 0 ? "border-t-0" : ""
              }`}
            >
              <div className="flex items-center gap-3 pb-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d4a843]/10 text-[#d4a843]">
                  <Icon size={18} />
                </div>
                <h2 className="text-xl font-semibold text-white">{title}</h2>
              </div>
              <div className="space-y-7">
                {content.map((item) => (
                  <div key={item.heading}>
                    <h3 className="text-sm font-semibold text-slate-200">
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
        </div>

        {/* CTA row */}
        <section className="border-t border-slate-800 bg-[#080d18]">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-[#d4a843]/20 bg-[#d4a843]/5 p-8">
              <h2 className="text-base font-semibold text-white">
                Security Questions or Vulnerability Disclosures
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                If you have identified a potential security vulnerability or
                have compliance documentation requirements for a procurement
                review, contact the security team directly. We respond to
                security reports within one business day.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/2349037621612?text=Hi%2C%20I%20have%20a%20security%20question"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  Contact Security Team
                </a>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:border-[#d4a843]/40 hover:text-[#d4a843]"
                >
                  Request a Demo <ArrowRight size={14} />
                </Link>
              </div>
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-1.5">
                {["No long-term contracts.", "Transparent pricing.", "Security-first deployment."].map((t) => (
                  <li key={t} className="text-xs text-slate-600">✓ {t}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

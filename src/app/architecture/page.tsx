import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Monitor,
  Plug,
  Cpu,
  BarChart2,
  Shield,
  ArrowRight,
  Layers,
  Workflow,
  GitBranch,
  Database,
  Lock,
  Activity,
  Server,
  Zap,
  RefreshCw,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Platform Architecture",
  description:
    "Technical architecture of the ShadowSpark automation platform. Five-layer design covering client interfaces, API integration, workflow orchestration, analytics, and infrastructure.",
  alternates: {
    canonical: "https://shadowspark-tech.org/architecture",
  },
  openGraph: {
    title: "Platform Architecture | ShadowSpark",
    description:
      "Five-layer technical architecture: client interfaces, API & integration, automation engine, analytics, and infrastructure. Built for horizontal scale and observability.",
    url: "https://shadowspark-tech.org/architecture",
    type: "website",
  },
};

/* ── Layer data ─────────────────────────────────────────── */

const layers = [
  {
    number: "01",
    id: "client-layer",
    Icon: Monitor,
    title: "Client Layer",
    subtitle: "Web · WhatsApp Business API · REST",
    tagline: "All inbound interaction surface areas.",
    technical: {
      heading: "Technical Explanation",
      body: `The Client Layer is the set of protocol adapters that accept inbound communication from external parties. It currently supports three channels:

Web Chat — A JavaScript widget embedded on client web properties. Communicates with the platform backend over HTTPS using a long-poll or WebSocket transport, depending on browser support. Session state is maintained server-side, keyed by a browser-stored UUID.

WhatsApp Business API — Inbound messages are received via Twilio's WhatsApp gateway as HTTP POST webhooks. Each webhook payload is verified using HMAC-SHA256 signature validation before the message body is parsed. Outbound messages are dispatched via the same gateway, with delivery status tracked via Twilio status callbacks.

REST API — Clients and third-party systems can push structured events or trigger workflows programmatically using authenticated HTTP requests. All endpoints require Bearer token authentication. Rate limits are enforced per-client at 300 requests per minute by default.

All three channels converge on a unified Message Normalisation Service that converts channel-specific payload formats into a standard internal event schema before forwarding to the Automation Engine.`,
    },
    role: {
      heading: "Role in System",
      body: "The Client Layer is the exclusive ingress point for all external traffic. Nothing enters the Automation Engine without passing through this layer's authentication and normalisation pipeline. It is responsible for: validating request authenticity, attaching client context (tenant ID, channel type, session metadata), rejecting malformed or oversized payloads, and emitting a normalised event onto the internal processing queue.",
    },
    scalability: {
      heading: "Scalability Notes",
      points: [
        "WhatsApp webhook handlers are stateless serverless functions — they scale horizontally under load with no coordination overhead.",
        "Web socket connections are managed by a dedicated connection manager service, not the application tier, to isolate connection state from processing logic.",
        "Rate limiting is enforced at the edge (Vercel middleware) before traffic reaches function compute, preventing load amplification from high-volume senders.",
        "Additional channels (SMS, email inbound, Telegram) can be integrated as new protocol adapters without modifying downstream layers.",
      ],
    },
  },
  {
    number: "02",
    id: "integration-layer",
    Icon: Plug,
    title: "API & Integration Layer",
    subtitle: "CRM · Payment Platforms · Order Systems · Spreadsheets",
    tagline: "Bidirectional connectors to existing business data.",
    technical: {
      heading: "Technical Explanation",
      body: `The Integration Layer provides bidirectional connectivity between the ShadowSpark platform and the client's existing business systems. It operates on a connector model: each external system has a typed connector that handles authentication, request formatting, response parsing, and error normalisation.

Current connector types include:

CRM Connectors — Read and write customer records, deal stages, and activity logs. Connectors are implemented for REST-based CRMs using OAuth 2.0 or API key authentication. Data is fetched on-demand and cached with configurable TTLs to avoid excessive API calls.

Order Management Connectors — Query order status, fulfilment state, and delivery tracking from e-commerce backends. Responses are mapped to a normalised order schema consumed by the Automation Engine.

Payment Gateway Connectors — Receive payment confirmation events via webhooks and query transaction status. Used to trigger post-payment workflows such as onboarding sequences or receipt dispatch.

Spreadsheet Connectors — For clients without structured APIs, the platform can read from and write to Google Sheets or Excel Online via their respective APIs. This provides a low-barrier integration path for smaller deployments.

Custom REST Connectors — Arbitrary REST endpoints can be configured per-client through the admin dashboard without code changes.`,
    },
    role: {
      heading: "Role in System",
      body: "The Integration Layer exists to decouple the Automation Engine from the details of external system protocols. Workflow logic references named data sources (e.g. 'order_status', 'customer_record') rather than raw API calls. The Integration Layer resolves those references at runtime, handles authentication token refresh, retries on transient failures (with exponential backoff up to 3 attempts), and surfaces structured errors that the Automation Engine can route against. It also prevents credential leakage: API keys and OAuth tokens for external systems are stored in an isolated secrets store and are never exposed to workflow configuration.",
    },
    scalability: {
      heading: "Scalability Notes",
      points: [
        "Connector calls are executed asynchronously. The Automation Engine enqueues integration tasks and resumes workflow execution on callback, preventing thread blocking under concurrent workflow load.",
        "Response caching with per-connector TTL configuration reduces round-trips to external systems and provides tolerance against third-party API downtime.",
        "Connector configuration is per-tenant and stored in the database. Adding a new client with different integrations requires no deployment — only configuration changes.",
        "External API rate limits are tracked per-connector. The Integration Layer applies its own request queuing to stay within third-party limits without surfacing errors to the workflow layer.",
      ],
    },
  },
  {
    number: "03",
    id: "automation-engine",
    Icon: Cpu,
    title: "Automation Engine",
    subtitle: "Workflow Orchestrator · AI Inference · Rules Engine",
    tagline: "The core processing layer. All business logic lives here.",
    technical: {
      heading: "Technical Explanation",
      body: `The Automation Engine is the platform's central processing component. It receives normalised events from the Client Layer, resolves business rules, coordinates AI inference, and dispatches actions — including Integration Layer calls, outbound messages, and state updates.

It is composed of three sub-systems:

Workflow Orchestrator — A purpose-built, persistent state machine that executes multi-step workflows. Each workflow is defined as a directed acyclic graph (DAG) of steps, with conditional branch points, timer-based delays, and escalation nodes. State is persisted to the database at each step boundary, making workflows resumable after a process restart or infrastructure failure. The orchestrator uses a worker-queue pattern: a BullMQ queue backed by Redis, consumed by Node.js worker processes.

AI Inference Layer — Natural language classification and intent resolution using a large language model API (OpenAI GPT-4o-mini by default). Input messages are enriched with client-specific context (business type, known products, FAQ content) before being passed to the model. The response is a structured intent classification object, not a raw text reply. Downstream workflow steps act on the classified intent, not the raw model output. This separation ensures deterministic workflow behaviour regardless of model response variability.

Rules Engine — A configurable condition evaluator that applies client-defined business rules to incoming events before workflow dispatch. Rules are stored as JSON condition trees in the database and evaluated at runtime. Typical rules include: routing by message keyword, filtering by customer tier, applying time-of-day restrictions, or overriding AI classification in well-defined cases. Rules execute before AI inference when possible, to reduce LLM API cost.`,
    },
    role: {
      heading: "Role in System",
      body: "The Automation Engine is the only component permitted to mutate workflow state, trigger Integration Layer calls, or dispatch outbound messages. All other layers are either input providers (Client, Integration) or output consumers (Analytics). This constraint ensures that business logic is centralised, auditable, and consistent. Every state transition, rule evaluation, and AI inference call is logged with a timestamp and correlation ID, creating a complete processing record for each inbound event.",
    },
    scalability: {
      heading: "Scalability Notes",
      points: [
        "Worker processes are stateless and run in parallel. Increasing throughput requires adding workers, not restructuring the engine.",
        "The BullMQ queue decouples message ingestion from processing. Bursts of inbound traffic are absorbed by the queue rather than causing synchronous back-pressure on the Client Layer.",
        "AI inference calls are the primary latency bottleneck. The engine supports per-client inference caching: identical inputs within a TTL window return cached classification results without re-calling the LLM API.",
        "Workflows that involve external delays (e.g. 'wait 24 hours then follow up') are stored in a delayed job queue rather than held in memory, allowing the worker to serve other requests during the wait period.",
        "Per-client workflow concurrency limits prevent a single high-volume client from starving other tenants' processing queues.",
      ],
    },
  },
  {
    number: "04",
    id: "analytics-engine",
    Icon: BarChart2,
    title: "Analytics Engine",
    subtitle: "Event Ingestion · Aggregation Pipeline · BI Dashboard · Alerting",
    tagline: "Operational visibility without a data team.",
    technical: {
      heading: "Technical Explanation",
      body: `The Analytics Engine is a read-side system that consumes events emitted by the Automation Engine and transforms them into aggregated metrics surfaced on client-facing dashboards.

Architecture:

Event Emitter — The Automation Engine emits structured events at key workflow points: message received, intent classified, workflow started, step completed, integration call resolved, message sent, workflow closed. Each event carries a timestamp, tenant ID, correlation ID, channel type, and step-specific metadata.

Aggregation Pipeline — Events are written to a structured log table in PostgreSQL. Background aggregation jobs run on a configurable schedule (default: every 5 minutes) and compute aggregate metrics per tenant: message volume, intent distribution, workflow completion rate, average response latency, resolution rate, escalation rate, and cost-per-interaction.

BI Dashboard — Aggregated metrics are exposed through a REST API consumed by the client dashboard. The dashboard renders time-series charts, funnel views, and summary cards. Time ranges are configurable. Data is scoped to the authenticated tenant with row-level security at the database layer.

Alerting — Clients on Growth and Enterprise plans can configure threshold alerts (e.g. 'notify me if resolution rate drops below 80%' or 'alert when queue depth exceeds 50 pending messages'). Alerts are evaluated against the latest aggregation run and dispatched via WhatsApp or email.`,
    },
    role: {
      heading: "Role in System",
      body: "The Analytics Engine has no write path back to the Automation Engine. It is strictly a consumer of the event log. This separation means that analytics processing load cannot affect real-time workflow performance. It also means that historical data is always available for replay: if a new metric is required, the aggregation pipeline can backfill it from the raw event log without any re-processing of live workflows.",
    },
    scalability: {
      heading: "Scalability Notes",
      points: [
        "Aggregation jobs are decoupled from the query path. Dashboard queries read from pre-computed aggregate tables, not from the raw event log, keeping read latency consistent as event volume grows.",
        "Raw event tables are partitioned by tenant ID and date. Queries against a single tenant's data do not scan other partitions.",
        "Historical events beyond the hot-storage retention window (90 days) are exported to cold storage. Aggregate tables retain summary data indefinitely, so dashboard metrics remain available without querying cold storage for standard report periods.",
        "The event schema is versioned. New event types can be added by the Automation Engine without requiring Analytics Engine schema migrations.",
      ],
    },
  },
  {
    number: "05",
    id: "infrastructure-layer",
    Icon: Shield,
    title: "Infrastructure Layer",
    subtitle: "Cloud Hosting · Encryption · Audit Logging · Availability",
    tagline: "The substrate all other layers run on.",
    technical: {
      heading: "Technical Explanation",
      body: `Application Hosting — The web application and serverless API functions are deployed on Vercel's global edge network. Functions execute in isolated V8 runtimes with a maximum execution timeout of 30 seconds for standard functions and 900 seconds for background jobs. Static assets are served from Vercel's CDN with automatic cache invalidation on deployment.

Database — PostgreSQL on Neon (serverless, AWS eu-central-1). Neon provides serverless connection pooling via a connection proxy, which is critical for serverless workloads where each function invocation would otherwise exhaust the database's max connection limit. The primary database handles writes. Read-heavy analytics queries are directed to a read replica.

Queue and Cache — BullMQ job queues and application-layer caches use Redis (Upstash serverless Redis). Queue entries are persisted to Redis. In the event of a worker crash, jobs remain in the queue and are reprocessed by the next available worker. Retry logic with exponential backoff is applied to all failed jobs.

Encryption — TLS 1.3 for all data in transit. AES-256 for all data at rest (database encryption is managed by Neon; object storage encryption is managed at the provider layer). Encryption key rotation follows the provider's default schedule; enterprise clients can request dedicated key management.

Audit Logging — Every authenticated API call, data access operation, configuration change, and administrative action is written to an append-only audit log table. Log entries contain timestamp, actor identity (user ID or system token), source IP, HTTP method, endpoint, and response status code. The audit table has no UPDATE or DELETE permissions at the application user level — only INSERT and SELECT.`,
    },
    role: {
      heading: "Role in System",
      body: "The Infrastructure Layer provides the execution environment, persistence, and security controls that all other layers depend on. It is not a logical layer in the request processing path — it is the physical and operational substrate. Changes to infrastructure configuration (e.g. upgrading the database instance, rotating encryption keys, adjusting function memory allocation) affect all layers simultaneously without requiring application code changes. Infrastructure is managed as code using Vercel project configuration and database migration files versioned in the application repository.",
    },
    scalability: {
      heading: "Scalability Notes",
      points: [
        "Vercel functions scale to zero when idle and spin up within milliseconds on demand. There is no fixed instance count to provision or warm-pool to maintain.",
        "Neon's serverless connection pooler multiplexes application connections, allowing hundreds of concurrent function invocations to share a small number of actual database connections. This eliminates the connection exhaustion problem common to serverless-on-PostgreSQL deployments.",
        "Redis on Upstash is billed per-request with no fixed connection cost, consistent with the serverless execution model.",
        "Enterprise clients requiring dedicated compute, private networking, or on-premise database hosting can be provisioned on a separate infrastructure configuration. The application layer is infrastructure-agnostic.",
        "Database schema migrations are applied via versioned migration files run as part of the deployment pipeline. Zero-downtime migrations are enforced by policy: no migration may drop a column or table without a preceding deprecation period.",
      ],
    },
  },
];

/* ── Design principles ──────────────────────────────────── */

const principles = [
  {
    Icon: Layers,
    title: "Strict Layer Separation",
    body: "Each layer has a defined interface contract. No layer calls another layer's internal functions directly — all cross-layer communication goes through queues or typed APIs. This makes individual layers testable, replaceable, and independently deployable.",
  },
  {
    Icon: Workflow,
    title: "Integration-First, Not Rip-and-Replace",
    body: "The platform is designed to augment existing systems, not replace them. The Integration Layer's connector model means a client's CRM, order system, and payment gateway remain the systems of record. ShadowSpark reads from and writes to those systems rather than duplicating their data.",
  },
  {
    Icon: GitBranch,
    title: "Observable by Default",
    body: "Every request, state transition, integration call, and AI inference operation is logged with a correlation ID. The system cannot succeed or fail silently. This is a design constraint, not a monitoring afterthought.",
  },
  {
    Icon: RefreshCw,
    title: "Resumable State",
    body: "Multi-step workflows persist their state at every step boundary. A server restart, a deployment, or an infrastructure failure does not lose in-progress work. Workflows resume from their last committed state on the next worker pickup.",
  },
  {
    Icon: Lock,
    title: "Tenant Isolation",
    body: "Client data is isolated at the database level using row-level security policies. No application-layer filtering or query scoping can produce data leakage between tenants — the database enforces the boundary regardless of application code correctness.",
  },
  {
    Icon: Zap,
    title: "Asynchronous Processing",
    body: "The request path from inbound message to response acknowledgement is deliberately short. All non-trivial processing — workflow execution, integration calls, AI inference — happens asynchronously on worker queues. This keeps response latency predictable regardless of backend processing time.",
  },
];

/* ── Page ───────────────────────────────────────────────── */

export default function ArchitecturePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0f1a] pt-24">

        {/* ── Page header ─────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#d4a843]">
              Technical Documentation
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Platform Architecture
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-400">
              The ShadowSpark platform is built as a five-layer system.
              Each layer has a defined responsibility, a typed interface to
              adjacent layers, and independent scalability characteristics.
              This document describes the design, function, and operational
              properties of each layer.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1 text-xs text-slate-400">
                <Activity size={11} /> Version 1.2
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1 text-xs text-slate-400">
                <Server size={11} /> Node.js · PostgreSQL · Redis
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1 text-xs text-slate-400">
                <Database size={11} /> Neon · Upstash · Vercel
              </span>
            </div>
          </div>
        </section>

        {/* ── Contents ────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <nav
            aria-label="Page sections"
            className="rounded-2xl border border-slate-800 bg-[#0d1320] p-6"
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Contents
            </p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <a
                href="#design-philosophy"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <span className="font-mono text-xs text-slate-600">00</span>
                Design Philosophy
              </a>
              {layers.map(({ number, id, title }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <span className="font-mono text-xs text-slate-600">{number}</span>
                  {title}
                </a>
              ))}
              <a
                href="#system-diagram"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <span className="font-mono text-xs text-slate-600">06</span>
                System Diagram
              </a>
            </div>
          </nav>
        </section>

        {/* ── Design Philosophy ───────────────────────── */}
        <section
          id="design-philosophy"
          className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-20 sm:px-6 lg:px-8"
        >
          <SectionHeading label="Section 00" title="Design Philosophy" />
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-400">
            The platform is designed around six non-negotiable principles.
            These are architectural constraints, not aspirations — they are
            enforced through system boundaries and interface contracts, not
            through convention or documentation.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="rounded-xl border border-slate-800 bg-[#0d1320] p-6"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d4a843]/10 text-[#d4a843]">
                  <Icon size={17} />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-white">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Layer sections ──────────────────────────── */}
        <div className="mx-auto max-w-7xl space-y-0 px-4 sm:px-6 lg:px-8">
          {layers.map(
            ({ number, id, Icon, title, subtitle, tagline, technical, role, scalability }, i) => (
              <section
                key={id}
                id={id}
                className={`scroll-mt-24 border-t border-slate-800 py-20 ${
                  i === layers.length - 1 ? "pb-28" : ""
                }`}
              >
                {/* Layer header */}
                <div className="flex flex-wrap items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#d4a843]/10 text-[#d4a843]">
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-slate-600">
                      Layer {number}
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight text-white">
                      {title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
                    <p className="mt-2 text-sm font-medium text-slate-300">
                      {tagline}
                    </p>
                  </div>
                </div>

                {/* Three-column detail grid */}
                <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-slate-800 bg-slate-800 lg:grid-cols-3">
                  {/* Technical */}
                  <div className="bg-[#0d1320] px-7 py-8">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#d4a843]">
                      {technical.heading}
                    </p>
                    <div className="mt-4 space-y-3">
                      {technical.body.split("\n\n").map((para, pi) => (
                        <p
                          key={pi}
                          className="text-sm leading-relaxed text-slate-400"
                        >
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Role */}
                  <div className="bg-[#0d1320] px-7 py-8">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#d4a843]">
                      {role.heading}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-slate-400">
                      {role.body}
                    </p>
                  </div>

                  {/* Scalability */}
                  <div className="bg-[#0d1320] px-7 py-8">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#d4a843]">
                      {scalability.heading}
                    </p>
                    <ul className="mt-4 space-y-3">
                      {scalability.points.map((pt, pi) => (
                        <li
                          key={pi}
                          className="flex items-start gap-2.5 text-sm text-slate-400"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4a843]/50" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )
          )}
        </div>

        {/* ── System Diagram (text) ────────────────────── */}
        <section
          id="system-diagram"
          className="border-t border-slate-800 bg-[#080d18]"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <SectionHeading label="Section 06" title="System Overview Diagram" />
            <p className="mt-3 max-w-2xl text-sm text-slate-500">
              Structural representation of request flow through all five layers.
              A vector architecture diagram is available on request for
              enterprise procurement reviews.
            </p>

            <div className="mt-10 overflow-x-auto rounded-2xl border border-slate-800 bg-[#060b14]">
              <pre className="min-w-[640px] p-8 font-mono text-xs leading-6 text-slate-400">
{`┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER  [01]                         │
│                                                                     │
│   ┌──────────────┐   ┌────────────────────┐   ┌───────────────┐    │
│   │  Web Chat    │   │  WhatsApp Business │   │   REST API    │    │
│   │  (WebSocket) │   │  (Twilio webhooks) │   │  (Bearer JWT) │    │
│   └──────┬───────┘   └────────┬───────────┘   └───────┬───────┘    │
│          └────────────────────┼────────────────────────┘           │
│                               ▼                                     │
│                  Message Normalisation Service                      │
│                  (auth · schema validation · tenant ID)             │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ Normalised Event
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    API & INTEGRATION LAYER  [02]                    │
│                                                                     │
│   ┌──────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│   │   CRM    │  │ Order System │  │   Payments   │  │  Sheets  │  │
│   │Connector │  │  Connector   │  │  Connector   │  │Connector │  │
│   └──────────┘  └──────────────┘  └──────────────┘  └──────────┘  │
│                                                                     │
│   Secrets Store · Response Cache (TTL) · Retry / Backoff           │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ Resolved Data
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      AUTOMATION ENGINE  [03]                        │
│                                                                     │
│   ┌──────────────────┐   ┌─────────────────┐   ┌────────────────┐  │
│   │ Rules Engine     │   │  AI Inference   │   │    Workflow    │  │
│   │ (JSON conditions)│──▶│  (LLM · intent  │──▶│ Orchestrator   │  │
│   │                  │   │  classification)│   │ (BullMQ DAG)   │  │
│   └──────────────────┘   └─────────────────┘   └───────┬────────┘  │
│                                                         │           │
│   Persistent State · Retry Queue · Correlation IDs     │           │
└─────────────────────────────────────────────────────────┼───────────┘
                                ┌────────────────────────┘
                    ┌───────────┴──────────────┐
                    │  Events emitted           │  Outbound messages
                    ▼                           ▼
┌─────────────────────────┐   ┌────────────────────────────────────────┐
│   ANALYTICS ENGINE [04] │   │        CLIENT LAYER  [01]              │
│                         │   │  (outbound via WhatsApp / web / REST)  │
│  Event Ingestion        │   └────────────────────────────────────────┘
│  Aggregation Jobs       │
│  BI Dashboard API       │
│  Threshold Alerting     │
└─────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     INFRASTRUCTURE LAYER  [05]                      │
│                                                                     │
│  Vercel Edge  ·  Neon PostgreSQL (RLS)  ·  Upstash Redis            │
│  TLS 1.3 in-transit  ·  AES-256 at-rest  ·  Append-only audit log  │
│  Serverless connection pooler  ·  Read replica  ·  CDN              │
└─────────────────────────────────────────────────────────────────────┘`}
              </pre>
            </div>
          </div>
        </section>

        {/* ── Footer CTA ──────────────────────────────── */}
        <section className="border-t border-slate-800 bg-[#0a0f1a]">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Architecture questions or procurement review?
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  A full infrastructure specification document and architecture
                  diagram are available to enterprise prospects on request.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#d4a843] to-[#c0935a] px-6 py-3 text-sm font-semibold text-slate-900 transition-all hover:from-[#e8c56d] hover:to-[#d4a843]"
                >
                  Request Demo <ArrowRight size={15} />
                </Link>
                <Link
                  href="/security"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition-all hover:border-[#d4a843]/40 hover:text-[#d4a843]"
                >
                  View Security Docs
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/* ── Shared sub-component ───────────────────────────────── */

function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#d4a843]">
        {label}
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {title}
      </h2>
    </>
  );
}

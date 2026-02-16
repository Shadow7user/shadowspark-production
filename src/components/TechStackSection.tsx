const stack = [
  {
    layer: "Frontend",
    components: [
      { name: "Next.js 14", role: "React framework with App Router, server-side rendering, and static generation." },
      { name: "Vercel", role: "Global edge deployment network. Automatic preview deployments on every push." },
      { name: "Tailwind CSS", role: "Utility-first styling. No runtime overhead — all styles compiled at build time." },
    ],
  },
  {
    layer: "Backend",
    components: [
      { name: "Node.js", role: "Server runtime for API routes, webhook processing, and background job execution." },
      { name: "REST APIs", role: "Structured HTTP endpoints for chatbot actions, CRM sync, and third-party integration calls." },
      { name: "TypeScript", role: "End-to-end type safety across API contracts, data models, and UI components." },
    ],
  },
  {
    layer: "Automation Engine",
    components: [
      { name: "Custom Workflow Orchestrator", role: "Purpose-built engine managing branching logic, escalation routing, retry handling, and multi-channel delivery." },
      { name: "AI Inference Layer", role: "Natural language classification and intent resolution via large language model API integration." },
      { name: "Rules Engine", role: "Configurable business rules applied to incoming events before workflow dispatch — no code changes required per client." },
    ],
  },
  {
    layer: "Data",
    components: [
      { name: "PostgreSQL (Neon)", role: "Structured relational storage for client configurations, interaction logs, and analytics records." },
      { name: "Serverless Connection Pooling", role: "Efficient connection management across concurrent serverless function invocations." },
      { name: "Redis (Upstash)", role: "Low-latency key-value store for rate limiting, session state, and queue coordination." },
    ],
  },
  {
    layer: "Security",
    components: [
      { name: "TLS 1.3 + AES-256", role: "All data encrypted in transit and at rest. Keys managed separately from stored data." },
      { name: "Role-Based Access Control", role: "Granular permissions per user role. No shared credentials. All access events logged." },
      { name: "Immutable Audit Logs", role: "Every system action recorded with timestamp, actor, and source. Retained 90 days hot, 12 months cold." },
    ],
  },
  {
    layer: "Observability",
    components: [
      { name: "Structured Logging", role: "JSON-formatted logs with request IDs, latency, error codes, and environment context." },
      { name: "Error Monitoring", role: "Real-time exception tracking with stack traces, release tagging, and alert routing." },
      { name: "Analytics Pipeline", role: "Event data aggregated into client-facing BI dashboards — response times, resolution rates, lead conversion." },
    ],
  },
];

export default function TechStackSection() {
  return (
    <section id="tech-stack" className="bg-[#080d18] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#d4a843]">
            Infrastructure
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Technology Stack
          </h2>
          <p className="mt-4 text-slate-400">
            The components listed below are the actual technologies underpinning
            the ShadowSpark platform. We disclose our stack because enterprise
            buyers should understand what they are building on — not take it on
            faith.
          </p>
        </div>

        {/* Stack table */}
        <div className="mt-12 space-y-px overflow-hidden rounded-2xl border border-slate-800">
          {stack.map(({ layer, components }, layerIdx) => (
            <div
              key={layer}
              className={`grid sm:grid-cols-[160px_1fr] ${
                layerIdx % 2 === 0 ? "bg-[#0d1320]" : "bg-[#0a1018]"
              }`}
            >
              {/* Layer label */}
              <div className="flex items-start border-b border-slate-800 px-6 py-5 sm:border-b-0 sm:border-r">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {layer}
                </span>
              </div>

              {/* Components */}
              <div className="grid gap-0 divide-y divide-slate-800/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {components.map(({ name, role }) => (
                  <div key={name} className="px-6 py-5">
                    <p className="text-sm font-semibold text-white">{name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-6 text-xs text-slate-700">
          Specific vendor selections may vary by deployment configuration.
          Enterprise clients can request a full infrastructure specification
          document prior to contract.
        </p>
      </div>
    </section>
  );
}

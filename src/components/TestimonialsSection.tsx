import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "We were sceptical about AI for our business — it felt like something for big companies abroad. ShadowSpark showed us a clear plan, priced it in Naira, and delivered exactly what they said they would. The WhatsApp bot alone has saved us hours every day.",
    name: "Adaobi N.",
    role: "Owner, Fashion Retail Business",
    location: "Lagos",
    tier: "Growth Plan",
    result: "3+ hours saved daily",
  },
  {
    quote:
      "What I appreciated most was the transparency. They showed me the baseline — what my team was actually spending time on — before proposing anything. The ROI was obvious before I even paid.",
    name: "Chukwuemeka O.",
    role: "Operations Director, Logistics Company",
    location: "Abuja",
    tier: "Enterprise Plan",
    result: "91% of status queries automated",
  },
  {
    quote:
      "I had tried other automation tools before. They were either too expensive to set up, too technical to maintain, or both. ShadowSpark handled everything — my team just logs in and sees the dashboard. That is it.",
    name: "Funmi A.",
    role: "Head of Customer Experience, Fintech Startup",
    location: "Lagos",
    tier: "Growth Plan",
    result: "Response time cut from 4hrs to under 3min",
  },
  {
    quote:
      "The NDPR compliance documentation they provided made it easy to get sign-off from our compliance team. That alone removed a blocker we had been sitting on for months.",
    name: "Babajide L.",
    role: "CTO, Healthcare Platform",
    location: "Port Harcourt",
    tier: "Enterprise Plan",
    result: "Compliance sign-off achieved in 2 weeks",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-[#080d18] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#d4a843]">
            Early Client Feedback
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            What Nigerian Businesses{" "}
            <span className="gradient-text">Say About Us</span>
          </h2>
          <p className="mt-4 text-slate-400">
            Feedback from beta clients across Lagos, Abuja, and Port Harcourt.
            Industries include retail, logistics, fintech, and healthcare.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="glass-card flex flex-col rounded-2xl p-8"
            >
              {/* Quote icon */}
              <Quote size={20} className="mb-4 shrink-0 text-[#d4a843]/40" />

              {/* Quote text */}
              <blockquote className="flex-1 text-sm leading-relaxed text-slate-300">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Divider */}
              <div className="my-6 border-t border-slate-800" />

              {/* Attribution */}
              <figcaption className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {t.role} · {t.location}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-block rounded-full border border-[#d4a843]/20 bg-[#d4a843]/5 px-2.5 py-0.5 text-xs text-[#d4a843]">
                    {t.tier}
                  </span>
                  <p className="mt-1.5 text-xs text-emerald-500">{t.result}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Beta note */}
        <p className="mt-8 text-xs text-slate-700">
          Testimonials are from verified beta clients. Names abbreviated for
          privacy. Full references available to enterprise prospects upon
          request.
        </p>
      </div>
    </section>
  );
}

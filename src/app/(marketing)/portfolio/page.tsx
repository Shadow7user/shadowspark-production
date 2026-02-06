import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | Client Success Stories | ShadowSpark Technologies",
  description:
    "See how Nigerian businesses use our AI chatbots, websites, and automation to save 20+ hours/week and increase revenue.",
};

const caseStudies = [
  {
    id: 1,
    client: "E-Commerce Fashion Brand",
    industry: "Retail",
    challenge:
      "1000+ daily WhatsApp inquiries overwhelming 3-person support team",
    solution: "AI chatbot trained on 2,000 FAQs + product catalog",
    results: [
      "85% of inquiries resolved automatically",
      "₦2.1M monthly revenue increase from faster responses",
      "Support team redirected to high-value sales calls",
    ],
    investment: "₦450,000",
    timeline: "2 weeks",
    tech: ["WhatsApp Business API", "GPT-4", "Product Database Integration"],
  },
  {
    id: 2,
    client: "Logistics Startup",
    industry: "Transportation",
    challenge: "Manual order tracking consuming 6 hours daily",
    solution: "Automated dashboard + SMS notifications",
    results: [
      "Zero manual tracking—fully automated",
      "400 orders/day processed (vs 80 before)",
      "Customer satisfaction: 94% (was 67%)",
    ],
    investment: "₦1,200,000",
    timeline: "3 weeks",
    tech: ["Next.js", "Twilio API", "PostgreSQL", "Real-time Maps"],
  },
  {
    id: 3,
    client: "Real Estate Agency",
    industry: "Property",
    challenge: "Outdated website, no lead capture, losing to competitors",
    solution: "Modern website + CRM + WhatsApp lead bot",
    results: [
      "200+ leads captured in first month",
      "45% conversion rate (industry average: 18%)",
      'Ranked #1 on Google for "Lagos apartments"',
    ],
    investment: "₦850,000",
    timeline: "2.5 weeks",
    tech: ["Next.js", "WhatsApp Bot", "Google Maps API", "CRM Integration"],
  },
];

export default function PortfolioPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-cyan-900/20" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Real Results. Real Businesses.
            </h1>
            <p className="text-xl text-muted-foreground">
              See how Nigerian companies use our AI solutions to save time,
              increase revenue, and outcompete their market.
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {caseStudies.map((study) => (
              <div
                key={study.id}
                className="p-8 border border-border rounded-2xl bg-card/50 backdrop-blur"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-sm text-cyan-400 mb-2">
                      {study.industry}
                    </div>
                    <h2 className="text-2xl font-bold">{study.client}</h2>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-400">
                      {study.investment}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {study.timeline}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-6">
                  <div>
                    <h3 className="font-semibold mb-2 text-cyan-400">
                      Challenge
                    </h3>
                    <p className="text-muted-foreground">{study.challenge}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-purple-400">
                      Solution
                    </h3>
                    <p className="text-muted-foreground">{study.solution}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-cyan-400">
                      Results
                    </h3>
                    <ul className="space-y-1">
                      {study.results.map((result, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-cyan-400">•</span>
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {study.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs border border-border rounded-full bg-muted/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready for Similar Results?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book a free audit call. We&apos;ll analyze your business and show
            you exactly how AI can deliver ROI in 30-90 days.
          </p>
          <a
            href="https://calendly.com/morontomornica7/audit"
            className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
          >
            Book Free Audit Call
          </a>
        </div>
      </section>
    </div>
  );
}

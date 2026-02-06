import { LineChart, Search, TrendingUp } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO Services Nigeria | Google Rankings | ShadowSpark",
  description:
    "Dominate Google search results in Nigeria. Technical SEO, content strategy, local SEO, link building. ₦60K-150K/month retainer.",
};

export default function SeoPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-background to-cyan-900/20" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              Dominate Google in Nigeria
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Technical SEO, content strategy, local SEO, and link building that
              drives organic traffic. We&apos;ve helped Nigerian businesses
              achieve page 1 rankings in competitive markets.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://calendly.com/morontomornica7/audit"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
              >
                Get Free SEO Audit
              </a>
              <a
                href="/case-studies"
                className="px-8 py-4 border border-cyan-500/30 rounded-xl font-semibold hover:bg-cyan-500/10 transition-colors"
              >
                View Case Studies
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-cyan-400">250%</div>
              <div className="text-sm text-muted-foreground">
                Avg Traffic Growth
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400">Page 1</div>
              <div className="text-sm text-muted-foreground">
                Target Rankings
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400">3-6 Months</div>
              <div className="text-sm text-muted-foreground">
                Results Timeline
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            What&apos;s Included
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border border-border rounded-2xl bg-card/50 backdrop-blur">
              <Search className="h-12 w-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Technical SEO</h3>
              <p className="text-muted-foreground">
                Site speed optimization, schema markup, crawl fixes, Core Web
                Vitals.
              </p>
            </div>
            <div className="p-6 border border-border rounded-2xl bg-card/50 backdrop-blur">
              <TrendingUp className="h-12 w-12 text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Content Strategy</h3>
              <p className="text-muted-foreground">
                Keyword research, content calendar, blog posts optimized for
                Nigerian search intent.
              </p>
            </div>
            <div className="p-6 border border-border rounded-2xl bg-card/50 backdrop-blur">
              <LineChart className="h-12 w-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Link Building</h3>
              <p className="text-muted-foreground">
                Quality backlinks from Nigerian and international authority
                sites.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="p-8 border border-cyan-500/30 rounded-2xl bg-card/80 backdrop-blur">
            <div className="text-center mb-8">
              <div className="text-4xl font-bold mb-2">₦60,000 - ₦150,000</div>
              <div className="text-muted-foreground">
                Monthly retainer (6-month minimum)
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>Comprehensive site audit + strategy</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>4-8 optimized blog posts/month</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>Local SEO + Google Business Profile</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>Monthly reports + strategy calls</span>
              </li>
            </ul>
            <a
              href="https://calendly.com/morontomornica7/audit"
              className="block w-full py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-center rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              Get Free SEO Audit
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Rank on Google?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book a free SEO audit call. We&apos;ll analyze your current
            rankings, identify opportunities, and create a roadmap to page 1.
          </p>
          <a
            href="https://calendly.com/morontomornica7/audit"
            className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
          >
            Get Free SEO Audit
          </a>
        </div>
      </section>
    </div>
  );
}

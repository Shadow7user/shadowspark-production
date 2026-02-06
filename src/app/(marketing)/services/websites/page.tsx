import { Globe, Palette, Zap } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Development | Custom Business Websites | ShadowSpark",
  description:
    "High-performance websites that convert visitors into customers. Custom design, SEO-optimized, mobile-first. 4-6 week delivery.",
};

export default function WebsitesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-background to-purple-900/20" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Websites That Convert Visitors Into Customers
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              High-performance, SEO-optimized websites built for Nigerian
              businesses. Mobile-first design, fast load times, integrated
              payments. 4-6 week delivery.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://calendly.com/morontomornica7/audit"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
              >
                Book Free Audit Call
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
              <div className="text-3xl font-bold text-cyan-400">&lt;2s</div>
              <div className="text-sm text-muted-foreground">Load Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">95+</div>
              <div className="text-sm text-muted-foreground">
                Lighthouse Score
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400">4-6 Weeks</div>
              <div className="text-sm text-muted-foreground">Delivery</div>
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
              <Palette className="h-12 w-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Custom Design</h3>
              <p className="text-muted-foreground">
                Unique brand identity, responsive layouts, modern UI/UX tailored
                to your business.
              </p>
            </div>
            <div className="p-6 border border-border rounded-2xl bg-card/50 backdrop-blur">
              <Zap className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Optimized for Nigerian networks. Sub-2-second load times, image
                compression, CDN delivery.
              </p>
            </div>
            <div className="p-6 border border-border rounded-2xl bg-card/50 backdrop-blur">
              <Globe className="h-12 w-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">SEO Ready</h3>
              <p className="text-muted-foreground">
                Built-in SEO optimization, structured data, sitemap, Google
                Analytics integration.
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
              <div className="text-4xl font-bold mb-2">
                ₦500,000 - ₦1,200,000
              </div>
              <div className="text-muted-foreground">
                One-time development + optional maintenance
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>5-15 pages custom designed</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>Paystack/Flutterwave payment integration</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>Admin dashboard + content management</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>1 year hosting + SSL certificate included</span>
              </li>
            </ul>
            <a
              href="https://calendly.com/morontomornica7/audit"
              className="block w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-center rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              Book Free Audit Call
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready for a Website That Actually Converts?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book a free 30-minute audit call. We&apos;ll review your current
            site and show you exactly how to increase conversions.
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

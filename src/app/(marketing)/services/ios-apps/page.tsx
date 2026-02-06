import { Apple, ShieldCheck, Zap } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "iOS App Development | iPhone & iPad Apps | ShadowSpark",
  description:
    "Native Swift & SwiftUI apps for iOS. App Store deployment, Apple Pay integration, Face ID. Premium iOS experiences. ₦700K-1.8M.",
};

export default function IosAppsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-cyan-900/20" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Premium iOS Apps
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Native Swift & SwiftUI apps that delight users. App Store
              deployment, Apple Pay, Face ID, widgets, and seamless iCloud sync.
              Built for the Apple ecosystem.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://calendly.com/morontomornica7/audit"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
              >
                Book Free Consultation
              </a>
              <a
                href="/portfolio"
                className="px-8 py-4 border border-cyan-500/30 rounded-xl font-semibold hover:bg-cyan-500/10 transition-colors"
              >
                View Our Apps
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
              <div className="text-3xl font-bold text-cyan-400">25K+</div>
              <div className="text-sm text-muted-foreground">App Downloads</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">4.7★</div>
              <div className="text-sm text-muted-foreground">
                Avg App Store Rating
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400">
                10-14 Weeks
              </div>
              <div className="text-sm text-muted-foreground">Development</div>
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
              <Apple className="h-12 w-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Native Swift</h3>
              <p className="text-muted-foreground">
                100% native Swift & SwiftUI for buttery smooth 120fps
                animations.
              </p>
            </div>
            <div className="p-6 border border-border rounded-2xl bg-card/50 backdrop-blur">
              <ShieldCheck className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Apple Ecosystem</h3>
              <p className="text-muted-foreground">
                Face ID, Apple Pay, iCloud sync, widgets, and Apple Watch
                extensions.
              </p>
            </div>
            <div className="p-6 border border-border rounded-2xl bg-card/50 backdrop-blur">
              <Zap className="h-12 w-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">App Store Launch</h3>
              <p className="text-muted-foreground">
                Full App Store submission, ASO, and featured placement strategy.
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
                ₦700,000 - ₦1,800,000
              </div>
              <div className="text-muted-foreground">
                Full iOS development + 3 months support
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>UI/UX design following Apple HIG</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>Apple Pay + Paystack payment options</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>Face ID, widgets, iCloud sync</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>App Store submission + 3-month support</span>
              </li>
            </ul>
            <a
              href="https://calendly.com/morontomornica7/audit"
              className="block w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-center rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              Book Free Consultation
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Launch Your iOS App?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book a free 30-minute consultation. We&apos;ll discuss your app
            vision and create a roadmap to the App Store.
          </p>
          <a
            href="https://calendly.com/morontomornica7/audit"
            className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
          >
            Book Free Consultation
          </a>
        </div>
      </section>
    </div>
  );
}

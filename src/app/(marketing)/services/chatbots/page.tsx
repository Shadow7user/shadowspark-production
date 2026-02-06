import { Clock, MessageSquare, TrendingUp } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Chatbots | WhatsApp & Instagram Automation | ShadowSpark",
  description:
    "Deploy intelligent chatbots that handle 80% of customer inquiries 24/7. WhatsApp, Instagram, web integration. 2-week delivery.",
};

export default function ChatbotsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-cyan-900/20" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              AI Chatbots That Never Sleep
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Deploy intelligent chatbots that handle 80% of customer inquiries
              automatically. WhatsApp, Instagram, website integration. 2-week
              delivery.
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
              <div className="text-3xl font-bold text-cyan-400">80%</div>
              <div className="text-sm text-muted-foreground">
                Queries Automated
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">24/7</div>
              <div className="text-sm text-muted-foreground">Availability</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400">2 Weeks</div>
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
              <MessageSquare className="h-12 w-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                Platform Integration
              </h3>
              <p className="text-muted-foreground">
                WhatsApp Business API, Instagram DMs, website chat widget.
              </p>
            </div>
            <div className="p-6 border border-border rounded-2xl bg-card/50 backdrop-blur">
              <Clock className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">AI Training</h3>
              <p className="text-muted-foreground">
                Custom-trained on your FAQs, product catalog, brand voice.
              </p>
            </div>
            <div className="p-6 border border-border rounded-2xl bg-card/50 backdrop-blur">
              <TrendingUp className="h-12 w-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                Analytics Dashboard
              </h3>
              <p className="text-muted-foreground">
                Track conversations, resolution rates, satisfaction scores.
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
              <div className="text-4xl font-bold mb-2">₦350,000 - ₦600,000</div>
              <div className="text-muted-foreground">
                One-time setup + monthly maintenance
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>WhatsApp + Instagram + Website integration</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>Custom AI training on your business data</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>Analytics dashboard + monthly reports</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>2 weeks delivery, lifetime support</span>
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
            Ready to Automate Customer Support?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book a free 30-minute audit call. We&apos;ll analyze your workflow
            and show you how a chatbot saves 20+ hours per week.
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

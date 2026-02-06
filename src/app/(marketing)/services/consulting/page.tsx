import { Lightbulb, Target, Users } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Consulting Nigeria | Strategy & Advisory | ShadowSpark",
  description:
    "Expert tech strategy consulting for Nigerian businesses. Digital transformation, tech stack audits, team training. ₦200K-500K/session.",
};

export default function ConsultingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-background to-cyan-900/20" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-400">
              Tech Strategy That Delivers
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Expert consulting for Nigerian businesses ready to scale. Digital
              transformation roadmaps, tech stack audits, team training, and
              vendor selection. Make confident technology decisions.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://calendly.com/morontomornica7/audit"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-amber-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
              >
                Book Strategy Session
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
              <div className="text-3xl font-bold text-cyan-400">50+</div>
              <div className="text-sm text-muted-foreground">
                Businesses Advised
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-400">₦2B+</div>
              <div className="text-sm text-muted-foreground">
                Budget Managed
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400">10+ Years</div>
              <div className="text-sm text-muted-foreground">
                Industry Experience
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Consulting Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border border-border rounded-2xl bg-card/50 backdrop-blur">
              <Lightbulb className="h-12 w-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                Digital Transformation
              </h3>
              <p className="text-muted-foreground">
                End-to-end roadmaps to modernize operations, adopt cloud, and
                automate workflows.
              </p>
            </div>
            <div className="p-6 border border-border rounded-2xl bg-card/50 backdrop-blur">
              <Target className="h-12 w-12 text-amber-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Tech Stack Audit</h3>
              <p className="text-muted-foreground">
                Evaluate current tools, identify gaps, and recommend optimized
                solutions.
              </p>
            </div>
            <div className="p-6 border border-border rounded-2xl bg-card/50 backdrop-blur">
              <Users className="h-12 w-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Team Training</h3>
              <p className="text-muted-foreground">
                Upskill your team on modern tools, AI, automation, and best
                practices.
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
              <div className="text-4xl font-bold mb-2">₦200,000 - ₦500,000</div>
              <div className="text-muted-foreground">
                Per session or retainer packages available
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>2-4 hour deep-dive strategy session</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>Written recommendations + action plan</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>Vendor evaluation + selection support</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>30-day email follow-up support</span>
              </li>
            </ul>
            <a
              href="https://calendly.com/morontomornica7/audit"
              className="block w-full py-4 bg-gradient-to-r from-cyan-500 to-amber-500 text-white text-center rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              Book Strategy Session
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book a strategy session. We&apos;ll analyze your current tech
            landscape and create a roadmap for growth.
          </p>
          <a
            href="https://calendly.com/morontomornica7/audit"
            className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-amber-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
          >
            Book Strategy Session
          </a>
        </div>
      </section>
    </div>
  );
}

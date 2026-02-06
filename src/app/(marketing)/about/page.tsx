import { Metadata } from 'next'
import { Target, Lightbulb, Users, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | AI-Powered Digital Agency | ShadowSpark Technologies',
  description: 'Nigerian AI agency building chatbots, websites, and automation for SMBs. 2-4 week delivery, 98% client satisfaction.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-cyan-900/20" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Building Nigeria&apos;s AI-Powered Future
            </h1>
            <p className="text-xl text-muted-foreground">
              We help Nigerian businesses compete globally by deploying enterprise-grade AI solutions at startup speed.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                Every Nigerian business should have access to world-class AI automation—not just the Fortune 500. We bridge that gap by delivering enterprise solutions at prices SMBs can afford.
              </p>
              <p className="text-muted-foreground mb-4">
                Founded in 2024, ShadowSpark Technologies has helped 50+ Nigerian businesses automate customer support, scale their web presence, and eliminate repetitive workflows.
              </p>
              <p className="text-muted-foreground">
                Our 2-4 week delivery model means you see results before your competition even finishes planning.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 border border-border rounded-2xl bg-card/50">
                <div className="text-3xl font-bold text-cyan-400 mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Projects Delivered</div>
              </div>
              <div className="p-6 border border-border rounded-2xl bg-card/50">
                <div className="text-3xl font-bold text-purple-400 mb-2">98%</div>
                <div className="text-sm text-muted-foreground">Client Satisfaction</div>
              </div>
              <div className="p-6 border border-border rounded-2xl bg-card/50">
                <div className="text-3xl font-bold text-cyan-400 mb-2">₦5M+</div>
                <div className="text-sm text-muted-foreground">Client Revenue Impact</div>
              </div>
              <div className="p-6 border border-border rounded-2xl bg-card/50">
                <div className="text-3xl font-bold text-purple-400 mb-2">2-4</div>
                <div className="text-sm text-muted-foreground">Week Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <Target className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Results Over Process</h3>
              <p className="text-sm text-muted-foreground">We ship working solutions, not 50-page documentation.</p>
            </div>
            <div className="text-center">
              <Lightbulb className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI-First Approach</h3>
              <p className="text-sm text-muted-foreground">Every solution leverages AI to maximize efficiency.</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nigerian Context</h3>
              <p className="text-sm text-muted-foreground">Built for 3G networks, mobile-first users, Naira payments.</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Growth Partnership</h3>
              <p className="text-sm text-muted-foreground">Your success is our success. We measure by your revenue.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Something Great?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book a free 30-minute audit call. We&apos;ll show you exactly how AI can transform your business operations.
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
  )
}

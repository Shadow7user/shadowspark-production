"use client";

import { FAQ } from "@/components/marketing/faq";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { Button } from "@/components/ui/button";
import { ServiceIconsGrid } from "@/components/ui/service-icons";
import { TrustLogos } from "@/components/ui/trust-logos";
import { CheckCircle, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Hero Section - Clear Value Prop */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted -z-10" />

        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-block px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/20">
              <span className="text-cyan-400 text-sm font-medium">
                ● ACCEPTING NEW ENTERPRISE CLIENTS
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold">
              Fast, Secure Web Apps
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                For Nigerian Businesses
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI chatbots, custom websites & automation systems built in 2-4
              weeks. 60% cheaper than Lagos agencies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-purple-500 px-8 font-semibold hover:from-cyan-600 hover:to-purple-600"
              >
                <Link href="/contact">Book Free Audit</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-cyan-500/20"
              >
                <Link href="#case-studies">See Our Work</Link>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>24/7 WhatsApp Support</span>
              </div>
              <div>●</div>
              <div>2-4 Week Delivery</div>
              <div>●</div>
              <div>99.9% Uptime SLA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Bar - Trusted By Section */}
      <section className="py-12 border-y border-border/40">
        <div className="container">
          <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider">
            Trusted by Growing Nigerian Businesses
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {[
              { name: "TechHub Lagos", logo: "🏢" },
              { name: "NaijaMart", logo: "🛒" },
              { name: "LogiTrack", logo: "🚚" },
              { name: "12+ More", logo: "✨" },
            ].map((client) => (
              <div
                key={client.name}
                className="text-center opacity-60 hover:opacity-100 transition"
              >
                <div className="text-4xl mb-2">{client.logo}</div>
                <p className="text-sm font-medium">{client.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-cyan-400">₦2.5M+</div>
              <p className="text-sm text-muted-foreground mt-2">
                Active Pipeline
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400">12+</div>
              <p className="text-sm text-muted-foreground mt-2">B2B Clients</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-400">99.9%</div>
              <p className="text-sm text-muted-foreground mt-2">Uptime SLA</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400">2-4</div>
              <p className="text-sm text-muted-foreground mt-2">
                Weeks Delivery
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-4 text-center">
          Our Services
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Enterprise-grade solutions powered by AI for African businesses
        </p>
        <ServiceIconsGrid />
      </section>

      {/* Advanced Features Section */}
      <section className="py-20 bg-gradient-to-br from-background to-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enterprise-Grade Infrastructure
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built on the same stack as Netflix, Vercel, and Stripe
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 border rounded-xl hover:border-cyan-500/50 transition bg-card">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground mb-4">
                Sub-2-second load times on 3G. Optimized for Nigerian
                connectivity.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-cyan-500">✓</span>
                  <span>Edge CDN (200ms Lagos latency)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-500">✓</span>
                  <span>WebP/AVIF images</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-500">✓</span>
                  <span>Lazy loading + code splitting</span>
                </li>
              </ul>
            </div>

            <div className="group p-8 border rounded-xl hover:border-purple-500/50 transition bg-card">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Bank-Grade Security</h3>
              <p className="text-muted-foreground mb-4">
                SOC 2 compliant infrastructure. Your data is encrypted
                end-to-end.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>SSL/TLS encryption (HTTPS)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>OWASP Top 10 protection</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>Daily automated backups</span>
                </li>
              </ul>
            </div>

            <div className="group p-8 border rounded-xl hover:border-cyan-500/50 transition bg-card">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">24/7 Nigerian Support</h3>
              <p className="text-muted-foreground mb-4">
                Real humans. No chatbots. Response within 2 hours guaranteed.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-cyan-500">✓</span>
                  <span>WhatsApp priority line</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-500">✓</span>
                  <span>Email & phone support</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-500">✓</span>
                  <span>Free bug fixes (6 months)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Magnet */}
      <section className="py-20 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10">
        <div className="container max-w-4xl">
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Get Our Free Web Security Checklist
            </h2>
            <p className="text-lg text-muted-foreground">
              23-point audit to find vulnerabilities in your current website.
              <br />
              Used by 50+ Nigerian businesses to secure their online presence.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-lg border bg-background"
                required
              />
              <Button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                Download Free
              </Button>
            </form>

            <p className="text-xs text-muted-foreground">
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies Preview */}
      <section className="py-20" id="case-studies">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Real Results</h2>
            <p className="text-muted-foreground">
              Nigerian businesses we&apos;ve helped scale
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="border rounded-xl p-6">
              <div className="text-sm text-cyan-400 mb-2">Co-working Space</div>
              <h3 className="text-xl font-bold mb-4">TechHub Lagos</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-cyan-400">70%</div>
                  <div className="text-sm text-muted-foreground">
                    Support queries automated
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400">
                    15hrs
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Staff time saved/week
                  </div>
                </div>
              </div>
              <Link
                href="/case-studies"
                className="text-cyan-400 text-sm mt-4 inline-block"
              >
                Read full case study →
              </Link>
            </div>

            <div className="border rounded-xl p-6">
              <div className="text-sm text-cyan-400 mb-2">E-commerce</div>
              <h3 className="text-xl font-bold mb-4">NaijaMart</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-cyan-400">+34%</div>
                  <div className="text-sm text-muted-foreground">
                    Checkout completion
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400">1.2s</div>
                  <div className="text-sm text-muted-foreground">
                    Page load time (from 5s)
                  </div>
                </div>
              </div>
              <Link
                href="/case-studies"
                className="text-cyan-400 text-sm mt-4 inline-block"
              >
                Read full case study →
              </Link>
            </div>

            <div className="border rounded-xl p-6">
              <div className="text-sm text-cyan-400 mb-2">Logistics</div>
              <h3 className="text-xl font-bold mb-4">LogiTrack</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-cyan-400">0</div>
                  <div className="text-sm text-muted-foreground">
                    Tracking calls (from 50/day)
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400">24/7</div>
                  <div className="text-sm text-muted-foreground">
                    Self-service availability
                  </div>
                </div>
              </div>
              <Link
                href="/case-studies"
                className="text-cyan-400 text-sm mt-4 inline-block"
              >
                Read full case study →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* TRUST LOGOS */}
      <TrustLogos />
    </>
  );
}

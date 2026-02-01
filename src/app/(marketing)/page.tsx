"use client";

import { AnimatedBackground } from "@/components/ui/animated-background";
import { ServiceIconsGrid } from "@/components/ui/service-icons";
import { TrustLogos } from "@/components/ui/trust-logos";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Zap, BarChart, CheckCircle, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Hero Section - B2B Focus */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-cyan-900/20" />
        <div className="container relative z-10 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-purple-500/30 bg-purple-950/30 px-5 py-2.5">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span className="text-sm font-medium text-green-400">
                • Serving Nigerian SMEs in Lagos, PH, Abuja
              </span>
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
              AI-Powered Solutions for
              <span className="block bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Nigerian Businesses
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-300">
              We build & deploy{" "}
              <span className="font-semibold text-cyan-300">
                custom AI chatbots, business platforms, and automation tools
              </span>{" "}
              in <span className="font-bold text-white">2–4 weeks</span>—not
              months. Enterprise quality, founder speed.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-cyan-600 px-8 font-semibold hover:from-purple-700 hover:to-cyan-700"
              >
                <Link href="/services">
                  <Zap className="mr-2 h-5 w-5" />
                  View Our Services
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-gray-700 bg-gray-900/50"
              >
                <Link href="/case-studies">
                  <BarChart className="mr-2 h-5 w-5" />
                  See Case Studies
                </Link>
              </Button>
            </div>

            {/* Social Proof Bar */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-10 text-sm text-gray-400">
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="-ml-2 h-8 w-8 rounded-full border-2 border-black bg-gradient-to-br from-purple-500 to-cyan-500"
                    />
                  ))}
                </div>
                <span>Trusted by 50+ Nigerian Businesses</span>
              </div>
              <div className="hidden items-center gap-2 md:flex">
                <div className="h-4 w-px bg-gray-700" />
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>2-4 Week Delivery</span>
              </div>
              <div className="hidden items-center gap-2 md:flex">
                <div className="h-4 w-px bg-gray-700" />
                <Shield className="h-4 w-4 text-cyan-500" />
                <span>Enterprise-Grade Code</span>
              </div>
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

      {/* TRUST LOGOS */}
      <TrustLogos />
    </>
  );
}

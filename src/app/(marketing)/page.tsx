'use client';

import { AnimatedBackground } from '@/components/ui/animated-background';
import { AnimatedLogo } from '@/components/ui/animated-logo';
import { ServiceIconsGrid } from '@/components/ui/service-icons';
import { TrustLogos } from '@/components/ui/trust-logos';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* Animated Background */}
      <AnimatedBackground />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <AnimatedLogo />
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">AI</span>
            <br />
            Get Hired in Nigeria
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Learn practical AI skills from industry experts. Join 500+ Nigerian professionals building the future.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/academy/courses">
              <Button className="px-8 py-6 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-lg hover:scale-105 transition-transform shadow-lg shadow-cyan-500/50">
                Explore Courses
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="px-8 py-6 border-cyan-500/50 text-cyan-400 font-bold rounded-lg hover:bg-cyan-500/10 transition-colors"
              >
                Contact Sales
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="grid grid-cols-3 gap-8 mb-16 text-center">
            <div>
              <p className="text-3xl font-bold text-cyan-400">500+</p>
              <p className="text-gray-400 text-sm">Students Enrolled</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-cyan-400">50+</p>
              <p className="text-gray-400 text-sm">Courses Available</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-cyan-400">4.8★</p>
              <p className="text-gray-400 text-sm">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-4 text-center">Our Services</h2>
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

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  MessageSquare,
  Globe,
  Zap,
  CheckCircle2,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="w-full overflow-hidden bg-[#050508] text-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] w-full flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/10 blur-[128px] animate-pulse" />
          <div
            className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-purple-600/10 blur-[128px] animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/5 border border-cyan-500/20 mx-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-medium text-cyan-400 tracking-wide uppercase">
              Accepting New Enterprise Clients
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Stop Losing Customers on{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
              WhatsApp
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            We Build AI Chatbots That Answer Questions, Book Appointments & Boost Your Sales{" "}
            <br className="hidden md:block" />
            <span className="text-white">
              – In Weeks.
            </span>
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 pt-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-500" /> Enterprise quality, technical founder speed
            <span className="mx-2">•</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-500" /> Delivered in 2-4 weeks
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/free-audit">
              <Button
                size="lg"
                className="h-12 px-8 text-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 border-0"
              >
                Book Your Free Audit
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/case-studies">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-lg border-gray-700 text-gray-300 hover:bg-white/5 hover:text-white backdrop-blur-sm"
              >
                See Our Work
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid (Glassmorphic) */}
      <section className="relative z-20 -mt-20 px-4 pb-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Service 1 */}
          <Card className="bg-[#0A0A0F]/80 backdrop-blur-xl border-gray-800 hover:border-cyan-500/50 transition-all duration-300 group">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-green-500" />
              </div>
              <CardTitle className="text-xl text-white">
                AI-Powered Chatbots
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400 text-sm">
                Auto-reply to leads instantly on WhatsApp & Web. Book
                appointments and capture data without lifting a finger.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> 24/7
                  Customer Support
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Infinite
                  Scalability
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Service 2 */}
          <Card className="bg-[#0A0A0F]/80 backdrop-blur-xl border-gray-800 hover:border-purple-500/50 transition-all duration-300 group">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-purple-500" />
              </div>
              <CardTitle className="text-xl text-white">
                Next.js Websites
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400 text-sm">
                Blazing fast, SEO-optimized business platforms. Built on the
                same tech stack as Netflix and Uber.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500" /> Perfect
                  Google Scores
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500" /> Secure
                  Payments
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Service 3 */}
          <Card className="bg-[#0A0A0F]/80 backdrop-blur-xl border-gray-800 hover:border-blue-500/50 transition-all duration-300 group">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
              <CardTitle className="text-xl text-white">
                Process Automation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400 text-sm">
                Connect your tools. Automatically send invoices, update
                spreadsheets, and notify team members.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" /> Eliminate
                  Data Entry
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" /> Error-Free
                  Operations
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Metrics / Trust */}
      <section className="py-20 border-t border-gray-900 bg-[#020203]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-800">
            <div className="p-4">
              <div className="flex items-center justify-center gap-2 text-4xl font-bold text-white mb-2">
                <TrendingUp className="w-8 h-8 text-green-500" /> 900+
              </div>
              <p className="text-gray-400">Client Revenue Generated</p>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-center gap-2 text-4xl font-bold text-white mb-2">
                <Clock className="w-8 h-8 text-cyan-500" /> 15k+
              </div>
              <p className="text-gray-400">Hours Saved Annually</p>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-center gap-2 text-4xl font-bold text-white mb-2">
                <MessageSquare className="w-8 h-8 text-purple-500" /> 95%
              </div>
              <p className="text-gray-400">Automated Response Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Stop Leaving Money on the Table.
          </h2>
          <p className="text-xl text-gray-400">
            Get a free 30-minute breakdown of your business processes. We'll
            show you exactly where AI can save you money.
          </p>
          <Link href="/free-audit">
            <Button
              size="lg"
              className="h-14 px-10 text-xl bg-white text-black hover:bg-gray-200 border-0 mt-4 rounded-full"
            >
              Get Your Free Audit
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}

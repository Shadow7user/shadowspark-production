import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Globe,
  MessageSquare,
  Smartphone,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  return (
    <main className="w-full min-h-screen bg-[#050508] text-white pt-24 pb-20">
      {/* Header */}
      <section className="text-center px-4 mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Automate. Scale. <span className="text-cyan-500">Dominate.</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Choose the solution that fits your business stage. From startups to
          enterprise operations.
        </p>
      </section>

      {/* Service Cards */}
      <section className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 lg:grid-cols-4 gap-8 mb-24">
        {/* Chatbots */}
        <Card className="bg-[#0A0A0F] border-gray-800 flex flex-col hover:border-green-500/50 transition-all duration-300">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-white">AI Chatbots</CardTitle>
            <p className="text-gray-400">
              24/7 WhatsApp customer support agent.
            </p>
          </CardHeader>
          <CardContent className="flex-1 space-y-6">
            <div className="text-3xl font-bold text-white">
              ₦350k - ₦600k
              <span className="text-sm font-normal text-gray-500 block">
                One-time setup fee
              </span>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-green-500" /> Auto-replies
                to FAQs
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-green-500" /> Appointment
                Booking
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-green-500" /> Lead
                Qualification
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Clock className="w-5 h-5 text-gray-500" /> Delivery: 10-14 days
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/free-audit" className="w-full">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Get Free Audit
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Websites */}
        <Card className="bg-[#0A0A0F] border-gray-800 flex flex-col hover:border-purple-500/50 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-purple-600 text-xs font-bold px-3 py-1 rounded-bl-lg text-white">
            POPULAR
          </div>
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-purple-500" />
            </div>
            <CardTitle className="text-2xl text-white">
              Next.js Websites
            </CardTitle>
            <p className="text-gray-400">High-performance custom platforms.</p>
          </CardHeader>
          <CardContent className="flex-1 space-y-6">
            <div className="text-3xl font-bold text-white">
              ₦450k+
              <span className="text-sm font-normal text-gray-500 block">
                Starting base price
              </span>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-purple-500" /> SEO
                Optimized (Google #1)
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-purple-500" /> Mobile
                Responsive
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-purple-500" /> Paystack
                Integrated
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Clock className="w-5 h-5 text-gray-500" /> Delivery: 2-3 weeks
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/free-audit" className="w-full">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Start Project
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Automation */}
        <Card className="bg-[#0A0A0F] border-gray-800 flex flex-col hover:border-blue-500/50 transition-all duration-300">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-500" />
            </div>
            <CardTitle className="text-2xl text-white">
              Process Automation
            </CardTitle>
            <p className="text-gray-400">
              Eliminate manual data entry forever.
            </p>
          </CardHeader>
          <CardContent className="flex-1 space-y-6">
            <div className="text-3xl font-bold text-white">
              Custom Quote
              <span className="text-sm font-normal text-gray-500 block">
                Based on complexity
              </span>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-blue-500" /> Google Sheets
                Sync
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-blue-500" /> CRM Updates
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />{" "}
                Auto-Invoicing
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Clock className="w-5 h-5 text-gray-500" /> Delivery: 3-5 days
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/free-audit" className="w-full">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Request Quote
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Mobile & System Apps */}
        <Card className="bg-[#0A0A0F] border-gray-800 flex flex-col hover:border-orange-500/50 transition-all duration-300">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-orange-500" />
            </div>
            <CardTitle className="text-2xl text-white">
              Mobile & System Apps
            </CardTitle>
            <p className="text-gray-400">
              Native iOS, Android, Windows, and macOS applications
            </p>
          </CardHeader>
          <CardContent className="flex-1 space-y-6">
            <div className="text-3xl font-bold text-white">
              ₦800k - ₦5M
              <span className="text-sm font-normal text-gray-500 block">
                Based on complexity
              </span>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-orange-500" /> React
                Native/Flutter
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-orange-500" /> Native
                Swift/Kotlin
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-orange-500" /> Electron
                desktop apps
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Clock className="w-5 h-5 text-gray-500" /> Delivery: 3-6 weeks
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/services/apps" className="w-full">
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                Learn More
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </section>

      {/* Comparison Table */}
      <section className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Compare Features
        </h2>
        <div className="overflow-x-auto rounded-xl border border-gray-800 bg-[#0A0A0F]/50">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="p-6 text-gray-400 font-medium">Feature</th>
                <th className="p-6 text-white font-bold">Chatbots</th>
                <th className="p-6 text-white font-bold">Websites</th>
                <th className="p-6 text-white font-bold">Automation</th>
                <th className="p-6 text-white font-bold">Apps</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              <tr>
                <td className="p-6 text-gray-300">AI Integration</td>
                <td className="p-6">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                </td>
                <td className="p-6">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                </td>
                <td className="p-6">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                </td>
                <td className="p-6">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                </td>
              </tr>
              <tr>
                <td className="p-6 text-gray-300">Mobile Ready</td>
                <td className="p-6">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                </td>
                <td className="p-6">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                </td>
                <td className="p-6 text-gray-600">—</td>
                <td className="p-6">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                </td>
              </tr>
              <tr>
                <td className="p-6 text-gray-300">Paystack Payments</td>
                <td className="p-6">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                </td>
                <td className="p-6">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                </td>
                <td className="p-6 text-gray-600">—</td>
                <td className="p-6">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                </td>
              </tr>
              <tr>
                <td className="p-6 text-gray-300">Admin Dashboard</td>
                <td className="p-6 text-gray-600">—</td>
                <td className="p-6 text-gray-600">—</td>
                <td className="p-6">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                </td>
                <td className="p-6">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                </td>
              </tr>
              <tr>
                <td className="p-6 text-gray-300">Human Handover</td>
                <td className="p-6">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                </td>
                <td className="p-6 text-gray-600">—</td>
                <td className="p-6 text-gray-600">—</td>
                <td className="p-6 text-gray-600">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-24 text-center px-4">
        <p className="text-gray-400 mb-6">Not sure what you need?</p>
        <Link href="/contact">
          <Button variant="link" className="text-white underline text-lg">
            Talk to a human <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </section>
    </main>
  );
}

import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  MessageSquare,
  Calendar,
  Zap,
  ArrowRight,
  Shield,
} from "lucide-react";
import Link from "next/link";

export default function WhatsAppAIPage() {
  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-950/50 px-4 py-2 text-sm text-purple-400">
              <MessageSquare className="h-4 w-4" />
              Service 1 of 3
            </div>
            <h1 className="mt-4 text-4xl font-bold md:text-5xl">
              AI-Powered WhatsApp Business Suite
            </h1>
            <p className="mt-4 text-xl text-gray-400">
              Turn WhatsApp from a cost center into your 24/7 sales engine.
              Automated customer support, lead qualification, and appointment
              booking.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-8">
                <h2 className="mb-6 text-2xl font-bold">What We Deliver</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {[
                    "Custom-trained AI for your business",
                    "Multi-language (English, Pidgin)",
                    "Payment reminder automation",
                    "Lead scoring & CRM integration",
                    "24/7 availability analytics",
                    "Two-week deployment",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-6">
                <h3 className="mb-4 text-lg font-semibold">
                  Pricing & Timeline
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">Investment</div>
                    <div className="text-2xl font-bold">
                      ₦450,000 - ₦850,000
                    </div>
                    <div className="text-sm text-gray-400">
                      One-time project fee
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Delivery Time</div>
                    <div className="text-xl font-bold text-cyan-400">
                      10-14 Business Days
                    </div>
                  </div>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600"
                  >
                    <Link href="/free-audit">
                      Start with Free Audit
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

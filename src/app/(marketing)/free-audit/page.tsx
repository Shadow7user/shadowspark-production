"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  Zap,
  MessageSquare,
  Globe,
  BarChart,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function FreeAuditPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In production, connect to your backend
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-4">
        <Card className="w-full max-w-md border-green-500/30 bg-gradient-to-br from-gray-900 to-black">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="mb-4 text-2xl font-bold">Audit Request Received!</h2>
            <p className="mb-6 text-gray-400">
              We've received your request for a free AI Automation Audit. Our
              team will contact you within 24 hours to schedule your 30-minute
              strategy session.
            </p>
            <Button
              asChild
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600"
            >
              <Link href="/">
                <ArrowRight className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-900/50 to-cyan-900/50 px-4 py-2 text-sm font-medium">
                  <Zap className="h-4 w-4" />
                  LIMITED TIME OFFER
                </div>
                <h1 className="mt-4 text-4xl font-bold md:text-5xl">
                  Free AI Automation Audit
                  <span className="block text-2xl text-gray-400">
                    For Nigerian Business Owners
                  </span>
                </h1>
                <p className="mt-4 text-xl text-gray-400">
                  Get a 30-minute strategy session with our AI architects. We'll
                  analyze your business and show you exactly where automation
                  can save time and boost revenue.
                </p>
              </div>

              <div className="mb-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-green-500/20 p-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">What You Get</h3>
                    <p className="text-gray-400">
                      A customized automation roadmap with specific tools and
                      timeline.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-cyan-500/20 p-2">
                    <CheckCircle className="h-5 w-5 text-cyan-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">No Commitment</h3>
                    <p className="text-gray-400">
                      This is a free consultation. No pressure to buy anything.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-purple-500/20 p-2">
                    <CheckCircle className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">30 Minutes</h3>
                    <p className="text-gray-400">
                      That's all it takes to see how AI can transform your
                      business.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/50 to-black/50 p-6">
                <h3 className="mb-4 text-lg font-semibold">Who This Is For</h3>
                <div className="grid gap-4">
                  {[
                    "Business owners wasting hours on customer support",
                    "Companies with manual processes slowing growth",
                    "Teams overwhelmed by repetitive tasks",
                    "Businesses ready to scale but limited by operations",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-black">
                <CardHeader>
                  <CardTitle>Request Your Free Audit</CardTitle>
                  <CardDescription>
                    Fill out this form and we'll contact you within 24 hours to
                    schedule.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="John Okoro"
                          className="mt-2 border-gray-700 bg-gray-900"
                        />
                      </div>
                      <div>
                        <Label htmlFor="business">Business Name</Label>
                        <Input
                          id="business"
                          placeholder="Okoro Enterprises"
                          className="mt-2 border-gray-700 bg-gray-900"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Business Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@okoroenterprises.com"
                          className="mt-2 border-gray-700 bg-gray-900"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">WhatsApp Number</Label>
                        <Input
                          id="phone"
                          placeholder="+234 80X XXX XXXX"
                          className="mt-2 border-gray-700 bg-gray-900"
                        />
                      </div>
                      <div>
                        <Label htmlFor="challenge">
                          What's your biggest business challenge right now?
                        </Label>
                        <Textarea
                          id="challenge"
                          placeholder="e.g., We're missing customer messages, manual processes are slowing us down, our website isn't generating leads..."
                          className="mt-2 min-h-[120px] border-gray-700 bg-gray-900"
                        />
                      </div>
                      <div>
                        <Label htmlFor="service">
                          Which service interests you most?
                        </Label>
                        <select
                          id="service"
                          className="mt-2 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white"
                        >
                          <option value="">Select an option</option>
                          <option value="whatsapp">WhatsApp AI Suite</option>
                          <option value="website">
                            Next.js Business Platform
                          </option>
                          <option value="automation">Process Automation</option>
                          <option value="not-sure">
                            Not Sure - Need Advice
                          </option>
                        </select>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-cyan-600"
                    >
                      <Zap className="mr-2 h-5 w-5" />
                      Request Free AI Audit
                    </Button>
                    <p className="text-center text-xs text-gray-500">
                      By submitting, you agree to our 30-minute consultation. No
                      spam, ever.
                    </p>
                  </form>
                </CardContent>
              </Card>

              <div className="mt-8 text-center text-sm text-gray-500">
                <p>Already know what you need?</p>
                <Button asChild variant="link" className="text-cyan-400">
                  <Link href="/contact">
                    Contact us directly for a custom quote →
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

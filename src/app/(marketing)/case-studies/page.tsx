import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  BarChart,
  MessageSquare,
  Globe,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

const caseStudies = [
  {
    company: "Nna's Kitchen",
    industry: "Food & Restaurant",
    location: "Port Harcourt",
    challenge:
      "Missing 70+ customer WhatsApp messages daily, losing orders and frustrating customers.",
    solution:
      "Deployed a custom WhatsApp AI Chatbot in 10 days that handles menu inquiries, order-taking, and payment confirmations 24/7.",
    results: [
      { label: "Messages Automated", value: "95%" },
      { label: "Additional Monthly Sales", value: "₦280,000" },
      { label: "Owner Time Saved", value: "15 hrs/week" },
    ],
    icon: MessageSquare,
    service: "WhatsApp AI Suite",
    duration: "10 days",
  },
  {
    company: "Swift Logistics NG",
    industry: "Logistics",
    location: "Lagos",
    challenge:
      "Drivers wasting 3+ hours daily on manual route planning and customer calls.",
    solution:
      "Custom route optimization dashboard with automated customer notifications via WhatsApp.",
    results: [
      { label: "Route Efficiency", value: "+40%" },
      { label: "Fuel Cost Reduction", value: "₦120,000/month" },
      { label: "Customer Complaints", value: "-70%" },
    ],
    icon: BarChart,
    service: "Automation Dashboard",
    duration: "3 weeks",
  },
  {
    company: "Abuja Legal Partners",
    industry: "Professional Services",
    location: "Abuja",
    challenge:
      "Outdated website generating zero leads, poor mobile experience.",
    solution:
      "Next.js corporate platform with client portal, document management, and appointment booking.",
    results: [
      { label: "Website Performance", value: "98/100" },
      { label: "Monthly Leads", value: "+45" },
      { label: "Mobile Traffic", value: "+300%" },
    ],
    icon: Globe,
    service: "Next.js Platform",
    duration: "4 weeks",
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold md:text-5xl">
              Real Results for
              <span className="block bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Nigerian Businesses
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-400">
              Don't take our word for it. See how we've helped businesses like
              yours grow with AI and automation.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {caseStudies.map((study) => (
              <Card
                key={study.company}
                className="group border-gray-800 bg-gray-900/50 backdrop-blur-sm transition-all hover:border-purple-500/30"
              >
                <CardHeader>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-gradient-to-br from-purple-900/50 to-cyan-900/50 p-2">
                        <study.icon className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">
                          {study.industry}
                        </span>
                        <div className="text-sm text-cyan-400">
                          {study.location}
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full bg-gray-800 px-3 py-1 text-xs font-medium">
                      {study.duration}
                    </span>
                  </div>
                  <CardTitle className="text-2xl">{study.company}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {study.service}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="mb-2 font-semibold text-gray-300">
                      The Challenge
                    </h4>
                    <p className="text-sm text-gray-400">{study.challenge}</p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-gray-300">
                      Our Solution
                    </h4>
                    <p className="text-sm text-gray-400">{study.solution}</p>
                  </div>
                  <div className="rounded-lg border border-gray-800 bg-black/50 p-4">
                    <h4 className="mb-3 font-semibold text-gray-300">
                      The Results
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      {study.results.map((result) => (
                        <div key={result.label} className="text-center">
                          <div className="text-lg font-bold text-white">
                            {result.value}
                          </div>
                          <div className="text-xs text-gray-500">
                            {result.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mx-auto mt-16 max-w-3xl rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold">
              Ready for Your Success Story?
            </h2>
            <p className="mb-6 text-gray-400">
              Book a free 30-minute AI Automation Audit. We'll analyze your
              business and show you exactly what we can automate.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-cyan-600"
            >
              <Link href="/free-audit">
                <Zap className="mr-2 h-5 w-5" />
                Get Your Free Audit
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, X, Zap, MessageSquare, Globe, BarChart } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "WhatsApp AI Suite",
    price: "₦450K - ₦850K",
    description: "AI-powered customer support & sales automation",
    icon: MessageSquare,
    features: [
      "Custom AI Training",
      "WhatsApp/Instagram Integration",
      "24/7 Automated Responses",
      "Lead Qualification Logic",
      "Appointment Booking System",
      "Basic Analytics Dashboard",
    ],
    notIncluded: ["CRM Customization", "Advanced AI Models", "Phone Support"],
    cta: "Get WhatsApp AI Audit",
    color: "border-purple-500/30",
    popular: true,
  },
  {
    name: "Next.js Business Platform",
    price: "₦500K - ₦1.2M",
    description: "High-performance website or e-commerce store",
    icon: Globe,
    features: [
      "Next.js 15 + TypeScript",
      "Paystack Payment Integration",
      "Admin Content Dashboard",
      "SEO Optimization",
      "Mobile-First Responsive",
      "1 Year Technical Support",
    ],
    notIncluded: [
      "Complex E-commerce",
      "Custom API Development",
      "Enterprise SLA",
    ],
    cta: "Discuss Your Platform",
    color: "border-cyan-500/30",
    popular: false,
  },
  {
    name: "Automation Dashboard",
    price: "₦750K - ₦1.5M",
    description: "Business process automation + analytics",
    icon: BarChart,
    features: [
      "Custom Process Automation",
      "Real-time Analytics Dashboard",
      "API Integrations",
      "Automated Reporting",
      "Role-Based Access Control",
      "Monthly Analytics Review",
    ],
    notIncluded: [
      "Data Migration",
      "Legacy System Integration",
      "24/7 Monitoring",
    ],
    cta: "Automate Your Process",
    color: "border-green-500/30",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container px-4">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-4xl font-bold md:text-5xl">
            Transparent Pricing for
            <span className="block bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Predictable Results
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-400">
            Fixed project pricing. No hourly billing. No surprises. Everything
            included.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative border-2 bg-gray-900/50 backdrop-blur-sm ${plan.color} ${plan.popular ? "scale-105 shadow-2xl shadow-purple-500/10" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-1 text-sm font-bold">
                  MOST POPULAR
                </div>
              )}
              <CardHeader>
                <div
                  className={`mb-4 inline-flex rounded-lg bg-gradient-to-r ${plan.color.replace("border-", "from-").replace("/30", "")} p-3`}
                >
                  <plan.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-gray-400">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-500"> one-time</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-gray-300">
                    INCLUDED:
                  </div>
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}

                  <div className="pt-4 text-sm font-semibold text-gray-300">
                    NOT INCLUDED:
                  </div>
                  {plan.notIncluded.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-gray-500"
                    >
                      <X className="h-5 w-5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-gray-900 to-black hover:from-purple-900 hover:to-gray-900"
                >
                  <Link href="/free-audit">
                    <Zap className="mr-2 h-5 w-5" />
                    {plan.cta}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mx-auto mt-20 max-w-3xl rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/50 to-black/50 p-8">
          <h2 className="mb-4 text-2xl font-bold">How Our Process Works</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { step: "1", title: "Free Audit", desc: "30-min strategy call" },
              {
                step: "2",
                title: "Proposal",
                desc: "Fixed price, clear scope",
              },
              { step: "3", title: "Build", desc: "2-4 week development" },
              { step: "4", title: "Launch", desc: "Deploy & train your team" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 text-lg font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

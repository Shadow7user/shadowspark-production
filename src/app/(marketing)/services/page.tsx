import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  MessageSquare,
  Globe,
  Zap,
  ArrowRight,
  BarChart,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    slug: "whatsapp-ai",
    title: "AI-Powered WhatsApp Business Suite",
    description:
      "Intelligent chatbots for sales & support on WhatsApp/Instagram. Automate replies, booking, and lead capture 24/7.",
    price: "₦450K - ₦850K",
    delivery: "10-14 days",
    features: [
      "24/7 Automated Customer Support",
      "Lead Qualification & Capture",
      "Appointment Booking System",
      "Multi-language Support (English, Pidgin)",
      "Integration with your CRM",
    ],
    icon: MessageSquare,
    cta: "Get WhatsApp AI Audit",
    color: "from-purple-600 to-pink-600",
  },
  {
    slug: "nextjs-platform",
    title: "Next.js Business Platform",
    description:
      "High-performance corporate websites & e-commerce stores. Built with Next.js 15, optimized for Nigerian networks.",
    price: "₦500K - ₦1.2M",
    delivery: "3-4 weeks",
    features: [
      "Blazing Fast Performance (90+ Lighthouse)",
      "Integrated Paystack Payment",
      "Mobile-First Responsive Design",
      "SEO Optimized for Nigerian Search",
      "Admin Dashboard for Content",
    ],
    icon: Globe,
    cta: "Discuss Your Platform",
    color: "from-cyan-600 to-blue-600",
  },
  {
    slug: "automation-dashboard",
    title: "Process Automation & Dashboard",
    description:
      "Custom tools that automate manual business processes with real-time data dashboards.",
    price: "₦750K - ₦1.5M",
    delivery: "3-4 weeks",
    features: [
      "Custom Business Logic Automation",
      "Real-time Analytics Dashboard",
      "Automated Report Generation",
      "API Integrations (WhatsApp, Google Sheets, etc.)",
      "Role-Based Access Control",
    ],
    icon: BarChart,
    cta: "Automate Your Process",
    color: "from-green-600 to-emerald-600",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container px-4">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Services Built for
            <span className="block bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Nigerian Business Growth
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            We deliver enterprise-grade AI solutions in weeks, not months. Fixed
            pricing. Clear timelines. Real results.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service) => (
            <Card
              key={service.slug}
              className="group border-gray-800 bg-gray-900/50 backdrop-blur-sm transition-all hover:border-purple-500/50 hover:bg-gray-900"
            >
              <CardHeader>
                <div
                  className={`mb-4 inline-flex rounded-lg bg-gradient-to-r ${service.color} p-3`}
                >
                  <service.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl">{service.title}</CardTitle>
                <CardDescription className="mt-2 text-gray-400">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Investment</span>
                    <span className="text-xl font-bold text-white">
                      {service.price}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Delivery Time</span>
                    <span className="rounded-full bg-gray-800 px-3 py-1 text-sm font-medium text-cyan-400">
                      {service.delivery}
                    </span>
                  </div>
                </div>

                <div className="mb-8 space-y-3">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-gray-900 to-black group-hover:from-purple-900 group-hover:to-gray-900"
                >
                  <Link href={`/services/${service.slug}`}>
                    {service.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mx-auto mt-20 max-w-3xl rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">Not Sure What You Need?</h2>
          <p className="mb-6 text-gray-400">
            Book a free 30-minute AI Automation Audit. We'll analyze your
            business and recommend the highest-impact solution.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-cyan-600"
          >
            <Link href="/free-audit">
              <Zap className="mr-2 h-5 w-5" />
              Get Free AI Audit
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

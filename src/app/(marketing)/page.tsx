import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    title: "Web Development",
    description: "Modern, responsive websites and web applications built with cutting-edge technologies.",
    icon: "🌐",
  },
  {
    title: "AI Chatbots",
    description: "Intelligent conversational agents that automate customer support and engagement.",
    icon: "🤖",
  },
  {
    title: "UI/UX Design",
    description: "Beautiful, intuitive interfaces that delight users and drive conversions.",
    icon: "🎨",
  },
  {
    title: "SEO & Marketing",
    description: "Data-driven strategies to increase visibility and grow your online presence.",
    icon: "📈",
  },
  {
    title: "AI Academy",
    description: "Learn AI prompting, automation, and emerging technologies from industry experts.",
    icon: "🎓",
  },
  {
    title: "Consulting",
    description: "Strategic guidance to help your business leverage technology for growth.",
    icon: "💡",
  },
];

const stats = [
  { value: "50+", label: "Projects" },
  { value: "500+", label: "Students" },
  { value: "98%", label: "Satisfaction" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Transform Your Business
          </span>
          <br />
          <span className="text-foreground">With AI-Powered Solutions</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          AI-powered solutions for Nigerian businesses. We build intelligent systems, 
          stunning websites, and train the next generation of tech professionals.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" asChild>
            <Link href="/contact">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/courses">View Courses</Link>
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Our Services</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          From web development to AI solutions, we provide comprehensive digital services 
          tailored to your business needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-4xl mb-2">{service.icon}</div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-muted-foreground mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Let&apos;s discuss how we can help transform your business with modern technology solutions.
        </p>
        <Button size="lg" asChild>
          <Link href="/contact">Start Your Project</Link>
        </Button>
      </section>
    </div>
  );
}

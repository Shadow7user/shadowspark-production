import { ServiceCard } from '@/components/marketing/ServiceCard';
import { Brain, MessageSquare, Zap, Users, Plug, PenTool, Cog } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      title: 'AI Training Solutions',
      description: 'Custom AI training for Nigerian businesses. From basic prompt engineering to full model fine-tuning.',
      icon: <Brain className="h-6 w-6" />,
      startingPrice: 150000,
      features: [
        'Custom AI model training',
        'Prompt engineering workshops',
        'Team certification',
        'Ongoing support',
      ],
      popular: true,
    },
    {
      title: 'Custom Chatbot Development',
      description: 'AI-powered chatbots that understand your customers. 24/7 automated support in English, Hausa, Yoruba & Igbo.',
      icon: <MessageSquare className="h-6 w-6" />,
      startingPrice: 250000,
      features: [
        'Multi-language support',
        'Integration with CRM',
        'Custom training on your data',
        'Analytics dashboard',
      ],
    },
    {
      title: 'Prompt Engineering Consulting',
      description: 'Unlock ChatGPT, Claude & Gemini potential. Expert guidance to maximize AI productivity for your team.',
      icon: <Zap className="h-6 w-6" />,
      startingPrice: 100000,
      features: [
        'Advanced prompt strategies',
        'API optimization',
        'Cost reduction planning',
        'Team workshops',
      ],
    },
    {
      title: 'Team Training & Workshops',
      description: 'Upskill your team with hands-on AI training. Certification programs for professionals at all levels.',
      icon: <Users className="h-6 w-6" />,
      startingPrice: 200000,
      features: [
        'Beginner to advanced tracks',
        'Industry-specific modules',
        'Certification included',
        'Post-training support',
      ],
    },
    {
      title: 'API Integration Services',
      description: 'Seamlessly integrate AI APIs into your existing systems. Custom implementations for any tech stack.',
      icon: <Plug className="h-6 w-6" />,
      startingPrice: 350000,
      features: [
        'API setup & configuration',
        'Secure authentication',
        'Rate limiting & monitoring',
        'Technical documentation',
      ],
    },
    {
      title: 'Content Creation & Prompting',
      description: 'AI-assisted content creation for marketing, social media & blogs. SEO-optimized at scale.',
      icon: <PenTool className="h-6 w-6" />,
      startingPrice: 120000,
      features: [
        'Bulk content generation',
        'Brand voice training',
        'SEO optimization',
        'Monthly reporting',
      ],
    },
    {
      title: 'Enterprise Solutions',
      description: 'Dedicated support for large-scale AI deployments. Custom architecture and infrastructure management.',
      icon: <Cog className="h-6 w-6" />,
      startingPrice: 500000,
      features: [
        'Dedicated account manager',
        'Custom SLA',
        '24/7 priority support',
        'Quarterly strategy reviews',
      ],
      ctaText: 'Request Quote',
    },
  ];

  return (
    <main className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="space-y-6 mb-16">
          <div className="space-y-3">
            <h1 className="text-5xl md:text-6xl font-bold">
              Our <span className="gradient-text">Services</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Comprehensive AI solutions tailored for Nigerian businesses. From training to deployment, we've got you covered.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
          {services.map((service, idx) => (
            <ServiceCard
              key={idx}
              title={service.title}
              description={service.description}
              icon={service.icon}
              startingPrice={service.startingPrice}
              features={service.features}
              ctaText={service.ctaText}
              popular={service.popular}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center space-y-6 py-12 px-8 rounded-xl bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 border border-cyber-cyan/20">
          <h2 className="text-3xl font-bold">
            Don't see what you need?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We offer custom solutions tailored to your specific requirements. Get in touch with our team for a free consultation.
          </p>
          <a href="/contact">
            <button className="px-8 py-3 rounded-lg bg-cyber-cyan hover:bg-cyber-cyan/80 text-background font-semibold transition-all">
              Schedule Consultation
            </button>
          </a>
        </div>
      </div>
    </main>
  );
}

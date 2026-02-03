'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  MessageSquare, 
  Globe, 
  Zap, 
  Smartphone, 
  Apple, 
  BarChart2, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react'
import Link from 'next/link'

const services = [
  {
    id: 1,
    icon: MessageSquare,
    iconColor: 'from-green-500 to-emerald-600',
    category: 'AI Chatbots',
    title: 'WhatsApp & Instagram Bots',
    description: 'Automated 24/7 customer support that handles FAQs, takes orders, and qualifies leads without human input.',
    stats: [
      { label: 'Response Time', value: '< 3 sec' },
      { label: 'Queries Handled', value: '70%' },
      { label: 'Staff Time Saved', value: '15 hrs/wk' }
    ],
    pricing: '₦350K - ₦600K',
    timeline: '2-3 weeks',
    cta: '/services/whatsapp-ai'
  },
  {
    id: 2,
    icon: Globe,
    iconColor: 'from-purple-500 to-violet-600',
    category: 'Web Development',
    title: 'Custom Business Websites',
    description: 'Fast, mobile-first websites optimized for Nigerian connectivity. SEO-ready, conversion-focused design.',
    stats: [
      { label: 'Load Time', value: '< 2 sec' },
      { label: 'Lighthouse Score', value: '>90' },
      { label: 'Mobile Optimized', value: '100%' }
    ],
    pricing: '₦500K - ₦1.2M',
    timeline: '3-4 weeks',
    cta: '/services'
  },
  {
    id: 3,
    icon: Zap,
    iconColor: 'from-cyan-500 to-blue-600',
    category: 'Automation',
    title: 'Business Process Automation',
    description: 'Connect your tools. Automate repetitive tasks. Reduce human error and scale operations instantly.',
    stats: [
      { label: 'Tasks Automated', value: '80%' },
      { label: 'Error Rate', value: '< 0.1%' },
      { label: 'ROI', value: '3x in 60 days' }
    ],
    pricing: '₦800K - ₦2M',
    timeline: '2-4 weeks',
    cta: '/services'
  },
  {
    id: 4,
    icon: Smartphone,
    iconColor: 'from-orange-500 to-red-500',
    category: 'Mobile Apps',
    title: 'Android & Cross-Platform',
    description: 'React Native apps that work on Android and iOS. Native performance, single codebase, fast delivery.',
    stats: [
      { label: 'Platform', value: 'Android + iOS' },
      { label: 'App Store Rating', value: '4.8+' },
      { label: 'Delivery', value: '4-6 weeks' }
    ],
    pricing: '₦800K - ₦4M',
    timeline: '4-6 weeks',
    cta: '/services/apps'
  },
  {
    id: 5,
    icon: Apple,
    iconColor: 'from-gray-400 to-gray-600',
    category: 'iOS Development',
    title: 'Native iPhone & iPad Apps',
    description: 'Pure Swift iOS apps built for App Store launch. Optimized UI, App Store optimization included.',
    stats: [
      { label: 'Platform', value: 'iOS Native' },
      { label: 'Swift', value: 'Latest' },
      { label: 'App Store', value: 'Launch Support' }
    ],
    pricing: '₦1.2M - ₦5M',
    timeline: '4-8 weeks',
    cta: '/services/apps'
  },
  {
    id: 6,
    icon: BarChart2,
    iconColor: 'from-pink-500 to-rose-600',
    category: 'SEO & Marketing',
    title: 'Google Ranking & Growth',
    description: 'Full-stack SEO: technical audit, content strategy, backlinks, and monthly ranking reports.',
    stats: [
      { label: 'Organic Traffic', value: '+200%' },
      { label: 'Ranking Time', value: '60-90 days' },
      { label: 'Keywords Tracked', value: '50+' }
    ],
    pricing: '₦60K - ₦150K/mo',
    timeline: 'Ongoing',
    cta: '/services'
  }
]

export function ServiceCarousel() {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right'>('right')

  const next = useCallback(() => {
    if (isAnimating) return
    setDirection('right')
    setIsAnimating(true)
    setTimeout(() => {
      setCurrent(prev => (prev + 1) % services.length)
      setIsAnimating(false)
    }, 300)
  }, [isAnimating])

  const prev = useCallback(() => {
    if (isAnimating) return
    setDirection('left')
    setIsAnimating(true)
    setTimeout(() => {
      setCurrent(prev => (prev - 1 + services.length) % services.length)
      setIsAnimating(false)
    }, 300)
  }, [isAnimating])

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  const service = services[current]
  const Icon = service.icon

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">What We Build</h2>
          <p className="text-muted-foreground">
            Full-stack solutions for Nigerian businesses
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Main Card */}
          <div 
            className={`
              border rounded-2xl p-8 md:p-12 bg-card
              transition-all duration-300 ease-out
              ${isAnimating 
                ? direction === 'right' 
                  ? '-translate-x-4 opacity-0' 
                  : 'translate-x-4 opacity-0' 
                : 'translate-x-0 opacity-100'
              }
            `}
          >
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Content */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${service.iconColor} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">
                      {service.category}
                    </div>
                    <h3 className="text-2xl font-bold">{service.title}</h3>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>

                <div className="flex gap-6">
                  <div>
                    <div className="text-xs text-muted-foreground">Pricing</div>
                    <div className="text-lg font-bold text-cyan-400">
                      {service.pricing}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Timeline</div>
                    <div className="text-lg font-bold text-purple-400">
                      {service.timeline}
                    </div>
                  </div>
                </div>

                <Link 
                  href={service.cta}
                  className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold text-sm hover:scale-105 transition"
                >
                  Learn More →
                </Link>
              </div>

              {/* Right: Stats */}
              <div className="space-y-4">
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Key Metrics
                </div>
                {service.stats.map((stat, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  >
                    <span className="text-muted-foreground">{stat.label}</span>
                    <span className="font-bold text-cyan-400">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={prev}
            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-card border rounded-full flex items-center justify-center hover:bg-muted transition shadow-lg"
            aria-label="Previous service"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={next}
            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-card border rounded-full flex items-center justify-center hover:bg-muted transition shadow-lg"
            aria-label="Next service"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots + Service Icons */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {services.map((s, i) => {
            const DotIcon = s.icon
            return (
              <button 
                key={i} 
                onClick={() => {
                  if (i !== current) {
                    setDirection(i > current ? 'right' : 'left')
                    setIsAnimating(true)
                    setTimeout(() => {
                      setCurrent(i)
                      setIsAnimating(false)
                    }, 300)
                  }
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
                  ${i === current 
                    ? `bg-gradient-to-br ${s.iconColor} text-white scale-110` 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                aria-label={`View ${s.category}`}
              >
                <DotIcon className="w-4 h-4" />
              </button>
            )
          })}
        </div>

        {/* Progress Bar */}
        <div className="max-w-xs mx-auto mt-4">
          <div className="h-0.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${((current + 1) / services.length) * 100}%` }}
            />
          </div>
          <p className="text-center text-xs text-muted-foreground mt-2">
            {current + 1} of {services.length} services
          </p>
        </div>
      </div>
    </section>
  )
}

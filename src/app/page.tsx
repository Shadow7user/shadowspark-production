import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Zap, Brain, MessageSquare, Users, Plug } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="w-full overflow-hidden bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-gradient-to-br from-cyber-cyan/20 to-transparent blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-gradient-to-bl from-cyber-purple/20 to-transparent blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-cyber-cyan/10 to-cyber-purple/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl w-full space-y-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/50">
                <Zap className="w-4 h-4 text-cyber-cyan" />
                <span className="text-sm font-medium text-cyber-cyan">AI-Powered Solutions in Nigeria</span>
              </div>

              {/* Headline */}
              <div className="space-y-3">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Power Your <span className="gradient-text">Business</span> with AI-First Solutions
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Web Development • AI Chatbots • Prompt Engineering • Team Training • Enterprise Integration
                </p>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-cyber-cyan/30 border border-cyber-cyan/50" />
                  <div className="w-6 h-6 rounded-full bg-cyber-purple/30 border border-cyber-purple/50" />
                  <div className="w-6 h-6 rounded-full bg-green-500/30 border border-green-500/50" />
                </div>
                <span>Trusted in Port Harcourt & Lagos</span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-6">
                <Link href="/contact">
                  <Button size="lg" className="bg-cyber-cyan hover:bg-cyber-cyan/80 text-background font-semibold group">
                    Start Your Project
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" variant="outline" className="border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan/10">
                    View Services
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-cyber-cyan/20">
                <div>
                  <div className="text-2xl font-bold text-cyber-cyan">50+</div>
                  <p className="text-sm text-muted-foreground">Projects Delivered</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyber-cyan">₦100M+</div>
                  <p className="text-sm text-muted-foreground">Client Revenue Growth</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyber-cyan">200+</div>
                  <p className="text-sm text-muted-foreground">Students Trained</p>
                </div>
              </div>
            </div>

            {/* Right: Feature Cards */}
            <div className="relative h-full min-h-96">
              <div className="absolute inset-0 grid gap-4 auto-rows-max">
                {/* Card 1 */}
                <Card className="border-cyber-cyan/30 bg-card/40 backdrop-blur border-cyberpunk hover:border-cyber-cyan/60 transition-all hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-1">
                  <CardContent className="p-4 flex items-start gap-3">
                    <Brain className="w-6 h-6 text-cyber-cyan flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground">AI-Powered</h3>
                      <p className="text-sm text-muted-foreground">Enterprise-grade AI solutions tailored for Nigerian businesses</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 2 */}
                <Card className="border-cyber-cyan/30 bg-card/40 backdrop-blur border-cyberpunk hover:border-cyber-cyan/60 transition-all hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-1">
                  <CardContent className="p-4 flex items-start gap-3">
                    <MessageSquare className="w-6 h-6 text-cyber-purple flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground">Intelligent Chatbots</h3>
                      <p className="text-sm text-muted-foreground">24/7 customer support with natural language understanding</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 3 */}
                <Card className="border-cyber-cyan/30 bg-card/40 backdrop-blur border-cyberpunk hover:border-cyber-cyan/60 transition-all hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-1">
                  <CardContent className="p-4 flex items-start gap-3">
                    <Users className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground">Team Training</h3>
                      <p className="text-sm text-muted-foreground">Upskill your team with AI and prompt engineering expertise</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 4 */}
                <Card className="border-cyber-cyan/30 bg-card/40 backdrop-blur border-cyberpunk hover:border-cyber-cyan/60 transition-all hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-1">
                  <CardContent className="p-4 flex items-start gap-3">
                    <Plug className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground">API Integration</h3>
                      <p className="text-sm text-muted-foreground">Seamless integration with your existing business systems</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Pricing Teaser */}
          <div className="mt-16 grid md:grid-cols-3 gap-4">
            <Card className="border-cyber-cyan/20 bg-card/20 backdrop-blur">
              <CardContent className="p-6 space-y-2">
                <h3 className="font-semibold text-foreground">Starter</h3>
                <div className="text-2xl font-bold text-cyber-cyan">₦100K</div>
                <p className="text-sm text-muted-foreground">Setup & consultation</p>
              </CardContent>
            </Card>
            <Card className="border-cyber-cyan/30 bg-card/40 backdrop-blur border-cyberpunk">
              <CardContent className="p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Professional</h3>
                  <span className="text-xs font-bold text-cyber-cyan bg-cyber-cyan/10 px-2 py-1 rounded">POPULAR</span>
                </div>
                <div className="text-2xl font-bold text-cyber-cyan">₦500K</div>
                <p className="text-sm text-muted-foreground">Custom development included</p>
              </CardContent>
            </Card>
            <Card className="border-cyber-cyan/20 bg-card/20 backdrop-blur">
              <CardContent className="p-6 space-y-2">
                <h3 className="font-semibold text-foreground">Enterprise</h3>
                <div className="text-2xl font-bold text-cyber-cyan">Custom</div>
                <p className="text-sm text-muted-foreground">Full-scale solutions</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="w-full bg-gradient-to-b from-transparent to-cyber-cyan/5 px-4 py-16">
        <div className="max-w-2xl mx-auto space-y-6 text-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Stay Updated</h2>
            <p className="text-muted-foreground">Get the latest on AI trends, our services, and exclusive offers</p>
          </div>

          {/* Newsletter Form Stub */}
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-background border border-cyber-cyan/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyber-cyan/60 transition-colors"
              aria-label="Email address"
            />
            <Button
              type="submit"
              className="bg-cyber-cyan hover:bg-cyber-cyan/80 text-background font-semibold"
            >
              Subscribe
            </Button>
          </form>

          <p className="text-xs text-muted-foreground">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="w-full px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">Ready to Transform Your Business?</h2>
          <p className="text-muted-foreground mb-6">Contact our team today for a free consultation</p>
          <Link href="/contact">
            <Button size="lg" className="bg-cyber-cyan hover:bg-cyber-cyan/80 text-background">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}

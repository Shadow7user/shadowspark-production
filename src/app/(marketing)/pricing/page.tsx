import { Check, X, Shield, Zap, Award, Globe, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="py-20 px-4 bg-background relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-cyan/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-cyber-purple/20 text-cyber-purple border-cyber-purple/50 hover:bg-cyber-purple/30">
            Official Certification
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold">
            Choose Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple">
              Path
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock industry-recognized credentials, build a portfolio that
            proves your skills, and launch your AI career.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Starter Tier */}
          <Card className="border-border/50 bg-card/50 backdrop-blur relative">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Starter</CardTitle>
              <CardDescription>For curious learners</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">Free</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-foreground/80">
                  <Check className="w-4 h-4 text-green-500" />
                  Access to Intro Courses
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground/80">
                  <Check className="w-4 h-4 text-green-500" />
                  Basic Community Access
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <X className="w-4 h-4 text-muted-foreground" />
                  No Verified Certificates
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <X className="w-4 h-4 text-muted-foreground" />
                  No Project Reviews
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/register">Start Learning</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Tier (Featured) */}
          <Card className="border-cyber-cyan bg-card/80 backdrop-blur relative shadow-lg shadow-cyber-cyan/20 transform md:-translate-y-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-cyber-cyan text-black font-bold border-none">
                MOST POPULAR
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-cyber-cyan">
                Pro Student
              </CardTitle>
              <CardDescription>For serious career switchers</CardDescription>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">₦15,000</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm font-medium">
                  <Shield className="w-4 h-4 text-cyber-cyan" />
                  Everything in Starter
                </li>
                <li className="flex items-center gap-2 text-sm font-medium">
                  <Award className="w-4 h-4 text-cyber-cyan" />
                  <span className="text-foreground">
                    Verifiable Certificates (LinkedIn Ready)
                  </span>
                </li>
                <li className="flex items-center gap-2 text-sm font-medium">
                  <Globe className="w-4 h-4 text-cyber-cyan" />
                  Use custom domain for Portfolio
                </li>
                <li className="flex items-center gap-2 text-sm font-medium">
                  <Rocket className="w-4 h-4 text-cyber-cyan" />
                  Priority Code Reviews
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-cyber-cyan text-black hover:bg-cyber-cyan/90 font-bold"
                asChild
              >
                <Link href="/register?plan=pro">Get Certified</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Lifetime Tier */}
          <Card className="border-border/50 bg-card/50 backdrop-blur relative">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-cyber-purple">
                Lifetime Access
              </CardTitle>
              <CardDescription>For dedicated professionals</CardDescription>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">₦150,000</span>
                <span className="text-muted-foreground">one-time</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-foreground/80">
                  <Zap className="w-4 h-4 text-cyber-purple" />
                  Lifetime access to all current + future courses
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground/80">
                  <Award className="w-4 h-4 text-cyber-purple" />
                  Unlimited Verifiable Certificates
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground/80">
                  <Check className="w-4 h-4 text-green-500" />
                  1-on-1 Mentorship Session
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground/80">
                  <Check className="w-4 h-4 text-green-500" />
                  Private Discord Channel
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full border-cyber-purple/50 text-cyber-purple hover:bg-cyber-purple/10"
                variant="outline"
                asChild
              >
                <Link href="/register?plan=lifetime">
                  Buy Once, Own Forever
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Value Prop Section */}
        <div className="mt-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Why Verification Matters?</h2>
            <p className="text-muted-foreground">
              In the AI era, proof of skill is everything. Our certificates are
              cryptographically unique and hosted on our permanent verification
              page.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded bg-cyber-cyan/10 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-cyber-cyan" />
                </div>
                <div>
                  <h3 className="font-bold">Instant Validation</h3>
                  <p className="text-sm text-muted-foreground">
                    Recruiters can verify your skills in one click.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded bg-cyber-purple/10 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-cyber-purple" />
                </div>
                <div>
                  <h3 className="font-bold">Social Sharing</h3>
                  <p className="text-sm text-muted-foreground">
                    Rich previews for LinkedIn & X (Twitter) to boost your
                    profile.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Visual placeholder for the certificate */}
          <div className="relative p-1 bg-gradient-to-br from-cyber-cyan to-cyber-purple rounded-lg rotate-2 hover:rotate-0 transition-all duration-500">
            <div className="bg-background rounded p-8 flex flex-col items-center justify-center h-64 text-center space-y-2 border border-border/50">
              <Award className="w-16 h-16 text-muted-foreground/30" />
              <p className="text-muted-foreground font-mono text-sm">
                Certificate Preview
              </p>
              <div className="text-xs text-muted-foreground/50 truncate max-w-xs">
                {`ID: 550e8400-e29b-41d4-a716-446655440000`}
              </div>
              <Button variant="ghost" className="text-xs mt-4 gap-2" size="sm">
                <Check className="w-3 h-3" /> Verified by ShadowSpark
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

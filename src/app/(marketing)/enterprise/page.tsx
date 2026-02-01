import { EnterpriseLeadForm } from "@/components/marketing/enterprise-lead-form";
import { TrustBadges } from "@/components/trust-badges";
import { Check, BarChart, GraduationCap, Zap } from "lucide-react";

export const metadata = {
  title: "Enterprise AI Training | ShadowSpark",
  description:
    "Corporate training solutions for Nigerian businesses. Upskill your team in Python, AI, and Web Development.",
};

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyber-cyan/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyber-purple/10 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Copy */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-purple/10 border border-cyber-purple/20 text-cyber-purple text-sm font-medium">
                <Zap className="w-4 h-4" />
                <span>Corporate Training Solutions</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Future-Proof Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple">
                  Workforce
                </span>
              </h1>

              <p className="text-xl text-muted-foreground">
                Equip your team with the AI and technical skills they need to
                drive innovation. Tailored curriculums, progress tracking, and
                verifiable results.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-green-500/10 flex items-center justify-center shrink-0 mt-1">
                    <BarChart className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold">Measurable ROI</h3>
                    <p className="text-sm text-muted-foreground">
                      Track employee progress and skill acquisition in
                      real-time.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center shrink-0 mt-1">
                    <GraduationCap className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold">Custom Curriculum</h3>
                    <p className="text-sm text-muted-foreground">
                      We adapt our courses to your industry (FinTech, Energy,
                      Retail).
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center shrink-0 mt-1">
                    <Check className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-bold">Certified Talent</h3>
                    <p className="text-sm text-muted-foreground">
                      Employees receive verifiable certificates upon completion.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Lead Form */}
            <div className="relative">
              <EnterpriseLeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* Trust/Social Proof */}
      <section className="border-t border-b bg-muted/20 py-12">
        <div className="container mx-auto px-4 text-center space-y-8">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Trusted by industry leaders
          </p>
          <TrustBadges />
        </div>
      </section>
    </div>
  );
}

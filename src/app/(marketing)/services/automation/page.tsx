import { BarChart3, Cog, RefreshCw } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Automation | Workflow Optimization | ShadowSpark",
  description:
    "Eliminate manual tasks with custom automation solutions. CRM integration, invoice automation, lead nurturing flows. Save 30+ hours per week.",
};

export default function AutomationPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-background to-cyan-900/20" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-400">
              Eliminate Manual Tasks Forever
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Custom automation solutions that save 30+ hours per week. CRM
              integration, invoice automation, lead nurturing flows. Your
              business runs itself.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://calendly.com/morontomornica7/audit"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-orange-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
              >
                Book Free Audit Call
              </a>
              <a
                href="/case-studies"
                className="px-8 py-4 border border-cyan-500/30 rounded-xl font-semibold hover:bg-cyan-500/10 transition-colors"
              >
                View Case Studies
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-cyan-400">30+</div>
              <div className="text-sm text-muted-foreground">
                Hours Saved/Week
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400">90%</div>
              <div className="text-sm text-muted-foreground">
                Error Reduction
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400">3-4 Weeks</div>
              <div className="text-sm text-muted-foreground">
                Implementation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            What&apos;s Included
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border border-border rounded-2xl bg-card/50 backdrop-blur">
              <Cog className="h-12 w-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                Workflow Automation
              </h3>
              <p className="text-muted-foreground">
                Zapier, Make.com, n8n integrations. Connect 500+ apps
                seamlessly.
              </p>
            </div>
            <div className="p-6 border border-border rounded-2xl bg-card/50 backdrop-blur">
              <RefreshCw className="h-12 w-12 text-orange-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">CRM Integration</h3>
              <p className="text-muted-foreground">
                HubSpot, Salesforce, Zoho. Auto-sync leads, deals, and customer
                data.
              </p>
            </div>
            <div className="p-6 border border-border rounded-2xl bg-card/50 backdrop-blur">
              <BarChart3 className="h-12 w-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                Reporting Automation
              </h3>
              <p className="text-muted-foreground">
                Auto-generated reports, dashboards, Slack/email notifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="p-8 border border-cyan-500/30 rounded-2xl bg-card/80 backdrop-blur">
            <div className="text-center mb-8">
              <div className="text-4xl font-bold mb-2">
                ₦800,000 - ₦2,000,000
              </div>
              <div className="text-muted-foreground">
                One-time setup + optional monthly support
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>Full workflow audit + optimization plan</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>10-20 custom automation flows</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>CRM + accounting software integration</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">
                  ✓
                </div>
                <span>Team training + documentation</span>
              </li>
            </ul>
            <a
              href="https://calendly.com/morontomornica7/audit"
              className="block w-full py-4 bg-gradient-to-r from-cyan-500 to-orange-500 text-white text-center rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              Book Free Audit Call
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Automate Your Business?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book a free 30-minute audit call. We&apos;ll map your current
            workflows and identify automation opportunities that save real time
            and money.
          </p>
          <a
            href="https://calendly.com/morontomornica7/audit"
            className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-orange-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
          >
            Book Free Audit Call
          </a>
        </div>
      </section>
    </div>
  );
}

import { ArrowRight, CalendarCheck, MessageSquare, BarChart2 } from "lucide-react";
import Link from "next/link";
import WhatsAppLink from "@/components/WhatsAppLink";

const steps = [
  {
    icon: MessageSquare,
    title: "30-min discovery call",
    body: "We understand your current workflow, your team size, and what you want to automate. No sales pressure — just a structured conversation.",
  },
  {
    icon: BarChart2,
    title: "Baseline audit",
    body: "We document exactly where your team's time is going. You receive a written summary of automation opportunities and projected time savings.",
  },
  {
    icon: CalendarCheck,
    title: "Live demo on your data",
    body: "We configure a working demo using your actual product, service, or FAQ content — so you see the result in your context, not a generic template.",
  },
];

export default function RequestDemoSection() {
  return (
    <section id="demo" className="bg-[#080d18] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_400px]">

          {/* Left — what happens */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#d4a843]">
              No commitment required
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Request a Demo
            </h2>
            <p className="mt-4 max-w-lg text-slate-400">
              We do not run generic product demos. Every demonstration is
              configured around your business — your product, your customer
              questions, your workflow. Here is what the process looks like.
            </p>

            <div className="mt-10 space-y-6">
              {steps.map(({ icon: Icon, title, body }, i) => (
                <div key={title} className="flex items-start gap-5">
                  <div className="flex flex-col items-center">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#d4a843]/10 text-[#d4a843]">
                      <Icon size={17} />
                    </div>
                    {i < steps.length - 1 && (
                      <div className="mt-2 h-full w-px bg-slate-800" style={{ minHeight: 24 }} />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — action card */}
          <div className="flex flex-col justify-center">
            <div className="rounded-2xl border border-slate-800 bg-[#0d1320] p-8">
              <h3 className="text-lg font-semibold text-white">
                Book your demo
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Choose how you would like to start. Both options are free and
                require no commitment.
              </p>

              <div className="mt-8 space-y-3">
                {/* WhatsApp CTA */}
                <WhatsAppLink
                  href="https://wa.me/2349037621612?text=Hi%2C%20I%27d%20like%20to%20request%20a%20demo%20of%20ShadowSpark"
                  source="request_demo_section"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.525 5.847L0 24l6.336-1.501A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.802 9.802 0 01-5.034-1.387l-.361-.214-3.74.885.934-3.617-.235-.374A9.786 9.786 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.431 0 9.818 4.388 9.818 9.818 0 5.431-4.387 9.818-9.818 9.818z"/>
                  </svg>
                  Message us on WhatsApp
                </WhatsAppLink>

                {/* Email / Contact CTA */}
                <Link
                  href="/contact"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3.5 text-sm font-semibold text-slate-300 transition-all hover:border-[#d4a843]/40 hover:text-[#d4a843]"
                >
                  Submit a contact form
                  <ArrowRight size={15} />
                </Link>
              </div>

              {/* Reassurances */}
              <ul className="mt-6 space-y-2 text-xs text-slate-600">
                <li>✓ No credit card required</li>
                <li>✓ Response within 1 business day</li>
                <li>✓ Demo scoped to your specific business</li>
                <li>✓ No obligation to proceed after demo</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

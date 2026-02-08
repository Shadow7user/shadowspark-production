import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FreeAIAuditSection() {
  return (
    <section className="py-20 bg-linear-to-b from-black to-gray-950">
      <div className="container mx-auto px-6 max-w-4xl text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-cyan-300">
          What Is the Free AI Audit?
        </h2>
        <p className="text-lg text-gray-300 leading-relaxed">
          Our Free AI Audit is a simple, no-cost 30-minute conversation (phone,
          video, or chat) where we act as your personal AI advisor — no
          technical knowledge needed from you.
        </p>
        <ul className="text-left space-y-4 text-gray-200 max-w-3xl mx-auto list-disc pl-6">
          <li>
            We start by listening: Tell us about your daily operations, customer
            touchpoints, tools you use, and biggest time sinks.
          </li>
          <li>
            We map opportunities: Show exactly where autonomous AI agents can
            step in — e.g., instantly replying to inquiries, automating
            approvals, updating records, or predicting needs — all securely and
            explainably.
          </li>
          <li>
            We explain in plain language: No jargon. We use real examples like
            "your team spends hours on repetitive emails — AI agents can handle
            95% automatically, freeing people for creative work."
          </li>
          <li>
            You get a clear takeaway: A short report with quick wins (start
            today), phased roadmap (3-12 months), estimated time/money saved,
            rough costs, and ROI potential — tailored to your business size and
            goals.
          </li>
        </ul>
        <p className="text-lg text-cyan-200 font-medium">
          It's 100% free and pressure-free — because seeing AI's real impact
          should be the first step for every forward-thinking leader.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/audit">Schedule Your Free Audit Now</Link>
        </Button>
      </div>
    </section>
  );
}

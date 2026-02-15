import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-gradient-to-b from-[#0a0f1a] to-[#0f1521] py-24">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          Ready to <span className="gradient-text">transform your business</span>?
        </h2>
        <p className="mt-6 text-lg text-slate-400">
          Join Nigerian businesses already using ShadowSpark to automate support,
          generate leads, and grow revenue with AI.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#d4a843] to-[#c0935a] px-8 py-4 text-lg font-semibold text-slate-900 shadow-lg shadow-[#d4a843]/15 transition-all hover:shadow-[#d4a843]/25 hover:from-[#e8c56d] hover:to-[#d4a843]"
          >
            Start Free Trial <ArrowRight size={20} />
          </Link>
          <a
            href="https://wa.me/2349037621612?text=Hi%2C%20I%27m%20interested%20in%20ShadowSpark"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-8 py-4 text-lg text-slate-300 transition-all hover:border-[#d4a843]/30 hover:text-white"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

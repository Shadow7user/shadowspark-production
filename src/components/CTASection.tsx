import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-gradient-to-b from-slate-950 to-slate-900 py-24">
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
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:from-cyan-600 hover:to-purple-700"
          >
            Start Free Trial <ArrowRight size={20} />
          </Link>
          <a
            href="https://wa.me/2349037621612?text=Hi%2C%20I%27m%20interested%20in%20ShadowSpark"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-8 py-4 text-lg text-slate-300 transition-all hover:border-cyan-500/50 hover:text-white"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

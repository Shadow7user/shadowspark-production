'use client';
import Link from "next/link";
import { usePageView } from "@/hooks/useAnalytics";

export default function HomePageClient() {
  usePageView("Homepage");

  return (
    <div className="w-full max-w-6xl mx-auto text-white font-sans selection:bg-cyan-500/30">
      <header className="text-center mb-20 mt-10">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-zinc-50 drop-shadow-sm">
          ShadowSpark Technologies
        </h1>
        <h2 className="text-2xl md:text-3xl text-cyan-400 font-semibold mb-6 tracking-wide drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
          Full-Stack AI & Web Development
        </h2>
        <p className="text-xl text-zinc-400 max-w-3xl mx-auto font-medium">
          We build business websites, custom apps, and AI automation.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {/* Launch Tier */}
        <div className="group border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-8 hover:border-cyan-500/50 hover:bg-zinc-900 transition-all duration-300">
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">Launch</h3>
          <p className="text-cyan-400 font-mono text-sm mb-6 pb-4 border-b border-zinc-800">₦30k/mo or ₦150k/yr</p>
          <ul className="text-zinc-400 text-sm space-y-3 font-medium">
            <li className="flex items-center gap-2"><span className="text-cyan-500">✓</span> Standard Chatbot</li>
            <li className="flex items-center gap-2"><span className="text-cyan-500">✓</span> Lead Capture</li>
            <li className="flex items-center gap-2"><span className="text-cyan-500">✓</span> Basic Analytics</li>
          </ul>
        </div>
        
        {/* Growth Tier */}
        <div className="group border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-8 hover:border-cyan-500/50 hover:bg-zinc-900 transition-all duration-300">
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">Growth</h3>
          <p className="text-cyan-400 font-mono text-sm mb-6 pb-4 border-b border-zinc-800">₦50k/mo or ₦300k/yr</p>
          <ul className="text-zinc-400 text-sm space-y-3 font-medium">
            <li className="flex items-center gap-2"><span className="text-cyan-500">✓</span> Advanced Chatbot</li>
            <li className="flex items-center gap-2"><span className="text-cyan-500">✓</span> CRM Integration</li>
            <li className="flex items-center gap-2"><span className="text-cyan-500">✓</span> Custom Workflows</li>
          </ul>
        </div>
        
        {/* Automation Tier */}
        <div className="group relative border border-cyan-500/30 bg-zinc-900 rounded-2xl p-8 hover:border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.05)] transition-all duration-300 transform md:-translate-y-2">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-500 text-zinc-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">Automation</h3>
          <p className="text-cyan-400 font-mono text-sm mb-6 pb-4 border-b border-zinc-800">₦85k/mo or ₦550k/yr</p>
          <ul className="text-zinc-300 text-sm space-y-3 font-medium">
            <li className="flex items-center gap-2"><span className="text-cyan-400 font-bold">✓</span> Full AI Automation</li>
            <li className="flex items-center gap-2"><span className="text-cyan-400 font-bold">✓</span> Omnichannel Support</li>
            <li className="flex items-center gap-2"><span className="text-cyan-400 font-bold">✓</span> Advanced Routing</li>
          </ul>
        </div>
        
        {/* Enterprise Tier */}
        <div className="group border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-8 hover:border-cyan-500/50 hover:bg-zinc-900 transition-all duration-300">
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">Enterprise Custom</h3>
          <p className="text-cyan-400 font-mono text-sm mb-6 pb-4 border-b border-zinc-800">₦150k+/mo</p>
          <ul className="text-zinc-400 text-sm space-y-3 font-medium">
            <li className="flex items-center gap-2"><span className="text-cyan-500">✓</span> Custom AI Training</li>
            <li className="flex items-center gap-2"><span className="text-cyan-500">✓</span> Dedicated Support</li>
            <li className="flex items-center gap-2"><span className="text-cyan-500">✓</span> SLA</li>
          </ul>
        </div>
      </div>

      <div className="relative bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-3xl p-10 md:p-14 text-center max-w-4xl mx-auto overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
        <div className="inline-block bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 px-4 py-1.5 rounded-full text-sm font-bold mb-6 tracking-wide animate-pulse">
          ₦1,000 Demo Fee (Credited to Your Plan)
        </div>
        <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Experience Your Future Operations</h3>
        <p className="text-zinc-300 mb-10 text-xl font-medium">
          Get a high-fidelity custom demo for <span className="text-cyan-400 font-bold bg-cyan-950/40 px-2 py-1 rounded">₦1,000</span> (Credited to your plan).
        </p>
        <Link 
          href="/checkout/new" 
          className="inline-flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-lg py-5 px-10 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300 transform hover:-translate-y-1"
        >
          Start Your Qualification Audit
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </Link>
      </div>
    </div>
  );
}

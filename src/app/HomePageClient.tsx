'use client';
import Link from "next/link";
import { usePageView } from "@/hooks/useAnalytics";

export default function HomePageClient() {
  usePageView("Homepage");

  return (
    <div className="w-full max-w-6xl mx-auto text-white font-sans selection:bg-[#00f2ff]/30">
      <header className="text-center mb-24 mt-12">
        <div className="inline-block mb-4 px-3 py-1 rounded-full border border-[#00f2ff]/30 bg-[#00f2ff]/10 text-[#00f2ff] text-sm font-semibold tracking-wide">
          ShadowSpark Technologies
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-zinc-50 drop-shadow-sm">
          Turn WhatsApp Conversations into <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] to-[#00f2ff]/60">Revenue</span>
        </h1>
        <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto font-medium leading-relaxed">
          Websites, Automation & AI Systems for Nigerian Businesses
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 max-w-5xl mx-auto">
        {/* Launch Tier */}
        <div className="group flex flex-col border border-zinc-800 bg-[#0a0a0a]/80 backdrop-blur-md rounded-3xl p-8 hover:border-[#00f2ff]/50 transition-all duration-300">
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#00f2ff] transition-colors">Launch</h3>
          <p className="text-[#00f2ff] font-mono text-sm mb-6 pb-6 border-b border-zinc-800">
            ₦30k/mo <span className="text-zinc-600">|</span> ₦150k/yr
          </p>
          <ul className="text-zinc-400 text-sm space-y-4 font-medium flex-1">
            <li className="flex items-start gap-3"><span className="text-[#00f2ff] mt-0.5">✓</span> Standard Chatbot</li>
            <li className="flex items-start gap-3"><span className="text-[#00f2ff] mt-0.5">✓</span> Lead Capture</li>
            <li className="flex items-start gap-3"><span className="text-[#00f2ff] mt-0.5">✓</span> Basic Analytics</li>
          </ul>
        </div>
        
        {/* Growth Tier */}
        <div className="group flex flex-col border border-[#00f2ff]/40 bg-[#0a0a0a] rounded-3xl p-8 shadow-[0_0_40px_rgba(0,242,255,0.08)] transform md:-translate-y-4 transition-all duration-300 relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00f2ff] text-[#050505] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(0,242,255,0.4)]">
            Recommended
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#00f2ff] transition-colors">Growth</h3>
          <p className="text-[#00f2ff] font-mono text-sm mb-6 pb-6 border-b border-zinc-800">
            ₦50k/mo <span className="text-zinc-600">|</span> ₦300k/yr
          </p>
          <ul className="text-zinc-300 text-sm space-y-4 font-medium flex-1">
            <li className="flex items-start gap-3"><span className="text-[#00f2ff] font-bold mt-0.5">✓</span> Advanced Chatbot</li>
            <li className="flex items-start gap-3"><span className="text-[#00f2ff] font-bold mt-0.5">✓</span> CRM Integration</li>
            <li className="flex items-start gap-3"><span className="text-[#00f2ff] font-bold mt-0.5">✓</span> Custom Workflows</li>
          </ul>
        </div>
        
        {/* Automation Tier */}
        <div className="group flex flex-col border border-zinc-800 bg-[#0a0a0a]/80 backdrop-blur-md rounded-3xl p-8 hover:border-[#00f2ff]/50 transition-all duration-300">
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#00f2ff] transition-colors">Automation</h3>
          <p className="text-[#00f2ff] font-mono text-sm mb-6 pb-6 border-b border-zinc-800">
            ₦85k/mo <span className="text-zinc-600">|</span> ₦550k/yr
          </p>
          <ul className="text-zinc-400 text-sm space-y-4 font-medium flex-1">
            <li className="flex items-start gap-3"><span className="text-[#00f2ff] mt-0.5">✓</span> Full AI Automation</li>
            <li className="flex items-start gap-3"><span className="text-[#00f2ff] mt-0.5">✓</span> Omnichannel Support</li>
            <li className="flex items-start gap-3"><span className="text-[#00f2ff] mt-0.5">✓</span> Advanced Routing</li>
          </ul>
        </div>
      </div>

      <div className="relative bg-[#0a0a0a] border border-zinc-800 rounded-[2.5rem] p-12 md:p-16 text-center max-w-4xl mx-auto overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00f2ff] to-transparent opacity-50"></div>
        
        <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
          Experience Your Future Operations
        </h3>
        
        <p className="text-zinc-400 mb-10 text-lg md:text-xl font-medium max-w-2xl mx-auto">
          Unlock your custom business demo for <span className="text-[#00f2ff] font-bold">₦1,000</span> (Credited to your plan).
        </p>
        
        <Link 
          href="/checkout/new" 
          className="inline-flex items-center justify-center bg-[#00f2ff] hover:bg-[#00d0eb] text-[#050505] font-extrabold text-lg md:text-xl py-5 px-10 rounded-2xl shadow-[0_0_20px_rgba(0,242,255,0.3)] hover:shadow-[0_0_35px_rgba(0,242,255,0.6)] transition-all duration-300 transform hover:-translate-y-1"
        >
          Start Your Qualification Audit
          <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

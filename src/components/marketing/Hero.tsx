"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CinematicBackground } from "@/components/ui/CinematicBackground";

export default function Hero() {
  return (
    <CinematicBackground className="flex min-h-[90vh] flex-col items-center justify-center border-b border-white/5">
      <section className="relative w-full py-20 md:py-32 flex flex-col items-center text-center px-6 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 text-[10px] sm:text-xs font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(0,229,255,0.15)] backdrop-blur-md">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse" />
            Autonomous Revenue Infrastructure
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-cyan-500 drop-shadow-[0_0_40px_rgba(0,229,255,0.1)]">
            Build Once.<br />Sell Forever.
          </h1>
          
          <p className="text-zinc-400 text-lg md:text-2xl font-medium max-w-3xl mx-auto mb-12 leading-relaxed">
            Businesses lose 40-70% of leads to slow response. ShadowSpark closes that gap with autonomous infrastructure.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button size="lg" className="h-16 px-10 text-lg rounded-xl font-extrabold group bg-[#00E5FF] text-black hover:bg-cyan-200 shadow-[0_0_30px_rgba(0,229,255,0.3)] transition-all" asChild>
              <Link href="/checkout/new" className="flex items-center gap-3">
                Deploy System <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Link 
              href="https://wa.me/2349000000000" 
              target="_blank"
              className="flex items-center gap-2 text-zinc-400 hover:text-white font-mono text-sm tracking-widest transition-colors uppercase"
            >
              <MessageCircle className="w-5 h-5 text-cyan-500" /> Chat on WhatsApp
            </Link>
          </div>
        </div>
      </section>
    </CinematicBackground>
  );
}

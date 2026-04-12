"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./button";

export default function HeroVoid() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for the lag effect (Sentient Orb)
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    setMounted(true);
    // Center initially
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="relative w-full h-[90vh] bg-[#000000] overflow-hidden flex items-center justify-center border-b border-zinc-900">
      {/* Sentient Orb - Only render on client to prevent hydration mismatch */}
      {mounted && (
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none opacity-30 blur-[100px]"
          style={{
            background: "radial-gradient(circle, #00FFFF 0%, transparent 70%)",
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
            top: 0,
            left: 0,
          }}
        />
      )}

      {/* Grid overlay for depth */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center flex flex-col items-center px-6 max-w-5xl">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#00FFFF]/30 bg-[#00FFFF]/10 text-[#00FFFF] text-xs font-bold tracking-widest uppercase">
          System Online
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-[#00FFFF]">
          Intelligence for the<br />Sovereign Founder.
        </h1>
        
        <p className="text-zinc-400 text-lg md:text-2xl font-medium max-w-3xl mb-12 leading-relaxed">
          Deploy high-performance, AI-driven architectures. Turn operations into absolute precision.
        </p>

        {/* Liquid Cyan Button */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00FFFF] to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500 group-hover:duration-200"></div>
          <Button 
            size="lg" 
            className="relative h-16 px-10 text-lg rounded-xl bg-black border border-[#00FFFF]/50 text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black transition-all duration-300 font-extrabold tracking-wide" 
            asChild
          >
            <Link href="/checkout/new">
              Initialize Operations
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

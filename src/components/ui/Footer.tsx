import { Globe, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950/50 border-t border-white/10 mt-20 py-8">
      <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
        <p className="text-sm text-slate-400">
          © 2026 ShadowSpark Autonomous Revenue Infrastructure
        </p>
        <div className="flex items-center gap-6">
          <Link href="#" className="text-slate-400 hover:text-cyan-300 transition-colors hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">
            <Globe size={20} />
            <span className="sr-only">Website</span>
          </Link>
          <Link href="#" className="text-slate-400 hover:text-cyan-300 transition-colors hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">
            <MessageCircle size={20} />
            <span className="sr-only">WhatsApp</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}

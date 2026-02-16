import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0f1a] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <Link href="/" className="text-xl font-bold gradient-text">ShadowSpark</Link>
            <p className="mt-1 text-sm text-slate-500">AI-powered solutions for Nigerian businesses</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <a href="/#features" className="hover:text-[#d4a843] transition-colors">Features</a>
            <Link href="/pricing" className="hover:text-[#d4a843] transition-colors">Pricing</Link>
            <Link href="/portfolio" className="hover:text-[#d4a843] transition-colors">Portfolio</Link>
            <Link href="/about" className="hover:text-[#d4a843] transition-colors">About</Link>
            <Link href="/blog" className="hover:text-[#d4a843] transition-colors">Blog</Link>
            <Link href="/security" className="hover:text-[#d4a843] transition-colors">Security</Link>
            <Link href="/login" className="hover:text-[#d4a843] transition-colors">Sign In</Link>
          </div>
        </div>
        <div className="mt-8 border-t border-white/5 pt-6 text-center text-xs text-slate-600">
          &copy; {new Date().getFullYear()} ShadowSpark Technologies. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

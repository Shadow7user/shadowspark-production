import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <Link href="/" className="text-xl font-bold gradient-text">ShadowSpark</Link>
            <p className="mt-1 text-sm text-slate-500">AI-powered solutions for Nigerian businesses</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <a href="/#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <Link href="/pricing" className="hover:text-cyan-400 transition-colors">Pricing</Link>
            <Link href="/about" className="hover:text-cyan-400 transition-colors">About</Link>
            <Link href="/blog" className="hover:text-cyan-400 transition-colors">Blog</Link>
            <Link href="/login" className="hover:text-cyan-400 transition-colors">Sign In</Link>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-xs text-slate-600">
          &copy; {new Date().getFullYear()} ShadowSpark Technologies. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

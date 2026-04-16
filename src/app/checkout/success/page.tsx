import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
      <section className="max-w-md w-full rounded-[2.5rem] border border-zinc-800 bg-zinc-950/90 p-10 text-center shadow-[0_0_80px_rgba(0,229,255,0.1)]">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-400 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,255,255,0.4)]">
          <span className="text-black font-black text-3xl">✓</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-4">Payment Verified</h1>
        <p className="text-zinc-400 mb-10 leading-relaxed">
          Your tailored demo environment is now active. The ShadowSpark system has registered your access.
        </p>
        <Link 
          href="/"
          className="inline-flex w-full items-center justify-center rounded-full bg-[#00E5FF] px-6 py-4 text-lg font-bold text-black transition hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,255,255,0.3)]"
        >
          Return to Hub
        </Link>
      </section>
    </main>
  );
}

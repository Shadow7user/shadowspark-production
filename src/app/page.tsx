import { Suspense } from "react";
import HomePageClient from "./HomePageClient";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24 bg-[#050505] font-sans">
      <Suspense fallback={<div className="text-[#00f2ff] font-mono animate-pulse">Loading ShadowSpark Core...</div>}>
        <HomePageClient />
      </Suspense>
    </main>
  );
}

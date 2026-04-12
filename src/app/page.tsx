import { Suspense } from "react";
import HomePageClient from "@/components/HomePageClient";

export default function Home() {
  return (
    <main className="bg-[#0A0A0A]">
      <Suspense fallback={<div className="text-cyan-500 font-mono animate-pulse">Loading ShadowSpark Core...</div>}>
        <HomePageClient />
      </Suspense>
    </main>
  );
}

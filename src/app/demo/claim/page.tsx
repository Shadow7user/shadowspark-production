import { Suspense } from "react";
import ClaimPageContent from "./ClaimPageContent";

export default function ClaimPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050508] flex items-center justify-center text-white">Loading...</div>}>
      <ClaimPageContent />
    </Suspense>
  );
}

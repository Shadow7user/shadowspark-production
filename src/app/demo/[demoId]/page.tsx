import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ChatWidget from "@/components/ChatWidget";

export default async function DemoRenderer({ params }: { params: { demoId: string } }) {
  const lead = await prisma.lead.findUnique({
    where: { id: params.demoId }
  });

  if (!lead || !lead.demoApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center p-10 text-center dark:text-white">
        <div>
          <h1 className="text-2xl font-bold mb-2">Demo Not Available</h1>
          <p className="text-zinc-500">This demo is either pending approval or does not exist.</p>
        </div>
      </div>
    );
  }

  const audit = lead.miniAuditData as any;
  const companyName = audit?.companyName || "Your Company";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <h1 className="text-3xl font-bold mb-4 dark:text-white">{companyName} - ShadowSpark Demo</h1>
      <p className="mb-8 text-zinc-600 dark:text-zinc-400">Interact with the ShadowSpark Assistant widget in the bottom right corner.</p>
      <ChatWidget />
    </div>
  );
}

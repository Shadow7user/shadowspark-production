"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { updateLeadOperatorStatus, generateLeadPaymentLink } from "@/app/actions/operator-actions";

type LeadWithParsedMetadata = {
  id: string;
  phoneNumber: string;
  intent: string | null;
  status: string;
  leadScore: number | null;
  lastMessage: string | null;
  nextFollowUpAt: Date | null;
  metadataParsed: {
    operatorStatus?: string | null | undefined;
    paymentStatus?: string | null | undefined;
    paymentPlan?: string | null | undefined;
    paymentAmount?: number | null | undefined;
    paymentLink?: string | null | undefined;
    [key: string]: unknown;
  };
};

type Props = {
  leads: LeadWithParsedMetadata[];
};

export function LeadListClient({ leads }: Props) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  async function handleStatusUpdate(id: string, status: string) {
    setLoadingAction(`${id}-status`);
    try {
      await updateLeadOperatorStatus(id, status);
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleGenerateLink(id: string) {
    const amountStr = prompt("Enter payment amount (in NGN):", "25000");
    if (!amountStr) return;
    const amount = Number(amountStr);
    if (isNaN(amount) || amount <= 0) return alert("Invalid amount");

    const planName = prompt("Enter plan name/description:", "ShadowSpark Starter Plan");
    if (!planName) return;

    setLoadingAction(`${id}-payment`);
    try {
      await generateLeadPaymentLink(id, amount, planName);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to generate payment link");
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {leads.map(lead => {
        const meta = lead.metadataParsed;
        const isEscalated = lead.status === "QUALIFIED";
        const hasPayment = meta.paymentStatus && meta.paymentStatus !== "none";
        const isPaid = meta.paymentStatus === "paid" || lead.status === "WON";

        return (
          <Card key={lead.id} className={`flex flex-col depth-card transition-all duration-300 ${isPaid ? 'border-green-500/50 bg-green-500/5 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : isEscalated ? 'border-destructive/40 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : (lead.leadScore ?? 0) > 75 ? 'border-primary/40 glow-cyan' : 'hover:border-primary/20 hover:shadow-[0_0_15px_rgba(0,255,213,0.1)]'}`}>
            <CardHeader className="pb-3 border-b border-white/5">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg tracking-tight font-mono text-white">{lead.phoneNumber}</CardTitle>
                <div className="flex gap-2">
                  {isPaid && <Badge className="bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30">Paid</Badge>}
                  {isEscalated && !isPaid && <Badge className="bg-destructive/20 text-destructive border border-destructive/50 hover:bg-destructive/30">Escalated</Badge>}
                </div>
              </div>
              <div className="text-sm text-muted flex gap-4 mt-2">
                <span className="flex items-center gap-1">Intent: <span className="font-medium text-white">{lead.intent || "unknown"}</span></span>
                <span className="flex items-center gap-1">Score: <span className={`font-bold ${(lead.leadScore ?? 0) > 75 ? 'text-primary drop-shadow-[0_0_5px_rgba(0,255,213,0.8)]' : 'text-white'}`}>{lead.leadScore ?? 0}</span></span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 py-4">
              <p className="text-sm bg-black/40 p-3 rounded-lg italic line-clamp-3 text-muted border border-white/5 relative">
                <span className="absolute top-2 left-2 text-primary opacity-20 text-2xl leading-none">&quot;</span>
                <span className="pl-4">{lead.lastMessage || 'No message recorded'}</span>
              </p>
              
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="font-medium text-muted">Next Follow-up</span>
                  <span className="text-white font-mono text-xs">
                    {lead.nextFollowUpAt ? new Date(lead.nextFollowUpAt).toLocaleString() : "None"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-muted">Operator Status</span>
                  <Badge variant="outline" className="border-secondary/50 text-secondary bg-secondary/5">{meta.operatorStatus || "new"}</Badge>
                </div>
                
                {hasPayment && (
                  <div className="bg-secondary/5 p-4 rounded-lg border border-secondary/20 mt-4 space-y-2 shadow-[inset_0_0_15px_rgba(189,0,255,0.05)]">
                    <div className="flex justify-between">
                      <strong className="text-muted">Plan:</strong> <span className="text-white">{meta.paymentPlan as string}</span>
                    </div>
                    <div className="flex justify-between">
                      <strong className="text-muted">Amount:</strong> <span className="text-white font-mono">₦{meta.paymentAmount as number}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-white/5">
                      <strong className="text-muted">Status:</strong> 
                      <span className={`text-xs px-2 py-1 rounded-sm border ${meta.paymentStatus === 'paid' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'}`}>
                        {meta.paymentStatus as string}
                      </span>
                    </div>
                    {meta.paymentLink && (
                      <div className="mt-3 flex gap-2">
                        <input 
                          type="text" 
                          value={meta.paymentLink as string} 
                          readOnly 
                          className="w-full text-xs bg-black/50 text-muted px-3 py-2 border border-white/10 rounded-md focus:outline-none focus:border-primary" 
                          onClick={(e) => (e.target as HTMLInputElement).select()}
                        />
                        <Button size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(meta.paymentLink as string)}>
                          Copy
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2 p-4 border-t border-white/5 bg-black/20">
              <Button size="sm" variant="outline" disabled={!!loadingAction || isPaid} onClick={() => handleStatusUpdate(lead.id, "contacted")}>
                Contacted
              </Button>
              <Button size="sm" variant="outline" disabled={!!loadingAction || isPaid} onClick={() => handleStatusUpdate(lead.id, "closed_won")}>
                Won
              </Button>
              {!hasPayment && (
                <Button size="sm" variant="default" className="ml-auto bg-primary text-black hover:bg-primary/90" disabled={!!loadingAction || isPaid} onClick={() => handleGenerateLink(lead.id)}>
                  Payment Link
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
      {leads.length === 0 && (
        <div className="col-span-full py-10 text-center text-muted-foreground">
          No leads found matching the criteria.
        </div>
      )}
    </div>
  );
}

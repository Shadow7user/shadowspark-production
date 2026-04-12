"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { updateLeadOperatorStatus, approveDemo } from "@/app/actions/operator-actions";

type LeadWithParsedMetadata = {
  id: string;
  phoneNumber: string;
  intent: string | null;
  status: string;
  leadScore: number | null;
  lastMessage: string | null;
  nextFollowUpAt: Date | null;
  termsAccepted: boolean;
  demoApproved: boolean;
  paymentRef: string | null;
  metadataParsed: any;
};

export function LeadListClient({ leads }: { leads: LeadWithParsedMetadata[] }) {
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

  async function handleApproveDemo(id: string) {
    setLoadingAction(`${id}-approve`);
    try {
      await approveDemo(id);
    } catch (err) {
      console.error(err);
      alert("Failed to approve demo");
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {leads.map(lead => {
        const isEscalated = lead.status === "QUALIFIED";
        const hasPaymentRef = !!lead.paymentRef;
        const isPaid = lead.demoApproved || lead.status === "WON";

        return (
          <Card key={lead.id} className="flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 overflow-hidden">
            <CardHeader className="p-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-mono dark:text-white">{lead.phoneNumber}</CardTitle>
                <div className="flex gap-2">
                  {lead.demoApproved && <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Demo Approved</Badge>}
                  {!lead.demoApproved && hasPaymentRef && <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Payment Pending</Badge>}
                  {isEscalated && !isPaid && <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Escalated</Badge>}
                </div>
              </div>
              <div className="text-sm text-zinc-500 mt-2 flex gap-4">
                <span>Intent: {lead.intent || "unknown"}</span>
                <span>Score: {lead.leadScore ?? 0}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-4">
              <p className="text-sm bg-zinc-50 dark:bg-black p-3 rounded italic text-zinc-600 dark:text-zinc-400">
                "{lead.lastMessage || '}No message recorded{'}"
              </p>
              <div className="mt-4 space-y-2 text-sm dark:text-zinc-300">
                <div className="flex justify-between">
                  <span className="font-medium">Terms Accepted</span>
                  <span>{lead.termsAccepted ? "Yes" : "No"}</span>
                </div>
                {hasPaymentRef && (
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="font-medium">Payment Ref</span>
                    <span className="text-xs truncate w-32 ml-2" title={lead.paymentRef!}>{lead.paymentRef}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2 p-4 bg-zinc-50 dark:bg-black/50 border-t border-zinc-100 dark:border-zinc-800">
              <Button size="sm" className="bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white" disabled={!!loadingAction} onClick={() => handleStatusUpdate(lead.id, "contacted")}>Contacted</Button>
              <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700 ml-auto" disabled={!!loadingAction || lead.demoApproved} onClick={() => handleApproveDemo(lead.id)}>
                {lead.demoApproved ? "Approved" : "Approve Demo"}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
      {leads.length === 0 && <div className="col-span-full py-10 text-center">No leads found.</div>}
    </div>
  );
}

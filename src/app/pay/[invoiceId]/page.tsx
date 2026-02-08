import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import {
  AlertTriangle,
  Building,
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ invoiceId: string }>;
}

export default async function PayInvoicePage({ params }: PageProps) {
  const { invoiceId } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      prospect: true,
      proposal: true,
    },
  });

  if (!invoice) {
    notFound();
  }

  const isPaid = invoice.paymentStatus === "paid";
  const isOverdue = new Date() > invoice.dueDate && !isPaid;

  // Format currency
  const formatNaira = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              ShadowSpark
            </span>
          </Link>
          <Badge variant="outline" className="text-sm">
            Invoice Portal
          </Badge>
        </div>
      </header>

      <main className="container max-w-2xl py-12 space-y-8">
        {/* Status Banner */}
        {isPaid ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <div>
              <p className="font-semibold text-green-600">Payment Received</p>
              <p className="text-sm text-muted-foreground">
                Paid on{" "}
                {invoice.paidAt?.toLocaleDateString("en-NG", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        ) : isOverdue ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <div>
              <p className="font-semibold text-red-600">Payment Overdue</p>
              <p className="text-sm text-muted-foreground">
                This invoice was due on{" "}
                {invoice.dueDate.toLocaleDateString("en-NG")}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-center gap-3">
            <Clock className="h-6 w-6 text-yellow-500" />
            <div>
              <p className="font-semibold text-yellow-600">Payment Pending</p>
              <p className="text-sm text-muted-foreground">
                Due by{" "}
                {invoice.dueDate.toLocaleDateString("en-NG", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        )}

        {/* Invoice Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">
                  {invoice.invoiceNumber}
                </CardTitle>
                <CardDescription>
                  Issued on {invoice.createdAt.toLocaleDateString("en-NG")}
                </CardDescription>
              </div>
              <Badge
                variant={
                  isPaid ? "default" : isOverdue ? "destructive" : "secondary"
                }
              >
                {isPaid ? "Paid" : isOverdue ? "Overdue" : "Pending"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bill To */}
            <div className="flex items-start gap-3">
              <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Bill To</p>
                <p className="font-semibold">{invoice.prospect.company}</p>
                <p className="text-sm">{invoice.prospect.name}</p>
                <p className="text-sm text-muted-foreground">
                  {invoice.prospect.email}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{invoice.description}</p>
              </div>
            </div>

            {/* Proposal Details (if linked) */}
            {invoice.proposal && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-semibold">
                  {invoice.proposal.title}
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Timeline: {invoice.proposal.timeline}</p>
                  <p>Deliverables:</p>
                  <ul className="list-disc list-inside pl-2 space-y-0.5">
                    {invoice.proposal.deliverables.slice(0, 3).map((d, i) => (
                      <li key={i} className="text-xs">
                        {d}
                      </li>
                    ))}
                    {invoice.proposal.deliverables.length > 3 && (
                      <li className="text-xs text-muted-foreground">
                        +{invoice.proposal.deliverables.length - 3} more...
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Amount */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  {formatNaira(invoice.amount)}
                </span>
              </div>
            </div>

            {/* Pay Button */}
            {!isPaid && invoice.paymentUrl && (
              <a
                href={invoice.paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="w-full gap-2 text-lg py-6">
                  Pay Now with Paystack
                  <ExternalLink className="h-5 w-5" />
                </Button>
              </a>
            )}

            {isPaid && (
              <div className="text-center text-muted-foreground">
                <p>Thank you for your payment!</p>
                <p className="text-sm">
                  A receipt has been sent to {invoice.prospect.email}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Questions about this invoice? Contact us at{" "}
              <a
                href="mailto:architect@shadowspark-technologies.com"
                className="text-primary hover:underline"
              >
                architect@shadowspark-technologies.com
              </a>{" "}
              or WhatsApp{" "}
              <a
                href="https://wa.me/2348000000000"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                +234 800 000 0000
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground">
          <p>ShadowSpark Technologies • Lagos, Nigeria</p>
          <p>AI-Powered Digital Solutions for Nigerian Businesses</p>
        </footer>
      </main>
    </div>
  );
}

// Generate metadata
export async function generateMetadata({ params }: PageProps) {
  const { invoiceId } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { prospect: true },
  });

  if (!invoice) {
    return { title: "Invoice Not Found" };
  }

  return {
    title: `Invoice ${invoice.invoiceNumber} - ${invoice.prospect.company}`,
    description: `Pay invoice ${invoice.invoiceNumber} for ${invoice.prospect.company}`,
  };
}

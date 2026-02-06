"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createProposal,
  downloadInvoicePDF,
  generateInvoice,
  getProspect,
  updateProspectStatus,
} from "@/lib/actions/sales";
import {
  findMatchingTemplates,
  generateProposalFromTemplate,
  type ProposalTemplate,
} from "@/lib/proposal-templates";
import {
  ArrowLeft,
  Building,
  Copy,
  ExternalLink,
  Mail,
  MessageSquare,
  Phone,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProspectDetail({
  params,
}: {
  params: { prospectId: string };
}) {
  const router = useRouter();
  const [prospect, setProspect] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [matchingTemplates, setMatchingTemplates] = useState<
    ProposalTemplate[]
  >([]);
  const [proposalData, setProposalData] = useState({
    title: "",
    description: "",
    amount: 500000,
    timeline: "2-4 weeks",
    deliverables: ["", "", ""],
  });

  useEffect(() => {
    async function loadProspect() {
      const result = await getProspect(params.prospectId);
      if (result.success && result.prospect) {
        setProspect(result.prospect);
        // Find matching templates based on prospect data
        const templates = findMatchingTemplates(
          result.prospect.industry || "",
          result.prospect.painPoint || "",
        );
        setMatchingTemplates(templates);
      }
      setLoading(false);
    }
    loadProspect();
  }, [params.prospectId]);

  const applyTemplate = (template: ProposalTemplate) => {
    if (!prospect) return;
    const generated = generateProposalFromTemplate(template, prospect.company);
    setProposalData({
      ...generated,
      deliverables: [...generated.deliverables.slice(0, 5), "", ""],
    });
    setShowProposalForm(true);
  };

  const generateWhatsAppLink = () => {
    if (!prospect) return "";
    const phone = prospect.phone.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Hi ${prospect.name}, this is from ShadowSpark Technologies. I wanted to follow up on our discussion about ${prospect.painPoint.split(".")[0].toLowerCase()}. Do you have a few minutes to chat?`,
    );
    return `https://wa.me/${phone}?text=${message}`;
  };

  const copyPaymentLink = (invoiceId: string) => {
    const url = `${window.location.origin}/pay/${invoiceId}`;
    navigator.clipboard.writeText(url);
    alert("Payment link copied!");
  };

  useEffect(() => {
    async function loadProspect() {
      const result = await getProspect(params.prospectId);
      if (result.success && result.prospect) {
        setProspect(result.prospect);
      }
      setLoading(false);
    }
    loadProspect();
  }, [params.prospectId]);

  const handleStatusChange = async (newStatus: string) => {
    await updateProspectStatus(params.prospectId, newStatus as any);
    setProspect({ ...prospect, status: newStatus });
  };

  const handleCreateProposal = async () => {
    const result = await createProposal({
      prospectId: params.prospectId,
      ...proposalData,
      deliverables: proposalData.deliverables.filter((d) => d.trim()),
    });

    if (result.success) {
      alert("Proposal created! Ready to send.");
      setShowProposalForm(false);

      // Generate invoice (40% deposit)
      await generateInvoice(
        params.prospectId,
        Math.floor(proposalData.amount * 0.4),
        `Deposit for ${proposalData.title}`,
        result.proposal?.id,
      );

      // Refresh prospect data
      const updatedProspect = await getProspect(params.prospectId);
      if (updatedProspect.success) {
        setProspect(updatedProspect.prospect);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading prospect...</div>
      </div>
    );
  }

  if (!prospect) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">Prospect not found</p>
          <Link href="/dashboard/sales">
            <Button>Back to Sales</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      {/* Back Button */}
      <Link href="/dashboard/sales">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Sales
        </Button>
      </Link>

      {/* Prospect Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">{prospect.company}</h1>
          <p className="text-muted-foreground">{prospect.industry}</p>
        </div>
        <Select
          defaultValue={prospect.status}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="proposed">Proposed</SelectItem>
            <SelectItem value="won">Won</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-cyan-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <a
            href={generateWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="gap-2">
              <MessageSquare className="h-4 w-4 text-green-500" />
              WhatsApp
            </Button>
          </a>
          <a
            href={`mailto:${prospect.email}?subject=Follow-up: ${prospect.company}&body=Hi ${prospect.name},%0A%0A`}
          >
            <Button variant="outline" className="gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Button>
          </a>
          <a href={`tel:${prospect.phone}`}>
            <Button variant="outline" className="gap-2">
              <Phone className="h-4 w-4" />
              Call
            </Button>
          </a>
        </CardContent>
      </Card>

      {/* Contact Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-cyan-500" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{prospect.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{prospect.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Building className="h-5 w-5 text-cyan-500" />
              <div>
                <p className="text-sm text-muted-foreground">Est. Value</p>
                <p className="font-medium">
                  ₦{(prospect.estimatedValue / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pain Point */}
      <Card>
        <CardHeader>
          <CardTitle>Pain Point</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{prospect.painPoint}</p>
        </CardContent>
      </Card>

      {/* Recommended Templates */}
      {matchingTemplates.length > 0 && !showProposalForm && (
        <Card className="border-cyan-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyan-400" />
              Recommended Solutions
            </CardTitle>
            <CardDescription>
              Based on {prospect.company}&apos;s industry and pain point
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {matchingTemplates.slice(0, 3).map((template) => (
                <div
                  key={template.id}
                  className="border rounded-lg p-4 hover:border-cyan-500/50 transition-colors cursor-pointer"
                  onClick={() => applyTemplate(template)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{template.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.timeline} • ₦
                        {(template.baseAmount / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Use Template
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {template.description.split("\n")[0]}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Proposal Generator */}
      <Card>
        <CardHeader>
          <CardTitle>Create Proposal</CardTitle>
          <CardDescription>Generate and send a formal proposal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showProposalForm ? (
            <Button
              onClick={() => setShowProposalForm(true)}
              className="w-full"
            >
              Start New Proposal
            </Button>
          ) : (
            <div className="space-y-4">
              <Input
                placeholder="Proposal Title"
                value={proposalData.title}
                onChange={(e) =>
                  setProposalData({ ...proposalData, title: e.target.value })
                }
              />
              <Textarea
                placeholder="Describe what you'll build"
                value={proposalData.description}
                onChange={(e) =>
                  setProposalData({
                    ...proposalData,
                    description: e.target.value,
                  })
                }
              />
              <Input
                type="number"
                placeholder="Investment Amount (₦)"
                value={proposalData.amount}
                onChange={(e) =>
                  setProposalData({
                    ...proposalData,
                    amount: parseInt(e.target.value),
                  })
                }
              />
              <Input
                placeholder="Timeline (e.g., 2-4 weeks)"
                value={proposalData.timeline}
                onChange={(e) =>
                  setProposalData({ ...proposalData, timeline: e.target.value })
                }
              />

              <div className="space-y-2">
                <p className="font-medium">Deliverables</p>
                {proposalData.deliverables.map((d, i) => (
                  <Input
                    key={i}
                    placeholder={`Deliverable ${i + 1}`}
                    value={d}
                    onChange={(e) => {
                      const updated = [...proposalData.deliverables];
                      updated[i] = e.target.value;
                      setProposalData({
                        ...proposalData,
                        deliverables: updated,
                      });
                    }}
                  />
                ))}
              </div>

              <div className="flex gap-4">
                <Button onClick={handleCreateProposal} className="flex-1">
                  Create & Generate Invoice
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowProposalForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Proposals List */}
      {prospect.proposals && prospect.proposals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Proposals</CardTitle>
            <CardDescription>Sent to this prospect</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prospect.proposals.map((proposal: any) => (
                <div
                  key={proposal.id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{proposal.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {proposal.timeline} • ₦
                        {(proposal.amount / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        proposal.status === "accepted"
                          ? "bg-green-500/20 text-green-400"
                          : proposal.status === "sent"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {proposal.status}
                    </span>
                  </div>
                  <p className="text-sm">{proposal.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoices List */}
      {prospect.invoices && prospect.invoices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Payment requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prospect.invoices.map((invoice: any) => (
                <div
                  key={invoice.id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-semibold">{invoice.invoiceNumber}</h4>
                    <p className="text-sm text-muted-foreground">
                      {invoice.description}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      ₦{(invoice.amount / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        invoice.paymentStatus === "paid"
                          ? "bg-green-500/20 text-green-400"
                          : invoice.paymentStatus === "overdue"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {invoice.paymentStatus}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyPaymentLink(invoice.id)}
                        title="Copy payment link"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Link href={`/pay/${invoice.id}`} target="_blank">
                        <Button
                          size="sm"
                          variant="outline"
                          title="Open payment portal"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          const result = await downloadInvoicePDF(invoice.id);
                          if (result.success && result.pdfBuffer) {
                            const blob = new Blob(
                              [new Uint8Array(result.pdfBuffer)],
                              {
                                type: "application/pdf",
                              },
                            );
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `${invoice.invoiceNumber}.pdf`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }
                        }}
                      >
                        PDF
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Contact created {new Date(prospect.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

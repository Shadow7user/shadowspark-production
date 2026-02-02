"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowRight,
  Lock,
  Mail,
  Scale,
  Server,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

const INVESTOR_PASSWORD = "Seed2026";
const STORAGE_KEY = "shadowspark_investor_access";

export default function InvestorsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if already authenticated in this session
    const hasAccess = sessionStorage.getItem(STORAGE_KEY);
    if (hasAccess === "true") {
      setIsAuthenticated(true);
      setShowModal(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === INVESTOR_PASSWORD) {
      setIsAuthenticated(true);
      setShowModal(false);
      sessionStorage.setItem(STORAGE_KEY, "true");
      setError("");
    } else {
      setError("Incorrect password. Hint: Seed2026");
    }
  };

  // Teaser content for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-5 w-5 text-cyan-400" />
                <DialogTitle>Investor Access</DialogTitle>
              </div>
              <DialogDescription>
                This page contains confidential investment information.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter access password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  autoFocus
                />
                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              </div>
              <Button type="submit" className="w-full">
                Access Investor Materials
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Teaser when modal is dismissed */}
        <Card className="max-w-lg text-center">
          <CardHeader>
            <div className="mx-auto mb-4 p-3 rounded-full bg-cyan-400/10 w-fit">
              <Lock className="h-8 w-8 text-cyan-400" />
            </div>
            <CardTitle className="text-2xl">Investor Information</CardTitle>
            <CardDescription className="text-lg mt-2">
              Seeking{" "}
              <span className="text-cyan-400 font-semibold">$5M Seed</span> to
              fuel 18-month runway to traction.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowModal(true)} className="gap-2">
              <Lock className="h-4 w-4" />
              Enter Password to View
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Contact{" "}
              <a
                href="mailto:investors@shadowspark-technologies.com"
                className="text-cyan-400 hover:underline"
              >
                investors@shadowspark-technologies.com
              </a>{" "}
              for access.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Full investor content
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero */}
      <section className="text-center mb-16">
        <Badge
          variant="outline"
          className="mb-4 text-cyan-400 border-cyan-400/30"
        >
          Seed Round Open
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Join Us in Building the Institutional Digital Asset OS
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          <span className="text-cyan-400 font-semibold">$5M Seed Round</span> –
          18-Month Runway to Private Beta Traction and Revenue
        </p>
      </section>

      {/* Section 1: The Ask */}
      <section className="mb-12">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-400/10">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
              </div>
              <CardTitle>The Ask</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">
              We are raising{" "}
              <span className="font-semibold text-cyan-400">$5M</span> to
              execute Phase 1: Build core platform, onboard 5–10 lighthouse
              clients, and generate initial revenue.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Section 2: Use of Capital */}
      <section className="mb-12">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-400/10">
                <Scale className="h-5 w-5 text-cyan-400" />
              </div>
              <CardTitle>Use of Capital</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">
                      Justification
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-cyan-400" />
                        Personnel (80%)
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-cyan-400">
                      $4,000,000
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      Salaries/benefits for ~12 FTEs (heavy on engineering
                      talent)
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-cyan-400" />
                        Technology & Infrastructure (10%)
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-cyan-400">
                      $500,000
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      AWS/GCP, SaaS tools, data licenses (CoinGecko Pro),
                      compliance APIs
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Scale className="h-4 w-4 text-cyan-400" />
                        Legal & Regulatory (5%)
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-cyan-400">
                      $250,000
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      Entity setup, legal fees, regulatory counsel, licensing
                      prep
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-cyan-400" />
                        Contingency (5%)
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-cyan-400">
                      $250,000
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      Buffer for unforeseen costs
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 3: Key Financial Metrics */}
      <section className="mb-12">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-400/10">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
              </div>
              <CardTitle>Key Financial Metrics & Projections</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/30 border">
                  <p className="text-sm text-muted-foreground">
                    Peak Monthly Burn
                  </p>
                  <p className="text-2xl font-bold text-cyan-400">~$275,000</p>
                  <p className="text-xs text-muted-foreground">
                    at full team capacity
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border">
                  <p className="text-sm text-muted-foreground">
                    Revenue Timeline
                  </p>
                  <p className="text-2xl font-bold">Month 9</p>
                  <p className="text-xs text-muted-foreground">
                    First pilot revenue expected
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/30 border">
                  <p className="text-sm text-muted-foreground">
                    Month 24 Target
                  </p>
                  <p className="text-2xl font-bold text-cyan-400">$100K MRR</p>
                  <p className="text-xs text-muted-foreground">
                    → $1M+ ARR by Series A
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border">
                  <p className="text-sm text-muted-foreground">
                    Unit Economics Target
                  </p>
                  <p className="text-2xl font-bold">LTV/CAC &gt; 3x</p>
                  <p className="text-xs text-muted-foreground">
                    CAC &lt; 1/3 LTV
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 4: Traction Path */}
      <section className="mb-12">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-400/10">
                <ArrowRight className="h-5 w-5 text-cyan-400" />
              </div>
              <CardTitle>Traction Path</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border bg-gradient-to-br from-cyan-400/5 to-transparent">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Badge>Phase 1</Badge>
                  Metrics
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span>99.5% uptime SLA</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span>&lt;2s execution latency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span>100% pilot retention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span>Published case studies</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 rounded-lg border bg-gradient-to-br from-cyan-400/5 to-transparent">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Badge variant="outline">Phase 2</Badge>
                  Targets
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">→</span>
                    <span>50+ institutions onboarded</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">→</span>
                    <span>$250M monthly transaction volume</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">→</span>
                    <span>$1M+ ARR</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="text-center">
        <Card className="border-cyan-400/30 bg-gradient-to-br from-cyan-400/5 to-transparent">
          <CardContent className="pt-8 pb-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Learn More?</h2>
            <p className="text-muted-foreground mb-6">
              Valuation and terms available under NDA.
            </p>
            <Button size="lg" className="gap-2" asChild>
              <a href="mailto:investors@shadowspark-technologies.com?subject=Deck%20%26%20Terms%20Request">
                <Mail className="h-4 w-4" />
                Contact for Deck & Terms
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

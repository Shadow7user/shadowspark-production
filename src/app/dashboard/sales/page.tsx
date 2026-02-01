"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getDashboardStats, getProspects } from "@/lib/actions/sales";
import { Plus, TrendingUp, Users, FileText, DollarSign } from "lucide-react";
import Link from "next/link";

export default function SalesDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [prospects, setProspects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [statsRes, prospectsRes] = await Promise.all([
        getDashboardStats(),
        getProspects(),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (prospectsRes.success) setProspects(prospectsRes.prospects || []);
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  // Calculate pipeline data
  const pipelineData = [
    {
      stage: "Contacted",
      value: prospects.filter((p) => p.status === "contacted").length,
    },
    {
      stage: "Qualified",
      value: prospects.filter((p) => p.status === "qualified").length,
    },
    {
      stage: "Proposed",
      value: prospects.filter((p) => p.status === "proposed").length,
    },
    { stage: "Won", value: prospects.filter((p) => p.status === "won").length },
  ];

  const totalPipeline = prospects.reduce((sum, p) => sum + p.estimatedValue, 0);
  const wonRevenue = prospects
    .filter((p) => p.status === "won")
    .reduce((sum, p) => sum + p.estimatedValue, 0);

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Sales Dashboard</h1>
          <p className="text-muted-foreground">
            Track prospects, proposals, and pipeline
          </p>
        </div>
        <Link href="/dashboard/sales/new">
          <Button size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Prospect
          </Button>
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-cyan-500" />
              Total Prospects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.totalProspects || 0}
            </div>
            <p className="text-xs text-muted-foreground">In pipeline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-500" />
              Proposed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.proposedCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Waiting for decision
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Won Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.wonCount || 0}</div>
            <p className="text-xs text-muted-foreground">Closed this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-yellow-500" />
              Total Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ₦{(totalPipeline / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">Est. revenue value</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Stages</CardTitle>
            <CardDescription>Prospects by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#00FFD5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Tracking</CardTitle>
            <CardDescription>Pipeline vs Won</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: "Pipeline", value: totalPipeline / 1000000 },
                  { name: "Won", value: wonRevenue / 1000000 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#BD00FF" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Prospects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Prospects</CardTitle>
          <CardDescription>All leads in your pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          {prospects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No prospects yet. Add your first prospect to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Company</th>
                    <th className="text-left py-2 px-4">Contact</th>
                    <th className="text-left py-2 px-4">Industry</th>
                    <th className="text-left py-2 px-4">Est. Value</th>
                    <th className="text-left py-2 px-4">Status</th>
                    <th className="text-left py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prospects.map((prospect) => (
                    <tr
                      key={prospect.id}
                      className="border-b hover:bg-slate-900/50"
                    >
                      <td className="py-2 px-4 font-medium">
                        {prospect.company}
                      </td>
                      <td className="py-2 px-4">{prospect.name}</td>
                      <td className="py-2 px-4 text-muted-foreground">
                        {prospect.industry}
                      </td>
                      <td className="py-2 px-4">
                        ₦{(prospect.estimatedValue / 1000).toFixed(0)}K
                      </td>
                      <td className="py-2 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            prospect.status === "won"
                              ? "bg-green-500/20 text-green-400"
                              : prospect.status === "proposed"
                                ? "bg-blue-500/20 text-blue-400"
                                : prospect.status === "qualified"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {prospect.status.charAt(0).toUpperCase() +
                            prospect.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <Link href={`/dashboard/sales/${prospect.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Activity, CheckCircle, Clock, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WebhooksPage() {
  const events = await prisma.webhookEvent.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: { invoice: true },
  });

  const stats = await prisma.webhookEvent.groupBy({
    by: ["status"],
    _count: true,
  });

  const totalEvents = stats.reduce((acc, s) => acc + s._count, 0);
  const processedCount =
    stats.find((s) => s.status === "processed")?._count ?? 0;
  const failedCount = stats.find((s) => s.status === "failed")?._count ?? 0;
  const pendingCount = stats.find((s) => s.status === "pending")?._count ?? 0;

  const successRate =
    totalEvents > 0 ? ((processedCount / totalEvents) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Webhook Monitor</h1>
        <Badge variant="outline" className="text-sm">
          <Activity className="mr-1 h-3 w-3" />
          Live
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {successRate}%
            </div>
            <p className="text-xs text-muted-foreground">of all webhooks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processedCount}</div>
            <p className="text-xs text-muted-foreground">successful events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{failedCount}</div>
            <p className="text-xs text-muted-foreground">need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {pendingCount}
            </div>
            <p className="text-xs text-muted-foreground">in queue</p>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No webhook events yet. Events will appear here when Paystack sends
              webhooks.
            </p>
          ) : (
            <div className="space-y-2">
              {events.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        e.status === "processed"
                          ? "default"
                          : e.status === "failed"
                            ? "destructive"
                            : "secondary"
                      }
                      className={
                        e.status === "processed"
                          ? "bg-green-500 hover:bg-green-600"
                          : ""
                      }
                    >
                      {e.status}
                    </Badge>
                    <div>
                      <p className="font-medium">{e.event}</p>
                      <p className="text-sm text-muted-foreground">
                        {e.provider} •{" "}
                        {e.invoice?.invoiceNumber || "No invoice"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {new Date(e.createdAt).toLocaleString("en-NG", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                    {e.error && (
                      <p className="text-xs text-red-500 max-w-[200px] truncate">
                        {e.error}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

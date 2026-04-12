import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function OperatorDashboard() {
  const pendingDemos = await prisma.demo.findMany({
    where: { approved: false },
    include: { lead: true }
  });

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-white">Operator Dashboard</h1>
      <div className="grid gap-6">
        {pendingDemos.length === 0 && (
          <p className="text-zinc-500">No pending demo approvals.</p>
        )}
        {pendingDemos.map((demo) => (
          <Card key={demo.id} className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">{demo.lead.phoneNumber}</CardTitle>
                <p className="text-sm text-zinc-500">{demo.lead.id}</p>
              </div>
              <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                PENDING APPROVAL
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-zinc-500">Intent:</span>
                    <span className="ml-2 text-white">{demo.lead.intent}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Score:</span>
                    <span className="ml-2 text-white">{demo.lead.leadScore}</span>
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <form action={`/api/demo/approve`} method="POST">
                    <input type="hidden" name="demoId" value={demo.id} />
                    <Button type="submit" className="bg-cyan-500 text-zinc-950 hover:bg-cyan-400">
                      Approve & Deploy Demo
                    </Button>
                  </form>
                  <Button variant="destructive">Reject</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

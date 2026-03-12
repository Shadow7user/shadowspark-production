"use client";

interface Lead {
  id: string;
  name?: string | null;
  email?: string | null;
  status?: string | null;
}

export default function LeadDashboard({ leads }: { leads: Lead[] }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Leads</h1>
      {leads.length === 0 ? (
        <p className="text-muted-foreground">No leads yet.</p>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div key={lead.id} className="rounded-lg border p-4">
              <p className="font-medium">{lead.name ?? "Unnamed"}</p>
              <p className="text-sm text-muted-foreground">{lead.email ?? "No email"}</p>
              <span className="text-xs border rounded px-2 py-1">{lead.status ?? "new"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

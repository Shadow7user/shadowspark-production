import { getLeads } from "@/lib/actions/leads";
import LeadDashboard from "@/components/dashboard/LeadDashboard";

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div className="p-8 bg-[#050508] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white tracking-tighter italic">
          REVENUE_RADAR <span className="text-cyan-400">v1.0</span>
        </h1>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            Target Remaining
          </p>
          <p className="text-xl text-green-400 font-mono">NGN 1,500,000</p>
        </div>
      </div>

      <LeadDashboard leads={leads} />
    </div>
  );
}

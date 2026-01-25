import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/40 border border-gray-800 rounded-lg p-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome, {session.user?.name || "User"}!
          </h1>
          <p className="text-gray-400 mb-6">ShadowSpark Dashboard</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-4">
              <p className="text-cyan-400 text-sm">Email</p>
              <p className="text-white">{session.user?.email}</p>
            </div>
            <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-4">
              <p className="text-purple-400 text-sm">Role</p>
              <p className="text-white">{session.user?.role || "USER"}</p>
            </div>
          </div>
          
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-white mb-2">🎉 Phase 1B Complete!</h2>
            <p className="text-gray-300">Authentication is working. Next: Marketing website.</p>
          </div>
          
          <form action="/api/auth/signout" method="POST" className="mt-6">
            <button 
              type="submit"
              className="px-4 py-2 border border-gray-700 text-gray-300 rounded hover:bg-gray-800"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

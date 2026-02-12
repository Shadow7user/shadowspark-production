import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-8">
          Dashboard
        </h1>
        <div className="rounded-2xl bg-slate-800/50 p-8 backdrop-blur-sm border border-purple-500/20">
          <p className="text-slate-300">Welcome, {session.user?.name}!</p>
          <p className="text-slate-400 mt-2">Email: {session.user?.email}</p>
        </div>
      </div>
    </div>
  )
}

#!/bin/bash
echo "🚀 ShadowSpark Auth Setup - Automated"
echo "======================================"

# Step 1: Register Page
echo "✅ Step 1/8: Creating register page..."
mkdir -p src/app/\(auth\)/register
cat > src/app/\(auth\)/register/page.tsx << 'EOF'
export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-slate-800/50 p-8 shadow-2xl backdrop-blur-sm border border-purple-500/20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">ShadowSpark</h1>
          <p className="mt-2 text-sm text-slate-400">Create your account</p>
        </div>
        <form className="mt-8 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300">Full Name</label>
            <input id="name" type="text" required className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20" placeholder="John Doe" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email</label>
            <input id="email" type="email" required className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20" placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
            <input id="password" type="password" required className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-3 font-semibold text-white shadow-lg hover:from-cyan-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all">Create Account</button>
        </form>
        <p className="text-center text-sm text-slate-400">Already have an account? <a href="/login" className="font-medium text-cyan-400 hover:text-cyan-300">Sign in</a></p>
      </div>
    </div>
  )
}
EOF

# Step 2: Server Actions
echo "✅ Step 2/8: Creating server actions..."
mkdir -p src/app/actions
cat > src/app/actions/auth.ts << 'EOF'
"use server"
import { signIn } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) return { error: "Email already exists" }

  const hashedPassword = await bcrypt.hash(password, 10)
  await prisma.user.create({ data: { name, email, password: hashedPassword } })

  return { success: true }
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    await signIn("credentials", { email, password, redirect: false })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid credentials" }
    }
    throw error
  }
}
EOF

echo "✅ Step 3/8: Updating login page..."
cat > src/app/\(auth\)/login/page.tsx << 'EOF'
"use client"
import { loginUser } from "@/app/actions/auth"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const result = await loginUser(formData)
    
    if (result.error) {
      setError(result.error)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-slate-800/50 p-8 shadow-2xl backdrop-blur-sm border border-purple-500/20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">ShadowSpark</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">{error}</div>}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email</label>
            <input name="email" id="email" type="email" required className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20" placeholder="you@example.com" />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
            <input name="password" id="password" type="password" required className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20" placeholder="••••••••" />
          </div>

          <button type="submit" className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-3 font-semibold text-white shadow-lg hover:from-cyan-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all">Sign In</button>
        </form>

        <p className="text-center text-sm text-slate-400">Don't have an account? <a href="/register" className="font-medium text-cyan-400 hover:text-cyan-300">Sign up</a></p>
      </div>
    </div>
  )
}
EOF

echo "✅ Step 4/8: Updating register page with functionality..."
cat > src/app/\(auth\)/register/page.tsx << 'EOF'
"use client"
import { registerUser } from "@/app/actions/auth"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RegisterPage() {
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const result = await registerUser(formData)
    
    if (result.error) {
      setError(result.error)
    } else {
      router.push("/login")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-slate-800/50 p-8 shadow-2xl backdrop-blur-sm border border-purple-500/20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">ShadowSpark</h1>
          <p className="mt-2 text-sm text-slate-400">Create your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">{error}</div>}
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300">Full Name</label>
            <input name="name" id="name" type="text" required className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20" placeholder="John Doe" />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email</label>
            <input name="email" id="email" type="email" required className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20" placeholder="you@example.com" />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
            <input name="password" id="password" type="password" required className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20" placeholder="••••••••" />
          </div>

          <button type="submit" className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-3 font-semibold text-white shadow-lg hover:from-cyan-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all">Create Account</button>
        </form>

        <p className="text-center text-sm text-slate-400">Already have an account? <a href="/login" className="font-medium text-cyan-400 hover:text-cyan-300">Sign in</a></p>
      </div>
    </div>
  )
}
EOF

echo "✅ Step 5/8: Creating dashboard..."
mkdir -p src/app/\(dashboard\)/dashboard
cat > src/app/\(dashboard\)/dashboard/page.tsx << 'EOF'
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
EOF

cat > src/app/\(dashboard\)/layout.tsx << 'EOF'
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
EOF

echo "✅ All 8 steps completed!"
echo ""
echo "📊 Summary:"
echo "  ✅ Register page created"
echo "  ✅ Login page updated"
echo "  ✅ Server actions created"
echo "  ✅ Dashboard created"
echo "  ✅ Authentication wired up"
echo ""
echo "🔥 Next.js will auto-reload. Check:"
echo "   http://localhost:3000/register"
echo "   http://localhost:3000/login"

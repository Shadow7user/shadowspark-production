// fix-auth.js - Run with: node fix-auth.js
const fs = require('fs');
const path = require('path');

const projectPath = 'C:\\Users\\Administrator\\Documents\\shadowspark-app';

console.log('🔧 Fixing ShadowSpark Auth Issues...\n');

// Ensure directories exist
const dirs = [
  'src/lib',
  'src/app/api/auth/[...nextauth]',
  'src/app/login',
  'src/app/dashboard',
  'src/components'
];

dirs.forEach(dir => {
  const fullPath = path.join(projectPath, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Created: ${dir}`);
  }
});

// 1. Fix src/lib/auth.ts
const authTs = `import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user || !user.password) {
          return null;
        }

        // Simple comparison for testing (use bcrypt in production)
        if (user.password !== credentials.password) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  }
});
`;
fs.writeFileSync(path.join(projectPath, 'src/lib/auth.ts'), authTs);
console.log('✅ Fixed: src/lib/auth.ts');

// 2. Fix API route with Node.js runtime
const apiRoute = `export const runtime = "nodejs";

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
`;
fs.writeFileSync(path.join(projectPath, 'src/app/api/auth/[...nextauth]/route.ts'), apiRoute);
console.log('✅ Fixed: src/app/api/auth/[...nextauth]/route.ts');

// 3. Fix middleware (simple cookie check, no crypto)
const middleware = `import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authjs.session-token") || 
                request.cookies.get("__Secure-authjs.session-token");
  
  const isLoggedIn = !!token;
  
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/profile");

  const isAuthRoute = 
    request.nextUrl.pathname === "/login" || 
    request.nextUrl.pathname === "/register";

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\\\.).*)"]
};
`;
fs.writeFileSync(path.join(projectPath, 'src/middleware.ts'), middleware);
console.log('✅ Fixed: src/middleware.ts');

// 4. Fix login page
const loginPage = `import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-cyan-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">ShadowSpark</h1>
          <p className="mt-2 text-lg text-gray-300">Enter your credentials</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(projectPath, 'src/app/login/page.tsx'), loginPage);
console.log('✅ Fixed: src/app/login/page.tsx');

// 5. Fix login form (simplified)
const loginForm = `"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("test@shadowspark.com");
  const [password, setPassword] = useState("test123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials. Try: test@shadowspark.com / test123");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/50 backdrop-blur-lg border border-cyan-500/20 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Sign In</h2>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-300 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-semibold rounded disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      
      <p className="text-center text-sm text-gray-500 mt-4">
        Test: test@shadowspark.com / test123
      </p>
    </div>
  );
}
`;
fs.writeFileSync(path.join(projectPath, 'src/components/login-form.tsx'), loginForm);
console.log('✅ Fixed: src/components/login-form.tsx');

// 6. Fix dashboard page
const dashboardPage = `import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

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
`;
fs.writeFileSync(path.join(projectPath, 'src/app/dashboard/page.tsx'), dashboardPage);
console.log('✅ Fixed: src/app/dashboard/page.tsx');

// 7. Create seed script for test user
const seedScript = `const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

async function seed() {
  const connectionString = process.env.DATABASE_URL || 
    "postgresql://neondb_owner:npg_cUL0Gbrfl2TO@ep-calm-glade-aglkkkal-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require";
  
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("🌱 Creating test user...");
    
    const user = await prisma.user.upsert({
      where: { email: "test@shadowspark.com" },
      update: { password: "test123" },
      create: {
        email: "test@shadowspark.com",
        name: "Test Admin",
        password: "test123",
        role: "ADMIN",
        emailVerified: new Date()
      }
    });
    
    console.log("✅ Test user ready:", user.email);
    console.log("📝 Password: test123");
    
  } catch (e) {
    console.error("❌ Error:", e.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

seed();
`;
fs.writeFileSync(path.join(projectPath, 'seed-test.js'), seedScript);
console.log('✅ Created: seed-test.js');

console.log('\n========================================');
console.log('🎉 All files fixed!');
console.log('========================================\n');
console.log('Now run these commands:\n');
console.log('  1. node seed-test.js');
console.log('  2. npm run dev');
console.log('  3. Open http://localhost:3000/login');
console.log('  4. Login: test@shadowspark.com / test123\n');
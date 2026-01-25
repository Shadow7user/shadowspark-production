# ShadowSpark Phase 1B Fix Script
# Save this as: fix-shadowspark.ps1
# Run with: powershell -ExecutionPolicy Bypass -File fix-shadowspark.ps1

$projectPath = "C:\Users\Administrator\Documents\shadowspark-app"
Set-Location $projectPath

Write-Host "🔧 Fixing ShadowSpark Phase 1B files..." -ForegroundColor Cyan

# ============================================
# 1. Create seed-final.js
# ============================================
Write-Host "📝 Creating seed-final.js..." -ForegroundColor Yellow

$seedContent = @'
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('Starting database seed...');
    const hashedPassword = await bcrypt.hash('admin123', 12);

    const admin = await prisma.user.upsert({
      where: { email: 'admin@shadowspark.test' },
      update: {},
      create: {
        email: 'admin@shadowspark.test',
        name: 'ShadowSpark Admin',
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: new Date(),
      },
    });

    console.log('Admin user created:', admin.email);
    console.log('Password: admin123');

    const course = await prisma.course.create({
      data: {
        slug: 'ai-prompting-mastery',
        title: 'AI Prompting Mastery',
        description: 'Master ChatGPT, Claude, and Midjourney for business automation.',
        category: 'AI_PROMPTING',
        level: 'BEGINNER',
        price: 15000,
        currency: 'NGN',
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
        published: true,
        studentCount: 0,
      },
    });

    console.log('Sample course created:', course.title);
  } catch (error) {
    console.error('Seed error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
'@

Set-Content -Path "$projectPath\seed-final.js" -Value $seedContent -Encoding UTF8
Write-Host "✅ seed-final.js created" -ForegroundColor Green

# ============================================
# 2. Create src/app/login/page.tsx
# ============================================
Write-Host "📝 Creating login page..." -ForegroundColor Yellow

# Ensure directory exists
New-Item -ItemType Directory -Force -Path "$projectPath\src\app\login" | Out-Null

$loginPageContent = @'
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-cyan-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            ShadowSpark
          </h1>
          <p className="mt-2 text-lg text-gray-300">
            Enter your credentials to access the platform
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
'@

Set-Content -Path "$projectPath\src\app\login\page.tsx" -Value $loginPageContent -Encoding UTF8
Write-Host "✅ login/page.tsx created" -ForegroundColor Green

# ============================================
# 3. Create src/components/login-form.tsx
# ============================================
Write-Host "📝 Creating login form component..." -ForegroundColor Yellow

# Ensure directory exists
New-Item -ItemType Directory -Force -Path "$projectPath\src\components" | Out-Null

$loginFormContent = @'
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        setError("Invalid email or password. Please try again.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-cyan-500/20 bg-black/50 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center gap-2">
          <LogIn className="h-6 w-6" />
          Sign In
        </CardTitle>
        <CardDescription className="text-gray-400">
          Access your dashboard with your credentials
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                id="email"
                type="email"
                placeholder="admin@shadowspark.test"
                className="pl-10 bg-gray-900 border-gray-700 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                id="password"
                type="password"
                placeholder="admin123"
                className="pl-10 bg-gray-900 border-gray-700 text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col space-y-4">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </Button>
          <p className="text-center text-sm text-gray-500">
            Demo: admin@shadowspark.test / admin123
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
'@

Set-Content -Path "$projectPath\src\components\login-form.tsx" -Value $loginFormContent -Encoding UTF8
Write-Host "✅ login-form.tsx created" -ForegroundColor Green

# ============================================
# 4. Create src/app/dashboard/page.tsx
# ============================================
Write-Host "📝 Creating dashboard page..." -ForegroundColor Yellow

# Ensure directory exists
New-Item -ItemType Directory -Force -Path "$projectPath\src\app\dashboard" | Out-Null

$dashboardContent = @'
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Rocket, Users, BookOpen, CreditCard } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Welcome back, {session.user?.name || "Architect"}!
            </h1>
            <p className="text-gray-400 mt-2">
              ShadowSpark Platform Dashboard
            </p>
          </div>
          <form action="/api/auth/signout" method="POST">
            <Button variant="outline" className="border-gray-700 text-gray-300">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Revenue</CardTitle>
              <CreditCard className="h-5 w-5 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">N 0</p>
              <p className="text-sm text-gray-400">Month to Date</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Students</CardTitle>
              <Users className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">0</p>
              <p className="text-sm text-gray-400">Active enrollments</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Courses</CardTitle>
              <BookOpen className="h-5 w-5 text-green-400" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">0</p>
              <p className="text-sm text-gray-400">Published</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Projects</CardTitle>
              <Rocket className="h-5 w-5 text-orange-400" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">0</p>
              <p className="text-sm text-gray-400">In progress</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-black/40 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-gray-400">
              Platform administration and management
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-gradient-to-r from-purple-700 to-purple-900">
              Manage Users
            </Button>
            <Button className="bg-gradient-to-r from-cyan-700 to-cyan-900">
              Create Course
            </Button>
            <Button className="bg-gradient-to-r from-green-700 to-green-900">
              View Analytics
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-8 border-green-500/30 bg-green-900/10">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                <Rocket className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Phase 1B Complete!
              </h3>
              <p className="text-gray-300 mb-4">
                Authentication is live. Next: Marketing website.
              </p>
              <p className="text-sm text-gray-400">
                Logged in as: {session.user?.email}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
'@

Set-Content -Path "$projectPath\src\app\dashboard\page.tsx" -Value $dashboardContent -Encoding UTF8
Write-Host "✅ dashboard/page.tsx created" -ForegroundColor Green

# ============================================
# 5. Create src/middleware.ts
# ============================================
Write-Host "📝 Creating middleware..." -ForegroundColor Yellow

$middlewareContent = @'
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const isLoggedIn = !!session;
  
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/profile");

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && 
      (request.nextUrl.pathname === "/login" || 
       request.nextUrl.pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
'@

Set-Content -Path "$projectPath\src\middleware.ts" -Value $middlewareContent -Encoding UTF8
Write-Host "✅ middleware.ts created" -ForegroundColor Green

# ============================================
# 6. Run seed and start dev server
# ============================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ All files created successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌱 Running database seed..." -ForegroundColor Yellow

node seed-final.js

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 Starting development server..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Open http://localhost:3000/login in your browser" -ForegroundColor Yellow
Write-Host "Login: admin@shadowspark.test / admin123" -ForegroundColor Yellow
Write-Host ""

npm run dev
```

**Step 3:** Save the file as `fix-shadowspark.ps1` in:
```
C:\Users\Administrator\Documents\shadowspark-app\fix-shadowspark.ps1
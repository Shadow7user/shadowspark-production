const fs = require('fs');
const path = require('path');

const projectPath = 'C:\\Users\\Administrator\\Documents\\shadowspark-app';

// Ensure directories exist
fs.mkdirSync(path.join(projectPath, 'src/app/login'), { recursive: true });
fs.mkdirSync(path.join(projectPath, 'src/app/dashboard'), { recursive: true });
fs.mkdirSync(path.join(projectPath, 'src/components'), { recursive: true });

// Login Page
const loginPage = `import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-cyan-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">ShadowSpark</h1>
          <p className="mt-2 text-lg text-gray-300">Enter your credentials to access the platform</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}`;

fs.writeFileSync(path.join(projectPath, 'src/app/login/page.tsx'), loginPage);
console.log('✅ Created login/page.tsx');

// Login Form Component
const loginForm = `"use client";

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
            <label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</label>
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
            <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
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
          <p className="text-center text-sm text-gray-500">Demo: admin@shadowspark.test / admin123</p>
        </CardFooter>
      </form>
    </Card>
  );
}`;

fs.writeFileSync(path.join(projectPath, 'src/components/login-form.tsx'), loginForm);
console.log('✅ Created login-form.tsx');

// Dashboard Page
const dashboard = `import { auth } from "@/lib/auth";
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
            <h1 className="text-4xl font-bold text-white">Welcome back, {session.user?.name || "Architect"}!</h1>
            <p className="text-gray-400 mt-2">ShadowSpark Platform Dashboard</p>
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
            <CardDescription className="text-gray-400">Platform administration</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-gradient-to-r from-purple-700 to-purple-900">Manage Users</Button>
            <Button className="bg-gradient-to-r from-cyan-700 to-cyan-900">Create Course</Button>
            <Button className="bg-gradient-to-r from-green-700 to-green-900">View Analytics</Button>
          </CardContent>
        </Card>

        <Card className="mt-8 border-green-500/30 bg-green-900/10">
          <CardContent className="pt-6">
            <div className="text-center">
              <Rocket className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Phase 1B Complete!</h3>
              <p className="text-gray-300">Authentication is live. Logged in as: {session.user?.email}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}`;

fs.writeFileSync(path.join(projectPath, 'src/app/dashboard/page.tsx'), dashboard);
console.log('✅ Created dashboard/page.tsx');

console.log('\n🎉 All files created successfully!');
console.log('Run: npm run dev');
console.log('Visit: http://localhost:3000/login');
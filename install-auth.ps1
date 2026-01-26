# ShadowSpark Authentication Installation Script
# Save this as install-auth.ps1 in your project root and run it

Write-Host "🔐 ShadowSpark Authentication Installation" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Step 1: Check current directory
Write-Host "`n📁 Checking project structure..." -ForegroundColor Yellow
$currentDir = Get-Location
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Not in a Next.js project root" -ForegroundColor Red
    exit 1
}

# Step 2: Install required dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm install next-auth@beta @auth/prisma-adapter bcryptjs zod @types/bcryptjs --save

# Step 3: Create the file structure
Write-Host "`n📁 Creating file structure..." -ForegroundColor Yellow

# Create directories
$directories = @(
    "src/lib",
    "src/lib/utils", 
    "src/app/api/auth/[...nextauth]",
    "src/app/api/auth/register",
    "src/app/(auth)",
    "src/app/(auth)/login",
    "src/app/(auth)/register"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
        Write-Host "  ✓ Created: $dir" -ForegroundColor Green
    }
}

# Step 4: Create the files
Write-Host "`n📝 Creating authentication files..." -ForegroundColor Yellow

# 1. auth.config.ts
@"
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        
        const { email, password } = parsed.data;
        
        // TODO: Add your user lookup logic here
        // For now, using a mock user
        if (email === 'demo@shadowspark.com' && password === 'demo123') {
          return {
            id: '1',
            email: 'demo@shadowspark.com',
            name: 'Demo User',
            role: 'STUDENT'
          };
        }
        
        return null;
      }
    })
  ],
} satisfies NextAuthConfig;
"@ | Out-File -FilePath "src/lib/auth.config.ts" -Encoding UTF8
Write-Host "  ✓ Created: src/lib/auth.config.ts" -ForegroundColor Green

# 2. auth.ts
@"
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import authConfig from './auth.config';
import { prisma } from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  ...authConfig,
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
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
"@ | Out-File -FilePath "src/lib/auth.ts" -Encoding UTF8
Write-Host "  ✓ Created: src/lib/auth.ts" -ForegroundColor Green

# 3. middleware.ts
@"
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || 
                    req.nextUrl.pathname.startsWith('/register');

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }
    return NextResponse.redirect(
      new URL(`/login?from=\${encodeURIComponent(from)}`, req.nextUrl)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
"@ | Out-File -FilePath "src/middleware.ts" -Encoding UTF8
Write-Host "  ✓ Created: src/middleware.ts" -ForegroundColor Green

# 4. NextAuth API route
@"
import { handlers } from '@/lib/auth';
export const { GET, POST } = handlers;
"@ | Out-File -FilePath "src/app/api/auth/[...nextauth]/route.ts" -Encoding UTF8
Write-Host "  ✓ Created: src/app/api/auth/[...nextauth]/route.ts" -ForegroundColor Green

# 5. Register API route
@"
import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['STUDENT', 'CLIENT']),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = RegisterSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid fields' },
        { status: 400 }
      );
    }

    const { email, password, name, role } = validated.data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });

    return NextResponse.json(
      { success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
"@ | Out-File -FilePath "src/app/api/auth/register/route.ts" -Encoding UTF8
Write-Host "  ✓ Created: src/app/api/auth/register/route.ts" -ForegroundColor Green

# 6. Auth layout
@"
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050508] via-[#0d0d12] to-[#1a1a2e] overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-xl bg-gradient-to-b from-white/5 to-white/10 border border-white/10 rounded-2xl shadow-2xl shadow-purple-500/10 p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
"@ | Out-File -FilePath "src/app/(auth)/layout.tsx" -Encoding UTF8
Write-Host "  ✓ Created: src/app/(auth)/layout.tsx" -ForegroundColor Green

# 7. Login page
@"
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.push(from);
      router.refresh();
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn('google', { callbackUrl: from });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-white/60">Sign in to your ShadowSpark account</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-[#0d0d12] transition disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-transparent text-white/40">Or continue with</span>
        </div>
      </div>

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/5 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="CurrentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      <p className="text-center text-white/60 text-sm">
        Don't have an account?{' '}
        <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}
"@ | Out-File -FilePath "src/app/(auth)/login/page.tsx" -Encoding UTF8
Write-Host "  ✓ Created: src/app/(auth)/login/page.tsx" -ForegroundColor Green

# 8. Register page
@"
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'STUDENT' as 'STUDENT' | 'CLIENT',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Redirect to login with success message
      router.push('/login?registered=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-white/60">Join ShadowSpark Technologies</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
            placeholder="••••••••"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            I am a...
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
          >
            <option value="STUDENT">Student (Looking to learn)</option>
            <option value="CLIENT">Client (Looking to hire)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-[#0d0d12] transition disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-white/60 text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
"@ | Out-File -FilePath "src/app/(auth)/register/page.tsx" -Encoding UTF8
Write-Host "  ✓ Created: src/app/(auth)/register/page.tsx" -ForegroundColor Green

# 9. Dashboard page
@"
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050508] via-[#0d0d12] to-[#1a1a2e] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="backdrop-blur-xl bg-gradient-to-b from-white/5 to-white/10 border border-white/10 rounded-2xl shadow-2xl shadow-purple-500/10 p-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-white/60 mb-8">Welcome to your ShadowSpark dashboard</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">User Information</h3>
              <p className="text-white/60">Name: {session.user?.name}</p>
              <p className="text-white/60">Email: {session.user?.email}</p>
              <p className="text-white/60">Role: {session.user?.role || 'No role assigned'}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Quick Actions</h3>
              <ul className="space-y-2">
                <li>
                  <button className="text-cyan-400 hover:text-cyan-300">
                    Update Profile
                  </button>
                </li>
                <li>
                  <button className="text-cyan-400 hover:text-cyan-300">
                    View Projects
                  </button>
                </li>
                <li>
                  <button className="text-cyan-400 hover:text-cyan-300">
                    Account Settings
                  </button>
                </li>
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">System Status</h3>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white/60">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"@ | Out-File -FilePath "src/app/dashboard/page.tsx" -Encoding UTF8
Write-Host "  ✓ Created: src/app/dashboard/page.tsx" -ForegroundColor Green

# 10. Session utilities
@"
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function requireAuth() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }
  return session;
}

export async function requireRole(role: 'STUDENT' | 'CLIENT' | 'ADMIN') {
  const session = await requireAuth();
  if (session.user?.role !== role) {
    redirect('/dashboard');
  }
  return session;
}

export function isStudent(session: any) {
  return session?.user?.role === 'STUDENT';
}

export function isClient(session: any) {
  return session?.user?.role === 'CLIENT';
}

export function isAdmin(session: any) {
  return session?.user?.role === 'ADMIN';
}
"@ | Out-File -FilePath "src/lib/utils/session.ts" -Encoding UTF8
Write-Host "  ✓ Created: src/lib/utils/session.ts" -ForegroundColor Green

# Step 5: Update Prisma schema
Write-Host "`n🗄️  Checking Prisma schema..." -ForegroundColor Yellow

if (Test-Path "prisma/schema.prisma") {
    $schemaContent = Get-Content "prisma/schema.prisma" -Raw
    
    # Check if User model has role field
    if ($schemaContent -match "model User") {
        if (-not ($schemaContent -match "role\s+String\s+@default")) {
            # Add role field to User model
            $updatedSchema = $schemaContent -replace "(model User\s*\{[^}]+)", "`$1`n  role          String     @default(`"STUDENT`")"
            $updatedSchema | Out-File -FilePath "prisma/schema.prisma" -Encoding UTF8
            Write-Host "  ✓ Updated User model with role field" -ForegroundColor Green
        }
    }
}

# Step 6: Update environment variables
Write-Host "`n🔧 Setting up environment variables..." -ForegroundColor Yellow

# Generate a secure NEXTAUTH_SECRET
$secret = [Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Update .env.local
if (Test-Path ".env.local") {
    $envContent = Get-Content ".env.local" -Raw
    
    # Add NEXTAUTH_SECRET if not present
    if (-not ($envContent -match "NEXTAUTH_SECRET=")) {
        Add-Content -Path ".env.local" -Value "`nNEXTAUTH_SECRET=$secret"
        Write-Host "  ✓ Added NEXTAUTH_SECRET to .env.local" -ForegroundColor Green
    }
    
    # Add NEXTAUTH_URL if not present
    if (-not ($envContent -match "NEXTAUTH_URL=")) {
        Add-Content -Path ".env.local" -Value "`nNEXTAUTH_URL=http://localhost:3000"
        Write-Host "  ✓ Added NEXTAUTH_URL to .env.local" -ForegroundColor Green
    }
} else {
    @"
NEXTAUTH_SECRET=$secret
NEXTAUTH_URL=http://localhost:3000
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "  ✓ Created .env.local with authentication variables" -ForegroundColor Green
}

# Step 7: Update package.json with auth provider
Write-Host "`n📦 Updating package.json..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json

# Add auth provider if not present
if (-not $packageJson.dependencies.'next-auth') {
    $packageJson.dependencies | Add-Member -NotePropertyName 'next-auth' -NotePropertyValue 'beta' -Force
    $packageJson.dependencies | Add-Member -NotePropertyName '@auth/prisma-adapter' -NotePropertyValue 'latest' -Force
    $packageJson.dependencies | Add-Member -NotePropertyName 'bcryptjs' -NotePropertyValue 'latest' -Force
    $packageJson.dependencies | Add-Member -NotePropertyName 'zod' -NotePropertyValue 'latest' -Force
    
    $packageJson | ConvertTo-Json -Depth 20 | Out-File -FilePath "package.json" -Encoding UTF8
    Write-Host "  ✓ Updated package.json dependencies" -ForegroundColor Green
}

# Step 8: Generate Prisma client
Write-Host "`n⚡ Generating Prisma client..." -ForegroundColor Yellow
try {
    npx prisma generate 2>&1 | Out-Null
    Write-Host "  ✓ Prisma client generated" -ForegroundColor Green
} catch {
    Write-Host "  ⚠ Prisma generation might need manual check" -ForegroundColor Yellow
}

Write-Host "`n✅ Installation Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "`n🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Run: npx prisma db push" -ForegroundColor White
Write-Host "2. Run: npm run dev" -ForegroundColor White
Write-Host "`n🌐 Open your browser and visit:" -ForegroundColor Cyan
Write-Host "   • http://localhost:3000/login" -ForegroundColor White
Write-Host "   • http://localhost:3000/register" -ForegroundColor White
Write-Host "   • http://localhost:3000/dashboard (protected)" -ForegroundColor White
Write-Host "`n🔐 Test Credentials:" -ForegroundColor Cyan
Write-Host "   Email: demo@shadowspark.com" -ForegroundColor White
Write-Host "   Password: demo123" -ForegroundColor White
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
    const result = await signIn('credentials', { email, password, redirect: false });
    if (result?.error) setError('Invalid credentials');
    else { router.push(from); router.refresh(); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white">Sign in</h2>
          <p className="mt-2 text-center text-gray-400">to your ShadowSpark account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white" placeholder="Email" />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white" placeholder="Password" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading} 
            className="w-full py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="text-center text-gray-400">
          Don't have an account? <Link href="/register" className="text-cyan-400 hover:text-cyan-300">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

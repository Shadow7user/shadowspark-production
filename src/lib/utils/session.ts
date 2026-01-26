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

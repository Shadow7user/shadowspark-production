import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id?: string;
    role?: 'STUDENT' | 'CLIENT' | 'ADMIN';
  }

  interface Session {
    user: {
      id?: string;
      role?: 'STUDENT' | 'CLIENT' | 'ADMIN';
    } & DefaultSession['user'];
  }
}


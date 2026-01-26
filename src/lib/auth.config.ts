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

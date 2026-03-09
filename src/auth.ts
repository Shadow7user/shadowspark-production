
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string() })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    // This callback includes the user's role and ID in the JWT.
    async jwt({ token, user }) {
      if (user && user.id) {
        token.sub = user.id; // sub is the standard JWT field for subject (user id)
        token.role = user.role;
      }
      return token;
    },
    // This callback makes the user's role and ID available in the session object.
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
  // Define custom pages if you want a branded login experience
  // pages: {
  //   signIn: "/auth/login",
  //   error: "/auth/error",
  // },
});

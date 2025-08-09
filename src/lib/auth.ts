import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { compare } from "bcrypt";
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";


declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      role?: string;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    id?: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !(await compare(credentials.password, user.password))) {
          return null;
        }

        // Remove sensitive fields if needed
        const { password, ...safeUser } = user;
        return safeUser; // This will include 'role'
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // Add role to JWT
      }
      return token;
    },
    async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
    }
      return session;
    },
  },
};
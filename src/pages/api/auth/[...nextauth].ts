import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import { PrismaClient } from "@prisma/client";
import { getSubscriptionByEmail } from "../utils/subscription";
import { hasFeature } from "@/utils";

const prisma = new PrismaClient();

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  adapter: hasFeature("account") ? PrismaAdapter(prisma) : undefined,
  // https://next-auth.js.org/configuration/providers/oauth
  providers: hasFeature("account")
    ? [
        EmailProvider({
          server: process.env.EMAIL_SERVER,
          from: process.env.EMAIL_FROM || "noreply@sqlchat.ai",
          // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
        }),
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GithubProvider({
          clientId: process.env.GITHUB_ID,
          clientSecret: process.env.GITHUB_SECRET,
        }),
      ]
    : [],
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.subscription = await getSubscriptionByEmail(user.email);
      session.user.stripeId = user.stripeId;
      return session;
    },
  },
  theme: {
    brandColor: "#4F46E5",
    logo: "/chat-logo.webp",
  },
};

export default NextAuth(authOptions);

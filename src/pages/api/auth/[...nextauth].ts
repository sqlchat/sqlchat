import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import { PrismaClient, SubscriptionStatus } from "@prisma/client";
import { PlanType, Subscription } from "@/types";

const prisma = new PrismaClient();

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: "noreply@sqlchat.ai",
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
  ],
  callbacks: {
    async session({ session, user }) {
      // console.log("session session", session);
      // console.log("session user", user);
      // Find the most relavent subscription:
      // Return the latest ACTIVE subscription if exists.
      // Otherwise, return the latest non-ACTIVE subscripion.
      const subscriptions = await prisma.subscription.findMany({
        where: { userId: user.id },
        orderBy: { expireAt: "desc" },
      });

      let relevantSubscription: Subscription | undefined;
      for (const subscription of subscriptions) {
        relevantSubscription = {
          plan: subscription.plan as PlanType,
          status: subscription.status,
          startAt: subscription.startAt,
          expireAt: subscription.expireAt,
        };
        if (relevantSubscription.status === SubscriptionStatus.ACTIVE) {
          break;
        }
      }

      if (relevantSubscription) {
        session.user.subscription = relevantSubscription;
      }
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

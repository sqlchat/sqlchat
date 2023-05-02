import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
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
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile.email_verified === true) {
        return true;
      }
      return false;
    },
    async jwt({ account, token, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin.
      // Only the signin passes the account object.
      // https://next-auth.js.org/configuration/callbacks#jwt-callback
      if (account) {
        console.log("account", account);
        console.log("token", token);
        console.log("profile", profile);

        let email = token.email;
        let resourceId = "";

        if (account.provider == "github") {
          // For GitHub, email address is not returned if privacy settings are enabled.
          if (!email) {
            email = `${profile?.id}+${profile?.login}@github.sqlchat.ai`;
          }
          resourceId = `${profile?.login}-github`;
        } else if (account.provider == "google") {
          resourceId = `${email?.split("@")[0]}-google`;
        }

        const newPrincipal: Prisma.PrincipalCreateInput = {
          type: "END_USER",
          status: "ACTIVE",
          resourceId: resourceId,
          name: token.name as string,
          email: email,
          emailVerified: true,
        };
        const updatePrincipal: Prisma.PrincipalUpdateInput = {
          resourceId: resourceId,
          name: token.name as string,
        };

        await prisma.principal.upsert({
          where: { email: email },
          create: newPrincipal,
          update: updatePrincipal,
        });
      }
      return token;
    },
  },
  theme: {
    brandColor: "#4F46E5",
    logo: "/chat-logo.webp",
  },
};

export default NextAuth(authOptions);

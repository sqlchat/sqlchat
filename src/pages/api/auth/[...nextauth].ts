import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ account, token, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin.
      // Only the signin passes the account object.
      // https://next-auth.js.org/configuration/callbacks#jwt-callback
      if (account) {
        console.log("account", account);
        console.log("token", token);
        console.log("profile", profile);

        // Email address is not returned if privacy settings are enabled.
        let email = token.email || `github-${profile?.id}@sqlchat.ai`;

        const newPrincipal: Prisma.PrincipalCreateInput = {
          type: "END_USER",
          status: "ACTIVE",
          resourceId: profile?.login,
          name: token.name as string,
          email: email,
          emailVerified: true,
        };
        const updatePrincipal: Prisma.PrincipalUpdateInput = {
          resourceId: profile?.login,
          name: token.name as string,
        };
        if (account.provider == "github") {
          token.accessToken = account.access_token;
        }

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

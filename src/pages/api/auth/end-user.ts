import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import requestIp from "request-ip";
import { authOptions } from "./[...nextauth]";

const prisma = new PrismaClient();

// Returns the login user email or the client IP address
export const getEndUser = async (req: NextApiRequest, res: NextApiResponse): Promise<string> => {
  // Get from server session if available
  const serverSession = await getServerSession(req, res, authOptions);
  if (serverSession?.user?.email) {
    return serverSession.user.email;
  }

  // Get from session token if available
  const token = req.headers.authorization?.substring(7);
  if (token) {
    const sessionInDb = await prisma.session.findUnique({
      where: { sessionToken: token },
    });
    if (sessionInDb?.userId) {
      const user = await prisma.user.findUnique({
        where: { id: sessionInDb.userId },
      });
      if (user?.email) {
        return user.email;
      }
    }
  }

  // Get from client IP address
  return requestIp.getClientIp(req) || "";
};

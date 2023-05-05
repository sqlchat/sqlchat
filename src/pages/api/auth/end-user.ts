import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";
import requestIp from "request-ip";

// Returns the login user email or the client IP address
export const getEndUser = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<string> => {
  const session = await getServerSession(req, res, authOptions);
  if (session?.user?.email) {
    return session.user.email;
  }
  return requestIp.getClientIp(req) || "";
};

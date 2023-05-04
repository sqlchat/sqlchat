import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";
import { getEndUser } from "./end-user";
import { Quota, GUEST_QUOTA, FREE_QUOTA } from "@/types";

const prisma = new PrismaClient();

export const checkQuota = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<boolean> => {
  const quota = await getQuota(req, res);
  return quota.current <= quota.limit;
};

export const getQuota = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Quota> => {
  const endUser = await getEndUser(req, res);
  const session = await getServerSession(req, res, authOptions);
  return {
    current: await prisma.message.count({
      where: {
        endUser: endUser,
        role: "user",
      },
    }),
    limit: session ? FREE_QUOTA : GUEST_QUOTA,
  };
};

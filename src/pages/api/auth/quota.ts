import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getEndUser } from "./end-user";
import { Quota, DEFAULT_QUOTA_LIMIT } from "@/types";

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
  return {
    current: await prisma.message.count({
      where: {
        endUser: endUser,
        role: "user",
      },
    }),
    limit: DEFAULT_QUOTA_LIMIT,
  };
};

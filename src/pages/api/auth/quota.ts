import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getEndUser } from "./end-user";

const prisma = new PrismaClient();

export const checkQuota = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<boolean> => {
  const endUser = await getEndUser(req, res);
  const count = await prisma.message.count({
    where: {
      endUser: endUser,
      role: "user",
    },
  });

  // TODO: if user has purchased paid plan, allow 1000
  // Otherwise, allow 10

  return true;
};

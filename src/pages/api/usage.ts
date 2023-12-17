import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { getSubscriptionByEmail } from "./utils/subscription";
import { getModel } from "@/utils";
import { addUsage, getCurrentMonthUsage } from "./utils/usage";
import { getEndUser } from "./auth/end-user";
import { Quota } from "@/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json([]);
  }

  const endUser = await getEndUser(req, res);

  // Get from server session if available
  const serverSession = await getServerSession(req, res, authOptions);
  let subscripion = serverSession?.user?.subscription;
  if (!subscripion) {
    subscripion = await getSubscriptionByEmail(endUser);
  }

  let usage = 0;
  if (req.method === "GET") {
    usage = await getCurrentMonthUsage(endUser);
  } else if (req.method === "POST") {
    const model = getModel((req.headers["x-openai-model"] as string) || "");
    usage = await addUsage(endUser, model.cost_per_call);
  }

  const quota: Quota = {
    current: usage,
    limit: subscripion.quota,
  };

  res.status(200).json(quota);
};

export default handler;

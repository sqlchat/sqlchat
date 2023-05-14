import { NextApiRequest, NextApiResponse } from "next";
import { getSubscription } from "./utils/subscription";
import { addUsage, getCurrentMonthUsage } from "./utils/usage";
import { getEndUser } from "./auth/end-user";
import { Quota } from "@/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json([]);
  }

  const endUser = await getEndUser(req, res);
  const subscripion = await getSubscription(endUser);

  let usage = 0;
  if (req.method === "GET") {
    usage = await getCurrentMonthUsage(endUser);
    if (usage >= subscripion.quota) {
      return new Response(
        JSON.stringify({
          error: {
            message: `You have reached your monthly quota: ${subscripion.quota}`,
          },
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 402,
        }
      );
    }
  } else if (req.method === "POST") {
    usage = await addUsage(endUser);
  }

  const quota: Quota = {
    current: usage,
    limit: subscripion.quota,
  };

  res.status(200).json(quota);
};

export default handler;

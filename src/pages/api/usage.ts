import { NextApiRequest, NextApiResponse } from "next";
import { getSubscription } from "./utils/subscription";
import { addUsage, getCurrentMonthUsage } from "./utils/usage";
import { getEndUser } from "./auth/end-user";
import { add } from "lodash-es";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json([]);
  }

  const endUser = req.body.user || (await getEndUser(req, res));
  console.log("user", endUser);
  const subscripion = await getSubscription(endUser);
  console.log("quota", subscripion.quota);

  let usage = 0;
  if (req.method === "GET") {
    usage = await getCurrentMonthUsage(endUser);
    console.log("usage", usage);
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

  res.status(200).json({
    current: usage,
    limit: subscripion.quota,
  });
};

export default handler;

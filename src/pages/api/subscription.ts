import { NextApiRequest, NextApiResponse } from "next";
import { getEndUser } from "./auth/end-user";
import { getSubscriptionListByEmail } from "./utils/subscription";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json([]);
  }

  const endUser = await getEndUser(req, res);
  const subscriptionList = await getSubscriptionListByEmail(endUser);

  res.status(200).json(subscriptionList);
};

export default handler;

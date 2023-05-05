import { NextApiRequest, NextApiResponse } from "next";
import { getQuota } from "./auth/quota";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json([]);
  }
  res.status(200).json(await getQuota(req, res));
};

export default handler;

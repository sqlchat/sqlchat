import { NextApiRequest, NextApiResponse } from "next";
import { getEndUser } from "./auth/end-user";
import { getPaymentListByEmail } from "./utils/payment";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json([]);
  }

  const endUser = await getEndUser(req, res);
  const paymentList = await getPaymentListByEmail(endUser);

  res.status(200).json(paymentList);
};

export default handler;

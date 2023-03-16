import { NextApiRequest, NextApiResponse } from "next";

const handler = async (_: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json("Hello world!");
};

export default handler;

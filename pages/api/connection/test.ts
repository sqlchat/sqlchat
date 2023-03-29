import { NextApiRequest, NextApiResponse } from "next";
import { newConnector } from "@/lib/connectors";
import { Connection } from "@/types";

// POST /api/connection/test
// req body: { connection: Connection }
// It's mainly used to test the connection.
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json(false);
  }

  const connection = req.body.connection as Connection;
  try {
    const connector = newConnector(connection);
    await connector.testConnection();
    res.status(200).json({});
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Failed to test connection.",
      code: error.code || "UNKNOWN",
    });
  }
};

export default handler;

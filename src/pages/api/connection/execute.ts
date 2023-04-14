import { NextApiRequest, NextApiResponse } from "next";
import { newConnector } from "@/lib/connectors";
import { Connection } from "@/types";

// POST /api/connection/execute
// req body: { connection: Connection, db: string, statement: string }
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json(false);
  }

  const connection = req.body.connection as Connection;
  const db = req.body.db as string;
  const statement = req.body.statement as string;

  try {
    const connector = newConnector(connection);
    const result = await connector.execute(db, statement);
    res.status(200).json({
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Failed to execute statement.",
      code: error.code || "UNKNOWN",
    });
  }
};

export default handler;

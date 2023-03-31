import { NextApiRequest, NextApiResponse } from "next";
import { newConnector } from "@/lib/connectors";
import { Connection } from "@/types";

// POST /api/connection/db
// req body: { connection: Connection }
// It's mainly used to get the database list.
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json([]);
  }

  const connection = req.body.connection as Connection;
  try {
    const connector = newConnector(connection);
    const databaseNameList = await connector.getDatabases();
    res.status(200).json(databaseNameList);
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
};

export default handler;

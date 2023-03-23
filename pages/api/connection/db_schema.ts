import { NextApiRequest, NextApiResponse } from "next";
import { newConnector } from "@/lib/connectors";
import { Connection } from "@/types";

// POST /api/connection/db_schema
// req body: { connection: Connection, db: string }
// It's mainly used to get the database list.
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json([]);
  }

  const connection = req.body.connection as Connection;
  const db = req.body.db as string;
  try {
    const connector = newConnector(connection);
    const tableStructures: string[] = [];
    const tables = await connector.getTables(db);
    for (const table of tables) {
      const structure = await connector.getTableStructure(db, table);
      tableStructures.push(structure);
    }
    res.status(200).json(tableStructures);
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
};

export default handler;

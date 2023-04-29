import { NextApiRequest, NextApiResponse } from "next";
import { newConnector } from "@/lib/connectors";
import { Connection, Table } from "@/types";

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
    const tableStructures: Table[] = [];
    const rawTableNameList = await connector.getTables(db);
    const structureFetched = (tableName: string, structure: string) => {
      tableStructures.push({
        name: tableName,
        structure,
      });
    };
    Promise.all(
      rawTableNameList.map(async (tableName) =>
        connector.getTableStructure(db, tableName, structureFetched)
      )
    ).then(() => {
      res.status(200).json({
        data: tableStructures,
      });
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Failed to get database schema.",
      code: error.code || "UNKNOWN",
    });
  }
};

export default handler;

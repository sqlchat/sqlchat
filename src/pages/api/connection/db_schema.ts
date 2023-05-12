import { NextApiRequest, NextApiResponse } from "next";
import { newConnector } from "@/lib/connectors";
import { Connection, Table } from "@/types";
import { changeTiDBConnectionToMySQL } from "@/utils";
import { Engine } from "@/types/connection";

// POST /api/connection/db_schema
// req body: { connection: Connection, db: string }
// It's mainly used to get the database list.
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json([]);
  }

  let connection = req.body.connection as Connection;
  if (connection.engineType === Engine.TiDBServerless) {
    connection = changeTiDBConnectionToMySQL(connection);
  }

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
    await connector.getTableStructureBatch(
      db,
      rawTableNameList,
      structureFetched
    );

    res.status(200).json({
      data: tableStructures,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Failed to get database schema.",
      code: error.code || "UNKNOWN",
    });
  }
};

export default handler;

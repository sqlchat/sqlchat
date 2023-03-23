import { Connection } from "@/types";
import mysql from "./mysql";

export interface Connector {
  testConnection: () => Promise<boolean>;
  getDatabases: () => Promise<string[]>;
  getTables: (databaseName: string) => Promise<string[]>;
  getTableStructure: (databaseName: string, tableName: string) => Promise<string>;
}

export const newConnector = (connection: Connection): Connector => {
  switch (connection.engineType) {
    case "MYSQL":
      return mysql(connection);
    default:
      throw new Error("Unsupported engine type.");
  }
};

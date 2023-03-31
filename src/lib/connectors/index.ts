import { Connection, Engine } from "@/types";
import mysql from "./mysql";
import postgres from "./postgres";

export interface Connector {
  testConnection: () => Promise<boolean>;
  execute: (databaseName: string, statement: string) => Promise<any>;
  getDatabases: () => Promise<string[]>;
  getTables: (databaseName: string) => Promise<string[]>;
  getTableStructure: (databaseName: string, tableName: string) => Promise<string>;
}

export const newConnector = (connection: Connection): Connector => {
  switch (connection.engineType) {
    case Engine.MySQL:
      return mysql(connection);
    case Engine.PostgreSQL:
      return postgres(connection);
    default:
      throw new Error("Unsupported engine type.");
  }
};

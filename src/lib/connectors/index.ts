import { Connection, Engine, ExecutionResult, Schema } from "@/types";
import mysql from "./mysql";
import postgres from "./postgres";
import mssql from "./mssql";

export interface Connector {
  testConnection: () => Promise<boolean>;
  execute: (databaseName: string, statement: string) => Promise<ExecutionResult>;
  getDatabases: () => Promise<string[]>;
  getTableSchema: (databaseName: string) => Promise<Schema[]>;
}

export const newConnector = (connection: Connection): Connector => {
  switch (connection.engineType) {
    case Engine.MySQL:
      return mysql(connection);
    case Engine.PostgreSQL:
      return postgres(connection);
    case Engine.MSSQL:
      return mssql(connection);
    default:
      throw new Error("Unsupported engine type.");
  }
};

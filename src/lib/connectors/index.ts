import { Connection, Engine, ExecutionResult, Schema } from "@/types";
import mysql from "./mysql";
import postgres from "./postgres";
import mssql from "./mssql";

export interface Connector {
  testConnection: () => Promise<boolean>;
  execute: (databaseName: string, statement: string) => Promise<ExecutionResult>;
  getDatabases: () => Promise<string[]>;
<<<<<<< HEAD
  getTables: (databaseName: string) => Promise<string[]>;
  getTableStructure: (
    databaseName: string,
    tableName: string,
    structureFetched: (tableName: string, structure: string) => void
  ) => Promise<void>;
  getTableStructureBatch: (
    databaseName: string,
    tableNameList: string[],
    structureFetched: (tableName: string, structure: string) => void
  ) => Promise<void>;
  getTableSchema?: () => Promise<Array<string>>;
=======
  getTableSchema: (databaseName: string) => Promise<Schema[]>;
>>>>>>> feat/support_postgresql_schema
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

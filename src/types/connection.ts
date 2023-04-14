import { Id } from ".";

export enum Engine {
  MySQL = "MYSQL",
  PostgreSQL = "POSTGRESQL",
  MSSQL = "MSSQL",
}

export interface SSLOptions {
  ca?: string;
  cert?: string;
  key?: string;
}

export interface Connection {
  id: Id;
  title: string;
  engineType: Engine;
  host: string;
  port: string;
  username: string;
  password: string;
  // database is only required for PostgreSQL.
  database?: string;
  // encrypt is only required for MSSQL.
  encrypt?: boolean;
  ssl?: SSLOptions;
}

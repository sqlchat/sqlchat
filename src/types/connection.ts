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
  enabled?: boolean;
  trustServerCertificate?: boolean;
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
  ssl?: SSLOptions;
}

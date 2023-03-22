import { Id } from "./common";

enum Engine {
  MySQL = "MYSQL",
  PostgreSQL = "POSTGRESQL",
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
}

import { Client, ClientConfig } from "pg";
import { Connection } from "@/types";
import { Connector } from "..";

const newPostgresClient = (connection: Connection) => {
  const clientConfig: ClientConfig = {
    host: connection.host,
    port: Number(connection.port),
    user: connection.username,
    password: connection.password,
    database: connection.database,
  };
  if (connection.ssl) {
    clientConfig.ssl = {
      ca: connection.ssl?.ca,
      cert: connection.ssl?.cert,
      key: connection.ssl?.key,
    };
  }
  return new Client(clientConfig);
};

const testConnection = async (connection: Connection): Promise<boolean> => {
  const client = newPostgresClient(connection);
  await client.connect();
  await client.end();
  return true;
};

const execute = async (connection: Connection, _: string, statement: string): Promise<any> => {
  const client = newPostgresClient(connection);
  await client.connect();
  const { rows } = await client.query(statement);
  await client.end();
  return rows;
};

const getDatabases = async (connection: Connection): Promise<string[]> => {
  const client = newPostgresClient(connection);
  await client.connect();
  await client.end();
  // Because PostgreSQL needs to specify a database to connect to, we use the default database.
  return [connection.database!];
};

const getTables = async (connection: Connection, databaseName: string): Promise<string[]> => {
  const client = newPostgresClient(connection);
  await client.connect();
  const { rows } = await client.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' AND table_catalog=$1;`,
    [databaseName]
  );
  await client.end();
  const tableList = [];
  for (const row of rows) {
    if (row["table_name"]) {
      tableList.push(row["table_name"]);
    }
  }
  return tableList;
};

const getTableStructure = async (connection: Connection, _: string, tableName: string): Promise<string> => {
  const client = newPostgresClient(connection);
  await client.connect();
  const { rows } = await client.query(
    `SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema='public' AND table_name=$1;`,
    [tableName]
  );
  await client.end();
  const columnList = [];
  // TODO(steven): transform it to standard schema string.
  for (const row of rows) {
    columnList.push(
      `${row["column_name"]} ${row["data_type"].toUpperCase()} ${String(row["is_nullable"]).toUpperCase() === "NO" ? "NOT NULL" : ""}`
    );
  }
  return `CREATE TABLE \`${tableName}\` (
    ${columnList.join(",\n")}
  );`;
};

const newConnector = (connection: Connection): Connector => {
  return {
    testConnection: () => testConnection(connection),
    execute: (databaseName: string, statement: string) => execute(connection, databaseName, statement),
    getDatabases: () => getDatabases(connection),
    getTables: (databaseName: string) => getTables(connection, databaseName),
    getTableStructure: (databaseName: string, tableName: string) => getTableStructure(connection, databaseName, tableName),
  };
};

export default newConnector;

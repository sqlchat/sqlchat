import { Client, ClientConfig } from "pg";
import { Connection, ExecutionResult } from "@/types";
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

const execute = async (connection: Connection, databaseName: string, statement: string): Promise<any> => {
  connection.database = databaseName;
  const client = newPostgresClient(connection);
  await client.connect();
  const { rows, rowCount } = await client.query(statement);
  await client.end();

  const executionResult: ExecutionResult = {
    rawResult: rows,
    affectedRows: rowCount,
  };
  // For those SELECT statement, we should set the affectedRows to undefined.
  if (executionResult.rawResult.length === rowCount) {
    executionResult.affectedRows = undefined;
  }
  return executionResult;
};

const getDatabases = async (connection: Connection): Promise<string[]> => {
  const client = newPostgresClient(connection);
  await client.connect();
  if (connection.database) {
    await client.end();
    return [connection.database];
  }

  const { rows } = await client.query(`SELECT datname FROM pg_database;`);
  await client.end();
  const databaseList = [];
  for (const row of rows) {
    if (row["datname"]) {
      databaseList.push(row["datname"]);
    }
  }
  await client.end();
  return databaseList;
};

const getTables = async (connection: Connection, databaseName: string): Promise<string[]> => {
  connection.database = databaseName;
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

const getTableStructure = async (connection: Connection, databaseName: string, tableName: string): Promise<string> => {
  connection.database = databaseName;
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

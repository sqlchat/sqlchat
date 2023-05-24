import { Client, ClientConfig } from "pg";
import { Connection, ExecutionResult } from "@/types";
import { Connector } from "..";

const systemSchemas =
  "'information_schema', 'pg_catalog', 'pg_toast', '_timescaledb_cache', '_timescaledb_catalog', '_timescaledb_internal', '_timescaledb_config', 'timescaledb_information', 'timescaledb_experimental'";

const systemTables = "'_prisma_migrations'";

const newPostgresClient = async (connection: Connection) => {
  const clientConfig: ClientConfig = {
    host: connection.host,
    port: Number(connection.port),
    user: connection.username,
    password: connection.password,
    database: connection.database,
    application_name: "sqlchat",
  };
  if (connection.ssl) {
    // when option is preferred, ca-only and full
    if (connection.ssl.ca) {
      clientConfig.ssl = {
        ca: connection.ssl?.ca,
        cert: connection.ssl?.cert,
        key: connection.ssl?.key,
      };
    } else {
      // rejectUnauthorized=false to infer sslmode=prefer since hosted PG venders have SSL enabled.
      clientConfig.ssl = {
        rejectUnauthorized: false,
      };
    }
  }
  // when option is none. the `clientConfig.ssl` should is undefined. ref: https://github.com/sqlchat/sqlchat/issues/108

  let client = new Client(clientConfig);
  await client.connect();
  return client;
};

const testConnection = async (connection: Connection): Promise<boolean> => {
  const client = await newPostgresClient(connection);
  await client.end();
  return true;
};

const execute = async (connection: Connection, databaseName: string, statement: string): Promise<any> => {
  connection.database = databaseName;
  const client = await newPostgresClient(connection);
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
  const client = await newPostgresClient(connection);
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
  const client = await newPostgresClient(connection);
  const { rows } = await client.query(
    `SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema NOT IN (${systemSchemas}) AND table_name NOT IN (${systemTables}) AND table_type='BASE TABLE' AND table_catalog=$1;`,
    [databaseName]
  );
  await client.end();
  const tableList = [];
  for (const row of rows) {
    if (row["table_name"]) {
      if (row["table_schema"] !== "public") {
        tableList.push(`${row["table_schema"]}.${row["table_name"]}`);
        continue;
      }
      tableList.push(row["table_name"]);
    }
  }
  return tableList;
};

const getTableStructure = async (
  connection: Connection,
  databaseName: string,
  tableName: string,
  structureFetched: (tableName: string, structure: string) => void
): Promise<void> => {
  connection.database = databaseName;
  const client = await newPostgresClient(connection);
  const { rows } = await client.query(
    `SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema NOT IN (${systemSchemas}) AND table_name=$1;`,
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
  structureFetched(
    tableName,
    `CREATE TABLE \`${tableName}\` (
    ${columnList.join(",\n")}
  );`
  );
};

const getTableStructureBatch = async (
  connection: Connection,
  databaseName: string,
  tableNameList: string[],
  structureFetched: (tableName: string, structure: string) => void
): Promise<void> => {
  connection.database = databaseName;
  const client = await newPostgresClient(connection);
  await Promise.all(
    tableNameList.map(async (tableName) => {
      const { rows } = await client.query(
        `SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema NOT IN (${systemSchemas}) AND table_name=$1;`,
        [tableName]
      );
      const columnList = [];
      // TODO(steven): transform it to standard schema string.
      for (const row of rows) {
        columnList.push(
          `${row["column_name"]} ${row["data_type"].toUpperCase()} ${String(row["is_nullable"]).toUpperCase() === "NO" ? "NOT NULL" : ""}`
        );
      }
      structureFetched(
        tableName,
        `CREATE TABLE \`${tableName}\` (
        ${columnList.join(",\n")}
      );`
      );
    })
  ).finally(async () => {
    await client.end();
  });
};

const newConnector = (connection: Connection): Connector => {
  return {
    testConnection: () => testConnection(connection),
    execute: (databaseName: string, statement: string) => execute(connection, databaseName, statement),
    getDatabases: () => getDatabases(connection),
    getTables: (databaseName: string) => getTables(connection, databaseName),
    getTableStructure: (databaseName: string, tableName: string, structureFetched: (tableName: string, structure: string) => void) =>
      getTableStructure(connection, databaseName, tableName, structureFetched),
    getTableStructureBatch: (
      databaseName: string,
      tableNameList: string[],
      structureFetched: (tableName: string, structure: string) => void
    ) => getTableStructureBatch(connection, databaseName, tableNameList, structureFetched),
  };
};

export default newConnector;

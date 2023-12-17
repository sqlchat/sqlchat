import { Client, ClientConfig } from "pg";
import { Connection, ExecutionResult, Table, Schema } from "@/types";
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
    clientConfig.ssl = {
      ca: connection.ssl?.ca,
      cert: connection.ssl?.cert,
      key: connection.ssl?.key,
    };
  } else {
    clientConfig.ssl = {
      rejectUnauthorized: false,
    };
  }

  let client = new Client(clientConfig);

  if (connection.ssl) {
    await client.connect();
  } else {
    try {
      await client.connect();
    } catch (error) {
      // Because node-postgres didn't implement `sslmode: preferred`. So first try to connect via SSL, otherwise connect via non-SSL.
      // Connecting postgres via non-ssl requires `clientConfig.ssl` is undefined. ref: https://github.com/sqlchat/sqlchat/issues/108
      if (error instanceof Error && error.message.includes("The server does not support SSL connections")) {
        clientConfig.ssl = undefined;
        client = new Client(clientConfig);
        await client.connect();
      } else {
        throw error;
      }
    }
  }
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

const getTableSchema = async (connection: Connection, databaseName: string): Promise<Schema[]> => {
  connection.database = databaseName;
  const client = await newPostgresClient(connection);
  const { rows } = await client.query(
    `SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema NOT IN (${systemSchemas}) AND table_name NOT IN (${systemTables}) AND table_type='BASE TABLE' AND table_catalog=$1;`,
    [databaseName]
  );

  const schemaList: Schema[] = [];
  for (const row of rows) {
    if (row["table_name"]) {
      const schema = schemaList.find((schema) => schema.name === row["table_schema"]);
      if (schema) {
        schema.tables.push({ name: row["table_name"] as string, structure: "" } as Table);
      } else {
        schemaList.push({
          name: row["table_schema"],
          tables: [{ name: row["table_name"], structure: "" } as Table],
        });
      }
    }
  }

  for (const schema of schemaList) {
    for (const table of schema.tables) {
      const { rows: result } = await client.query(
        `SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema NOT IN (${systemSchemas}) AND table_name=$1 AND table_schema=$2;`,
        [table.name, schema.name]
      );
      const columnList = [];
      // TODO(steven): transform it to standard schema string.
      for (const row of result) {
        columnList.push(
          `${row["column_name"]} ${row["data_type"].toUpperCase()} ${String(row["is_nullable"]).toUpperCase() === "NO" ? "NOT NULL" : ""}`
        );
      }

      let fullTableName = schema.name == "public" ? `"${table.name}"` : `"${schema.name}"."${table.name}"`;
      table.structure = `CREATE TABLE ${fullTableName} (\n${columnList.join(",\n")}\n);`;
    }
  }

  await client.end();
  return schemaList;
};

const newConnector = (connection: Connection): Connector => {
  return {
    testConnection: () => testConnection(connection),
    execute: (databaseName: string, statement: string) => execute(connection, databaseName, statement),
    getDatabases: () => getDatabases(connection),
    getTableSchema: (databaseName: string) => getTableSchema(connection, databaseName),
  };
};

export default newConnector;

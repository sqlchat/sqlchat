import { ConnectionPool } from "mssql";
import { Connection, ExecutionResult, Schema, Table } from "@/types";
import { Connector } from "..";

const systemDatabases = ["master", "tempdb", "model", "msdb"];

const getMSSQLConnection = async (connection: Connection): Promise<ConnectionPool> => {
  const connectionOptions: any = {
    server: connection.host,
    port: parseInt(connection.port),
    user: connection.username,
    password: connection.password,
    database: connection.database,
    options: {
      encrypt: connection.encrypt === true,
    },
  };
  if (connection.ssl) {
    connectionOptions.ssl = {
      ca: connection.ssl?.ca,
      cert: connection.ssl?.cert,
      key: connection.ssl?.key,
    };
  }
  const pool = await new ConnectionPool(connectionOptions).connect();
  return pool;
};

const testConnection = async (connection: Connection): Promise<boolean> => {
  const pool = await getMSSQLConnection(connection);
  await pool.close();
  return true;
};

const execute = async (connection: Connection, databaseName: string, statement: string): Promise<any> => {
  const pool = await getMSSQLConnection(connection);
  const request = pool.request();
  const result = await request.query(`USE ${databaseName}; ${statement}`);
  await pool.close();

  const executionResult: ExecutionResult = {
    rawResult: result.recordset,
    affectedRows: result.rowsAffected.length,
  };
  return executionResult;
};

const getDatabases = async (connection: Connection): Promise<string[]> => {
  const pool = await getMSSQLConnection(connection);
  const request = pool.request();
  const result = await request.query(`SELECT name FROM sys.databases WHERE name NOT IN ('${systemDatabases.join("','")}');`);
  await pool.close();
  const databaseList = [];
  for (const row of result.recordset) {
    if (row["name"]) {
      databaseList.push(row["name"]);
    }
  }
  return databaseList;
};

const getTables = async (connection: Connection, databaseName: string): Promise<string[]> => {
  const pool = await getMSSQLConnection(connection);
  const request = pool.request();
  const result = await request.query(
    `SELECT TABLE_NAME as table_name FROM ${databaseName}.INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE';`
  );
  await pool.close();
  const tableList = [];
  for (const row of result.recordset) {
    if (row["table_name"]) {
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
  const pool = await getMSSQLConnection(connection);
  const request = pool.request();
  const { recordset } = await request.query(
    `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE FROM ${databaseName}.INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='dbo' AND TABLE_NAME='${tableName}';`
  );

  const columnList = [];
  // Transform to standard schema string.
  for (const row of recordset) {
    columnList.push(
      `${row["COLUMN_NAME"]} ${row["DATA_TYPE"].toUpperCase()} ${String(row["IS_NULLABLE"]).toUpperCase() === "NO" ? "NOT NULL" : ""}`
    );
  }
  structureFetched(
    tableName,
    `CREATE TABLE [${tableName}] (
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
  const pool = await getMSSQLConnection(connection);
  const request = pool.request();

  await Promise.all(
    tableNameList.map(async (tableName) => {
      const { recordset } = await request.query(
        `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE FROM ${databaseName}.INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='dbo' AND TABLE_NAME='${tableName}';`
      );
      const columnList = [];
      // Transform to standard schema string.
      for (const row of recordset) {
        columnList.push(
          `${row["COLUMN_NAME"]} ${row["DATA_TYPE"].toUpperCase()} ${String(row["IS_NULLABLE"]).toUpperCase() === "NO" ? "NOT NULL" : ""}`
        );
      }
      structureFetched(
        tableName,
        `CREATE TABLE [${tableName}] (
        ${columnList.join(",\n")}
      );`
      );
    })
  );
};

const getTableSchema = async (connection: Connection, databaseName: string): Promise<Schema[]> => {
  const pool = await getMSSQLConnection(connection);
  const request = pool.request();
  const schemaList: Schema[] = [];
  const result = await request.query(
    `SELECT TABLE_NAME as table_name, TABLE_SCHEMA as table_schema FROM ${databaseName}.INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE';`
  );
  for (const row of result.recordset) {
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
      const { recordset } = await request.query(
        `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE FROM ${databaseName}.INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='${schema.name}' AND TABLE_NAME='${table.name}';`
      );
      console.log(recordset);
      const columnList = [];
      // Transform to standard schema string.
      for (const row of recordset) {
        columnList.push(
          `${row["COLUMN_NAME"]} ${row["DATA_TYPE"].toUpperCase()} ${String(row["IS_NULLABLE"]).toUpperCase() === "NO" ? "NOT NULL" : ""}`
        );
      }
      table.structure = `CREATE TABLE [${table.name}] (
        ${columnList.join(",\n")}
      );`;
    }
  }
  console.log(schemaList);
  await pool.close();
  return schemaList;
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
    getTableSchema: (databaseName: string) => getTableSchema(connection, databaseName),
  };
};

export default newConnector;

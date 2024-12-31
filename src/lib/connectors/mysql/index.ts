import { ConnectionOptions } from "mysql2";
import mysql, { RowDataPacket } from "mysql2/promise";
import { Connection, ExecutionResult, Table, Schema } from "@/types";
import { Connector } from "..";

const systemDatabases = ["information_schema", "mysql", "performance_schema", "sys"];

const getMySQLConnection = async (connection: Connection): Promise<mysql.Connection> => {
  const connectionOptions: ConnectionOptions = {
    host: connection.host,
    port: parseInt(connection.port),
    user: connection.username,
    password: connection.password,
    database: connection.database,
  };
  if (connection.ssl) {
    connectionOptions.ssl = {
      ca: connection.ssl?.ca,
      cert: connection.ssl?.cert,
      key: connection.ssl?.key,
    };
  } else {
    // rejectUnauthorized=false to infer sslmode=prefer since hosted MySQL venders have SSL enabled.
    connectionOptions.ssl = {
      rejectUnauthorized: false,
    };
  }

  let conn;
  if (connection.ssl) {
    conn = await mysql.createConnection(connectionOptions);
  } else {
    try {
      conn = await mysql.createConnection(connectionOptions);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Server does not support secure")) {
        connectionOptions.ssl = undefined;
        conn = await mysql.createConnection(connectionOptions);
      } else {
        throw error;
      }
    }
  }
  return conn;
};

const testConnection = async (connection: Connection): Promise<boolean> => {
  const conn = await getMySQLConnection(connection);
  conn.destroy();
  return true;
};

const execute = async (connection: Connection, databaseName: string, statement: string): Promise<any> => {
  connection.database = databaseName;
  const conn = await getMySQLConnection(connection);
  const [rows] = await conn.execute(statement);
  conn.destroy();

  const executionResult: ExecutionResult = {
    rawResult: [],
    affectedRows: 0,
  };
  if (Array.isArray(rows)) {
    executionResult.rawResult = rows;
  } else {
    executionResult.affectedRows = rows.affectedRows;
  }
  return executionResult;
};

const getDatabases = async (connection: Connection): Promise<string[]> => {
  const conn = await getMySQLConnection(connection);
  const [rows] = await conn.query<RowDataPacket[]>(
    `SELECT schema_name as db_name FROM information_schema.schemata WHERE schema_name NOT IN (?);`,
    [systemDatabases]
  );
  conn.destroy();
  const databaseList = [];
  for (const row of rows) {
    if (row["db_name"]) {
      databaseList.push(row["db_name"]);
    }
  }
  return databaseList;
};

const getTableSchema = async (connection: Connection, databaseName: string): Promise<Schema[]> => {
  const conn = await getMySQLConnection(connection);
  // get All tableList from database
  const [rows] = await conn.query<RowDataPacket[]>(
    // SYSTEM VERSIONED is a special table for MariaDB https://mariadb.com/kb/en/system-versioned-tables/
    `SELECT TABLE_NAME as table_name FROM information_schema.tables WHERE TABLE_SCHEMA=? AND (TABLE_TYPE='BASE TABLE' || TABLE_TYPE='SYSTEM VERSIONED');`,
    [databaseName]
  );
  const tableList = [];
  for (const row of rows) {
    if (row["table_name"]) {
      tableList.push(row["table_name"]);
    }
  }
  const SchemaList: Schema[] = [{ name: "", tables: [] as Table[] }];

  for (const tableName of tableList) {
    const [rows] = await conn.query<RowDataPacket[]>(`SHOW CREATE TABLE \`${databaseName}\`.\`${tableName}\`;`);
    if (rows.length !== 1) {
      throw new Error("Unexpected number of rows.");
    }

    SchemaList[0].tables.push({ name: tableName, structure: rows[0]["Create Table"] || "" });
  }
  return SchemaList;
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

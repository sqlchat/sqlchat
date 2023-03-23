import axios from "axios";
import { uniqBy } from "lodash-es";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Connection, Database, Engine, Table, UNKNOWN_ID } from "@/types";
import { generateUUID } from "@/utils";

export const connectionMySQLSampleData: Connection = {
  id: UNKNOWN_ID,
  title: "",
  engineType: Engine.MySQL,
  host: "127.0.0.1",
  port: "3306",
  username: "root",
  password: "",
};

export const connectionPostgreSQLSampleData: Connection = {
  id: UNKNOWN_ID,
  title: "",
  engineType: Engine.PostgreSQL,
  host: "127.0.0.1",
  port: "5432",
  username: "postgres",
  password: "",
  database: "test",
};

interface ConnectionContext {
  connection: Connection;
  database?: Database;
}

interface ConnectionState {
  connectionList: Connection[];
  databaseList: Database[];
  currentConnectionCtx?: ConnectionContext;
  createConnection: (connection: Connection) => void;
  setCurrentConnectionCtx: (connectionCtx: ConnectionContext) => void;
  getOrFetchDatabaseList: (connection: Connection) => Promise<Database[]>;
  getOrFetchDatabaseSchema: (database: Database) => Promise<Table[]>;
}

export const useConnectionStore = create<ConnectionState>()(
  persist(
    (set, get) => ({
      connectionList: [],
      databaseList: [],
      createConnection: (connection: Connection) => {
        set((state) => ({
          ...state,
          connectionList: [
            ...state.connectionList,
            {
              ...connection,
              id: generateUUID(),
            },
          ],
        }));
      },
      setCurrentConnectionCtx: (connectionCtx: ConnectionContext) =>
        set((state) => ({
          ...state,
          currentConnectionCtx: connectionCtx,
        })),
      getOrFetchDatabaseList: async (connection: Connection) => {
        const { data } = await axios.post<string[]>("/api/connection/db", {
          connection,
        });
        const fetchedDatabaseList = data.map(
          (dbName) =>
            ({
              connectionId: connection.id,
              name: dbName,
              tableList: {},
            } as Database)
        );
        const state = get();
        const databaseList = uniqBy(
          [...state.databaseList, ...fetchedDatabaseList],
          (database) => `${database.connectionId}_${database.name}`
        );
        set((state) => ({
          ...state,
          databaseList,
        }));
        return databaseList.filter((database) => database.connectionId === connection.id);
      },
      getOrFetchDatabaseSchema: async (database: Database) => {
        const state = get();
        const connection = state.connectionList.find((connection) => connection.id === database.connectionId);
        if (!connection) {
          return [];
        }

        const { data } = await axios.post<Table[]>("/api/connection/db_schema", {
          connection,
          db: database.name,
        });
        return data;
      },
    }),
    {
      name: "connection-storage",
    }
  )
);

export const testConnection = async (connection: Connection) => {
  const { data: result } = await axios.post<boolean>("/api/connection/test", {
    connection,
  });
  return result;
};

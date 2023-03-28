import axios from "axios";
import { uniqBy } from "lodash-es";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Connection, Database, Table } from "@/types";
import { generateUUID } from "@/utils";

interface ConnectionContext {
  connection: Connection;
  database?: Database;
}

interface ConnectionState {
  connectionList: Connection[];
  databaseList: Database[];
  currentConnectionCtx?: ConnectionContext;
  createConnection: (connection: Connection) => Connection;
  setCurrentConnectionCtx: (connectionCtx: ConnectionContext | undefined) => void;
  getOrFetchDatabaseList: (connection: Connection) => Promise<Database[]>;
  getOrFetchDatabaseSchema: (database: Database) => Promise<Table[]>;
  clearConnection: (filter: (connection: Connection) => boolean) => void;
}

export const useConnectionStore = create<ConnectionState>()(
  persist(
    (set, get) => ({
      connectionList: [],
      databaseList: [],
      createConnection: (connection: Connection) => {
        const createdConnection = {
          ...connection,
          id: generateUUID(),
        };
        set((state) => ({
          ...state,
          connectionList: [...state.connectionList, createdConnection],
        }));
        return createdConnection;
      },
      setCurrentConnectionCtx: (connectionCtx: ConnectionContext | undefined) =>
        set((state) => ({
          ...state,
          currentConnectionCtx: connectionCtx,
        })),
      getOrFetchDatabaseList: async (connection: Connection) => {
        const state = get();
        if (state.databaseList.some((database) => database.connectionId === connection.id)) {
          return state.databaseList.filter((database) => database.connectionId === connection.id);
        }

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
      clearConnection: (filter: (connection: Connection) => boolean) => {
        set((state) => ({
          ...state,
          connectionList: state.connectionList.filter(filter),
        }));
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

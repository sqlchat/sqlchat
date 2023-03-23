import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Connection, Database, Engine, UNKNOWN_ID } from "@/types";
import { generateUUID } from "@/utils";
import axios from "axios";
import { uniqBy } from "lodash-es";

export const connectionSampleData: Connection = {
  id: UNKNOWN_ID,
  title: "",
  engineType: Engine.MySQL,
  host: "127.0.0.1",
  port: "3306",
  username: "root",
  password: "",
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
}

export const useConnectionStore = create<ConnectionState>()(
  persist(
    (set, get) => ({
      connectionList: [connectionSampleData],
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

import axios from "axios";
import { uniqBy } from "lodash-es";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Connection, Database, Engine, ResponseObject, Table } from "@/types";
import { generateUUID } from "@/utils";

interface ConnectionContext {
  connection: Connection;
  database?: Database;
}

const samplePGConnection: Connection = {
  id: "sample-pg",
  title: "Sample PostgreSQL",
  engineType: Engine.PostgreSQL,
  host: "db.swxkyqvcefxcjecynews.supabase.co",
  port: "5432",
  username: "readonly_user",
  password: "sqlchat",
  database: "sample-employee",
};

interface ConnectionState {
  connectionList: Connection[];
  databaseList: Database[];
  currentConnectionCtx?: ConnectionContext;
  createConnection: (connection: Connection) => Connection;
  setCurrentConnectionCtx: (connectionCtx: ConnectionContext | undefined) => void;
  getOrFetchDatabaseList: (connection: Connection, skipCache?: boolean) => Promise<Database[]>;
  getOrFetchDatabaseSchema: (database: Database) => Promise<Table[]>;
  getConnectionById: (connectionId: string) => Connection | undefined;
  updateConnection: (connectionId: string, connection: Partial<Connection>) => void;
  clearConnection: (filter: (connection: Connection) => boolean) => void;
}

export const useConnectionStore = create<ConnectionState>()(
  persist(
    (set, get) => ({
      connectionList: [samplePGConnection],
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
      getOrFetchDatabaseList: async (connection: Connection, skipCache = false) => {
        const state = get();

        if (!skipCache) {
          if (state.databaseList.some((database) => database.connectionId === connection.id)) {
            return state.databaseList.filter((database) => database.connectionId === connection.id);
          }
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
          [...fetchedDatabaseList, ...state.databaseList],
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

        const { data: result } = await axios.post<ResponseObject<Table[]>>("/api/connection/db_schema", {
          connection,
          db: database.name,
        });
        if (result.message) {
          throw result.message;
        }
        return result.data;
      },
      getConnectionById: (connectionId: string) => {
        return get().connectionList.find((connection) => connection.id === connectionId);
      },
      updateConnection: (connectionId: string, connection: Partial<Connection>) => {
        set((state) => ({
          ...state,
          connectionList: state.connectionList.map((item) => (item.id === connectionId ? { ...item, ...connection } : item)),
        }));
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

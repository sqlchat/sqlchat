import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Connection, Database } from "@/types";

interface ConnectionContext {
  connection: Connection;
  database: Database;
}

interface ConnectionState {
  connectionList: Connection[];
  databaseList: Database[];
  currentConnectionCtx?: ConnectionContext;
  createConnection: (connection: Connection) => void;
  setCurrentConnectionCtx: (connectionCtx: ConnectionContext) => void;
}

export const useConnectionStore = create<ConnectionState>()(
  persist(
    (set) => ({
      connectionList: [],
      databaseList: [],
      createConnection: (connection: Connection) => {
        set((state) => ({
          connectionList: [...state.connectionList, connection],
        }));
      },
      setCurrentConnectionCtx: (connectionCtx: ConnectionContext) =>
        set(() => ({
          currentConnectionCtx: connectionCtx,
        })),
    }),
    {
      name: "connection-storage",
    }
  )
);

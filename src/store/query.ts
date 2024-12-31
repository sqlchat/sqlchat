import { merge } from "lodash-es";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Connection, Database, Id, Timestamp } from "@/types";

interface ExecuteQueryContext {
  connection: Connection;
  database?: Database;
  messageId?: Id;
  statement: string;
}

interface QueryHistory {
  context: ExecuteQueryContext;
  createdAt: Timestamp;
}

interface QueryState {
  showDrawer: boolean;
  queryHistory: QueryHistory[];
  context?: ExecuteQueryContext;
  toggleDrawer: (show?: boolean) => void;
  setContext: (context: ExecuteQueryContext | undefined) => void;
}

export const useQueryStore = create<QueryState>()(
  persist(
    (set) => ({
      showDrawer: false,
      queryHistory: [],
      toggleDrawer: (show) => {
        set((state) => ({
          ...state,
          showDrawer: show ?? !state.showDrawer,
        }));
      },
      setContext: (context) => {
        set((state) => ({
          ...state,
          context,
        }));
      },
    }),
    {
      name: "query-storage",
      merge: (persistedState, currentState) => {
        return {
          ...merge(currentState, persistedState),
          context: undefined,
        };
      },
    }
  )
);

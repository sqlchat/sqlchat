import { create } from "zustand";
import { Connection, Database } from "@/types";

interface ExecuteQueryContext {
  connection: Connection;
  database?: Database;
  statement: string;
}

interface QueryState {
  context?: ExecuteQueryContext;
  showDrawer: boolean;
  toggleDrawer: (show?: boolean) => void;
  setContext: (context: ExecuteQueryContext | undefined) => void;
}

export const useQueryStore = create<QueryState>()((set) => ({
  showDrawer: false,
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
}));

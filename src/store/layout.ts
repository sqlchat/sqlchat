import { isUndefined } from "lodash-es";
import { create } from "zustand";

// reference: https://tailwindcss.com/docs/responsive-design
export enum ResponsiveWidth {
  sm = 640,
  lg = 1024,
}

interface LayoutState {
  showSidebar: boolean;
  toggleSidebar: (show?: boolean) => void;
}

export const useLayoutStore = create<LayoutState>()((set) => ({
  showSidebar: true,
  toggleSidebar: (show) => {
    if (isUndefined(show)) {
      set((state) => ({
        ...state,
        showSidebar: !state.showSidebar,
      }));
    } else {
      set((state) => ({
        ...state,
        showSidebar: show,
      }));
    }
  },
}));

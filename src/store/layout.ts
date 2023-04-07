import { isUndefined } from "lodash-es";
import { create } from "zustand";

// reference: https://tailwindcss.com/docs/responsive-design
export enum ResponsiveWidth {
  sm = 640,
}

interface LayoutState {
  showSidebar: boolean;
  isMobileView: boolean;
  toggleSidebar: (show?: boolean) => void;
  setIsMobileView: (value: boolean) => void;
}

export const useLayoutStore = create<LayoutState>()((set) => ({
  showSidebar: true,
  isMobileView: false,
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
  setIsMobileView: (value) => {
    set((state) => ({
      ...state,
      isMobileView: value,
    }));
  },
}));

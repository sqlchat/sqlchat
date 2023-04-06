import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Setting } from "@/types";

const getDefaultSetting = (): Setting => {
  return {
    locale: "en",
  };
};

interface SettingState {
  setting: Setting;
  setLocale: (locale: Setting["locale"]) => void;
}

export const useSettingStore = create<SettingState>()(
  persist(
    (set, get) => ({
      getState: () => get(),
      setting: getDefaultSetting(),
      setLocale: (locale: Setting["locale"]) => {
        set({
          setting: {
            ...get().setting,
            locale,
          },
        });
      },
    }),
    {
      name: "setting-storage",
    }
  )
);

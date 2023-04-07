import { merge } from "lodash-es";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Setting } from "@/types";

const getDefaultSetting = (): Setting => {
  return {
    locale: "en",
    openAIApiConfig: {
      key: "",
      endpoint: "",
    },
  };
};

interface SettingState {
  setting: Setting;
  setLocale: (locale: Setting["locale"]) => void;
  setOpenAIApiConfig: (openAIApiConfig: Setting["openAIApiConfig"]) => void;
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
      setOpenAIApiConfig: (openAIApiConfig: Setting["openAIApiConfig"]) => {
        set({
          setting: {
            ...get().setting,
            openAIApiConfig,
          },
        });
      },
    }),
    {
      name: "setting-storage",
      merge: (persistedState, currentState) => merge(currentState, persistedState),
    }
  )
);

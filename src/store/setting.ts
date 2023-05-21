import { merge } from "lodash-es";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Setting } from "@/types";

const getDefaultSetting = (): Setting => {
  return {
    locale: "en",
    theme: "system",
    openAIApiConfig: {
      key: "",
      endpoint: "",
      model: "gpt-3.5-turbo",
    },
  };
};

interface SettingState {
  setting: Setting;
  getState: () => SettingState;
  setLocale: (locale: Setting["locale"]) => void;
  setTheme: (theme: Setting["theme"]) => void;
  setOpenAIApiConfig: (openAIApiConfig: Setting["openAIApiConfig"]) => void;
}

export const useSettingStore = create<SettingState>()(
  persist(
    (set, get) => ({
      setting: getDefaultSetting(),
      getState: () => get(),
      setLocale: (locale: Setting["locale"]) => {
        set({
          setting: {
            ...get().setting,
            locale,
          },
        });
      },
      setTheme: (theme: Setting["theme"]) => {
        set({
          setting: {
            ...get().setting,
            theme,
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

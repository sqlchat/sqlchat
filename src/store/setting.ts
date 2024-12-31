import { merge } from "lodash-es";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Setting, DashScopeApiConfig } from "@/types";

const getDefaultSetting = (): Setting => {
  return {
    locale: "en",
    theme: "system",
    activeProvider: "openai",
    openAIApiConfig: {
      key: "",
      endpoint: "",
      model: "gpt-3.5-turbo",
    },
    dashScopeApiConfig: {
      key: "",
      model: "qwen-turbo",
    },
  };
};

interface SettingState {
  setting: Setting;
  getState: () => SettingState;
  setLocale: (locale: Setting["locale"]) => void;
  setTheme: (theme: Setting["theme"]) => void;
  setActiveProvider: (provider: Setting["activeProvider"]) => void;
  setOpenAIApiConfig: (openAIApiConfig: Setting["openAIApiConfig"]) => void;
  setDashScopeApiConfig: (dashScopeApiConfig: DashScopeApiConfig) => void;
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
      setActiveProvider: (activeProvider: Setting["activeProvider"]) => {
        set({
          setting: {
            ...get().setting,
            activeProvider,
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
      setDashScopeApiConfig: (dashScopeApiConfig: DashScopeApiConfig) => {
        set({
          setting: {
            ...get().setting,
            dashScopeApiConfig,
          },
        });
      },
    }),
    {
      name: "setting-storage",
      merge: (persistedState: any, currentState: any) => {
        return merge(currentState, persistedState);
      },
    }
  )
);

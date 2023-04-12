import { Analytics } from "@vercel/analytics/react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { AppProps } from "next/app";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useSettingStore } from "@/store";

dayjs.extend(localizedFormat);
import "dayjs/locale/zh";

import "@/locales/i18n";
import "@/styles/tailwind.css";
import "@/styles/global.css";
import "@/styles/data-table.css";
import "@/styles/mui.css";

function MyApp({ Component, pageProps }: AppProps) {
  const { i18n } = useTranslation();
  const settingStore = useSettingStore();

  useEffect(() => {
    const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleColorSchemeChange = (e: MediaQueryListEvent) => {
      if (settingStore.getState().setting.theme === "system") {
        const theme = e.matches ? "dark" : "light";
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add(theme);
      }
    };

    try {
      if (darkMediaQuery.addEventListener) {
        darkMediaQuery.addEventListener("change", handleColorSchemeChange);
      } else {
        darkMediaQuery.addListener(handleColorSchemeChange);
      }
    } catch (error) {
      console.error("failed to initial color scheme listener", error);
    }
  }, []);

  useEffect(() => {
    const locale = settingStore.setting.locale;
    i18n.changeLanguage(locale);
    document.documentElement.setAttribute("lang", locale);
  }, [settingStore.setting.locale]);

  useEffect(() => {
    const theme = settingStore.setting.theme;
    let currentAppearance = theme;
    if (theme === "system") {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        currentAppearance = "dark";
      } else {
        currentAppearance = "light";
      }
    }

    document.documentElement.classList.remove("dark");
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add(currentAppearance);
  }, [settingStore.setting.theme]);

  return (
    <>
      <Component {...pageProps} />
      <Toaster />
      <Analytics />
    </>
  );
}

export default MyApp;

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

function MyApp({ Component, pageProps }: AppProps) {
  const { i18n } = useTranslation();
  const settingStore = useSettingStore();

  useEffect(() => {
    const locale = settingStore.setting.locale;
    i18n.changeLanguage(locale);
    document.documentElement.setAttribute("lang", locale);
  }, [settingStore.setting.locale]);

  return (
    <>
      <Component {...pageProps} />
      <Toaster />
      <Analytics />
    </>
  );
}

export default MyApp;

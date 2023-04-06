import { Analytics } from "@vercel/analytics/react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { AppProps } from "next/app";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
dayjs.extend(localizedFormat);
import { useSettingStore } from "@/store";

import "@/locales/i18n";
import "@/styles/tailwind.css";
import "@/styles/global.css";
import "@/styles/data-table.css";

function MyApp({ Component, pageProps }: AppProps) {
  const { i18n } = useTranslation();
  const settingStore = useSettingStore();

  useEffect(() => {
    i18n.changeLanguage(settingStore.setting.locale);
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

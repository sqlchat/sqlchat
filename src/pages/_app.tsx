import { AppProps } from "next/app";
import React from "react";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);

import "@/styles/tailwind.css";
import "@/styles/global.css";
import "@/styles/data-table.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster />
      <Analytics />
    </>
  );
}

export default MyApp;

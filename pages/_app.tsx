import { AppProps } from "next/app";
import React from "react";
import { Analytics } from "@vercel/analytics/react";
import "../styles/tailwind.css";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster position="top-right" />
      <Analytics />
    </>
  );
}

export default MyApp;

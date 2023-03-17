import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import Icon from "../components/Icon";

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>ChatDBA</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full min-h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center px-4 py-16">
          <h1 className="text-5xl font-extrabold text-gray-800 sm:text-6xl">ChatDBA</h1>
          <div className="grid grid-cols-1 mt-8">
            <Link
              className="flex max-w-xs flex-row justify-center items-center rounded-xl bg-gray-700 p-4 px-6 text-white shadow hover:opacity-80"
              href="/chat"
            >
              <Icon.Io.IoIosChatbubbles className="w-6 h-auto mr-2" />
              <span className="text-xl font-medium">Chat →</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default HomePage;

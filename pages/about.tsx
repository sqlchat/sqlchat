import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import Icon from "@/components/Icon";

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>SQL Chat</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full h-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center px-4 py-16">
          <h1 className="text-5xl font-extrabold text-gray-800 sm:text-6xl">SQL Chat</h1>
          <div className="grid grid-cols-1 mt-8">
            <Link
              className="flex max-w-xs flex-row justify-center items-center rounded-xl bg-indigo-600 p-4 px-6 text-white shadow-lg hover:opacity-80"
              href="/"
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

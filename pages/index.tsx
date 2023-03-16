import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>ChatDBA</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <div className="flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">ChatDBA</h1>
          <div className="grid grid-cols-1 gap-4">
            <Link className="flex max-w-xs flex-col rounded-xl bg-gray-800 p-4 px-6 text-white hover:opacity-80" href="/chat">
              <h3 className="text-2xl font-medium">Chat →</h3>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default HomePage;

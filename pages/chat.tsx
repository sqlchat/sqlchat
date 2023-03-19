import { NextPage } from "next";
import Head from "next/head";
import React from "react";
import ChatView from "../components/ChatView";

const ChatPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>ChatDBA</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full h-screen flex flex-col justify-center items-center bg-gray-100">
        <div className="w-full h-full md:w-4/5 md:max-w-4xl md:h-5/6">
          <ChatView />
        </div>
      </main>
    </div>
  );
};

export default ChatPage;

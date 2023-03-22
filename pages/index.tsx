import { NextPage } from "next";
import Head from "next/head";
import React from "react";
import ChatView from "@/components/ChatView";

const ChatPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>SQL Chat</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full h-full flex flex-col justify-center items-center bg-gray-100">
        <ChatView />
      </main>
    </div>
  );
};

export default ChatPage;

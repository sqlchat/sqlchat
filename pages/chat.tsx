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

      <main className="w-full h-screen">
        <ChatView />
      </main>
    </div>
  );
};

export default ChatPage;

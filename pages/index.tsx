import { NextPage } from "next";
import Head from "next/head";
import React from "react";
import dynamic from "next/dynamic";

// Use dynamic import to avoid page hydrated.
// reference: https://github.com/pmndrs/zustand/issues/1145#issuecomment-1316431268
const ConnectionSidebar = dynamic(() => import("@/components/ConnectionSidebar"), {
  ssr: false,
});
const ChatView = dynamic(() => import("@/components/ChatView"), {
  ssr: false,
});

const ChatPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>SQL Chat</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full h-full flex flex-row justify-start items-start">
        <ConnectionSidebar />
        <ChatView />
      </main>
    </div>
  );
};

export default ChatPage;

import { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import Script from "next/script";
import React, { useEffect } from "react";
import { ResponsiveWidth, useLayoutStore } from "@/store";

// Use dynamic import to avoid page hydrated.
// reference: https://github.com/pmndrs/zustand/issues/1145#issuecomment-1316431268
const ConnectionSidebar = dynamic(() => import("@/components/ConnectionSidebar"), {
  ssr: false,
});
const ChatView = dynamic(() => import("@/components/ChatView"), {
  ssr: false,
});
const QueryDrawer = dynamic(() => import("@/components/QueryDrawer"), {
  ssr: false,
});

const ChatPage: NextPage = () => {
  const layoutStore = useLayoutStore();

  useEffect(() => {
    const handleWindowResize = () => {
      if (window.innerWidth < ResponsiveWidth.lg) {
        layoutStore.toggleSidebar(false);
      } else {
        layoutStore.toggleSidebar(true);
      }
    };

    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <div>
      <Head>
        <title>SQL Chat</title>
        <link rel="icon" href="/chat-logo-bot.webp" />
        <meta name="description" content="Chat-based SQL Client" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="og:title" property="og:title" content="SQL Chat" />
        <meta name="og:description" property="og:description" content="Chat-based SQL Client" />
        <meta name="og:image" property="og:image" content="https://www.sqlchat.ai/chat-logo-and-text.webp" />
        <meta name="og:url" property="og:url" content="https://www.sqlchat.ai" />
      </Head>

      <main className="drawer drawer-mobile w-full h-full">
        <input
          id="connection-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={layoutStore.showSidebar}
          onChange={(e) => layoutStore.toggleSidebar(e.target.checked)}
        />
        <ChatView />
        {/* Render sidebar after chatview to prevent z-index problem */}
        <ConnectionSidebar />
        <QueryDrawer />
      </main>

      <Script defer data-domain="sqlchat.ai" src="https://plausible.io/js/script.js" />
    </div>
  );
};

export default ChatPage;

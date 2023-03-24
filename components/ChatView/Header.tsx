import { useEffect } from "react";
import { useChatStore } from "@/store";
import Icon from "../Icon";

const Header = () => {
  const chatStore = useChatStore();
  const currentChat = chatStore.currentChat;
  const title = currentChat?.title || "SQL Chat";

  useEffect(() => {
    document.title = `${title} - SQL Chat`;
  }, [title]);

  return (
    <div className="sticky top-0 w-full flex flex-row justify-between items-center lg:grid lg:grid-cols-3 py-2 border-b bg-white">
      <div className="ml-2 flex justify-center items-center">
        <label htmlFor="connection-drawer" className="w-8 h-8 p-1 mr-1 block lg:hidden rounded-md cursor-pointer hover:bg-gray-100">
          <Icon.Io.IoIosMenu className="text-gray-600 w-full h-auto" />
        </label>
        <span className="w-auto text-left block lg:hidden">{title}</span>
      </div>
      <span className="w-auto text-center h-8 p-1 hidden lg:block">{title}</span>
      <div className="mr-2 sm:mr-4 relative flex flex-row justify-end items-center">
        <a
          href="https://www.bytebase.com?source=sqlchat"
          className="flex flex-row justify-center items-center px-2 py-1 rounded-md whitespace-nowrap hover:bg-gray-100 hover:shadow"
          target="_blank"
        >
          <span className="text-sm text-gray-600 hidden sm:block">Crafted by</span>
          <img className="h-5 w-auto ml-1" src="/bytebase-logo-full.png" alt="" />
        </a>
      </div>
    </div>
  );
};

export default Header;

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
    <div className="sticky top-0 w-full grid grid-cols-3 py-2 border-b bg-white">
      <div className="ml-4 relative flex justify-center">
        <Icon.Io.IoIosMenu className="text-gray-600 w-5 h-auto block sm:hidden" />
      </div>
      <span className="w-auto text-center">{title}</span>
      <div className="sm:mr-4 relative flex flex-row justify-end items-center">
        <a
          href="https://www.bytebase.com?source=sqlchat"
          className="flex flex-row justify-center items-center px-2 py-1 rounded-md hover:bg-gray-100 hover:shadow"
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

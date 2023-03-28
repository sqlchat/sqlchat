import { useEffect } from "react";
import { useChatStore } from "@/store";
import Icon from "../Icon";

interface Props {
  className?: string;
}

const Header = (props: Props) => {
  const { className } = props;
  const chatStore = useChatStore();
  const currentChat = chatStore.currentChat;
  const title = currentChat?.title || "SQL Chat";

  useEffect(() => {
    document.title = `${title}`;
  }, [title]);

  return (
    <div
      className={`${
        className || ""
      } sticky top-0 w-full flex flex-row justify-between items-center lg:grid lg:grid-cols-3 py-1 border-b bg-white z-1`}
    >
      <div className="ml-2 flex justify-start items-center">
        <label htmlFor="connection-drawer" className="w-8 h-8 p-1 mr-1 block lg:hidden rounded-md cursor-pointer hover:bg-gray-100">
          <Icon.IoIosMenu className="text-gray-600 w-full h-auto" />
        </label>
        <span className="w-auto text-left block lg:hidden">{title}</span>
        <a
          className="ml-1 w-10 h-10 p-1 rounded-lg hidden lg:flex flex-row justify-center items-center hover:bg-gray-100"
          href="https://github.com/bytebase/sqlchat"
          target="_blank"
        >
          <Icon.IoLogoGithub className="text-gray-600 w-6 h-auto" />
        </a>
      </div>
      <span className="w-auto text-center h-8 p-1 hidden lg:block">{title}</span>
      <div className="mr-2 sm:mr-3 relative flex flex-row justify-end items-center">
        <a
          href="https://www.bytebase.com?source=sqlchat"
          className="flex flex-row justify-center items-center h-10 px-3 py-1 rounded-md whitespace-nowrap hover:bg-gray-100"
          target="_blank"
        >
          <img className="h-6 w-auto ml-1" src="/craft-by-bytebase.webp" alt="" />
        </a>
      </div>
    </div>
  );
};

export default Header;

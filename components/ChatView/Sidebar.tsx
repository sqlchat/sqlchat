import Link from "next/link";
import { useEffect, useState } from "react";
import { useChatStore, useUserStore } from "../../store";
import { Chat, User } from "../../types";
import Icon from "../Icon";

const Sidebar = () => {
  const userStore = useUserStore();
  const chatStore = useChatStore();
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

  useEffect(() => {
    setCurrentChat(chatStore.currentChat);
  }, [chatStore.currentChat]);

  const handleAssistantClick = (user: User) => {
    for (const chat of chatStore.chatList) {
      if (chat.userId === user.id) {
        chatStore.setCurrentChat(chat);
        return;
      }
    }
    chatStore.createChat(user);
  };

  return (
    <div className="w-52 lg:w-64 h-full transition-all shrink-0 border-r px-3 flex flex-col justify-start items-center sticky top-0 bg-white sm:rounded-l-md">
      <h2 className="py-4 w-full flex flex-row justify-center items-center">
        <Icon.Io.IoIosChatbubbles className="text-gray-600 mr-2 w-6 h-auto" /> Assistant list
      </h2>
      <div className="w-full mt-2 flex flex-col justify-start items-start">
        {userStore.assistantList.map((assistant) => (
          <div
            className={`w-full py-2 px-3 rounded-md mb-2 cursor-pointer hover:opacity-80 hover:bg-gray-100 ${
              currentChat?.userId === assistant.id && "shadow bg-gray-100 font-medium"
            }`}
            onClick={() => handleAssistantClick(assistant)}
            key={assistant.id}
          >
            {assistant.name}
          </div>
        ))}
      </div>
      <div className="grow w-full flex flex-col justify-end items-center pb-6">
        <div className="w-full flex flex-row justify-center items-center space-x-3">
          <Link href="/" className="p-1 rounded-md hover:shadow hover:bg-gray-100">
            <Icon.Io.IoMdHome className="text-gray-600 w-6 h-auto" />
          </Link>
          <a href="https://github.com/bytebase/chatdba" target="_blank" className="p-1 rounded-md hover:shadow hover:bg-gray-100">
            <Icon.Io.IoLogoGithub className="text-gray-600 w-6 h-auto" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

import { useEffect, useState } from "react";
import { useChatStore, useUserStore } from "../../store";
import { Chat, User } from "../../types";

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
    <div className="w-52 lg:w-64 h-full transition-all shrink-0 border-r p-2 sticky top-0">
      <h2 className="pt-2 pb-4 w-full text-center">Assistant list</h2>
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
    </div>
  );
};

export default Sidebar;

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Chat, UNKNOWN_ID, User } from "@/types";
import { generateUUID } from "@/utils";

const getDefaultChat = (): Chat => {
  return {
    id: generateUUID(),
    connectionId: UNKNOWN_ID,
    databaseName: "",
    assistantId: "sql-assistant",
    title: "default chat",
    createdAt: Date.now(),
  };
};

interface ChatState {
  chatList: Chat[];
  currentChat: Chat;
  createChat: (user: User) => void;
  setCurrentChat: (chat: Chat) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chatList: [getDefaultChat()],
      currentChat: getDefaultChat(),
      createChat: (assistant: User) => {
        const chat: Chat = {
          ...getDefaultChat(),
          assistantId: assistant.id,
        };
        set((state) => ({
          chatList: [...state.chatList, chat],
          currentChat: chat,
        }));
      },
      setCurrentChat: (chat: Chat) => set(() => ({ currentChat: chat })),
    }),
    {
      name: "chat-storage",
    }
  )
);

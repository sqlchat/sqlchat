import dayjs from "dayjs";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Chat, Id } from "@/types";
import { generateUUID } from "@/utils";

const getDefaultChat = (): Chat => {
  return {
    id: generateUUID(),
    assistantId: "sql-assistant",
    title: "SQL Chat " + dayjs().format("LTS"),
    createdAt: Date.now(),
  };
};

interface ChatState {
  chatList: Chat[];
  currentChat?: Chat;
  createChat: (connectionId?: Id, databaseName?: string) => void;
  setCurrentChat: (chat: Chat) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chatList: [],
      createChat: (connectionId?: Id, databaseName?: string) => {
        const chat: Chat = {
          ...getDefaultChat(),
          connectionId,
          databaseName,
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

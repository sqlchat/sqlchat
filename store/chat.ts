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
  getState: () => ChatState;
  createChat: (connectionId?: Id, databaseName?: string) => Chat;
  setCurrentChat: (chat: Chat | undefined) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chatList: [],
      getState: () => get(),
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
        return chat;
      },
      setCurrentChat: (chat: Chat | undefined) => set(() => ({ currentChat: chat })),
    }),
    {
      name: "chat-storage",
    }
  )
);

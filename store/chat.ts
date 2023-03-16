import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Chat, User } from "../types";
import { generateUUID } from "../utils";

const defaultChat: Chat = {
  id: generateUUID(),
  userId: "assistant-chatgpt",
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
      chatList: [defaultChat],
      currentChat: defaultChat,
      createChat: (user: User) => {
        const chat = {
          id: generateUUID(),
          userId: user.id,
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

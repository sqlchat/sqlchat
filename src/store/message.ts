import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Id, Message } from "@/types";

interface MessageState {
  messageList: Message[];
  getState: () => MessageState;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: Id, message: Partial<Message>) => void;
  clearMessage: (filter: (message: Message) => boolean) => void;
}

export const useMessageStore = create<MessageState>()(
  persist(
    (set, get) => ({
      messageList: [],
      getState: () => get(),
      addMessage: (message: Message) => set((state) => ({ messageList: [...state.messageList, message] })),
      updateMessage: (messageId: Id, message: Partial<Message>) => {
        set((state) => ({
          ...state,
          messageList: state.messageList.map((item) => (item.id === messageId ? { ...item, ...message } : item)),
        }));
      },
      clearMessage: (filter: (message: Message) => boolean) => set((state) => ({ messageList: state.messageList.filter(filter) })),
    }),
    {
      name: "message-storage",
    }
  )
);

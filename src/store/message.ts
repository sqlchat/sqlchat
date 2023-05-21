import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Id, Message } from "@/types";

interface MessageState {
  messageList: Message[];
  getState: () => MessageState;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: Id, message: Partial<Message>) => void;
  updateStatement: (messageId: Id, originalStatement: string, replacementStatement: string) => void;
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
      updateStatement: (messageId: Id, originalStatement: string, replacementStatement: string) => {
        if (!originalStatement) return;
        const newMessage = get().messageList.find((message) => message.id == messageId);
        if (!newMessage) return;
        newMessage.content = newMessage.content.replace(originalStatement, replacementStatement);
        set((state) => ({
          ...state,
          messageList: state.messageList.map((item) => (item.id === messageId ? newMessage : item)),
        }));
      },
      clearMessage: (filter: (message: Message) => boolean) => set((state) => ({ messageList: state.messageList.filter(filter) })),
    }),
    {
      name: "message-storage",
    }
  )
);

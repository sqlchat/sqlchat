import { uniqBy } from "lodash-es";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Id, Message } from "@/types";

interface MessageState {
  messageList: Message[];
  getState: () => MessageState;
  addMessage: (message: Message) => void;
  updateMessageContent: (messageId: Id, content: string) => void;
  clearMessage: (filter: (message: Message) => boolean) => void;
}

export const useMessageStore = create<MessageState>()(
  persist(
    (set, get) => ({
      messageList: [],
      getState: () => get(),
      addMessage: (message: Message) => set((state) => ({ messageList: [...state.messageList, message] })),
      updateMessageContent: (messageId: Id, content: string) => {
        const message = get().messageList.find((message) => message.id === messageId);
        if (!message) {
          return;
        }
        message.content = content;
        set((state) => ({ messageList: uniqBy([...state.messageList, message], (message) => message.id) }));
      },
      clearMessage: (filter: (message: Message) => boolean) => set((state) => ({ messageList: state.messageList.filter(filter) })),
    }),
    {
      name: "message-storage",
    }
  )
);

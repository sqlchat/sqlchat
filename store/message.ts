import { uniqBy } from "lodash-es";
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
        const rawMessage = get().messageList.find((message) => message.id === messageId);
        if (!rawMessage) {
          return;
        }
        set((state) => ({
          messageList: uniqBy(
            [
              ...state.messageList,
              {
                ...rawMessage,
                ...message,
              },
            ],
            (message) => message.id
          ),
        }));
      },
      clearMessage: (filter: (message: Message) => boolean) => set((state) => ({ messageList: state.messageList.filter(filter) })),
    }),
    {
      name: "message-storage",
    }
  )
);

import { create } from "zustand";
import { Message } from "../types";

interface MessageState {
  messageList: Message[];
  getState: () => MessageState;
  addMessage: (message: Message) => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messageList: [],
  getState: () => get(),
  addMessage: (message: Message) => set((state) => ({ messageList: [...state.messageList, message] })),
}));

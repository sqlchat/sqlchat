import dayjs from "dayjs";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Conversation, Id } from "@/types";
import { generateUUID } from "@/utils";
import { GeneralBotId, SQLChatBotId } from ".";

const getDefaultConversation = (): Conversation => {
  return {
    id: generateUUID(),
    assistantId: GeneralBotId,
    title: dayjs().format("LTS"),
    createdAt: Date.now(),
  };
};

interface ConversationState {
  getState: () => ConversationState;
  conversationList: Conversation[];
  currentConversation?: Conversation;
  createConversation: (connectionId?: Id, databaseName?: string) => Conversation;
  setCurrentConversation: (Conversation: Conversation | undefined) => void;
  getConversationById: (conversationId: Id) => Conversation | undefined;
  updateConversation: (conversationId: Id, conversation: Partial<Conversation>) => void;
  clearConversation: (filter: (conversation: Conversation) => boolean) => void;
}

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      getState: () => get(),
      conversationList: [],
      createConversation: (connectionId?: Id, databaseName?: string) => {
        const conversation: Conversation = {
          ...getDefaultConversation(),
          connectionId,
          databaseName,
        };
        if (connectionId) {
          conversation.assistantId = SQLChatBotId;
        }
        set((state) => ({
          conversationList: [...state.conversationList, conversation],
          currentConversation: conversation,
        }));
        return conversation;
      },
      setCurrentConversation: (conversation: Conversation | undefined) => set(() => ({ currentConversation: conversation })),
      getConversationById: (conversationId: Id) => {
        return get().conversationList.find((item) => item.id === conversationId);
      },
      updateConversation: (conversationId: Id, conversation: Partial<Conversation>) => {
        set((state) => ({
          ...state,
          conversationList: state.conversationList.map((item) => (item.id === conversationId ? { ...item, ...conversation } : item)),
        }));
      },
      clearConversation: (filter: (conversation: Conversation) => boolean) => {
        set((state) => ({
          ...state,
          conversationList: state.conversationList.filter(filter),
        }));
      },
    }),
    {
      name: "conversation-storage",
      version: 1,
      migrate: (persistedState: any, version: number) => {
        let state = persistedState as ConversationState;
        if (version === 0) {
          for (const conversation of state.conversationList) {
            if (!conversation.connectionId) {
              conversation.assistantId = "general-bot";
            } else {
              conversation.assistantId = "sql-chat-bot";
            }
          }
          state.currentConversation = undefined;
        }

        return state;
      },
    }
  )
);

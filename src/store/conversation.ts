import dayjs from "dayjs";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Conversation, Id } from "@/types";
import { generateUUID } from "@/utils";
import { SQLChatBotId } from ".";

const getDefaultConversation = (): Conversation => {
  return {
    id: generateUUID(),
    assistantId: SQLChatBotId,
    title: dayjs().format("LTS"),
    createdAt: Date.now(),
  };
};

interface ConversationState {
  getState: () => ConversationState;
  conversationList: Conversation[];
  currentConversationId?: Id;
  createConversation: (connectionId?: Id, databaseName?: string) => Conversation;
  setCurrentConversationId: (conversationId: Id | undefined) => void;
  getConversationById: (conversationId: Id | undefined) => Conversation | undefined;
  updateConversation: (conversationId: Id, conversation: Partial<Conversation>) => void;
  clearConversation: (filter: (conversation: Conversation) => boolean) => void;
  updateSelectedTablesNameList: (selectedTableNameList: string[]) => void;
  updateSelectedSchemaName: (selectedSchemaName: string) => void;
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
        set((state: ConversationState) => ({
          conversationList: [...state.conversationList, conversation],
          currentConversationId: conversation.id,
        }));
        return conversation;
      },
      setCurrentConversationId: (conversation: Id | undefined) => set(() => ({ currentConversationId: conversation })),
      getConversationById: (conversationId: Id | undefined) => {
        return get().conversationList.find((item: Conversation) => item.id === conversationId);
      },
      updateConversation: (conversationId: Id, conversation: Partial<Conversation>) => {
        set((state: ConversationState) => ({
          ...state,
          conversationList: state.conversationList.map((item: Conversation) =>
            item.id === conversationId ? { ...item, ...conversation } : item
          ),
        }));
      },
      clearConversation: (filter: (conversation: Conversation) => boolean) => {
        set((state: ConversationState) => ({
          ...state,
          conversationList: state.conversationList.filter(filter),
        }));
      },
      updateSelectedTablesNameList: (selectedTableNameList: string[]) => {
        const currentConversation = get().getConversationById(get().currentConversationId);
        if (currentConversation) {
          get().updateConversation(currentConversation.id, {
            selectedTableNameList,
          });
        }
      },
      updateSelectedSchemaName: (selectedSchemaName: string) => {
        const currentConversation = get().getConversationById(get().currentConversationId);
        if (currentConversation) {
          get().updateConversation(currentConversation.id, {
            selectedSchemaName,
          });
        }
      },
    }),
    {
      name: "conversation-storage",
      version: 1,
      migrate: (persistedState: any, version: number) => {
        let state = persistedState as ConversationState;
        if (version === 0) {
          for (const conversation of state.conversationList) {
            conversation.assistantId = SQLChatBotId;
          }
          state.currentConversationId = undefined;
        }

        return state;
      },
    }
  )
);

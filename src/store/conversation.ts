import dayjs from "dayjs";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Conversation, Id } from "@/types";
import { generateUUID } from "@/utils";
import { GeneralBotId, SQLChatBotId } from ".";
import { Table } from "@/types";

const getDefaultConversation = (): Conversation => {
  return {
    id: generateUUID(),
    assistantId: GeneralBotId,
    title: dayjs().format("LTS"),
    createdAt: Date.now(),
    tableList: [{name:"ALL Table",structure:""} as Table],
    tableName: "ALL Table"
  };
};

interface ConversationState {
  getState: () => ConversationState;
  conversationList: Conversation[];
  currentConversationId?: Id;
  tableList?: Table[];
  tableName?: string;
  createConversation: (connectionId?: Id, databaseName?: string, tableName?: string) => Conversation;
  setCurrentConversationId: (conversationId: Id | undefined) => void;
  getConversationById: (conversationId: Id | undefined) => Conversation | undefined;
  updateConversation: (conversationId: Id, conversation: Partial<Conversation>) => void;
  updateTable: (tableName: string) => void;
  updateTableList: (tableList: Table[]) => void;
  clearConversation: (filter: (conversation: Conversation) => boolean) => void;
}

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      getState: () => get(),
      conversationList: [],
      createConversation: (connectionId?: Id, databaseName?: string, tableName?: string) => {
        const conversation: Conversation = {
          ...getDefaultConversation(),
          connectionId,
          databaseName,
          tableName,
        };
        if (connectionId) {
          conversation.assistantId = SQLChatBotId;
        }
        set((state) => ({
          conversationList: [...state.conversationList, conversation],
          currentConversationId: conversation.id,
        }));
        return conversation;
      },
      setCurrentConversationId: (conversation: Id | undefined) => set(() => ({ currentConversationId: conversation })),
      getConversationById: (conversationId: Id | undefined) => {
        return get().conversationList.find((item) => item.id === conversationId);
      },
      updateConversation: (conversationId: Id, conversation: Partial<Conversation>) => {
        set((state) => ({
          ...state,
          conversationList: state.conversationList.map((item) => (item.id === conversationId ? { ...item, ...conversation } : item)),
        }));
      },
      updateTable: (tableName: string) => {
        set((state) => ({
          ...state,
          tableName: tableName,
        }));
      },
      updateTableList: (tableList: Table[]) => {
        set((state) => ({
          ...state,
          tableList: [{name:"All Table",structure:""} as Table,...tableList],
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
          state.currentConversationId = undefined;
        }

        return state;
      },
    }
  )
);

import axios from "axios";
import { head, last } from "lodash-es";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import {
  getAssistantById,
  getPromptGeneratorOfAssistant,
  useConversationStore,
  useMessageStore,
  useConnectionStore,
  useSettingStore,
  useLayoutStore,
  useUserStore,
} from "@/store";
import { Conversation, CreatorRole, Message } from "@/types";
import { countTextTokens, generateUUID, getModel, hasFeature, generateDbPromptFromContext } from "@/utils";
import getEventEmitter from "@/utils/event-emitter";
import Header from "./Header";
import EmptyView from "../EmptyView";
import MessageView from "./MessageView";
import ClearConversationButton from "../ClearConversationButton";
import MessageTextarea from "./MessageTextarea";
import DataStorageBanner from "../DataStorageBanner";
import SchemaDrawer from "../SchemaDrawer";
import Icon from "../Icon";
import { useTranslation } from "react-i18next";

const ConversationView = () => {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const settingStore = useSettingStore();
  const layoutStore = useLayoutStore();
  const connectionStore = useConnectionStore();
  const conversationStore = useConversationStore();
  const userStore = useUserStore();
  const messageStore = useMessageStore();
  const [isStickyAtBottom, setIsStickyAtBottom] = useState<boolean>(true);
  const [showHeaderShadow, setShowHeaderShadow] = useState<boolean>(false);
  const conversationViewRef = useRef<HTMLDivElement>(null);
  const currentConversation = conversationStore.getConversationById(conversationStore.currentConversationId);
  const messageList = currentConversation
    ? messageStore.messageList.filter((message: Message) => message.conversationId === currentConversation.id)
    : [];
  const lastMessage = last(messageList);
  const [showSchemaDrawer, setShowSchemaDrawer] = useState<boolean>(false);

  useEffect(() => {
    messageStore.messageList.map((message: Message) => {
      if (message.status === "LOADING") {
        if (message.content === "") {
          messageStore.updateMessage(message.id, {
            content: "Failed to send the message.",
            status: "FAILED",
          });
        } else {
          messageStore.updateMessage(message.id, {
            status: "DONE",
          });
        }
      }
    });

    const handleConversationViewScroll = () => {
      if (!conversationViewRef.current) {
        return;
      }
      setShowHeaderShadow((conversationViewRef.current?.scrollTop || 0) > 0);
      setIsStickyAtBottom(
        conversationViewRef.current.scrollTop + conversationViewRef.current.clientHeight >= conversationViewRef.current.scrollHeight
      );
    };
    conversationViewRef.current?.addEventListener("scroll", handleConversationViewScroll);

    return () => {
      conversationViewRef.current?.removeEventListener("scroll", handleConversationViewScroll);
    };
  }, []);

  useEffect(() => {
    if (!conversationViewRef.current) {
      return;
    }
    conversationViewRef.current.scrollTop = conversationViewRef.current.scrollHeight;
  }, [currentConversation, lastMessage?.id]);

  useEffect(() => {
    if (!conversationViewRef.current) {
      return;
    }

    if (lastMessage?.status === "LOADING" && isStickyAtBottom) {
      conversationViewRef.current.scrollTop = conversationViewRef.current.scrollHeight;
    }
  }, [lastMessage?.status, lastMessage?.content, isStickyAtBottom]);

  useEffect(() => {
    if (
      currentConversation?.connectionId === connectionStore.currentConnectionCtx?.connection.id &&
      currentConversation?.databaseName === connectionStore.currentConnectionCtx?.database?.name
    ) {
      return;
    }

    // Auto select the first conversation when the current connection changes.
    const conversationList = conversationStore.conversationList.filter(
      (conversation: Conversation) =>
        conversation.connectionId === connectionStore.currentConnectionCtx?.connection.id &&
        conversation.databaseName === connectionStore.currentConnectionCtx?.database?.name
    );
    conversationStore.setCurrentConversationId(head(conversationList)?.id);
  }, [currentConversation, connectionStore.currentConnectionCtx]);

  const sendMessageToCurrentConversation = async (userPrompt: string) => {
    const currentConversation = conversationStore.getConversationById(conversationStore.getState().currentConversationId);
    if (!currentConversation) {
      return;
    }
    if (lastMessage?.status === "LOADING") {
      return;
    }

    // Add user message to the store.
    const userMessage: Message = {
      id: generateUUID(),
      conversationId: currentConversation.id,
      creatorId: userStore.currentUser.id,
      creatorRole: CreatorRole.User,
      createdAt: Date.now(),
      content: userPrompt,
      status: "DONE",
    };
    messageStore.addMessage(userMessage);

    // Construct the system prompt
    const messageList = messageStore.getState().messageList.filter((message: Message) => message.conversationId === currentConversation.id);
    const promptGenerator = getPromptGeneratorOfAssistant(getAssistantById(currentConversation.assistantId)!);
    let dbPrompt = promptGenerator();
    const maxToken = getModel(settingStore.setting.openAIApiConfig?.model || "").max_token;
    // Squeeze as much prompt as possible under the token limit, the prompt is in the order of:
    // 1. Assistant specific prompt with database schema if applicable.
    // 2. A list of previous exchanges.
    // 3. The current user prompt.
    //
    // The priority to fill in the prompt is in the order of:
    // 1. The current user prompt.
    // 2. Assistant specific prompt with database schema if applicable.
    // 3. A list of previous exchanges
    let tokens = countTextTokens(userPrompt);

    // Augument with database schema if available
    if (connectionStore.currentConnectionCtx?.database) {
      const schemaList = await connectionStore.getOrFetchDatabaseSchema(connectionStore.currentConnectionCtx?.database);
      try {
        dbPrompt = generateDbPromptFromContext(
          promptGenerator,
          connectionStore.currentConnectionCtx.connection.engineType,
          schemaList,
          currentConversation.selectedSchemaName || "",
          currentConversation.selectedTableNameList || [],
          maxToken,
          userPrompt
        );
      } catch (error: any) {
        toast.error(error.message);
      }
    }

    // Sliding window to add messages with DONE status all the way back up until we reach the token
    // limit.
    let usageMessageList: Message[] = [];
    let formatedMessageList = [];
    for (let i = messageList.length - 1; i >= 0; i--) {
      const message = messageList[i];
      if (message.status === "DONE") {
        if (tokens < maxToken) {
          tokens += countTextTokens(message.content);
          formatedMessageList.unshift({
            role: message.creatorRole,
            content: message.content,
          });
        }
      }
    }

    // Add the db prompt as the first context.
    formatedMessageList.unshift({
      role: CreatorRole.System,
      content: dbPrompt,
    });

    // Add the user prompt as the last context.
    formatedMessageList.push({
      role: CreatorRole.User,
      content: userPrompt,
    });

    const requestHeaders: any = {};
    if (session?.user.id) {
      requestHeaders["Authorization"] = `Bearer ${session?.user.id}`;
    }
    if (settingStore.setting.openAIApiConfig?.key) {
      requestHeaders["x-openai-key"] = settingStore.setting.openAIApiConfig?.key;
    }
    if (settingStore.setting.openAIApiConfig?.endpoint) {
      requestHeaders["x-openai-endpoint"] = settingStore.setting.openAIApiConfig?.endpoint;
    }
    if (settingStore.setting.openAIApiConfig?.model) {
      requestHeaders["x-openai-model"] = settingStore.setting.openAIApiConfig?.model;
    }
    const rawRes = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: formatedMessageList,
      }),
      headers: requestHeaders,
    });

    if (!rawRes.ok) {
      console.error(rawRes);
      let errorMessage = "Failed to request message, please check your network.";
      try {
        const res = await rawRes.json();
        errorMessage = res.error.message;
      } catch (error) {
        // do nth
      }
      messageStore.addMessage({
        id: generateUUID(),
        conversationId: currentConversation.id,
        creatorId: currentConversation.assistantId,
        creatorRole: CreatorRole.Assistant,
        createdAt: Date.now(),
        content: errorMessage,
        status: "FAILED",
      });
      return;
    }

    // Add PENDING assistant message to the store.
    const assistantMessage: Message = {
      id: generateUUID(),
      conversationId: currentConversation.id,
      creatorId: currentConversation.assistantId,
      creatorRole: CreatorRole.Assistant,
      createdAt: Date.now(),
      content: "",
      status: "LOADING",
    };
    messageStore.addMessage(assistantMessage);

    const data = rawRes.body;
    if (!data) {
      toast.error("No data return");
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder("utf-8");
    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      if (value) {
        const char = decoder.decode(value);
        if (char) {
          assistantMessage.content = assistantMessage.content + char;
          messageStore.updateMessage(assistantMessage.id, {
            content: assistantMessage.content,
          });
        }
      }
      done = readerDone;
    }
    messageStore.updateMessage(assistantMessage.id, {
      status: "DONE",
    });

    // Emit usage update event so quota widget can update.
    getEventEmitter().emit("usage.update");

    if (hasFeature("collect")) {
      // Collect system prompt
      // We only collect the db prompt for the system prompt. We do not collect the intermediate
      // exchange to save space since those can be derived from the previous record.
      usageMessageList.push({
        id: generateUUID(),
        createdAt: Date.now(),
        creatorRole: CreatorRole.System,
        content: dbPrompt,
      } as Message);

      // Collect user message
      usageMessageList.push(userMessage);

      // Collect assistant response
      usageMessageList.push(assistantMessage);

      axios
        .post<string[]>(
          "/api/collect",
          {
            conversation: currentConversation,
            messages: usageMessageList,
          },
          {
            headers: requestHeaders,
          }
        )
        .catch(() => {
          // do nth
        });
    }
  };

  return (
    <div
      ref={conversationViewRef}
      className={`${
        layoutStore.showSidebar && "sm:pl-80"
      } relative w-full h-full max-h-full flex flex-col justify-start items-start overflow-y-auto bg-white dark:bg-zinc-800`}
    >
      <div className="sticky top-0 z-1 bg-white dark:bg-zinc-800 w-full flex flex-col justify-start items-start">
        <DataStorageBanner />
        <Header className={showHeaderShadow ? "shadow" : ""} />
      </div>
      <div className="p-2 w-full h-auto grow max-w-4xl py-1 px-4 sm:px-8 mx-auto">
        {messageList.length === 0 ? (
          <EmptyView className="mt-16" sendMessage={sendMessageToCurrentConversation} />
        ) : (
          messageList.map((message: Message) => <MessageView key={message.id} message={message} />)
        )}
      </div>
      <div className="sticky bottom-0 flex flex-row justify-center items-center w-full max-w-4xl py-2 pb-4 px-4 sm:px-8 mx-auto bg-white dark:bg-zinc-800 bg-opacity-80 backdrop-blur">
        <ClearConversationButton />
        <MessageTextarea disabled={lastMessage?.status === "LOADING"} sendMessage={sendMessageToCurrentConversation} />
        <div className="mr-2 relative flex flex-row justify-end items-center" onClick={() => setShowSchemaDrawer(true)}>
          {
            <button className="flex flex-col items-center m-2 text-blue-600 hover:underline">
              <Icon.FiEye className="w-6 h-auto" />
              <span>{t("prompt.self")}</span>
            </button>
          }
        </div>
        {showSchemaDrawer && <SchemaDrawer close={() => setShowSchemaDrawer(false)} />}
      </div>
    </div>
  );
};

export default ConversationView;

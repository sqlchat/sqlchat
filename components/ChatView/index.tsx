import { head } from "lodash-es";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { getAssistantById, getPromptGeneratorOfAssistant, useChatStore, useMessageStore, useConnectionStore } from "@/store";
import { CreatorRole, Message } from "@/types";
import { generateUUID } from "@/utils";
import Icon from "../Icon";
import Header from "./Header";
import MessageView from "./MessageView";
import MessageTextarea from "./MessageTextarea";
import EmptyView from "../EmptyView";

const ChatView = () => {
  const connectionStore = useConnectionStore();
  const chatStore = useChatStore();
  const messageStore = useMessageStore();
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const chatViewRef = useRef<HTMLDivElement>(null);
  const currentChat = chatStore.currentChat;
  const messageList = messageStore.messageList.filter((message) => message.chatId === currentChat?.id);

  useEffect(() => {
    setTimeout(() => {
      if (!chatViewRef.current) {
        return;
      }
      chatViewRef.current.scrollTop = chatViewRef.current.scrollHeight;
    });
  }, [currentChat, isRequesting]);

  useEffect(() => {
    if (!connectionStore.currentConnectionCtx) {
      return;
    }
    if (currentChat?.connectionId === connectionStore.currentConnectionCtx.connection.id) {
      return;
    }
    const chatList = chatStore.chatList.filter((chat) => chat.connectionId === connectionStore.currentConnectionCtx?.connection.id);
    chatStore.setCurrentChat(head(chatList));
  }, [connectionStore.currentConnectionCtx]);

  const sendMessageToCurrentChat = async () => {
    if (!currentChat || !chatViewRef.current) {
      return;
    }
    if (isRequesting) {
      return;
    }

    setIsRequesting(true);
    const messageList = messageStore.getState().messageList.filter((message) => message.chatId === currentChat.id);
    let prompt = "";
    if (connectionStore.currentConnectionCtx?.database) {
      const tables = await connectionStore.getOrFetchDatabaseSchema(connectionStore.currentConnectionCtx?.database);
      const promptGenerator = getPromptGeneratorOfAssistant(getAssistantById(currentChat.assistantId)!);
      prompt = promptGenerator(tables.map((table) => table.structure).join("/n"));
    }
    const rawRes = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [
          {
            role: CreatorRole.System,
            content: prompt,
          },
          ...messageList.map((message) => ({
            role: message.creatorRole,
            content: message.content,
          })),
        ],
      }),
    });
    setIsRequesting(false);

    if (!rawRes.ok) {
      const res = await rawRes.json();
      toast.error(res.error.message);
      return;
    }
    const data = rawRes.body;
    if (!data) {
      toast.error("No data return");
      return;
    }

    const message: Message = {
      id: generateUUID(),
      chatId: currentChat.id,
      creatorId: currentChat.assistantId,
      creatorRole: CreatorRole.Assistant,
      createdAt: Date.now(),
      content: "",
    };
    messageStore.addMessage(message);

    const reader = data.getReader();
    const decoder = new TextDecoder("utf-8");
    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      if (value) {
        const char = decoder.decode(value);
        if (char) {
          message.content = message.content + char;
          messageStore.updateMessageContent(message.id, message.content);
        }
      }
      done = readerDone;
    }
  };

  return (
    <main
      ref={chatViewRef}
      className="drawer-content relative w-full h-full max-h-full flex flex-col justify-start items-start overflow-y-auto bg-white"
    >
      <Header />
      <div className="p-2 w-full h-auto grow max-w-3xl py-1 px-4 sm:px-8 mx-auto">
        {messageList.length === 0 ? (
          <EmptyView className="mt-16" />
        ) : (
          messageList.map((message) => <MessageView key={message.id} message={message} />)
        )}
        {isRequesting && (
          <div className="w-full pt-4 pb-8 flex justify-center items-center text-gray-600">
            <Icon.Bi.BiLoader className="w-5 h-auto mr-2 animate-spin" /> Requesting...
          </div>
        )}
      </div>
      <div className="sticky bottom-0 w-full max-w-3xl py-2 px-4 sm:px-8 mx-auto bg-white bg-opacity-80 backdrop-blur">
        <MessageTextarea disabled={isRequesting} sendMessage={sendMessageToCurrentChat} />
      </div>
    </main>
  );
};

export default ChatView;

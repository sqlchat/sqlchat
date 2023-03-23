import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { getAssistantById, getPromptGeneratorOfAssistant, useChatStore, useMessageStore, useConnectionStore } from "@/store";
import { CreatorRole } from "@/types";
import { generateUUID } from "@/utils";
import Icon from "../Icon";
import Header from "./Header";
import MessageView from "./MessageView";
import MessageTextarea from "./MessageTextarea";

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
    const { data } = await axios.post<string>("/api/chat", {
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
    });
    messageStore.addMessage({
      id: generateUUID(),
      chatId: currentChat.id,
      creatorId: currentChat.assistantId,
      creatorRole: CreatorRole.Assistant,
      createdAt: Date.now(),
      content: data,
    });
    setIsRequesting(false);
  };

  return (
    <main ref={chatViewRef} className="relative w-full h-full max-h-full flex flex-col justify-start items-start overflow-y-auto bg-white">
      <Header />
      <div className="p-2 w-full h-auto grow max-w-3xl py-1 px-4 sm:px-8 mx-auto">
        {messageList.length === 0 ? <></> : messageList.map((message) => <MessageView key={message.id} message={message} />)}
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

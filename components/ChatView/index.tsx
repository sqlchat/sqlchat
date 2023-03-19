import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { defaultChat, useChatStore, useMessageStore, useUserStore } from "../../store";
import { Chat, Message, UserRole } from "../../types";
import { generateUUID } from "../../utils";
import Icon from "../Icon";
import Header from "./Header";
import MessageView from "./MessageView";
import MessageTextarea from "./MessageTextarea";

const ChatView = () => {
  const chatStore = useChatStore();
  const userStore = useUserStore();
  const messageStore = useMessageStore();
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const chatViewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userStore.getAssistantById(chatStore.currentChat.assistantId)) {
      chatStore.setCurrentChat(defaultChat);
    }
    setCurrentChat(chatStore.currentChat);
  }, [chatStore, userStore]);

  useEffect(() => {
    setMessageList(messageStore.messageList.filter((message) => message.chatId === currentChat?.id));
  }, [currentChat?.id, messageStore.messageList]);

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
    const { data } = await axios.post<string>("/api/chat", {
      messages: messageList.map((message) => ({
        role: message.creatorId === userStore.currentUser.id ? UserRole.User : UserRole.Assistant,
        content: message.content,
      })),
    });
    messageStore.addMessage({
      id: generateUUID(),
      chatId: currentChat.id,
      creatorId: currentChat.assistantId,
      createdAt: Date.now(),
      content: data,
    });
    setIsRequesting(false);
  };

  return (
    <main
      ref={chatViewRef}
      className="relative sm:border sm:rounded-lg sm:shadow w-full mx-auto h-full max-h-full flex flex-col justify-start items-start overflow-y-auto bg-white"
    >
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

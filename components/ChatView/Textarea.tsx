import axios from "axios";
import { useRef, useState } from "react";
import { useChatStore, useMessageStore, useUserStore } from "../../store";
import { UserRole } from "../../types";
import { generateUUID } from "../../utils";
import Icon from "../Icon";

const Textarea = () => {
  const userStore = useUserStore();
  const chatStore = useChatStore();
  const messageStore = useMessageStore();
  const [value, setValue] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleSend = async () => {
    if (!chatStore.currentChat) {
      return;
    }

    const currentChat = chatStore.currentChat;
    messageStore.addMessage({
      id: generateUUID(),
      chatId: currentChat.id,
      creatorId: userStore.currentUser.id,
      createdAt: Date.now(),
      content: value,
    });
    setValue("");
    textareaRef.current!.value = "";

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
      creatorId: currentChat.userId,
      createdAt: Date.now(),
      content: data,
    });
  };

  return (
    <div className="w-full h-auto border-t relative">
      <textarea ref={textareaRef} className="w-full h-full outline-none pt-2 px-2 resize-none" onChange={handleChange} rows={1} />
      <Icon.Send className="absolute bottom-2 right-2" onClick={handleSend} />
    </div>
  );
};

export default Textarea;

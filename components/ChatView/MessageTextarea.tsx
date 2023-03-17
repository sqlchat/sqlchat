import axios from "axios";
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useChatStore, useMessageStore, useUserStore } from "../../store";
import { UserRole } from "../../types";
import { generateUUID } from "../../utils";
import Icon from "../Icon";

const MessageTextarea = () => {
  const userStore = useUserStore();
  const chatStore = useChatStore();
  const messageStore = useMessageStore();
  const [value, setValue] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

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
    <div className="w-full h-auto border rounded-md mb-2 px-2 py-1 relative shadow bg-white">
      <TextareaAutosize
        ref={textareaRef}
        className="w-full h-full outline-none border-none bg-transparent pt-1 mt-1 px-2 resize-none hide-scrollbar"
        rows={1}
        minRows={1}
        maxRows={5}
        onChange={handleChange}
        onSubmit={handleSend}
      />
      <div className="absolute bottom-2 right-2 w-8 p-1 cursor-pointer rounded-md hover:shadow hover:bg-gray-100" onClick={handleSend}>
        <Icon.Io.IoMdSend className="w-full h-auto text-blue-800" />
      </div>
    </div>
  );
};

export default MessageTextarea;

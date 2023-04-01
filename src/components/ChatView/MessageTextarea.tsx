import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";
import { useChatStore, useConnectionStore, useMessageStore, useUserStore } from "@/store";
import { CreatorRole } from "@/types";
import { generateUUID } from "@/utils";
import Icon from "../Icon";

interface Props {
  disabled?: boolean;
  sendMessage: () => Promise<void>;
}

const MessageTextarea = (props: Props) => {
  const { disabled, sendMessage } = props;
  const connectionStore = useConnectionStore();
  const userStore = useUserStore();
  const chatStore = useChatStore();
  const messageStore = useMessageStore();
  const [value, setValue] = useState<string>("");
  const [isInIME, setIsInIME] = useState(false);
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
    let chat = chatStore.currentChat;
    if (!chat) {
      const currentConnectionCtx = connectionStore.currentConnectionCtx;
      if (!currentConnectionCtx) {
        chat = chatStore.createChat();
      } else {
        chat = chatStore.createChat(currentConnectionCtx.connection.id, currentConnectionCtx.database?.name);
      }
    }
    if (!value) {
      toast.error("Please enter a message.");
      return;
    }
    if (disabled) {
      return;
    }

    messageStore.addMessage({
      id: generateUUID(),
      chatId: chat.id,
      creatorId: userStore.currentUser.id,
      creatorRole: CreatorRole.User,
      createdAt: Date.now(),
      content: value,
      status: "DONE",
    });
    setValue("");
    textareaRef.current!.value = "";
    await sendMessage();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey && !isInIME) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full h-auto flex flex-row justify-between items-end border rounded-lg mb-2 px-2 py-1 relative shadow bg-white">
      <TextareaAutosize
        ref={textareaRef}
        className="w-full h-full outline-none border-none bg-transparent leading-6 py-2 px-2 resize-none hide-scrollbar"
        placeholder="Type a message..."
        rows={1}
        minRows={1}
        maxRows={5}
        onCompositionStart={() => setIsInIME(true)}
        onCompositionEnd={() => setIsInIME(false)}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button
        className="w-8 p-1 -translate-y-1 cursor-pointer rounded-md hover:shadow hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        onClick={handleSend}
      >
        <Icon.IoMdSend className="w-full h-auto text-indigo-600" />
      </button>
    </div>
  );
};

export default MessageTextarea;

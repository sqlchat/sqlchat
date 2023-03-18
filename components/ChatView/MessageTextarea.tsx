import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";
import { useChatStore, useMessageStore, useUserStore } from "../../store";
import { generateUUID } from "../../utils";
import Icon from "../Icon";

interface Props {
  sendMessage: () => Promise<void>;
}

const MessageTextarea = (props: Props) => {
  const { sendMessage } = props;
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
    if (!chatStore.currentChat) {
      toast.error("Please select a chat first.");
      return;
    }
    if (!value) {
      toast.error("Please enter a message.");
      return;
    }

    const currentChat = chatStore.currentChat;
    if (currentChat.isRequesting) {
      toast.error("Please wait for the previous message to be sent.");
      return;
    }

    messageStore.addMessage({
      id: generateUUID(),
      chatId: currentChat.id,
      creatorId: userStore.currentUser.id,
      createdAt: Date.now(),
      content: value,
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
        className="w-full h-full outline-none border-none bg-transparent leading-6 py-1 px-2 resize-none hide-scrollbar"
        placeholder="Type a message..."
        rows={1}
        minRows={1}
        maxRows={5}
        onCompositionStart={() => setIsInIME(true)}
        onCompositionEnd={() => setIsInIME(false)}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <div className="w-8 p-1 cursor-pointer rounded-md hover:shadow hover:bg-gray-100" onClick={handleSend}>
        <Icon.Io.IoMdSend className="w-full h-auto text-indigo-600" />
      </div>
    </div>
  );
};

export default MessageTextarea;

import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import TextareaAutosize from "react-textarea-autosize";
import { useConversationStore, useConnectionStore } from "@/store";
import Icon from "../Icon";

interface Props {
  disabled?: boolean;
  sendMessage: (content: string) => Promise<void>;
}

const MessageTextarea = (props: Props) => {
  const { disabled, sendMessage } = props;
  const { t } = useTranslation();
  const connectionStore = useConnectionStore();
  const conversationStore = useConversationStore();
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
    let conversation = conversationStore.getConversationById(conversationStore.currentConversationId);
    if (!conversation) {
      const currentConnectionCtx = connectionStore.currentConnectionCtx;
      if (!currentConnectionCtx) {
        conversation = conversationStore.createConversation();
      } else {
        conversation = conversationStore.createConversation(currentConnectionCtx.connection.id, currentConnectionCtx.database?.name);
      }
    }
    if (!value) {
      toast.error("Please enter a message.");
      return;
    }
    if (disabled) {
      return;
    }

    setValue("");
    textareaRef.current!.value = "";
    await sendMessage(value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey && !isInIME) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full h-auto flex flex-row justify-between items-end border dark:border-zinc-700 rounded-lg px-2 py-1 relative shadow bg-white dark:bg-zinc-800">
      <TextareaAutosize
        ref={textareaRef}
        className="w-full h-full outline-none border-none bg-transparent leading-6 py-2 px-2 resize-none hide-scrollbar"
        placeholder={t("editor.placeholder") || ""}
        rows={1}
        minRows={1}
        maxRows={5}
        onCompositionStart={() => setIsInIME(true)}
        onCompositionEnd={() => setIsInIME(false)}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button
        className="w-8 p-1 -translate-y-1 cursor-pointer rounded-md hover:shadow hover:bg-gray-100 dark:hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        onClick={handleSend}
      >
        <Icon.IoMdSend className="w-full h-auto text-indigo-600" />
      </button>
    </div>
  );
};

export default MessageTextarea;

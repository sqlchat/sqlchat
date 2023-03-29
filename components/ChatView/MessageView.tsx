import { Menu, MenuItem } from "@mui/material";
import { ReactElement, useState } from "react";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChatStore, useConnectionStore, useMessageStore, useUserStore } from "@/store";
import { Message } from "@/types";
import Icon from "../Icon";
import { CodeBlock } from "../CodeBlock";
import EngineIcon from "../EngineIcon";

interface Props {
  message: Message;
}

const MessageView = (props: Props) => {
  const message = props.message;
  const userStore = useUserStore();
  const chatStore = useChatStore();
  const connectionStore = useConnectionStore();
  const messageStore = useMessageStore();
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isCurrentUser = message.creatorId === userStore.currentUser.id;
  const showMenu = Boolean(menuAnchorEl);
  const connection = connectionStore.getConnectionById(chatStore.getChatById(message.chatId)?.connectionId || "");

  const handleMoreMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (menuAnchorEl) {
      setMenuAnchorEl(null);
    } else {
      setMenuAnchorEl(event.currentTarget);
    }
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(message.content);
    toast.success("Copied to clipboard");
    setMenuAnchorEl(null);
  };

  const deleteMessage = (message: Message) => {
    messageStore.clearMessage((item) => item.id !== message.id);
    setMenuAnchorEl(null);
  };

  return (
    <div
      className={`w-full max-w-full flex flex-row justify-start items-start my-4 group ${
        isCurrentUser ? "justify-end pl-8 sm:pl-24" : "pr-8 sm:pr-24"
      }`}
    >
      {isCurrentUser ? (
        <>
          <div className="w-auto max-w-full bg-indigo-600 text-white px-4 py-2 rounded-lg whitespace-pre-wrap">{message.content}</div>
          <div className="w-10 h-10 p-1 border rounded-full flex justify-center items-center ml-2 shrink-0">
            <Icon.AiOutlineUser className="w-6 h-6" />
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center items-center mr-2 shrink-0">
            {connection ? (
              <EngineIcon className="w-10 h-auto p-1 border rounded-full" engine={connection.engineType} />
            ) : (
              <img className="w-10 h-auto p-1" src="/chat-logo-bot.webp" alt="" />
            )}
          </div>
          <ReactMarkdown
            className="w-auto max-w-[calc(100%-4rem)] bg-gray-100 px-4 py-2 rounded-lg prose prose-neutral"
            remarkPlugins={[remarkGfm]}
            components={{
              pre({ node, className, children, ...props }) {
                const child = children[0] as ReactElement;
                const match = /language-(\w+)/.exec(child.props.className || "");
                const language = match ? match[1] : "text";
                return (
                  <pre className={`${className || ""} w-full p-0 my-1`} {...props}>
                    <CodeBlock
                      key={Math.random()}
                      language={language || "text"}
                      value={String(child.props.children).replace(/\n$/, "")}
                      {...props}
                    />
                  </pre>
                );
              },
              code({ children }) {
                return <code className="px-0">`{children}`</code>;
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
          <div className={`invisible group-hover:visible ${showMenu && "!visible"}`}>
            <button
              className="w-6 h-6 ml-1 mt-2 flex justify-center items-center text-gray-400 hover:text-gray-500"
              onClick={handleMoreMenuClick}
            >
              <Icon.IoMdMore className="w-5 h-auto" />
            </button>
            <Menu
              className="mt-1"
              anchorEl={menuAnchorEl}
              open={showMenu}
              onClose={() => setMenuAnchorEl(null)}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={copyMessage}>
                <Icon.BiClipboard className="w-4 h-auto mr-1 opacity-70" />
                Copy
              </MenuItem>
              <MenuItem onClick={() => deleteMessage(message)}>
                <Icon.BiTrash className="w-4 h-auto mr-1 opacity-70" />
                Delete
              </MenuItem>
            </Menu>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageView;

import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useConversationStore, useConnectionStore, useMessageStore, useUserStore, useSettingStore } from "@/store";
import { Message } from "@/types";
import Dropdown, { DropdownItem } from "../kit/Dropdown";
import Icon from "../Icon";
import { CodeBlock } from "../CodeBlock";
import EngineIcon from "../EngineIcon";
import ThreeDotsLoader from "./ThreeDotsLoader";

interface Props {
  message: Message;
}

const MessageView = (props: Props) => {
  const message = props.message;
  const { data: session } = useSession();
  const { t } = useTranslation();
  const settingStore = useSettingStore();
  const userStore = useUserStore();
  const conversationStore = useConversationStore();
  const connectionStore = useConnectionStore();
  const messageStore = useMessageStore();
  const isCurrentUser = message.creatorId === userStore.currentUser.id;
  const connection = connectionStore.getConnectionById(conversationStore.getConversationById(message.conversationId)?.connectionId || "");

  const copyMessage = () => {
    navigator.clipboard.writeText(message.content);
    toast.success("Copied to clipboard");
  };

  const deleteMessage = (message: Message) => {
    messageStore.clearMessage((item) => item.id !== message.id);
  };

  return (
    <div
      className={`w-full max-w-full flex flex-row justify-start items-start my-4 group ${
        isCurrentUser ? "justify-end sm:pl-24" : "sm:pr-24"
      }`}
    >
      {isCurrentUser ? (
        <>
          <div className="invisible group-hover:visible">
            <Dropdown
              tigger={
                <button className="w-6 h-6 mr-1 mt-2 shrink-0 flex justify-center items-center text-gray-400 hover:text-gray-500">
                  <Icon.IoMdMore className="w-5 h-auto" />
                </button>
              }
            >
              <div className="p-1 flex flex-col justify-start items-start bg-white dark:bg-zinc-900 rounded-lg">
                <DropdownItem
                  className="w-full p-1 px-2 flex flex-row justify-start items-center rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800"
                  onClick={copyMessage}
                >
                  <Icon.BiClipboard className="w-4 h-auto mr-2 opacity-70" />
                  {t("common.copy")}
                </DropdownItem>
                <DropdownItem
                  className="w-full p-1 px-2 flex flex-row justify-start items-center rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800"
                  onClick={() => deleteMessage(message)}
                >
                  <Icon.BiTrash className="w-4 h-auto mr-2 opacity-70" />
                  {t("common.delete")}
                </DropdownItem>
              </div>
            </Dropdown>
          </div>
          <div className="w-auto max-w-[calc(100%-2rem)] flex flex-col justify-start items-start">
            <div className="w-full bg-indigo-600 text-white dark:text-gray-200 px-4 py-2 rounded-lg whitespace-pre-wrap break-all">
              {message.content}
            </div>
          </div>
          <div className="w-10 h-10 border dark:border-zinc-700 rounded-full flex justify-center items-center ml-2 shrink-0">
            {session?.user ? (
              session.user.image ? (
                <img
                  className="inline-block h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700"
                  src={session.user.image}
                  alt=""
                />
              ) : (
                <div className="bg-indigo-100 px-3 py-1 rounded-full text-indigo-600 hover:bg-indigo-200 uppercase">
                  {session.user.name ? session.user.name.charAt(0) : session.user.email?.charAt(0)}
                </div>
              )
            ) : (
              <Icon.AiOutlineUser className="w-6 h-6" />
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center items-center mr-2 shrink-0">
            {connection ? (
              <EngineIcon className="w-10 h-auto p-1 dark:border-zinc-700" engine={connection.engineType} />
            ) : (
              <img className="w-10 h-auto p-1" src="/chat-logo-bot.webp" alt="" />
            )}
          </div>
          {message.status === "LOADING" && message.content === "" ? (
            <div className="mt-0.5 w-12 bg-gray-100 dark:bg-zinc-700 px-4 py-2 rounded-lg">
              <ThreeDotsLoader />
            </div>
          ) : (
            <>
              <div className="w-auto max-w-[calc(100%-2rem)] flex flex-col justify-start items-start">
                <ReactMarkdown
                  className={`w-auto max-w-full bg-gray-100 dark:bg-zinc-700 px-4 py-2 rounded-lg prose prose-neutral dark:prose-invert ${
                    message.status === "FAILED" && "border border-red-400 bg-red-100 text-red-500"
                  }`}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    pre({ node, className, children, ...props }) {
                      const child = children[0] as ReactElement;
                      const match = /language-(\w+)/.exec(child.props.className || "");
                      const language = match ? match[1] : "SQL";
                      return (
                        <pre className={`${className || ""} w-full p-0 my-1`} {...props}>
                          <CodeBlock
                            key={Math.random()}
                            messageId={message.id}
                            language={language || "SQL"}
                            value={String(child.props.children).replace(/\n$/, "")}
                            {...props}
                          />
                        </pre>
                      );
                    },
                    code({ children }) {
                      return <code className="px-0">{children}</code>;
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                <span className="self-start text-sm text-gray-400 pt-1 pl-1">
                  {dayjs(message.createdAt).locale(settingStore.setting.locale).format("lll")}
                </span>
              </div>
              <div className="invisible group-hover:visible">
                <Dropdown
                  tigger={
                    <button className="w-6 h-6 ml-1 mt-2 shrink-0 flex justify-center items-center text-gray-400 hover:text-gray-500">
                      <Icon.IoMdMore className="w-5 h-auto" />
                    </button>
                  }
                >
                  <div className="p-1 flex flex-col justify-start items-start bg-white dark:bg-zinc-900 rounded-lg">
                    <DropdownItem
                      className="w-full p-1 px-2 flex flex-row justify-start items-center rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800"
                      onClick={copyMessage}
                    >
                      <Icon.BiClipboard className="w-4 h-auto mr-2 opacity-70" />
                      {t("common.copy")}
                    </DropdownItem>
                    <DropdownItem
                      className="w-full p-1 px-2 flex flex-row justify-start items-center rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800"
                      onClick={() => deleteMessage(message)}
                    >
                      <Icon.BiTrash className="w-4 h-auto mr-2 opacity-70" />
                      {t("common.delete")}
                    </DropdownItem>
                  </div>
                </Dropdown>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MessageView;

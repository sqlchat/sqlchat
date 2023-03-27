import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useUserStore } from "@/store";
import { Message } from "@/types";
import Icon from "../Icon";
import { CodeBlock } from "../CodeBlock";

interface Props {
  message: Message;
}

const MessageView = (props: Props) => {
  const message = props.message;
  const userStore = useUserStore();
  const isCurrentUser = message.creatorId === userStore.currentUser.id;

  return (
    <div className={`w-full flex flex-row justify-start items-start my-4 ${isCurrentUser ? "justify-end pl-8 sm:pl-24" : "pr-8 sm:pr-24"}`}>
      {isCurrentUser ? (
        <>
          <div className="mt-0.5 w-auto max-w-full bg-indigo-600 text-white px-4 py-2 rounded-lg rounded-tr-none shadow whitespace-pre-wrap">
            {message.content}
          </div>
          <div className="w-10 h-10 p-1 border rounded-full flex justify-center items-center ml-2 shrink-0">
            <Icon.AiOutlineUser className="w-6 h-6" />
          </div>
        </>
      ) : (
        <>
          <div className="w-10 h-10 p-1 border rounded-full flex justify-center items-center mr-2 shrink-0">
            <Icon.AiOutlineRobot className="w-6 h-6" />
          </div>
          <ReactMarkdown
            className="mt-0.5 w-auto max-w-full bg-gray-100 px-4 py-2 rounded-lg rounded-tl-none shadow prose prose-neutral"
            remarkPlugins={[remarkGfm]}
            components={{
              pre({ node, className, children, ...props }) {
                return (
                  <pre className={`${className || ""} p-0 w-full`} {...props}>
                    {children}
                  </pre>
                );
              },
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const language = match ? match[1] : "plain";
                return !inline ? (
                  <CodeBlock key={Math.random()} language={language || "plain"} value={String(children).replace(/\n$/, "")} {...props} />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </>
      )}
    </div>
  );
};

export default MessageView;

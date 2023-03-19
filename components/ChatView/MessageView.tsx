import { marked } from "marked";
import { localUser } from "../../store";
import { Message } from "../../types";

interface Props {
  message: Message;
}

const MessageView = (props: Props) => {
  const message = props.message;
  const isCurrentUser = message.creatorId === localUser.id;

  return (
    <div className={`w-full flex flex-row justify-start items-start my-4 ${isCurrentUser ? "justify-end pl-8 sm:pl-24" : "pr-8 sm:pr-24"}`}>
      {isCurrentUser ? (
        <div className="w-auto max-w-full bg-indigo-600 text-white px-4 py-2 rounded-lg rounded-tr-none shadow whitespace-pre-wrap">
          {message.content}
        </div>
      ) : (
        <div
          className="w-auto max-w-full bg-gray-100 px-4 py-2 rounded-lg rounded-tl-none shadow prose prose-neutral"
          dangerouslySetInnerHTML={{ __html: marked.parse(message.content) }}
        ></div>
      )}
    </div>
  );
};

export default MessageView;

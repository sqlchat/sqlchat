import { useChatStore, useConnectionStore, useMessageStore, useUserStore } from "@/store";
import { CreatorRole } from "@/types";
import { generateUUID } from "@/utils";
import Icon from "./Icon";

// examples are used to show some examples to the user.
const examples = ["Give me an example schema about employee", "How to create a view in MySQL?"];

interface Props {
  className?: string;
  sendMessage: () => Promise<void>;
}

const EmptyView = (props: Props) => {
  const { className, sendMessage } = props;
  const connectionStore = useConnectionStore();
  const chatStore = useChatStore();
  const userStore = useUserStore();
  const messageStore = useMessageStore();

  const handleExampleClick = async (content: string) => {
    let chat = chatStore.currentChat;
    if (!chat) {
      const currentConnectionCtx = connectionStore.currentConnectionCtx;
      if (!currentConnectionCtx) {
        chat = chatStore.createChat();
      } else {
        chat = chatStore.createChat(currentConnectionCtx.connection.id, currentConnectionCtx.database?.name);
      }
    }

    messageStore.addMessage({
      id: generateUUID(),
      chatId: chat.id,
      creatorId: userStore.currentUser.id,
      creatorRole: CreatorRole.User,
      createdAt: Date.now(),
      content: content,
      status: "DONE",
    });
    await sendMessage();
  };

  return (
    <div className={`${className || ""} w-full h-full flex flex-col justify-start items-center`}>
      <div className="w-96 max-w-full font-medium leading-loose mb-8">
        <img src="/chat-logo-and-text.webp" alt="sql-chat-logo" />
      </div>
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="w-full flex flex-col justify-start items-center">
          <Icon.BsSun className="w-8 h-auto opacity-80" />
          <span className="mt-2 mb-4">Examples</span>
          {examples.map((example) => (
            <div
              key={example}
              className="w-full rounded-lg px-4 py-3 text-sm mb-4 cursor-pointer bg-gray-50 hover:bg-gray-100"
              onClick={() => handleExampleClick(example)}
            >
              {`"${example}"`} →
            </div>
          ))}
        </div>
        <div className="w-full flex flex-col justify-start items-center">
          <Icon.BsLightning className="w-8 h-auto opacity-80" />
          <span className="mt-2 mb-4">Capabilities</span>
          <div className="w-full bg-gray-50 rounded-lg px-4 py-3 text-sm mb-4">Remembers what user said earlier in the conversation</div>
          <div className="w-full bg-gray-50 rounded-lg px-4 py-3 text-sm mb-4">Allows user to provide follow-up corrections</div>
        </div>
        <div className="w-full hidden sm:flex flex-col justify-start items-center">
          <Icon.BsEmojiNeutral className="w-8 h-auto opacity-80" />
          <span className="mt-2 mb-4">Limitations</span>
          <div className="w-full bg-gray-50 rounded-lg px-4 py-3 text-sm mb-4">May occasionally generate incorrect information</div>
          <div className="w-full bg-gray-50 rounded-lg px-4 py-3 text-sm mb-4">
            May occasionally produce harmful instructions or biased content
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyView;

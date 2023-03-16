import { useChatStore, useMessageStore, useUserStore } from "../../store";
import MessageView from "./MessageView";
import Sidebar from "./Sidebar";
import MessageTextarea from "./MessageTextarea";

const ChatView = () => {
  const chatStore = useChatStore();
  const userStore = useUserStore();
  const messageStore = useMessageStore();
  const currentChat = chatStore.currentChat;
  const chatTitle = currentChat ? userStore.getAssistantById(currentChat.userId)?.name : "No chat";
  const messageList = messageStore.messageList.filter((message) => message.chatId === currentChat?.id);

  return (
    <div className="relative w-full max-w-full h-full rounded-md flex flex-row justify-start items-start">
      <Sidebar />
      <main className="relative grow w-auto h-full max-h-full flex flex-col justify-start items-start overflow-y-auto bg-gray-100">
        <p className="sticky top-0 w-full text-center py-4 border-b bg-white">{chatTitle}</p>
        <div className="p-2 w-full h-auto grow max-w-3xl py-1 px-4 mx-auto">
          {messageList.length === 0 ? <></> : messageList.map((message) => <MessageView key={message.id} message={message} />)}
        </div>
        <div className="sticky bottom-0 w-full max-w-3xl py-1 px-4 mx-auto">
          <MessageTextarea />
        </div>
      </main>
    </div>
  );
};

export default ChatView;

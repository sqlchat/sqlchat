import { useChatStore, useMessageStore, useUserStore } from "../../store";
import MessageView from "./MessageView";
import Sidebar from "./Sidebar";
import Textarea from "./Textarea";

const ChatView = () => {
  const chatStore = useChatStore();
  const userStore = useUserStore();
  const messageStore = useMessageStore();
  const currentChat = chatStore.currentChat;
  const chatTitle = currentChat ? userStore.getAssistantById(currentChat.userId)?.name : "No chat";
  const messageList = messageStore.messageList.filter((message) => message.chatId === currentChat?.id);

  return (
    <div className="w-full max-w-full lg:max-w-3xl border rounded-md grid grid-cols-[192px_1fr]">
      <Sidebar />
      <main className="w-full">
        <p className="w-full text-center py-2 border-b">{chatTitle}</p>
        <div className="py-2">
          {messageList.length === 0 ? <p>no message</p> : messageList.map((message) => <MessageView key={message.id} message={message} />)}
        </div>
        <Textarea />
      </main>
    </div>
  );
};

export default ChatView;

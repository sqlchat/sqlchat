import { useChatStore, useUserStore } from "../../store";
import { User } from "../../types";

const Sidebar = () => {
  const userStore = useUserStore();
  const chatStore = useChatStore();

  const handleAssistantClick = (user: User) => {
    for (const chat of chatStore.chatList) {
      if (chat.userId === user.id) {
        chatStore.setCurrentChat(chat);
        return;
      }
    }
    chatStore.createChat(user);
  };

  return (
    <div className="w-full border-r p-2">
      <h2>Assistant list</h2>
      <div>
        {userStore.assistantList.map((assistant) => (
          <p onClick={() => handleAssistantClick(assistant)} key={assistant.id}>
            {assistant.name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

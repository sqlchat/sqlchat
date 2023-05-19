import { useState } from "react";
import { useConversationStore, useMessageStore } from "@/store";
import Icon from "./Icon";
import ClearConversationConfirmModal from "./ClearConversationConfirmModal";

const ClearConversationButton = () => {
  const conversationStore = useConversationStore();
  const messageStore = useMessageStore();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const messageList = messageStore.messageList.filter((message) => message.conversationId === conversationStore.currentConversationId);

  return (
    <>
      <button
        className="mr-2 opacity-80 hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={messageList.length === 0}
        onClick={() => setShowConfirmModal(true)}
      >
        <Icon.GiBroom className="w-6 h-auto" />
      </button>

      {showConfirmModal && <ClearConversationConfirmModal close={() => setShowConfirmModal(false)} />}
    </>
  );
};

export default ClearConversationButton;

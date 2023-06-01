import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useConnectionStore, useConversationStore, useLayoutStore } from "@/store";
import { Conversation } from "@/types";
import Icon from "./Icon";
import Dropdown, { DropdownItem } from "./kit/Dropdown";
import UpdateConversationModal from "./UpdateConversationModal";

interface ConversationTabProps {
  conversation: Conversation;
  selected: boolean;
  onClick: (conversation: Conversation) => void;
  onEdit: (conversation: Conversation) => void;
  onDelete: (conversation: Conversation) => void;
}

const ConversationTab = (props: ConversationTabProps) => {
  const { conversation, selected, onClick, onEdit, onDelete } = props;
  const { t } = useTranslation();

  return (
    <div
      className={`shrink-0 flex flex-row justify-center items-center cursor-pointer text-sm border pl-4 pr-2 py-1 rounded-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-zinc-700 dark:border-zinc-700 ${
        selected && "!border-zinc-700 dark:!border-gray-200 shadow"
      }`}
      onClick={() => onClick(conversation)}
    >
      <span>{conversation.title}</span>
      <Dropdown
        tigger={
          <button className="w-4 h-auto shrink-0 ml-1 flex justify-center items-center text-gray-300 hover:opacity-80">
            <Icon.FiMoreVertical className="w-full h-auto" />
          </button>
        }
      >
        <div className="p-1 flex flex-col justify-start items-start bg-white dark:bg-zinc-900 shadow-lg rounded-lg">
          <DropdownItem
            className="w-full p-1 px-2 flex flex-row justify-start items-center rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800"
            onClick={() => onEdit(conversation)}
          >
            <Icon.FiEdit3 className="w-4 h-auto mr-2 opacity-70" />
            {t("common.edit")}
          </DropdownItem>
          <DropdownItem
            className="w-full p-1 px-2 flex flex-row justify-start items-center rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800"
            onClick={() => onDelete(conversation)}
          >
            <Icon.IoTrash className="w-4 h-auto mr-2 opacity-70" />
            {t("common.delete")}
          </DropdownItem>
        </div>
      </Dropdown>
    </div>
  );
};

const ConversationTabsView = () => {
  const { t } = useTranslation();
  const layoutStore = useLayoutStore();
  const connectionStore = useConnectionStore();
  const conversationStore = useConversationStore();
  const [updateConversationModalContext, setUpdateConversationModalContext] = useState<Conversation | undefined>(undefined);
  const currentConnectionCtx = connectionStore.currentConnectionCtx;
  const conversationList = conversationStore.conversationList.filter(
    (conversation) =>
      conversation.connectionId === currentConnectionCtx?.connection.id &&
      conversation.databaseName === currentConnectionCtx?.database?.name
  );

  const handleCreateConversation = () => {
    if (!currentConnectionCtx) {
      conversationStore.createConversation();
    } else {
      conversationStore.createConversation(currentConnectionCtx.connection.id, currentConnectionCtx.database?.name);
    }
  };

  const handleConversationClick = (conversation: Conversation) => {
    conversationStore.setCurrentConversationId(conversation.id);
    if (layoutStore.isMobileView) {
      layoutStore.toggleSidebar(false);
    }
  };

  const handleEditConversation = (conversation: Conversation) => {
    setUpdateConversationModalContext(conversation);
  };

  const handleDeleteConversation = (conversation: Conversation) => {
    conversationStore.clearConversation((item) => item.id !== conversation.id);
    if (conversationStore.currentConversationId === conversation.id) {
      conversationStore.setCurrentConversationId(undefined);
    }
  };

  return (
    <>
      <div className="w-full flex flex-row justify-start items-center flex-nowrap px-4 mt-1">
        <div className="w-auto flex flex-row justify-start items-center overflow-x-auto py-1 gap-x-2">
          {conversationList.map((conversation) => {
            return (
              <ConversationTab
                key={conversation.id}
                conversation={conversation}
                selected={conversation.id === conversationStore.currentConversationId}
                onClick={handleConversationClick}
                onEdit={handleEditConversation}
                onDelete={handleDeleteConversation}
              />
            );
          })}
        </div>
        <div className={`shrink-0 my-2 ${conversationList.length > 0 && "ml-2"}`}>
          <button
            className="border px-2 py-1.5 text-sm rounded-sm flex flex-row justify-center items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-zinc-700 dark:border-zinc-700"
            onClick={handleCreateConversation}
          >
            <Icon.AiOutlinePlus className="w-4 h-auto" />
            {conversationList.length === 0 && t("conversation.new-chat")}
          </button>
        </div>
      </div>

      {updateConversationModalContext && (
        <UpdateConversationModal close={() => setUpdateConversationModalContext(undefined)} conversation={updateConversationModalContext} />
      )}
    </>
  );
};

export default ConversationTabsView;

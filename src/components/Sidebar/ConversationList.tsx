import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useConversationStore, useConnectionStore, useLayoutStore } from "@/store";
import { Conversation } from "@/types";
import Dropdown, { DropdownItem } from "../kit/Dropdown";
import Icon from "../Icon";
import UpdateConversationModal from "../UpdateConversationModal";

interface State {
  showUpdateConversationModal: boolean;
}

const ConversationList = () => {
  const { t } = useTranslation();
  const layoutStore = useLayoutStore();
  const connectionStore = useConnectionStore();
  const conversationStore = useConversationStore();
  const [state, setState] = useState<State>({
    showUpdateConversationModal: false,
  });
  const [updateConversationModalContext, setUpdateConversationModalContext] = useState<Conversation>();
  const currentConnectionCtx = connectionStore.currentConnectionCtx;
  const conversationList = conversationStore.conversationList.filter(
    (conversation) =>
      conversation.connectionId === currentConnectionCtx?.connection.id &&
      conversation.databaseName === currentConnectionCtx?.database?.name
  );

  const toggleUpdateConversationModal = (show = true) => {
    setState({
      ...state,
      showUpdateConversationModal: show,
    });
  };

  const handleCreateConversation = () => {
    if (!currentConnectionCtx) {
      conversationStore.createConversation();
    } else {
      conversationStore.createConversation(currentConnectionCtx.connection.id, currentConnectionCtx.database?.name);
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    conversationStore.setCurrentConversationId(conversation.id);
    if (layoutStore.isMobileView) {
      layoutStore.toggleSidebar(false);
    }
  };

  const handleEditConversation = (conversation: Conversation) => {
    setUpdateConversationModalContext(conversation);
    setState({
      ...state,
      showUpdateConversationModal: true,
    });
  };

  const handleDeleteConversation = (conversation: Conversation) => {
    conversationStore.clearConversation((item) => item.id !== conversation.id);
    if (conversationStore.currentConversationId === conversation.id) {
      conversationStore.setCurrentConversationId(undefined);
    }
  };

  return (
    <>
      {conversationList.map((conversation) => (
        <div
          key={conversation.id}
          className={`w-full mt-2 first:mt-4 py-3 pl-4 pr-2 rounded-lg flex flex-row justify-start items-center cursor-pointer dark:text-gray-300 border border-transparent group hover:bg-white dark:hover:bg-zinc-800 ${
            conversation.id === conversationStore.currentConversationId && "bg-white dark:bg-zinc-800 border-gray-200 font-medium"
          }`}
          onClick={() => handleConversationSelect(conversation)}
        >
          {conversation.id === conversationStore.currentConversationId ? (
            <Icon.IoChatbubble className="w-5 h-auto mr-1.5 shrink-0" />
          ) : (
            <Icon.IoChatbubbleOutline className="w-5 h-auto mr-1.5 opacity-80 shrink-0" />
          )}
          <span className="truncate grow">{conversation.title || "SQL Chat"}</span>
          <Dropdown
            tigger={
              <button className="w-4 h-4 shrink-0 group-hover:visible invisible flex justify-center items-center text-gray-400 hover:text-gray-500">
                <Icon.FiMoreHorizontal className="w-full h-auto" />
              </button>
            }
          >
            <div className="p-1 flex flex-col justify-start items-start bg-white dark:bg-zinc-900 shadow-lg rounded-lg">
              <DropdownItem
                className="w-full p-1 px-2 flex flex-row justify-start items-center rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800"
                onClick={() => handleEditConversation(conversation)}
              >
                <Icon.FiEdit3 className="w-4 h-auto mr-2 opacity-70" />
                {t("common.edit")}
              </DropdownItem>
              <DropdownItem
                className="w-full p-1 px-2 flex flex-row justify-start items-center rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800"
                onClick={() => handleDeleteConversation(conversation)}
              >
                <Icon.IoTrash className="w-4 h-auto mr-2 opacity-70" />
                {t("common.delete")}
              </DropdownItem>
            </div>
          </Dropdown>
        </div>
      ))}
      <button
        className="w-full my-4 py-3 px-4 border dark:border-zinc-800 rounded-lg flex flex-row justify-center items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
        onClick={handleCreateConversation}
      >
        <Icon.AiOutlinePlus className="w-5 h-auto mr-1" />
        {t("conversation.new-chat")}
      </button>

      {updateConversationModalContext && state.showUpdateConversationModal && (
        <UpdateConversationModal close={() => toggleUpdateConversationModal(false)} conversation={updateConversationModalContext} />
      )}
    </>
  );
};

export default ConversationList;

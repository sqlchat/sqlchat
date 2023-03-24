import { head } from "lodash-es";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useChatStore, useConnectionStore, useLayoutStore } from "@/store";
import { Chat, Connection } from "@/types";
import Icon from "./Icon";
import EngineIcon from "./EngineIcon";
import CreateConnectionModal from "./CreateConnectionModal";
import SettingModal from "./SettingModal";

interface State {
  showCreateConnectionModal: boolean;
  showSettingModal: boolean;
}

const ConnectionSidebar = () => {
  const layoutStore = useLayoutStore();
  const connectionStore = useConnectionStore();
  const chatStore = useChatStore();
  const [state, setState] = useState<State>({
    showCreateConnectionModal: false,
    showSettingModal: false,
  });
  const connectionList = connectionStore.connectionList;
  const currentConnectionCtx = connectionStore.currentConnectionCtx;
  const databaseList = connectionStore.databaseList.filter((database) => database.connectionId === currentConnectionCtx?.connection.id);
  const chatList = chatStore.chatList.filter(
    (chat) => chat.connectionId === currentConnectionCtx?.connection.id && chat.databaseName === currentConnectionCtx?.database?.name
  );

  const toggleCreateConnectionModal = (show = true) => {
    setState({
      ...state,
      showCreateConnectionModal: show,
    });
  };

  const toggleSettingModal = (show = true) => {
    setState({
      ...state,
      showSettingModal: show,
    });
  };

  const handleConnectionSelect = async (connection: Connection) => {
    const databaseList = await connectionStore.getOrFetchDatabaseList(connection);
    connectionStore.setCurrentConnectionCtx({
      connection,
      database: head(databaseList),
    });
  };

  const handleDatabaseNameSelect = async (databaseName: string) => {
    const database = databaseList.find((database) => database.name === databaseName);
    connectionStore.setCurrentConnectionCtx({
      connection: currentConnectionCtx!.connection,
      database: database,
    });
  };

  const handleCreateChat = () => {
    if (!currentConnectionCtx) {
      chatStore.createChat();
    } else {
      chatStore.createChat(currentConnectionCtx.connection.id, currentConnectionCtx.database?.name);
    }
  };

  const handleChatSelect = (chat: Chat) => {
    chatStore.setCurrentChat(chat);
    layoutStore.toggleSidebar(false);
  };

  return (
    <>
      <aside className="drawer-side">
        <label htmlFor="connection-drawer" className="drawer-overlay"></label>
        <div className="w-80 h-full border-r flex flex-row justify-start items-start">
          <div className="w-16 h-full bg-gray-200 pl-2 py-4 pt-6 flex flex-col justify-between items-center">
            <div className="w-full flex flex-col justify-start items-start">
              {connectionList.map((connection) => (
                <button
                  key={connection.id}
                  className={`w-full h-14 rounded-l-lg p-2 mt-2 ${
                    currentConnectionCtx?.connection.id === connection.id && "bg-gray-100 shadow"
                  }`}
                  onClick={() => handleConnectionSelect(connection)}
                >
                  <EngineIcon engine={connection.engineType} className="w-auto h-full mx-auto" />
                </button>
              ))}
              <button
                className="tooltip tooltip-right w-10 h-10 mt-4 ml-2 p-2 bg-gray-100 rounded-full text-gray-500 cursor-pointer"
                data-tip="Create Connection"
                onClick={() => toggleCreateConnectionModal(true)}
              >
                <Icon.Ai.AiOutlinePlus className="w-auto h-full mx-auto" />
              </button>
            </div>
            <div className="w-full flex flex-col justify-end items-center">
              <button
                className="tooltip tooltip-right w-10 h-10 p-1 rounded-full flex flex-row justify-center items-center hover:bg-gray-100"
                data-tip="Setting"
                onClick={() => toggleSettingModal(true)}
              >
                <Icon.Io.IoMdSettings className="text-gray-600 w-6 h-auto" />
              </button>
              <a
                className="tooltip tooltip-right w-10 h-10 p-1 rounded-full flex flex-row justify-center items-center hover:bg-gray-100"
                href="https://github.com/bytebase/sqlchat"
                data-tip="GitHub"
                target="_blank"
              >
                <Icon.Io.IoLogoGithub className="text-gray-600 w-6 h-auto" />
              </a>
            </div>
          </div>
          <div className={`w-64 h-full overflow-y-auto bg-gray-100 px-4 pt-2 ${databaseList.length === 0 && "!pt-4"}`}>
            {databaseList.length > 0 && (
              <div className="w-full sticky top-0 bg-gray-100 z-1 mb-4">
                <p className="text-sm leading-6 mb-1 text-gray-500">Select your database:</p>
                <select
                  className="w-full select select-bordered"
                  value={currentConnectionCtx?.database?.name}
                  onChange={(e) => handleDatabaseNameSelect(e.target.value)}
                >
                  {databaseList.map((database) => (
                    <option key={database.name} value={database.name}>
                      {database.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {chatList.map((chat) => (
              <div
                key={chat.id}
                className={`w-full max-w-full mt-2 first:mt-4 py-3 px-4 rounded-lg flex flex-row justify-start items-center cursor-pointer border border-transparent hover:bg-gray-50 ${
                  chat.id === chatStore.currentChat?.id && "!bg-white border-gray-200 font-medium"
                }`}
                onClick={() => handleChatSelect(chat)}
              >
                {chat.id === chatStore.currentChat?.id ? (
                  <Icon.Io5.IoChatbubble className="w-5 h-auto mr-2 shrink-0" />
                ) : (
                  <Icon.Io5.IoChatbubbleOutline className="w-5 h-auto mr-2 opacity-80 shrink-0" />
                )}
                <span className="truncate">{chat.title || "SQL Chat"}</span>
              </div>
            ))}
            <button
              className="w-full my-4 py-3 px-4 border rounded-lg flex flex-row justify-center items-center text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              onClick={handleCreateChat}
            >
              <Icon.Ai.AiOutlinePlus className="w-5 h-auto mr-1" />
              New Chat
            </button>
          </div>
        </div>
      </aside>

      {createPortal(
        <CreateConnectionModal show={state.showCreateConnectionModal} close={() => toggleCreateConnectionModal(false)} />,
        document.body
      )}

      {createPortal(<SettingModal show={state.showSettingModal} close={() => toggleSettingModal(false)} />, document.body)}
    </>
  );
};

export default ConnectionSidebar;

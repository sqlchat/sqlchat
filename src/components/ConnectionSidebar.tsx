import { head } from "lodash-es";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useChatStore, useConnectionStore, useLayoutStore } from "@/store";
import { Chat, Connection } from "@/types";
import Icon from "./Icon";
import EngineIcon from "./EngineIcon";
import CreateConnectionModal from "./CreateConnectionModal";
import SettingModal from "./SettingModal";
import EditChatTitleModal from "./EditChatTitleModal";

interface State {
  showCreateConnectionModal: boolean;
  showSettingModal: boolean;
  showEditChatTitleModal: boolean;
}

const ConnectionSidebar = () => {
  const layoutStore = useLayoutStore();
  const connectionStore = useConnectionStore();
  const chatStore = useChatStore();
  const [state, setState] = useState<State>({
    showCreateConnectionModal: false,
    showSettingModal: false,
    showEditChatTitleModal: false,
  });
  const [editConnectionModalContext, setEditConnectionModalContext] = useState<Connection>();
  const [editChatTitleModalContext, setEditChatTitleModalContext] = useState<Chat>();
  const [isRequestingDatabase, setIsRequestingDatabase] = useState<boolean>(false);
  const connectionList = connectionStore.connectionList;
  const currentConnectionCtx = connectionStore.currentConnectionCtx;
  const databaseList = connectionStore.databaseList.filter((database) => database.connectionId === currentConnectionCtx?.connection.id);
  const chatList = chatStore.chatList.filter(
    (chat) => chat.connectionId === currentConnectionCtx?.connection.id && chat.databaseName === currentConnectionCtx?.database?.name
  );

  useEffect(() => {
    if (currentConnectionCtx?.connection) {
      setIsRequestingDatabase(true);
      connectionStore.getOrFetchDatabaseList(currentConnectionCtx.connection).finally(() => {
        setIsRequestingDatabase(false);
      });
    } else {
      setIsRequestingDatabase(false);
    }
  }, [currentConnectionCtx?.connection]);

  const toggleCreateConnectionModal = (show = true) => {
    setState({
      ...state,
      showCreateConnectionModal: show,
    });
    setEditConnectionModalContext(undefined);
  };

  const toggleSettingModal = (show = true) => {
    setState({
      ...state,
      showSettingModal: show,
    });
  };

  const toggleEditChatTitleModal = (show = true) => {
    setState({
      ...state,
      showEditChatTitleModal: show,
    });
  };

  const handleConnectionSelect = async (connection: Connection) => {
    const databaseList = await connectionStore.getOrFetchDatabaseList(connection);
    connectionStore.setCurrentConnectionCtx({
      connection,
      database: head(databaseList),
    });
  };

  const handleEditConnection = (connection: Connection) => {
    setState({
      ...state,
      showCreateConnectionModal: true,
    });
    setEditConnectionModalContext(connection);
  };

  const handleDatabaseNameSelect = async (databaseName: string) => {
    if (!currentConnectionCtx?.connection) {
      return;
    }

    const databaseList = await connectionStore.getOrFetchDatabaseList(currentConnectionCtx.connection);
    const database = databaseList.find((database) => database.name === databaseName);
    connectionStore.setCurrentConnectionCtx({
      connection: currentConnectionCtx.connection,
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

  const handleEditChatTitle = (chat: Chat) => {
    setEditChatTitleModalContext(chat);
    setState({
      ...state,
      showEditChatTitleModal: true,
    });
  };

  const handleDeleteChat = (chat: Chat) => {
    chatStore.clearChat((item) => item.id !== chat.id);
    if (chatStore.currentChat?.id === chat.id) {
      chatStore.setCurrentChat(undefined);
    }
  };

  return (
    <>
      <aside className="drawer-side">
        <label htmlFor="connection-drawer" className="drawer-overlay"></label>
        <div className="w-80 h-full overflow-y-hidden border-r flex flex-row justify-start items-start">
          <div className="w-16 h-full bg-gray-200 pl-2 py-4 pt-6 flex flex-col justify-between items-center">
            <div className="w-full flex flex-col justify-start items-start">
              <button
                className={`w-full h-14 rounded-l-lg p-2 mt-1 group ${currentConnectionCtx === undefined && "bg-gray-100 shadow"}`}
                onClick={() => connectionStore.setCurrentConnectionCtx(undefined)}
              >
                <img src="/chat-logo-bot.webp" className="w-7 h-auto mx-auto" alt="" />
              </button>
              {connectionList.map((connection) => (
                <button
                  key={connection.id}
                  className={`relative w-full h-14 rounded-l-lg p-2 mt-2 group ${
                    currentConnectionCtx?.connection.id === connection.id && "bg-gray-100 shadow"
                  }`}
                  onClick={() => handleConnectionSelect(connection)}
                >
                  <span
                    className="absolute right-0.5 -mt-1.5 opacity-60 hidden group-hover:block hover:opacity-80"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditConnection(connection);
                    }}
                  >
                    <Icon.FiEdit3 className="w-3.5 h-auto" />
                  </span>
                  <EngineIcon engine={connection.engineType} className="w-auto h-full mx-auto" />
                </button>
              ))}
              <button
                className="tooltip tooltip-right w-10 h-10 mt-4 ml-2 p-2 bg-gray-100 rounded-full text-gray-500 cursor-pointer"
                data-tip="Create Connection"
                onClick={() => toggleCreateConnectionModal(true)}
              >
                <Icon.AiOutlinePlus className="w-auto h-full mx-auto" />
              </button>
            </div>
            <div className="w-full flex flex-col justify-end items-center">
              <button
                className="tooltip tooltip-right w-10 h-10 p-1 rounded-full flex flex-row justify-center items-center hover:bg-gray-100"
                data-tip="Setting"
                onClick={() => toggleSettingModal(true)}
              >
                <Icon.IoMdSettings className="text-gray-600 w-6 h-auto" />
              </button>
            </div>
          </div>
          <div className="relative p-4 pb-0 w-64 h-full overflow-y-auto flex flex-col justify-start items-start bg-gray-100">
            <img className="px-4 shrink-0" src="/chat-logo.webp" alt="" />
            <div className="w-full grow">
              {isRequestingDatabase && (
                <div className="w-full h-12 flex flex-row justify-start items-center px-4 sticky top-0 border z-1 mb-4 mt-2 rounded-lg text-sm text-gray-600">
                  <Icon.BiLoaderAlt className="w-4 h-auto animate-spin mr-1" /> Loading
                </div>
              )}
              {databaseList.length > 0 && (
                <div className="w-full sticky top-0 z-1 mb-4 mt-2">
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
                  className={`w-full mt-2 first:mt-4 py-3 pl-4 pr-2 rounded-lg flex flex-row justify-start items-center cursor-pointer border border-transparent group hover:bg-gray-50 ${
                    chat.id === chatStore.currentChat?.id && "!bg-white border-gray-200 font-medium"
                  }`}
                  onClick={() => handleChatSelect(chat)}
                >
                  {chat.id === chatStore.currentChat?.id ? (
                    <Icon.IoChatbubble className="w-5 h-auto mr-1.5 shrink-0" />
                  ) : (
                    <Icon.IoChatbubbleOutline className="w-5 h-auto mr-1.5 opacity-80 shrink-0" />
                  )}
                  <span className="truncate grow">{chat.title || "SQL Chat"}</span>
                  <span className="ml-0.5 shrink-0 hidden group-hover:flex flex-row justify-end items-center space-x-1">
                    <Icon.FiEdit3
                      className="w-4 h-auto opacity-60 hover:opacity-80"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditChatTitle(chat);
                      }}
                    />
                    <Icon.IoClose
                      className="w-5 h-auto opacity-60 hover:opacity-80"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(chat);
                      }}
                    />
                  </span>
                </div>
              ))}
              <button
                className="w-full my-4 py-3 px-4 border rounded-lg flex flex-row justify-center items-center text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                onClick={handleCreateChat}
              >
                <Icon.AiOutlinePlus className="w-5 h-auto mr-1" />
                New Chat
              </button>
            </div>
            <div className="sticky bottom-0 w-full flex justify-center bg-gray-100 backdrop-blur bg-opacity-60 pb-6 py-2">
              <a
                href="https://discord.gg/6R3qb32h"
                className="text-indigo-600 text-sm font-medium flex flex-row justify-center items-center hover:underline"
                target="_blank"
              >
                <Icon.BsDiscord className="w-4 h-auto mr-1" />
                Join Discord Channel
              </a>
            </div>
          </div>
        </div>
      </aside>

      {createPortal(
        <CreateConnectionModal
          show={state.showCreateConnectionModal}
          connection={editConnectionModalContext}
          close={() => toggleCreateConnectionModal(false)}
        />,
        document.body
      )}

      {createPortal(<SettingModal show={state.showSettingModal} close={() => toggleSettingModal(false)} />, document.body)}

      {state.showEditChatTitleModal &&
        editChatTitleModalContext &&
        createPortal(<EditChatTitleModal close={() => toggleEditChatTitleModal(false)} chat={editChatTitleModalContext} />, document.body)}
    </>
  );
};

export default ConnectionSidebar;

import { Drawer } from "@mui/material";
import { head } from "lodash-es";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useConversationStore, useConnectionStore, useLayoutStore, ResponsiveWidth } from "@/store";
import { Conversation, Connection } from "@/types";
import Select from "./kit/Select";
import Tooltip from "./kit/Tooltip";
import Icon from "./Icon";
import EngineIcon from "./EngineIcon";
import LocaleSwitch from "./LocaleSwitch";
import CreateConnectionModal from "./CreateConnectionModal";
import SettingModal from "./SettingModal";
import EditConversationTitleModal from "./EditConversationTitleModal";

interface State {
  showCreateConnectionModal: boolean;
  showSettingModal: boolean;
  showEditConversationTitleModal: boolean;
}

const ConnectionSidebar = () => {
  const { t } = useTranslation();
  const layoutStore = useLayoutStore();
  const connectionStore = useConnectionStore();
  const conversationStore = useConversationStore();
  const [state, setState] = useState<State>({
    showCreateConnectionModal: false,
    showSettingModal: false,
    showEditConversationTitleModal: false,
  });
  const [editConnectionModalContext, setEditConnectionModalContext] = useState<Connection>();
  const [editConversationTitleModalContext, setEditConversationTitleModalContext] = useState<Conversation>();
  const [isRequestingDatabase, setIsRequestingDatabase] = useState<boolean>(false);
  const connectionList = connectionStore.connectionList;
  const currentConnectionCtx = connectionStore.currentConnectionCtx;
  const databaseList = connectionStore.databaseList.filter((database) => database.connectionId === currentConnectionCtx?.connection.id);
  const conversationList = conversationStore.conversationList.filter(
    (conversation) =>
      conversation.connectionId === currentConnectionCtx?.connection.id &&
      conversation.databaseName === currentConnectionCtx?.database?.name
  );

  useEffect(() => {
    const handleWindowResize = () => {
      if (window.innerWidth < ResponsiveWidth.sm) {
        layoutStore.toggleSidebar(false);
        layoutStore.setIsMobileView(true);
      } else {
        layoutStore.toggleSidebar(true);
        layoutStore.setIsMobileView(false);
      }
    };

    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

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

  const toggleEditConversationTitleModal = (show = true) => {
    setState({
      ...state,
      showEditConversationTitleModal: show,
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

  const handleCreateConversation = () => {
    if (!currentConnectionCtx) {
      conversationStore.createConversation();
    } else {
      conversationStore.createConversation(currentConnectionCtx.connection.id, currentConnectionCtx.database?.name);
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    conversationStore.setCurrentConversation(conversation);
    if (layoutStore.isMobileView) {
      layoutStore.toggleSidebar(false);
    }
  };

  const handleEditConversationTitle = (conversation: Conversation) => {
    setEditConversationTitleModalContext(conversation);
    setState({
      ...state,
      showEditConversationTitleModal: true,
    });
  };

  const handleDeleteConversation = (conversation: Conversation) => {
    conversationStore.clearConversation((item) => item.id !== conversation.id);
    if (conversationStore.currentConversation?.id === conversation.id) {
      conversationStore.setCurrentConversation(undefined);
    }
  };

  return (
    <>
      <Drawer
        className="!z-10"
        variant={layoutStore.isMobileView ? "temporary" : "persistent"}
        open={layoutStore.showSidebar}
        onClose={() => layoutStore.toggleSidebar(false)}
      >
        <div className="w-80 h-full overflow-y-hidden flex flex-row justify-start items-start">
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
              <Tooltip title={t("connection.new")} side="right">
                <button
                  className="w-10 h-10 mt-4 ml-2 p-2 bg-gray-100 rounded-full text-gray-500 cursor-pointer"
                  onClick={() => toggleCreateConnectionModal(true)}
                >
                  <Icon.AiOutlinePlus className="w-auto h-full mx-auto" />
                </button>
              </Tooltip>
            </div>
            <div className="w-full flex flex-col justify-end items-center">
              <LocaleSwitch />
              <Tooltip title={t("common.setting")} side="right">
                <button
                  className=" w-10 h-10 p-1 rounded-full flex flex-row justify-center items-center hover:bg-gray-100"
                  data-tip={t("common.setting")}
                  onClick={() => toggleSettingModal(true)}
                >
                  <Icon.IoMdSettings className="text-gray-600 w-6 h-auto" />
                </button>
              </Tooltip>
            </div>
          </div>
          <div className="relative p-4 pb-0 w-64 h-full overflow-y-auto flex flex-col justify-start items-start bg-gray-100">
            <img className="px-4 shrink-0" src="/chat-logo.webp" alt="" />
            <div className="w-full grow">
              {isRequestingDatabase && (
                <div className="w-full h-12 flex flex-row justify-start items-center px-4 sticky top-0 border z-1 mb-4 mt-2 rounded-lg text-sm text-gray-600">
                  <Icon.BiLoaderAlt className="w-4 h-auto animate-spin mr-1" /> {t("common.loading")}
                </div>
              )}
              {databaseList.length > 0 && (
                <div className="w-full sticky top-0 z-1 my-4">
                  <Select
                    className="w-full bg-white px-4 py-3"
                    value={currentConnectionCtx?.database?.name}
                    itemList={databaseList.map((database) => {
                      return {
                        label: database.name,
                        value: database.name,
                      };
                    })}
                    onValueChange={(databaseName) => handleDatabaseNameSelect(databaseName)}
                    placeholder={t("connection.select-database") || ""}
                  />
                </div>
              )}
              {conversationList.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`w-full mt-2 first:mt-4 py-3 pl-4 pr-2 rounded-lg flex flex-row justify-start items-center cursor-pointer border border-transparent group hover:bg-gray-50 ${
                    conversation.id === conversationStore.currentConversation?.id && "!bg-white border-gray-200 font-medium"
                  }`}
                  onClick={() => handleConversationSelect(conversation)}
                >
                  {conversation.id === conversationStore.currentConversation?.id ? (
                    <Icon.IoChatbubble className="w-5 h-auto mr-1.5 shrink-0" />
                  ) : (
                    <Icon.IoChatbubbleOutline className="w-5 h-auto mr-1.5 opacity-80 shrink-0" />
                  )}
                  <span className="truncate grow">{conversation.title || "SQL Chat"}</span>
                  <span className="ml-0.5 shrink-0 hidden group-hover:flex flex-row justify-end items-center space-x-1">
                    <Icon.FiEdit3
                      className="w-4 h-auto opacity-60 hover:opacity-80"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditConversationTitle(conversation);
                      }}
                    />
                    <Icon.IoClose
                      className="w-5 h-auto opacity-60 hover:opacity-80"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(conversation);
                      }}
                    />
                  </span>
                </div>
              ))}
              <button
                className="w-full my-4 py-3 px-4 border rounded-lg flex flex-row justify-center items-center text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                onClick={handleCreateConversation}
              >
                <Icon.AiOutlinePlus className="w-5 h-auto mr-1" />
                {t("conversation.new-chat")}
              </button>
            </div>
            <div className="sticky bottom-0 w-full flex justify-center bg-gray-100 backdrop-blur bg-opacity-60 pb-6 py-2">
              <a
                href="https://discord.gg/z6kakemDjm"
                className="text-indigo-600 text-sm font-medium flex flex-row justify-center items-center hover:underline"
                target="_blank"
              >
                <Icon.BsDiscord className="w-4 h-auto mr-1" />
                {t("social.join-discord-channel")}
              </a>
            </div>
          </div>
        </div>
      </Drawer>

      {createPortal(
        <CreateConnectionModal
          show={state.showCreateConnectionModal}
          connection={editConnectionModalContext}
          close={() => toggleCreateConnectionModal(false)}
        />,
        document.body
      )}

      {createPortal(<SettingModal show={state.showSettingModal} close={() => toggleSettingModal(false)} />, document.body)}

      {state.showEditConversationTitleModal &&
        editConversationTitleModalContext &&
        createPortal(
          <EditConversationTitleModal
            close={() => toggleEditConversationTitleModal(false)}
            conversation={editConversationTitleModalContext}
          />,
          document.body
        )}
    </>
  );
};

export default ConnectionSidebar;

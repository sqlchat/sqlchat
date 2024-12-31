import { head } from "lodash-es";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useConnectionStore } from "@/store";
import { Connection } from "@/types";
import Tooltip from "../kit/Tooltip";
import Icon from "../Icon";
import EngineIcon from "../EngineIcon";
import CreateConnectionModal from "../CreateConnectionModal";

interface State {
  showCreateConnectionModal: boolean;
  showUpdateConversationModal: boolean;
}

const ConnectionList = () => {
  const { t } = useTranslation();
  const connectionStore = useConnectionStore();
  const [state, setState] = useState<State>({
    showCreateConnectionModal: false,
    showUpdateConversationModal: false,
  });
  const [editConnectionModalContext, setEditConnectionModalContext] = useState<Connection>();
  const connectionList = connectionStore.connectionList;
  const currentConnectionCtx = connectionStore.currentConnectionCtx;

  const toggleCreateConnectionModal = (show = true) => {
    setState({
      ...state,
      showCreateConnectionModal: show,
    });
    setEditConnectionModalContext(undefined);
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

  return (
    <>
      <button
        className={`w-full h-12 rounded-l-lg p-2 mt-1 group ${currentConnectionCtx === undefined && "bg-gray-100 dark:bg-zinc-700 shadow"}`}
        onClick={() => connectionStore.setCurrentConnectionCtx(undefined)}
      >
        <img src="/chat-logo-bot.webp" className="w-7 h-auto mx-auto" alt="" />
      </button>
      {connectionList.map((connection) => (
        <Tooltip key={connection.id} title={connection.title} side="right">
          <button
            className={`relative w-full h-12 rounded-l-lg p-2 mt-2 group ${
              currentConnectionCtx?.connection.id === connection.id && "bg-gray-100 dark:bg-zinc-700 shadow"
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
              <Icon.FiEdit3 className="w-3.5 h-auto dark:text-gray-300" />
            </span>
            <EngineIcon engine={connection.engineType} className="w-auto h-full mx-auto dark:text-gray-300" />
          </button>
        </Tooltip>
      ))}
      <Tooltip title={t("connection.new")} side="right">
        <button
          className="w-10 h-10 mt-4 ml-2 p-2 bg-gray-100 dark:bg-zinc-700 rounded-full text-gray-500 cursor-pointer"
          onClick={() => toggleCreateConnectionModal(true)}
        >
          <Icon.AiOutlinePlus className="w-auto h-full mx-auto" />
        </button>
      </Tooltip>

      {state.showCreateConnectionModal && (
        <CreateConnectionModal connection={editConnectionModalContext} close={() => toggleCreateConnectionModal(false)} />
      )}
    </>
  );
};

export default ConnectionList;

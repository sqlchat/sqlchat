import { cloneDeep, head } from "lodash-es";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
import { testConnection, useConnectionStore } from "@/store";
import { Connection, Engine } from "@/types";
import Icon from "./Icon";
import DataStorageBanner from "./DataStorageBanner";
import ActionConfirmModal from "./ActionConfirmModal";

interface Props {
  show: boolean;
  connection?: Connection;
  close: () => void;
}

const defaultConnection: Connection = {
  id: "",
  title: "",
  engineType: Engine.MySQL,
  host: "",
  port: "",
  username: "",
  password: "",
};

const CreateConnectionModal = (props: Props) => {
  const { show, connection: editConnection, close } = props;
  const connectionStore = useConnectionStore();
  const [connection, setConnection] = useState<Connection>(defaultConnection);
  const [showDeleteConnectionModal, setShowDeleteConnectionModal] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const showDatabaseField = connection.engineType === Engine.PostgreSQL;
  const isEditing = editConnection !== undefined;

  useEffect(() => {
    if (show) {
      setConnection(isEditing ? editConnection : defaultConnection);
      setIsRequesting(false);
      setShowDeleteConnectionModal(false);
    }
  }, [show]);

  const setPartialConnection = (state: Partial<Connection>) => {
    setConnection({
      ...connection,
      ...state,
    });
  };

  const handleCreateConnection = async () => {
    if (isRequesting) {
      return;
    }

    setIsRequesting(true);
    const tempConnection = cloneDeep(connection);
    if (!showDatabaseField) {
      tempConnection.database = undefined;
    }

    try {
      await testConnection(tempConnection);
    } catch (error) {
      setIsRequesting(false);
      toast.error("Failed to test connection, please check your connection configuration");
      return;
    }

    try {
      let connection: Connection;
      if (isEditing) {
        connectionStore.updateConnection(tempConnection.id, tempConnection);
        connection = tempConnection;
      } else {
        connection = connectionStore.createConnection(tempConnection);
      }

      // Set the created connection as the current connection.
      const databaseList = await connectionStore.getOrFetchDatabaseList(connection, true);
      connectionStore.setCurrentConnectionCtx({
        connection: connection,
        database: head(databaseList),
      });
    } catch (error) {
      console.error(error);
      setIsRequesting(false);
      toast.error("Failed to create connection");
      return;
    }

    setIsRequesting(false);
    close();
  };

  const handleDeleteConnection = () => {
    connectionStore.clearConnection((item) => item.id !== connection.id);
    if (connectionStore.currentConnectionCtx?.connection.id === connection.id) {
      connectionStore.setCurrentConnectionCtx(undefined);
    }
    close();
  };

  return (
    <>
      <div className={`modal modal-middle ${show && "modal-open"}`}>
        <div className="modal-box relative">
          <h3 className="font-bold text-lg">{isEditing ? "Edit Connection" : "Create Connection"}</h3>
          <button className="btn btn-sm btn-circle absolute right-4 top-4" onClick={close}>
            <Icon.IoMdClose className="w-5 h-auto" />
          </button>
          <div className="w-full flex flex-col justify-start items-start space-y-3 pt-4">
            <DataStorageBanner className="rounded-lg bg-white border py-2 !justify-start" alwaysShow={true} />
            <div className="w-full flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">Database Type</label>
              <select
                className="select select-bordered w-full"
                value={connection.engineType}
                onChange={(e) => setPartialConnection({ engineType: e.target.value as Engine })}
              >
                <option value={Engine.MySQL}>MySQL</option>
                <option value={Engine.PostgreSQL}>PostgreSQL</option>
              </select>
            </div>
            <div className="w-full flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
              <input
                type="text"
                placeholder="Connect host"
                className="input input-bordered w-full"
                value={connection.host}
                onChange={(e) => setPartialConnection({ host: e.target.value })}
              />
            </div>
            <div className="w-full flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
              <input
                type="text"
                placeholder="Connect port"
                className="input input-bordered w-full"
                value={connection.port}
                onChange={(e) => setPartialConnection({ port: e.target.value })}
              />
            </div>
            {showDatabaseField && (
              <div className="w-full flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">Database Name</label>
                <input
                  type="text"
                  placeholder="Connect database"
                  className="input input-bordered w-full"
                  value={connection.database}
                  onChange={(e) => setPartialConnection({ database: e.target.value })}
                />
              </div>
            )}
            <div className="w-full flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                placeholder="Connect username"
                className="input input-bordered w-full"
                value={connection.username}
                onChange={(e) => setPartialConnection({ username: e.target.value })}
              />
            </div>
            <div className="w-full flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="text"
                placeholder="Connect password"
                className="input input-bordered w-full"
                value={connection.password}
                onChange={(e) => setPartialConnection({ password: e.target.value })}
              />
            </div>
          </div>
          <div className="modal-action w-full flex flex-row justify-between items-center space-x-2">
            <div>
              {isEditing && (
                <button className="btn btn-ghost" onClick={() => setShowDeleteConnectionModal(true)}>
                  Delete
                </button>
              )}
            </div>
            <div className="space-x-2 flex flex-row justify-center">
              <button className="btn btn-outline" onClick={close}>
                Close
              </button>
              <button className="btn" disabled={isRequesting} onClick={handleCreateConnection}>
                {isRequesting && <Icon.BiLoaderAlt className="w-4 h-auto animate-spin mr-1" />}
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConnectionModal &&
        createPortal(
          <ActionConfirmModal
            title="Delete Connection"
            content="Are you sure you want to delete this connection?"
            confirmButtonStyle="btn-error"
            close={() => setShowDeleteConnectionModal(false)}
            confirm={() => handleDeleteConnection()}
          />,
          document.body
        )}
    </>
  );
};

export default CreateConnectionModal;

import { cloneDeep, head } from "lodash-es";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { testConnection, useConnectionStore } from "@/store";
import { Connection, Engine } from "@/types";
import Icon from "./Icon";

interface Props {
  show: boolean;
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
  const { show, close } = props;
  const connectionStore = useConnectionStore();
  const [connection, setConnection] = useState<Connection>(defaultConnection);
  const [isRequesting, setIsRequesting] = useState(false);
  const showDatabaseField = connection.engineType === Engine.PostgreSQL;

  useEffect(() => {
    if (show) {
      setConnection(defaultConnection);
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
    const connectionCreate = cloneDeep(connection);
    if (!showDatabaseField) {
      connectionCreate.database = undefined;
    }
    try {
      const result = await testConnection(connectionCreate);
      if (!result) {
        setIsRequesting(false);
        toast.error("Failed to test connection");
        return;
      }
      const createdConnection = connectionStore.createConnection(connectionCreate);
      // Set the created connection as the current connection.
      const databaseList = await connectionStore.getOrFetchDatabaseList(createdConnection);
      connectionStore.setCurrentConnectionCtx({
        connection: createdConnection,
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

  return (
    <div className={`modal modal-middle ${show && "modal-open"}`}>
      <div className="modal-box relative">
        <h3 className="font-bold text-lg">Create Connection</h3>
        <button className="btn btn-sm btn-circle absolute right-4 top-4" onClick={close}>
          <Icon.IoMdClose className="w-5 h-auto" />
        </button>
        <div className="w-full flex flex-col justify-start items-start space-y-3 pt-4">
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
        </div>
        <div className="modal-action">
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
  );
};

export default CreateConnectionModal;

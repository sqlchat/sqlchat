import { cloneDeep } from "lodash-es";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { testConnection, useConnectionStore } from "@/store";
import { Connection, Engine } from "@/types";
import Icon from "./Icon";

interface Props {
  show: boolean;
  close: () => void;
}

const CreateConnectionModal = (props: Props) => {
  const { show, close } = props;
  const connectionStore = useConnectionStore();
  const [connection, setConnection] = useState<Connection>({
    id: "",
    title: "",
    engineType: Engine.MySQL,
    host: "",
    port: "",
    username: "",
    password: "",
  });
  const showDatabaseField = connection.engineType === Engine.PostgreSQL;

  const setPartialConnection = (state: Partial<Connection>) => {
    setConnection({
      ...connection,
      ...state,
    });
  };

  const handleCreateConnection = async () => {
    const connectionCreate = cloneDeep(connection);
    if (!showDatabaseField) {
      connectionCreate.database = undefined;
    }
    const result = await testConnection(connectionCreate);
    if (!result) {
      toast.error("Failed to connect");
      return;
    }
    connectionStore.createConnection(connectionCreate);
  };

  return (
    <div className={`modal modal-middle ${show && "modal-open"}`}>
      <div className="modal-box relative">
        <h3 className="font-bold text-lg">Create Connection</h3>
        <button className="btn btn-sm btn-circle absolute right-4 top-4" onClick={close}>
          <Icon.Io.IoMdClose className="w-5 h-auto" />
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
              <option className="hidden" value={Engine.PostgreSQL}>
                PostgreSQL
              </option>
            </select>
          </div>
          <div className="w-full flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
            <input
              type="text"
              placeholder="Connect host"
              className="input input-bordered w-full"
              onChange={(e) => setPartialConnection({ host: e.target.value })}
            />
          </div>
          <div className="w-full flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
            <input
              type="text"
              placeholder="Connect port"
              className="input input-bordered w-full"
              onChange={(e) => setPartialConnection({ port: e.target.value })}
            />
          </div>
          <div className="w-full flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Username</label>
            <input
              type="text"
              placeholder="Connect admin username"
              className="input input-bordered w-full"
              onChange={(e) => setPartialConnection({ username: e.target.value })}
            />
          </div>
          <div className="w-full flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Password</label>
            <input
              type="text"
              placeholder="Connect admin password"
              className="input input-bordered w-full"
              onChange={(e) => setPartialConnection({ password: e.target.value })}
            />
          </div>
          {showDatabaseField && (
            <div className="w-full flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">Database Name</label>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                onChange={(e) => setPartialConnection({ database: e.target.value })}
              />
            </div>
          )}
        </div>
        <div className="modal-action">
          <button className="btn btn-outline" onClick={close}>
            Close
          </button>
          <button className="btn" onClick={handleCreateConnection}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateConnectionModal;

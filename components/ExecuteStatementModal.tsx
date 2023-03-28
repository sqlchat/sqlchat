import { head } from "lodash-es";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { toast } from "react-hot-toast";
import { Connection } from "@/types";
import Icon from "./Icon";

interface Props {
  connection: Connection;
  databaseName: string;
  statement: string;
  close: () => void;
}

type RawQueryResult = {
  [key: string]: any;
};

const ExecuteStatementModal = (props: Props) => {
  const { close, connection, databaseName, statement } = props;
  const [rawResults, setRawResults] = useState<RawQueryResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const columns = Object.keys(head(rawResults) || {}).map((key) => {
    return {
      name: key,
      selector: (row: RawQueryResult) => row[key],
    };
  });

  useEffect(() => {
    const executeStatement = async () => {
      try {
        const response = await fetch("/api/connection/execute", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            connection,
            db: databaseName,
            statement,
          }),
        });
        const result = await response.json();
        setIsLoading(false);
        setRawResults(result);
      } catch (error) {
        console.error(error);
        toast.error("Failed to execute statement");
      }
    };

    executeStatement();
  }, []);

  return (
    <div className="modal modal-middle modal-open">
      <div className="modal-box w-full">
        <h3 className="font-bold text-lg">Execute query</h3>
        <button className="btn btn-sm btn-circle absolute right-4 top-4" onClick={close}>
          <Icon.IoMdClose className="w-5 h-auto" />
        </button>
        <div className="w-full flex flex-col justify-start items-start space-y-3 pt-4">
          {isLoading ? (
            <div className="w-full flex justify-center py-6 pt-8">
              <Icon.BiLoaderAlt className="w-6 h-auto opacity-70 animate-spin" />
            </div>
          ) : rawResults.length === 0 ? (
            <div className="w-full flex justify-center py-6 pt-8">No data return.</div>
          ) : (
            <div className="w-full">
              <DataTable className="w-full" columns={columns} data={rawResults} pagination responsive />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecuteStatementModal;

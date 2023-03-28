import { Drawer } from "@mui/material";
import { head } from "lodash-es";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { toast } from "react-hot-toast";
import { useQueryStore } from "@/store";
import Icon from "./Icon";

type RawQueryResult = {
  [key: string]: any;
};

const QueryDrawer = () => {
  const queryStore = useQueryStore();
  const [rawResults, setRawResults] = useState<RawQueryResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const context = queryStore.context;
  const columns = Object.keys(head(rawResults) || {}).map((key) => {
    return {
      name: key,
      selector: (row: RawQueryResult) => row[key],
    };
  });

  useEffect(() => {
    if (!queryStore.showDrawer) {
      return;
    }

    if (!context) {
      toast.error("No execution context found.");
      setIsLoading(false);
      setRawResults([]);
      return;
    }

    setIsLoading(true);
    setRawResults([]);
    const { connection, database, statement } = context;
    const executeStatement = async () => {
      try {
        const response = await fetch("/api/connection/execute", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            connection,
            db: database?.name,
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
  }, [context, queryStore.showDrawer]);

  const close = () => queryStore.toggleDrawer(false);

  return (
    <Drawer open={queryStore.showDrawer} anchor="right" className="w-full" onClose={close}>
      <div className="w-screen sm:w-[calc(60vw)] lg:w-[calc(50vw)] 2xl:w-[calc(40vw)] max-w-full flex flex-col justify-start items-start p-4">
        <button className="btn btn-sm btn-circle" onClick={close}>
          <Icon.IoMdClose className="w-5 h-auto" />
        </button>
        <h3 className="font-bold text-lg mt-4">Execute query</h3>
        <div className="w-full flex flex-col justify-start items-start space-y-3 pt-4">
          {isLoading ? (
            <div className="w-full flex justify-center py-6 pt-8">
              <Icon.BiLoaderAlt className="w-6 h-auto opacity-70 animate-spin" />
            </div>
          ) : rawResults.length === 0 ? (
            <div className="w-full flex justify-center py-6 pt-8">No data return.</div>
          ) : (
            <div className="w-full">
              <DataTable className="w-full border" columns={columns} data={rawResults} pagination responsive />
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default QueryDrawer;

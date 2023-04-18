import { Drawer } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import TextareaAutosize from "react-textarea-autosize";
import { useQueryStore } from "@/store";
import { ExecutionResult, ResponseObject } from "@/types";
import { checkStatementIsSelect, getMessageFromExecutionResult } from "@/utils";
import Tooltip from "./kit/Tooltip";
import Icon from "./Icon";
import EngineIcon from "./EngineIcon";
import DataTableView from "./ExecutionView/DataTableView";
import NotificationView from "./ExecutionView/NotificationView";
import ExecutionWarningBanner from "./ExecutionView/ExecutionWarningBanner";

const QueryDrawer = () => {
  const { t } = useTranslation();
  const queryStore = useQueryStore();
  const [executionResult, setExecutionResult] = useState<ExecutionResult | undefined>(undefined);
  const [statement, setStatement] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const context = queryStore.context;
  const executionMessage = executionResult ? getMessageFromExecutionResult(executionResult) : "";
  const showExecutionWarningBanner = statement.trim() && !checkStatementIsSelect(statement);

  useEffect(() => {
    if (!queryStore.showDrawer) {
      return;
    }

    const statement = context?.statement || "";
    setStatement(statement);
    if (statement !== "" && checkStatementIsSelect(statement)) {
      executeStatement(statement);
    }
    setExecutionResult(undefined);
  }, [context, queryStore.showDrawer]);

  const executeStatement = async (statement: string) => {
    if (!statement) {
      toast.error("Please enter a statement.");
      return;
    }

    if (!context) {
      toast.error("No execution context found.");
      setIsLoading(false);
      setExecutionResult(undefined);
      return;
    }

    setIsLoading(true);
    setExecutionResult(undefined);
    const { connection, database } = context;
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
      const result = (await response.json()) as ResponseObject<ExecutionResult>;
      if (result.message) {
        setExecutionResult({
          rawResult: [],
          error: result.message,
        });
      } else {
        setExecutionResult(result.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to execute statement");
    } finally {
      setIsLoading(false);
    }
  };

  const close = () => queryStore.toggleDrawer(false);

  return (
    <Drawer open={queryStore.showDrawer} anchor="right" className="w-full" onClose={close}>
      <div className="dark:text-gray-300 w-screen sm:w-[calc(60vw)] lg:w-[calc(50vw)] 2xl:w-[calc(40vw)] max-w-full flex flex-col justify-start items-start p-4">
        <button className="w-8 h-8 p-1 bg-zinc-600 text-gray-100 rounded-full hover:opacity-80" onClick={close}>
          <Icon.IoMdClose className="w-full h-auto" />
        </button>
        <h3 className="font-bold text-2xl mt-4">{t("execution.title")}</h3>
        {!context ? (
          <div className="w-full flex flex-col justify-center items-center py-6 pt-10">
            <Icon.BiSad className="w-7 h-auto opacity-70" />
            <span className="text-sm font-mono text-gray-500 mt-2">{t("execution.message.no-connection")}</span>
          </div>
        ) : (
          <>
            <div className="w-full flex flex-row justify-start items-center mt-4">
              <span className="opacity-70">{t("connection.self")}: </span>
              <EngineIcon className="w-6 h-auto" engine={context.connection.engineType} />
              <span>{context.database?.name}</span>
            </div>
            {showExecutionWarningBanner && <ExecutionWarningBanner className="rounded-lg mt-4" />}
            <div className="w-full h-auto mt-4 px-2 flex flex-row justify-between items-end border dark:border-zinc-700 rounded-lg overflow-clip">
              <TextareaAutosize
                className="w-full h-full outline-none border-none bg-transparent leading-6 pl-2 py-2 resize-none hide-scrollbar text-sm font-mono break-all whitespace-pre-wrap"
                value={statement}
                rows={1}
                minRows={1}
                maxRows={5}
                placeholder="Enter your SQL statement here..."
                onChange={(e) => setStatement(e.target.value)}
              />
              <Tooltip title={t("common.execute")} side="top">
                <button
                  className="w-6 p-1 -translate-y-2 cursor-pointer rounded-md hover:shadow opacity-90 hover:opacity-100 bg-indigo-600 text-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => executeStatement(statement)}
                >
                  <Icon.IoPlay className="w-full h-auto" />
                </button>
              </Tooltip>
            </div>
            <div className="w-full flex flex-col justify-start items-start mt-4">
              {isLoading ? (
                <div className="w-full flex flex-col justify-center items-center py-6 pt-10">
                  <Icon.BiLoaderAlt className="w-7 h-auto opacity-70 animate-spin" />
                  <span className="text-sm font-mono text-gray-500 mt-2">{t("execution.message.executing")}</span>
                </div>
              ) : (
                <>
                  {executionResult ? (
                    executionMessage ? (
                      <NotificationView message={executionMessage} style={executionResult?.error ? "error" : "info"} />
                    ) : (
                      <DataTableView rawResults={executionResult?.rawResult || []} />
                    )
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
};

export default QueryDrawer;

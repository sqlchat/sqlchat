import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useConnectionStore } from "@/store";
import Icon from "./Icon";
import ExecuteStatementModal from "./ExecuteStatementModal";

interface Props {
  language: string;
  value: string;
}

const checkStatementIsSelect = (statement: string) => {
  return statement.toUpperCase().trim().startsWith("SELECT");
};

export const CodeBlock = (props: Props) => {
  const { language, value } = props;
  const connectionStore = useConnectionStore();
  const [showExecuteQueryModal, setShowExecuteQueryModal] = useState(false);
  const currentConnectionCtx = connectionStore.currentConnectionCtx;
  // Only show execute button in the following situations:
  // * SQL code, and it is a SELECT statement;
  // * Connection setup;
  const showExecuteButton =
    language.toUpperCase() === "SQL" && checkStatementIsSelect(value) && currentConnectionCtx?.connection && currentConnectionCtx?.database;

  const copyToClipboard = () => {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      toast.error("Failed to copy to clipboard");
      return;
    }
    navigator.clipboard.writeText(value).then(() => {
      toast.success("Copied to clipboard");
    });
  };

  return (
    <>
      <div className="w-full max-w-full relative font-sans text-[16px]">
        <div className="flex items-center justify-between py-2 px-4">
          <span className="text-xs text-white font-mono">{language}</span>
          <div className="flex items-center space-x-2">
            <button
              className="flex justify-center items-center rounded bg-none w-6 h-6 p-1 text-xs text-white bg-gray-500 opacity-70 hover:opacity-100"
              onClick={copyToClipboard}
            >
              <Icon.BiClipboard className="w-full h-auto" />
            </button>
            {showExecuteButton && (
              <button
                className="flex justify-center items-center rounded bg-none w-6 h-6 p-1 text-xs text-white bg-gray-500 opacity-70 hover:opacity-100"
                onClick={() => setShowExecuteQueryModal(true)}
              >
                <Icon.IoPlay className="w-full h-auto" />
              </button>
            )}
          </div>
        </div>
        <SyntaxHighlighter language={language.toLowerCase()} style={oneDark} customStyle={{ margin: 0 }}>
          {value}
        </SyntaxHighlighter>
      </div>

      {showExecuteQueryModal &&
        showExecuteButton &&
        createPortal(
          <ExecuteStatementModal
            connection={currentConnectionCtx.connection}
            databaseName={currentConnectionCtx.database?.name || ""}
            statement={value}
            close={() => setShowExecuteQueryModal(false)}
          />,
          document.body
        )}
    </>
  );
};

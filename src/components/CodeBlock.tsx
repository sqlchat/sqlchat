import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useConnectionStore, useQueryStore } from "@/store";
import Icon from "./Icon";
import Tooltip from "./kit/Tooltip";

interface Props {
  language: string;
  value: string;
}

export const CodeBlock = (props: Props) => {
  const { language, value } = props;
  const { t } = useTranslation();
  const connectionStore = useConnectionStore();
  const queryStore = useQueryStore();
  const currentConnectionCtx = connectionStore.currentConnectionCtx;
  // Only show execute button in the following situations:
  // * SQL code;
  // * Connection setup;
  const showExecuteButton = currentConnectionCtx?.connection && currentConnectionCtx?.database && language.toUpperCase() === "SQL";

  const copyToClipboard = () => {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      toast.error("Failed to copy to clipboard");
      return;
    }
    navigator.clipboard.writeText(value).then(() => {
      toast.success("Copied to clipboard");
    });
  };

  const handleExecuteQuery = () => {
    if (!currentConnectionCtx) {
      toast.error("Please select a connection first");
      return;
    }

    queryStore.setContext({
      connection: currentConnectionCtx.connection,
      database: currentConnectionCtx.database,
      statement: value,
    });
    queryStore.toggleDrawer(true);
  };

  return (
    <div className="w-full max-w-full relative font-sans text-[16px]">
      <div className="flex items-center justify-between py-2 px-4">
        <span className="text-xs text-white font-mono">{language}</span>
        <div className="flex items-center space-x-2">
          <Tooltip title={t("common.copy")} side="top">
            <button
              className="flex justify-center items-center rounded bg-none w-6 h-6 p-1 text-xs text-white bg-gray-500 opacity-70 hover:opacity-100"
              onClick={copyToClipboard}
            >
              <Icon.BiClipboard className="w-full h-auto" />
            </button>
          </Tooltip>
          {showExecuteButton && (
            <Tooltip title={t("common.execute")} side="top">
              <button
                className="flex justify-center items-center rounded bg-none w-6 h-6 p-1 text-xs text-white bg-indigo-600 opacity-90 hover:opacity-100"
                onClick={handleExecuteQuery}
              >
                <Icon.IoPlay className="w-full h-auto" />
              </button>
            </Tooltip>
          )}
        </div>
      </div>
      <SyntaxHighlighter language={language.toLowerCase()} style={oneDark} customStyle={{ margin: 0 }}>
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

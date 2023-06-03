import { Drawer } from "@mui/material";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { getAssistantById, getPromptGeneratorOfAssistant, useConnectionStore, useConversationStore } from "@/store";
import { countTextTokens, getModel } from "@/utils";
import toast from "react-hot-toast";
import { CodeBlock } from "./CodeBlock";

interface Props {
  close: () => void;
}

const SchemaDrawer = (props: Props) => {
  const conversationStore = useConversationStore();
  const connectionStore = useConnectionStore();

  const currentConversation = conversationStore.getConversationById(conversationStore.currentConversationId);
  const [prompt, setPrompt] = useState<string>("");

  const getPrompt = async () => {
    if (!currentConversation) return;
    const promptGenerator = getPromptGeneratorOfAssistant(getAssistantById(currentConversation.assistantId)!);
    let dbPrompt = promptGenerator();
    const maxToken = 4000;
    let tokens = 0;

    if (connectionStore.currentConnectionCtx?.database) {
      let schema = "";
      try {
        const schemaList = await connectionStore.getOrFetchDatabaseSchema(connectionStore.currentConnectionCtx?.database);
        // Empty table name(such as []) denote all table. [] and `undefined` both are false in `if`
        const tableList: string[] = [];
        const selectedSchema = schemaList.find((schema: any) => schema.name == (currentConversation.selectedSchemaName || ""));
        if (currentConversation.selectedTablesName) {
          currentConversation.selectedTablesName.forEach((tableName: string) => {
            const table = selectedSchema?.tables.find((table: any) => table.name == tableName);
            tableList.push(table!.structure);
          });
        } else {
          for (const table of selectedSchema?.tables || []) {
            tableList.push(table!.structure);
          }
        }
        if (tableList) {
          for (const table of tableList) {
            if (tokens < maxToken / 2) {
              tokens += countTextTokens(table);
              schema += table;
            }
          }
        }
      } catch (error: any) {
        toast.error(error.message);
      }
      dbPrompt = promptGenerator(schema);
      setPrompt(dbPrompt);
      console.log(dbPrompt);
    }
  };
  useEffect(() => {
    // TODO: initial state with current conversation.
  }, []);
  useEffect(() => {
    getPrompt();
  }, []);

  const close = () => props.close();
  return (
    <Drawer open={true} anchor="right" className="w-full" onClose={close}>
      <div className="dark:text-gray-300 w-screen sm:w-[calc(40vw)] max-w-full flex flex-col justify-start items-start p-4">
        <button className="w-8 h-8 p-1 bg-zinc-600 text-gray-100 rounded-full hover:opacity-80" onClick={close}>
          <Icon.IoMdClose className="w-full h-auto" />
        </button>
        <h3 className="font-bold text-2xl mt-4">Current conversation related schema</h3>
        <div>
          <CodeBlock language="SQL" value={prompt} messageId={currentConversation?.id || ""} />
        </div>
      </div>
    </Drawer>
  );
};

export default SchemaDrawer;

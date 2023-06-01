import { Drawer } from "@mui/material";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { getAssistantById, getPromptGeneratorOfAssistant, useConnectionStore, useConversationStore } from "@/store";
import { countTextTokens, getModel } from "@/utils";
import toast from "react-hot-toast";

interface Props {
  close: () => void;
}

const SchemaDrawer = (props: Props) => {
  const conversationStore = useConversationStore();
  const connectionStore = useConnectionStore();

  const currentConversation = conversationStore.getConversationById(conversationStore.currentConversationId);

  useEffect(() => {
    // TODO: initial state with current conversation.
  }, []);
  useEffect(async () => {
    if (!currentConversation) return;
    const promptGenerator = getPromptGeneratorOfAssistant(getAssistantById(currentConversation.assistantId)!);
    let dbPrompt = promptGenerator();
    // const maxToken = getModel(settingStore.setting.openAIApiConfig?.model || "").max_token;
    const maxToken = 4000;
    // Squeeze as much prompt as possible under the token limit, the prompt is in the order of:
    // 1. Assistant specific prompt with database schema if applicable.
    // 2. A list of previous exchanges.
    // 3. The current user prompt.
    //
    // The priority to fill in the prompt is in the order of:
    // 1. The current user prompt.
    // 2. Assistant specific prompt with database schema if applicable.
    // 3. A list of previous exchanges
    // let tokens = countTextTokens(userPrompt);
    let tokens = 0;

    // Augument with database schema if available
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
    }
  }, []);

  const [prompt, setPrompt] = useState<string>("");
  const close = () => props.close();

  return (
    <Drawer open={true} anchor="right" className="w-full" onClose={close}>
      <div className="dark:text-gray-300 w-screen sm:w-[calc(40vw)] max-w-full flex flex-col justify-start items-start p-4">
        <button className="w-8 h-8 p-1 bg-zinc-600 text-gray-100 rounded-full hover:opacity-80" onClick={close}>
          <Icon.IoMdClose className="w-full h-auto" />
        </button>
        <h3 className="font-bold text-2xl mt-4">Current conversation related schema</h3>
        <div>{prompt}</div>
      </div>
    </Drawer>
  );
};

export default SchemaDrawer;

import { Drawer } from "@mui/material";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { getAssistantById, getPromptGeneratorOfAssistant, useConnectionStore, useConversationStore, useSettingStore } from "@/store";
import { getModel, generateDbPromptFromContext } from "@/utils";
import toast from "react-hot-toast";
import { CodeBlock } from "./CodeBlock";

interface Props {
  close: () => void;
}

const SchemaDrawer = (props: Props) => {
  const conversationStore = useConversationStore();
  const connectionStore = useConnectionStore();
  const settingStore = useSettingStore();

  const currentConversation = conversationStore.getConversationById(conversationStore.currentConversationId);
  const [prompt, setPrompt] = useState<string>("");

  const getPrompt = async () => {
    if (!currentConversation) return;
    if (!connectionStore.currentConnectionCtx?.database) return;
    const promptGenerator = getPromptGeneratorOfAssistant(getAssistantById(currentConversation.assistantId)!);
    let dbPrompt = promptGenerator();
    const maxToken = getModel(settingStore.setting.openAIApiConfig?.model || "").max_token;
    const schemaList = await connectionStore.getOrFetchDatabaseSchema(connectionStore.currentConnectionCtx?.database);

    if (connectionStore.currentConnectionCtx?.database) {
      try {
        dbPrompt = generateDbPromptFromContext(
          promptGenerator,
          schemaList,
          currentConversation.selectedSchemaName || "",
          currentConversation.selectedTablesName || [],
          maxToken
        );
        setPrompt(dbPrompt);
      } catch (error: any) {
        toast.error(error.message);
      }
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
          <CodeBlock language="Prompt" value={prompt} messageId={currentConversation?.id || ""} wrapLongLines={true} />
        </div>
      </div>
    </Drawer>
  );
};

export default SchemaDrawer;

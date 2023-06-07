import { encode } from "@nem035/gpt-3-encoder";
import { Drawer } from "@mui/material";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { getAssistantById, getPromptGeneratorOfAssistant, useConnectionStore, useConversationStore, useSettingStore } from "@/store";
import { getModel, generateDbPromptFromContext } from "@/utils";
import { CodeBlock } from "./CodeBlock";
import { useTranslation } from "react-i18next";

interface Props {
  close: () => void;
}

const SchemaDrawer = (props: Props) => {
  const { t } = useTranslation();
  const conversationStore = useConversationStore();
  const connectionStore = useConnectionStore();
  const settingStore = useSettingStore();
  const currentConversation = conversationStore.getConversationById(conversationStore.currentConversationId);
  const maxToken = getModel(settingStore.setting.openAIApiConfig?.model || "").max_token;
  const [prompt, setPrompt] = useState<string>("");

  const getPrompt = async () => {
    if (!currentConversation) return;
    const promptGenerator = getPromptGeneratorOfAssistant(getAssistantById(currentConversation.assistantId)!);
    let dbPrompt = promptGenerator();
    if (connectionStore.currentConnectionCtx?.database) {
      const schemaList = await connectionStore.getOrFetchDatabaseSchema(connectionStore.currentConnectionCtx?.database);
      dbPrompt = generateDbPromptFromContext(
        promptGenerator,
        connectionStore.currentConnectionCtx.connection.engineType,
        schemaList,
        currentConversation.selectedSchemaName || "",
        currentConversation.selectedTableNameList || [],
        maxToken
      );
    }
    setPrompt(dbPrompt);
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
      <div className="dark:text-gray-300 w-screen sm:w-[calc(75vw)] max-w-full flex flex-col  p-4">
        <button className="w-8 h-8 p-1 bg-zinc-600 text-gray-100 rounded-full hover:opacity-80" onClick={close}>
          <Icon.IoMdClose className="w-full h-auto" />
        </button>
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-2xl mt-4">{t("prompt.current-conversation")}</h3>
          <div className="text-base mt-4">
            {t("connection.total-token")} {encode(prompt).length}/{maxToken}
          </div>
        </div>
        <div>
          <CodeBlock language="Prompt" value={prompt} messageId={currentConversation?.id || ""} wrapLongLines={true} />
        </div>
      </div>
    </Drawer>
  );
};

export default SchemaDrawer;

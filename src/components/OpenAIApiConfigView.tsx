import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "react-use";
import { useSettingStore } from "@/store";
import { OpenAIApiConfig } from "@/types";
import TextField from "./kit/TextField";

const OpenAIApiConfigView = () => {
  const { t } = useTranslation();
  const settingStore = useSettingStore();
  const [openAIApiConfig, setOpenAIApiConfig] = useState(
    settingStore.setting.openAIApiConfig
  );

  useDebounce(
    () => {
      settingStore.setOpenAIApiConfig(openAIApiConfig);
    },
    300,
    [openAIApiConfig]
  );

  const handleSetOpenAIApiConfig = (config: Partial<OpenAIApiConfig>) => {
    setOpenAIApiConfig({
      ...openAIApiConfig,
      ...config,
    });
  };

  return (
    <>
      <div className="w-full border border-gray-200 dark:border-zinc-700 p-4 rounded-lg">
        <div className="flex flex-col">
          <label className="mb-1">OpenAI API Key</label>
          <TextField
            placeholder="OpenAI API Key"
            value={openAIApiConfig.key}
            onChange={(value) => handleSetOpenAIApiConfig({ key: value })}
          />
        </div>
        <div className="flex flex-col mt-3">
          <label className="mb-1">API Endpoint</label>
          <TextField
            placeholder="OpenAI API Endpoint"
            value={openAIApiConfig.endpoint}
            onChange={(value) => handleSetOpenAIApiConfig({ endpoint: value })}
          />
        </div>
      </div>
    </>
  );
};

export default OpenAIApiConfigView;

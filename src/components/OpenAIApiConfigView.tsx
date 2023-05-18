import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "react-use";
import { useSettingStore } from "@/store";
import { OpenAIApiConfig } from "@/types";
import TextField from "./kit/TextField";
import { set } from "lodash-es";

const OpenAIApiConfigView = () => {
  const { t } = useTranslation();
  const settingStore = useSettingStore();
  const [openAIApiConfig, setOpenAIApiConfig] = useState(
    settingStore.setting.openAIApiConfig
  );
  const [maskKey, setMaskKey] = useState(true);

  const maskedKey = (str: string) => {
    if (str.length < 7) {
      return str;
    }
    const firstThree = str.slice(0, 3);
    const lastFour = str.slice(-4);
    const middle = ".".repeat(str.length - 7);
    return `${firstThree}${middle}${lastFour}`;
  };

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
    setMaskKey(false);
  };

  return (
    <>
      <div className="w-full border border-gray-200 dark:border-zinc-700 p-4 rounded-lg">
        <div className="flex flex-col">
          <label className="mb-1">OpenAI API Key</label>
          <TextField
            placeholder="OpenAI API Key"
            value={
              maskKey ? maskedKey(openAIApiConfig.key) : openAIApiConfig.key
            }
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

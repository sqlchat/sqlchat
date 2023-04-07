import { useState } from "react";
import { useDebounce } from "react-use";
import { useSettingStore } from "@/store";
import { OpenAIApiConfig } from "@/types";

const OpenAIApiConfigView = () => {
  const settingStore = useSettingStore();
  const [openAIApiConfig, setOpenAIApiConfig] = useState(settingStore.setting.openAIApiConfig);

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
      <h3>OpenAI API configuration</h3>
      <div className="w-full border border-gray-200 p-4 rounded-lg">
        <div className="flex flex-col">
          <label htmlFor="openai-api-key">Key</label>
          <input
            id="openai-api-key"
            className="input input-bordered input-sm mt-1"
            type="text"
            placeholder="OpenAI API Key"
            value={openAIApiConfig.key}
            onChange={(e) => {
              handleSetOpenAIApiConfig({
                key: e.target.value,
              });
            }}
          />
        </div>
        <div className="flex flex-col mt-2">
          <label htmlFor="openai-api-endpoint">Endpoint</label>
          <input
            id="openai-api-endpoint"
            className="input input-bordered input-sm mt-1"
            type="text"
            placeholder="OpenAI API Endpoint"
            value={openAIApiConfig.endpoint}
            onChange={(e) => {
              handleSetOpenAIApiConfig({
                endpoint: e.target.value,
              });
            }}
          />
        </div>
      </div>
    </>
  );
};

export default OpenAIApiConfigView;

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "react-use";
import { useSettingStore } from "@/store";
import { OpenAIApiConfig } from "@/types";
import { allowSelfOpenAIKey } from "@/utils";
import Radio from "./kit/Radio";
import TextField from "./kit/TextField";
import Tooltip from "./kit/Tooltip";

const OpenAIApiConfigView = () => {
  const { t } = useTranslation();
  const settingStore = useSettingStore();
  const [openAIApiConfig, setOpenAIApiConfig] = useState(settingStore.setting.openAIApiConfig);
  const [maskKey, setMaskKey] = useState(true);

  const models = [
    {
      id: "gpt-3.5-turbo",
      title: `GPT-3.5 (${t("setting.openai-api-configuration.quota-per-ask", { count: 1 })})`,
      disabled: false,
      tooltip: "",
    },
    // Disable GPT-4 if user doesn't provide key (because SQL Chat own key hasn't been whitelisted yet).
    {
      id: "gpt-4",
      title: `GPT-4 (${t("setting.openai-api-configuration.quota-per-ask", { count: 10 })})`,
      disabled: false,
      tooltip: "",
    },
  ];

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

  const modelRadio = (model: any) => {
    return (
      <div key={model.id} className="flex items-center">
        <Radio
          value={model.id}
          disabled={model.disabled}
          checked={openAIApiConfig.model === model.id}
          onChange={(value) => handleSetOpenAIApiConfig({ model: value })}
        />
        <label htmlFor={model.id} className="ml-3 block text-sm font-medium leading-6 text-gray-900">
          {model.title}
        </label>
      </div>
    );
  };

  return (
    <>
      <div className="w-full border border-gray-200 dark:border-zinc-700 p-4 rounded-lg">
        <div>
          <label className="text-base font-semibold ">{t("setting.openai-api-configuration.model")}</label>
          {allowSelfOpenAIKey() && <p className="text-sm text-gray-500">{t("setting.openai-api-configuration.model-description")}</p>}
          <fieldset className="mt-4">
            <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
              {models.map((model) =>
                model.disabled ? (
                  <Tooltip key={model.id} title={model.tooltip} side="top">
                    {modelRadio(model)}
                  </Tooltip>
                ) : (
                  modelRadio(model)
                )
              )}
            </div>
          </fieldset>
        </div>
        {allowSelfOpenAIKey() && (
          <>
            <div className="flex flex-col mt-4">
              <label className="text-base font-semibold">OpenAI API Key</label>
              <p className="text-sm text-gray-500">{t("setting.openai-api-configuration.key-description")}</p>
              <TextField
                className="mt-4"
                placeholder="OpenAI API Key"
                value={maskKey ? maskedKey(openAIApiConfig.key) : openAIApiConfig.key}
                onChange={(value) => handleSetOpenAIApiConfig({ key: value })}
              />
            </div>
            <div className="flex flex-col mt-4">
              <label className="text-base font-semibold">OpenAI API Endpoint</label>
              <div className="flex">
                <p className="text-sm text-gray-500">{t("setting.openai-api-configuration.endpoint-description")}</p>
                <a
                  href="https://platform.openai.com/account/api-keys"
                  target="_blank"
                  className="text-sm text-indigo-600 hover:text-indigo-900"
                >
                  {t("setting.openai-api-configuration.find-my-key")}
                </a>
              </div>
              <TextField
                className="mt-4"
                placeholder="API Endpoint"
                value={openAIApiConfig.endpoint}
                onChange={(value) => handleSetOpenAIApiConfig({ endpoint: value })}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default OpenAIApiConfigView;

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "react-use";
import { useSettingStore } from "@/store";
import { DashScopeApiConfig } from "@/types";
import Radio from "./kit/Radio";
import TextField from "./kit/TextField";

const DashScopeApiConfigView = () => {
  const { t } = useTranslation();
  const settingStore = useSettingStore();
  const [mounted, setMounted] = useState(false);
  const [dashScopeApiConfig, setDashScopeApiConfig] = useState<DashScopeApiConfig>({
    key: "",
    model: "qwen-turbo",
  });
  const [maskKey, setMaskKey] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (settingStore.setting.dashScopeApiConfig) {
      setDashScopeApiConfig(settingStore.setting.dashScopeApiConfig);
    }
  }, []);

  const models = [
    {
      id: "qwen-turbo",
      title: "Qwen Turbo",
      cost: 1,
      disabled: false,
      tooltip: "",
    },
    {
      id: "qwen-plus",
      title: "Qwen Plus",
      cost: 2,
      disabled: false,
      tooltip: "",
    },
  ];

  const maskedKey = (str: string | null | undefined) => {
    if (!str || str.length < 7) {
      return str || "";
    }
    return str.slice(0, 3) + "..." + str.slice(-4);
  };

  useDebounce(
    () => {
      if (dashScopeApiConfig && mounted) {
        settingStore.setDashScopeApiConfig(dashScopeApiConfig);
      }
    },
    1000,
    [dashScopeApiConfig]
  );

  const handleKeyChange = (value: string) => {
    setDashScopeApiConfig({
      ...dashScopeApiConfig,
      key: value,
    });
  };

  const handleModelChange = (value: string) => {
    setDashScopeApiConfig({
      ...dashScopeApiConfig,
      model: value,
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full border border-gray-200 dark:border-zinc-700 p-4 rounded-lg space-y-4">
      <div className="w-full flex flex-col justify-start items-start">
        <div className="w-full flex flex-row justify-between items-center mb-2">
          <span>{t("setting.dashscope.api-key")}</span>
          <button className="btn-text" onClick={() => setMaskKey(!maskKey)}>
            {maskKey ? t("common.show") : t("common.hide")}
          </button>
        </div>
        <TextField
          className="w-full"
          placeholder={t("setting.dashscope.api-key-placeholder") || ""}
          value={maskKey ? maskedKey(dashScopeApiConfig.key) : dashScopeApiConfig.key}
          onChange={handleKeyChange}
          type={maskKey ? "text" : "password"}
        />
      </div>

      <div className="w-full flex flex-col justify-start items-start">
        <div className="w-full flex flex-row justify-between items-center mb-2">
          <span>{t("setting.dashscope.model")}</span>
        </div>
        <div className="w-full flex flex-row justify-start items-start flex-wrap gap-2">
          {models.map((model) => (
            <label key={model.id} className="flex items-center space-x-2 w-auto grow sm:grow-0 cursor-pointer">
              <Radio
                value={model.id}
                checked={dashScopeApiConfig.model === model.id}
                disabled={model.disabled}
                onChange={handleModelChange}
              />
              <span>{model.title}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashScopeApiConfigView;

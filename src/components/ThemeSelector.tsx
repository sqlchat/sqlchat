import { useTranslation } from "react-i18next";
import { useSettingStore } from "@/store";
import { Theme } from "@/types";
import Select from "./kit/Select";

interface ThemeItem {
  value: Theme;
  label: string;
}

const ThemeSelector = () => {
  const { t } = useTranslation();
  const settingStore = useSettingStore();
  const theme = settingStore.setting.theme;

  const themeItemList: ThemeItem[] = [
    {
      value: "system",
      label: t("setting.theme.system"),
    },
    {
      value: "light",
      label: t("setting.theme.light"),
    },
    {
      value: "dark",
      label: t("setting.theme.dark"),
    },
  ];

  const handleThemeChange = (theme: Theme) => {
    settingStore.setTheme(theme);
  };

  return <Select className="w-auto min-w-[120px]" value={theme} itemList={themeItemList} onValueChange={handleThemeChange} />;
};

export default ThemeSelector;

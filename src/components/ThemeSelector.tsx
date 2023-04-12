import { useSettingStore } from "@/store";
import { Theme } from "@/types";
import Select from "./kit/Select";

interface ThemeItem {
  value: Theme;
  label: string;
}

const themeItemList: ThemeItem[] = [
  {
    value: "system",
    label: "System",
  },
  {
    value: "light",
    label: "Light",
  },
  {
    value: "dark",
    label: "Dark",
  },
];

const ThemeSelector = () => {
  const settingStore = useSettingStore();
  const theme = settingStore.setting.theme;

  const handleThemeChange = (theme: Theme) => {
    settingStore.setTheme(theme);
  };

  return <Select className="w-28" value={theme} itemList={themeItemList} onValueChange={handleThemeChange} />;
};

export default ThemeSelector;

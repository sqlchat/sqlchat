import { useSettingStore } from "@/store";
import Icon from "./Icon";

const ThemeSwitch = () => {
  const settingStore = useSettingStore();
  const theme = settingStore.setting.theme;

  const handleThemeChange = () => {
    if (theme === "light") {
      settingStore.setLocale("zh");
    } else {
      settingStore.setLocale("en");
    }
  };

  return (
    <button className="w-10 h-10 p-1 rounded-full flex flex-row justify-center items-center hover:bg-gray-100" onClick={handleThemeChange}>
      <Icon.IoSunny className="text-gray-600 w-6 h-auto" />
    </button>
  );
};

export default ThemeSwitch;

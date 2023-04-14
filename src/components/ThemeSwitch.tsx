import { useSettingStore } from "@/store";
import Icon from "./Icon";

const ThemeSwitch = () => {
  const settingStore = useSettingStore();
  const theme = settingStore.setting.theme;
  const locale = settingStore.setting.locale;

  const handleThemeChange = () => {
    if (theme === "light") {
      if (locale === "en") {
        settingStore.setLocale("zh");
      } else {
        settingStore.setLocale("es");
      }
      settingStore.setTheme("dark");
    } else {
      settingStore.setTheme("light");
    }
  };

  return (
    <button 
      className="w-10 h-10 p-1 rounded-full flex flex-row justify-center items-center hover:bg-gray-100" 
      onClick={handleThemeChange}
    >
      {theme === "light" ? (
        <Icon.IoSunny className="text-gray-600 w-6 h-auto" />
      ) : (
        <Icon.IoMoon className="text-gray-600 w-6 h-auto" />
      )}
    </button>
  );
};

export default ThemeSwitch;

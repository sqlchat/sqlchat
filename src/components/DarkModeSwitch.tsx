import { useSettingStore } from "@/store";
import useDarkMode from "@/hooks/useDarkmode";
import Icon from "./Icon";

const DarkModeSwitch = () => {
  const settingStore = useSettingStore();
  const isDarkMode = useDarkMode();

  const switchDarkMode = () => {
    if (isDarkMode) {
      settingStore.setTheme("light");
    } else {
      settingStore.setTheme("dark");
    }
  };

  const ModeIcon = isDarkMode ? Icon.IoMdMoon : Icon.IoMdSunny;

  return (
    <button
      className="w-10 h-10 p-1 rounded-full flex flex-row justify-center items-center hover:bg-gray-100 dark:hover:bg-zinc-700"
      onClick={switchDarkMode}
    >
      <ModeIcon className="text-gray-600 dark:text-gray-300 w-6 h-auto" />
    </button>
  );
};

export default DarkModeSwitch;

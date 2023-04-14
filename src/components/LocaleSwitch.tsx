import { useSettingStore } from "@/store";
import Icon from "./Icon";

const LocaleSwitch = () => {
  const settingStore = useSettingStore();
  const locale = settingStore.setting.locale;

  const handleLocaleChange = () => {
    if (locale === "en") {
      settingStore.setLocale("zh");
    } else if (locale === "zh") {
      settingStore.setLocale("es");
    } else {
      settingStore.setLocale("en");
    }
  };

  return (
    <button
      className="w-10 h-10 p-1 rounded-full flex flex-row justify-center items-center hover:bg-gray-100 dark:hover:bg-zinc-700"
      onClick={handleLocaleChange}
    >
      <Icon.IoLanguage className="text-gray-600 dark:text-gray-300 w-6 h-auto" />
    </button>
  );
};

export default LocaleSwitch;

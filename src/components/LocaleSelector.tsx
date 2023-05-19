import { useSettingStore } from "@/store";
import { Locale } from "@/types";
import Select from "./kit/Select";

interface LocaleItem {
  value: Locale;
  label: string;
}

const localeItemList: LocaleItem[] = [
  {
    value: "en",
    label: "English",
  },
  {
    value: "zh",
    label: "简体中文",
  },
  {
    value: "es",
    label: "Español",
  },
];

const LocaleSelector = () => {
  const settingStore = useSettingStore();
  const locale = settingStore.setting.locale;

  const handleLocaleChange = (locale: Locale) => {
    settingStore.setLocale(locale);
  };

  return <Select className="w-28" value={locale} itemList={localeItemList} onValueChange={handleLocaleChange} />;
};

export default LocaleSelector;

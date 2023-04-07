import { useSettingStore } from "@/store";

const LocaleSelector = () => {
  const settingStore = useSettingStore();
  const locale = settingStore.setting.locale;

  const handleLocaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    settingStore.setLocale(event.target.value as any);
  };

  return (
    <select className="select select-bordered select-sm" value={locale} onChange={handleLocaleChange}>
      <option value="en">English</option>
      <option value="zh">简体中文</option>
    </select>
  );
};

export default LocaleSelector;

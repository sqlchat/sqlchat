import { useSettingStore } from "@/store";
import { useEffect, useState } from "react";

const useDarkMode = () => {
  const settingStore = useSettingStore();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });
  }, [settingStore.setting.theme]);

  return isDarkMode;
};

export default useDarkMode;

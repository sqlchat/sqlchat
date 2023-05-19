import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useSettingStore } from "@/store";

const ThreeDotsLoader = () => {
  const settingStore = useSettingStore();
  const [color, setColor] = useState("gray");

  useEffect(() => {
    const theme = settingStore.setting.theme;
    let appearance = theme;
    if (theme === "system") {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        appearance = "dark";
      } else {
        appearance = "light";
      }
    }

    if (appearance === "dark") {
      setColor("white");
    } else {
      setColor("gray");
    }
  }, [settingStore.setting.theme]);

  return <ThreeDots wrapperClass="dark:opacity-60" width="24" height="24" color={color} />;
};

export default ThreeDotsLoader;

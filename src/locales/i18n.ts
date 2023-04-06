import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enLocale from "./en.json";
import zhLocale from "./zh.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enLocale,
    },
    zh: {
      translation: zhLocale,
    },
  },
  fallbackLng: "en",
});

export default i18n;

import React from "react";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";
import { hasFeature } from "../utils";
import Icon from "./Icon";
import AccountView from "./AccountView";
import DebugView from "./DebugView";
import PricingView from "./PricingView";
import WeChatQRCodeView from "./WeChatQRCodeView";
import ClearDataButton from "./ClearDataButton";
import LocaleSelector from "./LocaleSelector";
import ThemeSelector from "./ThemeSelector";
import OpenAIApiConfigView from "./OpenAIApiConfigView";

const SettingView = () => {
  const { t } = useTranslation();
  const { data: session } = useSession();

  return (
    <div className="w-full flex flex-col justify-start items-start space-y-3 py-4 sm:py-8">
      <div className="w-full flex flex-row justify-start items-start flex-wrap gap-2">
        <a
          href="https://discord.gg/z6kakemDjm"
          className="w-auto px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium flex flex-row justify-center items-center hover:underline hover:shadow"
          target="_blank"
        >
          <Icon.BsDiscord className="w-4 h-auto mr-1" />
          {t("social.join-discord-channel")}
        </a>
        <WeChatQRCodeView />
      </div>

      {hasFeature("debug") && (
        <div className="w-full border border-gray-200 dark:border-zinc-700 p-4 rounded-lg space-y-2">
          <DebugView />
        </div>
      )}

      {hasFeature("account") && (
        <div className="w-full border border-gray-200 dark:border-zinc-700 p-4 rounded-lg space-y-2">
          <AccountView />
        </div>
      )}

      {hasFeature("payment") && session?.user?.subscription.plan != "PRO" && (
        <div className="w-full border border-gray-200 dark:border-zinc-700 p-4 rounded-lg space-y-2">
          <PricingView />
        </div>
      )}

      <OpenAIApiConfigView />

      <div className="w-full border border-gray-200 dark:border-zinc-700 p-4 rounded-lg space-y-2">
        <div className="w-full flex flex-row justify-between items-center gap-2">
          <span>{t("setting.basic.language")}</span>
          <LocaleSelector />
        </div>
        <div className="w-full flex flex-row justify-between items-center gap-2">
          <span>{t("setting.theme.self")}</span>
          <ThemeSelector />
        </div>
      </div>

      <div className="w-full border border-gray-200 dark:border-zinc-700 p-4 rounded-lg space-y-4">
        <div className="w-full flex flex-row justify-between items-center gap-2">
          <a href={"privacy"} target="_blank">
            Privacy
          </a>
        </div>
        <div className="w-full flex flex-row justify-between items-center gap-22">
          <a href={"terms"} target="_blank">
            Terms
          </a>
        </div>
      </div>

      <div className="w-full border border-red-200 dark:border-zinc-700 p-4 rounded-lg">
        <div className="w-full flex flex-row justify-between items-center gap-2">
          <span>{t("setting.data.clear-all-data")}</span>
          <ClearDataButton />
        </div>
      </div>
    </div>
  );
};

export default SettingView;

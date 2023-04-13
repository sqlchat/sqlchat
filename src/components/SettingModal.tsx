import { useTranslation } from "react-i18next";
import Modal from "./kit/Modal";
import Icon from "./Icon";
import WeChatQRCodeView from "./WeChatQRCodeView";
import ClearDataButton from "./ClearDataButton";
import LocaleSelector from "./LocaleSelector";
import ThemeSelector from "./ThemeSelector";
import OpenAIApiConfigView from "./OpenAIApiConfigView";

interface Props {
  close: () => void;
}

const SettingModal = (props: Props) => {
  const { close } = props;
  const { t } = useTranslation();

  return (
    <Modal title={t("setting.self")} onClose={close}>
      <div className="w-full flex flex-col justify-start items-start space-y-3 pt-4">
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

        <h3 className="pl-4 text-sm text-gray-500">{t("setting.basic.self")}</h3>
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

        <OpenAIApiConfigView />

        <h3 className="pl-4 text-sm text-gray-500">{t("setting.data.self")}</h3>
        <div className="w-full border border-red-200 dark:border-zinc-700 p-4 rounded-lg">
          <div className="w-full flex flex-row justify-between items-center gap-2">
            <span>{t("setting.data.clear-all-data")}</span>
            <ClearDataButton />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SettingModal;

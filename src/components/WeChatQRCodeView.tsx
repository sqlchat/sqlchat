import { useTranslation } from "react-i18next";
import Icon from "./Icon";

const WeChatQRCodeView = () => {
  const { t } = useTranslation();

  return (
    <a
      className="w-auto px-4 py-2 rounded-full cursor-pointer bg-green-600 text-white text-sm font-medium flex flex-row justify-center items-center hover:underline hover:shadow"
      href="/wechat-qrcode.webp"
      target="_blank"
    >
      <Icon.BsWechat className="w-4 h-auto mr-1" />
      {t("social.join-wechat-group")}
    </a>
  );
};

export default WeChatQRCodeView;

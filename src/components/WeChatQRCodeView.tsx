import { useTranslation } from "react-i18next";
import Icon from "./Icon";
import Popover from "./kit/Popover";

const WeChatQRCodeView = () => {
  const { t } = useTranslation();

  return (
    <Popover
      tigger={
        <div className="w-auto px-4 py-2 rounded-full cursor-pointer bg-green-600 text-white text-sm font-medium flex flex-row justify-center items-center hover:shadow">
          <Icon.BsWechat className="w-4 h-auto mr-1" />
          {t("social.join-wechat-group")}
        </div>
      }
    >
      <img className="w-40 h-auto" src="/wechat-qrcode.webp" alt="wechat qrcode" />
    </Popover>
  );
};

export default WeChatQRCodeView;

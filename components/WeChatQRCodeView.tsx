import { Popover } from "@mui/material";
import { useState } from "react";
import Icon from "./Icon";

const WeChatQRCodeView = () => {
  const [wechatAnchorEl, setWeChatAnchorEl] = useState<HTMLElement | null>(null);
  const openWeChatQrCodePopover = Boolean(wechatAnchorEl);

  return (
    <>
      <div
        className="w-auto px-4 py-2 mr-2 mb-2 rounded-full cursor-pointer bg-green-600 text-white text-sm font-medium flex flex-row justify-center items-center hover:shadow"
        onClick={(e) => setWeChatAnchorEl(e.currentTarget)}
      >
        <Icon.BsWechat className="w-4 h-auto mr-1" />
        Join WeChat Group
      </div>
      <Popover
        open={openWeChatQrCodePopover}
        anchorEl={wechatAnchorEl}
        onClose={() => setWeChatAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <img className="w-64 h-auto" src="/wechat-qrcode.webp" alt="wechat qrcode" />
      </Popover>
    </>
  );
};

export default WeChatQRCodeView;

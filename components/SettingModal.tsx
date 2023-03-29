import { Popover } from "@mui/material";
import { useState } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";
import ClearDataConfirmModal from "./ClearDataConfirmModal";

interface Props {
  show: boolean;
  close: () => void;
}

interface State {
  showClearDataConfirmModal: boolean;
}

const SettingModal = (props: Props) => {
  const { show, close } = props;
  const [state, setState] = useState<State>({
    showClearDataConfirmModal: false,
  });
  const [wechatAnchorEl, setWeChatAnchorEl] = useState<HTMLElement | null>(null);
  const openWeChatQrCodePopover = Boolean(wechatAnchorEl);

  const toggleClearDataConfirmModal = (show = true) => {
    setState({
      ...state,
      showClearDataConfirmModal: show,
    });
  };

  return (
    <>
      <div className={`modal modal-middle ${show && "modal-open"}`}>
        <div className="modal-box relative">
          <h3 className="font-bold text-lg">Setting</h3>
          <button className="btn btn-sm btn-circle absolute right-4 top-4" onClick={close}>
            <Icon.IoMdClose className="w-5 h-auto" />
          </button>
          <div className="w-full flex flex-col justify-start items-start space-y-3 pt-4">
            <div className="w-full flex flex-row justify-start items-start flex-wrap">
              <a
                href="https://discord.gg/6R3qb32h"
                className="w-auto px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium flex flex-row justify-center items-center mr-2 mb-2 hover:underline hover:shadow"
                target="_blank"
              >
                <Icon.BsDiscord className="w-4 h-auto mr-1" />
                Join Discord Channel
              </a>
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
                <img className="w-64 h-auto" src="/wechat-qrcode.webp" alt="" />
              </Popover>
            </div>

            <h3>Danger Zone</h3>
            <div className="w-full border border-red-200 p-4 rounded-lg">
              <div className="w-full flex flex-row justify-between items-center gap-2">
                <span>Clear all data</span>
                <button className="btn btn-sm btn-error" onClick={() => toggleClearDataConfirmModal(true)}>
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {state.showClearDataConfirmModal &&
        createPortal(<ClearDataConfirmModal close={() => toggleClearDataConfirmModal(false)} />, document.body)}
    </>
  );
};

export default SettingModal;

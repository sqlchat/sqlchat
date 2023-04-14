import { Modal as ModalUI } from "@mui/material";
import { ReactNode } from "react";
import Icon from "../Icon";

interface Props {
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
}

const Modal = (props: Props) => {
  const { children, title, onClose, className } = props;

  return (
    <ModalUI className="!z-100" open={true} onClose={onClose}>
      <div
        className={`${
          className || ""
        } flex flex-col bg-white dark:bg-zinc-800 rounded-xl p-4 fixed top-[50%] left-[50%] h-auto max-h-[85vh] w-[90vw] max-w-[90vw] sm:max-w-lg translate-x-[-50%] translate-y-[-50%] z-100 outline-none`}
      >
        <p className="text-lg pl-1 text-black dark:text-gray-300 font-medium mb-2">{title}</p>
        <button
          className="absolute top-3 right-3 outline-none w-8 h-8 p-1 bg-zinc-600 rounded-full text-gray-300 hover:opacity-80"
          aria-label="Close"
          onClick={onClose}
        >
          <Icon.IoClose className="w-full h-auto" />
        </button>
        <div className="w-full px-1 h-[calc(100%-36px)] flex flex-col justify-start items-start overflow-y-auto">{children}</div>
      </div>
    </ModalUI>
  );
};

export default Modal;

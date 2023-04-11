import * as DialogUI from "@radix-ui/react-dialog";
import React, { ReactNode } from "react";
import Icon from "../Icon";

interface Props {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

const Dialog = (props: Props) => {
  const { children, title, onClose } = props;

  return (
    <DialogUI.Root open={true}>
      <DialogUI.Portal>
        <DialogUI.Overlay className="fixed inset-0 bg-black bg-opacity-60 z-[9999]" />
        <DialogUI.Content className="bg-white rounded-xl p-4 px-5 fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] z-[9999]">
          <DialogUI.Title className="text-lg text-black font-medium mb-2">{title}</DialogUI.Title>
          <DialogUI.Close
            className="absolute top-3 right-3 outline-none w-8 h-8 p-1 bg-zinc-600 rounded-full text-white hover:opacity-80"
            aria-label="Close"
            onClick={onClose}
          >
            <Icon.IoClose className="w-full h-auto" />
          </DialogUI.Close>
          <div className="w-full flex flex-col justify-start items-start">{children}</div>
        </DialogUI.Content>
      </DialogUI.Portal>
    </DialogUI.Root>
  );
};

export default Dialog;

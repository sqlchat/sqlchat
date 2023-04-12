import * as DialogUI from "@radix-ui/react-dialog";
import React, { ReactNode } from "react";
import Icon from "../Icon";

interface Props {
  title: string;
  open: boolean;
  children: ReactNode;
  onClose: () => void;
}

const Dialog = (props: Props) => {
  const { children, title, open, onClose } = props;

  return (
    <DialogUI.Root
      open={open}
      onOpenChange={() => {
        onClose();
      }}
    >
      <DialogUI.Portal>
        <DialogUI.Overlay className="fixed inset-0 bg-black bg-opacity-60 z-100" />
        <DialogUI.Content className="flex flex-col bg-white dark:bg-zinc-800 rounded-xl p-4 px-5 fixed top-[50%] left-[50%] h-auto max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] z-100">
          <DialogUI.Title className="text-lg text-black dark:text-gray-300 font-medium mb-2">{title}</DialogUI.Title>
          <DialogUI.Close
            className="absolute top-3 right-3 outline-none w-8 h-8 p-1 bg-zinc-600 rounded-full text-gray-300 hover:opacity-80"
            aria-label="Close"
            onClick={onClose}
          >
            <Icon.IoClose className="w-full h-auto" />
          </DialogUI.Close>
          <div className="w-full h-[calc(100%-36px)] flex flex-col justify-start items-start overflow-y-auto">{children}</div>
        </DialogUI.Content>
      </DialogUI.Portal>
    </DialogUI.Root>
  );
};

export default Dialog;

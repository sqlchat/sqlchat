import * as PopoverUI from "@radix-ui/react-popover";
import { ReactNode } from "react";

interface Props {
  className?: string;
  children: ReactNode;
  tigger: ReactNode;
}

const Popover = (props: Props) => {
  const { className, children, tigger } = props;

  return (
    <PopoverUI.Root modal={false}>
      <PopoverUI.Trigger asChild>{tigger}</PopoverUI.Trigger>
      <PopoverUI.Portal>
        <PopoverUI.Content
          asChild
          className={`${className || ""} z-[999] p-2 bg-white dark:bg-zinc-700 drop-shadow rounded-lg`}
          sideOffset={5}
        >
          {children}
        </PopoverUI.Content>
      </PopoverUI.Portal>
    </PopoverUI.Root>
  );
};

export default Popover;

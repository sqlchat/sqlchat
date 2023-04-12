import React, { ReactNode, forwardRef } from "react";
import * as SelectUI from "@radix-ui/react-select";
import Icon from "../Icon";

interface Props<T = any> {
  value: T;
  itemList: {
    value: T;
    label: string;
  }[];
  className?: string;
  placeholder?: string;
  onValueChange: (value: T) => void;
}

const Select = (props: Props) => {
  const { itemList, value, placeholder, className, onValueChange } = props;

  return (
    <SelectUI.Root value={value} onValueChange={onValueChange}>
      <SelectUI.Trigger
        className={`${
          className || ""
        } flex flex-row justify-between items-center dark:text-gray-300 bg-white dark:bg-zinc-700 border dark:border-zinc-800 px-3 py-2 rounded-lg`}
      >
        <SelectUI.Value placeholder={placeholder} />
        <SelectUI.Icon className="ml-1 w-5 h-auto shrink-0">
          <Icon.BiChevronDown className="w-full h-auto opacity-60" />
        </SelectUI.Icon>
      </SelectUI.Trigger>
      <SelectUI.Portal>
        <SelectUI.Content
          className="z-[999] -mt-px"
          style={{
            width: "var(--radix-select-trigger-width)",
          }}
          position="popper"
        >
          <SelectUI.Viewport className="bg-white dark:bg-zinc-700 border dark:border-zinc-800 shadow p-1 rounded-lg">
            <SelectUI.Group>
              {placeholder && <SelectUI.Label className="w-full px-3 mt-2 mb-1 text-sm text-gray-400">{placeholder}</SelectUI.Label>}
              {itemList.map((item) => (
                <SelectItem key={item.label} className="whitespace-nowrap" value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectUI.Group>
          </SelectUI.Viewport>
        </SelectUI.Content>
      </SelectUI.Portal>
    </SelectUI.Root>
  );
};

interface SelectItemProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(({ children, className, ...props }, forwardedRef) => {
  return (
    <SelectUI.Item
      className={`${
        className || ""
      } w-full px-3 py-2 rounded-lg flex flex-row justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800`}
      {...props}
      ref={forwardedRef}
    >
      <SelectUI.ItemText>{children}</SelectUI.ItemText>
      <SelectUI.ItemIndicator className="w-5 h-auto">
        <Icon.BiCheck className="w-full h-auto" />
      </SelectUI.ItemIndicator>
    </SelectUI.Item>
  );
});
SelectItem.displayName = "SelectItem";

export default Select;

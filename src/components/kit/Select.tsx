import * as SelectUI from "@radix-ui/react-select";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import React from "react";
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
        } flex flex-row justify-between items-center text-sm whitespace-nowrap dark:text-gray-300 bg-white dark:bg-zinc-700 border dark:border-zinc-800 px-3 py-2 rounded-lg`}
      >
        <SelectUI.Value placeholder={placeholder} />
        <SelectUI.Icon className="ml-1 w-5 h-auto shrink-0">
          <Icon.BiChevronDown className="w-full h-auto opacity-60" />
        </SelectUI.Icon>
      </SelectUI.Trigger>
      <SelectUI.Portal>
        <SelectUI.Content
          className="z-[999] mt-1"
          style={{
            minWidth: "var(--radix-select-trigger-width)",
          }}
          position="popper"
        >
          <ScrollArea.Root
            className={`${
              itemList.length > 7 ? "h-80 overflow-hidden" : "max-h-80 overflow-auto"
            } border dark:border-zinc-800 rounded-lg drop-shadow-lg`}
            type="auto"
          >
            <SelectUI.Viewport asChild className="bg-white dark:bg-zinc-700 p-1 rounded-lg">
              <ScrollArea.Viewport className="w-full h-full">
                <SelectUI.Group>
                  {placeholder && <SelectUI.Label className="w-full px-3 mt-2 mb-2 text-sm text-gray-400">{placeholder}</SelectUI.Label>}
                  {itemList.map((item) => (
                    <SelectUI.Item
                      className="w-full px-3 py-2 whitespace-nowrap truncate text-ellipsis overflow-x-hidden text-sm rounded-lg flex flex-row justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800"
                      key={item.label}
                      value={item.value}
                    >
                      <SelectUI.ItemText className="truncate">{item.label}</SelectUI.ItemText>
                      <SelectUI.ItemIndicator className="w-5 h-auto">
                        <Icon.BiCheck className="w-full h-auto" />
                      </SelectUI.ItemIndicator>
                    </SelectUI.Item>
                  ))}
                </SelectUI.Group>
              </ScrollArea.Viewport>
            </SelectUI.Viewport>
          </ScrollArea.Root>
        </SelectUI.Content>
      </SelectUI.Portal>
    </SelectUI.Root>
  );
};

export default Select;

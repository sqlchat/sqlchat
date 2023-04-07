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
      <SelectUI.Trigger className={`${className || ""} flex flex-row justify-between items-center border px-2 py-1 rounded-lg`}>
        <SelectUI.Value placeholder={placeholder} />
        <SelectUI.Icon className="w-5 h-auto">
          <Icon.BiChevronRight className="w-full h-auto opacity-60" />
        </SelectUI.Icon>
      </SelectUI.Trigger>
      <SelectUI.Portal>
        <SelectUI.Content
          className="z-[999999] -mt-px"
          style={{
            width: "var(--radix-select-trigger-width)",
          }}
          position="popper"
        >
          <SelectUI.Viewport className="bg-white border shadow p-1 rounded-lg">
            <SelectUI.Group>
              {placeholder && <SelectUI.Label className="w-full px-2 py-1 text-sm text-gray-400">{placeholder}</SelectUI.Label>}
              {itemList.map((item) => (
                <SelectItem key={item.label} value={item.value}>
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
  disabled?: boolean;
  children?: ReactNode;
}
export type Ref = HTMLDivElement;

const SelectItem = forwardRef<Ref, SelectItemProps>(({ children, ...props }, forwardedRef) => {
  return (
    <SelectUI.Item
      className="w-full px-2 py-1 rounded-lg flex flex-row justify-between items-center cursor-pointer hover:bg-gray-100"
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

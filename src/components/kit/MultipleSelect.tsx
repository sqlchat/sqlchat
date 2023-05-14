import { Listbox, Transition } from "@headlessui/react";
import { Fragment, ReactNode, useState } from "react";
import * as SelectUI from "@radix-ui/react-select";
import Icon from "../Icon";

interface Props<T = any> {
  value: T[];
  itemList: {
    value: T;
    label: string;
  }[];
  className?: string;
  placeholder?: string;
  selectedPlaceholder?: string;
  onValueChange: (value: T) => void;
}

const MultipleSelect = (props: Props & { children?: ReactNode }) => {
  const { itemList, value, placeholder, className, onValueChange, children } =
    props;
  return (
    <Listbox value={value} onChange={onValueChange} multiple>
      <Listbox.Button
        className={`${
          className || ""
        } flex flex-row justify-between items-center text-sm whitespace-nowrap dark:text-gray-300 bg-white dark:bg-zinc-700 border dark:border-zinc-800 px-3 py-2 rounded-lg`}
      >
        <div className="truncate">{placeholder}</div>
        <SelectUI.Icon className="ml-1 w-5 h-auto shrink-0">
          <Icon.BiChevronDown className="w-full h-auto opacity-60" />
        </SelectUI.Icon>
      </Listbox.Button>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Listbox.Options className="absolute border rounded-lg drop-shadow-lg dark:border-zinc-800 p-1 mt-1 max-h-80 overflow-y-auto scrollbar-hide w-full overflow-auto bg-white dark:bg-zinc-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {children && (
            <Listbox.Option className="px-2 py-2" key="button" value="button">
              {children}
            </Listbox.Option>
          )}

          {itemList.map((item) => (
            <Listbox.Option
              className="w-full px-3 py-2 whitespace-nowrap truncate text-ellipsis overflow-x-hidden text-sm rounded-lg flex flex-row justify-between items-center cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
              key={item.value}
              value={item.value}
            >
              <div className="truncate">{item.label}</div>
              {(value.find((v: string) => v === item.value) ? true : false) ? (
                <span className="w-5 h-auto">
                  <Icon.BiCheck className="w-full h-auto" aria-hidden="true" />
                </span>
              ) : null}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </Listbox>
  );
};
export default MultipleSelect;

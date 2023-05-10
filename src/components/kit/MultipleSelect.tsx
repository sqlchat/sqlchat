import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { t } from "i18next";
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
  onValueChange: (value: T) => void;
}

const MultipleSelect = (props: Props) => {
  const { itemList, value, placeholder, className, onValueChange } = props;
  console.log(value);
  console.log(itemList);
  itemList.map((item) => {
    console.log(value.find((v: string) => v == item.value));
  });
  return (
    <Listbox value={value} onChange={onValueChange} multiple>
      <Listbox.Button
        className={`${
          className || ""
        } flex flex-row justify-between items-center text-sm whitespace-nowrap dark:text-gray-300 bg-white dark:bg-zinc-700 border dark:border-zinc-800 px-3 py-2 rounded-lg`}
      >
        {value.length === 0 ? placeholder : "多个被选中"}
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
        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {itemList.map((item) => (
            <Listbox.Option
              className="w-full px-3 py-2 whitespace-nowrap truncate text-ellipsis overflow-x-hidden text-sm rounded-lg flex flex-row justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800"
              key={item.value}
              value={item.value}
            >
              {item.label}
              {(value.find((v: string) => v === item.value) ? true : false) ? (
                <span className=" inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
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

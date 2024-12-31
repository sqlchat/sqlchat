import * as CheckboxUI from "@radix-ui/react-checkbox";
import { CheckIcon, DividerHorizontalIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";

interface CheckboxProps {
  value: boolean;
  label: string;
  onValueChange: (tableName: string, value: boolean) => void;
}
const Checkbox = (props: CheckboxProps & { children?: ReactNode }) => {
  const { value, label, onValueChange, children } = props;
  return (
    <form>
      <div className="flex justify-between items-center px-1">
        <CheckboxUI.Root
          checked={value}
          onCheckedChange={(value: boolean) => onValueChange(label, value)}
          className="bg-white w-5 h-5 shrink-0 cursor-pointer rounded-sm flex border border-gray-300 hover:border-black m-auto"
          id={label}
        >
          <CheckboxUI.Indicator className="m-auto text-black">
            <CheckIcon />
          </CheckboxUI.Indicator>
        </CheckboxUI.Root>
        <label className="Label grow m-auto px-2 py-1 cursor-pointer truncate text-black dark:text-gray-300" htmlFor={label}>
          {label}
        </label>
        {children}
      </div>
    </form>
  );
};

export default Checkbox;

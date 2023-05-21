import { HTMLInputTypeAttribute } from "react";

interface Props {
  value: string;
  onChange?: (value: string) => void;
  type?: HTMLInputTypeAttribute;
  className?: string;
  disabled?: boolean;
  checked?: boolean;
}

const getDefaultProps = () => ({
  value: "",
  onChange: () => {},
  type: "radio",
  className: "",
  disabled: false,
  checked: false,
});

const Radio = (props: Props) => {
  const { value, disabled, className, type, checked, onChange } = {
    ...getDefaultProps(),
    ...props,
  };

  return (
    <input
      className={`${className || ""} h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer`}
      type={type}
      disabled={disabled}
      value={value}
      checked={checked}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default Radio;

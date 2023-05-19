interface Props {
  message: string;
  style: "info" | "error";
}

const NotificationView = (props: Props) => {
  const { message, style } = props;
  const additionalStyle = style === "error" ? "text-red-500" : "text-gray-500";
  return <p className={`${additionalStyle} w-full pl-4 mt-4 font-mono text-sm whitespace-pre-wrap`}>{message}</p>;
};

export default NotificationView;

import { Message } from "../../types";

interface Props {
  message: Message;
}

const Message = (props: Props) => {
  const message = props.message;

  return <div>{message.content}</div>;
};

export default Message;

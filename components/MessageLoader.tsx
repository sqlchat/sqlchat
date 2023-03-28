import { ThreeDots } from "react-loader-spinner";
import Icon from "./Icon";

const MessageLoader = () => {
  return (
    <div className={`w-full max-w-full flex flex-row justify-start items-start my-4 pr-8 sm:pr-24`}>
      <div className="w-10 h-10 p-1 flex justify-center items-center mr-2 shrink-0">
        <img src="/chat-logo-bot.webp" alt="" />
      </div>
      <div className="mt-0.5 w-12 bg-gray-100 px-4 py-2 rounded-lg">
        <ThreeDots wrapperClass="opacity-80" width="24" height="24" color="" />
      </div>
    </div>
  );
};

export default MessageLoader;

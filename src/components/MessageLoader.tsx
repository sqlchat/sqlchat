import { ThreeDots } from "react-loader-spinner";
import { useConnectionStore } from "@/store";
import EngineIcon from "./EngineIcon";

const MessageLoader = () => {
  const connectionStore = useConnectionStore();
  const connection = connectionStore.currentConnectionCtx?.connection;

  return (
    <div className={`w-full max-w-full flex flex-row justify-start items-start my-4 pr-8 sm:pr-24`}>
      <div className="flex justify-center items-center mr-2 shrink-0">
        {connection ? (
          <EngineIcon className="w-10 h-auto p-1 border rounded-full" engine={connection.engineType} />
        ) : (
          <img className="w-10 h-auto p-1" src="/chat-logo-bot.webp" alt="" />
        )}
      </div>
      <div className="mt-0.5 w-12 bg-gray-100 px-4 py-2 rounded-lg">
        <ThreeDots wrapperClass="opacity-80" width="24" height="24" color="" />
      </div>
    </div>
  );
};

export default MessageLoader;

import { Menu } from "@headlessui/react";
import { toast } from "react-hot-toast";
import { useChatStore, useMessageStore } from "@/store";
import Icon from "../Icon";

const Header = () => {
  const chatStore = useChatStore();
  const messageStore = useMessageStore();
  const currentChat = chatStore.currentChat;

  const handleClearMessage = () => {
    messageStore.clearMessage((message) => message.chatId !== currentChat?.id);
    toast.success("Message cleared");
  };

  return (
    <div className="sticky top-0 w-full flex flex-row justify-between items-center py-3 border-b bg-white shadow">
      <div className="ml-4 relative flex justify-center">
        <Icon.Io.IoIosMenu className="text-gray-600 w-5 h-auto block sm:hidden" />
      </div>
      <span className="w-auto">{currentChat?.title || "SQL Chat"}</span>
      <div className="mr-4 relative flex justify-center">
        <Menu>
          <Menu.Button className="w-8 h-auto p-1 cursor-pointer outline-none rounded-md hover:shadow hover:bg-gray-100">
            <Icon.Io.IoIosMore className="text-gray-600 w-full h-auto" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 top-full mt-1 w-32 origin-top-right rounded-lg bg-white shadow-lg outline-none ring-1 ring-black ring-opacity-5 p-1 space-y-1">
            <Menu.Item>
              <div
                className="w-full p-2 rounded-lg flex flex-row justify-start items-center cursor-pointer hover:bg-gray-100"
                onClick={handleClearMessage}
              >
                <Icon.Io.IoMdTrash className="text-gray-600 w-5 h-auto mr-1" />
                Clear
              </div>
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </div>
  );
};

export default Header;

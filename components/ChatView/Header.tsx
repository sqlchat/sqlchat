import { Menu, Popover } from "@headlessui/react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { getAssistantById, useChatStore, useMessageStore } from "../../store";
import Icon from "../Icon";

const Header = () => {
  const chatStore = useChatStore();
  const messageStore = useMessageStore();
  const currentChat = chatStore.currentChat;
  const assistant = getAssistantById(currentChat?.assistantId)!;

  const handleClearMessage = () => {
    messageStore.clearMessage((message) => message.chatId !== currentChat?.id);
    toast.success("Message cleared");
  };

  return (
    <div className="sticky top-0 w-full flex flex-row justify-between items-center py-2 border-b rounded-t-lg bg-gray-100 bg-opacity-80 backdrop-blur">
      <div className="ml-4 relative flex justify-center">
        <Menu>
          <Menu.Button className="w-8 h-auto p-1 cursor-pointer outline-none rounded-md hover:shadow hover:bg-white">
            <Icon.Io.IoIosMenu className="text-gray-600 w-full h-auto" />
          </Menu.Button>
          <Menu.Items className="absolute left-0 top-full mt-1 w-32 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 outline-none p-1 space-y-1">
            <Menu.Item>
              <Link className="w-full p-2 rounded-lg flex flex-row justify-start items-center hover:bg-gray-100" href="/">
                <Icon.Io.IoMdHome className="text-gray-600 w-5 h-auto mr-1" />
                Home
              </Link>
            </Menu.Item>
            <Menu.Item>
              <a
                href="https://github.com/bytebase/sqlchat"
                target="_blank"
                className="w-full p-2 rounded-lg flex flex-row justify-start items-center hover:bg-gray-100"
              >
                <Icon.Io.IoLogoGithub className="text-gray-600 w-5 h-auto mr-1" /> GitHub
              </a>
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
      <Popover className="relative w-auto">
        <Popover.Button className="outline-none">{assistant.name}</Popover.Button>
        <Popover.Panel className="absolute z-10 left-1/2 mt-1 -translate-x-1/2 bg-white shadow-lg rounded-lg outline-none border flex flex-col justify-start items-start w-72 p-4">
          <p className="w-full text-left">{assistant.description}</p>
        </Popover.Panel>
      </Popover>
      <div className="mr-4 relative flex justify-center">
        <Menu>
          <Menu.Button className="w-8 h-auto p-1 cursor-pointer outline-none rounded-md hover:shadow hover:bg-white">
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

import { Menu } from "@headlessui/react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useChatStore, useMessageStore, useUserStore } from "../../store";
import Icon from "../Icon";

const Header = () => {
  const userStore = useUserStore();
  const chatStore = useChatStore();
  const messageStore = useMessageStore();
  const currentChat = chatStore.currentChat;
  const chatTitle = currentChat ? userStore.getAssistantById(currentChat.assistantId)?.name : "No chat";

  const handleClearMessage = () => {
    messageStore.clearMessage((message) => message.chatId !== currentChat?.id);
    toast.success("Message cleared");
  };

  return (
    <div className="sticky top-0 w-full text-center py-4 border-b bg-gray-100 bg-opacity-80 backdrop-blur">
      <span className="absolute left-2 top-3">
        <Menu>
          <Menu.Button>
            <Icon.Io.IoIosMenu className="text-gray-600 w-8 h-auto p-1 rounded-md cursor-pointer hover:shadow hover:bg-white" />
          </Menu.Button>
          <Menu.Items className="absolute left-0 -mt-1 w-32 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-1 space-y-1">
            <Menu.Item>
              <Link className="w-full p-2 rounded-lg flex flex-row justify-start items-center hover:bg-gray-100" href="/">
                <Icon.Io.IoMdHome className="text-gray-600 w-5 h-auto mr-1" />
                Home
              </Link>
            </Menu.Item>
            <Menu.Item>
              <a
                href="https://github.com/bytebase/chatdba"
                target="_blank"
                className="w-full p-2 rounded-lg flex flex-row justify-start items-center hover:bg-gray-100"
              >
                <Icon.Io.IoLogoGithub className="text-gray-600 w-5 h-auto mr-1" /> GitHub
              </a>
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </span>
      <span>{chatTitle}</span>
      <span className="absolute right-2 top-3">
        <Menu>
          <Menu.Button>
            <Icon.Io.IoIosMore className="text-gray-600 w-8 h-auto p-1 rounded-md cursor-pointer hover:shadow hover:bg-white" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 -mt-1 w-32 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-1 space-y-1">
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
      </span>
    </div>
  );
};

export default Header;

import { useEffect, useState } from "react";
import { useConversationStore, useLayoutStore } from "@/store";
import useDarkMode from "@/hooks/useDarkmode";
import { hasFeature } from "@/utils";
import Icon from "../Icon";
import GitHubStarBadge from "../GitHubStarBadge";
import SchemaDrawer from "../SchemaDrawer";
import ConversationTabsView from "../ConversationTabsView";

interface Props {
  className?: string;
}

const Header = (props: Props) => {
  const { className } = props;
  const layoutStore = useLayoutStore();
  const conversationStore = useConversationStore();
  const isDarkMode = useDarkMode();
  const [showSchemaDrawer, setShowSchemaDrawer] = useState<boolean>(false);
  const currentConversationId = conversationStore.currentConversationId;
  const title = conversationStore.getConversationById(currentConversationId)?.title || "SQL Chat";

  useEffect(() => {
    document.title = `${title}`;
  }, [title]);

  return (
    <>
      <div className={`${className || ""} w-full border-b dark:border-zinc-700 z-1`}>
        <div className="my-2 w-full flex flex-row justify-between items-center lg:grid lg:grid-cols-3">
          <div className="ml-2 flex justify-start items-center">
            <button
              className="w-8 h-8 p-1 mr-1 block lg:hidden rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700"
              onClick={() => layoutStore.toggleSidebar()}
            >
              <Icon.IoIosMenu className="text-gray-600 w-full h-auto" />
            </button>
            <span className="w-auto text-left block lg:hidden">{title}</span>
            <GitHubStarBadge className="hidden lg:flex ml-2" />
          </div>
          <span className="w-auto text-center hidden lg:flex justify-center items-center">
            <a
              href="https://www.bytebase.com?source=sqlchat"
              className="hidden sm:block w-auto h-auto py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700"
              target="_blank"
            >
              <img
                className="h-5 sm:h-6 w-auto"
                src={isDarkMode ? "/craft-by-bytebase-dark-mode.webp" : "/craft-by-bytebase.webp"}
                alt=""
              />
            </a>
          </span>
        </div>
        <ConversationTabsView />
      </div>
    </>
  );
};

export default Header;

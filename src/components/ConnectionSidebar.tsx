import { Drawer } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useConnectionStore, useLayoutStore, ResponsiveWidth } from "@/store";
import Link from "next/link";
import Select from "./kit/Select";
import Tooltip from "./kit/Tooltip";
import Icon from "./Icon";
import DarkModeSwitch from "./DarkModeSwitch";
import ConversationList from "./Sidebar/ConversationList";
import ConnectionList from "./Sidebar/ConnectionList";

interface State {}

const ConnectionSidebar = () => {
  const { t } = useTranslation();
  const layoutStore = useLayoutStore();
  const connectionStore = useConnectionStore();
  const [isRequestingDatabase, setIsRequestingDatabase] =
    useState<boolean>(false);
  const currentConnectionCtx = connectionStore.currentConnectionCtx;
  const databaseList = connectionStore.databaseList.filter(
    (database) => database.connectionId === currentConnectionCtx?.connection.id
  );

  useEffect(() => {
    const handleWindowResize = () => {
      if (window.innerWidth < ResponsiveWidth.sm) {
        layoutStore.toggleSidebar(false);
        layoutStore.setIsMobileView(true);
      } else {
        layoutStore.toggleSidebar(true);
        layoutStore.setIsMobileView(false);
      }
    };

    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (currentConnectionCtx?.connection) {
      setIsRequestingDatabase(true);
      connectionStore
        .getOrFetchDatabaseList(currentConnectionCtx.connection)
        .finally(() => {
          setIsRequestingDatabase(false);
        });
    } else {
      setIsRequestingDatabase(false);
    }
  }, [currentConnectionCtx?.connection]);

  const handleDatabaseNameSelect = async (databaseName: string) => {
    if (!currentConnectionCtx?.connection) {
      return;
    }

    const databaseList = await connectionStore.getOrFetchDatabaseList(
      currentConnectionCtx.connection
    );
    const database = databaseList.find(
      (database) => database.name === databaseName
    );
    connectionStore.setCurrentConnectionCtx({
      connection: currentConnectionCtx.connection,
      database: database,
    });
  };

  return (
    <>
      <Drawer
        className="!z-10"
        variant={layoutStore.isMobileView ? "temporary" : "persistent"}
        open={layoutStore.showSidebar}
        onClose={() => layoutStore.toggleSidebar(false)}
        ModalProps={{ disablePortal: true }}
      >
        <div className="w-80 h-full overflow-y-hidden flex flex-row justify-start items-start">
          <div className="w-16 h-full bg-gray-200 dark:bg-zinc-600 pl-2 py-4 pt-6 flex flex-col justify-between items-center">
            <div className="w-full flex flex-col justify-start items-start">
              <ConnectionList />
            </div>
            <div className="w-full flex flex-col justify-end items-center">
              <DarkModeSwitch />
              <Tooltip title={t("common.setting")} side="right">
                <Link
                  className=" w-10 h-10 p-1 rounded-full flex flex-row justify-center items-center hover:bg-gray-100 dark:hover:bg-zinc-700"
                  data-tip={t("common.setting")}
                  href="/setting"
                >
                  <Icon.IoMdSettings className="text-gray-600 dark:text-gray-300 w-6 h-auto" />
                </Link>
              </Tooltip>
            </div>
          </div>
          <div className="relative p-4 pb-0 w-64 h-full overflow-y-auto flex flex-col justify-start items-start bg-gray-100 dark:bg-zinc-700">
            <img className="px-4 shrink-0" src="/chat-logo.webp" alt="" />
            <div className="w-full grow">
              {isRequestingDatabase && (
                <div className="w-full h-12 flex flex-row justify-start items-center px-4 sticky top-0 border z-1 mb-4 mt-2 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                  <Icon.BiLoaderAlt className="w-4 h-auto animate-spin mr-1" />{" "}
                  {t("common.loading")}
                </div>
              )}
              {databaseList.length > 0 && (
                <div className="w-full sticky top-0 z-1 my-4">
                  <Select
                    className="w-full px-4 py-3 !text-base"
                    value={currentConnectionCtx?.database?.name}
                    itemList={databaseList.map((database) => {
                      return {
                        label: database.name,
                        value: database.name,
                      };
                    })}
                    onValueChange={(databaseName) =>
                      handleDatabaseNameSelect(databaseName)
                    }
                    placeholder={t("connection.select-database") || ""}
                  />
                </div>
              )}
              <ConversationList />
            </div>
            <div className="sticky bottom-0 w-full flex flex-col justify-center bg-gray-100 dark:bg-zinc-700  backdrop-blur bg-opacity-60 pb-4 py-2">
              <a
                href="https://discord.gg/z6kakemDjm"
                className="text-indigo-600 dark:text-indigo-400 text-sm font-medium flex flex-row justify-center items-center mb-2 hover:underline"
                target="_blank"
              >
                <Icon.BsDiscord className="w-4 h-auto mr-1" />
                {t("social.join-discord-channel")}
              </a>
              <a
                className="dark:hidden"
                href="https://www.producthunt.com/posts/sql-chat-2?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-sql&#0045;chat&#0045;2"
                target="_blank"
              >
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=390216&theme=light"
                  alt="SQL&#0032;Chat - ChatGPT&#0032;powered&#0032;SQL&#0032;client&#0032;for&#0032;Postgres&#0044;&#0032;MySQL&#0032;&#0038;&#0032;SQL&#0032;Server | Product Hunt"
                  style={{ width: "250px", height: "54px" }}
                  width="250"
                  height="54"
                />
              </a>
              <a
                className="hidden dark:block"
                href="https://www.producthunt.com/posts/sql-chat-2?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-sql&#0045;chat&#0045;2"
                target="_blank"
              >
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=390216&theme=dark"
                  alt="SQL&#0032;Chat - ChatGPT&#0032;powered&#0032;SQL&#0032;client&#0032;for&#0032;Postgres&#0044;&#0032;MySQL&#0032;&#0038;&#0032;SQL&#0032;Server | Product Hunt"
                  style={{ width: "250px", height: "54px" }}
                  width="250"
                  height="54"
                />
              </a>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default ConnectionSidebar;

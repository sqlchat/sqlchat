import { Drawer } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useConnectionStore, useConversationStore, useLayoutStore, ResponsiveWidth, useSettingStore } from "@/store";
import { Engine, Table } from "@/types";
import useLoading from "@/hooks/useLoading";
import Select from "./kit/Select";
import Icon from "./Icon";
import DarkModeSwitch from "./DarkModeSwitch";
import ConversationList from "./Sidebar/ConversationList";
import ConnectionList from "./Sidebar/ConnectionList";
import QuotaView from "./QuotaView";
import { hasFeature } from "../utils";
import MultipleSelect from "./kit/MultipleSelect";
import SettingAvatarIcon from "./SettingAvatarIcon";
import { Schema } from "@/types/schema";
interface State {}

const ConnectionSidebar = () => {
  const { t } = useTranslation();
  const settingStore = useSettingStore();
  const layoutStore = useLayoutStore();
  const connectionStore = useConnectionStore();
  const conversationStore = useConversationStore();
  const [isRequestingDatabase, setIsRequestingDatabase] = useState<boolean>(false);
  const currentConnectionCtx = connectionStore.currentConnectionCtx;
  const databaseList = connectionStore.databaseList.filter((database) => database.connectionId === currentConnectionCtx?.connection.id);
  const [tableList, updateTableList] = useState<Table[]>([]);
  const [schemaList, updateSchemaList] = useState<Schema[]>([]);
  const [hasSchemaProperty, updateHasSchemaProperty] = useState<boolean>(false);
  const selectedTablesName: string[] =
    conversationStore.getConversationById(conversationStore.currentConversationId)?.selectedTablesName || [];
  const selectedSchemaName: string =
    conversationStore.getConversationById(conversationStore.currentConversationId)?.selectedSchemaName || "";
  const tableSchemaLoadingState = useLoading();
  const currentConversation = conversationStore.getConversationById(conversationStore.currentConversationId);

  useEffect(() => {
    updateHasSchemaProperty(
      currentConnectionCtx?.connection.engineType === Engine.PostgreSQL || currentConnectionCtx?.connection.engineType === Engine.MSSQL
    );
  }, [currentConnectionCtx?.connection]);

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
      connectionStore.getOrFetchDatabaseList(currentConnectionCtx.connection).finally(() => {
        setIsRequestingDatabase(false);
        const database = databaseList.find(
          (database) => database.name === useConnectionStore.getState().currentConnectionCtx?.database?.name
        );
        if (database) {
          tableSchemaLoadingState.setLoading();
          connectionStore.getOrFetchDatabaseSchema(database).then(() => {
            tableSchemaLoadingState.setFinish();
          });
        }
      });
    } else {
      setIsRequestingDatabase(false);
    }
  }, [currentConnectionCtx?.connection]);

  useEffect(() => {
    const schemaList =
      connectionStore.databaseList.find(
        (database) =>
          database.connectionId === currentConnectionCtx?.connection.id && database.name === currentConnectionCtx?.database?.name
      )?.schemaList || [];

    updateSchemaList(schemaList);
    // need to create a conversation. otherwise updateSelectedSchemaName will failed.
    createConversation();
    if (hasSchemaProperty) {
      conversationStore.updateSelectedSchemaName(schemaList[0]?.name || "");
      console.log("update", schemaList[0]?.name || "");
    } else {
      conversationStore.updateSelectedSchemaName("");
    }
  }, [connectionStore, currentConnectionCtx, schemaList]);

  useEffect(() => {
    const tableList = schemaList.find((schema) => schema.name === selectedSchemaName)?.tables || [];
    updateTableList(tableList);
  }, [selectedSchemaName]);

  const handleDatabaseNameSelect = async (databaseName: string) => {
    if (!currentConnectionCtx?.connection) {
      return;
    }

    const databaseList = await connectionStore.getOrFetchDatabaseList(currentConnectionCtx.connection);
    const database = databaseList.find((database) => database.name === databaseName);
    connectionStore.setCurrentConnectionCtx({
      connection: currentConnectionCtx.connection,
      database: database,
    });
    if (database) {
      tableSchemaLoadingState.setLoading();
      connectionStore.getOrFetchDatabaseSchema(database).then(() => {
        tableSchemaLoadingState.setFinish();
      });
    }
  };

  // only create conversation when currentConversation is null.
  // Note: This function is used to solve issue #95
  //       https://github.com/sqlchat/sqlchat/issues/95
  const createConversation = () => {
    if (!currentConversation) {
      if (!currentConnectionCtx) {
        conversationStore.createConversation();
      } else {
        conversationStore.createConversation(currentConnectionCtx.connection.id, currentConnectionCtx.database?.name);
      }
    }
  };

  const handleTableNameSelect = async (selectedTablesName: string[]) => {
    createConversation();
    conversationStore.updateSelectedTablesName(selectedTablesName);
  };

  const handleAllSelect = async () => {
    createConversation();
    conversationStore.updateSelectedTablesName(tableList.map((table) => table.name));
  };

  const handleEmptySelect = async () => {
    createConversation();
    conversationStore.updateSelectedTablesName([]);
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
            <div className="w-full flex flex-col space-y-2 justify-end items-center">
              <DarkModeSwitch />
              <SettingAvatarIcon />
            </div>
          </div>
          <div className="relative p-4 pb-0 w-64 h-full overflow-y-auto flex flex-col justify-start items-start bg-gray-100 dark:bg-zinc-700">
            <img className="px-4 shrink-0" src="/chat-logo.webp" alt="" />
            <div className="w-full grow">
              {isRequestingDatabase && (
                <div className="w-full h-12 flex flex-row justify-start items-center px-4 sticky top-0 border z-1 mb-4 mt-2 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                  <Icon.BiLoaderAlt className="w-4 h-auto animate-spin mr-1" /> {t("common.loading")}
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
                    onValueChange={(databaseName) => handleDatabaseNameSelect(databaseName)}
                    placeholder={t("connection.select-database") || ""}
                  />
                </div>
              )}
              {currentConnectionCtx?.connection.engineType === Engine.PostgreSQL && schemaList.length > 0 && (
                <Select
                  className="w-full px-4 py-3 !text-base"
                  value={selectedSchemaName}
                  itemList={schemaList.map((schema) => {
                    return {
                      label: schema.name,
                      value: schema.name,
                    };
                  })}
                  onValueChange={(schema) => conversationStore.updateSelectedSchemaName(schema)}
                  placeholder={t("connection.select-database") || ""}
                />
              )}
              {currentConnectionCtx &&
                (tableSchemaLoadingState.isLoading ? (
                  <div className="w-full h-12 flex flex-row justify-start items-center px-4 sticky top-0 border z-1 mb-4 mt-2 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                    <Icon.BiLoaderAlt className="w-4 h-auto animate-spin mr-1" /> {t("common.loading")}
                  </div>
                ) : (
                  tableList.length > 0 && (
                    <div className="w-full sticky top-0 z-1 my-4">
                      <MultipleSelect
                        className="w-full px-4 py-3 !text-base"
                        value={selectedTablesName}
                        itemList={tableList.map((table) => {
                          return {
                            label: table.name === "" ? t("connection.all-tables") : table.name,
                            value: table.name,
                          };
                        })}
                        onValueChange={(tableName) => handleTableNameSelect(tableName)}
                        placeholder={(selectedTablesName.length ? selectedTablesName.join(",") : t("connection.all-tables")) || ""}
                      >
                        <button
                          className="whitespace-nowrap rounded w-full bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          onClick={(e) => {
                            selectedTablesName.length ? handleEmptySelect() : handleAllSelect();
                            // The Button area is a option that have select event. So must to stop Propagation
                            e.stopPropagation();
                          }}
                        >
                          {selectedTablesName.length ? t("connection.empty-select") : t("connection.select-all")}
                        </button>
                      </MultipleSelect>
                    </div>
                  )
                ))}
              {/* TODO(steven): remove this after we finish left sidebar */}
              <ConversationList />
            </div>
            <div className="sticky bottom-0 w-full flex flex-col justify-center bg-gray-100 dark:bg-zinc-700  backdrop-blur bg-opacity-60 pb-4 py-2">
              {!settingStore.setting.openAIApiConfig?.key && hasFeature("quota") && (
                <div className="mb-4">
                  <QuotaView />
                </div>
              )}
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

import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { hasFeature } from "../utils";
import Tooltip from "./kit/Tooltip";
import Icon from "./Icon";

interface Props {}

const SettingAvatarIcon = (props: Props) => {
  const { t } = useTranslation();
  const { data: session } = useSession();

  return (
    <Tooltip title={t("common.setting")} side="right">
      <div>
        {(!hasFeature("account") || !session) && (
          <Link
            className=" w-10 h-10 p-1 rounded-full flex flex-row justify-center items-center hover:bg-gray-100 dark:hover:bg-zinc-700"
            data-tip={t("common.setting")}
            href="/setting"
          >
            <Icon.IoMdSettings className="text-gray-600 dark:text-gray-300 w-6 h-auto" />
          </Link>
        )}
        {hasFeature("account") && session?.user && (
          <Link href="/setting">
            {session.user.image ? (
              <img
                className="inline-block h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer"
                src={session.user.image}
                alt=""
              />
            ) : (
              <div className="bg-indigo-100 px-3 py-1 rounded-full text-indigo-600 hover:bg-indigo-200 uppercase cursor-pointer">
                {session.user.name ? session.user.name.charAt(0) : session.user.email?.charAt(0)}
              </div>
            )}
          </Link>
        )}
      </div>
    </Tooltip>
  );
};

export default SettingAvatarIcon;

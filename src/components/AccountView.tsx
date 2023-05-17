import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import SubscriptionHistoryTable from "./SubscriptionHistoryTable";
import { getDateString } from "@/utils";

const AccountView = () => {
  const { t } = useTranslation();
  const { data: session } = useSession();

  return (
    <>
      {!session && (
        <button
          className="whitespace-nowrap rounded bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => signIn()}
        >
          {t("common.sign-in")}
        </button>
      )}
      {session?.user && (
        <div>
          <div className="flex-col space-y-4 sm:space-y-0 sm:flex sm:flex-row justify-between">
            <div className="flex items-center space-x-2">
              {session.user.image && (
                <img
                  className="inline-block h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer"
                  src={session.user.image}
                  alt=""
                />
              )}
              <span>{session.user.email ?? session.user.name}</span>
              <Link
                href="/api/auth/signout"
                className="whitespace-nowrap rounded bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {t("common.sign-out")}
              </Link>
            </div>
            <div className="flex text-base font-semibold tracking-tight items-center">
              <span
                className={`${
                  session?.user.subscription.plan == "PRO"
                    ? "ring-green-600/2 bg-green-50 text-green-700"
                    : "ring-gray-600/2 bg-gray-50 text-gray-700"
                } rounded-full px-3 py-1 ring-1 ring-inset`}
              >
                {t(
                  `setting.plan.${session.user.subscription.plan.toLowerCase()}`
                )}
              </span>
              <div className="ml-4">
                {t("setting.plan.n-question-per-month", {
                  count: session.user.subscription.quota,
                })}
              </div>
              {session.user.subscription.plan === "PRO" && (
                <div className="ml-8">
                  {getDateString(session.user.subscription.expireAt)}
                  {` - `}
                  {getDateString(session.user.subscription.expireAt)}
                </div>
              )}
            </div>
          </div>
          <SubscriptionHistoryTable />
        </div>
      )}
    </>
  );
};

export default AccountView;

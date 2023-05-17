import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const stats = [
  { id: 1, name: "Transactions every 24 hours", value: "44 million" },
  { id: 2, name: "Assets under holding", value: "$119 trillion" },
  { id: 3, name: "New users annually", value: "46,000" },
];

const AccountView = () => {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

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
          <div className="flex text-xl font-semibold tracking-tight items-center">
            <span className="rounded-full bg-green-50 px-3 py-1.5  text-green-700 ring-1 ring-inset ring-green-600/20">
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
                {new Date(
                  session.user.subscription.expireAt
                ).toLocaleDateString(undefined, dateOptions)}
                {` - `}
                {new Date(
                  session.user.subscription.expireAt
                ).toLocaleDateString(undefined, dateOptions)}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AccountView;

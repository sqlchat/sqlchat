import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const AccountView = () => {
  const { t } = useTranslation();
  const { data: session, status } = useSession();

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
      )}
    </>
  );
};

export default AccountView;

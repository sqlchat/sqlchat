import { signIn, useSession } from "next-auth/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Quota } from "@/types";

interface Props {
  className?: string;
}

const QuotaView = (props: Props) => {
  const [quota, setQuota] = useState<Quota>({ current: 0, limit: 0 });
  const { t } = useTranslation();
  const { data: session } = useSession();

  useEffect(() => {
    const refreshQuota = async (userId: string) => {
      let quota: Quota = { current: 0, limit: 0 };
      try {
        const { data } = await axios.get("/api/usage", {
          headers: { Authorization: `Bearer ${userId}` },
        });
        quota = data;
      } catch (error) {
        // do nth
      }
      setQuota(quota);
    };

    if (session?.user.id) {
      refreshQuota(session.user.id);
    }
  }, [session]);

  return (
    <div className="p-4 space-y-2 rounded-lg border border-indigo-400 flex flex-col dark:text-gray-300 hover:bg-white dark:hover:bg-zinc-800 bg-white dark:bg-zinc-800">
      <div className="flex justify-start">
        <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
          {session
            ? t(`setting.plan.${session.user.subscription.plan.toLowerCase()}`)
            : t("setting.plan.guest")}
        </span>
      </div>
      <div className="flex justify-between">
        <div>{t("common.quota")}</div>
        <div>
          {quota.current}/{quota.limit}
        </div>
      </div>
      {session ? (
        <Link
          href="/setting"
          className="rounded bg-indigo-600 px-2 py-1 text-center text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {t("setting.plan.upgrade")}
        </Link>
      ) : (
        <button
          className="rounded bg-indigo-600 px-2 py-1 text-center text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => signIn()}
        >
          {t("setting.plan.signup-for-more")}
        </button>
      )}
    </div>
  );
};

export default QuotaView;

import { signIn, useSession } from "next-auth/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Quota } from "@/types";
import getEventEmitter from "@/utils/event-emitter";
import { allowSelfOpenAIKey } from "@/utils";

interface Props {
  className?: string;
}

const QuotaView = (props: Props) => {
  const [quota, setQuota] = useState<Quota>({ current: 0, limit: 0 });
  const { t } = useTranslation();
  const { data: session } = useSession();

  const showSupplyOwnKey = !session || quota.current >= quota.limit;
  const expired = session?.user?.subscription?.expireAt && session?.user?.subscription?.expireAt < Date.now();
  const showActionButton = !session || session.user.subscription.plan === "FREE" || expired;

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

  getEventEmitter().on("usage.update", () => {
    if (session?.user.id) {
      refreshQuota(session.user.id);
    }
  });

  useEffect(() => {
    if (session?.user.id) {
      refreshQuota(session.user.id);
    }
  }, [session]);

  return (
    <div className="px-4 py-3 space-y-2 rounded-lg border border-indigo-400 flex flex-col dark:text-gray-300 hover:bg-white dark:hover:bg-zinc-800 bg-white dark:bg-zinc-800">
      <div className="flex justify-between">
        <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
          {session ? t(`setting.plan.${session.user.subscription.plan.toLowerCase()}`) : t("setting.plan.guest")}
        </span>
        {!!expired && (
          <span className="rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
            {t("setting.plan.expired")}
          </span>
        )}
      </div>
      <div className="flex justify-between pt-1">
        <div>{t("common.quota")}</div>
        <div className={quota.current >= quota.limit ? "text-red-600" : "text-black dark:text-gray-300"}>
          {quota.current}/{quota.limit}
        </div>
      </div>
      {!!showActionButton &&
        (session ? (
          <Link
            href="/setting"
            className="rounded bg-indigo-600 px-2 py-1 text-center text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {expired ? t("setting.plan.renew") : t("setting.plan.upgrade")}
          </Link>
        ) : (
          <button
            className="rounded bg-indigo-600 px-2 py-1 text-center text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => signIn()}
          >
            {t("setting.plan.signup-for-more")}
          </button>
        ))}
      {allowSelfOpenAIKey() && !!showSupplyOwnKey && (
        <Link className="text-center rounded-full underline hover:opacity-80 px-2 py-0.5 text-xs font-medium text-gray-700" href="/setting">
          {t("banner.use-my-key")}
        </Link>
      )}
    </div>
  );
};

export default QuotaView;

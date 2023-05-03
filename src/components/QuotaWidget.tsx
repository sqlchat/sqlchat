import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Quota } from "@/types";

interface Props {
  className?: string;
}

const QuotaWidget = (props: Props) => {
  const [quota, setQuota] = useState<Quota>({ current: 0, limit: 0 });
  const { t } = useTranslation();

  useEffect(() => {
    const refreshQuota = async () => {
      let quota: Quota = { current: 0, limit: 0 };
      try {
        const { data } = await axios.get("/api/quota", {});
        quota = data;
      } catch (error) {
        // do nth
      }
      setQuota(quota);
    };

    refreshQuota();
  }, []);

  return (
    <div className="w-full p-2 space-y-2 rounded-lg flex flex-col items-center cursor-pointer dark:text-gray-300 border border-transparent group hover:bg-white dark:hover:bg-zinc-800 bg-white dark:bg-zinc-800 border-gray-200 font-medium">
      <div className="text-center">Free Plan</div>
      <div className="flex space-x-4 justify-between">
        <div>Quota</div>
        <div>
          {quota.current}/{quota.limit}
        </div>
      </div>
      <Link
        href="/setting"
        className="whitespace-nowrap rounded bg-indigo-600 px-2 py-1 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        {t("common.upgrade")}
      </Link>
    </div>
  );
};

export default QuotaWidget;

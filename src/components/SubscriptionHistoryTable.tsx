import axios from "axios";
import { t } from "i18next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { SubscriptionPurchase } from "@/types";
import { getCurrencySymbol, getDateString } from "@/utils";

const SubscriptionHistoryTable = () => {
  const [list, setList] = useState<SubscriptionPurchase[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const refreshSubscriptionList = async (userId: string) => {
      let list: SubscriptionPurchase[] = [];
      try {
        const { data } = await axios.get("/api/subscription", {
          headers: { Authorization: `Bearer ${userId}` },
        });
        list = data;
      } catch (error) {
        // do nth
      }
      setList(list);
    };

    if (session?.user.id) {
      refreshSubscriptionList(session.user.id);
    }
  }, [session]);

  if (list.length === 0) {
    return <></>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    {t("common.date")}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {t("common.description")}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {t("common.amount")}
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {list.map((subscription) => (
                  <tr key={subscription.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {getDateString(subscription.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{subscription.description}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {getCurrencySymbol(subscription.currency.toLocaleUpperCase())}
                      {subscription.amount / 100}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a href={subscription.receipt} target="_blank" className="text-indigo-600 hover:text-indigo-900">
                        {t("setting.billing.view-receipt")}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionHistoryTable;

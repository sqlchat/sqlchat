import useSWR from "swr";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { fetchGetJSON } from "../utils/api-helpers";
import Icon from "./Icon";

interface Props {
  sessionId: string;
}

const StripeCheckPaymentBanner = (props: Props) => {
  const { sessionId } = props;
  const { t } = useTranslation();
  const [hideBanner, setHideBanner] = useState(false);
  const show = !hideBanner;

  const router = useRouter();

  // Fetch CheckoutSession from static page via
  // https://nextjs.org/docs/basic-features/data-fetching#static-generation
  const { data } = useSWR(router.query.session_id ? `/api/checkout_sessions/${sessionId}` : null, fetchGetJSON);

  return (
    <>
      <div
        className={`${
          !show && "!hidden"
        } relative w-full flex flex-row justify-start sm:justify-center items-center py-1 bg-gray-100 dark:bg-zinc-700`}
      >
        <div className="text-sm leading-6 pr-4 cursor-pointer">
          {t("payment.self")} {data?.payment_intent?.status ?? t("common.loading")}
        </div>
        <button className="absolute right-2 sm:right-4 opacity-60 hover:opacity-100" onClick={() => setHideBanner(true)}>
          <Icon.BiX className="w-6 h-auto" />
        </button>
      </div>
    </>
  );
};

export default StripeCheckPaymentBanner;

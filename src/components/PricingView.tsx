import { signIn, useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";

import getStripe from "../utils/get-stripejs";
import { fetchPostJSON } from "../utils/api-helpers";

const checkout = async () => {
  // Create a Checkout Session.
  const response = await fetchPostJSON("/api/checkout_sessions", {});

  if (response.statusCode === 500) {
    console.error(response.message);
    return;
  }

  // Redirect to Checkout.
  const stripe = await getStripe();
  const { error } = await stripe!.redirectToCheckout({
    // Make the id field from the Checkout Session creation API response
    // available to this file, so you can provide it as parameter here
    // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
    sessionId: response.id,
  });
  // If `redirectToCheckout` fails due to a browser or network
  // error, display the localized error message to your customer
  // using `error.message`.
  console.warn(error.message);
};

const PricingView = () => {
  const { t } = useTranslation();
  const { data: session, status } = useSession();

  return (
    <div className="bg-white dark:bg-zinc-800">
      <span className="rounded-full bg-green-50 px-4 py-1.5 text-xl font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
        {"🎈 "} {t(`setting.plan.pro`)}
      </span>
      <div className="mx-auto max-w-7xl p-6 lg:flex lg:items-center lg:justify-between lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("setting.plan.n-question-per-month", {
            count: 1000,
          })}
        </h2>
        <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
          <button
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => (session?.user?.email ? checkout() : signIn())}
          >
            {session?.user?.email ? t("setting.plan.early-bird-checkout") : t("payment.sign-in-to-buy")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingView;

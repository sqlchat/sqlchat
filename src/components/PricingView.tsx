import { signIn, useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";

import getStripe from "../utils/get-stripejs";
import { fetchPostJSON } from "../utils/api-helpers";

const checkout = async (priceId: string) => {
  // Create a Checkout Session.
  const response = await fetchPostJSON("/api/checkout_sessions", {
    price: priceId,
  });

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

  const tiers = [
    {
      name: t("setting.plan.1-month"),
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_1_MONTH_SUBSCRIPTION,
      priceMonthly: "$10",
      buyButton: t("setting.plan.purhcase-1-month"),
    },
    {
      name: t("setting.plan.n-months", {
        count: 3,
      }),
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_3_MONTH_SUBSCRIPTION,
      priceMonthly: "$15",
      buyButton: t("setting.plan.purhcase-n-months", {
        count: 3,
      }),
    },
    {
      name: t("setting.plan.n-months", {
        count: 12,
      }),
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_1_YEAR_SUBSCRIPTION,
      priceMonthly: "$30",
      buyButton: t("setting.plan.purhcase-n-months", {
        count: 12,
      }),
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-800 py-4">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          {t("setting.plan.n-question-per-month", {
            count: 1000,
          })}
        </p>
      </div>
      <div className="mt-12 flow-root">
        <div className="isolate -mt-16 grid max-w-sm grid-cols-1 gap-y-16 divide-y divide-gray-100 sm:mx-auto lg:-mx-8 lg:mt-0 lg:max-w-none lg:grid-cols-3 lg:divide-x lg:divide-y-0 xl:-mx-4">
          {tiers.map((tier) => (
            <div key={tier.priceId} className="pt-16 lg:px-8 lg:pt-0 xl:px-14 flex flex-col justify-center">
              <h3 id={tier.priceId} className="text-center text-3xl font-semibold leading-7">
                {tier.name} - {tier.priceMonthly}
              </h3>
              <button
                onClick={() => (session?.user?.email ? checkout(tier.priceId) : signIn())}
                className="mt-6 block rounded-md bg-indigo-600 px-4 py-2.5 text-center text-xl font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {session?.user?.email ? tier.buyButton : t("payment.sign-in-to-buy")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingView;

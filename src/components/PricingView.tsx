import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { CheckIcon } from "@heroicons/react/20/solid";
import Script from "next/script";

const includedFeatures = [
  "Private forum access",
  "Member resources",
  "Entry to annual conference",
  "Official member t-shirt",
];

const PricingView = () => {
  const { t } = useTranslation();
  const { data: session, status } = useSession();

  return (
    <div className="mx-auto max-w-2xl lg:mx-0 lg:flex lg:max-w-none">
      <div className="p-8 sm:p-10 lg:flex-auto">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900">
          Lifetime membership
        </h3>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque amet
          indis perferendis blanditiis repellendus etur quidem assumenda.
        </p>
        <div className="mt-10 flex items-center gap-x-4">
          <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">
            What’s included
          </h4>
          <div className="h-px flex-auto bg-gray-100" />
        </div>
        <ul
          role="list"
          className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
        >
          {includedFeatures.map((feature) => (
            <li key={feature} className="flex gap-x-3">
              <CheckIcon
                className="h-6 w-5 flex-none text-indigo-600"
                aria-hidden="true"
              />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
        <div className="rounded-2xl bg-gray-50 py-4 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center">
          <div className="mx-auto max-w-xs">
            {session?.user && (
              <stripe-buy-button
                buy-button-id="buy_btn_1N3LTfAeLQYhEB73lUC8TvpW"
                publishable-key="pk_test_C0a1xkSV2IqrxxIIMIH3ZXAp00YKL3okom"
                customer-email={session.user.email}
              ></stripe-buy-button>
            )}
          </div>
        </div>
      </div>

      <Script async src="https://js.stripe.com/v3/buy-button.js" />
    </div>
  );
};

export default PricingView;

import { useTranslation } from "react-i18next";
import { useLocalStorage } from "react-use";
import { allowSelfOpenAIKey } from "@/utils";
import Link from "next/link";
import Icon from "./Icon";

interface Props {
  className?: string;
}

const QuotaOverflowBanner = (props: Props) => {
  const { className } = props;
  const { t } = useTranslation();
  const [hideBanner, setHideBanner] = useLocalStorage("hide-quota-overflow-banner", false);
  const show = !hideBanner;

  return (
    <>
      <div
        className={`${!show && "!hidden"} ${
          className || ""
        } relative w-full flex flex-row justify-start sm:justify-center items-center px-4 py-1 bg-gray-100 dark:bg-zinc-700`}
      >
        <div className="text-sm leading-6 pr-4 cursor-pointer">
          {t("banner.quota-overflow")}{" "}
          {allowSelfOpenAIKey() && (
            <Link className="ml-1 underline hover:opacity-80" href="/setting">
              {t("banner.use-my-key")}
            </Link>
          )}
        </div>
        <button className="absolute right-2 sm:right-4 opacity-60 hover:opacity-100" onClick={() => setHideBanner(true)}>
          <Icon.BiX className="w-6 h-auto" />
        </button>
      </div>
    </>
  );
};

export default QuotaOverflowBanner;

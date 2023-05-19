import { useTranslation } from "react-i18next";
import { useLocalStorage } from "react-use";
import Icon from "./Icon";

interface Props {
  className?: string;
}

const ProductHuntBanner = (props: Props) => {
  const { className } = props;
  const { t } = useTranslation();
  const [hideBanner, setHideBanner] = useLocalStorage("hide-product-hunt-banner", false);
  const show = !hideBanner;

  return (
    <div
      className={`${!show && "!hidden"} ${
        className || ""
      } relative w-full flex bg-[#f26150] text-white flex-row justify-start sm:justify-center items-center px-4 py-1 dark:opacity-70`}
    >
      <a
        className="text-sm leading-6 pr-4 cursor-pointer hover:underline"
        href="https://www.producthunt.com/posts/sql-chat-2"
        target="_blank"
      >
        {t("banner.product-hunt")}
      </a>
      <button className="absolute right-2 sm:right-4 opacity-60 hover:opacity-100" onClick={() => setHideBanner(true)}>
        <Icon.BiX className="w-6 h-auto" />
      </button>
    </div>
  );
};

export default ProductHuntBanner;

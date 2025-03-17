import { useTranslation } from "react-i18next";
import { useLocalStorage } from "react-use";
import Icon from "./Icon";

interface Props {
  className?: string;
  alwaysShow?: boolean;
}

const DBHubBanner = (props: Props) => {
  const { className, alwaysShow } = props;
  const { t } = useTranslation();
  const [hideBanner, setHideBanner] = useLocalStorage("hide-github-banner", false);
  const show = alwaysShow || !hideBanner;

  return (
    <div
      className={`${!show && "!hidden"} ${
        className || ""
      } relative w-full flex flex-row justify-start sm:justify-center items-center px-4 py-1 bg-blue-50 dark:bg-blue-900`}
    >
      <span className="text-sm leading-6 pr-4">
        <a
          href="https://github.com/bytebase/dbhub"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-300 hover:underline font-medium"
        >
          Check out DBHub - a universal database MCP server to be used by Cursor, Claude Desktop, and more
        </a>
      </span>
      {!alwaysShow && (
        <button className="absolute right-2 sm:right-4 opacity-60 hover:opacity-100" onClick={() => setHideBanner(true)}>
          <Icon.BiX className="w-6 h-auto" />
        </button>
      )}
    </div>
  );
};

export default DBHubBanner;

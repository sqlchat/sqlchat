import { useTranslation } from "react-i18next";
import Icon from "../Icon";

interface Props {
  className?: string;
}

const ExecutionWarningBanner = (props: Props) => {
  const { className } = props;
  const { t } = useTranslation();

  return (
    <div className={`${className || ""} relative w-full flex flex-row justify-start items-center px-4 py-2 bg-yellow-100 dark:bg-zinc-700`}>
      <span className="text-sm leading-6 pr-4">
        <Icon.IoInformationCircleOutline className="inline-block h-5 w-auto -mt-0.5 mr-0.5 opacity-80" />
        {t("banner.non-select-sql-warning")}
      </span>
    </div>
  );
};

export default ExecutionWarningBanner;

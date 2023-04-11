import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Dialog from "./kit/Dialog";

interface Props {
  close: () => void;
}

const ClearDataConfirmModal = (props: Props) => {
  const { close } = props;
  const { t } = useTranslation();

  const handleClearData = () => {
    window.localStorage.clear();
    close();
    toast.success("Data cleared. The page will be reloaded.");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <Dialog title="Clear all data" onClose={close}>
      <div className="w-full flex flex-col justify-start items-start mt-2">
        <p className="text-gray-500">SQL Chat saves all your data in your local browser. Are you sure to clear all of them?</p>
      </div>
      <div className="w-full flex flex-row justify-end items-center mt-4 space-x-2">
        <button className="btn btn-outline" onClick={close}>
          {t("common.close")}
        </button>
        <button className="btn btn-error" onClick={handleClearData}>
          {t("common.clear")}
        </button>
      </div>
    </Dialog>
  );
};

export default ClearDataConfirmModal;

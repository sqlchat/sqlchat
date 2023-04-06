import { useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import ClearDataConfirmModal from "./ClearDataConfirmModal";

const ClearDataButton = () => {
  const { t } = useTranslation();
  const [showClearDataConfirmModal, setShowClearDataConfirmModal] = useState(false);

  return (
    <>
      <button className="btn btn-sm btn-error" onClick={() => setShowClearDataConfirmModal(true)}>
        {t("common.clear")}
      </button>

      {showClearDataConfirmModal &&
        createPortal(<ClearDataConfirmModal close={() => setShowClearDataConfirmModal(false)} />, document.body)}
    </>
  );
};

export default ClearDataButton;

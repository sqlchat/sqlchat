import { useState } from "react";
import { useTranslation } from "react-i18next";
import ClearDataConfirmModal from "./ClearDataConfirmModal";

const ClearDataButton = () => {
  const { t } = useTranslation();
  const [showClearDataConfirmModal, setShowClearDataConfirmModal] = useState(false);

  return (
    <>
      <button className="btn btn-error" onClick={() => setShowClearDataConfirmModal(true)}>
        {t("common.clear")}
      </button>

      {showClearDataConfirmModal && <ClearDataConfirmModal close={() => setShowClearDataConfirmModal(false)} />}
    </>
  );
};

export default ClearDataButton;

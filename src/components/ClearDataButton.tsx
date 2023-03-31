import { useState } from "react";
import { createPortal } from "react-dom";
import ClearDataConfirmModal from "./ClearDataConfirmModal";

const ClearDataButton = () => {
  const [showClearDataConfirmModal, setShowClearDataConfirmModal] = useState(false);

  return (
    <>
      <button className="btn btn-sm btn-error" onClick={() => setShowClearDataConfirmModal(true)}>
        Clear
      </button>

      {showClearDataConfirmModal &&
        createPortal(<ClearDataConfirmModal close={() => setShowClearDataConfirmModal(false)} />, document.body)}
    </>
  );
};

export default ClearDataButton;

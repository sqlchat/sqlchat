import { useTranslation } from "react-i18next";
import Modal from "./kit/Modal";

export interface ActionConfirmModalProps {
  title: string;
  content: string;
  confirmButtonStyle: string;
  close: () => void;
  confirm: () => void;
}

const ActionConfirmModal = (props: ActionConfirmModalProps) => {
  const { close, confirm, title, content, confirmButtonStyle } = props;
  const { t } = useTranslation();

  return (
    <Modal title={title} onClose={close}>
      <div className="w-full flex flex-col justify-start items-start mt-2">
        <p className="text-gray-500">{content}</p>
      </div>
      <div className="w-full flex flex-row justify-end items-center mt-4 space-x-2">
        <button className="btn btn-outline" onClick={close}>
          {t("common.close")}
        </button>
        <button
          className={`btn ${confirmButtonStyle}`}
          onClick={() => {
            confirm();
            close();
          }}
        >
          {t("common.confirm")}
        </button>
      </div>
    </Modal>
  );
};

export default ActionConfirmModal;

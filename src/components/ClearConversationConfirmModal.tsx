import { useTranslation } from "react-i18next";
import { useConversationStore, useMessageStore } from "@/store";
import Modal from "./kit/Modal";

interface Props {
  close: () => void;
}

const ClearConversationConfirmModal = (props: Props) => {
  const { close } = props;
  const { t } = useTranslation();
  const conversationStore = useConversationStore();
  const messageStore = useMessageStore();

  const handleClearMessages = () => {
    messageStore.clearMessage((item) => item.conversationId !== conversationStore.currentConversationId);
    close();
  };

  return (
    <Modal title="Clear messages" className="!w-96" onClose={close}>
      <div>
        <div className="w-full flex flex-col justify-start items-start mt-2">
          <p className="text-gray-500">Are you sure to clear the messages in current conversation?</p>
        </div>
        <div className="w-full flex flex-row justify-end items-center mt-4 space-x-2">
          <button className="btn btn-outline" onClick={close}>
            {t("common.close")}
          </button>
          <button className="btn btn-error" onClick={handleClearMessages}>
            {t("common.clear")}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ClearConversationConfirmModal;

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useConversationStore } from "@/store";
import { Conversation } from "@/types";
import Icon from "./Icon";
import TextField from "./kit/TextField";

interface Props {
  conversation: Conversation;
  close: () => void;
}

const EditConversationTitleModal = (props: Props) => {
  const { close, conversation } = props;
  const { t } = useTranslation();
  const conversationStore = useConversationStore();
  const [title, setTitle] = useState(conversation.title);
  const allowSave = title !== "";

  const handleSaveEdit = () => {
    const formatedTitle = title.trim();
    if (formatedTitle === "") {
      return;
    }

    conversationStore.updateConversation(conversation.id, {
      title: formatedTitle,
    });
    toast.success("Conversation title updated");
    close();
  };

  return (
    <div className="modal modal-middle modal-open">
      <div className="modal-box relative">
        <h3 className="font-bold text-lg">{t("conversation.edit-title")}</h3>
        <button className="btn btn-sm btn-circle absolute right-4 top-4" onClick={close}>
          <Icon.IoMdClose className="w-5 h-auto" />
        </button>
        <div className="w-full flex flex-col justify-start items-start space-y-3 pt-4">
          <TextField placeholder={t("conversation.conversation-title") || ""} value={title} onChange={(value) => setTitle(value)} />
        </div>
        <div className="modal-action">
          <button className="btn btn-outline" onClick={close}>
            {t("common.close")}
          </button>
          <button className="btn" disabled={!allowSave} onClick={handleSaveEdit}>
            {t("common.save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditConversationTitleModal;

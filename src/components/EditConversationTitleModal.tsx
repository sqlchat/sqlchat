import { useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useConversationStore } from "@/store";
import { Conversation } from "@/types";
import TextField from "./kit/TextField";
import Dialog from "./kit/Dialog";

interface Props {
  conversation: Conversation;
  open: boolean;
  close: () => void;
}

const EditConversationTitleModal = (props: Props) => {
  const { close, conversation, open } = props;
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
    <Dialog title={t("conversation.edit-title")} open={open} onClose={close}>
      <div className="w-full flex flex-col justify-start items-start mt-2">
        <TextField placeholder={t("conversation.conversation-title") || ""} value={title} onChange={(value) => setTitle(value)} />
      </div>
      <div className="w-full flex flex-row justify-end items-center mt-4 space-x-2">
        <button className="btn btn-outline" onClick={close}>
          {t("common.close")}
        </button>
        <button className="btn" disabled={!allowSave} onClick={handleSaveEdit}>
          {t("common.save")}
        </button>
      </div>
    </Dialog>
  );
};

export default EditConversationTitleModal;

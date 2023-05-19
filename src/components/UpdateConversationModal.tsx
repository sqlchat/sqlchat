import { useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { assistantList, useConversationStore } from "@/store";
import { Conversation } from "@/types";
import TextField from "./kit/TextField";
import Modal from "./kit/Modal";
import Select from "./kit/Select";
import Icon from "./Icon";
import BetaBadge from "./BetaBadge";

interface Props {
  conversation: Conversation;
  close: () => void;
}

const UpdateConversationModal = (props: Props) => {
  const { close, conversation } = props;
  const { t } = useTranslation();
  const conversationStore = useConversationStore();
  const [title, setTitle] = useState(conversation.title);
  const [assistantId, setAssistantId] = useState(conversation.assistantId);
  const allowSave = title !== "";
  const assistantItems = assistantList.map((assistant) => {
    return {
      value: assistant.id,
      label: assistant.name,
    };
  });
  const currentAssistant = assistantList.find((assistant) => assistant.id === assistantId);

  const handleSaveEdit = () => {
    const formatedTitle = title.trim();
    if (formatedTitle === "") {
      return;
    }

    conversationStore.updateConversation(conversation.id, {
      title: formatedTitle,
      assistantId: assistantId,
    });
    toast.success("Conversation updated");
    close();
  };

  return (
    <Modal title={t("conversation.update")} onClose={close}>
      <div className="w-full flex flex-col justify-start items-start mt-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("conversation.title")}</label>
        <TextField placeholder={t("conversation.conversation-title") || ""} value={title} onChange={(value) => setTitle(value)} />
      </div>
      <div className="w-full flex flex-col justify-start items-start mt-2">
        <label className="text-sm font-medium text-gray-700 mb-1 flex flex-row justify-start items-center">
          {t("assistant.self")} <BetaBadge />
        </label>
        <Select className="w-full" value={assistantId} itemList={assistantItems} onValueChange={(value) => setAssistantId(value)} />
        {currentAssistant && (
          <div className="w-full flex flex-col justify-start items-start">
            <p className="block text-sm text-gray-700 mt-2 mx-3">{currentAssistant.description}</p>
          </div>
        )}
        <a
          className="mt-1 mx-3 text-sm text-blue-600 underline hover:opacity-80"
          href="https://github.com/sqlchat/sqlchat/tree/main/assistants"
          target="_blank"
        >
          {t("assistant.create-your-bot")} <Icon.FiExternalLink className="inline-block -mt-0.5" />
        </a>
      </div>
      <div className="w-full flex flex-row justify-end items-center mt-4 space-x-2">
        <button className="btn btn-outline" onClick={close}>
          {t("common.close")}
        </button>
        <button className="btn" disabled={!allowSave} onClick={handleSaveEdit}>
          {t("common.save")}
        </button>
      </div>
    </Modal>
  );
};

export default UpdateConversationModal;

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useChatStore } from "@/store";
import { Chat } from "@/types";
import Icon from "./Icon";

interface Props {
  chat: Chat;
  close: () => void;
}

const EditMessageTitleModal = (props: Props) => {
  const { close, chat } = props;
  const chatStore = useChatStore();
  const [title, setTitle] = useState(chat.title);
  const allowSave = title !== "";

  const handleSaveEdit = () => {
    const formatedTitle = title.trim();
    if (formatedTitle === "") {
      return;
    }

    chatStore.updateChat(chat.id, {
      title: formatedTitle,
    });
    toast.success("Chat title updated");
    close();
  };

  return (
    <div className="modal modal-middle modal-open">
      <div className="modal-box relative">
        <h3 className="font-bold text-lg">Edit chat title</h3>
        <button className="btn btn-sm btn-circle absolute right-4 top-4" onClick={close}>
          <Icon.IoMdClose className="w-5 h-auto" />
        </button>
        <div className="w-full flex flex-col justify-start items-start space-y-3 pt-4">
          <input
            type="text"
            placeholder="Chat title"
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="modal-action">
          <button className="btn btn-outline" onClick={close}>
            Close
          </button>
          <button className="btn" disabled={!allowSave} onClick={handleSaveEdit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMessageTitleModal;

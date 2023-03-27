import Icon from "./Icon";

export interface ActionConfirmModalProps {
  title: string;
  content: string;
  confirmButtonStyle: string;
  close: () => void;
  confirm: () => void;
}

const ActionConfirmModal = (props: ActionConfirmModalProps) => {
  const { close, confirm, title, content, confirmButtonStyle } = props;

  return (
    <div className="modal modal-middle modal-open">
      <div className="modal-box relative">
        <h3 className="font-bold text-lg">{title}</h3>
        <button className="btn btn-sm btn-circle absolute right-4 top-4" onClick={close}>
          <Icon.IoMdClose className="w-5 h-auto" />
        </button>
        <div className="w-full flex flex-col justify-start items-start space-y-3 pt-4">
          <p className="text-gray-500">{content}</p>
        </div>
        <div className="modal-action">
          <button className="btn btn-outline" onClick={close}>
            Close
          </button>
          <button
            className={`btn ${confirmButtonStyle}`}
            onClick={() => {
              confirm();
              close();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionConfirmModal;

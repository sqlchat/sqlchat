import Icon from "./Icon";

interface Props {
  className?: string;
}

const EmptyView = (props: Props) => {
  const { className } = props;

  return (
    <div className={`${className || ""} w-full h-full flex flex-col justify-center items-center`}>
      <p className=" text-5xl font-medium leading-loose mb-8">SQLChat</p>
      <div className="w-full grid grid-cols-3 gap-4">
        <div className="w-full flex flex-col justify-start items-center">
          <Icon.Bs.BsSun className="w-8 h-auto opacity-80" />
          <span className="mt-2 mb-4">Examples</span>
          <div className="w-full bg-gray-50 rounded-lg px-4 py-3 text-sm mb-4">This is the latest placeholder</div>
          <div className="w-full bg-gray-50 rounded-lg px-4 py-3 text-sm mb-4">Another example</div>
        </div>
        <div className="w-full flex flex-col justify-start items-center">
          <Icon.Bs.BsLightning className="w-8 h-auto opacity-80" />
          <span className="mt-2 mb-4">Capabilities</span>
          <div className="w-full bg-gray-50 rounded-lg px-4 py-3 text-sm mb-4">Remembers what user said earlier in the conversation</div>
          <div className="w-full bg-gray-50 rounded-lg px-4 py-3 text-sm mb-4">Allows user to provide follow-up corrections</div>
        </div>
        <div className="w-full flex flex-col justify-start items-center">
          <Icon.Bs.BsEmojiNeutral className="w-8 h-auto opacity-80" />
          <span className="mt-2 mb-4">Limitations</span>
          <div className="w-full bg-gray-50 rounded-lg px-4 py-3 text-sm mb-4">May occasionally generate incorrect information</div>
          <div className="w-full bg-gray-50 rounded-lg px-4 py-3 text-sm mb-4">
            May occasionally produce harmful instructions or biased content
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyView;

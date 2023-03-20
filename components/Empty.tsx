interface Props {
  content?: string;
}

const Empty = (props: Props) => {
  return <div className="w-full flex flex-col justify-center items-center"></div>;
};

export default Empty;

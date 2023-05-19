import { Drawer } from "@mui/material";
import { useEffect } from "react";
import Icon from "./Icon";

interface Props {
  close: () => void;
}

const SchemaDrawer = (props: Props) => {
  useEffect(() => {
    // TODO: initial state with current conversation.
  }, []);

  const close = () => props.close();

  return (
    <Drawer open={true} anchor="right" className="w-full" onClose={close}>
      <div className="dark:text-gray-300 w-screen sm:w-[calc(40vw)] max-w-full flex flex-col justify-start items-start p-4">
        <button className="w-8 h-8 p-1 bg-zinc-600 text-gray-100 rounded-full hover:opacity-80" onClick={close}>
          <Icon.IoMdClose className="w-full h-auto" />
        </button>
        <h3 className="font-bold text-2xl mt-4">Current conversation related schema</h3>
      </div>
    </Drawer>
  );
};

export default SchemaDrawer;

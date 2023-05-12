import * as Ai from "react-icons/ai";
import * as Bi from "react-icons/bi";
import * as Bs from "react-icons/bs";
import * as Di from "react-icons/di";
import * as Fi from "react-icons/fi";
import * as Gi from "react-icons/gi";
import * as Io from "react-icons/io";
import * as Io5 from "react-icons/io5";
import {IconType, IconBaseProps} from "react-icons/lib";
import {ReactSVG} from "react-svg";

const TiDBCloudIcon: IconType = (props: IconBaseProps) => (
  <ReactSVG src="tidb-cloud.svg" className={props.className} />
);

const Icon = {
  ...Ai,
  ...Bi,
  ...Bs,
  ...Di,
  ...Fi,
  ...Gi,
  ...Io,
  ...Io5,
  TiDBCloudIcon
};

// Icon is a collection of all icons from react-icons.
// See https://react-icons.github.io/react-icons/ for more details.
export default Icon;

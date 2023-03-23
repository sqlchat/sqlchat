import { Engine } from "@/types";
import Icon from "./Icon";

interface Props {
  className: string;
  engine: Engine;
}

const EngineIcon = (props: Props) => {
  const { className, engine } = props;

  if (engine === Engine.MySQL) {
    return <Icon.Di.DiMysql className={className} />;
  } else if (engine === Engine.PostgreSQL) {
    return <Icon.Di.DiPostgresql className={className} />;
  } else {
    return <Icon.Di.DiDatabase className={className} />;
  }
};

export default EngineIcon;

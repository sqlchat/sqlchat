import { Engine } from "@/types";
import Icon from "./Icon";

interface Props {
  className: string;
  engine: Engine;
}

const EngineIcon = (props: Props) => {
  const { className, engine } = props;

  if (engine === Engine.MySQL) {
    return <Icon.DiMysql className={className} />;
  } else if (engine === Engine.PostgreSQL) {
    return <Icon.DiPostgresql className={className} />;
  } else if (engine === Engine.MSSQL) {
    return <Icon.DiMsqlServer className={className} />;
  } else if (engine === Engine.TiDBServerless) {
    return <Icon.TiDBCloudIcon className={className}/>;
  } else {
    return <Icon.DiDatabase className={className} />;
  }
};

export default EngineIcon;

import { Engine } from "@/types";
import Icon from "./Icon";

interface Props {
  className: string;
  engine: Engine;
}

const EngineIcon = (props: Props) => {
  const { className, engine } = props;

  if (engine === Engine.MySQL) {
    return <img src="/db-mysql.png" className={className} alt="mysql" />;
  } else if (engine === Engine.PostgreSQL) {
    return <img src="/db-postgres.png" className={className} alt="postgres" />;
  } else if (engine === Engine.MSSQL) {
    return <img src="/db-sqlserver.png" className={className} alt="sqlserver" />;
  } else if (engine === Engine.TiDB) {
    return <img src="/db-tidb.png" className={className} alt="tidb" />;
  } else {
    return <Icon.DiDatabase className={className} />;
  }
};

export default EngineIcon;

import { Connection } from "@/types";
import { Engine } from "@/types/connection";

type changeTiDBConnectionToMySQL = (connection: Connection) => Connection;
export const changeTiDBConnectionToMySQL = (connection: Connection) => {
  if (connection.engineType === Engine.TiDBServerless) {
    return {
      ...connection,
      engineType: Engine.MySQL,
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
      }
    };
  }
  return connection;
}
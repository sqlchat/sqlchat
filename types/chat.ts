import { Id } from "./common";

export interface Chat {
  id: string;
  connectionId: Id;
  databaseName: string;
  assistantId: Id;
}

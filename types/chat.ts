import { Id } from "./";

export interface Chat {
  id: string;
  connectionId: Id;
  databaseName: string;
  assistantId: Id;
}

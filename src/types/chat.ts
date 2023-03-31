import { Id, Timestamp } from ".";

export interface Chat {
  id: string;
  connectionId?: Id;
  databaseName?: string;
  assistantId: Id;
  title: string;
  createdAt: Timestamp;
}

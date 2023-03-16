import { Id, Timestamp } from "./";

export interface Message {
  id: Id;
  chatId: string;
  creatorId: Id;
  createdAt: Timestamp;
  content: string;
}

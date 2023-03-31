import { Id, Timestamp } from ".";

export enum CreatorRole {
  System = "system",
  User = "user",
  Assistant = "assistant",
}

export interface Message {
  id: Id;
  chatId: string;
  creatorId: Id;
  creatorRole: CreatorRole;
  createdAt: Timestamp;
  content: string;
  isGenerated: boolean;
}

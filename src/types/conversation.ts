import { Table } from "@/types";
import { Id, Timestamp } from ".";

export interface Conversation {
  id: string;
  connectionId?: Id;
  databaseName?: string;
  tableList?: Table[];
  tableName?: string;
  assistantId: Id;
  title: string;
  createdAt: Timestamp;
}

import { Id, Timestamp } from ".";

export interface Conversation {
  id: string;
  connectionId?: Id;
  databaseName?: string;
  selectedTableNameList?: string[];
  selectedSchemaName?: string;
  assistantId: Id;
  title: string;
  createdAt: Timestamp;
}

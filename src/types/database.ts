import { Id } from ".";
export interface Database {
  connectionId: Id;
  name: string;
  schemaList: Schema[];
}

export interface Table {
  name: string;
  // structure is a string of the table structure.
  // It's mainly used for providing a chat context for the assistant.
  structure: string;
  token?: number;
  // because old cache didn't have token, So the value may is undefined.
}
export interface Schema {
  name: string;
  tables: Table[];
}
export interface Schema {
  name: string;
  tables: Table[];
}

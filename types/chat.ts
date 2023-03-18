import { Id } from "./common";

export interface Chat {
  id: string;
  assistantId: Id;
  isRequesting: boolean;
}

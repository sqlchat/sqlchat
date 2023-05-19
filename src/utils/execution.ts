import { ExecutionResult } from "@/types";

export const getMessageFromExecutionResult = (result: ExecutionResult): string => {
  if (result.error) {
    return result.error;
  }
  if (result.affectedRows) {
    return `${result.affectedRows} rows affected.`;
  }
  return "";
};

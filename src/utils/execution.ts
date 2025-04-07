import { ExecutionResult } from "@/types";

export const getMessageFromExecutionResult = (result: ExecutionResult): string => {
  if (result.error) {
    return result.error;
  }
  // Only return the "rows affected" message if there are no raw results to display
  if (result.affectedRows && (!result.rawResult || result.rawResult.length === 0)) {
    return `${result.affectedRows} rows affected.`;
  }
  return "";
};

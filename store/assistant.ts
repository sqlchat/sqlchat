import { first } from "lodash-es";
import { Id, User } from "../types";

// Assistant is a special user.
export const assistantList: User[] = [
  {
    id: "sql-assistant",
    name: "SQL Chat",
    description: "🤖️ I'm an expert in SQL. I can answer your questions about databases and SQL.",
    avatar: "",
  },
];

export const getAssistantById = (id: Id) => {
  const user = assistantList.find((user) => user.id === id);
  return user || (first(assistantList) as User);
};

// getPromptOfAssistant define the special prompt for each assistant.
export const getPromptOfAssistant = (assistant: User) => {
  if (assistant.id === "sql-assistant") {
    return `Remember that you are an expert in SQL. And you know everything about databases. You will answer some questions about databases and SQL.`;
  }
  return "";
};

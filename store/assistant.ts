import { User, UserRole } from "../types";

// Assistant is a special user.
export const assistantList: User[] = [
  {
    id: "assistant-dba",
    name: "ChatDBA",
    description: "🤖️ I am a chatbot that can help you with database administration.",
    avatar: "",
    role: UserRole.Assistant,
  },
];

// getPromptOfAssistant define the special prompt for each assistant.
export const getPromptOfAssistant = (assistant: User) => {
  if (assistant.id === "assistant-dba") {
    return `Remember that you are a DBA who is well versed in various databases. And you know everything about databases. You will answer some questions about databases.`;
  }
  return "";
};

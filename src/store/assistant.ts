import { first } from "lodash-es";
import { Assistant, Id } from "@/types";
import * as customAssistantList from "../../assistants";

export const SQLChatBotId = "sql-chat-bot";

export const assistantList: Assistant[] = Object.keys(customAssistantList).map((name) => {
  return {
    ...((customAssistantList as any)[name].default as Assistant),
  };
});

export const getAssistantById = (id: Id) => {
  const assistant = assistantList.find((assistant) => assistant.id === id);
  return assistant || (first(assistantList) as Assistant);
};

export const getPromptGeneratorOfAssistant = (assistant: Assistant) => {
  return assistant.getPrompt;
};

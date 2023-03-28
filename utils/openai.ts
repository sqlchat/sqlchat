import { encode } from "@nem035/gpt-3-encoder";

export const openAIApiKey = process.env.OPENAI_API_KEY;

export const countTextTokens = (text: string) => {
  return encode(text).length;
};

import { encode } from "@nem035/gpt-3-encoder";

// openAIApiKey is the API key for OpenAI API.
export const openAIApiKey = process.env.OPENAI_API_KEY;

// openAIApiEndpoint is the API endpoint for OpenAI API. Defaults to https://api.openai.com.
export const openAIApiEndpoint = process.env.OPENAI_API_ENDPOINT || "https://api.openai.com";

export const countTextTokens = (text: string) => {
  return encode(text).length;
};

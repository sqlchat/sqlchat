import { ChatCompletionResponseMessage, Configuration, OpenAIApi } from "openai";

export interface ChatCompletionResponse {
  message: ChatCompletionResponseMessage;
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default openai;

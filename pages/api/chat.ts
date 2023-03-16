import { NextApiRequest, NextApiResponse } from "next";
import openai, { ChatCompletionResponse } from "./openai-api";

const handler = async (req: NextApiRequest, res: NextApiResponse<ChatCompletionResponse>) => {
  const completionResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: req.body.messages,
    max_tokens: 2000,
    temperature: 0,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });

  res.status(200).json({ message: completionResponse.data.choices[0].message! });
};

// TODO(steven): Implement a generic getChatPrompt function that takes in a
// message and a robot identifier, then returns a string with specific prompts.
const getChatPrompt = async (message: string) => {
  return `
  Question: ${message}
  Answer:`;
};

export default handler;

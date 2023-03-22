import { NextApiRequest, NextApiResponse } from "next";
import openai from "@/utils/openai-api";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const completionResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: req.body.messages,
    max_tokens: 2000,
    temperature: 0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });

  res.status(200).json(completionResponse.data.choices[0].message?.content || "");
};

export default handler;

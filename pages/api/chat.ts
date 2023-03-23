import { openAIApiKey } from "@/utils/openai";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

const handler = async (req: NextRequest) => {
  const reqBody = await req.json();
  const res = await fetch(`https://api.openai.com/v1/chat/completions`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAIApiKey}`,
    },
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: reqBody.messages,
      max_tokens: 2000,
      temperature: 0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    }),
  });

  const data = await res.json();
  return new Response(JSON.stringify(data.choices[0].message?.content || ""), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "public, s-maxage=1200, stale-while-revalidate=600",
    },
  });
};

export default handler;

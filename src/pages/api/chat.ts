import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";
import { NextRequest } from "next/server";
import { openAIApiEndpoint, openAIApiKey } from "@/utils";

export const config = {
  runtime: "edge",
};

const getApiEndpoint = (apiEndpoint: string) => {
  const url = new URL(apiEndpoint);
  url.pathname = '/v1/chat/completions';
  return url;
};

const handler = async (req: NextRequest) => {
  const reqBody = await req.json();
  const openAIApiConfig = reqBody.openAIApiConfig;
  const apiKey = openAIApiConfig?.key || openAIApiKey;
  const apiEndpoint = getApiEndpoint(openAIApiConfig?.endpoint || openAIApiEndpoint);
  const res = await fetch(apiEndpoint, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: reqBody.messages,
      temperature: 0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stream: true,
    }),
  });
  if (!res.ok) {
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
    });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const stream = new ReadableStream({
    async start(controller) {
      const streamParser = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta?.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };
      const parser = createParser(streamParser);
      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });
  return new Response(stream);
};

export default handler;

import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import { NextRequest } from "next/server";
import { API_KEY } from "@/env";
import { openAIApiEndpoint, openAIApiKey, gpt35 } from "@/utils";

export const config = {
  runtime: "edge",
};

const getApiEndpoint = (apiEndpoint: string) => {
  const url = new URL(apiEndpoint);
  url.pathname = "/v1/chat/completions";
  return url;
};

const handler = async (req: NextRequest) => {
  if (API_KEY) {
    const auth = req.headers.get("Authorization");
    if (!auth || auth !== `Bearer ${API_KEY}`) {
      return new Response(
        JSON.stringify({
          error: {
            message: "Unauthorized.",
          },
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 401,
        }
      );
    }
  }

  const reqBody = await req.json();
  const openAIApiConfig = reqBody.openAIApiConfig;
  const apiKey = openAIApiConfig?.key || openAIApiKey;

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: {
          message:
            "OpenAI API Key is missing. You can supply your own key via Settings.",
        },
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 401,
      }
    );
  }

  const apiEndpoint = getApiEndpoint(
    openAIApiConfig?.endpoint || openAIApiEndpoint
  );
  const res = await fetch(apiEndpoint, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    method: "POST",
    body: JSON.stringify({
      model: gpt35.name,
      messages: reqBody.messages,
      temperature: gpt35.temperature,
      frequency_penalty: gpt35.frequency_penalty,
      presence_penalty: gpt35.presence_penalty,
      stream: true,
      // Send end-user ID to help OpenAI monitor and detect abuse.
      user: req.ip,
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

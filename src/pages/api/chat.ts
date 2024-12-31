import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";
import { NextRequest } from "next/server";
import { openAIApiEndpoint, openAIApiKey, openAIOrganization, hasFeature, getModel } from "@/utils";

export const config = {
  runtime: "edge",
};

const getApiEndpoint = (apiEndpoint: string) => {
  const url = new URL(apiEndpoint);
  url.pathname = "/v1/chat/completions";
  return url;
};

// Helper function: Clean SSE data line
const cleanSSELine = (line: string): string => {
  // Remove leading "data:" and any whitespace
  let cleaned = line.replace(/^data:\s*/, "");
  // If it's an event line, extract the JSON part
  if (cleaned.includes("event:")) {
    const match = cleaned.match(/{.*}/);
    if (match) {
      cleaned = match[0];
    }
  }
  return cleaned;
};

const handler = async (req: NextRequest) => {
  const reqBody = await req.json();
  const provider = req.headers.get("x-provider") || "openai";

  if (provider === "dashscope") {
    const apiKey = req.headers.get("x-dashscope-key");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: {
            message: "DashScope API Key is missing. You can supply your key via [Setting](/setting).",
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

    try {
      const model = req.headers.get("x-dashscope-model") || "qwen-turbo";

      const requestBody = {
        model,
        input: {
          messages: reqBody.messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          })),
        },
        parameters: {
          top_p: 0.8,
          temperature: 0.7,
          enable_search: false,
          result_format: "message",
          incremental_output: true, // Enable incremental output
        },
      };

      console.log("DashScope Request Body:", JSON.stringify(requestBody, null, 2));

      const response = await fetch("https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
          Accept: "text/event-stream",
          "X-DashScope-SSE": "enable",
        },
        body: JSON.stringify(requestBody),
      });

      // Add response status check and debug information
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorMessage = "An error occurred while calling DashScope API";
        let errorCode = "";
        let requestId = "";

        try {
          const errorData = await response.json();
          console.error("DashScope Error Response:", errorData);

          if (errorData.code && errorData.message) {
            errorMessage = `${errorData.code}: ${errorData.message}`;
            errorCode = errorData.code;
            requestId = errorData.request_id;
          }
        } catch (e) {
          console.error("Error parsing error response:", e);
        }

        return new Response(
          JSON.stringify({
            error: {
              message: errorMessage,
              code: errorCode,
              request_id: requestId,
            },
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
            status: response.status,
          }
        );
      }

      // Create transform stream to process response
      const transformStream = new TransformStream({
        async transform(chunk, controller) {
          const text = new TextDecoder().decode(chunk);
          console.log("Received chunk:", text); // Log received chunk for debugging

          const lines = text.split("\n");

          for (const line of lines) {
            if (!line.trim()) continue;

            // Log processing line for debugging
            console.log("Processing line:", line);

            if (line.startsWith("data:")) {
              const data = cleanSSELine(line);

              try {
                const jsonData = JSON.parse(data);
                console.log("Parsed JSON data:", jsonData); // Log parsed JSON data for debugging

                // Check different response formats
                if (jsonData.output?.text) {
                  controller.enqueue(new TextEncoder().encode(jsonData.output.text));
                } else if (jsonData.output?.message?.content) {
                  controller.enqueue(new TextEncoder().encode(jsonData.output.message.content));
                } else if (jsonData.output?.choices?.[0]?.message?.content) {
                  controller.enqueue(new TextEncoder().encode(jsonData.output.choices[0].message.content));
                }
              } catch (e) {
                console.error("Error parsing SSE data:", e, "Line:", line);
                continue;
              }
            }
          }
        },
      });

      // Return stream response
      return new Response(response.body?.pipeThrough(transformStream), {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } catch (error: any) {
      console.error("DashScope Handler Error:", error);
      return new Response(
        JSON.stringify({
          error: {
            message: error.message || "An unexpected error occurred",
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
          },
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 500,
        }
      );
    }
  }

  // OpenAI logic
  const apiKey = req.headers.get("x-openai-key") || openAIApiKey;

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: {
          message: "OpenAI API Key is missing. You can supply your own key via [Setting](/setting).",
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

  const useServerKey = !req.headers.get("x-openai-key");
  const sessionToken = req.cookies.get("next-auth.session-token")?.value;
  const currentUrl = new URL(req.url);
  const usageUrl = new URL(currentUrl.protocol + "//" + currentUrl.host + "/api/usage");
  const requestHeaders: any = {
    Authorization: `Bearer ${sessionToken}`,
  };
  if (req.headers.get("x-openai-model")) {
    requestHeaders["x-openai-model"] = req.headers.get("x-openai-model");
  }

  if (useServerKey) {
    if (hasFeature("account") && !sessionToken) {
      return new Response(
        JSON.stringify({
          error: {
            message: "Please sign in first.",
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

    if (hasFeature("quota")) {
      const usageResponse = await fetch(usageUrl, {
        headers: requestHeaders,
      });
      const usageData = await usageResponse.json();
      if (!usageResponse.ok) {
        return new Response(JSON.stringify(usageData), {
          headers: {
            "Content-Type": "application/json",
          },
          status: usageResponse.status,
        });
      }

      const model = getModel(req.headers.get("x-openai-model") || "");
      if (usageData.usage + model.cost_per_call > usageData.quota) {
        return new Response(
          JSON.stringify({
            error: {
              message: "You have exceeded your quota.",
            },
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
            status: 402,
          }
        );
      }
    }
  }

  try {
    const apiEndpoint = req.headers.get("x-openai-endpoint") || openAIApiEndpoint;
    const endpoint = getApiEndpoint(apiEndpoint);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        ...(openAIOrganization
          ? {
              "OpenAI-Organization": openAIOrganization,
            }
          : {}),
      },
      body: JSON.stringify({
        ...reqBody,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return new Response(JSON.stringify(error), {
        headers: {
          "Content-Type": "application/json",
        },
        status: response.status,
      });
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
        },
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
};

export default handler;

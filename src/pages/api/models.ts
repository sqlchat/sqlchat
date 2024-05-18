import { NextApiRequest, NextApiResponse } from "next";
import { openAIApiKey, openAIOrganization, openAIApiEndpoint } from "@/utils";

const getApiEndpoint = (apiEndpoint: string) => {
  const url = new URL(apiEndpoint);
  url.pathname = "/v1/models";
  return url;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json([]);
  }

  const apiKey = req.headers["x-openai-key"] ?? openAIApiKey;

  let headers: { [key: string]: string } = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  if (openAIOrganization) {
    headers["OpenAI-Organization"] = openAIOrganization;
  }
  const apiEndpoint = getApiEndpoint((req.headers["x-openai-endpoint"] as string) ?? openAIApiEndpoint);
  const models = await fetch(apiEndpoint, {
    headers: headers,
    method: "GET",
  }).then((res) => res.json());

  return res.json(models.data);
};

export default handler;

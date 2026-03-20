const gpt35turbo = {
  name: "gpt-3.5-turbo",
  temperature: 0,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
  max_token: 4000,
  cost_per_call: 1,
};

const gpt4 = {
  name: "gpt-4",
  temperature: 0,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
  max_token: 8000,
  cost_per_call: 60,
};

const gpt4turbo = {
  name: "gpt-4-turbo",
  temperature: 0,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
  max_token: 4000,
  cost_per_call: 20,
};

const gpt4ho = {
  name: "gpt-4o",
  temperature: 0,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
  max_token: 4000,
  cost_per_call: 10,
};

const deepseekChat = {
  name: "deepseek-chat",
  temperature: 0,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
  max_token: 12000,
  cost_per_call: 1,
};

const minimaxM27 = {
  name: "MiniMax-M2.7",
  temperature: 0.01,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
  max_token: 204800,
  cost_per_call: 1,
};

const minimaxM27Highspeed = {
  name: "MiniMax-M2.7-highspeed",
  temperature: 0.01,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
  max_token: 204800,
  cost_per_call: 1,
};

export const models = [gpt35turbo, gpt4, gpt4turbo, gpt4ho, deepseekChat, minimaxM27, minimaxM27Highspeed];

export const getModel = (name: string) => {
  for (const model of models) {
    if (model.name === name) {
      return model;
    }
  }
  return gpt35turbo;
};

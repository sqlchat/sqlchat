const gpt35 = {
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
  cost_per_call: 10,
};

export const models = [gpt35, gpt4];

export const getModel = (name: string) => {
  for (const model of models) {
    if (model.name === name) {
      return model;
    }
  }
  return gpt35;
};

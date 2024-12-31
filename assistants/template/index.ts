// It's a template for creating new bots.
export default {
  id: "the-id-of-your-bot",
  name: "The name of your bot",
  description: "The description of your bot",
  avatar: "The avatar link of your bot",
  // The function to get the prompt of the bot.
  getPrompt: (input: string): string => {
    // You can do some preprocessing here.
    const formatedInput = input.trim().toLowerCase();
    return `The prompt of your bot. The question is ${formatedInput}`;
  },
};

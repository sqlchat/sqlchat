import generalBot from "../general-bot";

export default {
  id: "select-bot",
  name: "SQL Select bot",
  description: "To generate query statement",
  avatar: "",
  getPrompt: (schema?: string): string => {
    const generalPrompt = generalBot.getPrompt();
    const basicPrompt = `Please follow the instructions to answer the questions:
1. Set the language to the markdown code block for each code block. For example, \`SELECT * FROM table\` is SQL.
2. Only return query statement`;
    return `${generalPrompt}\nThis is my database schema"${schema}". You will see the tables and columns in the database. And please answer the following questions about the database.\n${basicPrompt}`;
  },
};

export interface Assistant {
  id: string;
  name: string;
  description: string;
  avatar: string;
  getPrompt: (input?: string) => string;
}

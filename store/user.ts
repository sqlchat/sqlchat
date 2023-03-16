import { create } from "zustand";
import { Id, User, UserRole } from "../types";

const assistantList: User[] = [
  {
    id: "assistant-chatgpt",
    name: "Origin ChatGPT",
    description: "",
    avatar: "",
    role: UserRole.Assistant,
  },
  {
    id: "assistant-dba",
    name: "Great DBA Bot",
    description: "",
    avatar: "",
    role: UserRole.Assistant,
  },
];

const localUser: User = {
  id: "local-user",
  name: "Local user",
  description: "",
  avatar: "",
  role: UserRole.User,
};

interface UserState {
  // We can think assistants are special users.
  assistantList: User[];
  currentUser: User;
  getAssistantById: (id: string) => User | undefined;
}

export const useUserStore = create<UserState>((set) => ({
  assistantList: assistantList,
  currentUser: localUser,
  getAssistantById: (id: Id) => {
    const user = assistantList.find((user) => user.id === id);
    return user || undefined;
  },
}));

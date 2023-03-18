import { create } from "zustand";
import { Id, User, UserRole } from "../types";

export const assistantList: User[] = [
  {
    id: "assistant-dba",
    name: "Chat DBA",
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

export const useUserStore = create<UserState>()(() => ({
  assistantList: assistantList,
  currentUser: localUser,
  getAssistantById: (id: Id) => {
    const user = assistantList.find((user) => user.id === id);
    return user || undefined;
  },
}));

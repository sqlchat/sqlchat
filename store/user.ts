import { create } from "zustand";
import { assistantList } from ".";
import { Id, User, UserRole } from "../types";

const localUser: User = {
  id: "local-user",
  name: "Local user",
  description: "",
  avatar: "",
  role: UserRole.User,
};

interface UserState {
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

import { User } from "@/types";
import { create } from "zustand";

const localUser: User = {
  id: "local-user",
  name: "Local user",
  description: "",
  avatar: "",
};

interface UserState {
  currentUser: User;
}

export const useUserStore = create<UserState>()(() => ({
  currentUser: localUser,
}));

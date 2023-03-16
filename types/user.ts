export enum UserRole {
  System = "system",
  User = "user",
  Assistant = "assistant",
}

export interface User {
  id: string;
  name: string;
  description: string;
  avatar: string;
  role: UserRole;
}

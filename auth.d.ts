import { Subscription } from "@/types";
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    usage: number;
    stripeId: number;
    subscription: Subscription;
  }

  interface Session {
    user: User;
  }
}

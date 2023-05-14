import { Subscription } from "@/types";
import "next-auth";

declare module "next-auth" {
  interface User {
    stripeId: number;
    subscription: Subscription;
  }

  interface Session {
    user: User;
  }
}

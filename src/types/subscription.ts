import { SubscriptionPlan, SubscriptionStatus } from "@prisma/client";

export type PlanType = SubscriptionPlan | "GUEST" | "FREE";

// Quota is by month
export const PlanConfig: {
  [key: string]: {
    quota: number;
  };
} = {
  GUEST: {
    quota: 0,
  },
  FREE: {
    quota: 5,
  },
  PRO: {
    quota: 10,
  },
};

export interface Subscription {
  plan: PlanType;
  quota: number;
  status: SubscriptionStatus;
  startAt: number;
  expireAt: number;
}

export interface SubscriptionPurchase {
  id: string;
  email: string;
  amount: number;
  currency: string;
  receipt: string;
  plan: PlanType;
  description: string;
  createdAt: number;
  startAt: number;
  expireAt: number;
}

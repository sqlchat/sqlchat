import { SubscriptionPlan } from "@prisma/client";

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
    quota: 20,
  },
  PRO: {
    quota: 1000,
  },
};

export interface Subscription {
  id: string;
  plan: PlanType;
  quota: number;
  startAt: number;
  expireAt: number;
  canceledAt?: number;
}

export interface Payment {
  id: string;
  email: string;
  createdAt: number;
  amount: number;
  currency: string;
  receipt: string;
  description: string;
}

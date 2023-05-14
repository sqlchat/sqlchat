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
    quota: 20,
  },
  PRO: {
    quota: 1000,
  },
};

export interface Subscription {
  plan: PlanType;
  quota: number;
  status: SubscriptionStatus;
  startAt: Date;
  expireAt: Date;
}

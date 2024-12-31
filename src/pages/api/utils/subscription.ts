import { PlanConfig, PlanType, Subscription } from "@/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getSubscriptionByEmail = async (email: string): Promise<Subscription> => {
  const subscriptions = await prisma.subscription.findMany({
    where: { email: email },
    orderBy: { expireAt: "desc" },
  });

  // Return the latest active subscription if exists.
  for (const subscription of subscriptions) {
    const result: Subscription = {
      id: subscription.id,
      plan: subscription.plan as PlanType,
      quota: PlanConfig[subscription.plan].quota,
      startAt: subscription.startAt.getTime(),
      expireAt: subscription.expireAt.getTime(),
      canceledAt: subscription.canceledAt?.getTime(),
    };
    if (!result.canceledAt && result.expireAt > Date.now()) {
      return result;
    }
  }

  // Return the latest subscripion if exists.
  for (const subscription of subscriptions) {
    return {
      id: subscription.id,
      plan: subscription.plan as PlanType,
      quota: PlanConfig["FREE"].quota,
      startAt: subscription.startAt.getTime(),
      expireAt: subscription.expireAt.getTime(),
      canceledAt: subscription.canceledAt?.getTime(),
    };
  }

  // Return a FREE subscription.
  return {
    id: "",
    plan: "FREE",
    quota: PlanConfig["FREE"].quota,
    startAt: 0,
    expireAt: 0,
  };
};

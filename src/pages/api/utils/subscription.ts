import { PlanConfig, PlanType, Subscription } from "@/types";
import { PrismaClient, SubscriptionStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const getSubscriptionByEmail = async (
  email: string
): Promise<Subscription> => {
  const subscriptions = await prisma.subscription.findMany({
    where: { email: email },
    orderBy: { expireAt: "desc" },
  });

  // Return the latest ACTIVE, not-expired subscription if exists.
  for (const subscription of subscriptions) {
    const result = {
      plan: subscription.plan as PlanType,
      quota: PlanConfig[subscription.plan].quota,
      status: subscription.status,
      startAt: subscription.startAt.getTime(),
      expireAt: subscription.expireAt.getTime(),
    };
    if (
      subscription.status === SubscriptionStatus.ACTIVE &&
      subscription.expireAt.getTime() > Date.now()
    ) {
      return result;
    }
  }

  // Return the latest ACTIVE, expired subscripion if exists.
  for (const subscription of subscriptions) {
    const result = {
      plan: subscription.plan as PlanType,
      quota: PlanConfig["FREE"].quota,
      status: subscription.status,
      startAt: subscription.startAt.getTime(),
      expireAt: subscription.expireAt.getTime(),
    };
    if (subscription.status === SubscriptionStatus.ACTIVE) {
      return result;
    }
  }

  // Return a FREE subscription.
  return {
    plan: "FREE",
    quota: PlanConfig["FREE"].quota,
    status: SubscriptionStatus.ACTIVE,
    startAt: 0,
    expireAt: 0,
  };
};

import { PlanConfig, PlanType, Subscription } from "@/types";
import { PrismaClient, SubscriptionStatus } from "@prisma/client";

const prisma = new PrismaClient();

// Return the latest ACTIVE subscription if exists.
// Otherwise, return the latest non-ACTIVE subscripion.
export const getSubscription = async (
  userId: string
): Promise<Subscription> => {
  const subscriptions = await prisma.subscription.findMany({
    where: { userId: userId },
    orderBy: { expireAt: "desc" },
  });

  let relevantSubscription: Subscription = {
    plan: "FREE",
    quota: PlanConfig["FREE"].quota,
    status: SubscriptionStatus.ACTIVE,
    startAt: new Date(0),
    expireAt: new Date(0),
  };
  for (const subscription of subscriptions) {
    relevantSubscription = {
      plan: subscription.plan as PlanType,
      quota: PlanConfig[subscription.plan].quota,
      status: subscription.status,
      startAt: subscription.startAt,
      expireAt: subscription.expireAt,
    };
    if (relevantSubscription.status === SubscriptionStatus.ACTIVE) {
      break;
    }
  }

  return relevantSubscription;
};

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCurrentMonthUsage = async (endUser: string): Promise<number> => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const aggregations = await prisma.usage.aggregate({
    _sum: {
      count: true,
    },
    where: {
      endUser: endUser,
      createdAt: {
        gte: start,
        lt: end,
      },
    },
  });

  return aggregations._sum.count || 0;
};

// We coerce individual usage to the begining of the day to reduce the usage records.
export const addUsage = async (endUser: string, addition: number): Promise<number> => {
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const usage = await prisma.usage.findFirst({
    where: {
      endUser: endUser,
      createdAt: today,
    },
  });

  let newUsage = 0;
  if (usage) {
    newUsage = usage.count + addition;
    await prisma.usage.update({
      where: {
        id: usage.id,
      },
      data: {
        count: newUsage,
      },
    });
  } else {
    newUsage = addition;
    await prisma.usage.create({
      data: {
        endUser: endUser,
        createdAt: today,
        count: newUsage,
      },
    });
  }

  return newUsage;
};

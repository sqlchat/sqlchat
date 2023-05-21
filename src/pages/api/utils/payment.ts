import { Payment } from "@/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPaymentListByEmail = async (email: string): Promise<Payment[]> => {
  const payments = await prisma.payment.findMany({
    where: { email: email },
    orderBy: { createdAt: "desc" },
  });

  const result: Payment[] = [];
  for (const payment of payments) {
    result.push({
      id: payment.id,
      email: payment.email,
      createdAt: payment.createdAt.getTime(),
      amount: payment.amount,
      currency: payment.currency,
      receipt: payment.receipt,
      description: payment.description,
    });
  }
  return result;
};

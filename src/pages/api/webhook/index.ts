import { buffer } from "micro";
import Cors from "micro-cors";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma, SubscriptionPlan } from "@prisma/client";

import Stripe from "stripe";
import { PlanType } from "@/types";
const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-11-15",
});

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;
const prisma = new PrismaClient();

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"]!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        webhookSecret
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      // On error, log and return the error message.
      if (err! instanceof Error) console.log(err);
      console.log(`❌ Error message: ${errorMessage}`);
      res.status(400).send(`Webhook Error: ${errorMessage}`);
      return;
    }

    // Cast event data to Stripe object.
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const customerId = paymentIntent.customer as string;
      if (customerId) {
        // Save the stripe customer id so that we can relate this customer to future payments.
        await prisma.user.update({
          where: {
            email: paymentIntent.metadata.email,
          },
          data: {
            stripeId: customerId,
          },
        });
      }

      const user = await prisma.user.findUniqueOrThrow({
        where: { email: paymentIntent.metadata.email },
      });

      const today = new Date(new Date().setHours(0, 0, 0, 0));
      const subscription: Prisma.SubscriptionUncheckedCreateInput = {
        userId: user.id,
        createdAt: new Date(paymentIntent.created * 1000),
        status: "ACTIVE",
        startAt: today,
        expireAt: new Date(today.setFullYear(today.getFullYear() + 1)),
        paymentId: paymentIntent.id,
        customerId: customerId || "",
        plan: paymentIntent.metadata.plan as SubscriptionPlan,
      };
      await prisma.subscription.create({ data: subscription });
    } else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(
        `❌ Payment failed: ${paymentIntent.last_payment_error?.message}`
      );
    }

    // Return a response to acknowledge receipt of the event.
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default cors(webhookHandler as any);

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

import { formatAmountForStripe } from "../../../utils/stripe-helpers";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    res.status(401).json({ statusCode: 401, message: "Unauthorized" });
    return;
  }

  if (req.method === "POST") {
    const amount = 50;
    const currency = "USD";

    const session = await getServerSession(req, res, authOptions);
    try {
      // Create Checkout Sessions from body params.
      const params: Stripe.Checkout.SessionCreateParams = {
        submit_type: "pay",
        mode: "payment",
        payment_method_types: [
          "affirm",
          "alipay",
          "card",
          "cashapp",
          "klarna",
          "link",
          "wechat_pay",
        ],
        line_items: [
          {
            price_data: {
              currency: currency,
              product: "prod_IkuBPDaXFUMk9p",
              unit_amount: formatAmountForStripe(amount, currency),
            },
            quantity: 1,
          },
        ],
        payment_method_options: {
          wechat_pay: {
            client: "web",
          },
        },
        payment_intent_data: {
          metadata: {
            email: session?.user?.email!,
          },
        },
        customer_email: session?.user?.email!,
        success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/setting`,
      };
      const checkoutSession: Stripe.Checkout.Session =
        await stripe.checkout.sessions.create(params);

      res.status(200).json(checkoutSession);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

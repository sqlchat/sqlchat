export const getPlanFromPriceId = (priceId: string) => {
  switch (priceId) {
    case process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_1_MONTH_SUBSCRIPTION:
      return {
        month: 1,
        description: "Pro 1 Month (Early Bird)",
      };
    case process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_3_MONTH_SUBSCRIPTION:
      return {
        month: 1,
        description: "Pro 3 Months (Early Bird)",
      };
    case process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_1_YEAR_SUBSCRIPTION:
      return {
        month: 12,
        description: "Pro 1 Year (Early Bird)",
      };
    default: {
      throw Error(`Invalid price ID ${priceId}`);
    }
  }
};

type FeatureType = "debug" | "account" | "payment" | "quota" | "collect";

const matrix: { [key: string]: { [feature: string]: boolean } } = {
  development: {
    debug: true,
    account: !process.env.NEXT_PUBLIC_DATABASE_LESS,
    payment: !process.env.NEXT_PUBLIC_DATABASE_LESS,
    quota: !process.env.NEXT_PUBLIC_DATABASE_LESS,
    collect: !process.env.NEXT_PUBLIC_DATABASE_LESS,
  },
  production: {
    debug: false,
    account: !process.env.NEXT_PUBLIC_DATABASE_LESS,
    payment: !process.env.NEXT_PUBLIC_DATABASE_LESS,
    quota: !process.env.NEXT_PUBLIC_DATABASE_LESS,
    collect: !process.env.NEXT_PUBLIC_DATABASE_LESS,
  },
};

export const hasFeature = (feature: FeatureType) => {
  return matrix[process.env.NODE_ENV][feature];
};

type FeatureType = "debug" | "account" | "payment" | "quota" | "collect";

export const hasDatabase = () => {
  return process.env.NEXT_PUBLIC_USE_DATABASE == "true";
};

const matrix: { [key: string]: { [feature: string]: boolean } } = {
  development: {
    debug: true,
    account: hasDatabase(),
    payment: hasDatabase(),
    quota: hasDatabase(),
    collect: hasDatabase(),
  },
  production: {
    debug: false,
    account: hasDatabase(),
    payment: hasDatabase(),
    quota: hasDatabase(),
    collect: hasDatabase(),
  },
};

export const hasFeature = (feature: FeatureType) => {
  return matrix[process.env.NODE_ENV][feature];
};

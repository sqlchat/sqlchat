type FeatureType = "debug" | "account" | "payment" | "quota" | "collect";

const matrix: { [key: string]: { [feature: string]: boolean } } = {
  development: {
    debug: true,
    account: true,
    payment: true,
    quota: true,
    collect: true,
  },
  production: {
    debug: false,
    account: true,
    payment: true,
    quota: true,
    collect: true,
  },
};

export const hasFeature = (feature: FeatureType) => {
  return matrix[process.env.NODE_ENV][feature];
};

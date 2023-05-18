type FeatureType = "debug" | "account" | "payment" | "quota";

const matrix: { [key: string]: { [feature: string]: boolean } } = {
  development: {
    debug: true,
    account: true,
    payment: true,
    quota: true,
  },
  production: {
    debug: false,
    account: true,
    payment: true,
    quota: true,
  },
};

export const hasFeature = (feature: FeatureType) => {
  return matrix[process.env.NODE_ENV][feature];
};

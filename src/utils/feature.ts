type FeatureType = "debug" | "account" | "payment" | "quota" | "collect";

function databaseLess() {
  return process.env.NEXT_PUBLIC_DATABASE_LESS == "true";
}

const matrix: { [key: string]: { [feature: string]: boolean } } = {
  development: {
    debug: true,
    account: !databaseLess(),
    payment: !databaseLess(),
    quota: !databaseLess(),
    collect: !databaseLess(),
  },
  production: {
    debug: false,
    account: !databaseLess(),
    payment: !databaseLess(),
    quota: !databaseLess(),
    collect: !databaseLess(),
  },
};

export const hasFeature = (feature: FeatureType) => {
  return matrix[process.env.NODE_ENV][feature];
};

type FeatureType = "debug" | "account" | "payment" | "quota";

export const hasFeature = (feature: FeatureType) => {
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  return false;
};

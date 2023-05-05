type FeatureType = "account" | "payment" | "quota";

export const HasFeature = (feature: FeatureType) => {
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  return false;
};

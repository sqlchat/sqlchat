export const getCurrencySymbol = (currencyCode: string): string => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    })
      .formatToParts(1)
      .find((part) => part.type === "currency")!.value;
  } catch (error) {
    console.error(`Invalid currency code: ${currencyCode}`);
    return "";
  }
};

export const getDateString = (timeStamp = Date.now()): string => {
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(timeStamp).toLocaleDateString(undefined, dateOptions);
};

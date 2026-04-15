const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export const formatCompactNumber = (value: number) =>
  compactNumberFormatter.format(value);

export const decimalFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 0
});

export function formatDecimal(value: number): string {
  return decimalFormatter.format(value);
}


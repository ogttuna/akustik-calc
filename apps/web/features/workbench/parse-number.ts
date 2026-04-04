export function parseWorkbenchNumber(value: number | string | null | undefined): number | undefined {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = normalizeWorkbenchNumericString(value);
  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parsePositiveWorkbenchNumber(value: number | string | null | undefined): number | undefined {
  const parsed = parseWorkbenchNumber(value);
  return typeof parsed === "number" && parsed > 0 ? parsed : undefined;
}

function normalizeWorkbenchNumericString(value: string): string | null {
  const compact = value.trim().replace(/[\s\u00a0\u202f]+/gu, "");

  if (!compact || !/^[+-]?[\d.,]+$/u.test(compact)) {
    return null;
  }

  const lastCommaIndex = compact.lastIndexOf(",");
  const lastDotIndex = compact.lastIndexOf(".");

  if (lastCommaIndex >= 0 && lastDotIndex >= 0) {
    return lastCommaIndex > lastDotIndex ? compact.replaceAll(".", "").replace(",", ".") : compact.replaceAll(",", "");
  }

  if (lastCommaIndex >= 0) {
    return compact.replaceAll(",", ".");
  }

  return compact;
}

import type { ImpactMetricBasis, ImpactMetricBasisLabel } from "@dynecho/shared";

const IMPACT_METRIC_KEYS = [
  "CI",
  "CI50_2500",
  "DeltaLw",
  "LPrimeNW",
  "LPrimeNT50",
  "LPrimeNTw",
  "LnTA",
  "LnW",
  "LnWPlusCI"
] as const;

type ImpactMetricKey = (typeof IMPACT_METRIC_KEYS)[number];
type NumericMetricSnapshot = Partial<Record<ImpactMetricKey, number | null | undefined>>;

export function createImpactMetricBasis(
  entries: Partial<Record<ImpactMetricKey, ImpactMetricBasisLabel | null | undefined>>
): ImpactMetricBasis {
  const metricBasis: ImpactMetricBasis = {};

  for (const metric of IMPACT_METRIC_KEYS) {
    const label = entries[metric];
    if (typeof label === "string" && label.length > 0) {
      metricBasis[metric] = label;
    }
  }

  return metricBasis;
}

export function buildUniformImpactMetricBasis(
  metrics: NumericMetricSnapshot,
  label: ImpactMetricBasisLabel
): ImpactMetricBasis {
  const metricBasis: ImpactMetricBasis = {};

  for (const metric of IMPACT_METRIC_KEYS) {
    if (typeof metrics[metric] === "number") {
      metricBasis[metric] = label;
    }
  }

  return metricBasis;
}

export function mergeImpactMetricBasis(
  ...bases: Array<ImpactMetricBasis | null | undefined>
): ImpactMetricBasis | undefined {
  const merged: ImpactMetricBasis = {};

  for (const basis of bases) {
    if (!basis) {
      continue;
    }

    for (const metric of IMPACT_METRIC_KEYS) {
      const label = basis[metric];
      if (typeof label === "string" && label.length > 0) {
        merged[metric] = label;
      }
    }
  }

  return Object.keys(merged).length > 0 ? merged : undefined;
}

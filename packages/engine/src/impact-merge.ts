import type { ImpactCalculation } from "@dynecho/shared";

import { mergeImpactMetricBasis } from "./impact-metric-basis";
import { cloneImpactTrace } from "./impact-trace";

const NUMERIC_IMPACT_KEYS = [
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

function cloneImpact(impact: ImpactCalculation): ImpactCalculation {
  return {
    ...impact,
    availableOutputs: [...impact.availableOutputs],
    metricBasis: impact.metricBasis ? { ...impact.metricBasis } : undefined,
    notes: [...impact.notes],
    trace: impact.trace ? cloneImpactTrace(impact.trace) : undefined
  };
}

function mergeAvailableOutputs(
  primary: readonly ImpactCalculation["availableOutputs"][number][],
  secondary: readonly ImpactCalculation["availableOutputs"][number][]
): ImpactCalculation["availableOutputs"] {
  const merged = [...primary];

  for (const output of secondary) {
    if (!merged.includes(output)) {
      merged.push(output);
    }
  }

  return merged;
}

export function mergeImpactCalculations(
  primaryImpact: ImpactCalculation | null,
  secondaryImpact: ImpactCalculation | null
): ImpactCalculation | null {
  const primary = primaryImpact;
  const secondary = secondaryImpact;

  if (!primary && !secondary) {
    return null;
  }

  if (!primary) {
    return secondary ? cloneImpact(secondary) : null;
  }

  if (!secondary) {
    return cloneImpact(primary);
  }

  if (primary.labOrField === "field" && secondary.labOrField !== "field") {
    return cloneImpact(primary);
  }

  const merged: ImpactCalculation = {
    ...secondary,
    ...primary,
    availableOutputs: mergeAvailableOutputs(primary.availableOutputs, secondary.availableOutputs),
    metricBasis: mergeImpactMetricBasis(secondary.metricBasis, primary.metricBasis),
    notes: [...primary.notes]
  };

  for (const key of NUMERIC_IMPACT_KEYS) {
    if (typeof primary[key] !== "number" && typeof secondary[key] === "number") {
      merged[key] = secondary[key];
    }
  }

  return merged;
}

function canSupplementPublishedUpperTreatmentDelta(
  impact: ImpactCalculation | null
): impact is ImpactCalculation {
  return (
    impact?.basis === "predictor_heavy_floating_floor_iso12354_annexc_estimate" &&
    typeof impact.DeltaLw === "number"
  );
}

export function mergePublishedUpperTreatmentDeltaCompanion(
  primaryImpact: ImpactCalculation | null,
  preferredSupplementaryImpact: ImpactCalculation | null,
  fallbackSupplementaryImpact: ImpactCalculation | null = null
): ImpactCalculation | null {
  if (!primaryImpact) {
    return null;
  }

  if (
    primaryImpact.basis !== "predictor_heavy_concrete_published_upper_treatment_estimate" ||
    typeof primaryImpact.DeltaLw === "number"
  ) {
    return cloneImpact(primaryImpact);
  }

  const supplementaryImpact = canSupplementPublishedUpperTreatmentDelta(preferredSupplementaryImpact)
    ? preferredSupplementaryImpact
    : canSupplementPublishedUpperTreatmentDelta(fallbackSupplementaryImpact)
      ? fallbackSupplementaryImpact
      : null;

  if (!supplementaryImpact) {
    return cloneImpact(primaryImpact);
  }

  const merged = mergeImpactCalculations(primaryImpact, supplementaryImpact);

  if (!merged) {
    return null;
  }

  const note =
    "DeltaLw companion was carried from the same-stack ISO 12354 floating-floor screening path while Ln,w stayed on the published heavy-concrete upper-treatment lane.";

  if (!merged.notes.includes(note)) {
    merged.notes.push(note);
  }

  return merged;
}

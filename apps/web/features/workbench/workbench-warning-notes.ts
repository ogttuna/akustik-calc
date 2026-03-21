import type { AssemblyCalculation } from "@dynecho/shared";

import {
  IMPACT_ONLY_LOW_CONFIDENCE_FLOOR_FAMILY_NOTE,
  isImpactOnlyLowConfidenceFloorLane
} from "./impact-only-low-confidence-floor-lane";

const EXACT_FLOOR_SYSTEM_MATCH_PREFIX = "Curated exact floor-system match active:";

const EXACT_MATCH_SUPPRESSED_WARNING_PATTERNS = [
  /^Screening estimate only\./,
  /^Airborne estimate is using the .* path instead of the screening seed\.$/,
  /^The selected airborne lane is local to this repo; higher-order family solvers and broader comparison envelopes are still being expanded\.$/,
  /^Derived C, Ctr, and STC values are currently built from a calibrated mass-law curve anchored to the screening Rw estimate\.$/,
  /^Cavity assemblies are currently screened with a conservative local heuristic\.$/,
  /^Cavity assemblies are running on a selected local airborne lane; topology-specific dynamic branches are still maturing\.$/,
  /^Lightweight assemblies remain less reliable than dense mineral constructions in the current seed engine\.$/,
  /^Lightweight assemblies still need broader local family coverage before the selected airborne lane can be treated as the highest-confidence path\.$/
];
const LOW_CONFIDENCE_FAMILY_ESTIMATE_PATTERN =
  /^Published family estimate active: .* low confidence at \d+(?:\.\d+)?% fit\.$/;
const IMPACT_ONLY_LOW_CONFIDENCE_FLOOR_WARNING_PATTERN =
  /^Low-confidence .* (?:proxy airborne companions hidden|unavailable proxy airborne outputs hidden)/;

export const EXACT_FLOOR_FAMILY_CURVE_NOTE =
  "Primary floor-family Rw and Ln,w companions come from the curated exact match. STC, C, and Ctr stay on the local airborne curve when shown, so read them as curve-derived companions.";
export const LOW_CONFIDENCE_FLOOR_FAMILY_NOTE =
  "Low-confidence published-family fallback is active on the impact lane. Ln,w stays source-backed, but the family fit is weak, so narrow the topology before treating this as a delivery-ready claim.";

export function buildWorkbenchWarningNotes(result: AssemblyCalculation | null, warnings: readonly string[]): string[] {
  const dedupedWarnings = Array.from(new Set(warnings));
  const isLowConfidenceFloorEstimate =
    result?.dynamicImpactTrace?.estimateTier === "low_confidence" ||
    result?.impact?.basis === "predictor_floor_system_low_confidence_estimate" ||
    result?.floorSystemEstimate?.kind === "low_confidence";
  const isImpactOnlyLowConfidenceEstimate = isImpactOnlyLowConfidenceFloorLane(result);

  if (!result?.floorSystemMatch) {
    if (!isLowConfidenceFloorEstimate) {
      return dedupedWarnings;
    }

    let lowConfidenceWarningFound = false;
    let impactOnlyFloorWarningFound = false;
    const filteredWarnings = dedupedWarnings.filter((warning) => {
      const matchesLowConfidenceLine = LOW_CONFIDENCE_FAMILY_ESTIMATE_PATTERN.test(warning);
      const matchesImpactOnlyFloorLine = IMPACT_ONLY_LOW_CONFIDENCE_FLOOR_WARNING_PATTERN.test(warning);
      if (matchesLowConfidenceLine) {
        lowConfidenceWarningFound = true;
      }
      if (matchesImpactOnlyFloorLine) {
        impactOnlyFloorWarningFound = true;
      }

      return !matchesLowConfidenceLine && !matchesImpactOnlyFloorLine;
    });

    return Array.from(
      new Set([
        ...(lowConfidenceWarningFound || impactOnlyFloorWarningFound
          ? [isImpactOnlyLowConfidenceEstimate ? IMPACT_ONLY_LOW_CONFIDENCE_FLOOR_FAMILY_NOTE : LOW_CONFIDENCE_FLOOR_FAMILY_NOTE]
          : []),
        ...filteredWarnings
      ])
    );
  }

  let suppressedWarningFound = false;
  const filteredWarnings = dedupedWarnings.filter((warning) => {
    const shouldSuppress = EXACT_MATCH_SUPPRESSED_WARNING_PATTERNS.some((pattern) => pattern.test(warning));
    if (shouldSuppress) {
      suppressedWarningFound = true;
    }

    return !shouldSuppress;
  });

  const exactMatchWarnings = filteredWarnings.filter((warning) => warning.startsWith(EXACT_FLOOR_SYSTEM_MATCH_PREFIX));
  const otherWarnings = filteredWarnings.filter((warning) => !warning.startsWith(EXACT_FLOOR_SYSTEM_MATCH_PREFIX));

  return Array.from(
    new Set([
      ...exactMatchWarnings,
      ...(suppressedWarningFound ? [EXACT_FLOOR_FAMILY_CURVE_NOTE] : []),
      ...otherWarnings
    ])
  );
}

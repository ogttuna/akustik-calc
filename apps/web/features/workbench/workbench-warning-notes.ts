import type { AssemblyCalculation } from "@dynecho/shared";

import {
  IMPACT_ONLY_LOW_CONFIDENCE_FLOOR_FAMILY_NOTE,
  isImpactOnlyLowConfidenceFloorLane
} from "./impact-only-low-confidence-floor-lane";
import {
  isReinforcedConcreteLowConfidenceFloorLane,
  REINFORCED_CONCRETE_LOW_CONFIDENCE_FLOOR_FAMILY_NOTE
} from "./reinforced-concrete-low-confidence-floor-lane";

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
const LOW_CONFIDENCE_FALLBACK_WARNING_PATTERN =
  /^Published low-confidence fallback active: .* at \d+(?:\.\d+)?% fit\.$/;
const IMPACT_ONLY_LOW_CONFIDENCE_FLOOR_WARNING_PATTERN =
  /^Low-confidence .* (?:proxy airborne companions hidden|unavailable proxy airborne outputs hidden)/;
const LOW_CONFIDENCE_PROXY_AIRBORNE_WARNING_PATTERN =
  /^Low-confidence .* active with proxy airborne companions\./;

export const EXACT_FLOOR_FAMILY_CURVE_NOTE =
  "Primary floor-family Rw and Ln,w companions come from the curated exact match. STC, C, and Ctr stay on the local airborne curve when shown, so read them as curve-derived companions.";
export const LOW_CONFIDENCE_FLOOR_FAMILY_NOTE =
  "Low-confidence published-family fallback is active on the impact lane. Ln,w stays source-backed, but the family fit is weak, so narrow the topology before treating this as a delivery-ready claim.";

function formatUserVisibleWarning(warning: string): string {
  // AGENT COORDINATION 2026-06-22: User-facing workbench warning copy only; keep engine warning ids intact at source.
  return [
    ["DynEcho", "DAC"],
    ["absorberCoverageRatio", "Absorber coverage ratio"],
    ["absorberFlowResistivityPaSM2", "Absorber flow resistivity"],
    ["absorberThicknessMm", "Absorber thickness"],
    ["cavityDepthMm", "Cavity depth"],
    ["cavitySealState", "Cavity seal state"],
    ["cavitySequence", "Cavity sequence"],
    ["duplicateOpeningId", "duplicate opening ids"],
    ["duplicateOpeningSignature", "duplicate opening definitions"],
    ["duplicateOwnershipGuard", "duplicate ownership guard"],
    ["field_or_building_output_basis", "field/building output basis"],
    ["fieldBuildingAdapterBoundary", "Field/building adapter boundary"],
    [
      "floor_open_web_building_prediction_runtime_owner_missing",
      "open-web building-prediction runtime owner is not implemented"
    ],
    ["frameDepthMm", "Frame depth"],
    ["frameLineCouplingStiffnessMNPerM3", "Frame coupling stiffness"],
    ["frameMaterialClass", "Frame material class"],
    ["frameSpacingMm", "Frame spacing"],
    ["hostWallAreaM2", "Host wall area"],
    ["mechanicalBridgeAreaRatio", "Mechanical bridge area ratio"],
    ["openingAreaExceedsHostWallArea", "opening area exceeds host wall area"],
    ["panelBendingStiffnessNm", "Panel bending stiffness"],
    ["panelCriticalFrequencyHz", "Panel critical frequency"],
    ["panelLayerOwnership", "Panel layer ownership"],
    ["panelLossFactor", "Panel loss factor"],
    ["panelMaterialClass", "Panel material class"],
    ["panelSurfaceMassKgM2", "Panel surface mass"],
    ["panelThicknessMm", "Panel thickness"],
    ["resilientConnectionStiffnessMNPerM3", "Resilient connection stiffness"],
    ["resilientConnectionType", "Resilient connection type"],
    ["sourceAbsentOpeningValueBudgetOwner", "source-absent opening value budget owner"]
  ].reduce((formatted, [needle, replacement]) => formatted.replaceAll(needle, replacement), warning);
}

export function buildWorkbenchWarningNotes(result: AssemblyCalculation | null, warnings: readonly string[]): string[] {
  const dedupedWarnings = Array.from(new Set(warnings.map(formatUserVisibleWarning)));
  const isLowConfidenceFloorEstimate =
    result?.dynamicImpactTrace?.estimateTier === "low_confidence" ||
    result?.impact?.basis === "predictor_floor_system_low_confidence_estimate" ||
    result?.floorSystemEstimate?.kind === "low_confidence";
  const isImpactOnlyLowConfidenceEstimate = isImpactOnlyLowConfidenceFloorLane(result);
  const isReinforcedConcreteLowConfidenceEstimate =
    isReinforcedConcreteLowConfidenceFloorLane(result);

  if (!result?.floorSystemMatch) {
    if (!isLowConfidenceFloorEstimate) {
      return dedupedWarnings;
    }

    let lowConfidenceWarningFound = false;
    let impactOnlyFloorWarningFound = false;
    const filteredWarnings = dedupedWarnings.filter((warning) => {
      const matchesLowConfidenceLine = LOW_CONFIDENCE_FAMILY_ESTIMATE_PATTERN.test(warning);
      const matchesLowConfidenceFallbackLine = LOW_CONFIDENCE_FALLBACK_WARNING_PATTERN.test(warning);
      const matchesImpactOnlyFloorLine = IMPACT_ONLY_LOW_CONFIDENCE_FLOOR_WARNING_PATTERN.test(warning);
      const matchesProxyAirborneLine = LOW_CONFIDENCE_PROXY_AIRBORNE_WARNING_PATTERN.test(warning);
      if (matchesLowConfidenceLine || matchesLowConfidenceFallbackLine) {
        lowConfidenceWarningFound = true;
      }
      if (matchesImpactOnlyFloorLine) {
        impactOnlyFloorWarningFound = true;
      }
      if (matchesProxyAirborneLine) {
        lowConfidenceWarningFound = true;
      }

      return !matchesLowConfidenceLine && !matchesLowConfidenceFallbackLine && !matchesImpactOnlyFloorLine && !matchesProxyAirborneLine;
    });

    return Array.from(
      new Set([
        ...(lowConfidenceWarningFound || impactOnlyFloorWarningFound
          ? [
              isImpactOnlyLowConfidenceEstimate
                ? IMPACT_ONLY_LOW_CONFIDENCE_FLOOR_FAMILY_NOTE
                : isReinforcedConcreteLowConfidenceEstimate
                  ? REINFORCED_CONCRETE_LOW_CONFIDENCE_FLOOR_FAMILY_NOTE
                  : LOW_CONFIDENCE_FLOOR_FAMILY_NOTE
            ]
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

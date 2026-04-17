import type { AssemblyCalculation } from "@dynecho/shared";

function isFiniteNumber(value: number | null | undefined): boolean {
  return typeof value === "number" && Number.isFinite(value);
}

export const REINFORCED_CONCRETE_LOW_CONFIDENCE_FLOOR_FAMILY_NOTE =
  "Low-confidence reinforced-concrete combined fallback is active. Ln,w stays on a mixed nearby-row concrete lane, while Rw and Ctr remain proxy airborne companions instead of a narrow same-stack family claim.";

export const REINFORCED_CONCRETE_LOW_CONFIDENCE_RANKING_RATIONALE =
  "Ranking keeps the elastic-ceiling nearby row first, the rigid-ceiling row second, and the timber-underlay row as a farther fallback when cavity and board geometry drift away from the mixed-row corridor.";

export const REINFORCED_CONCRETE_LOW_CONFIDENCE_LNW_DETAIL =
  "Low-confidence reinforced-concrete combined fallback. Ln,w stays on a mixed nearby-row concrete lane rather than a narrow same-stack family fit.";

export const REINFORCED_CONCRETE_LOW_CONFIDENCE_TRACE_CANDIDATE_DETAIL =
  `29% fit inside the active low-confidence ceiling. Ln,w stays on a mixed nearby-row concrete lane rather than a narrow same-stack family fit. ${REINFORCED_CONCRETE_LOW_CONFIDENCE_RANKING_RATIONALE}`;

export const REINFORCED_CONCRETE_LOW_CONFIDENCE_CANDIDATE_ROWS_DETAIL =
  `Nearby published rows ranked for the current mixed-row fallback. DynEcho keeps this corridor live without claiming a narrow same-stack family estimate. ${REINFORCED_CONCRETE_LOW_CONFIDENCE_RANKING_RATIONALE}`;

export const REINFORCED_CONCRETE_LOW_CONFIDENCE_NEARBY_ROW_LABEL_PREFIX = "Nearby published row";

export const REINFORCED_CONCRETE_LOW_CONFIDENCE_ADDITIONAL_ROWS_LABEL = "Additional nearby published rows";

export function formatReinforcedConcreteLowConfidenceRankedRowLabel(index: number): string {
  switch (index) {
    case 0:
      return "Nearby row 1 · elastic-ceiling anchor";
    case 1:
      return "Nearby row 2 · rigid-ceiling cross-check";
    default:
      return `Nearby row ${index + 1} · farther fallback`;
  }
}

export function formatReinforcedConcreteLowConfidenceRankedRowText(index: number, label: string): string {
  return `${formatReinforcedConcreteLowConfidenceRankedRowLabel(index)}: ${label}`;
}

export function formatReinforcedConcreteLowConfidenceAdditionalRowsDetail(hiddenRowCount: number): string {
  return `${hiddenRowCount} more nearby published ${hiddenRowCount === 1 ? "row remains" : "rows remain"} in the current mixed-row fallback corridor.`;
}

export const REINFORCED_CONCRETE_LOW_CONFIDENCE_ESTIMATE_TIER_DETAIL =
  "Low-confidence reinforced-concrete combined fallback. DynEcho is keeping the lane live inside a mixed nearby-row concrete corridor instead of claiming a narrower same-stack family estimate.";

export const REINFORCED_CONCRETE_LOW_CONFIDENCE_FIT_DETAIL =
  "Displayed fit is capped at 29% for this low-confidence tier. DynEcho keeps the lane explicit without overstating it as a narrow same-stack family fit.";

export const REINFORCED_CONCRETE_LOW_CONFIDENCE_RW_DETAIL =
  "Proxy airborne companion from the same mixed nearby-row reinforced-concrete fallback. DynEcho is keeping Rw explicit, but not treating it as a narrow same-stack family claim.";

export const REINFORCED_CONCRETE_LOW_CONFIDENCE_CTR_DETAIL =
  "Proxy traffic-noise companion from the same mixed nearby-row reinforced-concrete fallback. DynEcho is keeping Ctr explicit, but not treating it as a narrow same-stack family claim.";

export const REINFORCED_CONCRETE_LOW_CONFIDENCE_COMPANION_BASIS_DETAIL =
  "Proxy airborne companions from the same mixed nearby-row reinforced-concrete fallback. DynEcho keeps companion ratings explicit without treating them as a narrow same-stack family claim.";

export const REINFORCED_CONCRETE_LOW_CONFIDENCE_EVIDENCE_DETAIL_PREFIX =
  `Low-confidence reinforced-concrete mixed-row estimate at 29% fit. Ln,w stays on a mixed nearby-row concrete lane, while Rw and Ctr remain proxy airborne companions instead of a narrow same-stack family claim. ${REINFORCED_CONCRETE_LOW_CONFIDENCE_RANKING_RATIONALE}`;

export function isReinforcedConcreteLowConfidenceFloorLane(
  result: AssemblyCalculation | null
): boolean {
  return Boolean(
    result?.floorSystemEstimate?.kind === "low_confidence" &&
      result.impact?.basis === "predictor_floor_system_low_confidence_estimate" &&
      result.dynamicImpactTrace?.estimateTier === "low_confidence" &&
      result.dynamicImpactTrace?.detectedSupportFamily === "reinforced_concrete" &&
      result.dynamicImpactTrace?.systemType === "combined_upper_lower_system" &&
      (isFiniteNumber(result.floorSystemRatings?.Rw) ||
        isFiniteNumber(result.floorSystemRatings?.RwCtr))
  );
}

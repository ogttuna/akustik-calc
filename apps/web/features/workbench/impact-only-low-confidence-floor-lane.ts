import type { AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";

const IMPACT_ONLY_LOW_FREQUENCY_OUTPUTS = new Set<RequestedOutputId>(["CI", "CI,50-2500", "Ln,w+CI"]);

export const IMPACT_ONLY_LOW_CONFIDENCE_FLOOR_FAMILY_NOTE =
  "Low-confidence timber bare-floor fallback is currently impact-only. Ln,w stays source-backed on the published-family lane, while Rw / Ctr stay on the separate airborne screening lane and nil-ceiling floor-family companions stay hidden.";

export const IMPACT_ONLY_LOW_CONFIDENCE_LNW_DETAIL =
  "Source-backed low-confidence impact fallback. This timber bare-floor branch stays impact-only while airborne screening companions remain separate.";

export const IMPACT_ONLY_LOW_CONFIDENCE_RW_DETAIL =
  "Weighted airborne element rating from the separate screening lane. The low-confidence timber bare-floor impact branch stays impact-only, so DynEcho is not presenting this as a floor-family companion.";

export const IMPACT_ONLY_LOW_CONFIDENCE_CTR_DETAIL =
  "Traffic-noise adaptation term from the separate airborne screening lane. The low-confidence timber bare-floor impact branch stays impact-only, so DynEcho is not presenting this as a floor-family companion.";

export const IMPACT_ONLY_LOW_CONFIDENCE_UNAVAILABLE_DETAIL =
  "This timber bare-floor fallback is impact-only. Ln,w stays live, but low-frequency companion terms are not defended on this lane.";

export const IMPACT_ONLY_LOW_CONFIDENCE_TOPOLOGY_GAP_VALUE = "Add the ceiling package";

export const IMPACT_ONLY_LOW_CONFIDENCE_TOPOLOGY_GAP_DETAIL =
  "This bare-floor timber lane is still broad because the live stack only pins down the joist deck and floor finish. Add the ceiling board row, then choose whether that board sits direct to the joists or on furring channels. If mineral wool exists below, add it as a ceiling-fill row so DynEcho can move into a narrower Knauf timber corridor.";

export function isImpactOnlyLowConfidenceFloorLane(result: AssemblyCalculation | null): boolean {
  return Boolean(
    result?.floorSystemEstimate?.kind === "low_confidence" &&
      result.impact?.basis === "predictor_floor_system_low_confidence_estimate" &&
      result.dynamicImpactTrace?.estimateTier === "low_confidence" &&
      !result.floorSystemRatings
  );
}

export function isImpactOnlyLowConfidenceUnavailableOutput(output: RequestedOutputId): boolean {
  return IMPACT_ONLY_LOW_FREQUENCY_OUTPUTS.has(output);
}

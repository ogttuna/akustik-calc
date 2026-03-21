import type { AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";

const IMPACT_ONLY_LOW_FREQUENCY_OUTPUTS = new Set<RequestedOutputId>(["CI", "CI,50-2500", "Ln,w+CI"]);

export const IMPACT_ONLY_LOW_CONFIDENCE_FLOOR_FAMILY_NOTE =
  "Low-confidence timber bare-floor fallback is active. DynEcho is now exposing the published-family airborne companions on the same low-confidence lane, but this stack still needs a ceiling package before it can move into a narrower Knauf corridor.";

export const IMPACT_ONLY_LOW_CONFIDENCE_LNW_DETAIL =
  "Source-backed low-confidence timber bare-floor fallback. Ln,w is live, but the stack still needs a ceiling package before DynEcho can move into a narrower Knauf corridor.";

export const IMPACT_ONLY_LOW_CONFIDENCE_RW_DETAIL =
  "Weighted airborne companion from the same low-confidence published-family fallback. Add the ceiling package to replace this broad timber bare-floor lane with a narrower Knauf corridor.";

export const IMPACT_ONLY_LOW_CONFIDENCE_CTR_DETAIL =
  "Traffic-noise adaptation companion from the same low-confidence published-family fallback. Add the ceiling package to replace this broad timber bare-floor lane with a narrower Knauf corridor.";

export const IMPACT_ONLY_LOW_CONFIDENCE_UNAVAILABLE_DETAIL =
  "This timber bare-floor fallback stays on the broad low-confidence published-family lane. Add the ceiling package before treating unsupported companion outputs as in-scope.";

export const IMPACT_ONLY_LOW_CONFIDENCE_TOPOLOGY_GAP_VALUE = "Add the ceiling package";

export const IMPACT_ONLY_LOW_CONFIDENCE_TOPOLOGY_GAP_DETAIL =
  "This bare-floor timber lane is still broad because the live stack only pins down the joist deck and floor finish. Add the ceiling board row, then choose whether that board sits direct to the joists or on furring channels. If mineral wool exists below, add it as a ceiling-fill row so DynEcho can move into a narrower Knauf timber corridor.";

export function isImpactOnlyLowConfidenceFloorLane(result: AssemblyCalculation | null): boolean {
  return Boolean(
    result?.floorSystemEstimate?.kind === "low_confidence" &&
      result.impact?.basis === "predictor_floor_system_low_confidence_estimate" &&
      result.dynamicImpactTrace?.estimateTier === "low_confidence" &&
      result.dynamicImpactTrace?.systemType === "bare_floor" &&
      result.dynamicImpactTrace?.detectedSupportFamily === "timber_joists"
  );
}

export function isImpactOnlyLowConfidenceUnavailableOutput(output: RequestedOutputId): boolean {
  return IMPACT_ONLY_LOW_FREQUENCY_OUTPUTS.has(output) && output === "CI,50-2500";
}

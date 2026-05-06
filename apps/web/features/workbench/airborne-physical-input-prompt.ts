import type { AssemblyCalculation } from "@dynecho/shared";

const DOUBLE_LEAF_FRAMED_BRIDGE_INPUT_COMPLETENESS_ID =
  "gate_q_double_leaf_framed_bridge_route_inputs";

export function getDoubleLeafFramedBridgeAirbornePromptInputs(
  result: AssemblyCalculation | null | undefined
): string[] {
  const missingInputs = result?.airborneBasis?.missingPhysicalInputs ?? [];
  const inputCompletenessIds = result?.airborneCandidateResolution?.inputCompletenessIds ?? [];

  if (
    result?.airborneBasis?.origin !== "needs_input" ||
    result.airborneCandidateResolution?.selectedCandidateId !== "candidate_dynamic_needs_input" ||
    !inputCompletenessIds.includes(DOUBLE_LEAF_FRAMED_BRIDGE_INPUT_COMPLETENESS_ID) ||
    !missingInputs.includes("resilientBarSideCount")
  ) {
    return [];
  }

  return [...missingInputs];
}

export function getDoubleLeafFramedBridgeAirbornePromptDetail(
  result: AssemblyCalculation | null | undefined
): string | null {
  const missingInputs = getDoubleLeafFramedBridgeAirbornePromptInputs(result);

  if (missingInputs.length === 0) {
    return null;
  }

  return `Needs explicit double-leaf/framed bridge input before this airborne metric can be defended: ${missingInputs.join(", ")}.`;
}

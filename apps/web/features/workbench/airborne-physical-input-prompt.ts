import type { AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";

const DOUBLE_LEAF_FRAMED_BRIDGE_INPUT_COMPLETENESS_ID =
  "gate_q_double_leaf_framed_bridge_route_inputs";
const DYNAMIC_NEEDS_INPUT_CANDIDATE_ID = "candidate_dynamic_needs_input";
const ANSWER_ENGINE_V1_FLAT_DOUBLE_LEAF_MISSING_TOPOLOGY_METHOD =
  "acoustic_calculator_answer_engine_v1_flat_double_leaf_missing_topology";
const AIRBORNE_PHYSICAL_INPUT_LABELS: Partial<Record<string, string>> = {
  buildingPredictionOutputBasis: "building output basis",
  cavity1DepthMm: "first cavity depth",
  conservativeFlankingAssumption: "conservative flanking assumption",
  flankingJunctionClass: "flanking/junction class",
  frameBridgeClass: "frame bridge class",
  junctionCouplingLengthM: "junction coupling length",
  partitionAreaM2: "partition width and height",
  receivingRoomRt60S: "receiving-room RT60 (s)",
  receivingRoomVolumeM3: "receiving-room volume (m3)",
  resilientBarSideCount: "resilient bar side count",
  sideALeafGroup: "side A leaf group",
  sideBLeafGroup: "side B leaf group",
  sourceRoomVolumeM3: "source-room volume (m3)",
  supportSpacingMm: "support spacing",
  supportTopology: "support topology"
};

export function formatAirbornePhysicalPromptInput(input: string): string {
  const label = AIRBORNE_PHYSICAL_INPUT_LABELS[input];
  return label ? `${label} [${input}]` : input;
}

export function formatAirbornePhysicalPromptInputs(inputs: readonly string[]): string {
  return inputs.map((input) => formatAirbornePhysicalPromptInput(input)).join(", ");
}

export function getDoubleLeafFramedBridgeAirbornePromptInputs(
  result: AssemblyCalculation | null | undefined,
  output?: RequestedOutputId
): string[] {
  const missingInputs = result?.airborneBasis?.missingPhysicalInputs ?? [];
  const inputCompletenessIds = result?.airborneCandidateResolution?.inputCompletenessIds ?? [];

  if (
    result?.airborneBasis?.origin !== "needs_input" ||
    result.airborneCandidateResolution?.selectedCandidateId !== DYNAMIC_NEEDS_INPUT_CANDIDATE_ID ||
    missingInputs.length === 0
  ) {
    return [];
  }

  const doubleLeafFramedBridgePrompt =
    inputCompletenessIds.includes(DOUBLE_LEAF_FRAMED_BRIDGE_INPUT_COMPLETENESS_ID);
  const answerEngineFlatDoubleLeafPrompt =
    result.airborneBasis.method === ANSWER_ENGINE_V1_FLAT_DOUBLE_LEAF_MISSING_TOPOLOGY_METHOD;
  const answerEngineWallNeedsInputPrompt =
    result.acousticAnswerBoundary?.route === "wall" &&
    result.acousticAnswerBoundary.origin === "needs_input";

  if (
    output &&
    answerEngineWallNeedsInputPrompt &&
    !result.acousticAnswerBoundary?.unsupportedOutputs.includes(output)
  ) {
    return [];
  }

  if (!doubleLeafFramedBridgePrompt && !answerEngineFlatDoubleLeafPrompt && !answerEngineWallNeedsInputPrompt) {
    return [];
  }

  return [...missingInputs];
}

export function getDoubleLeafFramedBridgeAirbornePromptDetail(
  result: AssemblyCalculation | null | undefined,
  output?: RequestedOutputId
): string | null {
  const missingInputs = getDoubleLeafFramedBridgeAirbornePromptInputs(result, output);

  if (missingInputs.length === 0) {
    return null;
  }

  return `Needs explicit airborne physical input before this airborne metric can be defended: ${formatAirbornePhysicalPromptInputs(missingInputs)}.`;
}

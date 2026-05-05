import type { AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";

import { FLAT_LIST_MULTILEAF_GUARD_STRATEGY } from "./dynamic-airborne-flat-list-multileaf-guard";
import {
  ROCKWOOL_TRIPLE_LEAF_SOURCE_REQUIRED_RUNTIME_BLOCKERS,
  ROCKWOOL_TRIPLE_LEAF_SOURCE_REQUIRED_RUNTIME_WARNING
} from "./rockwool-triple-leaf-source-required-boundary";

export const ROCKWOOL_TRIPLE_LEAF_LAB_SCREENING_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];

export const ROCKWOOL_TRIPLE_LEAF_FIELD_SCREENING_OUTPUTS = [
  "R'w",
  "DnT,w"
] as const satisfies readonly RequestedOutputId[];

export type RockwoolTripleLeafSupportPostureId =
  | "not_rockwool_triple_leaf"
  | "screening_supported_not_exact"
  | "flat_list_fail_closed_screening_supported"
  | "field_continuation_screening_supported";

export type RockwoolTripleLeafSupportPosture = {
  applies: boolean;
  exactDesignGradeAllowed: boolean;
  outputSupportChangeRequiredNow: boolean;
  postureId: RockwoolTripleLeafSupportPostureId;
  screeningPreviewRequiredIfUnsupportedSelected: boolean;
  sourceRequiredBlockers: readonly string[];
  supportSemantics:
    | "not_applicable"
    | "finite_screening_metric_available"
    | "field_continuation_from_screening_metric";
  unsupportedWithoutSeparatePreviewAllowed: boolean;
};

const FLAT_LIST_ADJACENT_SWAP_WARNING = "Flat-list adjacent-swap sensitivity guard";

function hasAnyOutput(outputs: readonly RequestedOutputId[], candidates: readonly RequestedOutputId[]): boolean {
  return candidates.some((candidate) => outputs.includes(candidate));
}

function hasRockwoolSplitFill(result: AssemblyCalculation): boolean {
  return result.layers.filter((layer: { materialId: string }) => layer.materialId === "rockwool").length >= 2;
}

function hasSourceRequiredSignal(result: AssemblyCalculation): boolean {
  const warnings = result.warnings.join("\n");

  return (
    warnings.includes(ROCKWOOL_TRIPLE_LEAF_SOURCE_REQUIRED_RUNTIME_WARNING) ||
    warnings.includes(FLAT_LIST_ADJACENT_SWAP_WARNING) ||
    result.dynamicAirborneTrace?.strategy === FLAT_LIST_MULTILEAF_GUARD_STRATEGY
  );
}

export function evaluateRockwoolTripleLeafSupportPosture(
  result: AssemblyCalculation
): RockwoolTripleLeafSupportPosture {
  const trace = result.dynamicAirborneTrace;
  const isRockwoolTripleLeafCandidate =
    trace?.detectedFamily === "multileaf_multicavity" && hasRockwoolSplitFill(result) && hasSourceRequiredSignal(result);

  if (!isRockwoolTripleLeafCandidate) {
    return {
      applies: false,
      exactDesignGradeAllowed: false,
      outputSupportChangeRequiredNow: false,
      postureId: "not_rockwool_triple_leaf",
      screeningPreviewRequiredIfUnsupportedSelected: false,
      sourceRequiredBlockers: [],
      supportSemantics: "not_applicable",
      unsupportedWithoutSeparatePreviewAllowed: false
    };
  }

  const requestedOutputs = result.targetOutputs;
  const isFlatListFailClosed =
    result.warnings.some((warning: string) => warning.includes(FLAT_LIST_ADJACENT_SWAP_WARNING)) ||
    trace?.strategy === FLAT_LIST_MULTILEAF_GUARD_STRATEGY;
  const isFieldContinuation = hasAnyOutput(requestedOutputs, ROCKWOOL_TRIPLE_LEAF_FIELD_SCREENING_OUTPUTS);

  // Support remains about finite calculator availability. Exactness/source
  // ownership is tracked as a separate posture until a screening-preview API
  // channel exists.
  return {
    applies: true,
    exactDesignGradeAllowed: false,
    outputSupportChangeRequiredNow: false,
    postureId: isFlatListFailClosed
      ? "flat_list_fail_closed_screening_supported"
      : isFieldContinuation
        ? "field_continuation_screening_supported"
        : "screening_supported_not_exact",
    screeningPreviewRequiredIfUnsupportedSelected: true,
    sourceRequiredBlockers: ROCKWOOL_TRIPLE_LEAF_SOURCE_REQUIRED_RUNTIME_BLOCKERS,
    supportSemantics: isFieldContinuation
      ? "field_continuation_from_screening_metric"
      : "finite_screening_metric_available",
    unsupportedWithoutSeparatePreviewAllowed: false
  };
}

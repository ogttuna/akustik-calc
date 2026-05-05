import type {
  AirborneContext,
  DynamicAirborneTrace,
  RequestedOutputId,
  ResolvedLayer
} from "@dynecho/shared";

import { materialText } from "./airborne-topology";
import { ROCKWOOL_TRIPLE_LEAF_SOURCE_REQUIRED_RUNTIME_BLOCKERS } from "./rockwool-triple-leaf-source-required-boundary";
import type { TargetOutputSupportResult } from "./target-output-support";
import {
  evaluateWallTripleLeafCalibrationGate,
  type WallTripleLeafCalibrationGateEvaluation
} from "./wall-triple-leaf-calibration-regime";
import {
  WALL_TRIPLE_LEAF_SOURCE_PACK_CANDIDATES,
  type WallTripleLeafSourcePackCandidate
} from "./wall-triple-leaf-source-pack";

export type RockwoolSplitTripleLeafNumericSnapshot = {
  confidence?: string;
  dnTw?: number;
  family?: string;
  rw?: number;
  rwPrime?: number;
  stc?: number;
  strategy?: string;
};

export type RockwoolSplitTripleLeafSourceBlocker = {
  bandDataStatus: WallTripleLeafSourcePackCandidate["bandDataStatus"];
  firstMissingBlocker: string;
  hasNumericBandCurve: boolean;
  id: string;
  protectedBoundary: string;
  reportedMetrics: readonly string[];
};

export type RockwoolSplitTripleLeafNumericSourceClosureEvaluation = {
  adjacentFlatListRecovered: boolean;
  blockedSourceEvidence: readonly RockwoolSplitTripleLeafSourceBlocker[];
  exactNumericClosedNow: false;
  flatListSplitInternalLeafPhysicalPenaltyAllowedNow: false;
  groupedTopologyRequiredBeforePhysicalPenalty: true;
  requiredBeforeExactNumericClosure: readonly string[];
  selectedNextAction: typeof ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_A.selectedNextAction;
  selectedNextFile: typeof ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_A.selectedNextFile;
  sourceOwnedExactRuntimeReadyNow: false;
  splitCurrentFiniteDiagnostic: boolean;
};

export const ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_decided_split_internal_leaf_requires_source_owned_topology_before_exact_numeric_closure",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction:
    "gate_b_withhold_flat_list_split_internal_leaf_exact_outputs_until_grouped_topology_or_source_owned_model",
  selectedNextFile: "packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-b-runtime.test.ts",
  selectionStatus:
    "gate_a_kept_split_internal_leaf_finite_screening_diagnostic_but_rejected_exact_numeric_closure_selected_runtime_withhold_gate_b",
  sliceId: "rockwool_split_triple_leaf_numeric_source_closure_v1",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

export const ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING =
  "Rockwool split/internal gypsum-leaf flat-list outputs were withheld from supportedTargetOutputs because grouped triple-leaf topology and a source-owned calibrated model are required before the current Rw 41 / R'w 39 / DnT,w 40 screening diagnostic can be consumed as a defended result.";

export const ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_B = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate:
    "gate_b_withheld_flat_list_split_internal_leaf_exact_outputs_until_grouped_topology_or_source_owned_model",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: true,
  proposalReportCopyChange: false,
  proposalReportValueChange: true,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeSupportBehaviorChange: true,
  selectedNextAction:
    "gate_c_closeout_split_triple_leaf_numeric_source_closure_and_select_next_accuracy_slice",
  selectedNextFile:
    "packages/engine/src/post-rockwool-split-triple-leaf-numeric-source-closure-v1-next-slice-selection-contract.test.ts",
  selectionStatus:
    "gate_b_withheld_flat_list_split_internal_leaf_supported_outputs_selected_closeout",
  sliceId: "rockwool_split_triple_leaf_numeric_source_closure_v1",
  supportDemotion: true,
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

export const ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_C = {
  apiShapeChange: false,
  closedImplementationSlice: "rockwool_split_triple_leaf_numeric_source_closure_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  gateCNumericRuntimeBehaviorChange: false,
  latestLandedGate:
    "gate_b_withheld_flat_list_split_internal_leaf_exact_outputs_until_grouped_topology_or_source_owned_model",
  latestLandedStatus:
    "gate_b_withheld_flat_list_split_internal_leaf_supported_outputs_selected_closeout",
  nextExecutionAction:
    "gate_a_revalidate_source_gap_order_after_rockwool_split_numeric_closure_closeout",
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportValueChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_source_gap_revalidation_v26",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V26_PLAN.md",
  selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_rockwool_split_numeric_closure",
  selectionStatus:
    "closed_rockwool_split_triple_leaf_numeric_source_closure_selected_source_gap_revalidation_v26",
  sliceId: "post_rockwool_split_triple_leaf_numeric_source_closure_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportDemotion: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v26-gate-a-contract.test.ts",
  warningCopyChange: false,
  workbenchInputBehaviorChange: false
} as const;

export const ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_DECISION = {
  adjacentFlatListDefendedValue: "Rw 51 / R'w 49 / DnT,w 51",
  decision:
    "flat-list split/internal gypsum leaf cannot be treated as a defended physical triple-leaf penalty without grouped topology and a source-owned calibrated model",
  rejectedShortcut:
    "do not import NRC/Uris weighted deltas or the current multileaf screening blend as a fixed Rockwool runtime penalty",
  splitCurrentDiagnosticValue: "Rw 41 / R'w 39 / DnT,w 40",
  splitExactNumericClosedNow: false
} as const;

const CLOSURE_SOURCE_IDS = new Set([
  "nrc_2024_internal_gypsum_double_stud",
  "uris_2006_internal_gypsum_double_frame",
  "ballagh_2013_triple_panel_low_frequency_model"
]);

const WALL_AIRBORNE_TARGET_OUTPUTS = new Set<RequestedOutputId>([
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "DnT,w",
  "DnT,A",
  "DnT,A,k",
  "Dn,w",
  "Dn,A"
]);

function isRockwoolLayer(layer: ResolvedLayer): boolean {
  return /rockwool|rock wool|stone wool|mineral wool/.test(materialText(layer));
}

function isGypsumBoardLikeLayer(layer: ResolvedLayer): boolean {
  return /gypsum|plasterboard|drywall/.test(materialText(layer));
}

export function isFlatListSplitInternalRockwoolDiagnostic(input: {
  airborneContext?: AirborneContext | null;
  layers: readonly ResolvedLayer[];
  trace?: DynamicAirborneTrace | null;
}): boolean {
  if (input.airborneContext?.wallTopology?.topologyMode === "grouped_triple_leaf") {
    return false;
  }

  if (
    input.trace?.detectedFamily !== "multileaf_multicavity" ||
    input.trace.strategy !== "multileaf_screening_blend"
  ) {
    return false;
  }

  const rockwoolIndexes = input.layers
    .map((layer, index) => (isRockwoolLayer(layer) ? index : null))
    .filter((index): index is number => index !== null);

  for (let left = 0; left < rockwoolIndexes.length - 1; left += 1) {
    for (let right = left + 1; right < rockwoolIndexes.length; right += 1) {
      const start = rockwoolIndexes[left]!;
      const end = rockwoolIndexes[right]!;
      const betweenLayers = input.layers.slice(start + 1, end);

      if (betweenLayers.some(isGypsumBoardLikeLayer)) {
        return true;
      }
    }
  }

  return false;
}

export function withholdRockwoolSplitTripleLeafExactTargetOutputs(input: {
  airborneContext?: AirborneContext | null;
  layers: readonly ResolvedLayer[];
  targetOutputSupport: TargetOutputSupportResult;
  trace?: DynamicAirborneTrace | null;
}): {
  targetOutputSupport: TargetOutputSupportResult;
  warning: string | null;
  withheldTargetOutputs: readonly RequestedOutputId[];
} {
  if (
    !isFlatListSplitInternalRockwoolDiagnostic({
      airborneContext: input.airborneContext,
      layers: input.layers,
      trace: input.trace
    })
  ) {
    return {
      targetOutputSupport: input.targetOutputSupport,
      warning: null,
      withheldTargetOutputs: []
    };
  }

  const withheldTargetOutputs = input.targetOutputSupport.supportedTargetOutputs.filter((output) =>
    WALL_AIRBORNE_TARGET_OUTPUTS.has(output)
  );

  if (withheldTargetOutputs.length === 0) {
    return {
      targetOutputSupport: input.targetOutputSupport,
      warning: null,
      withheldTargetOutputs
    };
  }

  const withheldSet = new Set(withheldTargetOutputs);
  const supportedTargetOutputs = input.targetOutputSupport.supportedTargetOutputs.filter(
    (output) => !withheldSet.has(output)
  );
  const supportedSet = new Set(supportedTargetOutputs);
  const unsupportedTargetOutputs = input.targetOutputSupport.targetOutputs.filter(
    (output) => !supportedSet.has(output)
  );

  return {
    targetOutputSupport: {
      ...input.targetOutputSupport,
      supportedImpactOutputs: input.targetOutputSupport.supportedImpactOutputs.filter((output) =>
        supportedSet.has(output)
      ),
      supportedTargetOutputs,
      unsupportedImpactOutputs: input.targetOutputSupport.unsupportedImpactOutputs,
      unsupportedTargetOutputs
    },
    warning: ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING,
    withheldTargetOutputs
  };
}

function hasAdjacentFlatListRecovery(input: {
  adjacentField: RockwoolSplitTripleLeafNumericSnapshot;
  adjacentLab: RockwoolSplitTripleLeafNumericSnapshot;
}): boolean {
  return (
    input.adjacentLab.family === "double_leaf" &&
    input.adjacentLab.rw === 51 &&
    input.adjacentLab.stc === 51 &&
    input.adjacentField.family === "double_leaf" &&
    input.adjacentField.rwPrime === 49 &&
    input.adjacentField.dnTw === 51
  );
}

function hasSplitFiniteDiagnostic(input: {
  splitField: RockwoolSplitTripleLeafNumericSnapshot;
  splitLab: RockwoolSplitTripleLeafNumericSnapshot;
}): boolean {
  return (
    input.splitLab.family === "multileaf_multicavity" &&
    input.splitLab.strategy === "multileaf_screening_blend" &&
    input.splitLab.rw === 41 &&
    input.splitLab.stc === 41 &&
    input.splitField.family === "multileaf_multicavity" &&
    input.splitField.strategy === "multileaf_screening_blend" &&
    input.splitField.rwPrime === 39 &&
    input.splitField.dnTw === 40
  );
}

function buildSourceBlockers(
  candidates: readonly WallTripleLeafSourcePackCandidate[]
): readonly RockwoolSplitTripleLeafSourceBlocker[] {
  return candidates
    .filter((candidate) => CLOSURE_SOURCE_IDS.has(candidate.id))
    .map((candidate) => ({
      bandDataStatus: candidate.bandDataStatus,
      firstMissingBlocker: candidate.firstMissingBlocker,
      hasNumericBandCurve: candidate.hasNumericBandCurve,
      id: candidate.id,
      protectedBoundary: candidate.protectedBoundary,
      reportedMetrics: candidate.reportedMetrics
    }));
}

export function evaluateRockwoolSplitTripleLeafNumericSourceClosure(input: {
  adjacentField: RockwoolSplitTripleLeafNumericSnapshot;
  adjacentLab: RockwoolSplitTripleLeafNumericSnapshot;
  calibrationGate?: WallTripleLeafCalibrationGateEvaluation;
  sourceCandidates?: readonly WallTripleLeafSourcePackCandidate[];
  splitField: RockwoolSplitTripleLeafNumericSnapshot;
  splitLab: RockwoolSplitTripleLeafNumericSnapshot;
}): RockwoolSplitTripleLeafNumericSourceClosureEvaluation {
  const sourceCandidates = input.sourceCandidates ?? WALL_TRIPLE_LEAF_SOURCE_PACK_CANDIDATES;
  const calibrationGate = input.calibrationGate ?? evaluateWallTripleLeafCalibrationGate();

  return {
    adjacentFlatListRecovered: hasAdjacentFlatListRecovery(input),
    blockedSourceEvidence: buildSourceBlockers(sourceCandidates),
    exactNumericClosedNow: false,
    flatListSplitInternalLeafPhysicalPenaltyAllowedNow: false,
    groupedTopologyRequiredBeforePhysicalPenalty: true,
    requiredBeforeExactNumericClosure: [
      ...ROCKWOOL_TRIPLE_LEAF_SOURCE_REQUIRED_RUNTIME_BLOCKERS,
      ...calibrationGate.blockers
    ],
    selectedNextAction: ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_A.selectedNextAction,
    selectedNextFile: ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_A.selectedNextFile,
    sourceOwnedExactRuntimeReadyNow: false,
    splitCurrentFiniteDiagnostic: hasSplitFiniteDiagnostic(input)
  };
}

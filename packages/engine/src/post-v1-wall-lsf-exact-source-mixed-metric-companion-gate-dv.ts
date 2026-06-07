import type { RequestedOutputId } from "@dynecho/shared";

import {
  GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_EXACT_SOURCE_ID,
  GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_RUNTIME_METHOD,
  GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-dv-lsf-exact-source-mixed-companion";
import {
  POST_V1_GATE_DU_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_DU_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-du";

export const POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_LANDED_GATE =
  "post_v1_wall_lsf_exact_source_mixed_metric_companion_gate_dv_plan" as const;

export const POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTION_STATUS =
  "post_v1_wall_lsf_exact_source_mixed_metric_companion_gate_dv_landed_runtime_scope_basis_selected_next_numeric_coverage_gap_gate_dw" as const;

export const POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_dw_plan" as const;

export const POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dw-contract.test.ts" as const;

export const POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage/accuracy gap Gate DW" as const;

export const POST_V1_GATE_DV_EXACT_SOURCE_ID =
  GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_EXACT_SOURCE_ID;

export const POST_V1_GATE_DV_SELECTED_CANDIDATE_ID =
  POST_V1_GATE_DU_SELECTED_CANDIDATE_ID;

export const POST_V1_GATE_DV_TARGET_OUTPUTS = [
  ...POST_V1_GATE_DU_SELECTED_TARGET_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DV_RUNTIME_BASIS = {
  exactSourceId: POST_V1_GATE_DV_EXACT_SOURCE_ID,
  kind: "airborne_physics_prediction",
  method: GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_RUNTIME_METHOD,
  origin: "family_physics_prediction",
  selectedCandidateId: GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_SELECTED_CANDIDATE_ID,
  toleranceClass: "uncalibrated_prediction"
} as const;

export const POST_V1_GATE_DV_COUNTERS = {
  fieldAdapterAliasesAdded: 0,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 1,
  newCalculableRequestShapes: 1,
  newCalculableTargetOutputs: 3,
  protectedFieldOrBuildingAliasRequestShapes: 1,
  protectedSingleOutputExactRequestShapes: 1,
  runtimeBasisPromotions: 1,
  runtimeCorrectedLayerTemplates: 1,
  runtimeCorrectedRequestShapes: 1,
  runtimeValuesMoved: 0
} as const;

export const POST_V1_GATE_DV_NEGATIVE_BOUNDARIES = [
  {
    boundaryId: "no_full_exact_promotion_for_unreported_lsf_companions",
    reason:
      "The Knauf 416889 row owns Rw only; STC, C, and Ctr remain calculated from the selected dynamic curve and rating adapters."
  },
  {
    boundaryId: "single_output_exact_rw_stays_exact",
    reason:
      "Single-output Rw keeps the measured_exact_full_stack route instead of going through the mixed companion basis."
  },
  {
    boundaryId: "field_or_building_metric_alias",
    reason:
      "Lab Rw does not become R'w, Dn,w, DnT,w, or DnT,A; field/building adapters remain separate owners."
  },
  {
    boundaryId: "numeric_retune_or_source_proximity_delta",
    reason:
      "Gate DV changes support and selected basis only; Rw, STC, C, and Ctr numeric pins do not move."
  }
] as const;

export type PostV1WallLsfExactSourceMixedMetricCompanionGateDVSummary = {
  readonly counters: typeof POST_V1_GATE_DV_COUNTERS;
  readonly exactSourceId: typeof POST_V1_GATE_DV_EXACT_SOURCE_ID;
  readonly landedGate: typeof POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_LANDED_GATE;
  readonly negativeBoundaries: typeof POST_V1_GATE_DV_NEGATIVE_BOUNDARIES;
  readonly noNumericValueMovement: true;
  readonly previousGateDU: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_LANDED_GATE;
    readonly selectedNextAction:
      typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_ACTION;
    readonly selectedNextFile:
      typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTION_STATUS;
  };
  readonly runtimeBasis: typeof POST_V1_GATE_DV_RUNTIME_BASIS;
  readonly selectedCandidateId: typeof POST_V1_GATE_DV_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction:
    typeof POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_ACTION;
  readonly selectedNextFile:
    typeof POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_FILE;
  readonly selectedNextLabel:
    typeof POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_LABEL;
  readonly selectionStatus:
    typeof POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_DV_TARGET_OUTPUTS;
};

export function summarizePostV1WallLsfExactSourceMixedMetricCompanionGateDV():
  PostV1WallLsfExactSourceMixedMetricCompanionGateDVSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_ACTION !==
    POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_LANDED_GATE
  ) {
    throw new Error("Gate DV can only land after Gate DU selects the LSF mixed-metric companion action.");
  }

  return {
    counters: POST_V1_GATE_DV_COUNTERS,
    exactSourceId: POST_V1_GATE_DV_EXACT_SOURCE_ID,
    landedGate: POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_LANDED_GATE,
    negativeBoundaries: POST_V1_GATE_DV_NEGATIVE_BOUNDARIES,
    noNumericValueMovement: true,
    previousGateDU: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_LANDED_GATE,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTION_STATUS
    },
    runtimeBasis: POST_V1_GATE_DV_RUNTIME_BASIS,
    selectedCandidateId: POST_V1_GATE_DV_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_DV_TARGET_OUTPUTS
  };
}

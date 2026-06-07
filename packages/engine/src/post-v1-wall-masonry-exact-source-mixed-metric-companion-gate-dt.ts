import type { RequestedOutputId } from "@dynecho/shared";

import {
  GATE_DT_MASONRY_EXACT_RW_CALCULATED_COMPANION_RUNTIME_METHOD,
  GATE_DT_MASONRY_EXACT_RW_CALCULATED_COMPANION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-dt-masonry-exact-source-mixed-companion";
import {
  POST_V1_GATE_DS_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_DS_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-ds";

export const POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_LANDED_GATE =
  "post_v1_wall_masonry_exact_source_mixed_metric_companion_gate_dt_plan" as const;

export const POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTION_STATUS =
  "post_v1_wall_masonry_exact_source_mixed_metric_companion_gate_dt_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_du" as const;

export const POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_du_plan" as const;

export const POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-du-contract.test.ts" as const;

export const POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage/accuracy gap Gate DU" as const;

export const POST_V1_GATE_DT_EXACT_SOURCE_ID =
  "wienerberger_porotherm_100_dense_plaster_primary_2026" as const;

export const POST_V1_GATE_DT_SELECTED_CANDIDATE_ID =
  POST_V1_GATE_DS_SELECTED_CANDIDATE_ID;

export const POST_V1_GATE_DT_TARGET_OUTPUTS = [
  ...POST_V1_GATE_DS_SELECTED_TARGET_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DT_RUNTIME_BASIS = {
  exactSourceId: POST_V1_GATE_DT_EXACT_SOURCE_ID,
  kind: "airborne_physics_prediction",
  method: GATE_DT_MASONRY_EXACT_RW_CALCULATED_COMPANION_RUNTIME_METHOD,
  origin: "family_physics_prediction",
  selectedCandidateId: GATE_DT_MASONRY_EXACT_RW_CALCULATED_COMPANION_SELECTED_CANDIDATE_ID,
  toleranceClass: "uncalibrated_prediction"
} as const;

export const POST_V1_GATE_DT_COUNTERS = {
  fieldAdapterAliasesAdded: 0,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  protectedFieldOrBuildingAliasRequestShapes: 1,
  protectedMixedCompanionRequestShapes: 1,
  runtimeBasisPromotions: 1,
  runtimeCorrectedLayerTemplates: 1,
  runtimeCorrectedRequestShapes: 1,
  runtimeValuesMoved: 0
} as const;

export const POST_V1_GATE_DT_NEGATIVE_BOUNDARIES = [
  {
    boundaryId: "no_full_exact_promotion_for_unreported_companions",
    reason:
      "The Wienerberger row owns Rw only; STC, C, and Ctr remain calculated from the selected dynamic curve and rating adapters."
  },
  {
    boundaryId: "single_output_exact_rw_stays_exact",
    reason:
      "Single-output Rw keeps the Gate DR measured_exact_full_stack route instead of going through the mixed companion basis."
  },
  {
    boundaryId: "field_or_building_metric_alias",
    reason:
      "Lab Rw does not become R'w, Dn,w, DnT,w, or DnT,A; existing field route boundaries are unchanged."
  },
  {
    boundaryId: "numeric_retune_or_source_proximity_delta",
    reason:
      "Gate DT changes selected basis/candidate only; Rw, STC, C, and Ctr pins do not move."
  }
] as const;

export type PostV1WallMasonryExactSourceMixedMetricCompanionGateDTSummary = {
  readonly counters: typeof POST_V1_GATE_DT_COUNTERS;
  readonly exactSourceId: typeof POST_V1_GATE_DT_EXACT_SOURCE_ID;
  readonly landedGate: typeof POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_LANDED_GATE;
  readonly negativeBoundaries: typeof POST_V1_GATE_DT_NEGATIVE_BOUNDARIES;
  readonly noNumericValueMovement: true;
  readonly previousGateDS: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_LANDED_GATE;
    readonly selectedNextAction:
      typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_ACTION;
    readonly selectedNextFile:
      typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTION_STATUS;
  };
  readonly runtimeBasis: typeof POST_V1_GATE_DT_RUNTIME_BASIS;
  readonly selectedCandidateId: typeof POST_V1_GATE_DT_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction:
    typeof POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_ACTION;
  readonly selectedNextFile:
    typeof POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_FILE;
  readonly selectedNextLabel:
    typeof POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_LABEL;
  readonly selectionStatus:
    typeof POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_DT_TARGET_OUTPUTS;
};

export function summarizePostV1WallMasonryExactSourceMixedMetricCompanionGateDT():
  PostV1WallMasonryExactSourceMixedMetricCompanionGateDTSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_ACTION !==
    POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_LANDED_GATE
  ) {
    throw new Error("Gate DT can only land after Gate DS selects the masonry mixed-metric companion action.");
  }

  return {
    counters: POST_V1_GATE_DT_COUNTERS,
    exactSourceId: POST_V1_GATE_DT_EXACT_SOURCE_ID,
    landedGate: POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_LANDED_GATE,
    negativeBoundaries: POST_V1_GATE_DT_NEGATIVE_BOUNDARIES,
    noNumericValueMovement: true,
    previousGateDS: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_LANDED_GATE,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTION_STATUS
    },
    runtimeBasis: POST_V1_GATE_DT_RUNTIME_BASIS,
    selectedCandidateId: POST_V1_GATE_DT_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_DT_TARGET_OUTPUTS
  };
}

import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_GATE_DQ_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_DQ_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-dq";

export const POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_LANDED_GATE =
  "post_v1_wall_exact_source_zero_delta_basis_gate_dr_plan" as const;

export const POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTION_STATUS =
  "post_v1_wall_exact_source_zero_delta_basis_gate_dr_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_ds" as const;

export const POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_ds_plan" as const;

export const POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ds-contract.test.ts" as const;

export const POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage/accuracy gap Gate DS" as const;

export const POST_V1_GATE_DR_SELECTED_CANDIDATE_ID =
  POST_V1_GATE_DQ_SELECTED_CANDIDATE_ID;

export const POST_V1_GATE_DR_TARGET_OUTPUTS = [
  ...POST_V1_GATE_DQ_SELECTED_TARGET_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DR_EXACT_SOURCE_ID =
  "wienerberger_porotherm_100_dense_plaster_primary_2026" as const;

export const POST_V1_GATE_DR_RUNTIME_BASIS = {
  exactSourceId: POST_V1_GATE_DR_EXACT_SOURCE_ID,
  kind: "airborne_measured_exact",
  method: "verified_airborne_catalog_exact_match",
  origin: "measured_exact_full_stack",
  selectedCandidateId: "candidate_blocked_rockwool_exact_source",
  toleranceClass: "exact_source"
} as const;

export const POST_V1_GATE_DR_COUNTERS = {
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

export const POST_V1_GATE_DR_NEGATIVE_BOUNDARIES = [
  {
    boundaryId: "mixed_metric_companion_scope",
    reason: "The exact catalog row owns Rw only; mixed Rw/STC/C/Ctr requests keep their calculated companions and screening basis until a separate mixed owner exists."
  },
  {
    boundaryId: "field_or_building_metric_alias",
    reason: "Lab Rw does not become R'w, Dn,w, DnT,w, or DnT,A; field/building adapters remain separate route owners."
  },
  {
    boundaryId: "numeric_retune_or_anchor_delta",
    reason: "Gate DR moves answer basis/candidate only; masonry Rw stays pinned at 43 dB and no dB delta is applied."
  },
  {
    boundaryId: "lsf_field_input_surface",
    reason: "LSF field lab-fallback anchoring remains available only when its required airtightness and field context inputs are supplied."
  },
  {
    boundaryId: "floor_ci_or_astm_alias",
    reason: "Floor CI / Ln,w+CI and ASTM IIC / AIIC ownership are not opened by this wall exact-source basis repair."
  }
] as const;

export type PostV1WallExactSourceZeroDeltaBasisGateDRSummary = {
  readonly counters: typeof POST_V1_GATE_DR_COUNTERS;
  readonly exactSourceId: typeof POST_V1_GATE_DR_EXACT_SOURCE_ID;
  readonly landedGate: typeof POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_LANDED_GATE;
  readonly negativeBoundaries: typeof POST_V1_GATE_DR_NEGATIVE_BOUNDARIES;
  readonly noNumericValueMovement: true;
  readonly previousGateDQ: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTION_STATUS;
  };
  readonly runtimeBasis: typeof POST_V1_GATE_DR_RUNTIME_BASIS;
  readonly selectedCandidateId: typeof POST_V1_GATE_DR_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_DR_TARGET_OUTPUTS;
};

export function summarizePostV1WallExactSourceZeroDeltaBasisGateDR():
  PostV1WallExactSourceZeroDeltaBasisGateDRSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_ACTION !==
    POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_LANDED_GATE
  ) {
    throw new Error("Gate DR can only land after Gate DQ selects the wall exact-source zero-delta basis action.");
  }

  return {
    counters: POST_V1_GATE_DR_COUNTERS,
    exactSourceId: POST_V1_GATE_DR_EXACT_SOURCE_ID,
    landedGate: POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_LANDED_GATE,
    negativeBoundaries: POST_V1_GATE_DR_NEGATIVE_BOUNDARIES,
    noNumericValueMovement: true,
    previousGateDQ: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_LANDED_GATE,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTION_STATUS
    },
    runtimeBasis: POST_V1_GATE_DR_RUNTIME_BASIS,
    selectedCandidateId: POST_V1_GATE_DR_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_WALL_EXACT_SOURCE_ZERO_DELTA_BASIS_GATE_DR_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_DR_TARGET_OUTPUTS
  };
}

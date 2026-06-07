import type { RequestedOutputId } from "@dynecho/shared";

import {
  GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD,
  GATE_H_CLT_MASS_TIMBER_WALL_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-h-lined-masonry-clt";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD,
  GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-y-clt-mass-timber-ctr-spectrum-adapter";
import {
  POST_V1_GATE_DO_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-do";

export const POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_LANDED_GATE =
  "post_v1_wall_clt_laminated_leaf_runtime_basis_gate_dp_plan" as const;

export const POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTION_STATUS =
  "post_v1_wall_clt_laminated_leaf_runtime_basis_gate_dp_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_dq" as const;

export const POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_dq_plan" as const;

export const POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dq-contract.test.ts" as const;

export const POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage/accuracy gap Gate DQ" as const;

export const POST_V1_GATE_DP_SELECTED_CANDIDATE_ID =
  POST_V1_GATE_DO_SELECTED_CANDIDATE_ID;

export const POST_V1_GATE_DP_TARGET_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DP_LAB_RUNTIME_BASIS = {
  kind: "airborne_physics_prediction",
  method: GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD,
  origin: "family_physics_prediction",
  parentMethod: GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD,
  parentSelectedCandidateId: GATE_H_CLT_MASS_TIMBER_WALL_SELECTED_CANDIDATE_ID,
  selectedCandidateId: GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID,
  toleranceClass: "uncalibrated_prediction"
} as const;

export const POST_V1_GATE_DP_FIELD_RUNTIME_BASIS = {
  kind: "airborne_physics_prediction",
  method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  origin: "family_physics_prediction",
  selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
  toleranceClass: "uncalibrated_prediction"
} as const;

export const POST_V1_GATE_DP_COUNTERS = {
  fieldAdapterAliasesAdded: 0,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  protectedRuntimePins: 8,
  runtimeBasisPromotions: 1,
  runtimeCorrectedLayerTemplates: 1,
  runtimeCorrectedRequestShapes: 8,
  runtimeValuesMoved: 0
} as const;

export const POST_V1_GATE_DP_NEGATIVE_BOUNDARIES = [
  {
    boundaryId: "direct_value_retune",
    reason: "Gate DP changes the selected basis/candidate only; CLT lab and field numbers stay pinned."
  },
  {
    boundaryId: "exact_or_floor_source_promotion",
    reason: "Dataholz CLT floor rows and wall source-pack leads do not become same-stack wall exact truth."
  },
  {
    boundaryId: "stc_fstc_astc_context_alias",
    reason: "WoodWorks/NRC STC, FSTC, ASTC, or IIC context does not alias into ISO wall Rw/R'w/DnT,w."
  },
  {
    boundaryId: "field_or_building_metric_alias",
    reason: "Explicit field outputs must use Gate I; lab Rw is not relabelled as field R'w or DnT,w."
  },
  {
    boundaryId: "ordinary_laminated_leaf_or_nlt",
    reason: "Gypsum-only laminated leaves, plywood/NLT/DLT timber boards, and non-CLT panel leaves do not enter the CLT owner."
  },
  {
    boundaryId: "double_leaf_or_grouped_multicavity",
    reason: "CLT double-leaf, stud/framed, lined massive, and grouped multicavity routes keep their existing owners."
  }
] as const;

export type PostV1WallCltLaminatedLeafRuntimeBasisGateDPSummary = {
  readonly counters: typeof POST_V1_GATE_DP_COUNTERS;
  readonly fieldRuntimeBasis: typeof POST_V1_GATE_DP_FIELD_RUNTIME_BASIS;
  readonly labRuntimeBasis: typeof POST_V1_GATE_DP_LAB_RUNTIME_BASIS;
  readonly landedGate: typeof POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_LANDED_GATE;
  readonly negativeBoundaries: typeof POST_V1_GATE_DP_NEGATIVE_BOUNDARIES;
  readonly noNumericValueMovement: true;
  readonly previousGateDO: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTION_STATUS;
  };
  readonly selectedCandidateId: typeof POST_V1_GATE_DP_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_DP_TARGET_OUTPUTS;
};

export function summarizePostV1WallCltLaminatedLeafRuntimeBasisGateDP():
  PostV1WallCltLaminatedLeafRuntimeBasisGateDPSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_ACTION !==
    POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_LANDED_GATE
  ) {
    throw new Error("Gate DP can only land after Gate DO selects the CLT laminated-leaf runtime-basis action.");
  }

  return {
    counters: POST_V1_GATE_DP_COUNTERS,
    fieldRuntimeBasis: POST_V1_GATE_DP_FIELD_RUNTIME_BASIS,
    labRuntimeBasis: POST_V1_GATE_DP_LAB_RUNTIME_BASIS,
    landedGate: POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_LANDED_GATE,
    negativeBoundaries: POST_V1_GATE_DP_NEGATIVE_BOUNDARIES,
    noNumericValueMovement: true,
    previousGateDO: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_LANDED_GATE,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTION_STATUS
    },
    selectedCandidateId: POST_V1_GATE_DP_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_DP_TARGET_OUTPUTS
  };
}

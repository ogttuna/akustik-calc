import type { RequestedOutputId } from "@dynecho/shared";

import {
  GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD,
  GATE_H_LINED_MASSIVE_WALL_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-h-lined-masonry-clt";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  POST_V1_GATE_DF_BOUNDED_RULE_OWNER_CANDIDATE_ID,
  POST_V1_GATE_DF_FIELD_ADAPTER_OUTPUTS,
  POST_V1_GATE_DF_LAB_BOUNDED_OUTPUTS,
  POST_V1_GATE_DF_NEGATIVE_BOUNDARIES,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_LANDED_GATE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_ACTION,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_FILE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTION_STATUS
} from "./post-v1-wall-heavy-core-lined-massive-bounded-rule-gate-df";

export const POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_LANDED_GATE =
  "post_v1_wall_heavy_core_lined_massive_bounded_runtime_basis_gate_dg_plan" as const;

export const POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTION_STATUS =
  "post_v1_wall_heavy_core_lined_massive_bounded_runtime_basis_gate_dg_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_dh" as const;

export const POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_dh_plan" as const;

export const POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dh-contract.test.ts" as const;

export const POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage/accuracy gap Gate DH" as const;

export const POST_V1_GATE_DG_SELECTED_CANDIDATE_ID =
  POST_V1_GATE_DF_BOUNDED_RULE_OWNER_CANDIDATE_ID;

export const POST_V1_GATE_DG_TARGET_OUTPUTS = [
  ...POST_V1_GATE_DF_LAB_BOUNDED_OUTPUTS,
  ...POST_V1_GATE_DF_FIELD_ADAPTER_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DG_LAB_RUNTIME_BASIS = {
  kind: "airborne_bound",
  method: GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD,
  origin: "bounded_prediction",
  selectedCandidateId: GATE_H_LINED_MASSIVE_WALL_SELECTED_CANDIDATE_ID,
  toleranceClass: "bounded_prediction"
} as const;

export const POST_V1_GATE_DG_FIELD_RUNTIME_BASIS = {
  kind: "airborne_physics_prediction",
  method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  origin: "family_physics_prediction",
  selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
  toleranceClass: "uncalibrated_prediction"
} as const;

export const POST_V1_GATE_DG_COUNTERS = {
  boundedRuntimeBasisPromotions: 1,
  fieldAdapterAliasesAdded: 0,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  protectedRuntimePins: 8,
  runtimeValuesMoved: 0
} as const;

export type PostV1WallHeavyCoreLinedMassiveBoundedRuntimeBasisGateDGSummary = {
  readonly counters: typeof POST_V1_GATE_DG_COUNTERS;
  readonly fieldRuntimeBasis: typeof POST_V1_GATE_DG_FIELD_RUNTIME_BASIS;
  readonly labRuntimeBasis: typeof POST_V1_GATE_DG_LAB_RUNTIME_BASIS;
  readonly landedGate: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_LANDED_GATE;
  readonly negativeBoundaries: typeof POST_V1_GATE_DF_NEGATIVE_BOUNDARIES;
  readonly noNumericValueMovement: true;
  readonly previousGateDF: {
    readonly landedGate: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTION_STATUS;
  };
  readonly selectedCandidateId: typeof POST_V1_GATE_DG_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_DG_TARGET_OUTPUTS;
};

export function summarizePostV1WallHeavyCoreLinedMassiveBoundedRuntimeBasisGateDG():
  PostV1WallHeavyCoreLinedMassiveBoundedRuntimeBasisGateDGSummary {
  if (
    POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_ACTION !==
    POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_LANDED_GATE
  ) {
    throw new Error("Gate DG can only land after Gate DF selects the bounded runtime-basis action.");
  }

  return {
    counters: POST_V1_GATE_DG_COUNTERS,
    fieldRuntimeBasis: POST_V1_GATE_DG_FIELD_RUNTIME_BASIS,
    labRuntimeBasis: POST_V1_GATE_DG_LAB_RUNTIME_BASIS,
    landedGate: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_LANDED_GATE,
    negativeBoundaries: POST_V1_GATE_DF_NEGATIVE_BOUNDARIES,
    noNumericValueMovement: true,
    previousGateDF: {
      landedGate: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_LANDED_GATE,
      selectedNextAction: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTION_STATUS
    },
    selectedCandidateId: POST_V1_GATE_DG_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_DG_TARGET_OUTPUTS
  };
}

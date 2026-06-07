import type { RequestedOutputId } from "@dynecho/shared";

import {
  GATE_DN_TIMBER_STUD_BOUNDED_RUNTIME_METHOD,
  GATE_DN_TIMBER_STUD_BOUNDED_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-dn-timber-stud-bounded";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  POST_V1_GATE_DM_BOUNDED_RULE_OWNER_CANDIDATE_ID,
  POST_V1_GATE_DM_FIELD_ADAPTER_OUTPUTS,
  POST_V1_GATE_DM_LAB_BOUNDED_OUTPUTS,
  POST_V1_GATE_DM_NEGATIVE_BOUNDARIES,
  POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_LANDED_GATE,
  POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTED_NEXT_ACTION,
  POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTED_NEXT_FILE,
  POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTION_STATUS
} from "./post-v1-wall-timber-stud-bounded-rule-gate-dm";

export const POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_LANDED_GATE =
  "post_v1_wall_timber_stud_bounded_runtime_basis_gate_dn_plan" as const;

export const POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTION_STATUS =
  "post_v1_wall_timber_stud_bounded_runtime_basis_gate_dn_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_do" as const;

export const POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_do_plan" as const;

export const POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-do-contract.test.ts" as const;

export const POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage/accuracy gap Gate DO" as const;

export const POST_V1_GATE_DN_SELECTED_CANDIDATE_ID =
  POST_V1_GATE_DM_BOUNDED_RULE_OWNER_CANDIDATE_ID;

export const POST_V1_GATE_DN_TARGET_OUTPUTS = [
  ...POST_V1_GATE_DM_LAB_BOUNDED_OUTPUTS,
  ...POST_V1_GATE_DM_FIELD_ADAPTER_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DN_LAB_RUNTIME_BASIS = {
  kind: "airborne_bound",
  method: GATE_DN_TIMBER_STUD_BOUNDED_RUNTIME_METHOD,
  origin: "bounded_prediction",
  selectedCandidateId: GATE_DN_TIMBER_STUD_BOUNDED_SELECTED_CANDIDATE_ID,
  toleranceClass: "bounded_prediction"
} as const;

export const POST_V1_GATE_DN_FIELD_RUNTIME_BASIS = {
  kind: "airborne_physics_prediction",
  method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  origin: "family_physics_prediction",
  selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
  toleranceClass: "uncalibrated_prediction"
} as const;

export const POST_V1_GATE_DN_COUNTERS = {
  boundedRuntimeBasisPromotions: 1,
  fieldAdapterAliasesAdded: 0,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  protectedRuntimePins: 8,
  runtimeValuesMoved: 0
} as const;

export type PostV1WallTimberStudBoundedRuntimeBasisGateDNSummary = {
  readonly counters: typeof POST_V1_GATE_DN_COUNTERS;
  readonly fieldRuntimeBasis: typeof POST_V1_GATE_DN_FIELD_RUNTIME_BASIS;
  readonly labRuntimeBasis: typeof POST_V1_GATE_DN_LAB_RUNTIME_BASIS;
  readonly landedGate: typeof POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_LANDED_GATE;
  readonly negativeBoundaries: typeof POST_V1_GATE_DM_NEGATIVE_BOUNDARIES;
  readonly noNumericValueMovement: true;
  readonly previousGateDM: {
    readonly landedGate: typeof POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTION_STATUS;
  };
  readonly selectedCandidateId: typeof POST_V1_GATE_DN_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_DN_TARGET_OUTPUTS;
};

export function summarizePostV1WallTimberStudBoundedRuntimeBasisGateDN():
  PostV1WallTimberStudBoundedRuntimeBasisGateDNSummary {
  if (
    POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTED_NEXT_ACTION !==
    POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_LANDED_GATE
  ) {
    throw new Error("Gate DN can only land after Gate DM selects the timber-stud bounded runtime-basis action.");
  }

  return {
    counters: POST_V1_GATE_DN_COUNTERS,
    fieldRuntimeBasis: POST_V1_GATE_DN_FIELD_RUNTIME_BASIS,
    labRuntimeBasis: POST_V1_GATE_DN_LAB_RUNTIME_BASIS,
    landedGate: POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_LANDED_GATE,
    negativeBoundaries: POST_V1_GATE_DM_NEGATIVE_BOUNDARIES,
    noNumericValueMovement: true,
    previousGateDM: {
      landedGate: POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_LANDED_GATE,
      selectedNextAction: POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTION_STATUS
    },
    selectedCandidateId: POST_V1_GATE_DN_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_DN_TARGET_OUTPUTS
  };
}

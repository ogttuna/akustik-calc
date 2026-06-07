import type { RequestedOutputId } from "@dynecho/shared";

import {
  GATE_DX_EXACT_SOURCE_FAMILY_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_DX_EXACT_SOURCE_FAMILY_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-dx-exact-source-family-field-context";
import {
  POST_V1_GATE_DW_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_DW_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-dw";

export const POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_LANDED_GATE =
  "post_v1_wall_exact_source_field_context_basis_gate_dx_plan" as const;

export const POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTION_STATUS =
  "post_v1_wall_exact_source_field_context_basis_gate_dx_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_dy" as const;

export const POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_dy_plan" as const;

export const POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dy-contract.test.ts" as const;

export const POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage/accuracy gap Gate DY" as const;

export const POST_V1_GATE_DX_SELECTED_CANDIDATE_ID =
  POST_V1_GATE_DW_SELECTED_CANDIDATE_ID;

export const POST_V1_GATE_DX_RUNTIME_SELECTED_CANDIDATE_ID =
  GATE_DX_EXACT_SOURCE_FAMILY_FIELD_CONTEXT_SELECTED_CANDIDATE_ID;

export const POST_V1_GATE_DX_TARGET_OUTPUTS = [
  ...POST_V1_GATE_DW_SELECTED_TARGET_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DX_VALUE_PINS = [
  {
    family: "masonry_nonhomogeneous",
    generatedCaseId: "wall-masonry-brick",
    metrics: {
      "Dn,w": 40,
      "DnT,A": 41.3,
      "DnT,w": 42,
      "R'w": 40
    }
  },
  {
    family: "stud_wall_system",
    generatedCaseId: "wall-lsf-knauf",
    metrics: {
      "Dn,w": 51,
      "DnT,A": 51.1,
      "DnT,w": 52,
      "R'w": 51
    }
  }
] as const;

export const POST_V1_GATE_DX_RUNTIME_BASIS = {
  kind: "airborne_physics_prediction",
  method: GATE_DX_EXACT_SOURCE_FAMILY_FIELD_CONTEXT_RUNTIME_METHOD,
  origin: "family_physics_prediction",
  selectedCandidateId: POST_V1_GATE_DX_RUNTIME_SELECTED_CANDIDATE_ID,
  toleranceClass: "uncalibrated_prediction"
} as const;

export const POST_V1_GATE_DX_COUNTERS = {
  fieldAdapterAliasesAdded: 0,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  protectedExactAnchorRequestShapes: 2,
  protectedLabRequestShapes: 2,
  protectedNeedsInputRequestShapes: 1,
  runtimeBasisPromotions: 2,
  runtimeCorrectedLayerTemplates: 2,
  runtimeCorrectedRequestShapes: 8,
  runtimeValuesMoved: 0
} as const;

export const POST_V1_GATE_DX_NEGATIVE_BOUNDARIES = [
  {
    boundaryId: "explicit_lab_anchor_field_delta_precedence",
    reason:
      "When explicit airtightness makes a compatible lab-anchor field delta available, the anchored route keeps precedence over Gate DX."
  },
  {
    boundaryId: "lab_metric_alias",
    reason:
      "Gate DX does not use lab Rw as R'w, Dn,w, or DnT,w; field outputs remain calculated from the dynamic curve and explicit field context."
  },
  {
    boundaryId: "unrelated_family_widening",
    reason:
      "Timber-stud and CLT field contexts already select their own Gate I/Gate DN/Gate DP owners and are not remapped to Gate DX."
  },
  {
    boundaryId: "missing_multicavity_topology",
    reason:
      "Held-AAC multicavity-style flat lists still need explicit grouped support/topology inputs before field/building outputs can publish."
  }
] as const;

export type PostV1WallExactSourceFieldContextBasisGateDXSummary = {
  readonly counters: typeof POST_V1_GATE_DX_COUNTERS;
  readonly landedGate: typeof POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_LANDED_GATE;
  readonly negativeBoundaries: typeof POST_V1_GATE_DX_NEGATIVE_BOUNDARIES;
  readonly noNumericValueMovement: true;
  readonly previousGateDW: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTION_STATUS;
  };
  readonly runtimeBasis: typeof POST_V1_GATE_DX_RUNTIME_BASIS;
  readonly selectedCandidateId: typeof POST_V1_GATE_DX_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction:
    typeof POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_ACTION;
  readonly selectedNextFile:
    typeof POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_FILE;
  readonly selectedNextLabel:
    typeof POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_LABEL;
  readonly selectionStatus:
    typeof POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_DX_TARGET_OUTPUTS;
  readonly valuePins: typeof POST_V1_GATE_DX_VALUE_PINS;
};

export function summarizePostV1WallExactSourceFieldContextBasisGateDX():
  PostV1WallExactSourceFieldContextBasisGateDXSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_ACTION !==
    POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_LANDED_GATE
  ) {
    throw new Error("Gate DX can only land after Gate DW selects the wall field-context basis action.");
  }

  return {
    counters: POST_V1_GATE_DX_COUNTERS,
    landedGate: POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_LANDED_GATE,
    negativeBoundaries: POST_V1_GATE_DX_NEGATIVE_BOUNDARIES,
    noNumericValueMovement: true,
    previousGateDW: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_LANDED_GATE,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTION_STATUS
    },
    runtimeBasis: POST_V1_GATE_DX_RUNTIME_BASIS,
    selectedCandidateId: POST_V1_GATE_DX_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_DX_TARGET_OUTPUTS,
    valuePins: POST_V1_GATE_DX_VALUE_PINS
  };
}

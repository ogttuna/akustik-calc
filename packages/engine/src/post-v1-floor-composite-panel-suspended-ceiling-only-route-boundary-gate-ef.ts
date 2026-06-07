import type { RequestedOutputId } from "@dynecho/shared";

import {
  COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS,
  COMPOSITE_PANEL_PUBLISHED_INTERACTION_SELECTED_CANDIDATE_ID
} from "./composite-panel-published-interaction-runtime-constants";
import {
  POST_V1_GATE_EE_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_EE_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-ee";

export const POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_LANDED_GATE =
  "post_v1_floor_composite_panel_suspended_ceiling_only_route_boundary_gate_ef_plan" as const;

export const POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTION_STATUS =
  "post_v1_floor_composite_panel_suspended_ceiling_only_route_boundary_gate_ef_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_eg" as const;

export const POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_eg_plan" as const;

export const POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-eg-contract.test.ts" as const;

export const POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage/accuracy gap Gate EG" as const;

export const POST_V1_GATE_EF_SELECTED_CANDIDATE_ID =
  POST_V1_GATE_EE_SELECTED_CANDIDATE_ID;

export const POST_V1_GATE_EF_RUNTIME_SELECTED_CANDIDATE_ID =
  COMPOSITE_PANEL_PUBLISHED_INTERACTION_SELECTED_CANDIDATE_ID;

export const POST_V1_GATE_EF_TARGET_OUTPUTS = [
  ...POST_V1_GATE_EE_SELECTED_TARGET_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_EF_ROUTE_BRANCH =
  "published_interaction_route_pinned" as const;

export const POST_V1_GATE_EF_VISIBLE_STACK_EXPECTATION = {
  basis: COMPOSITE_PANEL_PUBLISHED_INTERACTION_ESTIMATE_BASIS,
  deltaLwDb: 20.7,
  id: "visible_composite_suspended_ceiling_only_published_interaction_route",
  lnWDb: 63.3,
  routeBranch: POST_V1_GATE_EF_ROUTE_BRANCH,
  runtimeSelectedCandidateId: POST_V1_GATE_EF_RUNTIME_SELECTED_CANDIDATE_ID,
  rwDb: 48.6,
  sourceRowsImportedForGate: 0,
  supportedOutputs: POST_V1_GATE_EF_TARGET_OUTPUTS
} as const;

export const POST_V1_GATE_EF_COUNTERS = {
  astmAliasesPromoted: 0,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  routeBoundaryLedgersPinned: 1,
  runtimeBasisPromotions: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0,
  staleLowConfidenceParityRowsCorrected: 1
} as const;

export const POST_V1_GATE_EF_NEGATIVE_BOUNDARIES = [
  {
    boundaryId: "formula_retune",
    reason:
      "Gate EF pins the current Gate CY published-interaction route and does not change composite-panel numeric coefficients."
  },
  {
    boundaryId: "source_row_import",
    reason:
      "Gate EF imports no rows; it reconciles a route boundary for an already-owned PMC-family estimate."
  },
  {
    boundaryId: "generic_lower_treatment_delta_lw",
    reason:
      "Open-web, hollow-core, steel, Pliteq, and Knauf lower-treatment changes remain outside this composite-panel owner."
  },
  {
    boundaryId: "astm_alias",
    reason:
      "ISO DeltaLw still does not publish ASTM IIC or AIIC without ASTM E492/E1007 owners."
  }
] as const;

export type PostV1FloorCompositePanelSuspendedCeilingOnlyRouteBoundaryGateEFSummary = {
  readonly counters: typeof POST_V1_GATE_EF_COUNTERS;
  readonly landedGate:
    typeof POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_LANDED_GATE;
  readonly negativeBoundaries: typeof POST_V1_GATE_EF_NEGATIVE_BOUNDARIES;
  readonly noNumericValueMovement: true;
  readonly previousGateEE: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTION_STATUS;
  };
  readonly routeBranch: typeof POST_V1_GATE_EF_ROUTE_BRANCH;
  readonly selectedCandidateId: typeof POST_V1_GATE_EF_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction:
    typeof POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_ACTION;
  readonly selectedNextFile:
    typeof POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_FILE;
  readonly selectedNextLabel:
    typeof POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_LABEL;
  readonly selectionStatus:
    typeof POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_EF_TARGET_OUTPUTS;
  readonly visibleStackExpectation: typeof POST_V1_GATE_EF_VISIBLE_STACK_EXPECTATION;
};

export function summarizePostV1FloorCompositePanelSuspendedCeilingOnlyRouteBoundaryGateEF():
  PostV1FloorCompositePanelSuspendedCeilingOnlyRouteBoundaryGateEFSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_ACTION !==
    POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_LANDED_GATE
  ) {
    throw new Error("Gate EF can only land after Gate EE selects the composite-panel route boundary.");
  }

  return {
    counters: POST_V1_GATE_EF_COUNTERS,
    landedGate: POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_LANDED_GATE,
    negativeBoundaries: POST_V1_GATE_EF_NEGATIVE_BOUNDARIES,
    noNumericValueMovement: true,
    previousGateEE: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_LANDED_GATE,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EE_SELECTION_STATUS
    },
    routeBranch: POST_V1_GATE_EF_ROUTE_BRANCH,
    selectedCandidateId: POST_V1_GATE_EF_SELECTED_CANDIDATE_ID,
    selectedNextAction:
      POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_FILE,
    selectedNextLabel:
      POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTED_NEXT_LABEL,
    selectionStatus:
      POST_V1_FLOOR_COMPOSITE_PANEL_SUSPENDED_CEILING_ONLY_ROUTE_BOUNDARY_GATE_EF_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_EF_TARGET_OUTPUTS,
    visibleStackExpectation: POST_V1_GATE_EF_VISIBLE_STACK_EXPECTATION
  };
}

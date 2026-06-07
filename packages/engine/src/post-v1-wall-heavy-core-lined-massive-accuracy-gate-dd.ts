import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_GATE_DC_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-dc";

export const POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_LANDED_GATE =
  "post_v1_wall_heavy_core_lined_massive_accuracy_gate_dd_plan" as const;

export const POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTION_STATUS =
  "post_v1_wall_heavy_core_lined_massive_accuracy_gate_dd_landed_no_runtime_selected_next_numeric_coverage_gap_gate_de" as const;

export const POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_de_plan" as const;

export const POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-de-contract.test.ts" as const;

export const POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate DE" as const;

export const POST_V1_GATE_DD_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md" as const;

export const POST_V1_GATE_DD_SELECTED_CANDIDATE_ID =
  POST_V1_GATE_DC_SELECTED_CANDIDATE_ID;

export const POST_V1_GATE_DD_TARGET_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DD_LIVE_ROUTE_PINS = {
  basisPosture: "source_absent_screening_until_wall_source_or_bounded_lining_rule",
  dynamicFamily: "lined_massive_wall",
  generatedCaseId: "wall-screening-concrete",
  labPins: {
    C: -1.6,
    Ctr: -6.5,
    Rw: 57,
    STC: 57
  },
  fieldPins: {
    C: -1.6,
    Ctr: -6.3,
    DnTADb: 54.9,
    DnTwDb: 56,
    DnWDb: 55,
    RwPrimeDb: 55,
    STC: 55
  },
  routeStrategy: "lined_massive_blend",
  selectedMethod: "mass_law"
} as const;

export type PostV1GateDDEvidenceBoundaryId =
  | "current_source_absent_lined_massive_route"
  | "verified_airborne_catalog_exact_or_lab_fallback"
  | "knauf_cc60_concrete_floor_rows"
  | "manufacturer_lining_adjacent_context"
  | "selector_pins_and_deep_hybrid_heavy_core_guards"
  | "workbench_concrete_wall_preset"
  | "iso_sharp_davy_formula_context"
  | "closed_wall_heavy_core_gate_b_audit";

export type PostV1GateDDEvidenceBoundary = {
  readonly id: PostV1GateDDEvidenceBoundaryId;
  readonly evidencePaths: readonly string[];
  readonly reasonRuntimeCannotMove: readonly string[];
  readonly runtimeMovementAllowedNow: false;
};

export const POST_V1_GATE_DD_EVIDENCE_BOUNDARIES = [
  {
    id: "current_source_absent_lined_massive_route",
    evidencePaths: [
      "packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts",
      "packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts",
      "packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts"
    ],
    reasonRuntimeCannotMove: [
      "the live wall-screening-concrete route calculates through the source-absent lined_massive_wall family",
      "its lab and field pins are executable current behavior, not a same-basis calibration holdout",
      "no named topology-specific single-number tolerance owner exists for this heavy-core lined stack"
    ],
    runtimeMovementAllowedNow: false
  },
  {
    id: "verified_airborne_catalog_exact_or_lab_fallback",
    evidencePaths: [
      "packages/engine/src/airborne-verified-catalog.ts",
      "packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts"
    ],
    reasonRuntimeCannotMove: [
      "the live stack has no verified airborne exact match",
      "the live field context has no verified lab fallback match",
      "exact source precedence remains available only when route, topology, stack, metric, and basis match"
    ],
    runtimeMovementAllowedNow: false
  },
  {
    id: "knauf_cc60_concrete_floor_rows",
    evidencePaths: [
      "packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts",
      "packages/catalogs/src/index.ts"
    ],
    reasonRuntimeCannotMove: [
      "the Knauf CC60 rows are floor-system source truth with floor covering and ceiling roles",
      "their floor airborne and impact ratings do not define a wall-lining Rw tolerance",
      "floor ceiling mounting roles do not match wall lining topology"
    ],
    runtimeMovementAllowedNow: false
  },
  {
    id: "manufacturer_lining_adjacent_context",
    evidencePaths: [
      "packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts",
      "docs/calculator/SLICE_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_PLAN.md"
    ],
    reasonRuntimeCannotMove: [
      "manufacturer wall-lining context is relevant but not imported for the live stack",
      "side order, mounting, coupling, and boundary metadata are not complete for runtime import",
      "no source tolerance owner and paired negative boundaries are named"
    ],
    runtimeMovementAllowedNow: false
  },
  {
    id: "selector_pins_and_deep_hybrid_heavy_core_guards",
    evidencePaths: [
      "packages/engine/src/dynamic-airborne-wall-selector-value-pins.test.ts",
      "packages/engine/src/dynamic-airborne-deep-hybrid-swap-heavy-core.test.ts"
    ],
    reasonRuntimeCannotMove: [
      "selector value pins are drift guards rather than source rows",
      "deep-hybrid rows are family stability boundaries rather than direct wall-lining imports",
      "nearby green tests do not name a runtime tolerance owner"
    ],
    runtimeMovementAllowedNow: false
  },
  {
    id: "workbench_concrete_wall_preset",
    evidencePaths: [
      "apps/web/features/workbench/wall-field-continuation-completeness-matrix.test.ts"
    ],
    reasonRuntimeCannotMove: [
      "the workbench preset is a visible input surface rather than source truth",
      "preset values do not define import tolerance for the generated wall-screening-concrete route",
      "frontend agents are active elsewhere, so Gate DD cannot depend on UI copy or preset changes"
    ],
    runtimeMovementAllowedNow: false
  },
  {
    id: "iso_sharp_davy_formula_context",
    evidencePaths: [
      "packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts",
      "packages/engine/src/dynamic-airborne-framed-wall.ts"
    ],
    reasonRuntimeCannotMove: [
      "ISO 12354 and ISO 717 define estimation or rating framework context, not a stack-specific source row",
      "Sharp/Davy context is relevant but has not been translated into a bounded lined-massive wall rule",
      "local formula components remain the current screening solver parts rather than a new calibration owner"
    ],
    runtimeMovementAllowedNow: false
  },
  {
    id: "closed_wall_heavy_core_gate_b_audit",
    evidencePaths: [
      "packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts",
      "docs/calculator/SLICE_WALL_HEAVY_CORE_CONCRETE_TIGHTENING_PLAN.md"
    ],
    reasonRuntimeCannotMove: [
      "the prior Gate B audit closed no-runtime and remains baseline context",
      "screening-to-formula transition still needs a new source row or bounded lining rule",
      "old personal-use slice evidence does not reopen runtime value movement by itself"
    ],
    runtimeMovementAllowedNow: false
  }
] as const satisfies readonly PostV1GateDDEvidenceBoundary[];

export const POST_V1_GATE_DD_UNLOCK_REQUIREMENTS = [
  "wall_specific_same_stack_source_row_with_route_topology_metric_basis_and_locator",
  "or_named_bounded_lined_massive_wall_rule_with_coefficient_scope_tolerance_and_negative_boundaries",
  "paired_lab_field_building_basis_tests_before_any_Rw_RPrime_Dn_or_DnT_value_moves",
  "floor_rows_presets_selector_pins_and_deep_hybrid_guards_remain_non_promotable"
] as const;

export const POST_V1_GATE_DD_NO_RUNTIME_COUNTERS = {
  boundedLiningRulesPromoted: 0,
  directSourceRowsPromoted: 0,
  evidenceBoundariesPinned: POST_V1_GATE_DD_EVIDENCE_BOUNDARIES.length,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  protectedRuntimePins: 8,
  runtimeValuesMoved: 0,
  selectedNextRuntimeValuesMoved: 0
} as const;

export type PostV1GateDDSummary = {
  readonly evidenceBoundaries: typeof POST_V1_GATE_DD_EVIDENCE_BOUNDARIES;
  readonly landedGate: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_LANDED_GATE;
  readonly liveRoutePins: typeof POST_V1_GATE_DD_LIVE_ROUTE_PINS;
  readonly noRuntimeCounters: typeof POST_V1_GATE_DD_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_DD_PLAN_DOC_PATH;
  readonly previousGateDC: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTION_STATUS;
  };
  readonly selectedCandidateId: typeof POST_V1_GATE_DD_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_DD_TARGET_OUTPUTS;
  readonly unlockRequirements: typeof POST_V1_GATE_DD_UNLOCK_REQUIREMENTS;
};

export function summarizePostV1WallHeavyCoreLinedMassiveAccuracyGateDD(): PostV1GateDDSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_ACTION !==
    POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_LANDED_GATE
  ) {
    throw new Error("Gate DD can only land after Gate DC selects heavy-core / lined-massive accuracy.");
  }

  return {
    evidenceBoundaries: POST_V1_GATE_DD_EVIDENCE_BOUNDARIES,
    landedGate: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_LANDED_GATE,
    liveRoutePins: POST_V1_GATE_DD_LIVE_ROUTE_PINS,
    noRuntimeCounters: POST_V1_GATE_DD_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_DD_PLAN_DOC_PATH,
    previousGateDC: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_LANDED_GATE,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTION_STATUS
    },
    selectedCandidateId: POST_V1_GATE_DD_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_DD_TARGET_OUTPUTS,
    unlockRequirements: POST_V1_GATE_DD_UNLOCK_REQUIREMENTS
  };
}

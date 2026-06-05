import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_LANDED_GATE,
  POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_ACTION,
  POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_FILE,
  POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTION_STATUS
} from "./post-v1-wall-local-substitution-building-adapter-gate-cw";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_cx_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_cx_landed_no_runtime_selected_floor_composite_panel_delta_lw_owner_gate_cy" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_ACTION =
  "post_v1_floor_composite_panel_delta_lw_owner_gate_cy_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-composite-panel-delta-lw-owner-gate-cy-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_LABEL =
  "post-V1 floor composite-panel DeltaLw owner Gate CY" as const;

export const POST_V1_GATE_CX_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md" as const;

export const POST_V1_GATE_CX_SELECTED_TARGET_OUTPUTS = [
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_CX_NO_RUNTIME_COUNTERS = {
  candidateCount: 12,
  estimatedNextNewCalculableLayerTemplates: 3,
  estimatedNextNewCalculableRequestShapes: 3,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  runtimeValuesMoved: 0,
  wrongAliasOrFallbackBlocks: [
    "composite-panel DeltaLw may be admitted only as a separate published-interaction owner derived from same-family bare and treated Ln,w anchors",
    "heavy-concrete Annex C DeltaLw formulas must not be borrowed for composite-panel or lightweight-concrete families",
    "existing composite-panel Rw and Ln,w pins remain unchanged and exact same-stack floor rows stay higher precedence",
    "missing baseSlabOrFloor, toppingOrFloatingLayer, resilient layer, or lower-treatment physical owner fields remains needs_input",
    "ISO DeltaLw still does not publish ASTM IIC or AIIC aliases"
  ]
} as const;

export type PostV1GateCXCandidateId =
  | "broad_source_row_crawl"
  | "confidence_wording"
  | "floor.astm_iic_aiic_user_band_input_surface"
  | "floor.common_floating_lower_treatment_direct_flanking_field_context_gap"
  | "floor.composite_panel_delta_lw_published_interaction_owner_gap"
  | "floor.composite_panel_field_companion_gap"
  | "floor.lightweight_concrete_delta_lw_owner_gap"
  | "floor.visible_layer_upper_package_delta_lw_formula_routing_gap"
  | "frontend_ui_polish"
  | "opening_leak_common_wall_holdout_tightening"
  | "wall.local_substitution_building_prediction_adapter_gap"
  | "wall.local_substitution_flat_order_second_pass_gap";

export type PostV1GateCXSliceKind =
  | "accuracy_holdout_intake"
  | "already_runtime_capable"
  | "blocked_non_goal"
  | "closed_runtime_gap"
  | "formula_owner_not_ready"
  | "metric_basis_input_surface"
  | "runtime_scope_expansion";

export type PostV1GateCXCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateCXCandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly runtimeAdmissibleNext: boolean;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateCXSliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendOrSharedSurface: boolean;
};

export type PostV1GateCXSummary = {
  readonly candidates: readonly PostV1GateCXCandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_CX_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_CX_PLAN_DOC_PATH;
  readonly previousGateCW: {
    readonly landedGate: typeof POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTION_STATUS;
  };
  readonly selectedCandidateId: "floor.composite_panel_delta_lw_published_interaction_owner_gap";
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTION_STATUS;
};

export function rankPostV1GateCXNumericCoverageCandidates(): readonly PostV1GateCXCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "Gate L already owns composite-panel published-interaction Rw and Ln,w routes from same-family bare, dry floating, and ceiling treatment source rows",
        "visible composite-panel treated stacks with complete owner context still leave ISO DeltaLw unsupported even though same-family bare and treated Ln,w anchors are both available",
        "Gate CY can add a separate composite-panel DeltaLw owner by subtracting treated Ln,w from the same-family bare Ln,w anchor, without borrowing heavy-concrete formulas or changing frontend inputs"
      ],
      id: "floor.composite_panel_delta_lw_published_interaction_owner_gap",
      implementationEvidencePaths: [
        "packages/engine/src/composite-panel-published-interaction-estimate.ts",
        "packages/engine/src/composite-panel-published-interaction-runtime-constants.ts",
        "packages/engine/src/post-v1-floor-composite-panel-family-solver-owner-gate-l-contract.test.ts",
        "packages/engine/src/layer-combination-resolver-registry.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI after Gate CW: it turns an already-owned same-family composite-panel impact estimator into an ISO DeltaLw owner for common dry, suspended, and combined treated stacks while keeping the formula family separate from heavy concrete.",
      runtimeAdmissibleNext: true,
      score: 4.74,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_FILE,
      sliceKind: "runtime_scope_expansion",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_CX_SELECTED_TARGET_OUTPUTS,
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "Gate CW opened local-substitution building prediction for grouped triple-leaf wall entry",
        "a complete explicit flat_layer_order probe with the same physical context already selects the Gate CW local-substitution building candidate and publishes the building outputs",
        "selecting a second pass now would add pins, not new calculator scope"
      ],
      id: "wall.local_substitution_flat_order_second_pass_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-local-substitution-building-adapter-gate-cw-contract.test.ts",
        "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-building-adapter.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason:
        "Useful to keep in the ledger, but lower ROI because the tested explicit flat-order local-substitution building route is already runtime-capable after Gate CW.",
      runtimeAdmissibleNext: false,
      score: 3.95,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 3,
      expectedBeforeAfter: [
        "composite-panel lab impact routes already publish Ln,w for dry, suspended, and combined treated stacks",
        "explicit impactFieldContext already adapts those Ln,w anchors to L'n,w, L'nT,w, and L'nT,50",
        "Gate CY should not be diluted into pinning field companions that already calculate"
      ],
      id: "floor.composite_panel_field_companion_gap",
      implementationEvidencePaths: [
        "packages/engine/src/composite-panel-published-interaction-estimate.ts",
        "packages/engine/src/impact-field-context.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ch-contract.test.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason:
        "Already runtime-capable with explicit field context, so it is lower ROI than adding the missing DeltaLw owner.",
      runtimeAdmissibleNext: false,
      score: 3.74,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["L'n,w", "L'nT,w", "L'nT,50"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 4,
      expectedBeforeAfter: [
        "explicit ASTM impact band input would eventually allow true IIC and AIIC calculation",
        "the user-band program still requires shared/API/workbench/report/replay input surfaces before safe publication",
        "frontend agents are active elsewhere, so this engine-only turn must not select it"
      ],
      id: "floor.astm_iic_aiic_user_band_input_surface",
      implementationEvidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason:
        "Valid later, but lower ROI here because it crosses frontend/shared surfaces and does not improve layer-formula routing inside the engine by itself.",
      runtimeAdmissibleNext: false,
      score: 3.32,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "metric_basis_input_surface",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["IIC", "AIIC"],
      touchesFrontendOrSharedSurface: true
    },
    {
      candidateOrder: 5,
      expectedBeforeAfter: [
        "lightweight concrete floors can publish Ln,w from their own selected family route",
        "a separate lightweight DeltaLw owner is still not ready because the current route does not yet expose a same-family bare-vs-treated owner comparable to the composite-panel published interaction rows",
        "borrowing heavy-concrete DeltaLw formulas would be a wrong-family shortcut"
      ],
      id: "floor.lightweight_concrete_delta_lw_owner_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-lightweight-concrete-family-solver-owner-gate-m-contract.test.ts",
        "packages/engine/src/post-v1-floor-formula-expansion-gate-h-contract.test.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason:
        "Calculator-relevant but not the next safe runtime owner; it needs a separate lightweight same-family owner instead of borrowing the heavy-concrete or composite-panel route.",
      runtimeAdmissibleNext: false,
      score: 3.18,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "formula_owner_not_ready",
      sourceRowsRequiredForSelection: true,
      targetMetrics: ["DeltaLw"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 6,
      expectedBeforeAfter: [
        "Gate CL recorded residual ledgers for common wall and opening/leak adapters",
        "same-family calibration rows and same-basis holdouts remain insufficient for budget tightening",
        "selecting it now would become evidence intake rather than immediate calculator coverage"
      ],
      id: "opening_leak_common_wall_holdout_tightening",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl.ts",
        "packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason:
        "Accuracy-relevant, but blocked from runtime movement by the holdout requirements already recorded by Gate CL.",
      runtimeAdmissibleNext: false,
      score: 3.06,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "accuracy_holdout_intake",
      sourceRowsRequiredForSelection: true,
      targetMetrics: ["R'w", "Dn,w", "DnT,w"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 7,
      expectedBeforeAfter: [
        "Gate CQ opened common floating lower-treatment anchor outputs",
        "a direct/flanking lower-treatment probe already calculates L'n,w, L'nT,w, and L'nT,50 through the generic field adapter when explicit direct/flanking context is present",
        "pinning that route is useful, but it is not the next value-moving scope expansion"
      ],
      id: "floor.common_floating_lower_treatment_direct_flanking_field_context_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-common-floating-lower-treatment-anchor-gate-cq-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ch-contract.test.ts",
        "packages/engine/src/impact-field-context.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason:
        "Lower ROI now because the direct/flanking field route is already runtime-capable for the Gate CQ lower-treatment anchor.",
      runtimeAdmissibleNext: false,
      score: 2.91,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["L'n,w", "L'nT,w", "L'nT,50"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 8,
      expectedBeforeAfter: [
        "Gate CV selected local-substitution building prediction",
        "Gate CW landed that runtime movement",
        "closed work must not be selected again"
      ],
      id: "wall.local_substitution_building_prediction_adapter_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-local-substitution-building-adapter-gate-cw-contract.test.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate CW; retained only to prevent stale high-ROI work from being picked again.",
      runtimeAdmissibleNext: false,
      score: 0.59,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 9,
      expectedBeforeAfter: [
        "Gate CN selected visible timber/CLT upper-package DeltaLw routing",
        "Gate CO landed that runtime movement",
        "closed work must not be selected again"
      ],
      id: "floor.visible_layer_upper_package_delta_lw_formula_routing_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-visible-layer-upper-package-delta-lw-gate-co-contract.test.ts"
      ],
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate CO; retained only to prevent stale high-ROI work from being picked again.",
      runtimeAdmissibleNext: false,
      score: 0.5,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 10,
      expectedBeforeAfter: [
        "frontend polish can improve data entry",
        "it does not make the engine choose or execute a better acoustic formula by itself"
      ],
      id: "frontend_ui_polish",
      implementationEvidencePaths: [],
      passesCalculatorAdvancementTest: false,
      reason: "Blocked by the calculator advancement test and by the user's instruction to leave frontend work alone.",
      runtimeAdmissibleNext: false,
      score: 0,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: false,
      targetMetrics: [],
      touchesFrontendOrSharedSurface: true
    },
    {
      candidateOrder: 11,
      expectedBeforeAfter: [
        "source rows remain useful as exact answers, anchors, calibration rows, and holdouts",
        "broad crawling alone does not route arbitrary layer combinations to formulas"
      ],
      id: "broad_source_row_crawl",
      implementationEvidencePaths: [],
      passesCalculatorAdvancementTest: false,
      reason: "Blocked because the product goal is formula-based calculator coverage, not catalog growth.",
      runtimeAdmissibleNext: false,
      score: 0,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: true,
      targetMetrics: [],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 12,
      expectedBeforeAfter: [
        "confidence wording can describe uncertainty",
        "it cannot choose the correct wall or floor formula or calculate a new output"
      ],
      id: "confidence_wording",
      implementationEvidencePaths: [],
      passesCalculatorAdvancementTest: false,
      reason: "Blocked because it does not increase calculator scope or accuracy.",
      runtimeAdmissibleNext: false,
      score: 0,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: false,
      targetMetrics: [],
      touchesFrontendOrSharedSurface: false
    }
  ] as const satisfies readonly PostV1GateCXCandidate[];
}

export function summarizePostV1GateCXNumericCoverageGap(): PostV1GateCXSummary {
  if (
    POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_LANDED_GATE
  ) {
    throw new Error("Gate CX can only land after Gate CW selects the next numeric coverage rerank.");
  }

  const candidates = rankPostV1GateCXNumericCoverageCandidates();
  const selected = candidates.find((candidate) => candidate.selected);
  if (!selected) {
    throw new Error("Gate CX requires exactly one selected calculator candidate.");
  }

  return {
    candidates,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_CX_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_CX_PLAN_DOC_PATH,
    previousGateCW: {
      landedGate: POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_LANDED_GATE,
      selectedNextAction: POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_WALL_LOCAL_SUBSTITUTION_BUILDING_ADAPTER_GATE_CW_SELECTION_STATUS
    },
    selectedCandidateId: selected.id as "floor.composite_panel_delta_lw_published_interaction_owner_gap",
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CX_SELECTION_STATUS
  };
}

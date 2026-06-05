import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_LANDED_GATE,
  POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTION_STATUS
} from "./post-v1-floor-composite-panel-delta-lw-owner-gate-cy";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_cz_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_cz_landed_no_runtime_selected_floor_lightweight_concrete_delta_lw_owner_contract_gate_da" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_ACTION =
  "post_v1_floor_lightweight_concrete_delta_lw_owner_contract_gate_da_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-lightweight-concrete-delta-lw-owner-contract-gate-da-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_LABEL =
  "post-V1 floor lightweight-concrete DeltaLw owner contract Gate DA" as const;

export const POST_V1_GATE_CZ_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md" as const;

export const POST_V1_GATE_CZ_SELECTED_CANDIDATE_ID =
  "floor.lightweight_concrete_delta_lw_family_owner_contract_gap" as const;

export const POST_V1_GATE_CZ_SELECTED_TARGET_OUTPUTS = [
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_CZ_NO_RUNTIME_COUNTERS = {
  candidateCount: 13,
  estimatedFollowOnNewCalculableLayerTemplates: 2,
  estimatedFollowOnNewCalculableRequestShapes: 2,
  estimatedNextNewCalculableLayerTemplates: 0,
  estimatedNextNewCalculableRequestShapes: 0,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  runtimeValuesMoved: 0,
  wrongAliasOrFallbackBlocks: [
    "lightweight-concrete DeltaLw must be admitted only after a family-specific owner contract pins required physical inputs and basis boundaries",
    "heavy-concrete Annex C, composite-panel bare-minus-treated, timber/CLT, and steel mass-spring DeltaLw routes must not be borrowed for lightweight-concrete stacks",
    "existing lightweight-concrete Rw, Ln,w, and explicit field-impact companion pins remain on their owned bases",
    "missing base slab, lightweight material class, upper treatment, resilient layer, dynamic stiffness, load basis, or family owner fields remains needs_input or unsupported",
    "ISO DeltaLw still does not publish ASTM IIC or AIIC aliases"
  ]
} as const;

export type PostV1GateCZCandidateId =
  | typeof POST_V1_GATE_CZ_SELECTED_CANDIDATE_ID
  | "broad_source_row_crawl"
  | "confidence_wording"
  | "floor.astm_iic_aiic_user_band_input_surface"
  | "floor.common_floating_lower_treatment_direct_flanking_field_context_gap"
  | "floor.composite_panel_delta_lw_published_interaction_owner_gap"
  | "floor.composite_panel_field_companion_gap"
  | "floor.visible_layer_upper_package_delta_lw_formula_routing_gap"
  | "frontend_ui_polish"
  | "opening_leak_common_wall_holdout_tightening"
  | "wall.heavy_core_lined_massive_accuracy_tightening_gap"
  | "wall.local_substitution_building_prediction_adapter_gap"
  | "wall.local_substitution_flat_order_second_pass_gap";

export type PostV1GateCZSliceKind =
  | "accuracy_holdout_intake"
  | "already_runtime_capable"
  | "blocked_non_goal"
  | "closed_runtime_gap"
  | "input_owner_contract"
  | "metric_basis_input_surface";

export type PostV1GateCZCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateCZCandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly nextActionMovesRuntimeValues: boolean;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateCZSliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendOrSharedSurface: boolean;
};

export type PostV1GateCZSummary = {
  readonly candidates: readonly PostV1GateCZCandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_CZ_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_CZ_PLAN_DOC_PATH;
  readonly previousGateCY: {
    readonly landedGate: typeof POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTION_STATUS;
  };
  readonly selectedCandidateId: typeof POST_V1_GATE_CZ_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTION_STATUS;
};

export function rankPostV1GateCZNumericCoverageCandidates(): readonly PostV1GateCZCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "Gate M already owns lightweight-concrete family Rw and Ln,w routes with explicit required physical inputs",
        "Gate N already proves explicit field-impact companions can adapt the owned lightweight Ln,w anchor when field context is present",
        "DeltaLw is still intentionally blocked for the same lightweight family because no family-specific owner contract has pinned the bare-vs-treated or dynamic-improvement basis",
        "Gate DA should pin that owner contract before any runtime value moves so the next scope increase does not borrow the heavy-concrete, composite-panel, timber/CLT, or steel corridors"
      ],
      id: POST_V1_GATE_CZ_SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-lightweight-concrete-family-solver-owner-gate-m-contract.test.ts",
        "packages/engine/src/post-v1-floor-field-building-expansion-gate-n-contract.test.ts",
        "packages/engine/src/lightweight-concrete-family-runtime-constants.ts",
        "packages/engine/src/post-v1-floor-formula-expansion-gate-h-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI after Gate CY: lightweight concrete is the remaining common floor family with owned Rw/Ln,w and field companions but no safe ISO DeltaLw owner, so the next step must be an engine-only owner contract that protects formula-family boundaries before runtime publication.",
      score: 4.28,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_FILE,
      sliceKind: "input_owner_contract",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_CZ_SELECTED_TARGET_OUTPUTS,
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "heavy-core lined massive wall predictions are accuracy-relevant for a common market family",
        "the available evidence still needs same-basis holdout and calibration treatment before tightening or runtime correction can be claimed",
        "selecting it now would be an accuracy evidence pass rather than a clean next owner boundary"
      ],
      id: "wall.heavy_core_lined_massive_accuracy_tightening_gap",
      implementationEvidencePaths: [
        "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Important accuracy work, but lower ROI than the lightweight DeltaLw owner contract because it requires holdout evidence before runtime values can safely move.",
      score: 3.64,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "accuracy_holdout_intake",
      sourceRowsRequiredForSelection: true,
      targetMetrics: ["Rw", "R'w", "DnT,w"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 3,
      expectedBeforeAfter: [
        "explicit ASTM impact band input would eventually allow true IIC and AIIC calculation",
        "that program still requires shared schema, API, workbench, report, replay, and validation surface work",
        "other agents are changing frontend, so this engine turn must not select a cross-surface input program"
      ],
      id: "floor.astm_iic_aiic_user_band_input_surface",
      implementationEvidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Valid later, but lower ROI here because it depends on shared/frontend input surfaces and does not improve layer-to-formula routing inside the engine by itself.",
      score: 3.31,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "metric_basis_input_surface",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["IIC", "AIIC"],
      touchesFrontendOrSharedSurface: true
    },
    {
      candidateOrder: 4,
      expectedBeforeAfter: [
        "Gate CL recorded residual ledgers for common wall and opening/leak adapters",
        "same-family calibration rows and same-basis holdouts remain insufficient for budget tightening",
        "selecting it now would become evidence intake instead of immediate layer-combination scope"
      ],
      id: "opening_leak_common_wall_holdout_tightening",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl.ts",
        "packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Accuracy-relevant, but still blocked from runtime movement by the holdout requirements already recorded by Gate CL.",
      score: 3.04,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "accuracy_holdout_intake",
      sourceRowsRequiredForSelection: true,
      targetMetrics: ["R'w", "Dn,w", "DnT,w"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 5,
      expectedBeforeAfter: [
        "Gate CY closed the composite-panel DeltaLw published-interaction owner gap",
        "dry, suspended, and combined composite-panel profiles now publish DeltaLw",
        "closed work must not be selected again"
      ],
      id: "floor.composite_panel_delta_lw_published_interaction_owner_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-composite-panel-delta-lw-owner-gate-cy-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate CY; retained only to prevent stale high-ROI work from being picked again.",
      score: 0.7,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["DeltaLw"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 6,
      expectedBeforeAfter: [
        "composite-panel lab impact routes already publish Ln,w for dry, suspended, and combined treated stacks",
        "explicit impactFieldContext already adapts those Ln,w anchors to L'n,w, L'nT,w, and L'nT,50",
        "selecting it now would add pins for behavior that already calculates"
      ],
      id: "floor.composite_panel_field_companion_gap",
      implementationEvidencePaths: [
        "packages/engine/src/composite-panel-published-interaction-estimate.ts",
        "packages/engine/src/impact-field-context.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ch-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable with explicit field context, so it is not the next value-moving scope expansion.",
      score: 0.68,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["L'n,w", "L'nT,w", "L'nT,50"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 7,
      expectedBeforeAfter: [
        "Gate CS and Gate CW opened the safe local-substitution wall routes that were selected earlier",
        "tested explicit flat-order local-substitution building requests already calculate through their selected owners",
        "selecting a second pass now would not move calculator scope"
      ],
      id: "wall.local_substitution_flat_order_second_pass_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-local-substitution-building-adapter-gate-cw-contract.test.ts",
        "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-building-adapter.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable after the wall local-substitution gates.",
      score: 0.66,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 8,
      expectedBeforeAfter: [
        "Gate CQ opened common floating lower-treatment anchor outputs",
        "direct/flanking lower-treatment probes already calculate field companions when explicit context is present",
        "selecting that route again would not add a new formula owner"
      ],
      id: "floor.common_floating_lower_treatment_direct_flanking_field_context_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-common-floating-lower-treatment-anchor-gate-cq-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ch-contract.test.ts",
        "packages/engine/src/impact-field-context.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable for the Gate CQ lower-treatment anchor.",
      score: 0.61,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["L'n,w", "L'nT,w", "L'nT,50"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 9,
      expectedBeforeAfter: [
        "Gate CW landed the local-substitution building prediction adapter",
        "closed work must not be selected again"
      ],
      id: "wall.local_substitution_building_prediction_adapter_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-local-substitution-building-adapter-gate-cw-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate CW.",
      score: 0.58,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 10,
      expectedBeforeAfter: [
        "Gate CO landed visible timber/CLT upper-package DeltaLw routing",
        "closed work must not be selected again"
      ],
      id: "floor.visible_layer_upper_package_delta_lw_formula_routing_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-visible-layer-upper-package-delta-lw-gate-co-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate CO.",
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
      candidateOrder: 11,
      expectedBeforeAfter: [
        "frontend polish can improve data entry",
        "it does not make the engine choose or execute a better acoustic formula by itself"
      ],
      id: "frontend_ui_polish",
      implementationEvidencePaths: [],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Blocked by the calculator advancement test and by the user's instruction to leave frontend work alone.",
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
      candidateOrder: 12,
      expectedBeforeAfter: [
        "source rows remain useful as exact answers, anchors, calibration rows, and holdouts",
        "broad crawling alone does not route arbitrary layer combinations to formulas"
      ],
      id: "broad_source_row_crawl",
      implementationEvidencePaths: [],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Blocked because the product goal is formula-based calculator coverage, not catalog growth.",
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
      candidateOrder: 13,
      expectedBeforeAfter: [
        "confidence wording can describe uncertainty",
        "it cannot choose the correct wall or floor formula or calculate a new output"
      ],
      id: "confidence_wording",
      implementationEvidencePaths: [],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Blocked because it does not increase calculator scope or accuracy.",
      score: 0,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: false,
      targetMetrics: [],
      touchesFrontendOrSharedSurface: false
    }
  ] as const satisfies readonly PostV1GateCZCandidate[];
}

export function summarizePostV1GateCZNumericCoverageGap(): PostV1GateCZSummary {
  if (
    POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_LANDED_GATE
  ) {
    throw new Error("Gate CZ can only land after Gate CY selects the next numeric coverage rerank.");
  }

  const candidates = rankPostV1GateCZNumericCoverageCandidates();
  const selected = candidates.find((candidate) => candidate.selected);
  if (!selected) {
    throw new Error("Gate CZ requires exactly one selected calculator candidate.");
  }

  return {
    candidates,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_CZ_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_CZ_PLAN_DOC_PATH,
    previousGateCY: {
      landedGate: POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_COMPOSITE_PANEL_DELTA_LW_OWNER_GATE_CY_SELECTION_STATUS
    },
    selectedCandidateId: selected.id as typeof POST_V1_GATE_CZ_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTION_STATUS
  };
}

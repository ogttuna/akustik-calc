import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_LANDED_GATE,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTION_STATUS
} from "./post-v1-floor-lightweight-concrete-delta-lw-runtime-corridor-gate-db";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_dc_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_dc_landed_no_runtime_selected_wall_heavy_core_lined_massive_accuracy_gate_dd" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_ACTION =
  "post_v1_wall_heavy_core_lined_massive_accuracy_gate_dd_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-heavy-core-lined-massive-accuracy-gate-dd-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_LABEL =
  "post-V1 wall heavy-core / lined-massive accuracy Gate DD" as const;

export const POST_V1_GATE_DC_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md" as const;

export const POST_V1_GATE_DC_SELECTED_CANDIDATE_ID =
  "wall.heavy_core_lined_massive_accuracy_tightening_gap" as const;

export const POST_V1_GATE_DC_SELECTED_TARGET_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DC_NO_RUNTIME_COUNTERS = {
  accuracyReadinessLedgers: 1,
  candidateCount: 13,
  estimatedNextNewCalculableLayerTemplates: 0,
  estimatedNextNewCalculableRequestShapes: 0,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  runtimeValuesMoved: 0,
  wrongAliasOrFallbackBlocks: [
    "heavy-core / lined-massive Rw or field retune must not move until a wall-specific source row or bounded lining rule is named",
    "generated wall-screening-concrete rows, workbench presets, selector pins, and deep-hybrid guards are not calibration holdouts",
    "floor-only concrete ceiling rows do not become wall lining source truth",
    "lab Rw/STC/C/Ctr, field R'w/Dn,w/DnT,w, and building outputs keep separate metric/basis owners",
    "broad source crawling, confidence wording, and frontend polish remain blocked as next calculator slices"
  ]
} as const;

export type PostV1GateDCCandidateId =
  | typeof POST_V1_GATE_DC_SELECTED_CANDIDATE_ID
  | "broad_source_row_crawl"
  | "confidence_wording"
  | "floor.astm_iic_aiic_user_band_input_surface"
  | "floor.common_floating_lower_treatment_direct_flanking_field_context_gap"
  | "floor.composite_panel_delta_lw_published_interaction_owner_gap"
  | "floor.composite_panel_field_companion_gap"
  | "floor.lightweight_concrete_delta_lw_family_owner_contract_gap"
  | "floor.lightweight_concrete_delta_lw_runtime_corridor_gap"
  | "floor.visible_layer_upper_package_delta_lw_formula_routing_gap"
  | "frontend_ui_polish"
  | "opening_leak_common_wall_holdout_tightening"
  | "wall.local_substitution_flat_order_second_pass_gap";

export type PostV1GateDCSliceKind =
  | "accuracy_holdout_intake"
  | "accuracy_readiness_contract"
  | "already_runtime_capable"
  | "blocked_non_goal"
  | "closed_runtime_gap"
  | "metric_basis_input_surface";

export type PostV1GateDCCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateDCCandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly nextActionMovesRuntimeValues: boolean;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateDCSliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendOrSharedSurface: boolean;
};

export type PostV1GateDCSummary = {
  readonly candidates: readonly PostV1GateDCCandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_DC_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_DC_PLAN_DOC_PATH;
  readonly previousGateDB: {
    readonly landedGate: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTION_STATUS;
  };
  readonly selectedCandidateId: typeof POST_V1_GATE_DC_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTION_STATUS;
};

export function rankPostV1GateDCNumericCoverageCandidates(): readonly PostV1GateDCCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "Gate H already routes complete lined massive / masonry wall lab requests through a source-absent family physics basis",
        "the live heavy-core generated case publishes lab and field values, but earlier audits keep it at screening posture because no wall-specific source row or bounded lining rule is named",
        "Gate DD must pin the same-basis evidence ledger and negative boundaries before any retune, budget tightening, or runtime correction can be called accuracy work"
      ],
      id: POST_V1_GATE_DC_SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-h-lined-masonry-clt-wall-upgrade-contract.test.ts",
        "packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts",
        "packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts",
        "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI after Gate DB: it is the remaining common wall accuracy risk with live formulas and visible field outputs, but the next safe move is an engine-only accuracy readiness contract, not a retune from nearby or preset rows.",
      score: 3.74,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_FILE,
      sliceKind: "accuracy_readiness_contract",
      sourceRowsRequiredForSelection: true,
      targetMetrics: POST_V1_GATE_DC_SELECTED_TARGET_OUTPUTS,
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "explicit ASTM impact band input would eventually allow true IIC and AIIC calculation",
        "that program still needs shared schema, API, workbench, report, replay, and validation surface work",
        "frontend agents are active elsewhere, so this engine slice must not select a cross-surface input program"
      ],
      id: "floor.astm_iic_aiic_user_band_input_surface",
      implementationEvidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Valid later, but lower ROI here because it crosses shared/frontend surfaces and does not improve layer-to-formula routing inside the engine by itself.",
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
      candidateOrder: 3,
      expectedBeforeAfter: [
        "Gate CL recorded opening/leak and common wall residual ledgers",
        "same-family calibration rows and same-basis field/building holdouts remain insufficient for budget tightening",
        "selecting it now would be a holdout acquisition program rather than the next bounded accuracy readiness ledger"
      ],
      id: "opening_leak_common_wall_holdout_tightening",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl.ts",
        "packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Accuracy-relevant, but lower ROI than the heavy-core / lined-massive readiness contract because Gate CL already froze its required holdout blockers.",
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
      candidateOrder: 4,
      expectedBeforeAfter: [
        "Gate CZ selected the lightweight-concrete DeltaLw family owner contract",
        "Gate DA landed that no-runtime owner contract",
        "closed work must not be selected again"
      ],
      id: "floor.lightweight_concrete_delta_lw_family_owner_contract_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-lightweight-concrete-delta-lw-owner-contract-gate-da-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate DA.",
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
      candidateOrder: 5,
      expectedBeforeAfter: [
        "Gate DB closed the lightweight-concrete DeltaLw runtime corridor",
        "complete visible and predictor-input lightweight-concrete stacks now calculate DeltaLw",
        "closed work must not be selected again"
      ],
      id: "floor.lightweight_concrete_delta_lw_runtime_corridor_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-lightweight-concrete-delta-lw-runtime-corridor-gate-db-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate DB.",
      score: 0.68,
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
      reason: "Closed by Gate CY.",
      score: 0.66,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["DeltaLw"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 7,
      expectedBeforeAfter: [
        "Gate CS, Gate CU, and Gate CW opened the safe flat-order and local-substitution wall routes selected earlier",
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
      score: 0.64,
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
        "composite-panel lab impact routes already publish Ln,w and DeltaLw for treated stacks",
        "explicit impactFieldContext already adapts those Ln,w anchors to L'n,w, L'nT,w, and L'nT,50",
        "selecting it now would add pins for behavior that already calculates"
      ],
      id: "floor.composite_panel_field_companion_gap",
      implementationEvidencePaths: [
        "packages/engine/src/composite-panel-published-interaction-estimate.ts",
        "packages/engine/src/impact-field-context.ts",
        "packages/engine/src/post-v1-floor-composite-panel-delta-lw-owner-gate-cy-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable with explicit field context.",
      score: 0.62,
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
        "Gate CQ opened common floating lower-treatment anchor outputs",
        "direct/flanking lower-treatment probes already calculate field companions when explicit context is present",
        "selecting that route again would not add a new formula owner"
      ],
      id: "floor.common_floating_lower_treatment_direct_flanking_field_context_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-common-floating-lower-treatment-anchor-gate-cq-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ch-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable for the Gate CQ lower-treatment anchor.",
      score: 0.6,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["L'n,w", "L'nT,w", "L'nT,50"],
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
      score: 0.58,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["DeltaLw"],
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
  ] as const satisfies readonly PostV1GateDCCandidate[];
}

export function summarizePostV1GateDCNumericCoverageGap(): PostV1GateDCSummary {
  if (
    POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_LANDED_GATE
  ) {
    throw new Error("Gate DC can only land after Gate DB selects the next numeric coverage rerank.");
  }

  const candidates = rankPostV1GateDCNumericCoverageCandidates();
  const selected = candidates.find((candidate) => candidate.selected);
  if (!selected) {
    throw new Error("Gate DC requires exactly one selected calculator candidate.");
  }

  return {
    candidates,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_DC_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_DC_PLAN_DOC_PATH,
    previousGateDB: {
      landedGate: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_RUNTIME_CORRIDOR_GATE_DB_SELECTION_STATUS
    },
    selectedCandidateId: selected.id as typeof POST_V1_GATE_DC_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTION_STATUS
  };
}

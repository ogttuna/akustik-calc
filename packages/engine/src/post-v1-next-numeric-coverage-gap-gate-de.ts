import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_LANDED_GATE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_ACTION,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_FILE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTION_STATUS
} from "./post-v1-wall-heavy-core-lined-massive-accuracy-gate-dd";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_de_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_de_landed_no_runtime_selected_wall_heavy_core_lined_massive_bounded_rule_gate_df" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_ACTION =
  "post_v1_wall_heavy_core_lined_massive_bounded_rule_gate_df_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-rule-gate-df-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_LABEL =
  "post-V1 wall heavy-core / lined-massive bounded-rule owner Gate DF" as const;

export const POST_V1_GATE_DE_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md" as const;

export const POST_V1_GATE_DE_SELECTED_CANDIDATE_ID =
  "wall.heavy_core_lined_massive_bounded_rule_owner_gap" as const;

export const POST_V1_GATE_DE_SELECTED_TARGET_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DE_NO_RUNTIME_COUNTERS = {
  candidateCount: 15,
  estimatedNextAccuracyOwnerLedgers: 1,
  estimatedNextNewCalculableLayerTemplates: 0,
  estimatedNextNewCalculableRequestShapes: 0,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  runtimeValuesMoved: 0,
  staleOrAlreadyLiveCandidatesRejected: 8,
  wrongAliasOrFallbackBlocks: [
    "Gate DF may define a bounded lined-massive rule owner only with coefficient scope, tolerance, and negative boundaries",
    "Gate DE does not retune wall-screening-concrete Rw, field, or building values",
    "Knauf CC60 floor rows, workbench presets, selector pins, and deep-hybrid guards remain non-promotable evidence",
    "floor ASTM IIC/AIIC user-band work is not the next engine-only layer-formula slice because exact ASTM band ownership already exists and broader surfaces cross shared/frontend boundaries",
    "floor steel L'nT,50 with explicit ci50_2500Db is already runtime-capable and must not be selected as fake scope",
    "lab Rw/STC/C/Ctr, field R'w/Dn,w/DnT,w, and ASTM IIC/AIIC metric owners remain separate"
  ]
} as const;

export type PostV1GateDECandidateId =
  | typeof POST_V1_GATE_DE_SELECTED_CANDIDATE_ID
  | "broad_source_row_crawl"
  | "confidence_wording"
  | "floor.astm_iic_aiic_user_band_input_surface"
  | "floor.common_floating_lower_treatment_direct_flanking_field_context_gap"
  | "floor.composite_panel_delta_lw_published_interaction_owner_gap"
  | "floor.lightweight_concrete_delta_lw_runtime_corridor_gap"
  | "floor.steel_fallback_low_frequency_field_context_gap"
  | "floor.visible_layer_upper_package_delta_lw_formula_routing_gap"
  | "frontend_ui_polish"
  | "opening_leak_common_wall_holdout_tightening"
  | "wall.clt_formula_accuracy_gap"
  | "wall.heavy_core_lined_massive_direct_retune"
  | "wall.heavy_core_lined_massive_readiness_gap"
  | "wall.timber_stud_formula_accuracy_gap";

export type PostV1GateDESliceKind =
  | "accuracy_holdout_intake"
  | "accuracy_owner_contract"
  | "already_runtime_capable"
  | "blocked_non_goal"
  | "blocked_without_source_or_rule"
  | "closed_runtime_gap"
  | "closed_readiness_gap"
  | "metric_basis_input_surface";

export type PostV1GateDECandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateDECandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly nextActionMovesRuntimeValues: boolean;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateDESliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendOrSharedSurface: boolean;
};

export type PostV1GateDESummary = {
  readonly candidates: readonly PostV1GateDECandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_DE_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_DE_PLAN_DOC_PATH;
  readonly previousGateDD: {
    readonly landedGate: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTION_STATUS;
  };
  readonly selectedCandidateId: typeof POST_V1_GATE_DE_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTION_STATUS;
};

export function rankPostV1GateDENumericCoverageCandidates(): readonly PostV1GateDECandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "Gate DD proved the current wall-screening-concrete route calculates through lined_massive_wall but remains source-absent screening",
        "direct retune is still blocked because no wall-specific source row or bounded rule owner exists",
        "Gate DF can improve accuracy posture by defining whether the existing lined-massive mass-law / lining route has a bounded coefficient scope, tolerance, and negative boundaries before any value moves"
      ],
      id: POST_V1_GATE_DE_SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-accuracy-gate-dd-contract.test.ts",
        "packages/engine/src/dynamic-airborne-framed-wall.ts",
        "packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts",
        "packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI after Gate DD: the remaining common wall accuracy risk is not another source crawl or direct retune; it is a bounded formula-owner contract for the existing lined-massive/heavy-core route so future runtime movement cannot borrow adjacent rows or presets.",
      score: 3.52,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_FILE,
      sliceKind: "accuracy_owner_contract",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DE_SELECTED_TARGET_OUTPUTS,
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "Gate DD closed the readiness ledger and froze the current source-absent screening pins",
        "selecting the same readiness gap again would add documentation without narrowing the formula owner",
        "Gate DF must be a bounded-rule owner decision, not a second readiness pass"
      ],
      id: "wall.heavy_core_lined_massive_readiness_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-accuracy-gate-dd-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate DD as a no-runtime readiness pass.",
      score: 0.72,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_readiness_gap",
      sourceRowsRequiredForSelection: true,
      targetMetrics: POST_V1_GATE_DE_SELECTED_TARGET_OUTPUTS,
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 3,
      expectedBeforeAfter: [
        "changing wall-screening-concrete values could improve or harm accuracy",
        "Gate DD explicitly proved no source row, lab fallback, or bounded rule currently authorizes that movement",
        "direct retune remains blocked until Gate DF or a source row names the owner"
      ],
      id: "wall.heavy_core_lined_massive_direct_retune",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-accuracy-gate-dd-contract.test.ts",
        "packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Accuracy-relevant but unsafe as the immediate action; it would move values before the owner rule exists.",
      score: 0.7,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_without_source_or_rule",
      sourceRowsRequiredForSelection: true,
      targetMetrics: POST_V1_GATE_DE_SELECTED_TARGET_OUTPUTS,
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 4,
      expectedBeforeAfter: [
        "explicit ASTM impact one-third-octave source input already routes through the engine ASTM E989 owner",
        "ISO impact formulas still must not alias to IIC or AIIC",
        "a broader user-band surface touches shared/API/workbench/report/replay and is not the next engine-only layer-formula routing slice"
      ],
      id: "floor.astm_iic_aiic_user_band_input_surface",
      implementationEvidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/shared/src/domain/exact-impact-source.ts",
        "packages/shared/src/api/impact-only.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Valid later only as a cross-surface input program; it does not improve the engine's layer-to-formula routing after exact ASTM band ownership already exists.",
      score: 2.22,
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
        "the generated steel fallback row historically listed L'nT,50 as unsupported without explicit CI50 context",
        "with explicit impactFieldContext.ci50_2500Db the route calculates L'nT,50 through the existing field adapter",
        "selecting it now would claim fake scope movement for an already-owned input path"
      ],
      id: "floor.steel_fallback_low_frequency_field_context_gap",
      implementationEvidencePaths: [
        "packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts",
        "packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts",
        "packages/engine/src/impact-field-context.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable when the explicit CI50 physical input is present.",
      score: 1.95,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["L'nT,50"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 6,
      expectedBeforeAfter: [
        "Gate CL recorded common wall and opening/leak residual ledgers",
        "same-family calibration rows and same-basis holdouts remain insufficient for budget tightening",
        "selecting it now would be holdout intake, not the next bounded formula-owner step"
      ],
      id: "opening_leak_common_wall_holdout_tightening",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts",
        "packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Accuracy-relevant, but still blocked from runtime movement by the Gate CL holdout requirements.",
      score: 1.84,
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
        "wall timber-stud accuracy has previous no-runtime source and closeout contracts",
        "no exact row or bounded timber rule currently unlocks the live generated double-board stack",
        "nearby timber preset/source rows must not retune the route by similarity"
      ],
      id: "wall.timber_stud_formula_accuracy_gap",
      implementationEvidencePaths: [
        "packages/engine/src/wall-timber-stud-gate-b-source-contract.test.ts",
        "packages/engine/src/post-wall-timber-stud-clt-gate-c-next-slice-selection-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Blocked until a stack-matching source row or bounded family rule is named.",
      score: 0.68,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_without_source_or_rule",
      sourceRowsRequiredForSelection: true,
      targetMetrics: ["Rw", "R'w", "DnT,w"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 8,
      expectedBeforeAfter: [
        "wall CLT accuracy has previous no-runtime source and closeout contracts",
        "floor CLT rows remain floor source truth and do not define a wall-lining owner",
        "no wall CLT bounded rule currently unlocks runtime value movement"
      ],
      id: "wall.clt_formula_accuracy_gap",
      implementationEvidencePaths: [
        "packages/engine/src/wall-clt-gate-b-source-contract.test.ts",
        "packages/engine/src/post-wall-timber-stud-clt-gate-c-next-slice-selection-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Blocked until a wall CLT source row or bounded rule is named.",
      score: 0.66,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_without_source_or_rule",
      sourceRowsRequiredForSelection: true,
      targetMetrics: ["Rw", "R'w", "DnT,w"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 9,
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
      candidateOrder: 10,
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
      score: 0.56,
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
        "Gate CQ opened common floating lower-treatment anchor outputs",
        "direct/flanking field companions calculate when explicit field context is supplied",
        "selecting it now would add pins for already-live behavior"
      ],
      id: "floor.common_floating_lower_treatment_direct_flanking_field_context_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-common-floating-lower-treatment-anchor-gate-cq-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ch-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable for explicit direct/flanking field context.",
      score: 0.54,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["L'n,w", "L'nT,w", "L'nT,50"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 12,
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
      score: 0.52,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["DeltaLw"],
      touchesFrontendOrSharedSurface: false
    },
    {
      candidateOrder: 13,
      expectedBeforeAfter: [
        "frontend polish can improve data entry",
        "it does not make the engine choose or execute a more correct acoustic formula by itself"
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
      candidateOrder: 14,
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
      candidateOrder: 15,
      expectedBeforeAfter: [
        "confidence wording can describe uncertainty",
        "it cannot choose the correct wall or floor formula or calculate a new output"
      ],
      id: "confidence_wording",
      implementationEvidencePaths: [],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Blocked because it does not increase calculator scope or numeric accuracy.",
      score: 0,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: false,
      targetMetrics: [],
      touchesFrontendOrSharedSurface: false
    }
  ] as const satisfies readonly PostV1GateDECandidate[];
}

export function summarizePostV1GateDENumericCoverageGap(): PostV1GateDESummary {
  if (
    POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_LANDED_GATE
  ) {
    throw new Error("Gate DE can only land after Gate DD selects the next numeric coverage rerank.");
  }

  const candidates = rankPostV1GateDENumericCoverageCandidates();
  const selected = candidates.find((candidate) => candidate.selected);
  if (!selected) {
    throw new Error("Gate DE requires exactly one selected calculator candidate.");
  }

  return {
    candidates,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_DE_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_DE_PLAN_DOC_PATH,
    previousGateDD: {
      landedGate: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_LANDED_GATE,
      selectedNextAction: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTION_STATUS
    },
    selectedCandidateId: selected.id as typeof POST_V1_GATE_DE_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTION_STATUS
  };
}

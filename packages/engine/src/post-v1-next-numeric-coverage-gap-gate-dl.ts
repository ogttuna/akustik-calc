import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_LANDED_GATE,
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTION_STATUS
} from "./post-v1-floor-steel-visible-formula-input-surface-parity-gate-dk";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_dl_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_dl_landed_no_runtime_selected_wall_timber_stud_bounded_rule_gate_dm" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_ACTION =
  "post_v1_wall_timber_stud_bounded_rule_gate_dm_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-timber-stud-bounded-rule-gate-dm-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_LABEL =
  "post-V1 wall timber-stud bounded-rule owner Gate DM" as const;

export const POST_V1_GATE_DL_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md" as const;

export const POST_V1_GATE_DL_SELECTED_CANDIDATE_ID =
  "wall.timber_stud_formula_bounded_rule_owner_gap" as const;

export const POST_V1_GATE_DL_SELECTED_TARGET_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DL_NO_RUNTIME_COUNTERS = {
  boundedOwnerLedgersEstimated: 1,
  candidateCount: 12,
  estimatedNextNewCalculableLayerTemplates: 0,
  estimatedNextNewCalculableRequestShapes: 0,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  runtimeValuesMoved: 0,
  staleOrAlreadyLiveCandidatesRejected: 4,
  wrongAliasOrFallbackBlocks: [
    "Gate DM may define a bounded timber-stud formula owner only with coefficient scope, tolerance, and negative boundaries",
    "Gate DL does not retune the live wall-timber-stud Rw, field, or building values",
    "single-board timber exact rows, resilient-bar exact rows, steel-framed linked holdouts, and secondary direct double-board rows do not become exact truth for the live wood-stud double-board stack",
    "wall CLT, held-AAC multicavity, heavy-core direct retune, opening/leak holdout tightening, and ASTM IIC/AIIC surface work remain separate owners",
    "lab Rw/STC/C/Ctr, field R'w/Dn,w/DnT,w, and ASTM IIC/AIIC metric owners remain separate",
    "Gate DL does not touch frontend implementation"
  ]
} as const;

export type PostV1GateDLCandidateId =
  | typeof POST_V1_GATE_DL_SELECTED_CANDIDATE_ID
  | "broad_source_row_crawl"
  | "confidence_wording"
  | "floor.astm_iic_aiic_user_band_input_surface"
  | "floor.steel_visible_formula_input_surface_parity_gap"
  | "floor.steel_visible_formula_runtime_bridge_gap"
  | "frontend_ui_polish"
  | "opening_leak_common_wall_holdout_tightening"
  | "wall.clt_laminated_leaf_bounded_rule_owner_gap"
  | "wall.heavy_core_lined_massive_direct_retune"
  | "wall.held_aac_board_fill_gap_multicavity_gap"
  | "wall.timber_stud_direct_retune";

export type PostV1GateDLSliceKind =
  | "accuracy_holdout_intake"
  | "accuracy_owner_contract"
  | "already_runtime_capable"
  | "blocked_non_goal"
  | "blocked_without_source_or_rule"
  | "closed_runtime_gap"
  | "metric_basis_input_surface";

export type PostV1GateDLCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateDLCandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly nextActionMovesRuntimeValues: boolean;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateDLSliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementation: boolean;
  readonly touchesSharedOrApiSurface: boolean;
};

export type PostV1GateDLSummary = {
  readonly candidates: readonly PostV1GateDLCandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_DL_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_DL_PLAN_DOC_PATH;
  readonly previousGateDK: {
    readonly landedGate: typeof POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_LANDED_GATE;
    readonly selectedNextAction:
      typeof POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_ACTION;
    readonly selectedNextFile:
      typeof POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTION_STATUS;
  };
  readonly selectedCandidateId: typeof POST_V1_GATE_DL_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTION_STATUS;
};

export function rankPostV1GateDLNumericCoverageCandidates(): readonly PostV1GateDLCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "the live timber-stud wall stack already calculates through the stud wall formula corridor but remains low-confidence and source-adjacent",
        "previous timber source audits prove no exact or lab-fallback source row matches the live double-board, fill, cavity, and wood-stud topology",
        "Gate DM can improve accuracy posture by defining a bounded timber-stud formula owner before any values move"
      ],
      id: POST_V1_GATE_DL_SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/wall-timber-stud-gate-b-source-contract.test.ts",
        "packages/engine/src/wall-timber-lightweight-source-audit.test.ts",
        "packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts",
        "packages/engine/src/dynamic-airborne-framed-wall.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI after Gate DK: the steel surface gap is closed, and the remaining common calculator risk is a live timber-stud formula route whose exact-source blockers are already known. The next safe engine-only step is a bounded owner contract, not a direct retune or source crawl.",
      score: 3.42,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_FILE,
      sliceKind: "accuracy_owner_contract",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DL_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "the live timber-stud field/lab values may need future correction",
        "the current source corpus does not contain an exact live-stack row or lab fallback row",
        "moving values before a bounded owner exists would weaken the accuracy guard"
      ],
      id: "wall.timber_stud_direct_retune",
      implementationEvidencePaths: [
        "packages/engine/src/wall-timber-stud-gate-b-source-contract.test.ts",
        "packages/engine/src/wall-timber-lightweight-source-audit.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Accuracy-relevant but unsafe as the immediate action; Gate DM must define the owner before runtime values move.",
      score: 1.02,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_without_source_or_rule",
      sourceRowsRequiredForSelection: true,
      targetMetrics: POST_V1_GATE_DL_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 3,
      expectedBeforeAfter: [
        "the live CLT wall formula lane is source-absent but already runtime-capable",
        "current CLT evidence is floor-system source truth or generic laminated-leaf formula context",
        "it should follow after timber-stud because the timber route is lower confidence and has a richer wall-specific source/holdout corpus for bounded owner scoping"
      ],
      id: "wall.clt_laminated_leaf_bounded_rule_owner_gap",
      implementationEvidencePaths: [
        "packages/engine/src/wall-clt-gate-b-source-contract.test.ts",
        "packages/engine/src/dataholz-clt-source-truth-audit.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Valid later as a bounded laminated-leaf owner, but lower ROI than timber-stud for this slot.",
      score: 2.46,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "accuracy_owner_contract",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DL_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 4,
      expectedBeforeAfter: [
        "Gate DG already promoted the lined-massive runtime basis to bounded_prediction without changing values",
        "direct retune still lacks a same-stack source row or a new coefficient rule",
        "selecting it now would move values without the owner evidence Gate DF/DG deliberately required"
      ],
      id: "wall.heavy_core_lined_massive_direct_retune",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts",
        "packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Still blocked until a source row or coefficient rule authorizes numeric movement.",
      score: 1.14,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_without_source_or_rule",
      sourceRowsRequiredForSelection: true,
      targetMetrics: ["Rw", "R'w", "DnT,w"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 5,
      expectedBeforeAfter: [
        "exact ASTM E492/E1007 one-third-octave source input already calculates IIC/AIIC through the ASTM E989 owner",
        "ISO impact formulas still must not alias to IIC or AIIC",
        "remaining work here is broad user input surface/product surface parity, not the best engine-only formula owner move"
      ],
      id: "floor.astm_iic_aiic_user_band_input_surface",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-astm-iic-aiic-contour-rating-gate-f-contract.test.ts",
        "packages/engine/src/post-v1-floor-astm-iic-aiic-surface-parity-gate-g-contract.test.ts",
        "packages/shared/src/api/impact-only.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Already engine/API-capable for exact ASTM band input; not selected because it does not improve layer-to-formula routing now.",
      score: 2.18,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "metric_basis_input_surface",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["IIC", "AIIC"],
      touchesFrontendImplementation: true,
      touchesSharedOrApiSurface: true
    },
    {
      candidateOrder: 6,
      expectedBeforeAfter: [
        "Gate CL recorded common wall and opening/leak residual ledgers",
        "same-family calibration rows and same-basis holdouts remain insufficient for budget tightening",
        "selecting it now would be holdout intake instead of formula-owner work"
      ],
      id: "opening_leak_common_wall_holdout_tightening",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts",
        "packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Accuracy-relevant, but still blocked from runtime movement by holdout requirements.",
      score: 1.86,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "accuracy_holdout_intake",
      sourceRowsRequiredForSelection: true,
      targetMetrics: ["R'w", "Dn,w", "DnT,w"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 7,
      expectedBeforeAfter: [
        "wall-held AAC/multicavity without supportTopology correctly stops as needs_input",
        "when supportTopology is supplied, existing Gate AE/Gate I routes calculate lab and field outputs",
        "selecting it now would count a missing required physical input as a fake scope gap"
      ],
      id: "wall.held_aac_board_fill_gap_multicavity_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-flat-layer-order-multicavity-gate-cu-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dj-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already runtime-capable with explicit supportTopology; supportless entry remains needs_input.",
      score: 0.84,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_runtime_capable",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DL_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 8,
      expectedBeforeAfter: [
        "Gate DK closed the steel formula input surface parity gap",
        "estimate API and impact-only API now carry steelFloorFormulaSurface",
        "closed work must not be selected again"
      ],
      id: "floor.steel_visible_formula_input_surface_parity_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-steel-visible-formula-input-surface-parity-gate-dk-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate DK.",
      score: 0.72,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["Ln,w", "DeltaLw"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 9,
      expectedBeforeAfter: [
        "Gate DI closed the steel visible formula runtime bridge inside calculateAssembly",
        "Gate DK then carried it through shared/API impact-only surfaces",
        "closed work must not be selected again"
      ],
      id: "floor.steel_visible_formula_runtime_bridge_gap",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-steel-visible-formula-input-bridge-gate-di-contract.test.ts",
        "packages/engine/src/post-v1-floor-steel-visible-formula-input-surface-parity-gate-dk-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed by Gate DI and Gate DK.",
      score: 0.7,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForSelection: false,
      targetMetrics: ["Ln,w", "DeltaLw"],
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 10,
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
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 11,
      expectedBeforeAfter: [
        "confidence wording can describe uncertainty",
        "it cannot choose the correct wall formula or calculate a new output"
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
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    },
    {
      candidateOrder: 12,
      expectedBeforeAfter: [
        "frontend polish may improve presentation",
        "this turn is restricted to calculator engine scope and accuracy work"
      ],
      id: "frontend_ui_polish",
      implementationEvidencePaths: [],
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: false,
      reason: "Blocked because it is not an engine calculator slice.",
      score: 0,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForSelection: false,
      targetMetrics: [],
      touchesFrontendImplementation: true,
      touchesSharedOrApiSurface: false
    }
  ] as const satisfies readonly PostV1GateDLCandidate[];
}

export function summarizePostV1GateDLNumericCoverageGap(): PostV1GateDLSummary {
  if (
    POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_LANDED_GATE
  ) {
    throw new Error("Gate DL can only land after Gate DK selects the next numeric coverage rerank.");
  }

  const candidates = rankPostV1GateDLNumericCoverageCandidates();
  const selectedCandidates = candidates.filter((candidate) => candidate.selected);
  if (selectedCandidates.length !== 1) {
    throw new Error("Gate DL requires exactly one selected calculator candidate.");
  }
  const selected = selectedCandidates[0];

  return {
    candidates,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_DL_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_DL_PLAN_DOC_PATH,
    previousGateDK: {
      landedGate: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_LANDED_GATE,
      selectedNextAction: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTION_STATUS
    },
    selectedCandidateId: selected.id as typeof POST_V1_GATE_DL_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTION_STATUS
  };
}

import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_LANDED_GATE,
  POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTION_STATUS,
  POST_V1_GATE_FD_COUNTERS,
  POST_V1_GATE_FD_OWNER_DECISION_ID,
  POST_V1_GATE_FD_PLAN_DOC_PATH,
  summarizePostV1FloorRawBareAndFloatingSameBasisHoldoutGateFD
} from "./post-v1-floor-raw-bare-and-floating-same-basis-holdout-gate-fd";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_fe_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_fe_landed_no_runtime_selected_current_formula_scope_accuracy_gap_ledger_gate_ff" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_ACTION =
  "post_v1_current_formula_scope_accuracy_gap_ledger_gate_ff_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-current-formula-scope-accuracy-gap-ledger-gate-ff-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_LABEL =
  "post-V1 current formula scope/accuracy gap ledger Gate FF" as const;

export const POST_V1_GATE_FE_SELECTED_CANDIDATE_ID =
  "calculator.current_formula_scope_accuracy_gap_ledger_after_gate_fd_closeout" as const;

export const POST_V1_GATE_FE_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_GATE_FE_FF_CURRENT_FORMULA_SCOPE_ACCURACY_LEDGER_PLAN_2026-06-09.md" as const;

export const POST_V1_GATE_FE_TARGET_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "DnT,w",
  "DnT,A",
  "Ln,w",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "DeltaLw",
  "CI",
  "CI,50-2500",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_FE_ROI_ANALYSIS_ITERATIONS = [
  {
    iteration: 1,
    conclusion:
      "Gate FD rejected the floor raw-bare/floating holdout owner, so Gate FE must remove Gate FD, Gate FB, and Gate EY rejected budget/retune paths from immediate runtime selection.",
    rejectedDirections: [
      "tightening floor raw-bare or heavy-floating budgets after Gate FD found no admissible same-basis holdouts",
      "tightening opening/leak or common-wall budgets after Gate FB rejected the same-basis residual owner",
      "retuning heavy-core / lined-massive wall values after Gate EY kept runtime-admissible evidence absent"
    ]
  },
  {
    iteration: 2,
    conclusion:
      "The remaining cartography runtime_widening labels are stale or already-live, and the old source-packet lane is blocked; the highest ROI next action is a current formula scope/accuracy ledger that can name a bounded formula family before values move.",
    rejectedDirections: [
      "treating wall concrete heavy-core cartography screening as fresh runtime work after the owner was rejected",
      "reopening timber stud, CLT, or steel fallback labels that are already supported, low-confidence fallback, or handled by later gates",
      "starting broad source crawling or finite scenario packs instead of selecting a formula owner, route boundary, or runtime corridor"
    ]
  }
] as const;

export const POST_V1_GATE_FE_NO_RUNTIME_COUNTERS = {
  blockedOwnerOrHoldoutRows: 3,
  broadSourceCrawlSelected: false,
  candidateCount: 10,
  closedRepeatRows: 2,
  estimatedNextFormulaScopeLedgerRows: 1,
  estimatedNextRuntimeCandidateFamiliesToEvaluate: 6,
  frontendImplementationFilesTouched: 0,
  immediateRuntimeCandidatesSelected: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  roiAnalysisIterations: POST_V1_GATE_FE_ROI_ANALYSIS_ITERATIONS.length,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourcePacketRowsRejectedAsCurrentRuntime: 1,
  sourceRowsImported: 0,
  staleCartographyRuntimeWideningRows: 4
} as const;

export type PostV1GateFECandidateId =
  | typeof POST_V1_GATE_FE_SELECTED_CANDIDATE_ID
  | "broad_source_crawl_confidence_frontend_non_goal"
  | "floor.raw_bare_floating_budget_tightening_rejected_by_gate_fd"
  | "floor.steel_fallback_low_confidence_cartography_stale_after_floor_formula_gates"
  | "rockwool_split_triple_leaf_source_packet_refresh_not_current_runtime_candidate"
  | "wall.clt_formula_cartography_repeat_already_live"
  | "wall.closed_runtime_input_surface_boundary_repeat_group"
  | "wall.concrete_heavy_core_cartography_runtime_widening_stale_after_gate_ey"
  | "wall.heavy_core_lined_massive_runtime_retune_rejected_by_gate_ey"
  | "wall.opening_leak_common_wall_budget_tightening_rejected_by_gate_fb"
  | "wall.timber_stud_formula_cartography_repeat_already_live";

export type PostV1GateFESliceKind =
  | "blocked_non_goal"
  | "blocked_owner_rejected"
  | "blocked_source_packet"
  | "closed_repeat_group"
  | "current_formula_scope_accuracy_gap_ledger"
  | "stale_cartography_runtime_widening";

export type PostV1GateFECandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateFECandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly nextActionMovesRuntimeValues: boolean;
  readonly ownerProofRequiredBeforeRuntime: boolean;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly preservesBoundaryCorrectness: boolean;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateFESliceKind;
  readonly sourceRowsImportedNow: boolean;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementationNow: boolean;
  readonly touchesSharedOrApiSurfaceNow: boolean;
};

export type PostV1GateFECurrentEvidence = {
  readonly gateFDOwnerRejected: true;
  readonly gateFDRuntimeBudgetTighteningAdmitted: 0;
  readonly immediateSafeRuntimeCandidateCount: 0;
  readonly requiresCurrentFormulaScopeLedgerBeforeRuntimeMovement: true;
  readonly selectedCandidateId: typeof POST_V1_GATE_FE_SELECTED_CANDIDATE_ID;
  readonly staleCartographyRuntimeWideningIds: readonly [
    "wall.concrete_heavy_core_screening.field",
    "wall.timber_stud_formula.field",
    "wall.clt_formula.field",
    "floor.steel_fallback_low_confidence.field"
  ];
};

export type PostV1GateFESummary = {
  readonly candidates: readonly PostV1GateFECandidate[];
  readonly currentEvidence: PostV1GateFECurrentEvidence;
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_FE_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_FE_PLAN_DOC_PATH;
  readonly previousGateFD: {
    readonly counters: typeof POST_V1_GATE_FD_COUNTERS;
    readonly landedGate:
      typeof POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_LANDED_GATE;
    readonly ownerDecisionId: typeof POST_V1_GATE_FD_OWNER_DECISION_ID;
    readonly planDocPath: typeof POST_V1_GATE_FD_PLAN_DOC_PATH;
    readonly selectedNextAction:
      typeof POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_ACTION;
    readonly selectedNextFile:
      typeof POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_FILE;
    readonly selectionStatus:
      typeof POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTION_STATUS;
  };
  readonly roiAnalysisIterations: typeof POST_V1_GATE_FE_ROI_ANALYSIS_ITERATIONS;
  readonly selectedCandidateId: typeof POST_V1_GATE_FE_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_FE_TARGET_OUTPUTS;
};

export function buildPostV1GateFECurrentEvidence(): PostV1GateFECurrentEvidence {
  return {
    gateFDOwnerRejected: true,
    gateFDRuntimeBudgetTighteningAdmitted: POST_V1_GATE_FD_COUNTERS.runtimeBudgetTighteningAdmitted,
    immediateSafeRuntimeCandidateCount: 0,
    requiresCurrentFormulaScopeLedgerBeforeRuntimeMovement: true,
    selectedCandidateId: POST_V1_GATE_FE_SELECTED_CANDIDATE_ID,
    staleCartographyRuntimeWideningIds: [
      "wall.concrete_heavy_core_screening.field",
      "wall.timber_stud_formula.field",
      "wall.clt_formula.field",
      "floor.steel_fallback_low_confidence.field"
    ]
  };
}

export function rankPostV1GateFENumericCoverageCandidates():
  readonly PostV1GateFECandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "before: Gate FB, Gate FD, and Gate EY have rejected the obvious budget/retune paths while preserving runtime boundaries",
        "after Gate FF: the engine has a current formula scope/accuracy ledger that names a bounded formula owner/runtime family or proves none is safe",
        "the next value-moving slice can be chosen from current implementation evidence instead of stale cartography labels"
      ],
      id: POST_V1_GATE_FE_SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/layer-combination-resolver-candidate-coverage-matrix-refresh-contract.test.ts",
        "packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts",
        "packages/engine/src/post-v1-current-coverage-accuracy-gap-ledger-gate-fa-contract.test.ts",
        "packages/engine/src/post-v1-floor-raw-bare-and-floating-same-basis-holdout-gate-fd-contract.test.ts",
        "tools/dev/run-calculator-current-gate.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason:
        "Highest ROI after Gate FD: refresh the current formula-scope ledger so the next implementation can improve scope or accuracy through a bounded formula route, not source crawling or stale runtime_widening labels.",
      score: 3.48,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_FILE,
      sliceKind: "current_formula_scope_accuracy_gap_ledger",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_FE_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "Gate FD rejected all three selected floor residual ledgers because admissible same-basis holdouts are absent",
        "future budget tightening still needs exact same-basis measured/source rows",
        "reselecting this now would repeat a closed owner rejection"
      ],
      id: "floor.raw_bare_floating_budget_tightening_rejected_by_gate_fd",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-raw-bare-and-floating-same-basis-holdout-gate-fd-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Accuracy-relevant but closed for the current evidence set by Gate FD.",
      score: 2.08,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_owner_rejected",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50", "CI", "CI,50-2500"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 3,
      expectedBeforeAfter: [
        "Gate FB rejected opening/leak and common-wall same-basis residual ownership",
        "budgets remain frozen until admissible same-basis holdouts exist",
        "Gate FE must not treat this as immediate runtime value movement"
      ],
      id: "wall.opening_leak_common_wall_budget_tightening_rejected_by_gate_fb",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-opening-leak-common-wall-same-basis-residual-owner-gate-fb-contract.test.ts",
        "packages/engine/src/post-v1-current-coverage-accuracy-gap-ledger-gate-fa-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Real accuracy route later, but Gate FB already rejected the current owner proof.",
      score: 1.94,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_owner_rejected",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["R'w", "Dn,w", "DnT,w", "Dn,A", "DnT,A"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 4,
      expectedBeforeAfter: [
        "Gate EY kept the heavy-core / lined-massive owner rejected",
        "MWI.2A and B226010 remain context only",
        "cartography screening must not override the owner rejection"
      ],
      id: "wall.heavy_core_lined_massive_runtime_retune_rejected_by_gate_ey",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-targeted-evidence-acquisition-gate-ey-contract.test.ts",
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Accuracy-relevant wall path, but still blocked by owner rejection.",
      score: 1.72,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_owner_rejected",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["Rw", "STC", "C", "Ctr", "R'w", "Dn,w", "DnT,w"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 5,
      expectedBeforeAfter: [
        "cartography still ranks concrete heavy-core screening as runtime_widening",
        "Gate EY rejected the required admissible owner/evidence path",
        "the label is stale until a new bounded wall lining rule or evidence owner is selected"
      ],
      id: "wall.concrete_heavy_core_cartography_runtime_widening_stale_after_gate_ey",
      implementationEvidencePaths: [
        "packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts",
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-targeted-evidence-acquisition-gate-ey-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Stale runtime_widening label after the owner rejection.",
      score: 1.32,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "stale_cartography_runtime_widening",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["Rw", "STC", "C", "Ctr", "R'w", "Dn,w", "DnT,w"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 6,
      expectedBeforeAfter: [
        "timber stud cartography is supported through the current formula lane",
        "reselecting it would not add layer-template or request-shape scope",
        "any future change must name a fresh topology or accuracy boundary"
      ],
      id: "wall.timber_stud_formula_cartography_repeat_already_live",
      implementationEvidencePaths: [
        "packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts",
        "packages/engine/src/wall-timber-lightweight-source-audit.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Already-live formula lane, not a fresh scope slice.",
      score: 1.08,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "stale_cartography_runtime_widening",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["R'w", "Dn,w", "DnT,w", "DnT,A"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 7,
      expectedBeforeAfter: [
        "CLT wall cartography is supported through the laminated single-leaf formula lane",
        "the current support bucket is already supported",
        "Gate FF may revisit only if it names a new missing CLT formula scope"
      ],
      id: "wall.clt_formula_cartography_repeat_already_live",
      implementationEvidencePaths: [
        "packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts",
        "packages/engine/src/mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Already-live formula lane, not a fresh current gap by itself.",
      score: 1.02,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "stale_cartography_runtime_widening",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["R'w", "Dn,w", "DnT,w", "DnT,A"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 8,
      expectedBeforeAfter: [
        "steel fallback cartography is a low-confidence family fallback",
        "steel visible formula/input-surface gates already handled the bounded steel routes",
        "expanding a fallback without owner terms would weaken accuracy"
      ],
      id: "floor.steel_fallback_low_confidence_cartography_stale_after_floor_formula_gates",
      implementationEvidencePaths: [
        "packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts",
        "packages/engine/src/post-v1-floor-steel-visible-formula-input-surface-parity-gate-dk-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Stale fallback label; the next work must be a bounded owner, not a generic widening.",
      score: 0.94,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "stale_cartography_runtime_widening",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 9,
      expectedBeforeAfter: [
        "old Rockwool split triple-leaf source-packet refresh remains blocked by absent rights-safe payloads",
        "source-packet work is not the current post-FD formula runtime candidate",
        "Gate FE must keep this from becoming a broad source crawl"
      ],
      id: "rockwool_split_triple_leaf_source_packet_refresh_not_current_runtime_candidate",
      implementationEvidencePaths: [
        "packages/engine/src/calculator-source-gap-revalidation-v28-gate-a-contract.test.ts",
        "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: false,
      preservesBoundaryCorrectness: true,
      reason: "Blocked source-packet lane, not an immediate formula scope or runtime slice.",
      score: 0.54,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_source_packet",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["Rw", "STC", "C", "Ctr", "R'w", "DnT,w"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 10,
      expectedBeforeAfter: [
        "closed direct-fixed, ASTM, reinforced-concrete, steel, thick-board, and safety repeats remain documented",
        "non-calculator work stays out of the selected slice",
        "Gate FF must still preserve needs_input and unsupported boundaries"
      ],
      id: "wall.closed_runtime_input_surface_boundary_repeat_group",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-direct-fixed-double-leaf-field-building-adapter-runtime-gate-er-contract.test.ts",
        "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej-contract.test.ts",
        "packages/engine/src/post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et-contract.test.ts",
        "packages/engine/src/post-v1-thick-board-auto-family-boundary-safety-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Closed repeat group; useful as guardrails but not the current next slice.",
      score: 0.42,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_repeat_group",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_FE_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    }
  ] as const satisfies readonly PostV1GateFECandidate[];
}

export function summarizePostV1GateFENumericCoverageGap(): PostV1GateFESummary {
  if (
    POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_LANDED_GATE
  ) {
    throw new Error("Gate FE can only land after Gate FD selects Gate FE.");
  }

  const previousGateFD = summarizePostV1FloorRawBareAndFloatingSameBasisHoldoutGateFD();
  const candidates = rankPostV1GateFENumericCoverageCandidates();
  const selected = candidates.filter((candidate) => candidate.selected);

  if (selected.length !== 1 || selected[0]?.id !== POST_V1_GATE_FE_SELECTED_CANDIDATE_ID) {
    throw new Error("Gate FE must select exactly the current formula scope/accuracy ledger Gate FF.");
  }

  if (selected[0]?.nextActionMovesRuntimeValues || selected[0]?.sourceRowsImportedNow) {
    throw new Error("Gate FE must not move runtime values or import source rows.");
  }

  if (candidates.some((candidate) => candidate.nextActionMovesRuntimeValues)) {
    throw new Error("Gate FE is a no-runtime rerank; all value movement must wait for a selected runtime gate.");
  }

  return {
    candidates,
    currentEvidence: buildPostV1GateFECurrentEvidence(),
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_FE_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_FE_PLAN_DOC_PATH,
    previousGateFD: {
      counters: previousGateFD.counters,
      landedGate: previousGateFD.landedGate,
      ownerDecisionId: previousGateFD.ownerDecisionId,
      planDocPath: previousGateFD.planDocPath,
      selectedNextAction: previousGateFD.selectedNextAction,
      selectedNextFile: previousGateFD.selectedNextFile,
      selectionStatus: previousGateFD.selectionStatus
    },
    roiAnalysisIterations: POST_V1_GATE_FE_ROI_ANALYSIS_ITERATIONS,
    selectedCandidateId: POST_V1_GATE_FE_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_FE_TARGET_OUTPUTS
  };
}

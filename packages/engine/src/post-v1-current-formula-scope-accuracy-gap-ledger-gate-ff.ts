import type { RequestedOutputId } from "@dynecho/shared";

import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTION_STATUS,
  buildLayerCombinationResolverDoubleLeafFramedWallBandedCoverageRefreshContract
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-coverage-refresh";
import {
  POST_V1_GATE_FE_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_FE_PLAN_DOC_PATH,
  POST_V1_GATE_FE_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTION_STATUS,
  summarizePostV1GateFENumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-fe";
import {
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_LANDED_GATE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTION_STATUS
} from "./post-v1-wall-direct-fixed-double-leaf-field-building-adapter-runtime-gate-er";

export const POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_LANDED_GATE =
  "post_v1_current_formula_scope_accuracy_gap_ledger_gate_ff_plan" as const;

export const POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTION_STATUS =
  "post_v1_current_formula_scope_accuracy_gap_ledger_gate_ff_landed_no_runtime_selected_post_double_leaf_framed_wall_banded_coverage_revalidation" as const;

export const POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTED_NEXT_ACTION =
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;

export const POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTED_NEXT_FILE =
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_FILE;

export const POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTED_NEXT_LABEL =
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_LABEL;

export const POST_V1_GATE_FF_SELECTED_CANDIDATE_ID =
  "wall.double_leaf_framed_post_runtime_coverage_revalidation_after_direct_fixed_gate_er" as const;

export const POST_V1_GATE_FF_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_GATE_FE_FF_CURRENT_FORMULA_SCOPE_ACCURACY_LEDGER_PLAN_2026-06-09.md" as const;

export const POST_V1_GATE_FF_TARGET_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_FF_ROI_ANALYSIS_ITERATIONS = [
  {
    iteration: 1,
    conclusion:
      "Gate FF subtracts already-live single-leaf, double-leaf/framed, direct-fixed field/building, A-weighted, ASTM exact-band, and floor DeltaLw runtime routes before selecting new work.",
    rejectedDirections: [
      "reselecting single-leaf mass-law after its owner, formula corridor, runtime basis, and surface parity landed",
      "reselecting non-direct-fixed double-leaf/framed runtime after its coverage refresh landed",
      "reselecting direct-fixed double-leaf field/building after Gate ER promoted that adapter path"
    ]
  },
  {
    iteration: 2,
    conclusion:
      "The only current open formula-scope item with live evidence is the post double-leaf/framed coverage revalidation, which must rerank remaining wall/floor gaps after double-leaf and direct-fixed routes are both live.",
    rejectedDirections: [
      "treating owner-rejected heavy-core, floor holdout, opening/leak residual, or Rockwool source-packet lanes as runtime-ready",
      "using company-internal rehearsal or candidate coverage refresh again after those historical selected-next chains already landed",
      "starting broad source crawling instead of a bounded post-runtime revalidation"
    ]
  }
] as const;

export const POST_V1_GATE_FF_NO_RUNTIME_COUNTERS = {
  blockedOwnerOrHoldoutRows: 3,
  broadSourceCrawlSelected: false,
  candidateCount: 10,
  closedRuntimeRowsRechecked: 5,
  estimatedNextPostDoubleLeafRevalidationRows: 1,
  estimatedNextRuntimeCandidateFamiliesToRerank: 4,
  frontendImplementationFilesTouched: 0,
  immediateRuntimeCandidatesSelected: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  openHistoricalSelectedNextFilesStillMissing: 1,
  roiAnalysisIterations: POST_V1_GATE_FF_ROI_ANALYSIS_ITERATIONS.length,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

export type PostV1GateFFCandidateId =
  | typeof POST_V1_GATE_FF_SELECTED_CANDIDATE_ID
  | "broad_source_crawl_confidence_frontend_non_goal"
  | "company_internal_rehearsal_chain_already_landed"
  | "floor.raw_bare_floating_holdout_owner_rejected"
  | "layer_combination_resolver_candidate_matrix_refresh_already_landed"
  | "wall.direct_fixed_double_leaf_field_building_already_live"
  | "wall.double_leaf_framed_runtime_already_live"
  | "wall.heavy_core_lined_massive_owner_rejected"
  | "wall.opening_leak_common_wall_budget_owner_rejected"
  | "wall.single_leaf_mass_law_runtime_already_live";

export type PostV1GateFFSliceKind =
  | "blocked_non_goal"
  | "blocked_owner_rejected"
  | "closed_historical_selection"
  | "closed_runtime_route"
  | "current_post_runtime_revalidation";

export type PostV1GateFFCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateFFCandidateId;
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
  readonly sliceKind: PostV1GateFFSliceKind;
  readonly sourceRowsImportedNow: boolean;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementationNow: boolean;
};

export type PostV1GateFFCurrentEvidence = {
  readonly doubleLeafCoverageRefreshSelectedPostRevalidation: true;
  readonly gateERDirectFixedFieldBuildingRuntimeLanded: true;
  readonly gateFESelectedGateFF: true;
  readonly immediateSafeRuntimeCandidateCount: 0;
  readonly selectedCandidateId: typeof POST_V1_GATE_FF_SELECTED_CANDIDATE_ID;
};

export type PostV1GateFFSummary = {
  readonly candidates: readonly PostV1GateFFCandidate[];
  readonly currentEvidence: PostV1GateFFCurrentEvidence;
  readonly landedGate: typeof POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_FF_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_FF_PLAN_DOC_PATH;
  readonly previousDoubleLeafCoverageRefresh: {
    readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_LANDED_GATE;
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTION_STATUS;
  };
  readonly previousGateFE: {
    readonly counters: typeof POST_V1_GATE_FE_NO_RUNTIME_COUNTERS;
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_LANDED_GATE;
    readonly planDocPath: typeof POST_V1_GATE_FE_PLAN_DOC_PATH;
    readonly selectedCandidateId: typeof POST_V1_GATE_FE_SELECTED_CANDIDATE_ID;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTION_STATUS;
  };
  readonly roiAnalysisIterations: typeof POST_V1_GATE_FF_ROI_ANALYSIS_ITERATIONS;
  readonly selectedCandidateId: typeof POST_V1_GATE_FF_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_FF_TARGET_OUTPUTS;
};

export function buildPostV1GateFFCurrentEvidence(): PostV1GateFFCurrentEvidence {
  const gateFE = summarizePostV1GateFENumericCoverageGap();
  const doubleLeafRefresh = buildLayerCombinationResolverDoubleLeafFramedWallBandedCoverageRefreshContract();
  const doubleLeafCoverageRefreshSelectedPostRevalidation =
    doubleLeafRefresh.selectedNextAction ===
    LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_ACTION;
  const gateERDirectFixedFieldBuildingRuntimeLanded =
    POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTION_STATUS ===
    "post_v1_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er_landed_runtime_selected_next_numeric_coverage_gap_gate_es";
  const gateFESelectedGateFF =
    gateFE.selectedNextAction === POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_LANDED_GATE;

  if (!doubleLeafCoverageRefreshSelectedPostRevalidation) {
    throw new Error("Gate FF expected double-leaf coverage refresh to select post double-leaf revalidation.");
  }

  if (!gateERDirectFixedFieldBuildingRuntimeLanded) {
    throw new Error("Gate FF expected Gate ER direct-fixed field/building runtime to be landed.");
  }

  if (!gateFESelectedGateFF) {
    throw new Error("Gate FF expected Gate FE to select Gate FF.");
  }

  return {
    doubleLeafCoverageRefreshSelectedPostRevalidation: true,
    gateERDirectFixedFieldBuildingRuntimeLanded: true,
    gateFESelectedGateFF: true,
    immediateSafeRuntimeCandidateCount: 0,
    selectedCandidateId: POST_V1_GATE_FF_SELECTED_CANDIDATE_ID
  };
}

export function rankPostV1GateFFFormulaScopeCandidates():
  readonly PostV1GateFFCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "before: single-leaf and double-leaf/framed source-absent formula runtimes are live and Gate ER added direct-fixed field/building adapters",
        "after next action: remaining double-leaf-related boundaries are reranked against current runtime evidence instead of stale pre-ER assumptions",
        "the following slice can pick a bounded owner/runtime candidate, holdout target, or prove no safe movement"
      ],
      id: POST_V1_GATE_FF_SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-coverage-refresh.ts",
        "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-coverage-refresh-contract.test.ts",
        "packages/engine/src/post-v1-wall-direct-fixed-double-leaf-field-building-adapter-runtime-gate-er-contract.test.ts",
        "packages/engine/src/post-v1-thick-board-auto-family-boundary-safety-contract.test.ts",
        "tools/dev/run-calculator-current-gate.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason:
        "Highest ROI current formula-scope action: complete the already-selected post double-leaf/framed coverage revalidation now that both non-direct-fixed and direct-fixed double-leaf routes are live.",
      score: 3.62,
      selected: true,
      selectedNextActionIfSelected: POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTED_NEXT_FILE,
      sliceKind: "current_post_runtime_revalidation",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_FF_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "single-leaf mass-law owner, formula corridor, runtime basis, and surface parity have already landed",
        "the current candidate trace is visible and budgeted",
        "reselecting it would not add scope"
      ],
      id: "wall.single_leaf_mass_law_runtime_already_live",
      implementationEvidencePaths: [
        "packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-runtime-corridor-contract.test.ts",
        "packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-surface-parity-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Closed runtime route; useful as evidence, not the next slice.",
      score: 2.46,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_route",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr"] as const,
      touchesFrontendImplementationNow: false
    },
    {
      candidateOrder: 3,
      expectedBeforeAfter: [
        "double-leaf/framed owner, formula corridor, runtime basis, surface parity, and coverage refresh have already landed",
        "the refresh selected post double-leaf revalidation as the open follow-up",
        "reselecting the closed runtime corridor would skip the required current rerank"
      ],
      id: "wall.double_leaf_framed_runtime_already_live",
      implementationEvidencePaths: [
        "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-runtime-corridor-contract.test.ts",
        "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-coverage-refresh-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Closed runtime route; Gate FF should select its open post-runtime revalidation instead.",
      score: 2.22,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_route",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_FF_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      candidateOrder: 4,
      expectedBeforeAfter: [
        "Gate ER already promoted direct-fixed field/building adapters",
        "its runtime route selected Gate ES and is no longer a fresh direct-fixed gap",
        "the impact of direct-fixed closure should be folded into the post double-leaf revalidation"
      ],
      id: "wall.direct_fixed_double_leaf_field_building_already_live",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-direct-fixed-double-leaf-field-building-adapter-runtime-gate-er-contract.test.ts",
        "docs/calculator/CHECKPOINT_2026-06-08_GATE_ER_RUNTIME_HANDOFF.md"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Already-live runtime route; revalidation, not reimplementation, is the next correct step.",
      score: 2.05,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_route",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["R'w", "Dn,w", "DnT,w", "DnT,A"] as const,
      touchesFrontendImplementationNow: false
    },
    {
      candidateOrder: 5,
      expectedBeforeAfter: [
        "candidate matrix refresh landed and selected company-internal V0 rehearsal",
        "company-internal V0 rehearsal then selected single-leaf mass-law, which has since landed",
        "reselecting the matrix refresh would be historical loopback"
      ],
      id: "layer_combination_resolver_candidate_matrix_refresh_already_landed",
      implementationEvidencePaths: [
        "packages/engine/src/layer-combination-resolver-candidate-coverage-matrix-refresh-contract.test.ts",
        "packages/engine/src/layer-combination-resolver-company-internal-v0-rehearsal-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Historical selected-next chain already consumed.",
      score: 1.42,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_historical_selection",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_FF_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      candidateOrder: 6,
      expectedBeforeAfter: [
        "company-internal building/ASTM boundary revalidation and final internal-use rehearsal already landed",
        "the matrix has zero coverage_gap rows",
        "reselecting it would be acceptance rehearsal, not calculator scope"
      ],
      id: "company_internal_rehearsal_chain_already_landed",
      implementationEvidencePaths: [
        "packages/engine/src/company-internal-building-astm-boundary-revalidation-contract.test.ts",
        "packages/engine/src/company-internal-final-internal-use-rehearsal-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Useful validation evidence, but closed as a next implementation path.",
      score: 1.24,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_historical_selection",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_FF_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      candidateOrder: 7,
      expectedBeforeAfter: [
        "Gate FD rejected the floor raw-bare/floating same-basis holdout owner",
        "no admissible holdout set entered after Gate FD",
        "Gate FF must not relabel it as runtime-ready"
      ],
      id: "floor.raw_bare_floating_holdout_owner_rejected",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-raw-bare-and-floating-same-basis-holdout-gate-fd-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Accuracy-relevant but blocked by the latest owner rejection.",
      score: 1.06,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_owner_rejected",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"] as const,
      touchesFrontendImplementationNow: false
    },
    {
      candidateOrder: 8,
      expectedBeforeAfter: [
        "Gate FB rejected same-basis opening/leak and common-wall residual ownership",
        "runtime values stay frozen until holdouts or a bounded owner exist",
        "Gate FF should not retune from source-absent outputs"
      ],
      id: "wall.opening_leak_common_wall_budget_owner_rejected",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-opening-leak-common-wall-same-basis-residual-owner-gate-fb-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Accuracy-relevant but blocked by owner rejection.",
      score: 0.98,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_owner_rejected",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["R'w", "Dn,w", "DnT,w", "DnT,A"] as const,
      touchesFrontendImplementationNow: false
    },
    {
      candidateOrder: 9,
      expectedBeforeAfter: [
        "Gate EY kept heavy-core / lined-massive owner rejected",
        "MWI.2A and B226010 remain evidence context only",
        "runtime retune still needs an accepted wall-specific owner or bounded rule"
      ],
      id: "wall.heavy_core_lined_massive_owner_rejected",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-targeted-evidence-acquisition-gate-ey-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Blocked by current owner rejection.",
      score: 0.88,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_owner_rejected",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["Rw", "STC", "C", "Ctr", "R'w", "DnT,w"] as const,
      touchesFrontendImplementationNow: false
    },
    {
      candidateOrder: 10,
      expectedBeforeAfter: [
        "source crawling does not calculate infinite layer combinations",
        "sources enter only as exact rows, anchors, or holdouts for a named route",
        "Gate FF selection must stay calculator-first"
      ],
      id: "broad_source_crawl_confidence_frontend_non_goal",
      implementationEvidencePaths: [
        "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
        "AGENTS.md"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: false,
      preservesBoundaryCorrectness: true,
      reason: "Explicitly not selected by the product north star.",
      score: 0.18,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: POST_V1_GATE_FF_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false
    }
  ] as const satisfies readonly PostV1GateFFCandidate[];
}

export function summarizePostV1GateFFCurrentFormulaScopeAccuracyGapLedger():
  PostV1GateFFSummary {
  const gateFE = summarizePostV1GateFENumericCoverageGap();
  const doubleLeafRefresh = buildLayerCombinationResolverDoubleLeafFramedWallBandedCoverageRefreshContract();
  const candidates = rankPostV1GateFFFormulaScopeCandidates();
  const selected = candidates.filter((candidate) => candidate.selected);

  if (gateFE.selectedNextAction !== POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_LANDED_GATE) {
    throw new Error("Gate FF can only land after Gate FE selects Gate FF.");
  }

  if (
    doubleLeafRefresh.selectedNextAction !==
    POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTED_NEXT_ACTION
  ) {
    throw new Error("Gate FF expected the double-leaf coverage refresh to have selected post double-leaf revalidation.");
  }

  if (selected.length !== 1 || selected[0]?.id !== POST_V1_GATE_FF_SELECTED_CANDIDATE_ID) {
    throw new Error("Gate FF must select exactly the post double-leaf/framed coverage revalidation.");
  }

  if (selected[0]?.nextActionMovesRuntimeValues || selected[0]?.sourceRowsImportedNow) {
    throw new Error("Gate FF must not move runtime values or import source rows.");
  }

  return {
    candidates,
    currentEvidence: buildPostV1GateFFCurrentEvidence(),
    landedGate: POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_FF_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_FF_PLAN_DOC_PATH,
    previousDoubleLeafCoverageRefresh: {
      landedGate: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_LANDED_GATE,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectionStatus: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTION_STATUS
    },
    previousGateFE: {
      counters: POST_V1_GATE_FE_NO_RUNTIME_COUNTERS,
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_LANDED_GATE,
      planDocPath: POST_V1_GATE_FE_PLAN_DOC_PATH,
      selectedCandidateId: POST_V1_GATE_FE_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FE_SELECTION_STATUS
    },
    roiAnalysisIterations: POST_V1_GATE_FF_ROI_ANALYSIS_ITERATIONS,
    selectedCandidateId: POST_V1_GATE_FF_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_FF_TARGET_OUTPUTS
  };
}

export const POST_V1_GATE_FF_LATEST_RUNTIME_CONTEXT = {
  directFixedRuntimeGate: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_LANDED_GATE,
  directFixedRuntimeStatus: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTION_STATUS,
  doubleLeafCoverageRefreshGate: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_LANDED_GATE,
  selectedOpenRevalidationAction: POST_V1_CURRENT_FORMULA_SCOPE_ACCURACY_GAP_LEDGER_GATE_FF_SELECTED_NEXT_ACTION
} as const;

import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_GATE_EY_EVIDENCE_DECISION_ID,
  POST_V1_GATE_EY_NO_RUNTIME_COUNTERS,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_LANDED_GATE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_ACTION,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_FILE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTION_STATUS,
  summarizePostV1WallHeavyCoreLinedMassiveTargetedEvidenceGateEY
} from "./post-v1-wall-heavy-core-lined-massive-targeted-evidence-acquisition-gate-ey";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_ez_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_ez_landed_no_runtime_selected_current_coverage_accuracy_gap_ledger_gate_fa" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_ACTION =
  "post_v1_current_coverage_accuracy_gap_ledger_gate_fa_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-current-coverage-accuracy-gap-ledger-gate-fa-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_LABEL =
  "post-V1 current coverage/accuracy gap ledger Gate FA" as const;

export const POST_V1_GATE_EZ_SELECTED_CANDIDATE_ID =
  "calculator.current_coverage_accuracy_gap_ledger_after_gate_ey_owner_rejection_closeout" as const;

export const POST_V1_GATE_EZ_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_GATE_EZ_FA_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_PLAN_2026-06-09.md" as const;

export const POST_V1_GATE_EZ_SELECTED_TARGET_OUTPUTS = [
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

export const POST_V1_GATE_EZ_ROI_ANALYSIS_ITERATIONS = [
  {
    iteration: 1,
    conclusion:
      "Gate EY closed the heavy-core / lined-massive evidence thread with owner still rejected, so Gate EZ must subtract that route from immediate runtime work along with closed direct-fixed, ASTM, steel, reinforced-concrete, thick-board, and visible-wall repeats.",
    rejectedDirections: [
      "retuning the Gate DG heavy-core / lined-massive bounded_prediction values after MWI.2A and B226010 remained context-only",
      "reopening broad source crawling or source-row import as the next calculator action",
      "repeating already-live direct-fixed field/building, ASTM exact-band, steel visible input, or thick-board safety work"
    ]
  },
  {
    iteration: 2,
    conclusion:
      "The highest ROI next action is a fresh executable current coverage/accuracy gap ledger: after Gate EY the old Gate EV/EX candidate list is exhausted or blocked, so Gate FA must re-read current implementation evidence before any new owner/runtime slice moves values.",
    rejectedDirections: [
      "choosing opening/leak holdout tightening before a current owner ledger names the residual set",
      "selecting formula retune work without route-specific owner, physical-input, metric-basis, and holdout boundaries",
      "spending the next slice on frontend polish, confidence wording, finite scenario packs, or catalog collection"
    ]
  }
] as const;

export const POST_V1_GATE_EZ_NO_RUNTIME_COUNTERS = {
  broadSourceCrawlSelected: false,
  candidateCount: 10,
  estimatedNextBoundaryLedgers: 2,
  estimatedNextGapLedgers: 1,
  estimatedNextRuntimeCandidateFamiliesToEvaluate: 6,
  frontendImplementationFilesTouched: 0,
  heavyCoreLinedMassiveRuntimeStillBlocked: true,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  roiAnalysisIterations: POST_V1_GATE_EZ_ROI_ANALYSIS_ITERATIONS.length,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

export type PostV1GateEZCandidateId =
  | typeof POST_V1_GATE_EZ_SELECTED_CANDIDATE_ID
  | "broad_source_crawl_confidence_frontend_non_goal"
  | "floor.astm_iic_aiic_exact_band_closed_repeat"
  | "floor.reinforced_concrete_visible_derived_closed_repeat"
  | "floor.steel_visible_formula_input_surface_closed_repeat"
  | "opening_leak_holdout_tightening_without_current_owner_ledger_blocked"
  | "wall.direct_fixed_field_building_closed_repeat"
  | "wall.heavy_core_lined_massive_runtime_retune_after_gate_ey_still_blocked"
  | "wall.thick_board_auto_family_closed_safety_repeat"
  | "wall.visible_route_reconciliation_closed_repeat";

export type PostV1GateEZSliceKind =
  | "blocked_holdout_tightening"
  | "blocked_non_goal"
  | "blocked_runtime_retune"
  | "closed_boundary_repeat"
  | "closed_input_surface_repeat"
  | "closed_runtime_repeat"
  | "closed_safety_repeat"
  | "current_coverage_accuracy_gap_ledger";

export type PostV1GateEZCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateEZCandidateId;
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
  readonly sliceKind: PostV1GateEZSliceKind;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementationNow: boolean;
  readonly touchesSharedOrApiSurfaceNow: boolean;
};

export type PostV1GateEZClosedRouteEvidence = {
  readonly heavyCoreOwnerRemainsRejectedAfterGateEY: true;
  readonly mwi2aAndB226010ContextOnly: true;
  readonly oldGateEVEXCandidateListExhaustedOrBlocked: true;
  readonly requiresFreshImplementationLedgerBeforeRuntimeMovement: true;
  readonly selectedCandidateId: typeof POST_V1_GATE_EZ_SELECTED_CANDIDATE_ID;
};

export type PostV1GateEZSummary = {
  readonly candidates: readonly PostV1GateEZCandidate[];
  readonly closedRouteEvidence: PostV1GateEZClosedRouteEvidence;
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_EZ_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_EZ_PLAN_DOC_PATH;
  readonly previousGateEY: {
    readonly counters: typeof POST_V1_GATE_EY_NO_RUNTIME_COUNTERS;
    readonly decisionId: typeof POST_V1_GATE_EY_EVIDENCE_DECISION_ID;
    readonly landedGate: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTION_STATUS;
  };
  readonly roiAnalysisIterations: typeof POST_V1_GATE_EZ_ROI_ANALYSIS_ITERATIONS;
  readonly selectedCandidateId: typeof POST_V1_GATE_EZ_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTION_STATUS;
};

export function buildPostV1GateEZClosedRouteEvidence(): PostV1GateEZClosedRouteEvidence {
  return {
    heavyCoreOwnerRemainsRejectedAfterGateEY: true,
    mwi2aAndB226010ContextOnly: true,
    oldGateEVEXCandidateListExhaustedOrBlocked: true,
    requiresFreshImplementationLedgerBeforeRuntimeMovement: true,
    selectedCandidateId: POST_V1_GATE_EZ_SELECTED_CANDIDATE_ID
  };
}

export function rankPostV1GateEZNumericCoverageCandidates(): readonly PostV1GateEZCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "Gate EY found targeted evidence but kept the heavy-core / lined-massive owner rejected",
        "the old Gate EV/EX list now contains closed repeats, blocked owner gaps, or non-goal work",
        "Gate FA should produce a fresh current coverage/accuracy ledger before any new runtime values move"
      ],
      id: POST_V1_GATE_EZ_SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-current-coverage-accuracy-gap-ledger-gate-ev-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ex-contract.test.ts",
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-targeted-evidence-acquisition-gate-ey-contract.test.ts",
        "tools/dev/run-calculator-current-gate.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason:
        "Highest ROI after Gate EY: re-read current implementation evidence so the next runtime/owner slice is selected from today’s engine behavior rather than stale or now-blocked heavy-core assumptions.",
      score: 3.52,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_FILE,
      sliceKind: "current_coverage_accuracy_gap_ledger",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_EZ_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "Gate EY accepted MWI.2A and B226010 only as targeted context",
        "no runtime-admissible wall-specific source row or bounded wall lining rule was accepted",
        "retuning Gate DG would move values without owner proof"
      ],
      id: "wall.heavy_core_lined_massive_runtime_retune_after_gate_ey_still_blocked",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts",
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-targeted-evidence-acquisition-gate-ey-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Real accuracy route, but still blocked because Gate EY kept the owner rejected.",
      score: 2.05,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_runtime_retune",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["Rw", "STC", "C", "Ctr", "R'w", "Dn,w", "DnT,w"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 3,
      expectedBeforeAfter: [
        "opening/leak adapters are live on several field/building/A-weighted paths",
        "holdout tightening can matter after a current ledger names the residual set",
        "starting here would skip the required current owner and residual-basis selection"
      ],
      id: "opening_leak_holdout_tightening_without_current_owner_ledger_blocked",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts",
        "packages/engine/src/company-internal-final-internal-use-rehearsal-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Potential accuracy work later, but Gate FA should first prove the current residual owner and route priority.",
      score: 1.72,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_holdout_tightening",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["Rw", "R'w", "DnT,w", "DnT,A"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 4,
      expectedBeforeAfter: [
        "Gate ER already made complete direct-fixed field/building requests calculable",
        "missing RT60/support spacing boundaries remain correct",
        "repeating it would not expand scope"
      ],
      id: "wall.direct_fixed_field_building_closed_repeat",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-direct-fixed-double-leaf-field-building-adapter-runtime-gate-er-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Closed runtime repeat.",
      score: 1.12,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_repeat",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["R'w", "Dn,w", "DnT,w"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 5,
      expectedBeforeAfter: [
        "Gate ET already pins reinforced-concrete visible-derived needs_input",
        "complete explicit input still calculates",
        "repeating it would not add scope"
      ],
      id: "floor.reinforced_concrete_visible_derived_closed_repeat",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Closed boundary repeat.",
      score: 0.92,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_boundary_repeat",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Ln,w", "DeltaLw"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 6,
      expectedBeforeAfter: [
        "thick-board Auto family safety is already guarded",
        "true concrete/AAC/brick/CLT massive-core lanes remain live",
        "repeating it would only restate the existing boundary"
      ],
      id: "wall.thick_board_auto_family_closed_safety_repeat",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-thick-board-auto-family-boundary-safety-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Closed safety repeat.",
      score: 0.86,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_safety_repeat",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 7,
      expectedBeforeAfter: [
        "Gate EJ already exposes explicit ASTM exact-band IIC/AIIC",
        "ISO and missing-standard boundaries remain unsupported",
        "repeating it would not add scope"
      ],
      id: "floor.astm_iic_aiic_exact_band_closed_repeat",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Closed input-surface repeat.",
      score: 0.74,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_input_surface_repeat",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["IIC", "AIIC"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 8,
      expectedBeforeAfter: [
        "Gate DK already wires the steel visible formula input surface",
        "ISO DeltaLw and ASTM ratings remain separate",
        "repeating it would not add scope"
      ],
      id: "floor.steel_visible_formula_input_surface_closed_repeat",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-steel-visible-formula-input-surface-parity-gate-dk-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Closed input-surface repeat.",
      score: 0.62,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_input_surface_repeat",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Ln,w", "DeltaLw"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 9,
      expectedBeforeAfter: [
        "Gate EL already reconciled visible wall formula-route probes",
        "Gate EN/EO/ER closed the direct-fixed chain selected after that pass",
        "no fresh visible wall candidate is named by Gate EY"
      ],
      id: "wall.visible_route_reconciliation_closed_repeat",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-visible-layer-formula-route-second-pass-gate-el-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Closed repeat without fresh current evidence.",
      score: 0.54,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_boundary_repeat",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 10,
      expectedBeforeAfter: [
        "broad source crawling, confidence wording, frontend polish, and finite scenarios do not select a formula or boundary owner",
        "Gate FA must stay calculator-led"
      ],
      id: "broad_source_crawl_confidence_frontend_non_goal",
      implementationEvidencePaths: ["AGENTS.md", "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: false,
      preservesBoundaryCorrectness: false,
      reason: "Non-calculator work for this slice.",
      score: 0.1,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: POST_V1_GATE_EZ_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    }
  ] as const satisfies readonly PostV1GateEZCandidate[];
}

export function summarizePostV1GateEZNumericCoverageGap(): PostV1GateEZSummary {
  if (
    POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_LANDED_GATE
  ) {
    throw new Error("Gate EZ can only land after Gate EY selects the next numeric coverage/accuracy rerank.");
  }

  const previousGateEY = summarizePostV1WallHeavyCoreLinedMassiveTargetedEvidenceGateEY();
  const candidates = rankPostV1GateEZNumericCoverageCandidates();
  const selected = candidates.filter((candidate) => candidate.selected);

  if (selected.length !== 1 || selected[0]?.id !== POST_V1_GATE_EZ_SELECTED_CANDIDATE_ID) {
    throw new Error("Gate EZ must select exactly the current coverage/accuracy gap ledger refresh.");
  }

  if (selected.some((candidate) => candidate.nextActionMovesRuntimeValues)) {
    throw new Error("Gate EZ is a no-runtime rerank and cannot move formula values.");
  }

  return {
    candidates,
    closedRouteEvidence: buildPostV1GateEZClosedRouteEvidence(),
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_EZ_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_EZ_PLAN_DOC_PATH,
    previousGateEY: {
      counters: previousGateEY.noRuntimeCounters,
      decisionId: previousGateEY.decision.decisionId,
      landedGate: previousGateEY.landedGate,
      selectedNextAction: previousGateEY.selectedNextAction,
      selectedNextFile: previousGateEY.selectedNextFile,
      selectionStatus: previousGateEY.selectionStatus
    },
    roiAnalysisIterations: POST_V1_GATE_EZ_ROI_ANALYSIS_ITERATIONS,
    selectedCandidateId: POST_V1_GATE_EZ_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTION_STATUS
  };
}

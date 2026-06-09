import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_LANDED_GATE,
  POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTION_STATUS,
  POST_V1_GATE_ET_BOUNDARY_ID,
  POST_V1_GATE_ET_COUNTERS,
  summarizePostV1FloorReinforcedConcreteVisibleDerivedMissingInputBoundaryGateET
} from "./post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_eu_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_eu_landed_no_runtime_selected_current_coverage_accuracy_gap_ledger_gate_ev" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_ACTION =
  "post_v1_current_coverage_accuracy_gap_ledger_gate_ev_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-current-coverage-accuracy-gap-ledger-gate-ev-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_LABEL =
  "post-V1 current coverage/accuracy gap ledger Gate EV" as const;

export const POST_V1_GATE_EU_SELECTED_CANDIDATE_ID =
  "calculator.current_coverage_accuracy_gap_ledger_after_gate_et_and_thick_board" as const;

export const POST_V1_GATE_EU_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_GATE_EU_EV_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_PLAN_2026-06-09.md" as const;

export const POST_V1_GATE_EU_SELECTED_TARGET_OUTPUTS = [
  "Rw",
  "R'w",
  "Dn,w",
  "DnT,w",
  "Ln,w",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "DeltaLw",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_EU_ROI_ANALYSIS_ITERATIONS = [
  {
    iteration: 1,
    conclusion:
      "Gate ET closed the reinforced-concrete visible-derived boundary and the thick-board follow-up closed the Auto board/mass ambiguity, so Gate EU must subtract those closed paths plus direct-fixed field/building, ASTM exact-band, steel visible input, and wall visible-route repeats before selecting new runtime work.",
    rejectedDirections: [
      "repeating Gate ET reinforced-concrete missing-input boundary work",
      "reopening the thick-board route-family safety follow-up as if it were a new runtime scope slice",
      "repeating Gate ER direct-fixed field/building adapter runtime or Gate EL wall visible-route reconciliation"
    ]
  },
  {
    iteration: 2,
    conclusion:
      "The highest ROI next action is an executable current coverage/accuracy gap ledger: it is the smallest no-runtime step that re-reads the current gate, separates already-live routes from true owner/runtime gaps, and prevents the next agent from selecting broad source crawling, confidence wording, or stale closed repeats before values move.",
    rejectedDirections: [
      "retuning a formula without a selected owner and same-family holdout evidence",
      "promoting field/building or ASTM aliases from an ISO/lab route without a selected metric-basis owner",
      "building a finite source-row catalog instead of selecting a formula or boundary owner"
    ]
  }
] as const;

export const POST_V1_GATE_EU_NO_RUNTIME_COUNTERS = {
  candidateCount: 10,
  estimatedNextBoundaryLedgers: 2,
  estimatedNextGapLedgers: 1,
  estimatedNextRuntimeCandidateFamiliesToEvaluate: 6,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  roiAnalysisIterations: POST_V1_GATE_EU_ROI_ANALYSIS_ITERATIONS.length,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

export type PostV1GateEUCandidateId =
  | typeof POST_V1_GATE_EU_SELECTED_CANDIDATE_ID
  | "broad_source_crawl_confidence_frontend_non_goal"
  | "floor.astm_iic_aiic_exact_band_closed_by_ej"
  | "floor.reinforced_concrete_visible_derived_closed_by_et"
  | "floor.steel_visible_formula_input_surface_closed_by_dk"
  | "opening_leak_common_wall_holdout_tightening_blocked"
  | "wall.direct_fixed_field_building_closed_by_er"
  | "wall.heavy_core_lined_massive_direct_retune_blocked"
  | "wall.thick_board_auto_family_boundary_closed_by_safety_guard"
  | "wall.visible_route_reconciliation_closed_by_el";

export type PostV1GateEUSliceKind =
  | "already_live"
  | "blocked_metric_or_basis_derivation"
  | "blocked_non_goal"
  | "closed_boundary_repeat"
  | "closed_input_surface_repeat"
  | "closed_runtime_repeat"
  | "closed_safety_repeat"
  | "current_coverage_accuracy_gap_ledger"
  | "formula_retune_blocked"
  | "source_or_holdout_blocked";

export type PostV1GateEUCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateEUCandidateId;
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
  readonly sliceKind: PostV1GateEUSliceKind;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementationNow: boolean;
  readonly touchesSharedOrApiSurfaceNow: boolean;
};

export type PostV1GateEUClosedRouteEvidence = {
  readonly latestBoundaryId: typeof POST_V1_GATE_ET_BOUNDARY_ID;
  readonly closedByGateET: true;
  readonly closedByThickBoardSafetyGuard: true;
  readonly closedDirectFixedFieldBuildingByGateER: true;
  readonly requiresFreshImplementationLedgerBeforeRuntimeMovement: true;
  readonly selectedCandidateId: typeof POST_V1_GATE_EU_SELECTED_CANDIDATE_ID;
};

export type PostV1GateEUSummary = {
  readonly candidates: readonly PostV1GateEUCandidate[];
  readonly closedRouteEvidence: PostV1GateEUClosedRouteEvidence;
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_EU_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_EU_PLAN_DOC_PATH;
  readonly previousGateET: {
    readonly boundaryId: typeof POST_V1_GATE_ET_BOUNDARY_ID;
    readonly counters: typeof POST_V1_GATE_ET_COUNTERS;
    readonly landedGate:
      typeof POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_LANDED_GATE;
    readonly selectedNextAction:
      typeof POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_ACTION;
    readonly selectedNextFile:
      typeof POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_FILE;
    readonly selectionStatus:
      typeof POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTION_STATUS;
  };
  readonly roiAnalysisIterations: typeof POST_V1_GATE_EU_ROI_ANALYSIS_ITERATIONS;
  readonly selectedCandidateId: typeof POST_V1_GATE_EU_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTION_STATUS;
};

export function buildPostV1GateEUClosedRouteEvidence(): PostV1GateEUClosedRouteEvidence {
  return {
    closedByGateET: true,
    closedByThickBoardSafetyGuard: true,
    closedDirectFixedFieldBuildingByGateER: true,
    latestBoundaryId: POST_V1_GATE_ET_BOUNDARY_ID,
    requiresFreshImplementationLedgerBeforeRuntimeMovement: true,
    selectedCandidateId: POST_V1_GATE_EU_SELECTED_CANDIDATE_ID
  };
}

export function rankPostV1GateEUNumericCoverageCandidates(): readonly PostV1GateEUCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "Gate ET and the thick-board safety guard changed the current implementation posture without selecting a new runtime value movement",
        "many historical visible wall, floor, ASTM, steel, and direct-fixed gaps are now closed or intentionally parked",
        "Gate EV should produce an executable current coverage/accuracy ledger from current gate evidence before selecting an owner/runtime slice"
      ],
      id: POST_V1_GATE_EU_SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts",
        "packages/engine/src/broad-accuracy-reference-benchmark-expansion.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-es-contract.test.ts",
        "packages/engine/src/post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et-contract.test.ts",
        "packages/engine/src/post-v1-thick-board-auto-family-boundary-safety-contract.test.ts",
        "tools/dev/run-calculator-current-gate.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason:
        "Highest ROI after Gate ET: it is a small executable rerank that prevents stale closed work, broad source crawling, or confidence/frontend drift from becoming the next calculator slice, while preparing a concrete owner/runtime selection from current evidence.",
      score: 3.34,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_FILE,
      sliceKind: "current_coverage_accuracy_gap_ledger",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_EU_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "Gate ER already connects complete direct-fixed field_between_rooms and building_prediction requests to owned adapter runtimes",
        "missing receiving-room RT60 and support spacing remain needs_input",
        "repeating this path would not increase scope after Gate ER"
      ],
      id: "wall.direct_fixed_field_building_closed_by_er",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-direct-fixed-double-leaf-field-building-adapter-runtime-gate-er-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Already live after Gate ER.",
      score: 2.18,
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
      candidateOrder: 3,
      expectedBeforeAfter: [
        "Gate ET already pins the visible-derived reinforced-concrete lower-assembly boundary",
        "complete explicit input still calculates Ln,w and DeltaLw",
        "explicit partial input still requires ceilingOrLowerAssembly"
      ],
      id: "floor.reinforced_concrete_visible_derived_closed_by_et",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Closed boundary repeat.",
      score: 2.06,
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
      candidateOrder: 4,
      expectedBeforeAfter: [
        "the 2026-06-09 thick-board guard already blocks generic board/panel/membrane Auto stacks from mass-only lined-massive promotion",
        "true concrete, AAC, brick, and CLT massive-core lanes remain intentionally live",
        "reopening the same safety guard would not select a new scope or accuracy candidate"
      ],
      id: "wall.thick_board_auto_family_boundary_closed_by_safety_guard",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-thick-board-auto-family-boundary-safety-contract.test.ts",
        "docs/calculator/POST_V1_THICK_BOARD_AUTO_FAMILY_BOUNDARY_SAFETY_PLAN_2026-06-09.md"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Closed route-family safety repeat.",
      score: 1.88,
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
      candidateOrder: 5,
      expectedBeforeAfter: [
        "Gate EL already reconciled the visible-wall formula-route pass and found no fresh runtime candidate at that time",
        "Gate EN/EO/ER subsequently closed the selected direct-fixed bridge/adapter chain",
        "Gate EU needs current evidence before reopening a historical visible-wall route"
      ],
      id: "wall.visible_route_reconciliation_closed_by_el",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-visible-layer-formula-route-second-pass-gate-el-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Historical visible-route repeat without fresh evidence.",
      score: 1.12,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_repeat",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 6,
      expectedBeforeAfter: [
        "Gate EH/EJ already prove and expose ASTM exact-band IIC/AIIC when standardMethod is explicit",
        "ISO impact bands, Ln,w, DeltaLw, and missing standard methods still must not publish ASTM ratings",
        "repeating ASTM exact-band input surface work would not widen the current scope"
      ],
      id: "floor.astm_iic_aiic_exact_band_closed_by_ej",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Closed ASTM input-surface repeat.",
      score: 0.94,
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
      candidateOrder: 7,
      expectedBeforeAfter: [
        "Gate DK already carries steel visible formula input through shared/API/server surfaces",
        "ISO DeltaLw still does not alias to ASTM IIC or AIIC",
        "reselecting steel visible surface parity is a closed input-surface repeat"
      ],
      id: "floor.steel_visible_formula_input_surface_closed_by_dk",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-steel-visible-formula-input-surface-parity-gate-dk-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Closed steel surface parity repeat.",
      score: 0.78,
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
      candidateOrder: 8,
      expectedBeforeAfter: [
        "Gate DG already bounded the heavy-core / lined-massive runtime-basis promotion",
        "a direct formula retune would move live values",
        "same-family calibration or holdout ownership must be selected before retuning"
      ],
      id: "wall.heavy_core_lined_massive_direct_retune_blocked",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts",
        "packages/engine/src/reinforced-concrete-family-formula-fit-audit.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Formula retune is useful later, but blocked until a selected evidence owner names the family and holdouts.",
      score: 0.63,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "formula_retune_blocked",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["Rw", "STC", "C", "Ctr"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 9,
      expectedBeforeAfter: [
        "opening/leak and common-wall holdout tightening can improve accuracy only after a selected owner names the route",
        "Gate EU has no current owner selection for this family",
        "starting here would risk broad holdout work without a formula/basis target"
      ],
      id: "opening_leak_common_wall_holdout_tightening_blocked",
      implementationEvidencePaths: [
        "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Source/holdout tightening is blocked until a selected owner names the route and evidence need.",
      score: 0.42,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "source_or_holdout_blocked",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["Rw", "R'w", "DnT,w"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 10,
      expectedBeforeAfter: [
        "broad source crawling, confidence wording, frontend polish, and finite scenario packs do not select a formula, metric basis, or missing-input owner",
        "Gate EU can select the next executable calculator ledger without importing source rows",
        "non-calculator work remains out of scope unless the user explicitly asks for it outside calculator behavior"
      ],
      id: "broad_source_crawl_confidence_frontend_non_goal",
      implementationEvidencePaths: ["AGENTS.md", "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: false,
      preservesBoundaryCorrectness: false,
      reason: "Non-calculator work for this slice.",
      score: 0.2,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: POST_V1_GATE_EU_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    }
  ] as const satisfies readonly PostV1GateEUCandidate[];
}

export function summarizePostV1GateEUNumericCoverageGap(): PostV1GateEUSummary {
  if (
    POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_LANDED_GATE
  ) {
    throw new Error("Gate EU can only land after Gate ET selects the next numeric coverage rerank.");
  }

  const previousGateET =
    summarizePostV1FloorReinforcedConcreteVisibleDerivedMissingInputBoundaryGateET();
  const candidates = rankPostV1GateEUNumericCoverageCandidates();
  const selected = candidates.filter((candidate) => candidate.selected);
  const closedRouteEvidence = buildPostV1GateEUClosedRouteEvidence();

  if (selected.length !== 1 || selected[0]?.id !== POST_V1_GATE_EU_SELECTED_CANDIDATE_ID) {
    throw new Error("Gate EU must select exactly the current coverage/accuracy gap ledger.");
  }

  if (selected.some((candidate) => candidate.nextActionMovesRuntimeValues)) {
    throw new Error("Gate EU is a no-runtime rerank and cannot move formula values.");
  }

  return {
    candidates,
    closedRouteEvidence,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_EU_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_EU_PLAN_DOC_PATH,
    previousGateET: {
      boundaryId: previousGateET.boundaryId,
      counters: previousGateET.counters,
      landedGate:
        POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_LANDED_GATE,
      selectedNextAction: previousGateET.selectedNextAction,
      selectedNextFile: previousGateET.selectedNextFile,
      selectionStatus: previousGateET.selectionStatus
    },
    roiAnalysisIterations: POST_V1_GATE_EU_ROI_ANALYSIS_ITERATIONS,
    selectedCandidateId: POST_V1_GATE_EU_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTION_STATUS
  };
}

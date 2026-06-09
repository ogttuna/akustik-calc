import type { RequestedOutputId } from "@dynecho/shared";

import {
  evaluatePostV1GateCLResidualLedgers,
  type PostV1GateCLResidualLedger
} from "./post-v1-next-numeric-coverage-gap-gate-cl";
import {
  POST_V1_GATE_FB_COUNTERS,
  POST_V1_GATE_FB_OWNER_DECISION_ID,
  POST_V1_GATE_FB_PLAN_DOC_PATH,
  POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_LANDED_GATE,
  POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_ACTION,
  POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_FILE,
  POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTION_STATUS,
  summarizePostV1OpeningLeakCommonWallSameBasisResidualOwnerGateFB
} from "./post-v1-opening-leak-common-wall-same-basis-residual-owner-gate-fb";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_fc_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_fc_landed_no_runtime_selected_floor_raw_bare_and_floating_same_basis_holdout_gate_fd" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_ACTION =
  "post_v1_floor_raw_bare_and_floating_same_basis_holdout_gate_fd_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-raw-bare-and-floating-same-basis-holdout-gate-fd-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_LABEL =
  "post-V1 floor raw-bare and floating same-basis holdout Gate FD" as const;

export const POST_V1_GATE_FC_SELECTED_CANDIDATE_ID =
  "floor.raw_bare_and_floating_same_basis_holdout_prerequisite_after_gate_fb" as const;

export const POST_V1_GATE_FC_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_GATE_FC_FD_FLOOR_RAW_BARE_FLOATING_HOLDOUT_PLAN_2026-06-09.md" as const;

export const POST_V1_GATE_FC_TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "CI",
  "CI,50-2500"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_FC_SELECTED_RESIDUAL_LEDGER_IDS = [
  "floor.open_box_timber.raw_bare_lab_impact",
  "floor.open_web_steel.raw_bare_lab_impact",
  "floor.heavy_floating_upper_treatment.field_companion_gate_ch"
] as const;

export const POST_V1_GATE_FC_ROI_ANALYSIS_ITERATIONS = [
  {
    iteration: 1,
    conclusion:
      "Gate FB rejected the opening/leak and common-wall same-basis residual owner, so Gate FC must not reselect those budget-tightening paths or move their runtime values.",
    rejectedDirections: [
      "tightening opening/leak field, building, or A-weighted budgets without source-owned same-basis holdouts",
      "tightening common flat double-leaf building-prediction budgets from lab or field rows",
      "using confidence wording, finite scenario packs, or frontend polish as a calculator substitute"
    ]
  },
  {
    iteration: 2,
    conclusion:
      "After subtracting Gate FB-blocked wall residuals, Gate EY/EW-rejected heavy-core retunes, and already-closed runtime/input-surface repeats, the only current accuracy candidate with bounded next work is the floor raw-bare/floating residual holdout prerequisite.",
    rejectedDirections: [
      "retuning raw-bare or floating floor budgets while Gate CL residual ledgers still have empty holdoutRowIds",
      "broad source crawling for arbitrary assemblies instead of the three named same-basis floor residual ledgers",
      "reopening closed direct-fixed, reinforced-concrete visible-derived, thick-board safety, ASTM exact-band, or steel visible input-surface work"
    ]
  }
] as const;

export const POST_V1_GATE_FC_NO_RUNTIME_COUNTERS = {
  blockedByGateFBOwnerRejectionRows: 2,
  blockedHeavyCoreOwnerRejectedRows: 1,
  broadSourceCrawlSelected: false,
  candidateCount: 10,
  closedRepeatRows: 5,
  estimatedNextTargetedHoldoutLedgers: POST_V1_GATE_FC_SELECTED_RESIDUAL_LEDGER_IDS.length,
  floorResidualLedgersSelected: POST_V1_GATE_FC_SELECTED_RESIDUAL_LEDGER_IDS.length,
  frontendImplementationFilesTouched: 0,
  immediateRuntimeCandidatesSelected: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  roiAnalysisIterations: POST_V1_GATE_FC_ROI_ANALYSIS_ITERATIONS.length,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

export type PostV1GateFCCandidateId =
  | typeof POST_V1_GATE_FC_SELECTED_CANDIDATE_ID
  | "broad_source_crawl_confidence_frontend_non_goal"
  | "floor.astm_iic_aiic_exact_band_closed_repeat"
  | "floor.reinforced_concrete_visible_derived_closed_repeat"
  | "floor.steel_visible_formula_input_surface_closed_repeat"
  | "wall.common_flat_double_leaf_building_budget_tightening_rejected_by_gate_fb"
  | "wall.direct_fixed_field_building_closed_repeat"
  | "wall.heavy_core_lined_massive_owner_still_rejected_after_gate_ey"
  | "wall.opening_leak_field_building_a_weighted_budget_tightening_rejected_by_gate_fb"
  | "wall.thick_board_auto_family_closed_safety_repeat";

export type PostV1GateFCSliceKind =
  | "blocked_non_goal"
  | "blocked_owner_rejected"
  | "closed_boundary_repeat"
  | "closed_input_surface_repeat"
  | "closed_runtime_repeat"
  | "closed_safety_repeat"
  | "targeted_accuracy_holdout_prerequisite";

export type PostV1GateFCCandidate = {
  readonly candidateOrder: number;
  readonly currentEvidencePaths: readonly string[];
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateFCCandidateId;
  readonly nextActionMovesRuntimeValues: boolean;
  readonly ownerProofRequiredBeforeRuntime: boolean;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly preservesBoundaryCorrectness: boolean;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateFCSliceKind;
  readonly sourceRowsImportedNow: boolean;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementationNow: boolean;
  readonly touchesSharedOrApiSurfaceNow: boolean;
};

export type PostV1GateFCCurrentEvidence = {
  readonly gateFBRejectedOpeningLeakCommonWallOwner: true;
  readonly gateFBRuntimeBudgetTighteningAdmitted: 0;
  readonly immediateValueMovingCandidateCount: 0;
  readonly selectedCandidateId: typeof POST_V1_GATE_FC_SELECTED_CANDIDATE_ID;
  readonly selectedResidualLedgerIds: typeof POST_V1_GATE_FC_SELECTED_RESIDUAL_LEDGER_IDS;
};

export type PostV1GateFCSummary = {
  readonly candidates: readonly PostV1GateFCCandidate[];
  readonly currentEvidence: PostV1GateFCCurrentEvidence;
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_FC_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_FC_PLAN_DOC_PATH;
  readonly previousGateFB: {
    readonly counters: typeof POST_V1_GATE_FB_COUNTERS;
    readonly landedGate: typeof POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_LANDED_GATE;
    readonly ownerDecisionId: typeof POST_V1_GATE_FB_OWNER_DECISION_ID;
    readonly planDocPath: typeof POST_V1_GATE_FB_PLAN_DOC_PATH;
    readonly selectedNextAction:
      typeof POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_ACTION;
    readonly selectedNextFile:
      typeof POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_FILE;
    readonly selectionStatus:
      typeof POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTION_STATUS;
  };
  readonly roiAnalysisIterations: typeof POST_V1_GATE_FC_ROI_ANALYSIS_ITERATIONS;
  readonly selectedCandidateId: typeof POST_V1_GATE_FC_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_LABEL;
  readonly selectedResidualLedgers: readonly PostV1GateCLResidualLedger[];
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_FC_TARGET_OUTPUTS;
};

export function buildPostV1GateFCSelectedFloorResidualLedgers():
  readonly PostV1GateCLResidualLedger[] {
  const residualLedgers = evaluatePostV1GateCLResidualLedgers();
  const byId = new Map(residualLedgers.map((ledger) => [ledger.id, ledger]));
  const selected = POST_V1_GATE_FC_SELECTED_RESIDUAL_LEDGER_IDS.map((id) => {
    const ledger = byId.get(id);

    if (!ledger) {
      throw new Error(`Gate FC requires Gate CL residual ledger ${id}.`);
    }

    return ledger;
  });

  for (const ledger of selected) {
    if (ledger.holdoutRowIds.length > 0 || ledger.budgetTighteningAdmitted) {
      throw new Error("Gate FC must not select runtime floor budget movement while holdouts are absent.");
    }
  }

  return selected;
}

export function buildPostV1GateFCCurrentEvidence(): PostV1GateFCCurrentEvidence {
  return {
    gateFBRejectedOpeningLeakCommonWallOwner: true,
    gateFBRuntimeBudgetTighteningAdmitted: POST_V1_GATE_FB_COUNTERS.runtimeBudgetTighteningAdmitted,
    immediateValueMovingCandidateCount: 0,
    selectedCandidateId: POST_V1_GATE_FC_SELECTED_CANDIDATE_ID,
    selectedResidualLedgerIds: POST_V1_GATE_FC_SELECTED_RESIDUAL_LEDGER_IDS
  };
}

export function rankPostV1GateFCNumericCoverageCandidates():
  readonly PostV1GateFCCandidate[] {
  return [
    {
      candidateOrder: 1,
      currentEvidencePaths: [
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts",
        "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-coverage-refresh-contract.test.ts",
        "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-coverage-refresh-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "before: open-box raw-bare, open-web raw-bare, and heavy floating field companion residual budgets are live but held wide with empty holdoutRowIds",
        "after Gate FD: either source-owned same-basis holdout ledgers exist for these exact floor residual lanes, or the owner remains explicitly rejected with runtime values frozen",
        "future budget tightening can only happen from that bounded evidence, not from source proximity or broad catalog rows"
      ],
      id: POST_V1_GATE_FC_SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason:
        "Highest ROI after Gate FB: all safe immediate wall value movement is blocked or closed, while Gate CL still exposes three floor residual budgets whose accuracy can only improve through targeted same-basis holdout proof.",
      score: 2.62,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_FILE,
      sliceKind: "targeted_accuracy_holdout_prerequisite",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: POST_V1_GATE_FC_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 2,
      currentEvidencePaths: [
        "packages/engine/src/post-v1-opening-leak-common-wall-same-basis-residual-owner-gate-fb-contract.test.ts",
        "packages/engine/src/company-internal-opening-leak-building-runtime-corridor-contract.test.ts",
        "packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "Gate FB rejected same-basis owner proof for opening/leak field, building, and A-weighted residuals",
        "field/building/A-weighted values and budgets stay frozen until new holdouts exist"
      ],
      id: "wall.opening_leak_field_building_a_weighted_budget_tightening_rejected_by_gate_fb",
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Real accuracy route, but Gate FB has just rejected the owner because holdouts are absent.",
      score: 1.24,
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
      candidateOrder: 3,
      currentEvidencePaths: [
        "packages/engine/src/post-v1-opening-leak-common-wall-same-basis-residual-owner-gate-fb-contract.test.ts",
        "packages/engine/src/post-v1-wall-common-auto-topology-expansion-gate-cj-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "Gate FB rejected common flat double-leaf building budget tightening without same-basis building holdouts",
        "Gate CJ building pins remain frozen"
      ],
      id: "wall.common_flat_double_leaf_building_budget_tightening_rejected_by_gate_fb",
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Accuracy-relevant, but still held behind the rejected same-basis owner proof.",
      score: 1.18,
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
      currentEvidencePaths: [
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-targeted-evidence-acquisition-gate-ey-contract.test.ts",
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "Gate EY accepted MWI.2A and B226010 only as context",
        "heavy-core / lined-massive runtime retune remains blocked without a runtime-admissible row or bounded rule"
      ],
      id: "wall.heavy_core_lined_massive_owner_still_rejected_after_gate_ey",
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Real accuracy route, but the owner remains rejected after the targeted evidence pass.",
      score: 1.06,
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
      currentEvidencePaths: [
        "packages/engine/src/post-v1-wall-direct-fixed-double-leaf-field-building-adapter-runtime-gate-er-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "complete direct-fixed field/building requests already calculate through Gate ER",
        "missing RT60/support-spacing boundaries remain correct"
      ],
      id: "wall.direct_fixed_field_building_closed_repeat",
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Closed runtime repeat.",
      score: 0.9,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_repeat",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["R'w", "Dn,w", "DnT,w"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 6,
      currentEvidencePaths: [
        "packages/engine/src/post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "reinforced-concrete visible-derived combined floors correctly ask for dynamic stiffness and load",
        "complete explicit input already calculates"
      ],
      id: "floor.reinforced_concrete_visible_derived_closed_repeat",
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Closed boundary repeat.",
      score: 0.82,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_boundary_repeat",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Ln,w", "DeltaLw"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 7,
      currentEvidencePaths: [
        "packages/engine/src/post-v1-thick-board-auto-family-boundary-safety-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "generic board/panel Auto stacks stay out of mass-only lined_massive promotion",
        "true concrete/AAC/brick/CLT massive-core lanes remain live"
      ],
      id: "wall.thick_board_auto_family_closed_safety_repeat",
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Closed safety repeat.",
      score: 0.76,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_safety_repeat",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 8,
      currentEvidencePaths: [
        "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "explicit ASTM exact bands already publish IIC/AIIC",
        "ISO bands and missing standard methods still do not alias to ASTM ratings"
      ],
      id: "floor.astm_iic_aiic_exact_band_closed_repeat",
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      reason: "Closed metric-basis repeat.",
      score: 0.68,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_input_surface_repeat",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["IIC", "AIIC"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 9,
      currentEvidencePaths: [
        "packages/engine/src/post-v1-floor-steel-visible-formula-input-surface-parity-gate-dk-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "steel visible formula input already reaches the Gate DI/DK owner",
        "ISO DeltaLw remains separated from ASTM ratings"
      ],
      id: "floor.steel_visible_formula_input_surface_closed_repeat",
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
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Ln,w", "DeltaLw"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 10,
      currentEvidencePaths: ["AGENTS.md", "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"],
      expectedBeforeAfter: [
        "broad source crawling, confidence wording, finite scenarios, and frontend polish do not prove a bounded residual owner",
        "Gate FC selects only the named floor holdout prerequisite and imports no rows"
      ],
      id: "broad_source_crawl_confidence_frontend_non_goal",
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: false,
      preservesBoundaryCorrectness: false,
      reason: "Non-calculator work for this slice.",
      score: -2,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: POST_V1_GATE_FC_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    }
  ] as const satisfies readonly PostV1GateFCCandidate[];
}

export function summarizePostV1GateFCNumericCoverageGap(): PostV1GateFCSummary {
  if (
    POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_LANDED_GATE
  ) {
    throw new Error("Gate FC can only land after Gate FB selects Gate FC.");
  }

  const previousGateFB = summarizePostV1OpeningLeakCommonWallSameBasisResidualOwnerGateFB();
  const selectedResidualLedgers = buildPostV1GateFCSelectedFloorResidualLedgers();
  const candidates = rankPostV1GateFCNumericCoverageCandidates();
  const selected = candidates.filter((candidate) => candidate.selected);

  if (selected.length !== 1 || selected[0]?.id !== POST_V1_GATE_FC_SELECTED_CANDIDATE_ID) {
    throw new Error("Gate FC must select exactly the bounded floor raw-bare/floating holdout prerequisite.");
  }

  if (selected[0]?.nextActionMovesRuntimeValues || selected[0]?.sourceRowsImportedNow) {
    throw new Error("Gate FC must not move runtime values or import source rows.");
  }

  return {
    candidates,
    currentEvidence: buildPostV1GateFCCurrentEvidence(),
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_FC_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_FC_PLAN_DOC_PATH,
    previousGateFB: {
      counters: previousGateFB.counters,
      landedGate: previousGateFB.landedGate,
      ownerDecisionId: previousGateFB.ownerDecisionId,
      planDocPath: previousGateFB.planDocPath,
      selectedNextAction: previousGateFB.selectedNextAction,
      selectedNextFile: previousGateFB.selectedNextFile,
      selectionStatus: previousGateFB.selectionStatus
    },
    roiAnalysisIterations: POST_V1_GATE_FC_ROI_ANALYSIS_ITERATIONS,
    selectedCandidateId: POST_V1_GATE_FC_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_LABEL,
    selectedResidualLedgers,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_FC_TARGET_OUTPUTS
  };
}

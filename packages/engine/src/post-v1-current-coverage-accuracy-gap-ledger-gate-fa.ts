import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_GATE_EZ_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EZ_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTION_STATUS,
  summarizePostV1GateEZNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-ez";

export const POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_LANDED_GATE =
  "post_v1_current_coverage_accuracy_gap_ledger_gate_fa_plan" as const;

export const POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTION_STATUS =
  "post_v1_current_coverage_accuracy_gap_ledger_gate_fa_landed_no_runtime_selected_opening_leak_common_wall_same_basis_residual_owner_gate_fb" as const;

export const POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_ACTION =
  "post_v1_opening_leak_common_wall_same_basis_residual_owner_gate_fb_plan" as const;

export const POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-opening-leak-common-wall-same-basis-residual-owner-gate-fb-contract.test.ts" as const;

export const POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_LABEL =
  "post-V1 opening/leak common-wall same-basis residual owner Gate FB" as const;

export const POST_V1_GATE_FA_SELECTED_GAP_ID =
  "wall.opening_leak_common_wall_same_basis_residual_owner_gap_after_gate_ey_owner_rejection_closeout" as const;

export const POST_V1_GATE_FA_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_GATE_FA_FB_OPENING_LEAK_COMMON_WALL_RESIDUAL_OWNER_PLAN_2026-06-09.md" as const;

export const POST_V1_GATE_FA_TARGET_OUTPUTS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "Dn,A",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_FA_NO_RUNTIME_COUNTERS = {
  blockedHeavyCoreOwnerRejectedRows: 1,
  blockedNonGoalRows: 1,
  candidateCount: 11,
  closedRepeatRows: 5,
  currentEvidenceSurfaces: 11,
  estimatedNextBoundaryLedgers: 3,
  estimatedNextOwnerLedgers: 1,
  estimatedNextRuntimeCandidateFamiliesAfterOwner: 2,
  frontendImplementationFilesTouched: 0,
  ledgerRows: 11,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  ownerGapRows: 1,
  runtimeBasisPromotions: 0,
  runtimeCandidateRowsHeldBehindOwner: 2,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

export type PostV1GateFAGapId =
  | typeof POST_V1_GATE_FA_SELECTED_GAP_ID
  | "broad_source_crawl_confidence_frontend_non_goal"
  | "floor.astm_iic_aiic_exact_band_closed_repeat"
  | "floor.raw_bare_and_floating_holdout_candidate_not_selected"
  | "floor.reinforced_concrete_visible_derived_closed_repeat"
  | "floor.steel_visible_formula_input_surface_closed_repeat"
  | "wall.common_flat_double_leaf_building_budget_tightening_after_owner"
  | "wall.direct_fixed_field_building_closed_repeat"
  | "wall.heavy_core_lined_massive_owner_still_rejected"
  | "wall.opening_leak_field_building_a_weighted_budget_tightening_after_owner"
  | "wall.thick_board_auto_family_closed_safety_repeat";

export type PostV1GateFAClassification =
  | "accuracy_holdout_candidate"
  | "blocked_non_goal"
  | "blocked_owner_rejected"
  | "closed_repeat"
  | "needs_input_boundary"
  | "owner_gap"
  | "runtime_candidate_after_owner"
  | "unsupported_boundary";

export type PostV1GateFALedgerRow = {
  readonly classification: PostV1GateFAClassification;
  readonly currentEvidence: readonly string[];
  readonly expectedNextEffect: readonly string[];
  readonly id: PostV1GateFAGapId;
  readonly ownerProofRequiredBeforeRuntime: boolean;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly preservesNeedsInputUnsupportedBoundaries: boolean;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sourceRowsImportedNow: boolean;
  readonly sourceRowsRequiredBeforeRuntime: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementationNow: boolean;
  readonly touchesSharedOrApiSurfaceNow: boolean;
  readonly valueMovementAllowedNow: boolean;
};

export type PostV1GateFACurrentImplementationEvidence = {
  readonly gateEYOwnerStillRejected: true;
  readonly gateFAReReadsCurrentMatrixAfterGateEY: true;
  readonly openingLeakAWeightedRuntimeLive: true;
  readonly openingLeakFieldBuildingRuntimeLive: true;
  readonly selectedGapId: typeof POST_V1_GATE_FA_SELECTED_GAP_ID;
};

export type PostV1GateFASummary = {
  readonly currentImplementationEvidence: PostV1GateFACurrentImplementationEvidence;
  readonly landedGate: typeof POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_LANDED_GATE;
  readonly ledgerRows: readonly PostV1GateFALedgerRow[];
  readonly noRuntimeCounters: typeof POST_V1_GATE_FA_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_FA_PLAN_DOC_PATH;
  readonly previousGateEZ: {
    readonly counters: typeof POST_V1_GATE_EZ_NO_RUNTIME_COUNTERS;
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_LANDED_GATE;
    readonly selectedCandidateId: typeof POST_V1_GATE_EZ_SELECTED_CANDIDATE_ID;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTION_STATUS;
  };
  readonly requiredClassifications: readonly PostV1GateFAClassification[];
  readonly selectedGapId: typeof POST_V1_GATE_FA_SELECTED_GAP_ID;
  readonly selectedNextAction: typeof POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTION_STATUS;
};

export const POST_V1_GATE_FA_REQUIRED_CLASSIFICATIONS = [
  "owner_gap",
  "runtime_candidate_after_owner",
  "accuracy_holdout_candidate",
  "blocked_owner_rejected",
  "closed_repeat",
  "needs_input_boundary",
  "unsupported_boundary",
  "blocked_non_goal"
] as const satisfies readonly PostV1GateFAClassification[];

export function buildPostV1GateFACurrentImplementationEvidence():
  PostV1GateFACurrentImplementationEvidence {
  return {
    gateEYOwnerStillRejected: true,
    gateFAReReadsCurrentMatrixAfterGateEY: true,
    openingLeakAWeightedRuntimeLive: true,
    openingLeakFieldBuildingRuntimeLive: true,
    selectedGapId: POST_V1_GATE_FA_SELECTED_GAP_ID
  };
}

export function buildPostV1GateFACurrentCoverageAccuracyLedger():
  readonly PostV1GateFALedgerRow[] {
  return [
    {
      classification: "owner_gap",
      currentEvidence: [
        "packages/engine/src/company-internal-final-internal-use-rehearsal-contract.test.ts",
        "packages/engine/src/company-internal-opening-leak-building-runtime-corridor-contract.test.ts",
        "packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts"
      ],
      expectedNextEffect: [
        "prove same-basis residual owners before tightening opening/leak field/building/A-weighted budgets",
        "carry the common flat double-leaf building residual ledger with the same owner boundary",
        "keep all source-absent runtime values frozen until owner proof passes"
      ],
      id: POST_V1_GATE_FA_SELECTED_GAP_ID,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesNeedsInputUnsupportedBoundaries: true,
      reason:
        "Highest ROI current accuracy gap: opening/leak field/building and A-weighted outputs are now live, but their budgets are still source-absent and Gate CL already recorded same-basis holdout absence. Gate FB should prove the residual owner before any tightening.",
      score: 3.74,
      selected: true,
      selectedNextActionIfSelected:
        POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected:
        POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_FILE,
      sourceRowsImportedNow: false,
      sourceRowsRequiredBeforeRuntime: true,
      targetMetrics: POST_V1_GATE_FA_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false,
      valueMovementAllowedNow: false
    },
    {
      classification: "runtime_candidate_after_owner",
      currentEvidence: [
        "packages/engine/src/company-internal-opening-leak-building-runtime-corridor-contract.test.ts",
        "packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract.test.ts"
      ],
      expectedNextEffect: [
        "tighten or split opening/leak field/building/A-weighted budgets only after Gate FB proves same-basis residual owners",
        "preserve exact A-weighted packet precedence and unsupported ASTM/lab aliases"
      ],
      id: "wall.opening_leak_field_building_a_weighted_budget_tightening_after_owner",
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesNeedsInputUnsupportedBoundaries: true,
      reason: "Real accuracy candidate, but Gate FA must not move values or tighten budgets before owner proof.",
      score: 2.48,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sourceRowsImportedNow: false,
      sourceRowsRequiredBeforeRuntime: true,
      targetMetrics: POST_V1_GATE_FA_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false,
      valueMovementAllowedNow: false
    },
    {
      classification: "runtime_candidate_after_owner",
      currentEvidence: [
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts",
        "packages/engine/src/post-v1-wall-common-auto-topology-expansion-gate-cj-contract.test.ts"
      ],
      expectedNextEffect: [
        "tighten common flat double-leaf building-prediction budget only with same-basis building holdouts",
        "keep lab/field source rows from aliasing to building prediction"
      ],
      id: "wall.common_flat_double_leaf_building_budget_tightening_after_owner",
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesNeedsInputUnsupportedBoundaries: true,
      reason: "Accuracy-relevant companion to opening/leak residuals, but still held behind same-basis owner proof.",
      score: 2.14,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sourceRowsImportedNow: false,
      sourceRowsRequiredBeforeRuntime: true,
      targetMetrics: ["R'w", "DnT,w"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false,
      valueMovementAllowedNow: false
    },
    {
      classification: "accuracy_holdout_candidate",
      currentEvidence: [
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts",
        "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-coverage-refresh-contract.test.ts",
        "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-coverage-refresh-contract.test.ts"
      ],
      expectedNextEffect: [
        "floor raw-bare and floating routes remain useful later accuracy candidates",
        "current selected wall residual owner has higher ROI because live field/building/A-weighted wall outputs already carry wide budgets"
      ],
      id: "floor.raw_bare_and_floating_holdout_candidate_not_selected",
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesNeedsInputUnsupportedBoundaries: true,
      reason: "Useful later, but lower priority than live wall field/building/A-weighted residual ownership.",
      score: 1.88,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sourceRowsImportedNow: false,
      sourceRowsRequiredBeforeRuntime: true,
      targetMetrics: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false,
      valueMovementAllowedNow: false
    },
    {
      classification: "blocked_owner_rejected",
      currentEvidence: [
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-targeted-evidence-acquisition-gate-ey-contract.test.ts",
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew-contract.test.ts"
      ],
      expectedNextEffect: [
        "heavy-core / lined-massive retune remains blocked after Gate EY",
        "runtime values stay frozen until runtime-admissible wall evidence or a bounded wall lining rule exists"
      ],
      id: "wall.heavy_core_lined_massive_owner_still_rejected",
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesNeedsInputUnsupportedBoundaries: true,
      reason: "Real accuracy route, but still blocked because the owner remains rejected.",
      score: 1.62,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sourceRowsImportedNow: false,
      sourceRowsRequiredBeforeRuntime: true,
      targetMetrics: ["Rw", "STC", "C", "Ctr", "R'w", "DnT,w"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false,
      valueMovementAllowedNow: false
    },
    {
      classification: "closed_repeat",
      currentEvidence: [
        "packages/engine/src/post-v1-wall-direct-fixed-double-leaf-field-building-adapter-runtime-gate-er-contract.test.ts"
      ],
      expectedNextEffect: [
        "complete direct-fixed field/building requests already calculate through Gate ER",
        "missing RT60/support spacing boundaries remain correct"
      ],
      id: "wall.direct_fixed_field_building_closed_repeat",
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesNeedsInputUnsupportedBoundaries: true,
      reason: "Closed runtime repeat.",
      score: 1.04,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sourceRowsImportedNow: false,
      sourceRowsRequiredBeforeRuntime: false,
      targetMetrics: ["R'w", "Dn,w", "DnT,w"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false,
      valueMovementAllowedNow: false
    },
    {
      classification: "needs_input_boundary",
      currentEvidence: [
        "packages/engine/src/post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et-contract.test.ts"
      ],
      expectedNextEffect: [
        "reinforced-concrete visible-derived combined floors correctly ask for dynamic stiffness and load",
        "complete explicit input still calculates"
      ],
      id: "floor.reinforced_concrete_visible_derived_closed_repeat",
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesNeedsInputUnsupportedBoundaries: true,
      reason: "Closed boundary repeat.",
      score: 0.94,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sourceRowsImportedNow: false,
      sourceRowsRequiredBeforeRuntime: false,
      targetMetrics: ["Ln,w", "DeltaLw"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false,
      valueMovementAllowedNow: false
    },
    {
      classification: "closed_repeat",
      currentEvidence: [
        "packages/engine/src/post-v1-thick-board-auto-family-boundary-safety-contract.test.ts"
      ],
      expectedNextEffect: [
        "generic board/panel Auto stacks stay out of mass-only lined_massive promotion",
        "true concrete/AAC/brick/CLT massive-core lanes remain live"
      ],
      id: "wall.thick_board_auto_family_closed_safety_repeat",
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesNeedsInputUnsupportedBoundaries: true,
      reason: "Closed safety repeat.",
      score: 0.82,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sourceRowsImportedNow: false,
      sourceRowsRequiredBeforeRuntime: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false,
      valueMovementAllowedNow: false
    },
    {
      classification: "unsupported_boundary",
      currentEvidence: [
        "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej-contract.test.ts"
      ],
      expectedNextEffect: [
        "explicit ASTM exact bands already publish IIC/AIIC",
        "ISO bands and missing standard methods do not alias to ASTM ratings"
      ],
      id: "floor.astm_iic_aiic_exact_band_closed_repeat",
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesNeedsInputUnsupportedBoundaries: true,
      reason: "Closed ASTM metric-basis boundary.",
      score: 0.72,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sourceRowsImportedNow: false,
      sourceRowsRequiredBeforeRuntime: false,
      targetMetrics: ["IIC", "AIIC"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false,
      valueMovementAllowedNow: false
    },
    {
      classification: "closed_repeat",
      currentEvidence: [
        "packages/engine/src/post-v1-floor-steel-visible-formula-input-surface-parity-gate-dk-contract.test.ts"
      ],
      expectedNextEffect: [
        "steel visible formula input already reaches the existing Gate DI/DK owner",
        "ISO DeltaLw remains separated from ASTM ratings"
      ],
      id: "floor.steel_visible_formula_input_surface_closed_repeat",
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesNeedsInputUnsupportedBoundaries: true,
      reason: "Closed input-surface repeat.",
      score: 0.66,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sourceRowsImportedNow: false,
      sourceRowsRequiredBeforeRuntime: false,
      targetMetrics: ["Ln,w", "DeltaLw"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false,
      valueMovementAllowedNow: false
    },
    {
      classification: "blocked_non_goal",
      currentEvidence: ["AGENTS.md", "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"],
      expectedNextEffect: [
        "source crawling, confidence wording, frontend polish, and finite scenario packs do not prove a same-basis residual owner",
        "Gate FA selects a bounded owner proof without importing rows or touching UI"
      ],
      id: "broad_source_crawl_confidence_frontend_non_goal",
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: false,
      preservesNeedsInputUnsupportedBoundaries: false,
      reason: "Non-calculator work for this slice.",
      score: 0.1,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sourceRowsImportedNow: false,
      sourceRowsRequiredBeforeRuntime: true,
      targetMetrics: POST_V1_GATE_FA_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false,
      valueMovementAllowedNow: false
    }
  ] as const satisfies readonly PostV1GateFALedgerRow[];
}

export function summarizePostV1GateFACurrentCoverageAccuracyGapLedger():
  PostV1GateFASummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EZ_SELECTED_NEXT_ACTION !==
    POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_LANDED_GATE
  ) {
    throw new Error("Gate FA can only land after Gate EZ selects the current coverage/accuracy ledger.");
  }

  const previousGateEZ = summarizePostV1GateEZNumericCoverageGap();
  const ledgerRows = buildPostV1GateFACurrentCoverageAccuracyLedger();
  const selected = ledgerRows.filter((row) => row.selected);
  const classifications = new Set(ledgerRows.map((row) => row.classification));

  if (selected.length !== 1 || selected[0]?.id !== POST_V1_GATE_FA_SELECTED_GAP_ID) {
    throw new Error("Gate FA must select exactly the opening/leak common-wall residual owner gap.");
  }

  for (const classification of POST_V1_GATE_FA_REQUIRED_CLASSIFICATIONS) {
    if (!classifications.has(classification)) {
      throw new Error(`Gate FA ledger is missing classification ${classification}.`);
    }
  }

  if (selected[0]?.valueMovementAllowedNow || selected[0]?.sourceRowsImportedNow) {
    throw new Error("Gate FA must not move values or import source rows.");
  }

  return {
    currentImplementationEvidence: buildPostV1GateFACurrentImplementationEvidence(),
    landedGate: POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_LANDED_GATE,
    ledgerRows,
    noRuntimeCounters: POST_V1_GATE_FA_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_FA_PLAN_DOC_PATH,
    previousGateEZ: {
      counters: previousGateEZ.noRuntimeCounters,
      landedGate: previousGateEZ.landedGate,
      selectedCandidateId: previousGateEZ.selectedCandidateId,
      selectedNextAction: previousGateEZ.selectedNextAction,
      selectedNextFile: previousGateEZ.selectedNextFile,
      selectionStatus: previousGateEZ.selectionStatus
    },
    requiredClassifications: POST_V1_GATE_FA_REQUIRED_CLASSIFICATIONS,
    selectedGapId: POST_V1_GATE_FA_SELECTED_GAP_ID,
    selectedNextAction:
      POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_FILE,
    selectedNextLabel:
      POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_LABEL,
    selectionStatus:
      POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTION_STATUS
  };
}

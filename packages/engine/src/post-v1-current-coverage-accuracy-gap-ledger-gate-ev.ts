import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_GATE_EU_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EU_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTION_STATUS,
  summarizePostV1GateEUNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-eu";

export const POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_LANDED_GATE =
  "post_v1_current_coverage_accuracy_gap_ledger_gate_ev_plan" as const;

export const POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTION_STATUS =
  "post_v1_current_coverage_accuracy_gap_ledger_gate_ev_landed_no_runtime_selected_wall_heavy_core_lined_massive_calibration_owner_gate_ew" as const;

export const POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_ACTION =
  "post_v1_wall_heavy_core_lined_massive_calibration_owner_gate_ew_plan" as const;

export const POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew-contract.test.ts" as const;

export const POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_LABEL =
  "post-V1 wall heavy-core / lined-massive calibration owner Gate EW" as const;

export const POST_V1_GATE_EV_SELECTED_GAP_ID =
  "wall.heavy_core_lined_massive_calibration_owner_gap_after_bounded_basis" as const;

export const POST_V1_GATE_EV_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_GATE_EV_EW_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_PLAN_2026-06-09.md" as const;

export const POST_V1_GATE_EV_TARGET_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_EV_NO_RUNTIME_COUNTERS = {
  blockedNonGoalRows: 1,
  blockedSourceOrHoldoutRows: 1,
  closedRepeatRows: 2,
  currentEvidenceSurfaces: 10,
  estimatedNextOwnerLedgers: 1,
  estimatedNextRuntimeCandidateFamiliesAfterOwner: 1,
  frontendImplementationFilesTouched: 0,
  ledgerRows: 10,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  ownerGapRows: 1,
  runtimeBasisPromotions: 0,
  runtimeCandidateRowsHeldBehindOwner: 1,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

export type PostV1GateEVGapId =
  | typeof POST_V1_GATE_EV_SELECTED_GAP_ID
  | "broad_source_crawl_confidence_frontend_non_goal"
  | "floor.astm_iic_aiic_exact_band_metric_boundary"
  | "floor.reinforced_concrete_visible_derived_needs_input_boundary"
  | "floor.steel_visible_formula_input_surface_already_live"
  | "opening_leak_common_wall_holdout_tightening_blocked"
  | "wall.direct_fixed_field_building_adapter_already_live"
  | "wall.heavy_core_lined_massive_runtime_retune_after_owner"
  | "wall.thick_board_auto_family_needs_input_boundary_closed"
  | "wall.visible_route_reconciliation_closed_repeat";

export type PostV1GateEVClassification =
  | "already_live"
  | "blocked_non_goal"
  | "blocked_source_or_holdout"
  | "closed_repeat"
  | "needs_input_boundary"
  | "owner_gap"
  | "runtime_candidate"
  | "unsupported_boundary";

export type PostV1GateEVLedgerRow = {
  readonly classification: PostV1GateEVClassification;
  readonly evidencePaths: readonly string[];
  readonly expectedNextEffect: readonly string[];
  readonly id: PostV1GateEVGapId;
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

export type PostV1GateEVSummary = {
  readonly landedGate: typeof POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_LANDED_GATE;
  readonly ledgerRows: readonly PostV1GateEVLedgerRow[];
  readonly noRuntimeCounters: typeof POST_V1_GATE_EV_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_EV_PLAN_DOC_PATH;
  readonly previousGateEU: {
    readonly counters: typeof POST_V1_GATE_EU_NO_RUNTIME_COUNTERS;
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_LANDED_GATE;
    readonly selectedCandidateId: typeof POST_V1_GATE_EU_SELECTED_CANDIDATE_ID;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTION_STATUS;
  };
  readonly requiredClassifications: readonly PostV1GateEVClassification[];
  readonly selectedGapId: typeof POST_V1_GATE_EV_SELECTED_GAP_ID;
  readonly selectedNextAction: typeof POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTION_STATUS;
};

export const POST_V1_GATE_EV_REQUIRED_CLASSIFICATIONS = [
  "already_live",
  "needs_input_boundary",
  "unsupported_boundary",
  "owner_gap",
  "runtime_candidate",
  "blocked_source_or_holdout",
  "closed_repeat"
] as const satisfies readonly PostV1GateEVClassification[];

export function buildPostV1GateEVCurrentCoverageAccuracyLedger():
  readonly PostV1GateEVLedgerRow[] {
  return [
    {
      classification: "owner_gap",
      evidencePaths: [
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts",
        "packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts",
        "packages/engine/src/broad-accuracy-reference-benchmark-expansion.ts",
        "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"
      ],
      expectedNextEffect: [
        "prove whether the existing bounded lined-massive/heavy-core wall route has a calibration owner",
        "keep the current bounded_prediction values frozen during owner proof",
        "name the exact evidence that would be required before any future retune"
      ],
      id: POST_V1_GATE_EV_SELECTED_GAP_ID,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesNeedsInputUnsupportedBoundaries: true,
      reason:
        "Highest ROI current gap: Gate DG bounded the route without moving values, but the family still lacks a selected calibration/holdout owner before any accuracy retune can be safe.",
      score: 3.22,
      selected: true,
      selectedNextActionIfSelected:
        POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected:
        POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_FILE,
      sourceRowsImportedNow: false,
      sourceRowsRequiredBeforeRuntime: true,
      targetMetrics: POST_V1_GATE_EV_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false,
      valueMovementAllowedNow: false
    },
    {
      classification: "runtime_candidate",
      evidencePaths: [
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts",
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-rule-gate-df-contract.test.ts"
      ],
      expectedNextEffect: [
        "retune or replace the bounded lined-massive formula only after Gate EW proves the owner",
        "preserve current lab and field pins while the owner is absent"
      ],
      id: "wall.heavy_core_lined_massive_runtime_retune_after_owner",
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesNeedsInputUnsupportedBoundaries: true,
      reason: "A real accuracy candidate, but not safe before owner and holdout boundaries are pinned.",
      score: 2.31,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sourceRowsImportedNow: false,
      sourceRowsRequiredBeforeRuntime: true,
      targetMetrics: POST_V1_GATE_EV_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false,
      valueMovementAllowedNow: false
    },
    {
      classification: "already_live",
      evidencePaths: [
        "packages/engine/src/post-v1-wall-direct-fixed-double-leaf-field-building-adapter-runtime-gate-er-contract.test.ts"
      ],
      expectedNextEffect: [
        "complete direct-fixed field/building requests already calculate through Gate ER",
        "missing room RT60 or support spacing remains needs_input"
      ],
      id: "wall.direct_fixed_field_building_adapter_already_live",
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesNeedsInputUnsupportedBoundaries: true,
      reason: "Already live after Gate ER; not a current gap.",
      score: 1.86,
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
      evidencePaths: [
        "packages/engine/src/post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et-contract.test.ts"
      ],
      expectedNextEffect: [
        "visible-derived reinforced concrete correctly asks for dynamic stiffness and load",
        "explicit partial input still requires ceilingOrLowerAssembly"
      ],
      id: "floor.reinforced_concrete_visible_derived_needs_input_boundary",
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesNeedsInputUnsupportedBoundaries: true,
      reason: "Closed by Gate ET and preserved as a needs_input boundary.",
      score: 1.74,
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
      classification: "needs_input_boundary",
      evidencePaths: [
        "packages/engine/src/post-v1-thick-board-auto-family-boundary-safety-contract.test.ts",
        "docs/calculator/POST_V1_THICK_BOARD_AUTO_FAMILY_BOUNDARY_SAFETY_PLAN_2026-06-09.md"
      ],
      expectedNextEffect: [
        "generic board/panel Auto stacks stay out of mass-only lined_massive promotion",
        "true concrete, AAC, brick, and CLT massive-core routes stay live"
      ],
      id: "wall.thick_board_auto_family_needs_input_boundary_closed",
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesNeedsInputUnsupportedBoundaries: true,
      reason: "Closed safety boundary; not a new runtime slice.",
      score: 1.55,
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
      evidencePaths: [
        "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej-contract.test.ts"
      ],
      expectedNextEffect: [
        "explicit ASTM exact bands already publish IIC/AIIC",
        "ISO bands, missing standard methods, and ISO DeltaLw do not alias to ASTM ratings"
      ],
      id: "floor.astm_iic_aiic_exact_band_metric_boundary",
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesNeedsInputUnsupportedBoundaries: true,
      reason: "Closed ASTM surface plus active metric/basis unsupported boundary.",
      score: 1.18,
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
      classification: "already_live",
      evidencePaths: [
        "packages/engine/src/post-v1-floor-steel-visible-formula-input-surface-parity-gate-dk-contract.test.ts"
      ],
      expectedNextEffect: [
        "steel visible formula input already reaches the existing Gate DI/DK owner",
        "ISO DeltaLw remains separated from ASTM ratings"
      ],
      id: "floor.steel_visible_formula_input_surface_already_live",
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesNeedsInputUnsupportedBoundaries: true,
      reason: "Already live through the steel visible input surface.",
      score: 1.02,
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
      evidencePaths: [
        "packages/engine/src/post-v1-wall-visible-layer-formula-route-second-pass-gate-el-contract.test.ts"
      ],
      expectedNextEffect: [
        "Gate EL already reconciled visible wall route probes",
        "Gate EN/EO/ER closed the direct-fixed chain selected after that pass"
      ],
      id: "wall.visible_route_reconciliation_closed_repeat",
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesNeedsInputUnsupportedBoundaries: true,
      reason: "Historical repeat without fresh current evidence.",
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
      classification: "blocked_source_or_holdout",
      evidencePaths: [
        "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts"
      ],
      expectedNextEffect: [
        "holdout tightening can matter after a route owner names the evidence need",
        "starting with broad holdout work would not pick a formula or metric basis"
      ],
      id: "opening_leak_common_wall_holdout_tightening_blocked",
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesNeedsInputUnsupportedBoundaries: true,
      reason: "Potential accuracy work later, blocked for this ledger by missing route owner.",
      score: 0.48,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sourceRowsImportedNow: false,
      sourceRowsRequiredBeforeRuntime: true,
      targetMetrics: ["Rw", "R'w", "DnT,w"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false,
      valueMovementAllowedNow: false
    },
    {
      classification: "blocked_non_goal",
      evidencePaths: ["AGENTS.md", "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"],
      expectedNextEffect: [
        "source crawling, confidence wording, frontend polish, and finite scenario packs do not select a formula or boundary owner",
        "Gate EV can select Gate EW without importing rows or touching UI"
      ],
      id: "broad_source_crawl_confidence_frontend_non_goal",
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: false,
      preservesNeedsInputUnsupportedBoundaries: false,
      reason: "Non-calculator work for this slice.",
      score: 0.2,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sourceRowsImportedNow: false,
      sourceRowsRequiredBeforeRuntime: true,
      targetMetrics: POST_V1_GATE_EV_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false,
      valueMovementAllowedNow: false
    }
  ] as const satisfies readonly PostV1GateEVLedgerRow[];
}

export function summarizePostV1GateEVCurrentCoverageAccuracyGapLedger():
  PostV1GateEVSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EU_SELECTED_NEXT_ACTION !==
    POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_LANDED_GATE
  ) {
    throw new Error("Gate EV can only land after Gate EU selects the current coverage/accuracy ledger.");
  }

  const previousGateEU = summarizePostV1GateEUNumericCoverageGap();
  const ledgerRows = buildPostV1GateEVCurrentCoverageAccuracyLedger();
  const selected = ledgerRows.filter((row) => row.selected);
  const classifications = new Set(ledgerRows.map((row) => row.classification));

  if (selected.length !== 1 || selected[0]?.id !== POST_V1_GATE_EV_SELECTED_GAP_ID) {
    throw new Error("Gate EV must select exactly the heavy-core/lined-massive calibration owner gap.");
  }

  for (const classification of POST_V1_GATE_EV_REQUIRED_CLASSIFICATIONS) {
    if (!classifications.has(classification)) {
      throw new Error(`Gate EV ledger is missing classification ${classification}.`);
    }
  }

  if (selected[0]?.valueMovementAllowedNow || selected[0]?.sourceRowsImportedNow) {
    throw new Error("Gate EV must not move values or import source rows.");
  }

  return {
    landedGate: POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_LANDED_GATE,
    ledgerRows,
    noRuntimeCounters: POST_V1_GATE_EV_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_EV_PLAN_DOC_PATH,
    previousGateEU: {
      counters: previousGateEU.noRuntimeCounters,
      landedGate: previousGateEU.landedGate,
      selectedCandidateId: previousGateEU.selectedCandidateId,
      selectedNextAction: previousGateEU.selectedNextAction,
      selectedNextFile: previousGateEU.selectedNextFile,
      selectionStatus: previousGateEU.selectionStatus
    },
    requiredClassifications: POST_V1_GATE_EV_REQUIRED_CLASSIFICATIONS,
    selectedGapId: POST_V1_GATE_EV_SELECTED_GAP_ID,
    selectedNextAction:
      POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_FILE,
    selectedNextLabel:
      POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_LABEL,
    selectionStatus:
      POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTION_STATUS
  };
}

import type { RequestedOutputId } from "@dynecho/shared";

import {
  buildCompanyInternalOpeningLeakAWeightedRuntimeCorridorContract
} from "./company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract";
import {
  buildCompanyInternalOpeningLeakBuildingRuntimeCorridorContract
} from "./company-internal-opening-leak-building-runtime-corridor-contract";
import {
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB
} from "./company-internal-opening-leak-building-runtime-corridor";
import {
  POST_V1_GATE_CJ_BUILDING_VALUE_PINS
} from "./post-v1-wall-common-auto-topology-expansion-gate-cj";
import {
  evaluatePostV1GateCLResidualLedgers
} from "./post-v1-next-numeric-coverage-gap-gate-cl";
import {
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_LANDED_GATE,
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_ACTION,
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_FILE,
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTION_STATUS,
  POST_V1_GATE_FA_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_FA_PLAN_DOC_PATH,
  POST_V1_GATE_FA_SELECTED_GAP_ID,
  summarizePostV1GateFACurrentCoverageAccuracyGapLedger
} from "./post-v1-current-coverage-accuracy-gap-ledger-gate-fa";

export const POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_LANDED_GATE =
  "post_v1_opening_leak_common_wall_same_basis_residual_owner_gate_fb_plan" as const;

export const POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTION_STATUS =
  "post_v1_opening_leak_common_wall_same_basis_residual_owner_gate_fb_landed_no_runtime_owner_rejected_selected_next_numeric_coverage_gap_gate_fc" as const;

export const POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_fc_plan" as const;

export const POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-fc-contract.test.ts" as const;

export const POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage/accuracy gap Gate FC" as const;

export const POST_V1_GATE_FB_OWNER_DECISION_ID =
  "wall.opening_leak_common_wall.same_basis_residual_owner_rejected_missing_holdouts" as const;

export const POST_V1_GATE_FB_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_GATE_FB_FC_OPENING_LEAK_COMMON_WALL_OWNER_CLOSEOUT_AND_NEXT_NUMERIC_GAP_PLAN_2026-06-09.md" as const;

export const POST_V1_GATE_FB_TARGET_OUTPUTS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "Dn,A",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export type PostV1GateFBOwnerLedgerId =
  | "wall.common_flat_double_leaf_building.same_basis_residual_owner_rejected"
  | "wall.opening_leak_a_weighted_building.same_basis_residual_owner_rejected"
  | "wall.opening_leak_a_weighted_field.same_basis_residual_owner_rejected"
  | "wall.opening_leak_building.same_basis_residual_owner_rejected"
  | "wall.opening_leak_field.same_basis_residual_owner_rejected";

export type PostV1GateFBBasisBoundary =
  | "a_weighted_requires_explicit_frequency_band_set"
  | "building_prediction_rows_do_not_calibrate_field_apparent"
  | "common_wall_lab_field_rows_do_not_calibrate_building_prediction"
  | "exact_same_stack_same_basis_rows_keep_precedence"
  | "field_apparent_rows_do_not_calibrate_building_prediction"
  | "lab_rw_stc_rows_do_not_calibrate_field_building_or_a_weighted"
  | "missing_opening_leak_physical_inputs_stay_needs_input";

export type PostV1GateFBOwnerLedger = {
  readonly budgetTighteningAdmitted: false;
  readonly currentErrorBudgetDb: number;
  readonly currentRuntimeBasisId: string;
  readonly evidencePaths: readonly string[];
  readonly holdoutRowIds: readonly string[];
  readonly id: PostV1GateFBOwnerLedgerId;
  readonly metricBasis:
    | "building_prediction"
    | "building_prediction_a_weighted"
    | "field_apparent"
    | "field_apparent_a_weighted";
  readonly metrics: readonly RequestedOutputId[];
  readonly observedMaeDb: null;
  readonly ownerDecisionId: typeof POST_V1_GATE_FB_OWNER_DECISION_ID;
  readonly ownerStatus: "rejected_missing_same_basis_holdouts";
  readonly reason: string;
  readonly runtimePromotionAllowed: false;
  readonly sourceRowsRequiredBeforeFutureBudgetTightening: true;
};

export type PostV1GateFBFrozenRuntimePin = {
  readonly basisId: string;
  readonly errorBudgetDb: number;
  readonly metrics: Readonly<Record<string, number | null>>;
  readonly supportedTargetOutputs: readonly RequestedOutputId[];
};

export type PostV1GateFBFrozenRuntimePins = {
  readonly commonWallBuildingValuePins: typeof POST_V1_GATE_CJ_BUILDING_VALUE_PINS;
  readonly openingLeakAWeightedBuilding: PostV1GateFBFrozenRuntimePin;
  readonly openingLeakAWeightedField: PostV1GateFBFrozenRuntimePin;
  readonly openingLeakBuilding: PostV1GateFBFrozenRuntimePin;
  readonly openingLeakField: PostV1GateFBFrozenRuntimePin;
};

export const POST_V1_GATE_FB_REJECTED_BOUNDARIES = [
  {
    boundary: "lab_rw_stc_rows_do_not_calibrate_field_building_or_a_weighted",
    reason:
      "Gate S element-lab opening/leak Rw/STC can seed the adapter, but it is not a source-owned field/building/A-weighted residual holdout."
  },
  {
    boundary: "field_apparent_rows_do_not_calibrate_building_prediction",
    reason:
      "Field apparent R'w/Dn,w/DnT,w rows do not include the building-prediction source room, junction, or conservative flanking terms."
  },
  {
    boundary: "building_prediction_rows_do_not_calibrate_field_apparent",
    reason:
      "Building prediction residuals are not field-apparent evidence and cannot tighten field budgets."
  },
  {
    boundary: "a_weighted_requires_explicit_frequency_band_set",
    reason:
      "A-weighted Dn,A/DnT,A remains a separate adapter basis that requires the owned third-octave frequency band set."
  },
  {
    boundary: "common_wall_lab_field_rows_do_not_calibrate_building_prediction",
    reason:
      "Common flat double-leaf lab or field rows do not prove the Gate CJ building-prediction residual budget."
  },
  {
    boundary: "missing_opening_leak_physical_inputs_stay_needs_input",
    reason:
      "Opening/leak field/building requests still require explicit area, room, and flanking physical inputs before runtime promotion."
  },
  {
    boundary: "exact_same_stack_same_basis_rows_keep_precedence",
    reason:
      "If a future same-stack, same-basis source row exists, it must win before any source-absent residual adapter."
  }
] as const satisfies readonly {
  readonly boundary: PostV1GateFBBasisBoundary;
  readonly reason: string;
}[];

export const POST_V1_GATE_FB_COUNTERS = {
  boundaryLedgersPinned: POST_V1_GATE_FB_REJECTED_BOUNDARIES.length,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  ownerLedgersRejected: 5,
  runtimeBasisPromotions: 0,
  runtimeBudgetTighteningAdmitted: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sameBasisHoldoutLedgersMissing: 5,
  sourceRowsImported: 0
} as const;

export type PostV1GateFBSummary = {
  readonly counters: typeof POST_V1_GATE_FB_COUNTERS;
  readonly frozenRuntimePins: PostV1GateFBFrozenRuntimePins;
  readonly landedGate:
    typeof POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly ownerDecisionId: typeof POST_V1_GATE_FB_OWNER_DECISION_ID;
  readonly ownerLedgers: readonly PostV1GateFBOwnerLedger[];
  readonly planDocPath: typeof POST_V1_GATE_FB_PLAN_DOC_PATH;
  readonly previousGateFA: {
    readonly counters: typeof POST_V1_GATE_FA_NO_RUNTIME_COUNTERS;
    readonly landedGate: typeof POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_LANDED_GATE;
    readonly planDocPath: typeof POST_V1_GATE_FA_PLAN_DOC_PATH;
    readonly selectedGapId: typeof POST_V1_GATE_FA_SELECTED_GAP_ID;
    readonly selectedNextAction:
      typeof POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_ACTION;
    readonly selectedNextFile:
      typeof POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_FILE;
    readonly selectionStatus:
      typeof POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTION_STATUS;
  };
  readonly rejectedBoundaries: typeof POST_V1_GATE_FB_REJECTED_BOUNDARIES;
  readonly selectedGapId: typeof POST_V1_GATE_FA_SELECTED_GAP_ID;
  readonly selectedNextAction:
    typeof POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_ACTION;
  readonly selectedNextFile:
    typeof POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_FILE;
  readonly selectedNextLabel:
    typeof POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_LABEL;
  readonly selectionStatus:
    typeof POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_FB_TARGET_OUTPUTS;
};

function pinFromProbe(input: {
  basisId: string | null;
  computedDnADb: number | null;
  computedDnTADb: number | null;
  computedDnTwDb: number | null;
  computedDnWDb: number | null;
  computedRwPrimeDb: number | null;
  errorBudgetDb: number | null;
  supportedTargetOutputs: readonly RequestedOutputId[];
}): PostV1GateFBFrozenRuntimePin {
  if (input.basisId === null || input.errorBudgetDb === null) {
    throw new Error("Gate FB frozen runtime pin requires a promoted runtime basis.");
  }

  return {
    basisId: input.basisId,
    errorBudgetDb: input.errorBudgetDb,
    metrics: {
      "Dn,A": input.computedDnADb,
      "Dn,w": input.computedDnWDb,
      "DnT,A": input.computedDnTADb,
      "DnT,w": input.computedDnTwDb,
      "R'w": input.computedRwPrimeDb
    },
    supportedTargetOutputs: input.supportedTargetOutputs
  };
}

export function buildPostV1GateFBFrozenRuntimePins(): PostV1GateFBFrozenRuntimePins {
  const openingLeak = buildCompanyInternalOpeningLeakBuildingRuntimeCorridorContract();
  const aWeighted = buildCompanyInternalOpeningLeakAWeightedRuntimeCorridorContract();

  return {
    commonWallBuildingValuePins: POST_V1_GATE_CJ_BUILDING_VALUE_PINS,
    openingLeakAWeightedBuilding: pinFromProbe(aWeighted.buildingRuntimeProbe),
    openingLeakAWeightedField: pinFromProbe(aWeighted.fieldRuntimeProbe),
    openingLeakBuilding: pinFromProbe(openingLeak.buildingRuntimeProbe),
    openingLeakField: pinFromProbe(openingLeak.fieldRuntimeProbe)
  };
}

export function buildPostV1GateFBOwnerLedgers(): readonly PostV1GateFBOwnerLedger[] {
  const residualLedgers = evaluatePostV1GateCLResidualLedgers();
  const openingLeakResidual = residualLedgers.find((ledger) =>
    ledger.id === "wall.opening_leak_composite.field_building_gate_ck"
  );
  const commonWallResidual = residualLedgers.find((ledger) =>
    ledger.id === "wall.common_flat_double_leaf.building_prediction_gate_cj"
  );

  if (!openingLeakResidual || !commonWallResidual) {
    throw new Error("Gate FB requires the Gate CL opening/leak and common-wall residual ledgers.");
  }

  return [
    {
      budgetTighteningAdmitted: false,
      currentErrorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB,
      currentRuntimeBasisId: COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
      evidencePaths: [
        "packages/engine/src/company-internal-opening-leak-building-runtime-corridor-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts"
      ],
      holdoutRowIds: openingLeakResidual.holdoutRowIds,
      id: "wall.opening_leak_field.same_basis_residual_owner_rejected",
      metricBasis: "field_apparent",
      metrics: ["R'w", "Dn,w", "DnT,w"] as const,
      observedMaeDb: null,
      ownerDecisionId: POST_V1_GATE_FB_OWNER_DECISION_ID,
      ownerStatus: "rejected_missing_same_basis_holdouts",
      reason:
        "No source-owned same-basis field apparent opening/leak holdouts exist, so the live +/-8 dB field adapter budget must remain frozen.",
      runtimePromotionAllowed: false,
      sourceRowsRequiredBeforeFutureBudgetTightening: true
    },
    {
      budgetTighteningAdmitted: false,
      currentErrorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
      currentRuntimeBasisId: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
      evidencePaths: [
        "packages/engine/src/company-internal-opening-leak-building-runtime-corridor-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts"
      ],
      holdoutRowIds: openingLeakResidual.holdoutRowIds,
      id: "wall.opening_leak_building.same_basis_residual_owner_rejected",
      metricBasis: "building_prediction",
      metrics: ["R'w", "DnT,w"] as const,
      observedMaeDb: null,
      ownerDecisionId: POST_V1_GATE_FB_OWNER_DECISION_ID,
      ownerStatus: "rejected_missing_same_basis_holdouts",
      reason:
        "No source-owned same-basis building-prediction opening/leak holdouts exist, so the live +/-10 dB building adapter budget must remain frozen.",
      runtimePromotionAllowed: false,
      sourceRowsRequiredBeforeFutureBudgetTightening: true
    },
    {
      budgetTighteningAdmitted: false,
      currentErrorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB,
      currentRuntimeBasisId: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
      evidencePaths: [
        "packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts"
      ],
      holdoutRowIds: openingLeakResidual.holdoutRowIds,
      id: "wall.opening_leak_a_weighted_field.same_basis_residual_owner_rejected",
      metricBasis: "field_apparent_a_weighted",
      metrics: ["Dn,A", "DnT,A"] as const,
      observedMaeDb: null,
      ownerDecisionId: POST_V1_GATE_FB_OWNER_DECISION_ID,
      ownerStatus: "rejected_missing_same_basis_holdouts",
      reason:
        "No source-owned same-basis field A-weighted opening/leak holdouts exist, so the live +/-9 dB A-weighted field budget must remain frozen.",
      runtimePromotionAllowed: false,
      sourceRowsRequiredBeforeFutureBudgetTightening: true
    },
    {
      budgetTighteningAdmitted: false,
      currentErrorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_TOLERANCE_DB,
      currentRuntimeBasisId: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
      evidencePaths: [
        "packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts"
      ],
      holdoutRowIds: openingLeakResidual.holdoutRowIds,
      id: "wall.opening_leak_a_weighted_building.same_basis_residual_owner_rejected",
      metricBasis: "building_prediction_a_weighted",
      metrics: ["DnT,A"] as const,
      observedMaeDb: null,
      ownerDecisionId: POST_V1_GATE_FB_OWNER_DECISION_ID,
      ownerStatus: "rejected_missing_same_basis_holdouts",
      reason:
        "No source-owned same-basis building A-weighted opening/leak holdouts exist, so the live +/-11 dB A-weighted building budget must remain frozen.",
      runtimePromotionAllowed: false,
      sourceRowsRequiredBeforeFutureBudgetTightening: true
    },
    {
      budgetTighteningAdmitted: false,
      currentErrorBudgetDb: commonWallResidual.currentErrorBudgetDb,
      currentRuntimeBasisId: "post_v1_wall_common_auto_topology_expansion_gate_cj_building_prediction",
      evidencePaths: [
        "packages/engine/src/post-v1-wall-common-auto-topology-expansion-gate-cj-contract.test.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts"
      ],
      holdoutRowIds: commonWallResidual.holdoutRowIds,
      id: "wall.common_flat_double_leaf_building.same_basis_residual_owner_rejected",
      metricBasis: "building_prediction",
      metrics: ["R'w", "Dn,w", "DnT,w", "Dn,A", "DnT,A"] as const,
      observedMaeDb: null,
      ownerDecisionId: POST_V1_GATE_FB_OWNER_DECISION_ID,
      ownerStatus: "rejected_missing_same_basis_holdouts",
      reason:
        "No source-owned same-basis common-wall building-prediction holdouts exist, so Gate CJ building values stay pinned and untightened.",
      runtimePromotionAllowed: false,
      sourceRowsRequiredBeforeFutureBudgetTightening: true
    }
  ] as const satisfies readonly PostV1GateFBOwnerLedger[];
}

export function summarizePostV1OpeningLeakCommonWallSameBasisResidualOwnerGateFB():
  PostV1GateFBSummary {
  if (
    POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_ACTION !==
    POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_LANDED_GATE
  ) {
    throw new Error("Gate FB can only land after Gate FA selects the same-basis residual owner proof.");
  }

  const previousGateFA = summarizePostV1GateFACurrentCoverageAccuracyGapLedger();
  const ownerLedgers = buildPostV1GateFBOwnerLedgers();
  const ownerLedgersWithHoldouts = ownerLedgers.filter((ledger) => ledger.holdoutRowIds.length > 0);
  const ledgersAllowingBudgetTightening = ownerLedgers.filter((ledger) =>
    ledger.budgetTighteningAdmitted
  );

  if (ownerLedgersWithHoldouts.length > 0 || ledgersAllowingBudgetTightening.length > 0) {
    throw new Error("Gate FB must reject budget tightening while same-basis holdouts are absent.");
  }

  return {
    counters: POST_V1_GATE_FB_COUNTERS,
    frozenRuntimePins: buildPostV1GateFBFrozenRuntimePins(),
    landedGate: POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_LANDED_GATE,
    noRuntimeValueMovement: true,
    ownerDecisionId: POST_V1_GATE_FB_OWNER_DECISION_ID,
    ownerLedgers,
    planDocPath: POST_V1_GATE_FB_PLAN_DOC_PATH,
    previousGateFA: {
      counters: previousGateFA.noRuntimeCounters,
      landedGate: previousGateFA.landedGate,
      planDocPath: previousGateFA.planDocPath,
      selectedGapId: previousGateFA.selectedGapId,
      selectedNextAction: previousGateFA.selectedNextAction,
      selectedNextFile: previousGateFA.selectedNextFile,
      selectionStatus: previousGateFA.selectionStatus
    },
    rejectedBoundaries: POST_V1_GATE_FB_REJECTED_BOUNDARIES,
    selectedGapId: POST_V1_GATE_FA_SELECTED_GAP_ID,
    selectedNextAction:
      POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_FILE,
    selectedNextLabel:
      POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_LABEL,
    selectionStatus:
      POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_FB_TARGET_OUTPUTS
  };
}

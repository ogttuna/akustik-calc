import type { RequestedOutputId } from "@dynecho/shared";

import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_BASIS
} from "./broad-accuracy-floor-open-box-timber-raw-bare-formula-corridor";
import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_BASIS
} from "./broad-accuracy-floor-open-web-raw-bare-formula-corridor";
import type {
  PostV1GateCLResidualLedger,
  PostV1GateCLResidualLedgerId
} from "./post-v1-next-numeric-coverage-gap-gate-cl";
import {
  POST_V1_GATE_CH_FIELD_DIRECT_FLANKING_VALUE_PINS
} from "./post-v1-next-numeric-coverage-gap-gate-ch";
import {
  POST_V1_GATE_FC_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_FC_PLAN_DOC_PATH,
  POST_V1_GATE_FC_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_FC_SELECTED_RESIDUAL_LEDGER_IDS,
  POST_V1_GATE_FC_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTION_STATUS,
  buildPostV1GateFCSelectedFloorResidualLedgers,
  summarizePostV1GateFCNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-fc";

export const POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_LANDED_GATE =
  "post_v1_floor_raw_bare_and_floating_same_basis_holdout_gate_fd_plan" as const;

export const POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTION_STATUS =
  "post_v1_floor_raw_bare_and_floating_same_basis_holdout_gate_fd_landed_no_runtime_owner_rejected_selected_next_numeric_coverage_gap_gate_fe" as const;

export const POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_fe_plan" as const;

export const POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-fe-contract.test.ts" as const;

export const POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage/accuracy gap Gate FE" as const;

export const POST_V1_GATE_FD_OWNER_DECISION_ID =
  "floor.raw_bare_and_floating.same_basis_holdout_owner_rejected_missing_admissible_holdouts" as const;

export const POST_V1_GATE_FD_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_GATE_FD_FE_FLOOR_RAW_BARE_FLOATING_HOLDOUT_CLOSEOUT_PLAN_2026-06-09.md" as const;

export const POST_V1_GATE_FD_TARGET_OUTPUTS = POST_V1_GATE_FC_TARGET_OUTPUTS;

export type PostV1GateFDOwnerLedgerId =
  | "floor.heavy_floating_upper_treatment.field_companion_gate_ch.same_basis_holdout_owner_rejected"
  | "floor.open_box_timber.raw_bare_lab_impact.same_basis_holdout_owner_rejected"
  | "floor.open_web_steel.raw_bare_lab_impact.same_basis_holdout_owner_rejected";

export type PostV1GateFDRejectedEvidenceContextId =
  | "heavy_floating_field_adapter_values_are_source_absent_field_context_outputs"
  | "heavy_floating_published_upper_treatment_ln_w_anchor_not_field_direct_flanking_holdout"
  | "open_box_package_transfer_rows_not_raw_bare_same_basis_holdouts"
  | "open_box_raw_bare_source_absent_formula_outputs_are_not_holdouts"
  | "open_web_raw_bare_source_absent_formula_outputs_are_not_holdouts"
  | "open_web_ubiq_inex_firestop_rows_not_raw_bare_same_basis_holdouts";

export type PostV1GateFDBasisBoundary =
  | "astm_iic_aiic_rows_do_not_alias_to_iso_ln_or_delta_lw"
  | "element_lab_raw_bare_rows_do_not_calibrate_field_direct_flanking_outputs"
  | "exact_same_stack_same_basis_rows_keep_precedence"
  | "missing_route_physical_inputs_stay_needs_input"
  | "packaged_finished_or_supported_band_rows_do_not_calibrate_raw_bare"
  | "published_upper_treatment_ln_w_anchor_does_not_retune_field_direct_flanking_budget"
  | "source_absent_formula_outputs_cannot_be_their_own_holdouts";

export type PostV1GateFDRejectedEvidenceContext = {
  readonly admissibleAsSameBasisHoldout: false;
  readonly evidencePaths: readonly string[];
  readonly id: PostV1GateFDRejectedEvidenceContextId;
  readonly rejectedForLedgerId: PostV1GateCLResidualLedgerId;
  readonly reason: string;
};

export type PostV1GateFDOwnerLedger = {
  readonly budgetTighteningAdmitted: false;
  readonly currentErrorBudgetDb: number;
  readonly currentRuntimeBasisId: string;
  readonly evidencePaths: readonly string[];
  readonly gateCLResidualLedgerId: PostV1GateCLResidualLedgerId;
  readonly holdoutRowIds: readonly string[];
  readonly id: PostV1GateFDOwnerLedgerId;
  readonly metricBasis: string;
  readonly metrics: readonly RequestedOutputId[];
  readonly observedMaeDb: null;
  readonly ownerDecisionId: typeof POST_V1_GATE_FD_OWNER_DECISION_ID;
  readonly ownerStatus: "rejected_missing_admissible_same_basis_holdouts";
  readonly reason: string;
  readonly rejectedEvidenceContextIds: readonly PostV1GateFDRejectedEvidenceContextId[];
  readonly runtimePromotionAllowed: false;
  readonly sourceRowsRequiredBeforeFutureBudgetTightening: true;
};

export type PostV1GateFDFrozenRuntimePins = {
  readonly gateCHFieldDirectFlankingValuePins:
    typeof POST_V1_GATE_CH_FIELD_DIRECT_FLANKING_VALUE_PINS;
  readonly selectedResidualBudgetPins: Readonly<Record<PostV1GateCLResidualLedgerId, number>>;
};

export type PostV1GateFDSummary = {
  readonly counters: typeof POST_V1_GATE_FD_COUNTERS;
  readonly frozenRuntimePins: PostV1GateFDFrozenRuntimePins;
  readonly landedGate:
    typeof POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly ownerDecisionId: typeof POST_V1_GATE_FD_OWNER_DECISION_ID;
  readonly ownerLedgers: readonly PostV1GateFDOwnerLedger[];
  readonly planDocPath: typeof POST_V1_GATE_FD_PLAN_DOC_PATH;
  readonly previousGateFC: {
    readonly counters: typeof POST_V1_GATE_FC_NO_RUNTIME_COUNTERS;
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_LANDED_GATE;
    readonly planDocPath: typeof POST_V1_GATE_FC_PLAN_DOC_PATH;
    readonly selectedCandidateId: typeof POST_V1_GATE_FC_SELECTED_CANDIDATE_ID;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTION_STATUS;
  };
  readonly rejectedBoundaries: typeof POST_V1_GATE_FD_REJECTED_BOUNDARIES;
  readonly rejectedEvidenceContexts: typeof POST_V1_GATE_FD_REJECTED_EVIDENCE_CONTEXTS;
  readonly selectedNextAction:
    typeof POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_ACTION;
  readonly selectedNextFile:
    typeof POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_FILE;
  readonly selectedNextLabel:
    typeof POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_LABEL;
  readonly selectedResidualLedgerIds: typeof POST_V1_GATE_FC_SELECTED_RESIDUAL_LEDGER_IDS;
  readonly selectionStatus:
    typeof POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_FD_TARGET_OUTPUTS;
};

export const POST_V1_GATE_FD_REJECTED_EVIDENCE_CONTEXTS = [
  {
    admissibleAsSameBasisHoldout: false,
    evidencePaths: [
      "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-formula-corridor.ts",
      "packages/engine/src/broad-accuracy-post-raw-bare-open-box-timber-coverage-revalidation-contract.test.ts"
    ],
    id: "open_box_raw_bare_source_absent_formula_outputs_are_not_holdouts",
    reason:
      "Open-box raw-bare runtime rows are source-absent formula outputs with explicit holdout-absence budget terms, so they cannot validate or tighten themselves.",
    rejectedForLedgerId: "floor.open_box_timber.raw_bare_lab_impact"
  },
  {
    admissibleAsSameBasisHoldout: false,
    evidencePaths: [
      "packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-transfer-owner-contract.test.ts",
      "packages/engine/src/broad-accuracy-floor-open-box-timber-raw-bare-reopening-guard-contract.test.ts"
    ],
    id: "open_box_package_transfer_rows_not_raw_bare_same_basis_holdouts",
    reason:
      "Package-transfer and finished open-box rows stay useful context, but they do not share the raw-bare element-lab impact basis.",
    rejectedForLedgerId: "floor.open_box_timber.raw_bare_lab_impact"
  },
  {
    admissibleAsSameBasisHoldout: false,
    evidencePaths: [
      "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-formula-corridor.ts",
      "packages/engine/src/broad-accuracy-post-raw-bare-open-web-coverage-revalidation-contract.test.ts"
    ],
    id: "open_web_raw_bare_source_absent_formula_outputs_are_not_holdouts",
    reason:
      "Open-web raw-bare runtime rows are source-absent formula outputs with explicit carrier-only holdout absence, not source-owned holdouts.",
    rejectedForLedgerId: "floor.open_web_steel.raw_bare_lab_impact"
  },
  {
    admissibleAsSameBasisHoldout: false,
    evidencePaths: [
      "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-coverage-refresh-contract.test.ts",
      "packages/engine/src/open-web-raw-bare-estimate.ts"
    ],
    id: "open_web_ubiq_inex_firestop_rows_not_raw_bare_same_basis_holdouts",
    reason:
      "UBIQ, INEX, firestop, packaged, or supported-band evidence is outside the raw-bare same-basis lab impact ledger.",
    rejectedForLedgerId: "floor.open_web_steel.raw_bare_lab_impact"
  },
  {
    admissibleAsSameBasisHoldout: false,
    evidencePaths: [
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ch-contract.test.ts",
      "packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg2-contract.test.ts"
    ],
    id: "heavy_floating_published_upper_treatment_ln_w_anchor_not_field_direct_flanking_holdout",
    reason:
      "The published upper-treatment Ln,w anchor seeds the field adapter but is not a source-owned direct+flanking field holdout set.",
    rejectedForLedgerId: "floor.heavy_floating_upper_treatment.field_companion_gate_ch"
  },
  {
    admissibleAsSameBasisHoldout: false,
    evidencePaths: [
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ch.ts",
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl.ts"
    ],
    id: "heavy_floating_field_adapter_values_are_source_absent_field_context_outputs",
    reason:
      "Gate CH field values are runtime adapter outputs from explicit field context; they are not measured field residual holdouts for budget retune.",
    rejectedForLedgerId: "floor.heavy_floating_upper_treatment.field_companion_gate_ch"
  }
] as const satisfies readonly PostV1GateFDRejectedEvidenceContext[];

export const POST_V1_GATE_FD_REJECTED_BOUNDARIES = [
  {
    boundary: "exact_same_stack_same_basis_rows_keep_precedence",
    reason:
      "A future exact same-stack, same-basis measured/source row must win before any source-absent residual adapter."
  },
  {
    boundary: "source_absent_formula_outputs_cannot_be_their_own_holdouts",
    reason:
      "Raw-bare open-box and open-web formula outputs carry source-absent design budgets and cannot validate the same budgets."
  },
  {
    boundary: "packaged_finished_or_supported_band_rows_do_not_calibrate_raw_bare",
    reason:
      "Finished packages, UBIQ/INEX/firestop context, and supported-band evidence remain outside raw-bare element-lab impact calibration."
  },
  {
    boundary: "element_lab_raw_bare_rows_do_not_calibrate_field_direct_flanking_outputs",
    reason:
      "Element-lab impact evidence does not prove field apparent direct+flanking residuals without the required field basis."
  },
  {
    boundary: "published_upper_treatment_ln_w_anchor_does_not_retune_field_direct_flanking_budget",
    reason:
      "The Gate CH published upper-treatment Ln,w anchor can seed field calculation but is not a measured field holdout set."
  },
  {
    boundary: "astm_iic_aiic_rows_do_not_alias_to_iso_ln_or_delta_lw",
    reason:
      "ASTM IIC/AIIC exact-band ownership remains separate from ISO Ln,w/DeltaLw/field impact ratings."
  },
  {
    boundary: "missing_route_physical_inputs_stay_needs_input",
    reason:
      "Missing raw-bare carrier fields, field direct/flanking context, or CI,50-2500 owner inputs remain needs_input rather than unsupported retunes."
  }
] as const satisfies readonly {
  readonly boundary: PostV1GateFDBasisBoundary;
  readonly reason: string;
}[];

export const POST_V1_GATE_FD_COUNTERS = {
  admissibleHoldoutLedgers: 0,
  boundaryLedgersPinned: POST_V1_GATE_FD_REJECTED_BOUNDARIES.length,
  broadSourceCrawlSelected: false,
  evaluatedGateCLResidualLedgers: POST_V1_GATE_FC_SELECTED_RESIDUAL_LEDGER_IDS.length,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  ownerLedgersRejected: POST_V1_GATE_FC_SELECTED_RESIDUAL_LEDGER_IDS.length,
  rejectedCandidateEvidenceLedgers: POST_V1_GATE_FD_REJECTED_EVIDENCE_CONTEXTS.length,
  runtimeBasisPromotions: 0,
  runtimeBudgetTighteningAdmitted: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

function requireSelectedResidualLedger(
  ledgers: readonly PostV1GateCLResidualLedger[],
  id: PostV1GateCLResidualLedgerId
): PostV1GateCLResidualLedger {
  const ledger = ledgers.find((candidate) => candidate.id === id);

  if (!ledger) {
    throw new Error(`Gate FD requires selected Gate CL residual ledger ${id}.`);
  }

  return ledger;
}

export function buildPostV1GateFDOwnerLedgers(): readonly PostV1GateFDOwnerLedger[] {
  const selectedResidualLedgers = buildPostV1GateFCSelectedFloorResidualLedgers();
  const openBox = requireSelectedResidualLedger(
    selectedResidualLedgers,
    "floor.open_box_timber.raw_bare_lab_impact"
  );
  const openWeb = requireSelectedResidualLedger(
    selectedResidualLedgers,
    "floor.open_web_steel.raw_bare_lab_impact"
  );
  const heavyFloating = requireSelectedResidualLedger(
    selectedResidualLedgers,
    "floor.heavy_floating_upper_treatment.field_companion_gate_ch"
  );

  return [
    {
      budgetTighteningAdmitted: false,
      currentErrorBudgetDb: openBox.currentErrorBudgetDb,
      currentRuntimeBasisId: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_RAW_BARE_FORMULA_CORRIDOR_BASIS,
      evidencePaths: openBox.evidencePaths,
      gateCLResidualLedgerId: openBox.id,
      holdoutRowIds: openBox.holdoutRowIds,
      id: "floor.open_box_timber.raw_bare_lab_impact.same_basis_holdout_owner_rejected",
      metricBasis: openBox.metricBasis,
      metrics: openBox.metrics,
      observedMaeDb: null,
      ownerDecisionId: POST_V1_GATE_FD_OWNER_DECISION_ID,
      ownerStatus: "rejected_missing_admissible_same_basis_holdouts",
      reason:
        "No source-owned same-basis raw-bare open-box element-lab impact holdouts exist; the +/-9 dB source-absent design budget must remain frozen.",
      rejectedEvidenceContextIds: [
        "open_box_raw_bare_source_absent_formula_outputs_are_not_holdouts",
        "open_box_package_transfer_rows_not_raw_bare_same_basis_holdouts"
      ],
      runtimePromotionAllowed: false,
      sourceRowsRequiredBeforeFutureBudgetTightening: true
    },
    {
      budgetTighteningAdmitted: false,
      currentErrorBudgetDb: openWeb.currentErrorBudgetDb,
      currentRuntimeBasisId: BROAD_ACCURACY_FLOOR_OPEN_WEB_RAW_BARE_FORMULA_CORRIDOR_BASIS,
      evidencePaths: openWeb.evidencePaths,
      gateCLResidualLedgerId: openWeb.id,
      holdoutRowIds: openWeb.holdoutRowIds,
      id: "floor.open_web_steel.raw_bare_lab_impact.same_basis_holdout_owner_rejected",
      metricBasis: openWeb.metricBasis,
      metrics: openWeb.metrics,
      observedMaeDb: null,
      ownerDecisionId: POST_V1_GATE_FD_OWNER_DECISION_ID,
      ownerStatus: "rejected_missing_admissible_same_basis_holdouts",
      reason:
        "No source-owned same-basis raw-bare open-web element-lab impact holdouts exist; the +/-9 dB source-absent design budget must remain frozen.",
      rejectedEvidenceContextIds: [
        "open_web_raw_bare_source_absent_formula_outputs_are_not_holdouts",
        "open_web_ubiq_inex_firestop_rows_not_raw_bare_same_basis_holdouts"
      ],
      runtimePromotionAllowed: false,
      sourceRowsRequiredBeforeFutureBudgetTightening: true
    },
    {
      budgetTighteningAdmitted: false,
      currentErrorBudgetDb: heavyFloating.currentErrorBudgetDb,
      currentRuntimeBasisId: "post_v1_gate_ch_field_direct_flanking_published_upper_treatment_adapter",
      evidencePaths: heavyFloating.evidencePaths,
      gateCLResidualLedgerId: heavyFloating.id,
      holdoutRowIds: heavyFloating.holdoutRowIds,
      id: "floor.heavy_floating_upper_treatment.field_companion_gate_ch.same_basis_holdout_owner_rejected",
      metricBasis: heavyFloating.metricBasis,
      metrics: heavyFloating.metrics,
      observedMaeDb: null,
      ownerDecisionId: POST_V1_GATE_FD_OWNER_DECISION_ID,
      ownerStatus: "rejected_missing_admissible_same_basis_holdouts",
      reason:
        "No measured field direct+flanking holdout set exists for the Gate CH heavy floating upper-treatment field companion; the +/-8 dB residual budget must remain frozen.",
      rejectedEvidenceContextIds: [
        "heavy_floating_published_upper_treatment_ln_w_anchor_not_field_direct_flanking_holdout",
        "heavy_floating_field_adapter_values_are_source_absent_field_context_outputs"
      ],
      runtimePromotionAllowed: false,
      sourceRowsRequiredBeforeFutureBudgetTightening: true
    }
  ] as const satisfies readonly PostV1GateFDOwnerLedger[];
}

export function buildPostV1GateFDFrozenRuntimePins(): PostV1GateFDFrozenRuntimePins {
  const selectedResidualLedgers = buildPostV1GateFCSelectedFloorResidualLedgers();
  const selectedResidualBudgetPins = Object.fromEntries(
    selectedResidualLedgers.map((ledger) => [ledger.id, ledger.currentErrorBudgetDb])
  ) as Readonly<Record<PostV1GateCLResidualLedgerId, number>>;

  return {
    gateCHFieldDirectFlankingValuePins: POST_V1_GATE_CH_FIELD_DIRECT_FLANKING_VALUE_PINS,
    selectedResidualBudgetPins
  };
}

export function summarizePostV1FloorRawBareAndFloatingSameBasisHoldoutGateFD():
  PostV1GateFDSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_ACTION !==
    POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_LANDED_GATE
  ) {
    throw new Error("Gate FD can only land after Gate FC selects the floor same-basis holdout proof.");
  }

  const previousGateFC = summarizePostV1GateFCNumericCoverageGap();
  const ownerLedgers = buildPostV1GateFDOwnerLedgers();
  const ledgersWithHoldouts = ownerLedgers.filter((ledger) => ledger.holdoutRowIds.length > 0);
  const ledgersAllowingBudgetTightening = ownerLedgers.filter((ledger) =>
    ledger.budgetTighteningAdmitted
  );

  if (ledgersWithHoldouts.length > 0 || ledgersAllowingBudgetTightening.length > 0) {
    throw new Error("Gate FD must reject budget tightening while admissible same-basis holdouts are absent.");
  }

  return {
    counters: POST_V1_GATE_FD_COUNTERS,
    frozenRuntimePins: buildPostV1GateFDFrozenRuntimePins(),
    landedGate: POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_LANDED_GATE,
    noRuntimeValueMovement: true,
    ownerDecisionId: POST_V1_GATE_FD_OWNER_DECISION_ID,
    ownerLedgers,
    planDocPath: POST_V1_GATE_FD_PLAN_DOC_PATH,
    previousGateFC: {
      counters: previousGateFC.noRuntimeCounters,
      landedGate: previousGateFC.landedGate,
      planDocPath: previousGateFC.planDocPath,
      selectedCandidateId: previousGateFC.selectedCandidateId,
      selectedNextAction: previousGateFC.selectedNextAction,
      selectedNextFile: previousGateFC.selectedNextFile,
      selectionStatus: previousGateFC.selectionStatus
    },
    rejectedBoundaries: POST_V1_GATE_FD_REJECTED_BOUNDARIES,
    rejectedEvidenceContexts: POST_V1_GATE_FD_REJECTED_EVIDENCE_CONTEXTS,
    selectedNextAction:
      POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_FILE,
    selectedNextLabel:
      POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_LABEL,
    selectedResidualLedgerIds: POST_V1_GATE_FC_SELECTED_RESIDUAL_LEDGER_IDS,
    selectionStatus:
      POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_FD_TARGET_OUTPUTS
  };
}

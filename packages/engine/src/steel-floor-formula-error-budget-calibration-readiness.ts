import type { ImpactErrorBudget, ImpactErrorBudgetTerm } from "@dynecho/shared";

import {
  buildGateAISteelFloorFormulaResidualPolicyContract,
  evaluateSteelFloorFormulaResidualMetricPolicy,
  type SteelFloorFormulaResidualPolicyBlocker,
  type SteelFloorFormulaResidualPolicyDecision,
  type SteelFloorFormulaResidualPolicyMetricId
} from "./steel-floor-formula-residual-policy";
import {
  buildGateAOSteelFloorFormulaErrorBudgetSurfaceParityContract
} from "./steel-floor-formula-error-budget-surface-parity";
import {
  buildGateAPSteelFloorFormulaErrorBudgetHostileInputContract
} from "./steel-floor-formula-error-budget-hostile-input";
import {
  buildGateAMSteelFloorFormulaSourcePacketAcquisitionContract,
  type GateAMSourcePacketAcquisitionDecision
} from "./steel-floor-formula-source-owned-delta-lw-source-packet-acquisition";
import {
  buildGateAKSteelFloorFormulaSourceOwnedDeltaLwHoldoutContract,
  type SteelFloorDeltaLwHoldoutDecision,
  type SteelFloorDeltaLwHoldoutSourceKind
} from "./steel-floor-formula-source-owned-delta-lw-holdout";
import {
  buildGateANSteelFloorFormulaSourceAbsentUncertaintyContract
} from "./steel-floor-formula-source-absent-uncertainty";
import {
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
  type SteelFloorFormulaErrorBudgetMetricId
} from "./steel-floor-impact-formula-corridor";

export const GATE_AQ_STEEL_FLOOR_FORMULA_ERROR_BUDGET_CALIBRATION_READINESS_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ar-steel-floor-formula-calibration-evidence-intake-contract.test.ts";

export const GATE_AQ_STEEL_FLOOR_FORMULA_ERROR_BUDGET_CALIBRATION_READINESS_SELECTED_NEXT_ACTION =
  "gate_ar_steel_floor_formula_calibration_evidence_intake_plan";

export type SteelFloorFormulaBudgetTermReadinessTermId =
  | "dynamic_stiffness_precision"
  | "load_basis_precision"
  | "lower_support_class_simplification"
  | "source_absent_bare_steel_reference_model"
  | "source_owned_delta_lw_holdout_absence"
  | "support_form_transfer_efficiency"
  | "upper_resilient_topology_simplification";

export type SteelFloorFormulaBudgetTermEvidenceOwner =
  | "accepted_source_owned_same_stack_iso_delta_lw_holdouts"
  | "frequency_dependent_dynamic_stiffness_or_product_curve_owner"
  | "lower_ceiling_support_family_holdouts"
  | "same_stack_bare_steel_reference_rows"
  | "source_owned_load_basis_schedule"
  | "source_owned_steel_transfer_efficiency_curve"
  | "upper_resilient_topology_holdouts";

export type SteelFloorFormulaWrongEvidenceBucket =
  | GateAMSourcePacketAcquisitionDecision
  | SteelFloorDeltaLwHoldoutDecision
  | SteelFloorDeltaLwHoldoutSourceKind;

export type SteelFloorFormulaBudgetTermReadiness = {
  readonly currentBlocker: string;
  readonly mappedRuntimeTightenRequires: readonly string[];
  readonly mappingMatchesRuntime: boolean;
  readonly metricIds: readonly SteelFloorFormulaErrorBudgetMetricId[];
  readonly rejectedEvidenceBuckets: readonly SteelFloorFormulaWrongEvidenceBucket[];
  readonly termId: SteelFloorFormulaBudgetTermReadinessTermId;
  readonly tightenRequires: SteelFloorFormulaBudgetTermEvidenceOwner;
};

export type SteelFloorFormulaWrongEvidenceRejection = {
  readonly canShrinkBudgetTerm: false;
  readonly canTightenCorridor: false;
  readonly evidenceBucket: SteelFloorFormulaWrongEvidenceBucket;
  readonly id: string;
  readonly source: "gate_ak_local_candidate_audit" | "gate_am_source_packet_acquisition";
};

export type SteelFloorFormulaCalibrationDecisionCase = {
  readonly blockers: readonly SteelFloorFormulaResidualPolicyBlocker[];
  readonly decision: SteelFloorFormulaResidualPolicyDecision;
  readonly id: string;
  readonly metricId: SteelFloorFormulaResidualPolicyMetricId;
  readonly retuneAllowedNow: boolean;
  readonly runtimeValueMovement: false;
};

export type GateAQSteelFloorFormulaErrorBudgetCalibrationReadinessContract = {
  readonly apAoInvariants: {
    readonly fieldOutputBudgetMetricAliasesForbidden: readonly ["L'n,w", "L'nT,w"];
    readonly noBudgetCases: readonly [
      "missing_physical_input",
      "duplicate_ambiguous_base_structure",
      "exact_source_precedence"
    ];
    readonly requiredPayloadFields: readonly string[];
    readonly stableBudgetCases: readonly [
      "complete_source_absent_formula",
      "safe_reorder",
      "saved_api_replay"
    ];
  };
  readonly currentHoldPosture: {
    readonly acceptedSourceOwnedDeltaLwHoldoutCount: number;
    readonly decisionsByMetric: readonly SteelFloorFormulaResidualPolicyDecision[];
    readonly deltaLwToleranceDb: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    readonly estimateDeltaLw: 22.4;
    readonly estimateLnW: 55.6;
    readonly lnWToleranceDb: typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB;
    readonly runtimeRetuneAllowedNow: false;
    readonly runtimeValueMovement: false;
  };
  readonly exhaustiveTermMapping: {
    readonly mappedTermsMissingFromRuntime: readonly string[];
    readonly mappedTermIds: readonly SteelFloorFormulaBudgetTermReadinessTermId[];
    readonly runtimeTermIds: readonly string[];
    readonly unmappedRuntimeTermIds: readonly string[];
  };
  readonly formulaBasis: typeof STEEL_FLOOR_FORMULA_BASIS;
  readonly futureDecisionCases: readonly SteelFloorFormulaCalibrationDecisionCase[];
  readonly landedGate: "gate_aq_steel_floor_formula_error_budget_calibration_readiness_plan";
  readonly previousLandedGate: "gate_ap_steel_floor_formula_error_budget_hostile_input_plan";
  readonly runtimeRetuneAllowedNow: false;
  readonly runtimeValueMovement: false;
  readonly selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  readonly selectedNextAction: typeof GATE_AQ_STEEL_FLOOR_FORMULA_ERROR_BUDGET_CALIBRATION_READINESS_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof GATE_AQ_STEEL_FLOOR_FORMULA_ERROR_BUDGET_CALIBRATION_READINESS_SELECTED_NEXT_FILE;
  readonly selectionStatus: "gate_aq_error_budget_calibration_readiness_landed_no_runtime_selected_calibration_evidence_intake_gate_ar";
  readonly sourceRowsAreHoldoutsOrCalibrationNotProduct: true;
  readonly termReadiness: readonly SteelFloorFormulaBudgetTermReadiness[];
  readonly wrongEvidenceRejections: readonly SteelFloorFormulaWrongEvidenceRejection[];
};

const rejectedEvidenceBuckets = [
  "ln_w_only_system_table",
  "product_catalog_delta_lw",
  "annex_c_or_companion_inferred_delta_lw",
  "field_astm_or_building_prediction_delta_lw",
  "rejected_wrong_metric_basis_astm_iic_stc",
  "rejected_reference_floor_not_same_stack_steel",
  "rejected_boundary_reference_not_candidate_packet"
] as const satisfies readonly SteelFloorFormulaWrongEvidenceBucket[];

const termOwnerMap = [
  {
    currentBlocker: "Gate AM accepted source-owned same-stack ISO DeltaLw holdout count remains zero.",
    metricIds: ["Ln,w", "DeltaLw"],
    termId: "source_owned_delta_lw_holdout_absence",
    tightenRequires: "accepted_source_owned_same_stack_iso_delta_lw_holdouts"
  },
  {
    currentBlocker: "No same-stack bare steel reference row owns carrier, lower support, load, and topology.",
    metricIds: ["Ln,w"],
    termId: "source_absent_bare_steel_reference_model",
    tightenRequires: "same_stack_bare_steel_reference_rows"
  },
  {
    currentBlocker: "Open-web or lightweight-steel transfer efficiency curve is not source-owned.",
    metricIds: ["Ln,w"],
    termId: "support_form_transfer_efficiency",
    tightenRequires: "source_owned_steel_transfer_efficiency_curve"
  },
  {
    currentBlocker: "Lower ceiling support remains class-modelled without enough source-owned same-family holdouts.",
    metricIds: ["Ln,w"],
    termId: "lower_support_class_simplification",
    tightenRequires: "lower_ceiling_support_family_holdouts"
  },
  {
    currentBlocker: "Current input owns scalar s' but not a source-owned frequency-dependent resilient layer curve.",
    metricIds: ["Ln,w", "DeltaLw"],
    termId: "dynamic_stiffness_precision",
    tightenRequires: "frequency_dependent_dynamic_stiffness_or_product_curve_owner"
  },
  {
    currentBlocker: "Current input owns aggregate kg/m2 but not a source-owned load schedule.",
    metricIds: ["Ln,w", "DeltaLw"],
    termId: "load_basis_precision",
    tightenRequires: "source_owned_load_basis_schedule"
  },
  {
    currentBlocker: "Upper resilient topology is represented by s' and package load rather than same-stack measured packets.",
    metricIds: ["DeltaLw"],
    termId: "upper_resilient_topology_simplification",
    tightenRequires: "upper_resilient_topology_holdouts"
  }
] as const satisfies readonly Omit<
  SteelFloorFormulaBudgetTermReadiness,
  "mappedRuntimeTightenRequires" | "mappingMatchesRuntime" | "rejectedEvidenceBuckets"
>[];

function unique(values: readonly string[]): string[] {
  return Array.from(new Set(values));
}

function completeSourceAbsentBudgets(): readonly ImpactErrorBudget[] {
  return buildGateANSteelFloorFormulaSourceAbsentUncertaintyContract()
    .evaluations.completeSourceAbsent.errorBudgets as readonly ImpactErrorBudget[];
}

function runtimeTermsFor(
  budgets: readonly ImpactErrorBudget[],
  termId: SteelFloorFormulaBudgetTermReadinessTermId
): readonly ImpactErrorBudgetTerm[] {
  return budgets.flatMap((budget) => budget.terms).filter((term) => term.termId === termId);
}

function buildTermReadiness(): readonly SteelFloorFormulaBudgetTermReadiness[] {
  const budgets = completeSourceAbsentBudgets();

  return termOwnerMap.map((entry) => {
    const runtimeTerms = runtimeTermsFor(budgets, entry.termId);
    const mappedRuntimeTightenRequires = unique(
      runtimeTerms.flatMap((term) => term.tightenRequires)
    );
    const mappingMatchesRuntime =
      runtimeTerms.length === entry.metricIds.length &&
      runtimeTerms.every((term) =>
        term.tightenRequires.includes(entry.tightenRequires)
      );

    return {
      ...entry,
      mappedRuntimeTightenRequires,
      mappingMatchesRuntime,
      rejectedEvidenceBuckets
    };
  });
}

function buildExhaustiveTermMapping(
  termReadiness: readonly SteelFloorFormulaBudgetTermReadiness[]
): GateAQSteelFloorFormulaErrorBudgetCalibrationReadinessContract["exhaustiveTermMapping"] {
  const runtimeTermIds = unique(
    completeSourceAbsentBudgets().flatMap((budget) =>
      budget.terms.map((term) => term.termId)
    )
  );
  const mappedTermIds = termReadiness.map((entry) => entry.termId);

  return {
    mappedTermsMissingFromRuntime: mappedTermIds.filter(
      (termId) => !runtimeTermIds.includes(termId)
    ),
    mappedTermIds,
    runtimeTermIds,
    unmappedRuntimeTermIds: runtimeTermIds.filter(
      (termId) => !mappedTermIds.includes(termId as SteelFloorFormulaBudgetTermReadinessTermId)
    )
  };
}

function buildWrongEvidenceRejections(): readonly SteelFloorFormulaWrongEvidenceRejection[] {
  const gateAK = buildGateAKSteelFloorFormulaSourceOwnedDeltaLwHoldoutContract();
  const gateAM = buildGateAMSteelFloorFormulaSourcePacketAcquisitionContract();
  const gateAKRejections = gateAK.localCandidateAudit
    .filter((candidate) => !candidate.countsTowardFormulaResidual)
    .map((candidate) => ({
      canShrinkBudgetTerm: false as const,
      canTightenCorridor: false as const,
      evidenceBucket: candidate.sourceKind,
      id: candidate.id,
      source: "gate_ak_local_candidate_audit" as const
    }));
  const gateAMRejections = gateAM.searchedSourcePacketLeads
    .filter((lead) => !lead.countsTowardFormulaResidual)
    .map((lead) => ({
      canShrinkBudgetTerm: false as const,
      canTightenCorridor: false as const,
      evidenceBucket: lead.acquisitionDecision,
      id: lead.id,
      source: "gate_am_source_packet_acquisition" as const
    }));

  return [...gateAKRejections, ...gateAMRejections];
}

function decisionCase(
  id: string,
  input: Parameters<typeof evaluateSteelFloorFormulaResidualMetricPolicy>[0]
): SteelFloorFormulaCalibrationDecisionCase {
  const policy = evaluateSteelFloorFormulaResidualMetricPolicy(input);

  return {
    blockers: policy.blockers,
    decision: policy.decision,
    id,
    metricId: policy.metricId,
    retuneAllowedNow: policy.retuneAllowedNow,
    runtimeValueMovement: false
  };
}

function buildFutureDecisionCases(): readonly SteelFloorFormulaCalibrationDecisionCase[] {
  const common = {
    currentToleranceDb: 4,
    fieldAndBuildingBasisOwnersPresent: true,
    maxAbsoluteResidualDb: 1.2,
    meanAbsoluteResidualDb: 0.7,
    metricId: "Ln,w" as const,
    openWebFormulaInputsSourceOwned: true,
    pairedNegativeBoundaryCount: 4,
    requiredHoldoutCount: 6,
    requiredPairedNegativeBoundaryCount: 4,
    sourceOwnedCorrectionAvailable: false,
    sourceOwnedMetricHoldoutsPresent: true
  };

  return [
    decisionCase("gate_aq_current_evidence_below_threshold_holds", {
      ...common,
      residualCaseCount: 5
    }),
    decisionCase("gate_aq_complete_low_residual_evidence_tighten_candidate", {
      ...common,
      residualCaseCount: 6
    }),
    decisionCase("gate_aq_outside_corridor_without_correction_widen_candidate", {
      ...common,
      maxAbsoluteResidualDb: 6.5,
      meanAbsoluteResidualDb: 4.2,
      residualCaseCount: 6
    }),
    decisionCase("gate_aq_outside_corridor_with_all_owners_retune_candidate", {
      ...common,
      maxAbsoluteResidualDb: 6.5,
      meanAbsoluteResidualDb: 4.2,
      residualCaseCount: 6,
      sourceOwnedCorrectionAvailable: true
    })
  ];
}

export function buildGateAQSteelFloorFormulaErrorBudgetCalibrationReadinessContract():
  GateAQSteelFloorFormulaErrorBudgetCalibrationReadinessContract {
  const gateAI = buildGateAISteelFloorFormulaResidualPolicyContract();
  const gateAM = buildGateAMSteelFloorFormulaSourcePacketAcquisitionContract();
  const gateAO = buildGateAOSteelFloorFormulaErrorBudgetSurfaceParityContract();
  const gateAP = buildGateAPSteelFloorFormulaErrorBudgetHostileInputContract();
  const termReadiness = buildTermReadiness();

  return {
    apAoInvariants: {
      fieldOutputBudgetMetricAliasesForbidden:
        gateAP.fieldOutputBudgetMetricAliasesForbidden,
      noBudgetCases: gateAP.noBudgetCases,
      requiredPayloadFields: gateAO.requiredPayloadFields,
      stableBudgetCases: gateAP.stableBudgetCases
    },
    currentHoldPosture: {
      acceptedSourceOwnedDeltaLwHoldoutCount: gateAM.acceptedMeasuredHoldoutCount,
      decisionsByMetric: gateAI.metricPolicies.map((policy) => policy.decision),
      deltaLwToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      estimateDeltaLw: 22.4,
      estimateLnW: 55.6,
      lnWToleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
      runtimeRetuneAllowedNow: false,
      runtimeValueMovement: false
    },
    exhaustiveTermMapping: buildExhaustiveTermMapping(termReadiness),
    formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
    futureDecisionCases: buildFutureDecisionCases(),
    landedGate:
      "gate_aq_steel_floor_formula_error_budget_calibration_readiness_plan",
    previousLandedGate:
      "gate_ap_steel_floor_formula_error_budget_hostile_input_plan",
    runtimeRetuneAllowedNow: false,
    runtimeValueMovement: false,
    selectedImplementationSlice:
      "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction:
      GATE_AQ_STEEL_FLOOR_FORMULA_ERROR_BUDGET_CALIBRATION_READINESS_SELECTED_NEXT_ACTION,
    selectedNextFile:
      GATE_AQ_STEEL_FLOOR_FORMULA_ERROR_BUDGET_CALIBRATION_READINESS_SELECTED_NEXT_FILE,
    selectionStatus:
      "gate_aq_error_budget_calibration_readiness_landed_no_runtime_selected_calibration_evidence_intake_gate_ar",
    sourceRowsAreHoldoutsOrCalibrationNotProduct: true,
    termReadiness,
    wrongEvidenceRejections: buildWrongEvidenceRejections()
  };
}

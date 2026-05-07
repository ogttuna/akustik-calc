import {
  buildGateAISteelFloorFormulaResidualPolicyContract,
  type GateAISteelFloorFormulaResidualPolicyContract,
  type SteelFloorFormulaResidualPolicyBlocker
} from "./steel-floor-formula-residual-policy";

export type SteelFloorFormulaNegativeBoundaryId =
  | "wrong_support_family_concrete_or_heavy_floor_not_steel_formula"
  | "exact_source_precedence_over_formula_residual"
  | "lab_formula_does_not_promote_field_or_building_basis"
  | "source_absent_design_reference_not_measured_residual";

export type SteelFloorFormulaNegativeBoundaryCase = {
  expectedSelection:
    | "block_steel_formula_candidate"
    | "exact_measured_row_first"
    | "block_field_or_building_promotion"
    | "exclude_from_residual_holdouts";
  id: SteelFloorFormulaNegativeBoundaryId;
  protects:
    | "support_family_scope"
    | "exact_source_precedence"
    | "lab_field_building_basis_separation"
    | "measured_evidence_scope";
  runtimeValueMovement: false;
  testPosture: "paired_negative_boundary";
  verdict: "protected";
};

export type SteelFloorFormulaDeltaLwHoldoutIntakeCandidateId =
  | "measured_same_stack_lab_delta_lw_requires_source_owned_inputs"
  | "product_catalog_delta_lw_is_not_formula_holdout"
  | "annex_c_inferred_delta_lw_is_not_measured_holdout"
  | "field_or_astm_improvement_is_not_lab_delta_lw_holdout";

export type SteelFloorFormulaDeltaLwHoldoutIntakeDecision =
  | "accept_when_source_owned_measured_lab_same_stack"
  | "reject_product_catalog_only"
  | "reject_inferred_companion"
  | "reject_basis_mismatch";

export type SteelFloorFormulaDeltaLwHoldoutIntakeCandidate = {
  acceptedAsMeasuredHoldoutNow: boolean;
  decision: SteelFloorFormulaDeltaLwHoldoutIntakeDecision;
  id: SteelFloorFormulaDeltaLwHoldoutIntakeCandidateId;
  reason:
    | "metric_topology_and_physical_inputs_must_be_source_owned_before_acceptance"
    | "product_catalog_rows_can_support_products_but_cannot_tighten_formula_residuals"
    | "annex_c_or_companion_inference_is_calculation_context_not_measured_delta_lw"
    | "field_astm_or_building_basis_cannot_tighten_lab_delta_lw";
};

export type SteelFloorFormulaDeltaLwHoldoutIntake = {
  acceptedMeasuredHoldoutCount: 0;
  candidates: readonly SteelFloorFormulaDeltaLwHoldoutIntakeCandidate[];
  measuredHoldoutAcceptanceCriteria: readonly [
    "same_stack_lab_delta_lw_metric",
    "source_owned_metric_value",
    "source_owned_topology_and_support_family",
    "source_owned_carrier_spacing_and_lower_support_class",
    "source_owned_load_basis_and_dynamic_stiffness",
    "source_owned_upper_resilient_topology",
    "paired_negative_boundary_owner_present",
    "not_product_catalog_only",
    "not_annex_c_or_companion_inferred",
    "not_field_or_building_basis"
  ];
  rejectedInferredOrCompanionCount: number;
  rejectedProductCatalogCount: number;
  rejectedWrongBasisCount: number;
  requiredMeasuredHoldoutCount: 3;
};

export type SteelFloorFormulaOpenWebAnchorReadiness = {
  anchorUsePolicy: "exact_row_or_calibration_anchor_only_until_formula_inputs_are_source_owned";
  blockedPromotionInputs: readonly [
    "carrier_spacing",
    "load_basis",
    "dynamic_stiffness",
    "lower_support_class",
    "upper_resilient_topology"
  ];
  residualPromotionAllowedNow: false;
};

export type SteelFloorFormulaResidualPolicyAfterGateAJ = Pick<
  GateAISteelFloorFormulaResidualPolicyContract,
  | "exactMeasuredRowsRemainPrecedence"
  | "metricPolicies"
  | "overallDecision"
  | "runtimeRetuneAllowedNow"
  | "runtimeValueMovement"
  | "sourceRowsAreCalibrationEvidenceNotProduct"
> & {
  pairedNegativeBoundaryCount: 4;
  previousLandedGate: "gate_ai_steel_floor_formula_residual_policy_and_calibration_readiness_plan";
};

export type GateAJSteelFloorFormulaNegativeBoundaryDeltaLwHoldoutContract = {
  currentResidualPolicyAfterGateAJ: SteelFloorFormulaResidualPolicyAfterGateAJ;
  deltaLwHoldoutIntake: SteelFloorFormulaDeltaLwHoldoutIntake;
  exactMeasuredRowsRemainPrecedence: true;
  labFieldBuildingSeparation: true;
  landedGate: "gate_aj_steel_floor_formula_negative_boundaries_and_delta_lw_holdout_intake_plan";
  negativeBoundaryProof: {
    cases: readonly SteelFloorFormulaNegativeBoundaryCase[];
    passed: true;
    protectedBoundaryCount: 4;
    requiredBoundaryCount: 4;
  };
  openWebAnchorReadiness: SteelFloorFormulaOpenWebAnchorReadiness;
  previousLandedGate: "gate_ai_steel_floor_formula_residual_policy_and_calibration_readiness_plan";
  runtimeValueMovement: false;
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: "gate_ak_steel_floor_formula_source_owned_delta_lw_holdout_acquisition_plan";
  selectedNextFile: "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ak-steel-floor-formula-source-owned-delta-lw-holdout-contract.test.ts";
  selectionStatus: "gate_aj_steel_formula_negative_boundary_delta_lw_intake_landed_selected_source_owned_delta_lw_gate_ak";
  sourceRowsAreCalibrationEvidenceNotProduct: true;
};

export const GATE_AJ_REQUIRED_NEGATIVE_BOUNDARY_COUNT = 4;
export const GATE_AJ_REQUIRED_DELTA_LW_MEASURED_HOLDOUT_COUNT = 3;

const NEGATIVE_BOUNDARY_CASES: readonly SteelFloorFormulaNegativeBoundaryCase[] = [
  {
    expectedSelection: "block_steel_formula_candidate",
    id: "wrong_support_family_concrete_or_heavy_floor_not_steel_formula",
    protects: "support_family_scope",
    runtimeValueMovement: false,
    testPosture: "paired_negative_boundary",
    verdict: "protected"
  },
  {
    expectedSelection: "exact_measured_row_first",
    id: "exact_source_precedence_over_formula_residual",
    protects: "exact_source_precedence",
    runtimeValueMovement: false,
    testPosture: "paired_negative_boundary",
    verdict: "protected"
  },
  {
    expectedSelection: "block_field_or_building_promotion",
    id: "lab_formula_does_not_promote_field_or_building_basis",
    protects: "lab_field_building_basis_separation",
    runtimeValueMovement: false,
    testPosture: "paired_negative_boundary",
    verdict: "protected"
  },
  {
    expectedSelection: "exclude_from_residual_holdouts",
    id: "source_absent_design_reference_not_measured_residual",
    protects: "measured_evidence_scope",
    runtimeValueMovement: false,
    testPosture: "paired_negative_boundary",
    verdict: "protected"
  }
];

const DELTA_LW_CANDIDATES: readonly SteelFloorFormulaDeltaLwHoldoutIntakeCandidate[] = [
  {
    acceptedAsMeasuredHoldoutNow: false,
    decision: "accept_when_source_owned_measured_lab_same_stack",
    id: "measured_same_stack_lab_delta_lw_requires_source_owned_inputs",
    reason: "metric_topology_and_physical_inputs_must_be_source_owned_before_acceptance"
  },
  {
    acceptedAsMeasuredHoldoutNow: false,
    decision: "reject_product_catalog_only",
    id: "product_catalog_delta_lw_is_not_formula_holdout",
    reason: "product_catalog_rows_can_support_products_but_cannot_tighten_formula_residuals"
  },
  {
    acceptedAsMeasuredHoldoutNow: false,
    decision: "reject_inferred_companion",
    id: "annex_c_inferred_delta_lw_is_not_measured_holdout",
    reason: "annex_c_or_companion_inference_is_calculation_context_not_measured_delta_lw"
  },
  {
    acceptedAsMeasuredHoldoutNow: false,
    decision: "reject_basis_mismatch",
    id: "field_or_astm_improvement_is_not_lab_delta_lw_holdout",
    reason: "field_astm_or_building_basis_cannot_tighten_lab_delta_lw"
  }
];

export function buildGateAJSteelFloorFormulaNegativeBoundaryDeltaLwHoldoutContract():
GateAJSteelFloorFormulaNegativeBoundaryDeltaLwHoldoutContract {
  const residualPolicy = buildGateAISteelFloorFormulaResidualPolicyContract({
    pairedNegativeBoundaryCount: GATE_AJ_REQUIRED_NEGATIVE_BOUNDARY_COUNT
  });

  return {
    currentResidualPolicyAfterGateAJ: {
      exactMeasuredRowsRemainPrecedence: residualPolicy.exactMeasuredRowsRemainPrecedence,
      metricPolicies: residualPolicy.metricPolicies,
      overallDecision: residualPolicy.overallDecision,
      pairedNegativeBoundaryCount: GATE_AJ_REQUIRED_NEGATIVE_BOUNDARY_COUNT,
      previousLandedGate: residualPolicy.landedGate,
      runtimeRetuneAllowedNow: residualPolicy.runtimeRetuneAllowedNow,
      runtimeValueMovement: residualPolicy.runtimeValueMovement,
      sourceRowsAreCalibrationEvidenceNotProduct: residualPolicy.sourceRowsAreCalibrationEvidenceNotProduct
    },
    deltaLwHoldoutIntake: {
      acceptedMeasuredHoldoutCount: 0,
      candidates: DELTA_LW_CANDIDATES,
      measuredHoldoutAcceptanceCriteria: [
        "same_stack_lab_delta_lw_metric",
        "source_owned_metric_value",
        "source_owned_topology_and_support_family",
        "source_owned_carrier_spacing_and_lower_support_class",
        "source_owned_load_basis_and_dynamic_stiffness",
        "source_owned_upper_resilient_topology",
        "paired_negative_boundary_owner_present",
        "not_product_catalog_only",
        "not_annex_c_or_companion_inferred",
        "not_field_or_building_basis"
      ],
      rejectedInferredOrCompanionCount: 1,
      rejectedProductCatalogCount: 1,
      rejectedWrongBasisCount: 1,
      requiredMeasuredHoldoutCount: GATE_AJ_REQUIRED_DELTA_LW_MEASURED_HOLDOUT_COUNT
    },
    exactMeasuredRowsRemainPrecedence: true,
    labFieldBuildingSeparation: true,
    landedGate: "gate_aj_steel_floor_formula_negative_boundaries_and_delta_lw_holdout_intake_plan",
    negativeBoundaryProof: {
      cases: NEGATIVE_BOUNDARY_CASES,
      passed: true,
      protectedBoundaryCount: GATE_AJ_REQUIRED_NEGATIVE_BOUNDARY_COUNT,
      requiredBoundaryCount: GATE_AJ_REQUIRED_NEGATIVE_BOUNDARY_COUNT
    },
    openWebAnchorReadiness: {
      anchorUsePolicy: "exact_row_or_calibration_anchor_only_until_formula_inputs_are_source_owned",
      blockedPromotionInputs: [
        "carrier_spacing",
        "load_basis",
        "dynamic_stiffness",
        "lower_support_class",
        "upper_resilient_topology"
      ],
      residualPromotionAllowedNow: false
    },
    previousLandedGate: "gate_ai_steel_floor_formula_residual_policy_and_calibration_readiness_plan",
    runtimeValueMovement: false,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: "gate_ak_steel_floor_formula_source_owned_delta_lw_holdout_acquisition_plan",
    selectedNextFile:
      "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ak-steel-floor-formula-source-owned-delta-lw-holdout-contract.test.ts",
    selectionStatus:
      "gate_aj_steel_formula_negative_boundary_delta_lw_intake_landed_selected_source_owned_delta_lw_gate_ak",
    sourceRowsAreCalibrationEvidenceNotProduct: true
  };
}

export function residualPolicyBlockersForMetric(
  contract: GateAJSteelFloorFormulaNegativeBoundaryDeltaLwHoldoutContract,
  metricId: "DeltaLw" | "Ln,w"
): readonly SteelFloorFormulaResidualPolicyBlocker[] {
  return contract.currentResidualPolicyAfterGateAJ.metricPolicies.find((policy) => policy.metricId === metricId)
    ?.blockers ?? [];
}

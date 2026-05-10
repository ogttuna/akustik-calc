import type {
  AcousticInputFieldId,
  ImpactPredictorStructuralSupportType,
  RequestedOutputId
} from "@dynecho/shared";

import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_SELECTED_NEXT_FILE,
  buildGateBTimberCltDeltaLwScenarioPack,
  type GateBTimberCltDeltaLwFormulaLaneId,
  type GateBTimberCltDeltaLwInputContract,
  type GateBTimberCltDeltaLwScenarioId,
  type GateBTimberCltDeltaLwScenarioPackEntry
} from "./timber-clt-floor-impact-delta-lw-input-contract";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_LANDED_GATE =
  "gate_c_personal_use_mvp_timber_clt_floor_impact_delta_lw_formula_corridor_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_SELECTION_STATUS =
  "gate_c_personal_use_mvp_timber_clt_floor_impact_delta_lw_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_d";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-d-timber-clt-floor-impact-delta-lw-runtime-corridor-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_SELECTED_NEXT_ACTION =
  "gate_d_personal_use_mvp_timber_clt_floor_impact_delta_lw_runtime_corridor_plan";

export type GateCTimberCltDeltaLwFormulaBasisId =
  | "mass_timber_clt_dry_floating_physical_delta_lw_corridor"
  | "timber_joist_dry_floating_lower_ceiling_physical_delta_lw_corridor";

export type GateCTimberCltDeltaLwFormulaTermId =
  | "base_reference_floor_ln_w"
  | "lower_assembly_coupling"
  | "resilient_dynamic_stiffness_transfer"
  | "structural_family_correction"
  | "upper_treatment_loaded_mass";

export type GateCTimberCltDeltaLwErrorBudgetTermId =
  | "clt_reference_floor_family_spread"
  | "delta_lw_holdout_absence"
  | "dynamic_stiffness_precision"
  | "lower_assembly_coupling_simplification"
  | "reference_floor_ln_w_anchor_scope"
  | "timber_joist_exact_lnw_not_delta_lw"
  | "upper_mass_precision";

export type GateCTimberCltDeltaLwFormulaCandidateStatus =
  | "formula_corridor_defined_runtime_gate_required"
  | "not_applicable";

export type GateCTimberCltDeltaLwBoundaryStatus =
  | "blocked_basis_alias"
  | "blocked_exact_lnw_precedence_delta_lw_unowned"
  | "needs_input"
  | "not_timber_clt_floor";

export type GateCTimberCltDeltaLwEquationTerm = {
  readonly inputFields: readonly AcousticInputFieldId[];
  readonly ownerStatus: "defined_for_gate_d_runtime_contract";
  readonly termId: GateCTimberCltDeltaLwFormulaTermId;
};

export type GateCTimberCltDeltaLwErrorBudgetTerm = {
  readonly basis: "source_absent_formula_design_budget";
  readonly db: number;
  readonly termId: GateCTimberCltDeltaLwErrorBudgetTermId;
  readonly tightenRequires: readonly string[];
};

export type GateCTimberCltDeltaLwFormulaCandidate = {
  readonly basisId: GateCTimberCltDeltaLwFormulaBasisId;
  readonly corridorStatus: GateCTimberCltDeltaLwFormulaCandidateStatus;
  readonly deltaLwRuntimeEstimateDb: null;
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly formulaLaneId: GateBTimberCltDeltaLwFormulaLaneId;
  readonly formulaTerms: readonly GateCTimberCltDeltaLwEquationTerm[];
  readonly lnWRuntimeAnchor: {
    readonly basisId: string | null;
    readonly lnWDb: number | null;
    readonly source: "current_runtime_snapshot_only_not_delta_lw_metric_owner";
  };
  readonly proposedDeltaLwEnvelopeDb: {
    readonly max: number;
    readonly min: number;
  };
  readonly supportBucketLabel:
    | "mass-timber CLT DeltaLw formula corridor design"
    | "timber joist DeltaLw formula corridor design";
  readonly structuralSupportType: Extract<
    ImpactPredictorStructuralSupportType,
    "mass_timber_clt" | "timber_joists"
  >;
  readonly toleranceBudget: {
    readonly metricId: "DeltaLw";
    readonly notMeasuredEvidence: true;
    readonly terms: readonly GateCTimberCltDeltaLwErrorBudgetTerm[];
    readonly totalBudgetDb: number;
  };
};

export type GateCTimberCltDeltaLwBoundary = {
  readonly deltaLwRuntimeEstimateDb: null;
  readonly exactMissingPhysicalInputs: readonly AcousticInputFieldId[];
  readonly gateBScenarioId: GateBTimberCltDeltaLwScenarioId;
  readonly status: GateCTimberCltDeltaLwBoundaryStatus;
  readonly targetOutputs: readonly RequestedOutputId[];
};

export type GateCTimberCltDeltaLwFormulaCorridorContract = {
  readonly basisAliasBlocked: {
    readonly astmIicAiic: true;
    readonly buildingPrediction: true;
    readonly fieldLPrime: true;
    readonly labLnWOnly: true;
  };
  readonly candidateFormulaCorridors: readonly GateCTimberCltDeltaLwFormulaCandidate[];
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_LANDED_GATE;
  readonly negativeBoundaries: readonly GateCTimberCltDeltaLwBoundary[];
  readonly previousGateB: {
    readonly landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_LANDED_GATE;
    readonly selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_SELECTED_NEXT_FILE;
  };
  readonly previousLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_LANDED_GATE;
  readonly runtimePromotionAllowedInGateC: false;
  readonly runtimeValueMovement: false;
  readonly selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  readonly selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_SELECTED_NEXT_FILE;
  readonly selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_SELECTION_STATUS;
  readonly sourceRowsRequiredForFormulaDesign: false;
  readonly sourceRowsRequiredForRuntimeSelection: false;
  readonly gateDRuntimePromotionEntryCriteria: readonly string[];
};

const TIMBER_FORMULA_TERMS = [
  {
    inputFields: ["baseSlabOrFloor"],
    ownerStatus: "defined_for_gate_d_runtime_contract",
    termId: "base_reference_floor_ln_w"
  },
  {
    inputFields: ["toppingOrFloatingLayer", "loadBasisKgM2"],
    ownerStatus: "defined_for_gate_d_runtime_contract",
    termId: "upper_treatment_loaded_mass"
  },
  {
    inputFields: ["resilientLayerDynamicStiffnessMNm3"],
    ownerStatus: "defined_for_gate_d_runtime_contract",
    termId: "resilient_dynamic_stiffness_transfer"
  },
  {
    inputFields: ["ceilingOrLowerAssembly"],
    ownerStatus: "defined_for_gate_d_runtime_contract",
    termId: "lower_assembly_coupling"
  },
  {
    inputFields: ["baseSlabOrFloor"],
    ownerStatus: "defined_for_gate_d_runtime_contract",
    termId: "structural_family_correction"
  }
] as const satisfies readonly GateCTimberCltDeltaLwEquationTerm[];

const CLT_FORMULA_TERMS = [
  {
    inputFields: ["baseSlabOrFloor"],
    ownerStatus: "defined_for_gate_d_runtime_contract",
    termId: "base_reference_floor_ln_w"
  },
  {
    inputFields: ["toppingOrFloatingLayer", "loadBasisKgM2"],
    ownerStatus: "defined_for_gate_d_runtime_contract",
    termId: "upper_treatment_loaded_mass"
  },
  {
    inputFields: ["resilientLayerDynamicStiffnessMNm3"],
    ownerStatus: "defined_for_gate_d_runtime_contract",
    termId: "resilient_dynamic_stiffness_transfer"
  },
  {
    inputFields: ["ceilingOrLowerAssembly"],
    ownerStatus: "defined_for_gate_d_runtime_contract",
    termId: "lower_assembly_coupling"
  },
  {
    inputFields: ["baseSlabOrFloor"],
    ownerStatus: "defined_for_gate_d_runtime_contract",
    termId: "structural_family_correction"
  }
] as const satisfies readonly GateCTimberCltDeltaLwEquationTerm[];

const TIMBER_TOLERANCE_BUDGET = {
  metricId: "DeltaLw",
  notMeasuredEvidence: true,
  terms: [
    {
      basis: "source_absent_formula_design_budget",
      db: 2.4,
      termId: "timber_joist_exact_lnw_not_delta_lw",
      tightenRequires: ["source_owned_iso_delta_lw_metric_for_same_stack"]
    },
    {
      basis: "source_absent_formula_design_budget",
      db: 2.1,
      termId: "lower_assembly_coupling_simplification",
      tightenRequires: ["timber_joist_lower_ceiling_coupling_holdout"]
    },
    {
      basis: "source_absent_formula_design_budget",
      db: 1.8,
      termId: "dynamic_stiffness_precision",
      tightenRequires: ["source_owned_dynamic_stiffness_or_test_report"]
    },
    {
      basis: "source_absent_formula_design_budget",
      db: 1.2,
      termId: "upper_mass_precision",
      tightenRequires: ["source_owned_loaded_upper_mass_basis"]
    }
  ],
  totalBudgetDb: 7.5
} as const satisfies GateCTimberCltDeltaLwFormulaCandidate["toleranceBudget"];

const CLT_TOLERANCE_BUDGET = {
  metricId: "DeltaLw",
  notMeasuredEvidence: true,
  terms: [
    {
      basis: "source_absent_formula_design_budget",
      db: 2.5,
      termId: "clt_reference_floor_family_spread",
      tightenRequires: ["clt_same_reference_floor_delta_lw_holdout"]
    },
    {
      basis: "source_absent_formula_design_budget",
      db: 2,
      termId: "reference_floor_ln_w_anchor_scope",
      tightenRequires: ["reference_floor_ln_w_and_bare_ln_w_pair"]
    },
    {
      basis: "source_absent_formula_design_budget",
      db: 1.7,
      termId: "dynamic_stiffness_precision",
      tightenRequires: ["source_owned_dynamic_stiffness_or_test_report"]
    },
    {
      basis: "source_absent_formula_design_budget",
      db: 1.3,
      termId: "delta_lw_holdout_absence",
      tightenRequires: ["source_owned_mass_timber_iso_delta_lw_holdout"]
    }
  ],
  totalBudgetDb: 7.5
} as const satisfies GateCTimberCltDeltaLwFormulaCandidate["toleranceBudget"];

const GATE_D_RUNTIME_PROMOTION_ENTRY_CRITERIA = [
  "keep_exact_source_rows_above_formula_for_requested_metric",
  "calculate_DeltaLw_from_loaded_upper_mass_dynamic_stiffness_reference_floor_and_lower_assembly_terms",
  "emit_source_absent_formula_error_budget_not_measured_evidence",
  "keep_Ln_w_runtime_anchors_separate_from_DeltaLw_metric_owner",
  "preserve_ASTM_field_and_building_basis_non_alias_boundaries",
  "pin_output_card_report_api_payload_parity_if_runtime_values_move"
] as const;

function scenarioById(
  pack: readonly GateBTimberCltDeltaLwScenarioPackEntry[],
  id: GateBTimberCltDeltaLwScenarioId
): GateBTimberCltDeltaLwInputContract {
  const scenario = pack.find((entry) => entry.id === id);

  if (!scenario) {
    throw new Error(`Missing Gate B scenario ${id}`);
  }

  return scenario.contract;
}

function buildFormulaCandidate(
  input: {
    readonly basisId: GateCTimberCltDeltaLwFormulaBasisId;
    readonly formulaLaneId: GateBTimberCltDeltaLwFormulaLaneId;
    readonly formulaTerms: readonly GateCTimberCltDeltaLwEquationTerm[];
    readonly proposedDeltaLwEnvelopeDb: GateCTimberCltDeltaLwFormulaCandidate["proposedDeltaLwEnvelopeDb"];
    readonly structuralSupportType: GateCTimberCltDeltaLwFormulaCandidate["structuralSupportType"];
    readonly supportBucketLabel: GateCTimberCltDeltaLwFormulaCandidate["supportBucketLabel"];
    readonly toleranceBudget: GateCTimberCltDeltaLwFormulaCandidate["toleranceBudget"];
  },
  gateBContract: GateBTimberCltDeltaLwInputContract
): GateCTimberCltDeltaLwFormulaCandidate {
  const matchingLane = gateBContract.formulaLanes.find(
    (lane) => lane.laneId === input.formulaLaneId
  );

  return {
    basisId: input.basisId,
    corridorStatus:
      matchingLane?.status === "ready_for_formula_corridor_gate"
        ? "formula_corridor_defined_runtime_gate_required"
        : "not_applicable",
    deltaLwRuntimeEstimateDb: null,
    exactMeasuredRowsRemainPrecedence: true,
    formulaLaneId: input.formulaLaneId,
    formulaTerms: input.formulaTerms,
    lnWRuntimeAnchor: {
      basisId: gateBContract.currentRuntimeSnapshot?.basisId ?? null,
      lnWDb: gateBContract.currentRuntimeSnapshot?.lnWDb ?? null,
      source: "current_runtime_snapshot_only_not_delta_lw_metric_owner"
    },
    proposedDeltaLwEnvelopeDb: input.proposedDeltaLwEnvelopeDb,
    supportBucketLabel: input.supportBucketLabel,
    structuralSupportType: input.structuralSupportType,
    toleranceBudget: input.toleranceBudget
  };
}

function boundaryStatusFrom(
  contract: GateBTimberCltDeltaLwInputContract
): GateCTimberCltDeltaLwBoundaryStatus {
  switch (contract.status) {
    case "blocked_exact_lnw_source_precedence_delta_lw_unpromoted":
      return "blocked_exact_lnw_precedence_delta_lw_unowned";
    case "blocked_field_basis_non_alias":
    case "unsupported_astm_rating_basis":
      return "blocked_basis_alias";
    case "not_timber_clt_floor":
      return "not_timber_clt_floor";
    case "needs_input":
    case "ready_for_formula_corridor_gate":
      return "needs_input";
  }
}

function buildBoundary(
  pack: readonly GateBTimberCltDeltaLwScenarioPackEntry[],
  id: GateBTimberCltDeltaLwScenarioId
): GateCTimberCltDeltaLwBoundary {
  const contract = scenarioById(pack, id);

  return {
    deltaLwRuntimeEstimateDb: null,
    exactMissingPhysicalInputs: contract.missingPhysicalInputs,
    gateBScenarioId: id,
    status: boundaryStatusFrom(contract),
    targetOutputs: contract.targetOutputs
  };
}

export function buildGateCTimberCltDeltaLwFormulaCorridorContract(): GateCTimberCltDeltaLwFormulaCorridorContract {
  const gateBPack = buildGateBTimberCltDeltaLwScenarioPack();
  const timber = scenarioById(gateBPack, "gate_b_timber_joist_complete_ready_for_formula_corridor");
  const clt = scenarioById(gateBPack, "gate_b_clt_complete_ready_for_formula_corridor");

  return {
    basisAliasBlocked: {
      astmIicAiic: true,
      buildingPrediction: true,
      fieldLPrime: true,
      labLnWOnly: true
    },
    candidateFormulaCorridors: [
      buildFormulaCandidate(
        {
          basisId: "timber_joist_dry_floating_lower_ceiling_physical_delta_lw_corridor",
          formulaLaneId: "timber_joist_dry_floating_lower_ceiling_delta_lw",
          formulaTerms: TIMBER_FORMULA_TERMS,
          proposedDeltaLwEnvelopeDb: { max: 31, min: 16 },
          structuralSupportType: "timber_joists",
          supportBucketLabel: "timber joist DeltaLw formula corridor design",
          toleranceBudget: TIMBER_TOLERANCE_BUDGET
        },
        timber
      ),
      buildFormulaCandidate(
        {
          basisId: "mass_timber_clt_dry_floating_physical_delta_lw_corridor",
          formulaLaneId: "mass_timber_clt_dry_floating_delta_lw",
          formulaTerms: CLT_FORMULA_TERMS,
          proposedDeltaLwEnvelopeDb: { max: 30, min: 14 },
          structuralSupportType: "mass_timber_clt",
          supportBucketLabel: "mass-timber CLT DeltaLw formula corridor design",
          toleranceBudget: CLT_TOLERANCE_BUDGET
        },
        clt
      )
    ],
    exactMeasuredRowsRemainPrecedence: true,
    gateDRuntimePromotionEntryCriteria: GATE_D_RUNTIME_PROMOTION_ENTRY_CRITERIA,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_LANDED_GATE,
    negativeBoundaries: [
      buildBoundary(gateBPack, "gate_b_missing_dynamic_stiffness_needs_input"),
      buildBoundary(gateBPack, "gate_b_missing_load_basis_needs_input"),
      buildBoundary(gateBPack, "gate_b_missing_topping_mass_needs_input"),
      buildBoundary(gateBPack, "gate_b_missing_lower_isolation_needs_input"),
      buildBoundary(gateBPack, "gate_b_astm_iic_aiic_boundary_unsupported"),
      buildBoundary(gateBPack, "gate_b_field_context_non_alias_blocked"),
      buildBoundary(gateBPack, "gate_b_exact_lnw_source_precedence_keeps_delta_lw_unpromoted"),
      buildBoundary(gateBPack, "gate_b_wrong_family_steel_not_timber_clt")
    ],
    previousGateB: {
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_LANDED_GATE,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_SELECTED_NEXT_FILE
    },
    previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_LANDED_GATE,
    runtimePromotionAllowedInGateC: false,
    runtimeValueMovement: false,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_SELECTED_NEXT_FILE,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_SELECTION_STATUS,
    sourceRowsRequiredForFormulaDesign: false,
    sourceRowsRequiredForRuntimeSelection: false
  };
}

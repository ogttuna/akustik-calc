import type {
  AcousticInputFieldId,
  ImpactCalculation,
  ImpactErrorBudget,
  ImpactOnlyCalculation,
  ImpactPredictorInput,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  type PersonalUseMvpCoverageFailureClass,
  type PersonalUseMvpCoverageMetricValuePin,
  type PersonalUseMvpCoverageOutputBasis,
  type PersonalUseMvpCoveragePosture,
  type PersonalUseMvpCoverageRoute,
  type PersonalUseMvpCoverageScenarioRow,
  type PersonalUseMvpCoverageVisibleSurface
} from "./calculator-personal-use-mvp-coverage-sprint";
import {
  GATE_BO_REINFORCED_CONCRETE_COMPLETE_INPUT,
  GATE_BO_REINFORCED_CONCRETE_INCOMPLETE_INPUT,
  GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS,
  GATE_BO_REINFORCED_CONCRETE_VISIBLE_STACK,
  evaluateGateBOIncompleteExplicitRuntime,
  evaluateGateBOVisibleDerivedNeedsInputRuntime
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bo";
import {
  buildPersonalUseMvpCoverageSprintGateBNScenarioMatrix,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_CALCULATION_GRADE_BLOCKER_ROW_IDS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bn";
import {
  buildPersonalUseMvpCoverageSprintGateBPContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bp";
import {
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_DELTA_LW_TOLERANCE_DB,
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_LN_W_TOLERANCE_DB
} from "./heavy-concrete-combined-impact-formula-corridor";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_LANDED_GATE =
  "gate_bq_personal_use_mvp_coverage_matrix_refresh_after_reinforced_concrete_cleanup_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTION_STATUS =
  "gate_bq_personal_use_mvp_coverage_matrix_refresh_after_reinforced_concrete_cleanup_landed_no_runtime_selected_floor_impact_astm_iic_aiic_adapter_gate_br";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_ACTION =
  "gate_br_personal_use_mvp_floor_impact_astm_iic_aiic_adapter_contract_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-br-floor-impact-astm-iic-aiic-adapter-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_LABEL =
  "floor-impact ASTM IIC/AIIC adapter contract";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_REINFORCED_CONCRETE_ROW_IDS = [
  "floor.reinforced_concrete_combined_complete_formula.lab",
  "floor.reinforced_concrete_combined_visible_derived.needs_input",
  "floor.reinforced_concrete_combined_incomplete_explicit.needs_input",
  "floor.reinforced_concrete_combined_exact_source_precedence.lab",
  "floor.reinforced_concrete_bare_floor_existing_corridor.lab",
  "floor.reinforced_concrete_upper_only_floating_existing_corridor.lab",
  "floor.reinforced_concrete_combined_field_building.non_alias",
  "floor.reinforced_concrete_combined_astm_iic.unsupported"
] as const;

type GateBRLaneId =
  | "broad_floor_source_crawl"
  | "floor_impact_astm_iic_aiic_adapter_contract"
  | "floor_impact_low_frequency_field_owner_contract"
  | "post_reinforced_concrete_cleanup_internal_use_revalidation"
  | "reinforced_concrete_reopen"
  | "steel_suspended_ceiling_delta_lw_owner_contract";

export type PersonalUseMvpCoverageSprintGateBRLaneCandidate = {
  basisLeakageRisk: number;
  calculationGradeRisk: number;
  evidenceRowIds: readonly string[];
  id: GateBRLaneId;
  implementationCost: number;
  reason: string;
  score: number;
  selected: boolean;
  sourceRowsRequiredForRuntimeSelection: boolean;
  userFrequency: number;
};

export type PersonalUseMvpCoverageSprintGateBRLaneSelection = {
  candidates: readonly PersonalUseMvpCoverageSprintGateBRLaneCandidate[];
  selectedCandidate: PersonalUseMvpCoverageSprintGateBRLaneCandidate;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
};

export type PersonalUseMvpCoverageSprintGateBQContract = {
  apiShapeChange: false;
  calculationGradeBlockerRowsRemovedAtGateBQ:
    typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_CALCULATION_GRADE_BLOCKER_ROW_IDS;
  evidencePromotion: false;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_LANDED_GATE;
  matrixRows: 58;
  matrixRowsAddedAtGateBQ: 8;
  matrixRowsReplacedAtGateBQ: 1;
  numericRuntimeBehaviorChange: false;
  previousGateBP: {
    landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_LANDED_GATE;
    selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_FILE;
    selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTION_STATUS;
  };
  reinforcedConcreteRuntimeBasis: typeof HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS;
  routeCardValueChange: false;
  selectedImplementationSlice:
    "personal_use_mvp_coverage_sprint_after_gate_bp_coverage_matrix_refresh_after_reinforced_concrete_cleanup";
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_LABEL;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
  toleranceDb: Readonly<Record<"DeltaLw" | "Ln,w", number>>;
  workbenchInputBehaviorChange: false;
};

export type PersonalUseMvpCoverageSprintGateBQSummary = {
  basisCoverage: readonly PersonalUseMvpCoverageOutputBasis[];
  correctlyBlockedRowIds: readonly string[];
  currentPostureCoverage: readonly PersonalUseMvpCoveragePosture[];
  exactSourcePrecedenceRowIds: readonly string[];
  failureClassCounts: Readonly<Record<PersonalUseMvpCoverageFailureClass, number>>;
  matrixRowsAddedAtGateBQ: 8;
  noRuntimeValueMovement: true;
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTION_STATUS;
  reinforcedConcreteRowIds: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_REINFORCED_CONCRETE_ROW_IDS;
  remainingCalculationGradeBlockerRowIds: readonly [];
  replacedCalculationGradeBlockerRowIds:
    typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_CALCULATION_GRADE_BLOCKER_ROW_IDS;
  routeCoverage: readonly PersonalUseMvpCoverageRoute[];
  rowCount: 58;
  selectedGateBRLane: GateBRLaneId;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_FILE;
  unsupportedAstmBoundaryRowIds: readonly string[];
};

type ImpactRuntimeSource = ImpactOnlyCalculation | ReturnType<typeof calculateAssembly>;

const IMPACT_VISIBLE_SURFACES = [
  "workbench_card",
  "saved_replay",
  "calculator_api",
  "impact_only_api",
  "markdown_report",
  "pdf_report",
  "docx_report"
] as const satisfies readonly PersonalUseMvpCoverageVisibleSurface[];

const FIELD_AND_BUILDING_BOUNDARY_OUTPUTS = [
  "L'n,w",
  "L'nT,w",
  "R'w",
  "DnT,w"
] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const BARE_HEAVY_FLOOR_STACK = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 }
] as const satisfies readonly LayerInput[];

const UPPER_ONLY_FLOATING_INPUT = {
  baseSlab: { densityKgM3: 2400, materialClass: "heavy_concrete", thicknessMm: 180 },
  floorCovering: { densityKgM3: 1400, materialClass: "vinyl_flooring", mode: "material_layer", thicknessMm: 3 },
  impactSystemType: "heavy_floating_floor",
  referenceFloorType: "heavy_standard",
  resilientLayer: { dynamicStiffnessMNm3: 35, thicknessMm: 8 },
  structuralSupportType: "reinforced_concrete"
} as const satisfies ImpactPredictorInput;

const BASIS_ORDER = [
  "element_lab",
  "field_apparent",
  "astm_rating_boundary",
  "building_prediction"
] as const satisfies readonly PersonalUseMvpCoverageOutputBasis[];

const POSTURE_ORDER = [
  "family_physics",
  "bounded_screening",
  "needs_input",
  "unsupported",
  "exact",
  "source_anchored_delta",
  "calibrated_physics"
] as const satisfies readonly PersonalUseMvpCoveragePosture[];

const ROUTE_ORDER = ["wall", "floor"] as const satisfies readonly PersonalUseMvpCoverageRoute[];

const FAILURE_CLASS_ORDER = [
  "basis_boundary",
  "correct_block",
  "coverage_gap",
  "hostile_input_refusal",
  "none",
  "unsupported_metric"
] as const satisfies readonly PersonalUseMvpCoverageFailureClass[];

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function orderedSubset<T extends string>(values: readonly T[], order: readonly T[]): readonly T[] {
  const valueSet = new Set(values);
  return order.filter((value) => valueSet.has(value));
}

function failureClassCounts(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[]
): Readonly<Record<PersonalUseMvpCoverageFailureClass, number>> {
  return FAILURE_CLASS_ORDER.reduce((accumulator, failureClass) => {
    accumulator[failureClass] = matrix.filter((row) => row.failureClass === failureClass).length;
    return accumulator;
  }, {} as Record<PersonalUseMvpCoverageFailureClass, number>);
}

function impactBudget(
  impact: ImpactCalculation | null | undefined,
  metricId: RequestedOutputId
): ImpactErrorBudget | undefined {
  return impact?.errorBudgets?.find((budget) => budget.metricId === metricId);
}

function impactValuePins(input: {
  floorRatings?: { Rw?: number; RwCtr?: number } | null;
  impact: ImpactCalculation | null | undefined;
  supportedTargetOutputs: readonly RequestedOutputId[];
  targetOutputs: readonly RequestedOutputId[];
}): PersonalUseMvpCoverageMetricValuePin[] {
  const pins: PersonalUseMvpCoverageMetricValuePin[] = [];
  const supported = new Set(input.supportedTargetOutputs);
  const push = (metric: RequestedOutputId, value: number | undefined): void => {
    if (
      input.targetOutputs.includes(metric) &&
      supported.has(metric) &&
      typeof value === "number" &&
      Number.isFinite(value)
    ) {
      pins.push({ metric, value: round1(value) });
    }
  };

  push("Rw", input.floorRatings?.Rw);
  push("Ctr", input.floorRatings?.RwCtr);
  push("Ln,w", input.impact?.LnW);
  push("DeltaLw", input.impact?.DeltaLw);
  push("L'n,w", input.impact?.LPrimeNW);
  push("L'nT,w", input.impact?.LPrimeNTw);

  return pins;
}

function snapshot(input: {
  budgetMetricId?: RequestedOutputId;
  missingPhysicalInputs?: readonly AcousticInputFieldId[];
  origin?: string;
  publicEntryPoint: "calculateAssembly" | "calculateImpactOnly";
  result: ImpactRuntimeSource;
  targetOutputs: readonly RequestedOutputId[];
}): PersonalUseMvpCoverageScenarioRow["runtime"] {
  return {
    basisId: input.result.impact?.basis ?? null,
    errorBudgetDb: input.budgetMetricId
      ? impactBudget(input.result.impact, input.budgetMetricId)?.toleranceDb ?? null
      : null,
    missingPhysicalInputs: input.missingPhysicalInputs ?? [],
    origin: input.origin ?? input.result.impact?.basis ?? null,
    publicEntryPoint: input.publicEntryPoint,
    selectedMethod:
      input.result.dynamicImpactTrace?.selectionKind ??
      input.result.impactPredictorStatus?.inputMode ??
      null,
    supportedTargetOutputs: input.result.supportedTargetOutputs,
    unsupportedTargetOutputs: input.result.unsupportedTargetOutputs,
    valuePins: impactValuePins({
      floorRatings: input.result.floorSystemRatings,
      impact: input.result.impact,
      supportedTargetOutputs: input.result.supportedTargetOutputs,
      targetOutputs: input.targetOutputs
    })
  };
}

function completeFormulaRuntime(): PersonalUseMvpCoverageScenarioRow["runtime"] {
  const result = calculateImpactOnly([], {
    impactPredictorInput: GATE_BO_REINFORCED_CONCRETE_COMPLETE_INPUT,
    targetOutputs: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS
  });

  if (
    result.impact?.basis !== HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS ||
    result.impact.LnW !== 58.1 ||
    result.impact.DeltaLw !== 13.7
  ) {
    throw new Error("Gate BQ reinforced-concrete formula row cannot move Gate BO runtime values.");
  }

  return snapshot({
    budgetMetricId: "Ln,w",
    publicEntryPoint: "calculateImpactOnly",
    result,
    targetOutputs: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS
  });
}

function visibleDerivedNeedsInputRuntime(): PersonalUseMvpCoverageScenarioRow["runtime"] {
  const gateBORuntime = evaluateGateBOVisibleDerivedNeedsInputRuntime();
  const result = calculateAssembly(GATE_BO_REINFORCED_CONCRETE_VISIBLE_STACK, {
    targetOutputs: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS
  });

  if (result.impact || gateBORuntime.missingPhysicalInputs.length === 0) {
    throw new Error("Gate BQ visible-derived reinforced-concrete row must stay needs_input.");
  }

  return snapshot({
    missingPhysicalInputs: gateBORuntime.missingPhysicalInputs,
    origin: "needs_input",
    publicEntryPoint: "calculateAssembly",
    result,
    targetOutputs: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS
  });
}

function incompleteExplicitNeedsInputRuntime(): PersonalUseMvpCoverageScenarioRow["runtime"] {
  const gateBORuntime = evaluateGateBOIncompleteExplicitRuntime();
  const result = calculateImpactOnly([], {
    impactPredictorInput: GATE_BO_REINFORCED_CONCRETE_INCOMPLETE_INPUT,
    targetOutputs: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS
  });

  if (result.impact || gateBORuntime.missingPhysicalInputs.length === 0) {
    throw new Error("Gate BQ incomplete explicit reinforced-concrete row must stay needs_input.");
  }

  return snapshot({
    missingPhysicalInputs: gateBORuntime.missingPhysicalInputs,
    origin: "needs_input",
    publicEntryPoint: "calculateImpactOnly",
    result,
    targetOutputs: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS
  });
}

function exactSourcePrecedenceRuntime(): PersonalUseMvpCoverageScenarioRow["runtime"] {
  const result = calculateImpactOnly([], {
    officialFloorSystemId: "pliteq_hcp200_vinyl_lab_2026",
    targetOutputs: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS
  });

  if (result.impact?.basis !== "official_floor_system_exact_match" || result.impact.LnW !== 48) {
    throw new Error("Gate BQ exact source precedence row cannot be replaced by the formula corridor.");
  }

  return snapshot({
    publicEntryPoint: "calculateImpactOnly",
    result,
    targetOutputs: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS
  });
}

function bareHeavyRuntime(): PersonalUseMvpCoverageScenarioRow["runtime"] {
  const result = calculateAssembly(BARE_HEAVY_FLOOR_STACK, {
    targetOutputs: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS
  });

  if (result.impact?.basis !== "predictor_heavy_bare_floor_iso12354_annexc_estimate") {
    throw new Error("Gate BQ bare heavy floor row cannot inherit the combined upper/lower formula basis.");
  }

  return snapshot({
    publicEntryPoint: "calculateAssembly",
    result,
    targetOutputs: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS
  });
}

function upperOnlyFloatingRuntime(): PersonalUseMvpCoverageScenarioRow["runtime"] {
  const result = calculateImpactOnly([], {
    impactPredictorInput: UPPER_ONLY_FLOATING_INPUT,
    targetOutputs: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS
  });

  if (result.impact?.basis !== "predictor_heavy_floating_floor_iso12354_annexc_estimate") {
    throw new Error("Gate BQ upper-only floating row cannot inherit the combined upper/lower formula basis.");
  }

  return snapshot({
    publicEntryPoint: "calculateImpactOnly",
    result,
    targetOutputs: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS
  });
}

function fieldBuildingBoundaryRuntime(): PersonalUseMvpCoverageScenarioRow["runtime"] {
  const result = calculateImpactOnly([], {
    impactFieldContext: { fieldKDb: 3, receivingRoomVolumeM3: 60 },
    impactPredictorInput: GATE_BO_REINFORCED_CONCRETE_COMPLETE_INPUT,
    targetOutputs: FIELD_AND_BUILDING_BOUNDARY_OUTPUTS
  });

  if (
    result.impact?.basis !== "mixed_predicted_plus_estimated_standardized_field_volume_normalization" ||
    result.impact.LPrimeNW !== 61.1 ||
    result.impact.LPrimeNTw !== 58.3
  ) {
    throw new Error("Gate BQ reinforced-concrete field boundary row cannot alias lab Ln,w directly.");
  }

  return snapshot({
    budgetMetricId: "L'n,w",
    publicEntryPoint: "calculateImpactOnly",
    result,
    targetOutputs: FIELD_AND_BUILDING_BOUNDARY_OUTPUTS
  });
}

function astmBoundaryRuntime(): PersonalUseMvpCoverageScenarioRow["runtime"] {
  const result = calculateImpactOnly([], {
    impactPredictorInput: GATE_BO_REINFORCED_CONCRETE_COMPLETE_INPUT,
    targetOutputs: ASTM_OUTPUTS
  });

  if (result.supportedTargetOutputs.length > 0 || result.unsupportedTargetOutputs.join(",") !== "IIC,AIIC") {
    throw new Error("Gate BQ ASTM row must keep IIC/AIIC unsupported until an ASTM adapter owns them.");
  }

  return snapshot({
    origin: "unsupported_astm_e989_adapter",
    publicEntryPoint: "calculateImpactOnly",
    result,
    targetOutputs: ASTM_OUTPUTS
  });
}

function row(input: Omit<PersonalUseMvpCoverageScenarioRow, "currentPosture" | "runtime"> & {
  currentPosture: PersonalUseMvpCoveragePosture;
  runtime: () => PersonalUseMvpCoverageScenarioRow["runtime"];
}): PersonalUseMvpCoverageScenarioRow {
  return {
    basis: input.basis,
    currentPosture: input.currentPosture,
    expectedPosture: input.expectedPosture,
    failureClass: input.failureClass,
    family: input.family,
    hostileVariant: input.hostileVariant,
    id: input.id,
    inputCompleteness: input.inputCompleteness,
    nextAction: input.nextAction,
    originSupportBucket: input.originSupportBucket,
    requestedMetrics: input.requestedMetrics,
    route: input.route,
    runtime: input.runtime(),
    toleranceOrErrorBudget: input.toleranceOrErrorBudget,
    valueOrBlockedReason: input.valueOrBlockedReason,
    visibleSurfaceParityTarget: input.visibleSurfaceParityTarget
  };
}

function buildGateBQReinforcedConcreteRows(): readonly PersonalUseMvpCoverageScenarioRow[] {
  return [
    row({
      basis: "element_lab",
      currentPosture: "family_physics",
      expectedPosture: "family_physics",
      failureClass: "none",
      family: "floor_reinforced_concrete_combined_upper_lower",
      hostileVariant: "complete_reinforced_concrete_combined_upper_lower_previous_low_confidence_cleanup",
      id: "floor.reinforced_concrete_combined_complete_formula.lab",
      inputCompleteness: "complete",
      nextAction: "regression_guard",
      originSupportBucket: "source_absent_heavy_concrete_combined_upper_lower_formula_corridor",
      requestedMetrics: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS,
      route: "floor",
      runtime: completeFormulaRuntime,
      toleranceOrErrorBudget: "Ln,w +/-6.5 dB and DeltaLw +/-5.5 dB source_absent_formula_error_budget",
      valueOrBlockedReason: "Ln,w 58.1 / DeltaLw 13.7 through Gate BO heavy-concrete combined formula corridor",
      visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
    }),
    row({
      basis: "element_lab",
      currentPosture: "needs_input",
      expectedPosture: "needs_input",
      failureClass: "correct_block",
      family: "floor_reinforced_concrete_combined_upper_lower_visible_derived",
      hostileVariant: "visible_layers_missing_owned_dynamic_stiffness_load_and_lower_support",
      id: "floor.reinforced_concrete_combined_visible_derived.needs_input",
      inputCompleteness: "partial",
      nextAction: "keep_precise_needs_input_prompt",
      originSupportBucket: "missing_visible_heavy_concrete_combined_formula_inputs",
      requestedMetrics: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS,
      route: "floor",
      runtime: visibleDerivedNeedsInputRuntime,
      toleranceOrErrorBudget: "blocked_no_budget_until_user_owns_s_prime_and_load",
      valueOrBlockedReason:
        "Visible stack derives lower assembly from layer roles and asks for resilientLayerDynamicStiffnessMNm3 and loadBasisKgM2",
      visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
    }),
    row({
      basis: "element_lab",
      currentPosture: "needs_input",
      expectedPosture: "needs_input",
      failureClass: "correct_block",
      family: "floor_reinforced_concrete_combined_upper_lower_explicit_partial",
      hostileVariant: "explicit_predictor_missing_load_basis_and_complete_lower_support",
      id: "floor.reinforced_concrete_combined_incomplete_explicit.needs_input",
      inputCompleteness: "partial",
      nextAction: "keep_precise_needs_input_prompt",
      originSupportBucket: "missing_explicit_heavy_concrete_combined_formula_inputs",
      requestedMetrics: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS,
      route: "floor",
      runtime: incompleteExplicitNeedsInputRuntime,
      toleranceOrErrorBudget: "blocked_no_budget_until_load_basis_and_lower_assembly_are_owned",
      valueOrBlockedReason: "Explicit input asks for loadBasisKgM2 and ceilingOrLowerAssembly",
      visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
    }),
    row({
      basis: "element_lab",
      currentPosture: "exact",
      expectedPosture: "exact",
      failureClass: "none",
      family: "floor_reinforced_concrete_exact_source_precedence",
      hostileVariant: "formula_like_stack_with_official_floor_system_id",
      id: "floor.reinforced_concrete_combined_exact_source_precedence.lab",
      inputCompleteness: "complete",
      nextAction: "regression_guard",
      originSupportBucket: "official_floor_system_exact_match_precedence_over_combined_formula",
      requestedMetrics: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS,
      route: "floor",
      runtime: exactSourcePrecedenceRuntime,
      toleranceOrErrorBudget: "exact_source_no_formula_budget",
      valueOrBlockedReason: "Official Pliteq HCP200 vinyl row stays first at Rw 62 / Ln,w 48; DeltaLw remains unpromoted",
      visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
    }),
    row({
      basis: "element_lab",
      currentPosture: "family_physics",
      expectedPosture: "family_physics",
      failureClass: "none",
      family: "floor_reinforced_concrete_bare_heavy",
      hostileVariant: "bare_heavy_floor_must_not_inherit_combined_upper_lower_budget",
      id: "floor.reinforced_concrete_bare_floor_existing_corridor.lab",
      inputCompleteness: "complete",
      nextAction: "regression_guard",
      originSupportBucket: "existing_bare_heavy_floor_formula_corridor",
      requestedMetrics: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS,
      route: "floor",
      runtime: bareHeavyRuntime,
      toleranceOrErrorBudget: "existing_bare_heavy_floor_corridor_delta_lw_unsupported",
      valueOrBlockedReason: "Bare 180 mm concrete keeps Rw 58 / Ctr 51.8 / Ln,w 71.8; DeltaLw stays unsupported",
      visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
    }),
    row({
      basis: "element_lab",
      currentPosture: "family_physics",
      expectedPosture: "family_physics",
      failureClass: "none",
      family: "floor_reinforced_concrete_upper_only_floating",
      hostileVariant: "upper_only_floating_floor_must_not_inherit_lower_ceiling_budget",
      id: "floor.reinforced_concrete_upper_only_floating_existing_corridor.lab",
      inputCompleteness: "complete",
      nextAction: "regression_guard",
      originSupportBucket: "existing_heavy_floating_floor_formula_corridor",
      requestedMetrics: GATE_BO_REINFORCED_CONCRETE_TARGET_OUTPUTS,
      route: "floor",
      runtime: upperOnlyFloatingRuntime,
      toleranceOrErrorBudget: "existing_upper_only_heavy_floating_formula_budget_not_combined_budget",
      valueOrBlockedReason: "Upper-only floating floor keeps Ln,w 64.8 / DeltaLw 7 outside the combined corridor",
      visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
    }),
    row({
      basis: "field_apparent",
      currentPosture: "family_physics",
      expectedPosture: "family_physics",
      failureClass: "basis_boundary",
      family: "floor_reinforced_concrete_combined_field_and_building_boundary",
      hostileVariant: "field_and_building_metrics_requested_from_lab_formula_anchor",
      id: "floor.reinforced_concrete_combined_field_building.non_alias",
      inputCompleteness: "complete",
      nextAction: "regression_guard",
      originSupportBucket: "impact_field_adapter_on_heavy_concrete_combined_lab_anchor_with_building_airborne_block",
      requestedMetrics: FIELD_AND_BUILDING_BOUNDARY_OUTPUTS,
      route: "floor",
      runtime: fieldBuildingBoundaryRuntime,
      toleranceOrErrorBudget: "L'n,w +/-5 dB and L'nT,w +/-5.5 dB field adapter budget; R'w/DnT,w blocked",
      valueOrBlockedReason:
        "L'n,w 61.1 / L'nT,w 58.3 require field context; R'w and DnT,w are not impact/lab aliases",
      visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
    }),
    row({
      basis: "astm_rating_boundary",
      currentPosture: "unsupported",
      expectedPosture: "unsupported",
      failureClass: "unsupported_metric",
      family: "floor_reinforced_concrete_combined_astm_boundary",
      hostileVariant: "astm_iic_requested_from_iso_lab_corridor",
      id: "floor.reinforced_concrete_combined_astm_iic.unsupported",
      inputCompleteness: "complete",
      nextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_ACTION,
      originSupportBucket: "unsupported_astm_e989_adapter",
      requestedMetrics: ASTM_OUTPUTS,
      route: "floor",
      runtime: astmBoundaryRuntime,
      toleranceOrErrorBudget: "blocked_until_floor_impact_astm_iic_aiic_adapter_owner",
      valueOrBlockedReason: "IIC and AIIC are not aliases of ISO Ln,w 58.1 or DeltaLw 13.7",
      visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
    })
  ];
}

export function buildPersonalUseMvpCoverageSprintGateBQScenarioMatrix():
  readonly PersonalUseMvpCoverageScenarioRow[] {
  const replacedIds = new Set<string>(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_CALCULATION_GRADE_BLOCKER_ROW_IDS);

  return [
    ...buildPersonalUseMvpCoverageSprintGateBNScenarioMatrix().filter((entry) => !replacedIds.has(entry.id)),
    ...buildGateBQReinforcedConcreteRows()
  ];
}

export function buildPersonalUseMvpCoverageSprintGateBQContract():
  PersonalUseMvpCoverageSprintGateBQContract {
  const gateBP = buildPersonalUseMvpCoverageSprintGateBPContract();
  if (gateBP.selectedNextAction !== PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_LANDED_GATE) {
    throw new Error("Gate BQ can only land after Gate BP selects the reinforced-concrete matrix refresh.");
  }

  return {
    apiShapeChange: false,
    calculationGradeBlockerRowsRemovedAtGateBQ:
      PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_CALCULATION_GRADE_BLOCKER_ROW_IDS,
    evidencePromotion: false,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_LANDED_GATE,
    matrixRows: 58,
    matrixRowsAddedAtGateBQ: 8,
    matrixRowsReplacedAtGateBQ: 1,
    numericRuntimeBehaviorChange: false,
    previousGateBP: {
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_LANDED_GATE,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTION_STATUS
    },
    reinforcedConcreteRuntimeBasis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
    routeCardValueChange: false,
    selectedImplementationSlice:
      "personal_use_mvp_coverage_sprint_after_gate_bp_coverage_matrix_refresh_after_reinforced_concrete_cleanup",
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_FILE,
    selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_LABEL,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    toleranceDb: {
      "DeltaLw": HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_DELTA_LW_TOLERANCE_DB,
      "Ln,w": HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_LN_W_TOLERANCE_DB
    },
    workbenchInputBehaviorChange: false
  };
}

function scoreLane(
  candidate: Omit<PersonalUseMvpCoverageSprintGateBRLaneCandidate, "score" | "selected">
): number {
  return round1(
    (candidate.userFrequency * candidate.calculationGradeRisk) /
      (candidate.implementationCost + candidate.basisLeakageRisk + 1)
  );
}

export function rankPersonalUseMvpCoverageSprintGateBRLanes(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildPersonalUseMvpCoverageSprintGateBQScenarioMatrix()
): PersonalUseMvpCoverageSprintGateBRLaneSelection {
  const candidateSeeds = [
    {
      basisLeakageRisk: 5,
      calculationGradeRisk: 7,
      evidenceRowIds: [
        "floor.astm_iic_aiic_boundary.unsupported",
        "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
        "floor.reinforced_concrete_combined_astm_iic.unsupported"
      ],
      id: "floor_impact_astm_iic_aiic_adapter_contract",
      implementationCost: 5,
      reason:
        "After the live reinforced-concrete low-confidence gap was removed, IIC/AIIC is the broadest remaining common floor output family that is visible but correctly blocked until a non-alias ASTM adapter owns it.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 6
    },
    {
      basisLeakageRisk: 2,
      calculationGradeRisk: 4,
      evidenceRowIds: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_REINFORCED_CONCRETE_ROW_IDS,
      id: "post_reinforced_concrete_cleanup_internal_use_revalidation",
      implementationCost: 4,
      reason:
        "A no-runtime internal-use rehearsal is valuable, but the refreshed matrix already keeps reinforced concrete on executable value pins and boundary rows.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 5
    },
    {
      basisLeakageRisk: 3,
      calculationGradeRisk: 5,
      evidenceRowIds: ["floor.lightweight_steel_suspended_ceiling_delta_lw.unsupported"],
      id: "steel_suspended_ceiling_delta_lw_owner_contract",
      implementationCost: 5,
      reason:
        "Steel suspended-ceiling DeltaLw is useful, but it remains a narrower unsupported companion than the cross-family ASTM rating adapter.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 5
    },
    {
      basisLeakageRisk: 5,
      calculationGradeRisk: 4,
      evidenceRowIds: ["floor.lightweight_steel_suspended_ceiling_lnt50.unsupported"],
      id: "floor_impact_low_frequency_field_owner_contract",
      implementationCost: 4,
      reason:
        "Low-frequency field impact ownership is important but more specialized and must stay behind the broader IIC/AIIC boundary.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 3
    },
    {
      basisLeakageRisk: 2,
      calculationGradeRisk: 2,
      evidenceRowIds: ["floor.reinforced_concrete_combined_complete_formula.lab"],
      id: "reinforced_concrete_reopen",
      implementationCost: 5,
      reason:
        "The reinforced-concrete combined lane is now calculation-grade for complete input and needs_input for missing input; reopening it would be lower ROI than the next adapter gap.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 3
    },
    {
      basisLeakageRisk: 8,
      calculationGradeRisk: 2,
      evidenceRowIds: [
        "floor.lightweight_steel_exact_source_precedence.lab",
        "floor.reinforced_concrete_combined_exact_source_precedence.lab"
      ],
      id: "broad_floor_source_crawl",
      implementationCost: 9,
      reason:
        "Exact rows remain valuable overrides, but no refreshed Gate BQ blocker requires broad source crawling before bounded adapter ownership.",
      sourceRowsRequiredForRuntimeSelection: true,
      userFrequency: 2
    }
  ] as const satisfies readonly Omit<PersonalUseMvpCoverageSprintGateBRLaneCandidate, "score" | "selected">[];

  const matrixIds = new Set(matrix.map((row) => row.id));
  const candidatesWithoutSelection = candidateSeeds.map((candidate) => {
    const missingRows = candidate.evidenceRowIds.filter((id) => !matrixIds.has(id));

    if (missingRows.length > 0) {
      throw new Error(`Gate BR lane ${candidate.id} references missing Gate BQ matrix rows: ${missingRows.join(", ")}`);
    }

    return {
      ...candidate,
      score: scoreLane(candidate),
      selected: false
    };
  });
  const [selected] = [...candidatesWithoutSelection].sort((left, right) => {
    const scoreDelta = right.score - left.score;
    return scoreDelta === 0 ? left.id.localeCompare(right.id) : scoreDelta;
  });

  if (!selected) {
    throw new Error("Gate BQ requires one selected Gate BR lane.");
  }

  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Gate BQ did not mark a selected Gate BR lane.");
  }

  return {
    candidates,
    selectedCandidate,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_FILE,
    selectionPolicy: [
      "refresh the executable matrix after reinforced-concrete cleanup and surface parity",
      "score user_frequency * calculation_grade_risk / (implementation_cost + basis_leakage_risk + 1)",
      "do not reopen a lane that now has complete formula support plus precise needs_input blockers",
      "prefer bounded output-adapter ownership over broad source crawling when runtime source-absent solvers are already calculation-grade"
    ]
  };
}

function requireRows(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[],
  rowIds: readonly string[],
  label: string
): void {
  const ids = new Set(matrix.map((row) => row.id));
  const missing = rowIds.filter((id) => !ids.has(id));

  if (missing.length > 0) {
    throw new Error(`Gate BQ matrix missing ${label} row(s): ${missing.join(", ")}`);
  }
}

function requireRowsAbsent(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[],
  rowIds: readonly string[],
  label: string
): void {
  const ids = new Set(matrix.map((row) => row.id));
  const present = rowIds.filter((id) => ids.has(id));

  if (present.length > 0) {
    throw new Error(`Gate BQ matrix still contains replaced ${label} row(s): ${present.join(", ")}`);
  }
}

export function summarizePersonalUseMvpCoverageSprintGateBQ(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildPersonalUseMvpCoverageSprintGateBQScenarioMatrix()
): PersonalUseMvpCoverageSprintGateBQSummary {
  requireRows(matrix, PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_REINFORCED_CONCRETE_ROW_IDS, "reinforced-concrete");
  requireRowsAbsent(
    matrix,
    PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_CALCULATION_GRADE_BLOCKER_ROW_IDS,
    "calculation-grade blocker"
  );

  const laneSelection = rankPersonalUseMvpCoverageSprintGateBRLanes(matrix);

  return {
    basisCoverage: orderedSubset(matrix.map((row) => row.basis), BASIS_ORDER),
    correctlyBlockedRowIds: matrix
      .filter((row) => row.failureClass !== "none")
      .map((row) => row.id),
    currentPostureCoverage: orderedSubset(matrix.map((row) => row.currentPosture), POSTURE_ORDER),
    exactSourcePrecedenceRowIds: [
      "floor.lightweight_steel_exact_source_precedence.lab",
      "floor.lightweight_steel_suspended_ceiling_exact_source_precedence.lab",
      "floor.reinforced_concrete_combined_exact_source_precedence.lab"
    ],
    failureClassCounts: failureClassCounts(matrix),
    matrixRowsAddedAtGateBQ: 8,
    noRuntimeValueMovement: true,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTION_STATUS,
    reinforcedConcreteRowIds: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_REINFORCED_CONCRETE_ROW_IDS,
    remainingCalculationGradeBlockerRowIds: [],
    replacedCalculationGradeBlockerRowIds: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_CALCULATION_GRADE_BLOCKER_ROW_IDS,
    routeCoverage: orderedSubset(matrix.map((row) => row.route), ROUTE_ORDER),
    rowCount: 58,
    selectedGateBRLane: laneSelection.selectedCandidate.id,
    selectedNextAction: laneSelection.selectedNextAction,
    selectedNextFile: laneSelection.selectedNextFile,
    unsupportedAstmBoundaryRowIds: [
      "floor.astm_iic_aiic_boundary.unsupported",
      "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
      "floor.reinforced_concrete_combined_astm_iic.unsupported"
    ]
  };
}

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_REINFORCED_CONCRETE_RUNTIME_BASIS =
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS;

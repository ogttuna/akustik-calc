import {
  buildGateAHSteelFloorFormulaAccuracyBenchmarkContract,
  type GateAHSteelFloorFormulaAccuracyBenchmarkContract,
  type SteelFloorFormulaAccuracyBenchmarkEvaluation
} from "./steel-floor-formula-accuracy-benchmark";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB
} from "./steel-floor-impact-formula-corridor";

export type SteelFloorFormulaResidualPolicyDecision =
  | "hold"
  | "retune_candidate"
  | "tighten"
  | "widen";

export type SteelFloorFormulaResidualPolicyMetricId = "DeltaLw" | "Ln,w";

export type SteelFloorFormulaResidualPolicyBlocker =
  | "delta_lw_measured_holdouts_missing"
  | "field_and_building_basis_owners_missing"
  | "holdout_count_below_policy_threshold"
  | "open_web_formula_inputs_not_source_owned"
  | "paired_negative_boundaries_missing"
  | "source_owned_correction_missing"
  | "source_owned_metric_holdouts_missing";

export type SteelFloorFormulaResidualPolicyInput = {
  benchmark?: GateAHSteelFloorFormulaAccuracyBenchmarkContract;
  fieldAndBuildingBasisOwnersPresent?: boolean;
  openWebFormulaInputsSourceOwned?: boolean;
  pairedNegativeBoundaryCount?: number;
  requiredDeltaLwHoldoutCount?: number;
  requiredLnWHoldoutCount?: number;
  requiredPairedNegativeBoundaryCount?: number;
  sourceOwnedCorrectionAvailable?: boolean;
};

export type SteelFloorFormulaResidualMetricPolicy = {
  blockers: readonly SteelFloorFormulaResidualPolicyBlocker[];
  currentToleranceDb: number;
  decision: SteelFloorFormulaResidualPolicyDecision;
  decisionBasis: string;
  maxAbsoluteResidualDb: number | null;
  meanAbsoluteResidualDb: number | null;
  metricId: SteelFloorFormulaResidualPolicyMetricId;
  residualCaseCount: number;
  retuneAllowedNow: boolean;
  runtimeValueMovement: false;
  threshold: {
    requiredHoldoutCount: number;
    requiredPairedNegativeBoundaryCount: number;
  };
};

export type SteelFloorFormulaOpenWebAnchorPolicy = {
  anchorRowCount: number;
  anchorUsePolicy: "calibration_anchor_only_until_formula_inputs_are_source_owned";
  blockers: readonly SteelFloorFormulaResidualPolicyBlocker[];
  residualPromotionAllowedNow: false;
};

export type GateAISteelFloorFormulaResidualPolicyContract = {
  exactMeasuredRowsRemainPrecedence: true;
  landedGate: "gate_ai_steel_floor_formula_residual_policy_and_calibration_readiness_plan";
  metricPolicies: readonly SteelFloorFormulaResidualMetricPolicy[];
  openWebAnchorPolicy: SteelFloorFormulaOpenWebAnchorPolicy;
  overallDecision: "hold_current_corridor";
  previousLandedGate: "gate_ah_steel_floor_formula_accuracy_benchmark_expansion_plan";
  runtimeRetuneAllowedNow: false;
  runtimeValueMovement: false;
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: "gate_aj_steel_floor_formula_negative_boundaries_and_delta_lw_holdout_intake_plan";
  selectedNextFile: "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aj-steel-floor-formula-negative-boundary-and-delta-lw-holdout-contract.test.ts";
  selectionStatus: "gate_ai_steel_floor_formula_residual_policy_landed_selected_negative_boundary_delta_lw_gate_aj";
  sourceRowsAreCalibrationEvidenceNotProduct: true;
};

const DEFAULT_REQUIRED_LN_W_HOLDOUT_COUNT = 6;
const DEFAULT_REQUIRED_DELTA_LW_HOLDOUT_COUNT = 3;
const DEFAULT_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_COUNT = 4;

function uniqueBlockers(blockers: readonly SteelFloorFormulaResidualPolicyBlocker[]) {
  return Array.from(new Set(blockers));
}

function policyDecisionBasis(
  decision: SteelFloorFormulaResidualPolicyDecision,
  metricId: SteelFloorFormulaResidualPolicyMetricId
): string {
  switch (decision) {
    case "hold":
      return `${metricId} residual evidence does not justify moving runtime values or corridor tolerance.`;
    case "retune_candidate":
      return `${metricId} residual evidence is outside the corridor and has enough source-owned safeguards to plan a retune.`;
    case "tighten":
      return `${metricId} residual evidence is low enough and broad enough to plan a tighter corridor.`;
    case "widen":
      return `${metricId} residual evidence is outside the corridor, but retune ownership is not complete.`;
  }
}

function residualsFor(
  metricId: SteelFloorFormulaResidualPolicyMetricId,
  cases: readonly SteelFloorFormulaAccuracyBenchmarkEvaluation[]
): readonly number[] {
  return cases
    .map((entry) => metricId === "Ln,w" ? entry.absoluteLnWErrorDb : entry.absoluteDeltaLwErrorDb)
    .filter((value): value is number => typeof value === "number");
}

function meanResidual(values: readonly number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

export function evaluateSteelFloorFormulaResidualMetricPolicy(input: {
  currentToleranceDb: number;
  fieldAndBuildingBasisOwnersPresent: boolean;
  maxAbsoluteResidualDb: number | null;
  meanAbsoluteResidualDb: number | null;
  metricId: SteelFloorFormulaResidualPolicyMetricId;
  openWebFormulaInputsSourceOwned: boolean;
  pairedNegativeBoundaryCount: number;
  requiredHoldoutCount: number;
  requiredPairedNegativeBoundaryCount: number;
  residualCaseCount: number;
  sourceOwnedCorrectionAvailable: boolean;
  sourceOwnedMetricHoldoutsPresent: boolean;
}): SteelFloorFormulaResidualMetricPolicy {
  const blockers: SteelFloorFormulaResidualPolicyBlocker[] = [];

  if (input.residualCaseCount < input.requiredHoldoutCount) {
    blockers.push(
      input.metricId === "DeltaLw" && input.residualCaseCount === 0
        ? "delta_lw_measured_holdouts_missing"
        : "holdout_count_below_policy_threshold"
    );
  }

  if (!input.sourceOwnedMetricHoldoutsPresent) {
    blockers.push("source_owned_metric_holdouts_missing");
  }

  if (input.pairedNegativeBoundaryCount < input.requiredPairedNegativeBoundaryCount) {
    blockers.push("paired_negative_boundaries_missing");
  }

  if (!input.openWebFormulaInputsSourceOwned) {
    blockers.push("open_web_formula_inputs_not_source_owned");
  }

  if (!input.fieldAndBuildingBasisOwnersPresent) {
    blockers.push("field_and_building_basis_owners_missing");
  }

  const maxResidual = input.maxAbsoluteResidualDb;
  const outsideCurrentTolerance = typeof maxResidual === "number" && maxResidual > input.currentToleranceDb;

  if (outsideCurrentTolerance && !input.sourceOwnedCorrectionAvailable) {
    blockers.push("source_owned_correction_missing");
  }

  const unique = uniqueBlockers(blockers);
  const hasAllRetuneOwners =
    input.residualCaseCount >= input.requiredHoldoutCount &&
    input.sourceOwnedMetricHoldoutsPresent &&
    input.pairedNegativeBoundaryCount >= input.requiredPairedNegativeBoundaryCount &&
    input.openWebFormulaInputsSourceOwned &&
    input.fieldAndBuildingBasisOwnersPresent &&
    input.sourceOwnedCorrectionAvailable;
  const hasAllTightenOwners =
    input.residualCaseCount >= input.requiredHoldoutCount &&
    input.sourceOwnedMetricHoldoutsPresent &&
    input.pairedNegativeBoundaryCount >= input.requiredPairedNegativeBoundaryCount &&
    input.openWebFormulaInputsSourceOwned &&
    input.fieldAndBuildingBasisOwnersPresent;
  const lowResidualEnoughToTighten =
    typeof maxResidual === "number" &&
    typeof input.meanAbsoluteResidualDb === "number" &&
    maxResidual <= input.currentToleranceDb / 2 &&
    input.meanAbsoluteResidualDb <= input.currentToleranceDb / 3;
  const decision: SteelFloorFormulaResidualPolicyDecision = outsideCurrentTolerance
    ? hasAllRetuneOwners
      ? "retune_candidate"
      : "widen"
    : lowResidualEnoughToTighten && hasAllTightenOwners
      ? "tighten"
      : "hold";

  return {
    blockers: unique,
    currentToleranceDb: input.currentToleranceDb,
    decision,
    decisionBasis: policyDecisionBasis(decision, input.metricId),
    maxAbsoluteResidualDb: input.maxAbsoluteResidualDb,
    meanAbsoluteResidualDb: input.meanAbsoluteResidualDb,
    metricId: input.metricId,
    residualCaseCount: input.residualCaseCount,
    retuneAllowedNow: decision === "retune_candidate",
    runtimeValueMovement: false,
    threshold: {
      requiredHoldoutCount: input.requiredHoldoutCount,
      requiredPairedNegativeBoundaryCount: input.requiredPairedNegativeBoundaryCount
    }
  };
}

export function buildGateAISteelFloorFormulaResidualPolicyContract(
  input: SteelFloorFormulaResidualPolicyInput = {}
): GateAISteelFloorFormulaResidualPolicyContract {
  const benchmark = input.benchmark ?? buildGateAHSteelFloorFormulaAccuracyBenchmarkContract();
  const pairedNegativeBoundaryCount = input.pairedNegativeBoundaryCount ?? 0;
  const requiredPairedNegativeBoundaryCount =
    input.requiredPairedNegativeBoundaryCount ?? DEFAULT_REQUIRED_PAIRED_NEGATIVE_BOUNDARY_COUNT;
  const openWebFormulaInputsSourceOwned = input.openWebFormulaInputsSourceOwned === true;
  const fieldAndBuildingBasisOwnersPresent = input.fieldAndBuildingBasisOwnersPresent === true;
  const sourceOwnedCorrectionAvailable = input.sourceOwnedCorrectionAvailable === true;
  const deltaLwResiduals = residualsFor("DeltaLw", benchmark.benchmarkCases);
  const lnWPolicy = evaluateSteelFloorFormulaResidualMetricPolicy({
    currentToleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
    fieldAndBuildingBasisOwnersPresent,
    maxAbsoluteResidualDb: benchmark.maxAbsoluteLnWResidualDb,
    meanAbsoluteResidualDb: benchmark.meanAbsoluteLnWResidualDb,
    metricId: "Ln,w",
    openWebFormulaInputsSourceOwned,
    pairedNegativeBoundaryCount,
    requiredHoldoutCount: input.requiredLnWHoldoutCount ?? DEFAULT_REQUIRED_LN_W_HOLDOUT_COUNT,
    requiredPairedNegativeBoundaryCount,
    residualCaseCount: benchmark.lnWResidualCaseCount,
    sourceOwnedCorrectionAvailable,
    sourceOwnedMetricHoldoutsPresent: benchmark.lnWResidualCaseCount > 0
  });
  const deltaLwPolicy = evaluateSteelFloorFormulaResidualMetricPolicy({
    currentToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
    fieldAndBuildingBasisOwnersPresent,
    maxAbsoluteResidualDb: deltaLwResiduals.length > 0 ? Math.max(...deltaLwResiduals) : null,
    meanAbsoluteResidualDb: meanResidual(deltaLwResiduals),
    metricId: "DeltaLw",
    openWebFormulaInputsSourceOwned,
    pairedNegativeBoundaryCount,
    requiredHoldoutCount: input.requiredDeltaLwHoldoutCount ?? DEFAULT_REQUIRED_DELTA_LW_HOLDOUT_COUNT,
    requiredPairedNegativeBoundaryCount,
    residualCaseCount: benchmark.deltaLwResidualCaseCount,
    sourceOwnedCorrectionAvailable,
    sourceOwnedMetricHoldoutsPresent: benchmark.deltaLwResidualCaseCount > 0
  });

  return {
    exactMeasuredRowsRemainPrecedence: true,
    landedGate: "gate_ai_steel_floor_formula_residual_policy_and_calibration_readiness_plan",
    metricPolicies: [lnWPolicy, deltaLwPolicy],
    openWebAnchorPolicy: {
      anchorRowCount: benchmark.sourceAnchorInventory.ubiqOpenWebExactAnchorRows,
      anchorUsePolicy: "calibration_anchor_only_until_formula_inputs_are_source_owned",
      blockers: uniqueBlockers([
        "open_web_formula_inputs_not_source_owned",
        "source_owned_metric_holdouts_missing",
        "paired_negative_boundaries_missing"
      ]),
      residualPromotionAllowedNow: false
    },
    overallDecision: "hold_current_corridor",
    previousLandedGate: "gate_ah_steel_floor_formula_accuracy_benchmark_expansion_plan",
    runtimeRetuneAllowedNow: false,
    runtimeValueMovement: false,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: "gate_aj_steel_floor_formula_negative_boundaries_and_delta_lw_holdout_intake_plan",
    selectedNextFile:
      "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aj-steel-floor-formula-negative-boundary-and-delta-lw-holdout-contract.test.ts",
    selectionStatus:
      "gate_ai_steel_floor_formula_residual_policy_landed_selected_negative_boundary_delta_lw_gate_aj",
    sourceRowsAreCalibrationEvidenceNotProduct: true
  };
}

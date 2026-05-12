import type { RequestedOutputId } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  type PersonalUseMvpCoverageFailureClass,
  type PersonalUseMvpCoverageMetricValuePin,
  type PersonalUseMvpCoveragePosture,
  type PersonalUseMvpCoverageScenarioRow
} from "./calculator-personal-use-mvp-coverage-sprint";
import { buildPersonalUseMvpCoverageSprintGateXScenarioMatrix } from "./calculator-personal-use-mvp-coverage-sprint-gate-x";
import {
  GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD,
  GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-y-clt-mass-timber-ctr-spectrum-adapter";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_LANDED_GATE =
  "gate_y_personal_use_mvp_clt_mass_timber_ctr_spectrum_adapter_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_SELECTION_STATUS =
  "gate_y_personal_use_mvp_clt_mass_timber_ctr_spectrum_adapter_landed_selected_post_gate_y_revalidation_gate_z";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-z-post-clt-ctr-coverage-revalidation-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_SELECTED_NEXT_ACTION =
  "gate_z_personal_use_mvp_post_clt_ctr_coverage_revalidation_plan";

export type PersonalUseMvpCoverageSprintGateYSummary = {
  cltCtrRuntimeBasisId: typeof GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD;
  cltCtrSelectedCandidateId: typeof GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID;
  closedCoverageGapRowIds: readonly ["wall.clt_mass_timber.lab"];
  currentPostureCoverage: readonly PersonalUseMvpCoveragePosture[];
  failureClassCoverage: readonly PersonalUseMvpCoverageFailureClass[];
  numericRuntimeValueMovement: false;
  remainingCoverageGapRowIds: readonly string[];
  rowCount: number;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_SELECTED_NEXT_FILE;
};

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const CLT_WALL = [{ materialId: "clt_panel", thicknessMm: 120 }] as const;
const WALL_LAB_CONTEXT = { airtightness: "good", contextMode: "element_lab" } as const;

const POSTURE_COVERAGE_ORDER = [
  "family_physics",
  "bounded_screening",
  "needs_input",
  "unsupported",
  "exact",
  "source_anchored_delta",
  "calibrated_physics"
] as const satisfies readonly PersonalUseMvpCoveragePosture[];

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function orderedSubset<T extends string>(values: readonly T[], order: readonly T[]): readonly T[] {
  const valueSet = new Set(values);
  return order.filter((value) => valueSet.has(value));
}

function unique<T>(values: readonly T[]): readonly T[] {
  return [...new Set(values)];
}

function targetValuePins(input: ReturnType<typeof calculateAssembly>): PersonalUseMvpCoverageMetricValuePin[] {
  const pins: PersonalUseMvpCoverageMetricValuePin[] = [];
  const supported = new Set(input.supportedTargetOutputs);
  const maybePush = (metric: RequestedOutputId, value: number | undefined): void => {
    if (input.targetOutputs.includes(metric) && supported.has(metric) && typeof value === "number") {
      pins.push({ metric, value: round1(value) });
    }
  };

  maybePush("Rw", input.metrics.estimatedRwDb);
  maybePush("STC", input.metrics.estimatedStc);
  maybePush("C", input.metrics.estimatedCDb);
  maybePush("Ctr", input.metrics.estimatedCtrDb);

  return pins;
}

function buildGateYCltCtrRuntime(): Pick<PersonalUseMvpCoverageScenarioRow, "currentPosture" | "runtime"> {
  const result = calculateAssembly(CLT_WALL, {
    airborneContext: WALL_LAB_CONTEXT,
    calculator: "dynamic",
    targetOutputs: WALL_LAB_OUTPUTS
  });

  return {
    currentPosture: "family_physics",
    runtime: {
      basisId: result.airborneBasis?.method ?? null,
      errorBudgetDb: result.airborneBasis?.errorBudgetDb ?? null,
      missingPhysicalInputs: result.airborneBasis?.missingPhysicalInputs ?? [],
      origin: result.airborneBasis?.origin ?? null,
      publicEntryPoint: "calculateAssembly",
      selectedMethod: result.dynamicAirborneTrace?.selectedMethod ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: targetValuePins(result)
    }
  };
}

export function buildPersonalUseMvpCoverageSprintGateYScenarioMatrix(): readonly PersonalUseMvpCoverageScenarioRow[] {
  return buildPersonalUseMvpCoverageSprintGateXScenarioMatrix().map((row) => {
    if (row.id !== "wall.clt_mass_timber.lab") {
      return row;
    }

    const runtime = buildGateYCltCtrRuntime();

    return {
      ...row,
      currentPosture: runtime.currentPosture,
      expectedPosture: "family_physics",
      failureClass: "none",
      nextAction: "regression_guard",
      originSupportBucket: "source_absent_gate_y_clt_mass_timber_ctr_spectrum_adapter_family_physics",
      runtime: runtime.runtime,
      toleranceOrErrorBudget: "airborne_error_budget_6_db",
      valueOrBlockedReason:
        "Rw 42 / STC 42 / C -1.2 / Ctr -6.1 via Gate Y CLT/mass-timber Ctr spectrum adapter"
    };
  });
}

export function summarizePersonalUseMvpCoverageSprintGateY(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildPersonalUseMvpCoverageSprintGateYScenarioMatrix()
): PersonalUseMvpCoverageSprintGateYSummary {
  return {
    cltCtrRuntimeBasisId: GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD,
    cltCtrSelectedCandidateId: GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID,
    closedCoverageGapRowIds: ["wall.clt_mass_timber.lab"],
    currentPostureCoverage: orderedSubset(matrix.map((row) => row.currentPosture), POSTURE_COVERAGE_ORDER),
    failureClassCoverage: unique(matrix.map((row) => row.failureClass)),
    numericRuntimeValueMovement: false,
    remainingCoverageGapRowIds: matrix
      .filter((row) => row.failureClass === "coverage_gap")
      .map((row) => row.id),
    rowCount: matrix.length,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Y_SELECTED_NEXT_FILE
  };
}

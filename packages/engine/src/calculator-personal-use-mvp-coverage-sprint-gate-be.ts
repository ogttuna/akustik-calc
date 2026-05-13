import type {
  ImpactErrorBudget,
  ImpactOnlyCalculation,
  RequestedOutputId
} from "@dynecho/shared";

import { calculateImpactOnly } from "./calculate-impact-only";
import {
  buildPersonalUseMvpCoverageSprintGateBDRuntimeCorridorContract,
  GATE_BD_HEAVY_CONCRETE_COMBINED_RUNTIME_INPUT,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bd";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_LANDED_GATE =
  "gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTION_STATUS =
  "gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_landed_selected_input_surface_gate_bf";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTED_NEXT_ACTION =
  "gate_bf_personal_use_mvp_floor_impact_source_absent_input_surface_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bf-floor-impact-source-absent-input-surface-contract.test.ts";

const LAB_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];

export type PersonalUseMvpCoverageSprintGateBESurfaceId =
  | "calculator_api_payload"
  | "cards_and_posture"
  | "corridor_dossier"
  | "impact_metric_basis_copy"
  | "impact_only_api_payload"
  | "markdown_report"
  | "method_dossier"
  | "saved_replay"
  | "scenario_analysis"
  | "support_trace";

export type PersonalUseMvpCoverageSprintGateBESurfaceSnapshot = {
  readonly basis: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS;
  readonly budgetMetricIds: readonly ["Ln,w", "DeltaLw"];
  readonly deltaLwDb: 30.1;
  readonly deltaLwToleranceDb: 5.5;
  readonly id: PersonalUseMvpCoverageSprintGateBESurfaceId;
  readonly lnWDb: 44.4;
  readonly lnWToleranceDb: 6.5;
  readonly sourceAbsentNotMeasuredEvidence: true;
};

export type PersonalUseMvpCoverageSprintGateBEBoundaryGuard = {
  readonly budgetFree: true;
  readonly id:
    | "astm_iic_non_alias"
    | "exact_source_precedence"
    | "field_building_non_alias"
    | "heavy_floating_existing_corridor"
    | "missing_dynamic_stiffness"
    | "missing_lower_treatment";
  readonly reason: string;
};

export type PersonalUseMvpCoverageSprintGateBESurfaceParityContract = {
  readonly boundaryGuards: readonly PersonalUseMvpCoverageSprintGateBEBoundaryGuard[];
  readonly landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_LANDED_GATE;
  readonly previousGateBD: {
    readonly landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_LANDED_GATE;
    readonly selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTION_STATUS;
  };
  readonly runtimeMovedAtGateBE: false;
  readonly runtimeSnapshot: PersonalUseMvpCoverageSprintGateBESurfaceSnapshot;
  readonly selectedImplementationSlice: "personal_use_mvp_coverage_sprint_after_gate_be_floor_impact_source_absent_surface_parity";
  readonly selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTED_NEXT_FILE;
  readonly selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTION_STATUS;
  readonly visibleSurfaceSnapshots: readonly PersonalUseMvpCoverageSprintGateBESurfaceSnapshot[];
};

export type PersonalUseMvpCoverageSprintGateBESummary = {
  readonly landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_LANDED_GATE;
  readonly previousLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_LANDED_GATE;
  readonly runtimeBasis: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS;
  readonly runtimeDeltaLwDb: 30.1;
  readonly runtimeLnWDb: 44.4;
  readonly selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTED_NEXT_FILE;
  readonly selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTION_STATUS;
  readonly surfaceParityLandedBeforeInputSurface: true;
};

const VISIBLE_SURFACE_IDS = [
  "cards_and_posture",
  "impact_metric_basis_copy",
  "support_trace",
  "corridor_dossier",
  "method_dossier",
  "scenario_analysis",
  "saved_replay",
  "calculator_api_payload",
  "impact_only_api_payload",
  "markdown_report"
] as const satisfies readonly PersonalUseMvpCoverageSprintGateBESurfaceId[];

function runRuntime(): ImpactOnlyCalculation {
  return calculateImpactOnly([], {
    impactPredictorInput: GATE_BD_HEAVY_CONCRETE_COMBINED_RUNTIME_INPUT,
    targetOutputs: LAB_OUTPUTS
  });
}

function metricBudget(
  budgets: readonly ImpactErrorBudget[],
  metricId: "DeltaLw" | "Ln,w"
): ImpactErrorBudget {
  const budget = budgets.find((item) => item.metricId === metricId);

  if (!budget) {
    throw new Error(`Gate BE expected ${metricId} error budget to remain attached.`);
  }

  return budget;
}

function buildRuntimeSnapshot(id: PersonalUseMvpCoverageSprintGateBESurfaceId):
  PersonalUseMvpCoverageSprintGateBESurfaceSnapshot {
  const runtime = runRuntime();
  const impact = runtime.impact;

  if (
    !impact ||
    impact.basis !== PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS ||
    impact.LnW !== 44.4 ||
    impact.DeltaLw !== 30.1
  ) {
    throw new Error("Gate BE surface snapshot cannot move the Gate BD runtime values or basis.");
  }

  const budgets = impact.errorBudgets ?? [];
  const lnWBudget = metricBudget(budgets, "Ln,w");
  const deltaBudget = metricBudget(budgets, "DeltaLw");

  if (
    lnWBudget.toleranceDb !== 6.5 ||
    deltaBudget.toleranceDb !== 5.5 ||
    !lnWBudget.notMeasuredEvidence ||
    !deltaBudget.notMeasuredEvidence
  ) {
    throw new Error("Gate BE surface snapshot lost the Gate BD source-absent not-measured budgets.");
  }

  return {
    basis: impact.basis,
    budgetMetricIds: ["Ln,w", "DeltaLw"] as const,
    deltaLwDb: impact.DeltaLw,
    deltaLwToleranceDb: deltaBudget.toleranceDb,
    id,
    lnWDb: impact.LnW,
    lnWToleranceDb: lnWBudget.toleranceDb,
    sourceAbsentNotMeasuredEvidence: true
  };
}

function buildBoundaryGuards(): PersonalUseMvpCoverageSprintGateBEBoundaryGuard[] {
  return [
    {
      budgetFree: true,
      id: "exact_source_precedence",
      reason: "Exact UBIQ floor-system rows keep their measured Ln,w basis and do not inherit Gate BD DeltaLw budgets."
    },
    {
      budgetFree: true,
      id: "heavy_floating_existing_corridor",
      reason: "The older heavy floating-floor corridor keeps its own values and does not relabel as combined upper/lower."
    },
    {
      budgetFree: true,
      id: "missing_lower_treatment",
      reason: "Incomplete lower-ceiling owners stay needs_input/unsupported instead of showing the Gate BD budget."
    },
    {
      budgetFree: true,
      id: "missing_dynamic_stiffness",
      reason: "Missing resilient dynamic stiffness blocks the combined formula and stays budget-free."
    },
    {
      budgetFree: true,
      id: "astm_iic_non_alias",
      reason: "IIC and AIIC remain unsupported; ISO lab Ln,w/DeltaLw is not an ASTM adapter."
    },
    {
      budgetFree: true,
      id: "field_building_non_alias",
      reason: "Field and building impact outputs require their own basis owners and cannot borrow the lab budget."
    }
  ];
}

export function buildPersonalUseMvpCoverageSprintGateBESurfaceParityContract():
  PersonalUseMvpCoverageSprintGateBESurfaceParityContract {
  const gateBD = buildPersonalUseMvpCoverageSprintGateBDRuntimeCorridorContract();
  if (gateBD.selectedNextAction !== PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_LANDED_GATE) {
    throw new Error("Gate BE can only land after Gate BD selects floor-impact source-absent surface parity.");
  }

  const runtimeSnapshot = buildRuntimeSnapshot("support_trace");

  return {
    boundaryGuards: buildBoundaryGuards(),
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_LANDED_GATE,
    previousGateBD: {
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_LANDED_GATE,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTION_STATUS
    },
    runtimeMovedAtGateBE: false,
    runtimeSnapshot,
    selectedImplementationSlice:
      "personal_use_mvp_coverage_sprint_after_gate_be_floor_impact_source_absent_surface_parity",
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTED_NEXT_FILE,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BE_SELECTION_STATUS,
    visibleSurfaceSnapshots: VISIBLE_SURFACE_IDS.map((id) => buildRuntimeSnapshot(id))
  };
}

export function summarizePersonalUseMvpCoverageSprintGateBE(): PersonalUseMvpCoverageSprintGateBESummary {
  const contract = buildPersonalUseMvpCoverageSprintGateBESurfaceParityContract();

  return {
    landedGate: contract.landedGate,
    previousLandedGate: contract.previousGateBD.landedGate,
    runtimeBasis: contract.runtimeSnapshot.basis,
    runtimeDeltaLwDb: contract.runtimeSnapshot.deltaLwDb,
    runtimeLnWDb: contract.runtimeSnapshot.lnWDb,
    selectedNextAction: contract.selectedNextAction,
    selectedNextFile: contract.selectedNextFile,
    selectionStatus: contract.selectionStatus,
    surfaceParityLandedBeforeInputSurface: true
  };
}

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildPersonalUseMvpCoverageSprintGateATScenarioMatrix,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_BUILDING_ERROR_BUDGET_DB,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_BUILDING_RUNTIME_METHOD
} from "./calculator-personal-use-mvp-coverage-sprint-gate-at";
import type { PersonalUseMvpCoverageScenarioRow } from "./calculator-personal-use-mvp-coverage-sprint";
import {
  buildCompanyInternalCalculationGradeMainlineMatrix
} from "./company-internal-calculation-grade-mainline-matrix";
import {
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTION_STATUS
} from "./company-internal-steel-suspended-ceiling-delta-lw-owner-contract";
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB } from "./dynamic-airborne-gate-o-building-prediction-formula-corridor";
import { COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD } from "./company-internal-opening-leak-building-runtime-corridor";

export const COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_LANDED_GATE =
  "company_internal_airborne_building_prediction_runtime_terms_owner_contract_plan";

export const COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTION_STATUS =
  "company_internal_airborne_building_prediction_runtime_terms_owner_contract_landed_selected_matrix_v2_refresh";

export const COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTED_NEXT_ACTION =
  "company_internal_calculation_grade_mainline_matrix_v2_refresh_plan";

export const COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTED_NEXT_FILE =
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix-v2-contract.test.ts";

export const COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTED_NEXT_LABEL =
  "company-internal matrix v2 refresh after building-prediction reconciliation";

const BUILDING_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const BROAD_BUILDING_OUTPUTS = ["Rw", "STC", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const COMPLETE_BUILDING_CONTEXT: AirborneContext = {
  airtightness: "good",
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42,
  sourceRoomVolumeM3: 38
};

const PARTIAL_BUILDING_CONTEXT: AirborneContext = {
  ...COMPLETE_BUILDING_CONTEXT,
  receivingRoomRt60S: undefined,
  receivingRoomVolumeM3: undefined
};

const OPENING_BUILDING_CONTEXT: AirborneContext = {
  ...COMPLETE_BUILDING_CONTEXT,
  hostWallAreaM2: 12,
  openingLeakElements: [
    {
      areaM2: 1.8,
      count: 1,
      elementRwDb: 32,
      id: "door-01",
      origin: "catalogued",
      ratingBasis: "rw_single_number",
      sealLeakageClass: "average"
    }
  ]
};

const LINED_MASSIVE_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

export type CompanyInternalAirborneBuildingPredictionRuntimeProbe = {
  basisId: string | null;
  candidateId: string | null;
  dnTw: number | null;
  errorBudgetDb: number | null;
  missingPhysicalInputs: readonly string[];
  origin: string | null;
  requestedMetrics: readonly RequestedOutputId[];
  rwPrime: number | null;
  selectedMethod: string | null;
  supportedTargetOutputs: readonly RequestedOutputId[];
  unsupportedTargetOutputs: readonly RequestedOutputId[];
};

export type CompanyInternalAirborneBuildingPredictionRuntimeTermsOwnerContract = {
  completeBuildingProbe: CompanyInternalAirborneBuildingPredictionRuntimeProbe;
  currentCompanyMatrixHiddenScreeningOriginRowIds: readonly string[];
  currentCompanyMatrixRows: number;
  currentCompanyMatrixStaleBuildingRowIds: readonly string[];
  existingGateAtBuildingRowsToImport: readonly string[];
  existingGateAtRuntimeAccepted: true;
  gateAtBuildingErrorBudgetDb: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_BUILDING_ERROR_BUDGET_DB;
  gateAtBuildingRuntimeMethod: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_BUILDING_RUNTIME_METHOD;
  landedGate: typeof COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_LANDED_GATE;
  labAliasProbe: CompanyInternalAirborneBuildingPredictionRuntimeProbe;
  newNumericRuntimeBehaviorChange: false;
  openingLeakBuildingProbe: CompanyInternalAirborneBuildingPredictionRuntimeProbe;
  partialBuildingProbe: CompanyInternalAirborneBuildingPredictionRuntimeProbe;
  previousSteelOwnerSelectedNextAction: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTED_NEXT_ACTION;
  previousSteelOwnerSelectedNextFile: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTED_NEXT_FILE;
  previousSteelOwnerSelectionStatus: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTION_STATUS;
  selectedImplementationSlice: "company_internal_calculation_grade_mainline";
  selectedNextAction: typeof COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTED_NEXT_LABEL;
  selectionStatus: typeof COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
};

function round1(value: number | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.round(value * 10) / 10
    : null;
}

function buildProbe(input: {
  airborneContext: AirborneContext;
  targetOutputs: readonly RequestedOutputId[];
}): CompanyInternalAirborneBuildingPredictionRuntimeProbe {
  const result = calculateAssembly(LINED_MASSIVE_WALL, {
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    targetOutputs: input.targetOutputs
  });

  return {
    basisId: result.airborneBasis?.method ?? null,
    candidateId: result.airborneCandidateResolution?.selectedCandidateId ?? null,
    dnTw: round1(result.metrics.estimatedDnTwDb),
    errorBudgetDb: result.airborneBasis?.errorBudgetDb ?? null,
    missingPhysicalInputs: result.airborneBasis?.missingPhysicalInputs ?? [],
    origin: result.airborneBasis?.origin ?? null,
    requestedMetrics: input.targetOutputs,
    rwPrime: round1(result.metrics.estimatedRwPrimeDb),
    selectedMethod: result.dynamicAirborneTrace?.selectedMethod ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

function ids(rows: readonly PersonalUseMvpCoverageScenarioRow[]): readonly string[] {
  return rows.map((row) => row.id);
}

function hiddenScreeningOriginRows(
  rows: readonly PersonalUseMvpCoverageScenarioRow[]
): readonly string[] {
  return rows
    .filter((row) =>
      row.inputCompleteness === "complete" &&
      row.currentPosture === "family_physics" &&
      row.runtime.origin === "screening_fallback"
    )
    .map((row) => row.id);
}

export function buildCompanyInternalAirborneBuildingPredictionRuntimeTermsOwnerContract():
  CompanyInternalAirborneBuildingPredictionRuntimeTermsOwnerContract {
  const companyRows = buildCompanyInternalCalculationGradeMainlineMatrix();
  const companyRowIds = new Set(ids(companyRows));
  const gateAtRows = buildPersonalUseMvpCoverageSprintGateATScenarioMatrix();
  const gateAtRuntimeRows = [
    "wall.complete_building_prediction.runtime",
    "wall.complete_building_prediction_broad_targets.alias_boundary"
  ] as const;

  return {
    completeBuildingProbe: buildProbe({
      airborneContext: COMPLETE_BUILDING_CONTEXT,
      targetOutputs: BUILDING_OUTPUTS
    }),
    currentCompanyMatrixHiddenScreeningOriginRowIds: hiddenScreeningOriginRows(companyRows),
    currentCompanyMatrixRows: companyRows.length,
    currentCompanyMatrixStaleBuildingRowIds: [
      "wall.building_prediction_missing_context.needs_input"
    ].filter((id) => companyRowIds.has(id)),
    existingGateAtBuildingRowsToImport: gateAtRuntimeRows.filter((id) =>
      gateAtRows.some((row) => row.id === id)
    ),
    existingGateAtRuntimeAccepted: true,
    gateAtBuildingErrorBudgetDb: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_BUILDING_ERROR_BUDGET_DB,
    gateAtBuildingRuntimeMethod: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AT_BUILDING_RUNTIME_METHOD,
    landedGate: COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_LANDED_GATE,
    labAliasProbe: buildProbe({
      airborneContext: COMPLETE_BUILDING_CONTEXT,
      targetOutputs: BROAD_BUILDING_OUTPUTS
    }),
    newNumericRuntimeBehaviorChange: false,
    openingLeakBuildingProbe: buildProbe({
      airborneContext: OPENING_BUILDING_CONTEXT,
      targetOutputs: BROAD_BUILDING_OUTPUTS
    }),
    partialBuildingProbe: buildProbe({
      airborneContext: PARTIAL_BUILDING_CONTEXT,
      targetOutputs: BUILDING_OUTPUTS
    }),
    previousSteelOwnerSelectedNextAction:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTED_NEXT_ACTION,
    previousSteelOwnerSelectedNextFile:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTED_NEXT_FILE,
    previousSteelOwnerSelectionStatus:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTION_STATUS,
    selectedImplementationSlice: "company_internal_calculation_grade_mainline",
    selectedNextAction: COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTED_NEXT_ACTION,
    selectedNextFile: COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTED_NEXT_FILE,
    selectedNextLabel: COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTED_NEXT_LABEL,
    selectionStatus: COMPANY_INTERNAL_AIRBORNE_BUILDING_PREDICTION_RUNTIME_TERMS_OWNER_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false
  };
}

export function assertCompanyInternalAirborneBuildingPredictionRuntimeTermsOwnerContract(
  contract: CompanyInternalAirborneBuildingPredictionRuntimeTermsOwnerContract =
    buildCompanyInternalAirborneBuildingPredictionRuntimeTermsOwnerContract()
): void {
  if (
    contract.completeBuildingProbe.rwPrime !== 58 ||
    contract.completeBuildingProbe.dnTw !== 59 ||
    contract.completeBuildingProbe.basisId !== GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD ||
    contract.completeBuildingProbe.candidateId !== GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID ||
    contract.completeBuildingProbe.errorBudgetDb !== GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB
  ) {
    throw new Error("Company-internal building-prediction contract lost the accepted Gate AR runtime.");
  }

  if (contract.partialBuildingProbe.origin !== "needs_input") {
    throw new Error("Company-internal building-prediction partial context must stay needs_input.");
  }

  if (
    contract.openingLeakBuildingProbe.basisId !== COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD ||
    contract.openingLeakBuildingProbe.rwPrime !== 31.6 ||
    contract.openingLeakBuildingProbe.dnTw !== 32.1
  ) {
    throw new Error("Opening/leak building prediction must use the landed dedicated adapter owner.");
  }
}

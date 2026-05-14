import type {
  AirborneContext,
  AssemblyCalculation,
  ExactImpactSource,
  ImpactCalculation,
  ImpactErrorBudget,
  ImpactFieldContext,
  ImpactOnlyCalculation,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN,
  FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_W_TOLERANCE_DB,
  FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NW_TOLERANCE_DB,
  FLOOR_IMPACT_DIRECT_FLANKING_LPRIME_NT_W_TOLERANCE_DB,
  FLOOR_IMPACT_DIRECT_FLANKING_LPRIME_NW_TOLERANCE_DB
} from "./impact-field-adapter-error-budget";
import {
  buildPersonalUseMvpCoverageSprintGateBIContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bi";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_LANDED_GATE =
  "gate_bj_personal_use_mvp_floor_impact_field_building_runtime_corridor_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTION_STATUS =
  "gate_bj_personal_use_mvp_floor_impact_field_building_runtime_corridor_landed_selected_steel_floor_low_confidence_cleanup_gate_bk";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_ACTION =
  "gate_bk_personal_use_mvp_steel_floor_low_confidence_fallback_cleanup_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bk-steel-floor-low-confidence-fallback-cleanup-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_LABEL =
  "steel-floor low-confidence fallback cleanup";

export const GATE_BJ_FIELD_IMPACT_RUNTIME_BUDGET_ORIGIN =
  FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN;

type GateBJRuntimeScenarioStatus =
  | "blocked_low_frequency_owner"
  | "needs_input"
  | "ready_with_runtime_corridor"
  | "ready_with_runtime_corridor_and_low_frequency_boundary"
  | "unsupported_basis";

type GateBJRuntimeScenarioBasis = "building_prediction" | "field_apparent" | "impact_only_field" | "unsupported";

export type PersonalUseMvpCoverageSprintGateBJMetricValuePin = {
  metric: RequestedOutputId;
  value: number;
};

export type PersonalUseMvpCoverageSprintGateBJBudgetPin = {
  estimate: number;
  metricId: string;
  origin: typeof FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN | string;
  termIds: readonly string[];
  toleranceDb: number;
  totalBudgetDb: number;
};

export type PersonalUseMvpCoverageSprintGateBJRuntimeScenario = {
  adapterBasis: GateBJRuntimeScenarioBasis;
  basisId: ImpactCalculation["basis"] | null;
  budgetPins: readonly PersonalUseMvpCoverageSprintGateBJBudgetPin[];
  confidenceLevel: ImpactCalculation["confidence"]["level"] | null;
  confidenceScore: number | null;
  directFlankingActive: boolean;
  fieldContinuation: string | null;
  id: string;
  missingPhysicalInputs: readonly string[];
  publicEntryPoint: "calculateAssembly" | "calculateImpactOnly";
  status: GateBJRuntimeScenarioStatus;
  supportedTargetOutputs: readonly RequestedOutputId[];
  targetOutputs: readonly RequestedOutputId[];
  unsupportedTargetOutputs: readonly RequestedOutputId[];
  valuePins: readonly PersonalUseMvpCoverageSprintGateBJMetricValuePin[];
  warnings: readonly string[];
};

export type PersonalUseMvpCoverageSprintGateBJContract = {
  astmImpactAdapterAdded: false;
  buildingPredictionUsesDirectFlankingOwner: true;
  fieldBudgetOrigin: typeof FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN;
  fieldRuntimeCorridorPromoted: true;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_LANDED_GATE;
  lowConfidenceDirectFlankingFallbackRemoved: true;
  lowFrequencyRuntimePromoted: false;
  noLabFieldBuildingAlias: true;
  previousGateBI: {
    landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_LANDED_GATE;
    selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_FILE;
    selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTION_STATUS;
  };
  runtimeValueRetune: false;
  scenarioPack: readonly PersonalUseMvpCoverageSprintGateBJRuntimeScenario[];
  selectedImplementationSlice: "personal_use_mvp_coverage_sprint_after_gate_bi_floor_impact_field_building_runtime_corridor";
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_LABEL;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
  tolerancePins: {
    directFlankingLPrimeNTw: typeof FLOOR_IMPACT_DIRECT_FLANKING_LPRIME_NT_W_TOLERANCE_DB;
    directFlankingLPrimeNW: typeof FLOOR_IMPACT_DIRECT_FLANKING_LPRIME_NW_TOLERANCE_DB;
    fieldVolumeLPrimeNTw: typeof FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_W_TOLERANCE_DB;
    fieldVolumeLPrimeNW: typeof FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NW_TOLERANCE_DB;
  };
};

export const GATE_BJ_HEAVY_FLOATING_FLOOR_STACK = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
] as const satisfies readonly LayerInput[];

export const GATE_BJ_FLOOR_IMPACT_CONTEXT = {
  loadBasisKgM2: 76,
  resilientLayerDynamicStiffnessMNm3: 30
} as const;

export const GATE_BJ_FIELD_AIRBORNE_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2700,
  panelWidthMm: 5000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 55
} as const satisfies AirborneContext;

export const GATE_BJ_BUILDING_AIRBORNE_CONTEXT = {
  buildingPredictionOutputBasis: "standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4,
  panelHeightMm: 2700,
  panelWidthMm: 5000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 55,
  sourceRoomVolumeM3: 60
} as const satisfies AirborneContext;

export const GATE_BJ_FIELD_K_IMPACT_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

export const GATE_BJ_DIRECT_FLANKING_IMPACT_CONTEXT = {
  directPathOffsetDb: 1,
  flankingPaths: [
    {
      edgeIsolationClass: "partial",
      id: "gate_bj_edge_flank",
      junctionClass: "rigid",
      junctionLengthM: 4,
      levelOffsetDb: -6,
      pathCount: 1,
      pathType: "edge",
      shortCircuitRisk: "medium"
    }
  ],
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

export const GATE_BJ_EXACT_IMPACT_SOURCE = {
  frequenciesHz: [50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150],
  labOrField: "lab",
  levelsDb: [60, 59, 58, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43]
} satisfies ExactImpactSource;

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function valuePinsFromImpact(
  impact: ImpactCalculation | null | undefined,
  targetOutputs: readonly RequestedOutputId[]
): PersonalUseMvpCoverageSprintGateBJMetricValuePin[] {
  const pins: PersonalUseMvpCoverageSprintGateBJMetricValuePin[] = [];
  const push = (metric: RequestedOutputId, value: number | undefined): void => {
    if (targetOutputs.includes(metric) && typeof value === "number" && Number.isFinite(value)) {
      pins.push({ metric, value: round1(value) });
    }
  };

  push("Ln,w", impact?.LnW);
  push("DeltaLw", impact?.DeltaLw);
  push("L'n,w", impact?.LPrimeNW);
  push("L'nT,w", impact?.LPrimeNTw);
  push("L'nT,50", impact?.LPrimeNT50);

  return pins;
}

function budgetPinsFromImpact(
  impact: ImpactCalculation | null | undefined
): PersonalUseMvpCoverageSprintGateBJBudgetPin[] {
  return (impact?.errorBudgets ?? [])
    .filter((budget: ImpactErrorBudget) => budget.origin === FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN)
    .map((budget: ImpactErrorBudget) => ({
      estimate: budget.estimate,
      metricId: budget.metricId,
      origin: budget.origin,
      termIds: budget.terms.map((term) => term.termId),
      toleranceDb: budget.toleranceDb,
      totalBudgetDb: budget.totalBudgetDb
    }));
}

type GateBJCalculationResult = Pick<
  AssemblyCalculation | ImpactOnlyCalculation,
  "dynamicImpactTrace" | "impact" | "supportedTargetOutputs" | "targetOutputs" | "unsupportedTargetOutputs" | "warnings"
>;

function toGateBJCalculationResult(calculation: AssemblyCalculation | ImpactOnlyCalculation): GateBJCalculationResult {
  return {
    dynamicImpactTrace: calculation.dynamicImpactTrace,
    impact: calculation.impact,
    supportedTargetOutputs: calculation.supportedTargetOutputs,
    targetOutputs: calculation.targetOutputs,
    unsupportedTargetOutputs: calculation.unsupportedTargetOutputs,
    warnings: calculation.warnings
  };
}

function scenarioFromResult(input: {
  adapterBasis: GateBJRuntimeScenarioBasis;
  id: string;
  missingPhysicalInputs?: readonly string[];
  publicEntryPoint: "calculateAssembly" | "calculateImpactOnly";
  result: GateBJCalculationResult;
  status: GateBJRuntimeScenarioStatus;
}): PersonalUseMvpCoverageSprintGateBJRuntimeScenario {
  return {
    adapterBasis: input.adapterBasis,
    basisId: input.result.impact?.basis ?? null,
    budgetPins: budgetPinsFromImpact(input.result.impact),
    confidenceLevel: input.result.impact?.confidence.level ?? null,
    confidenceScore: input.result.impact?.confidence.score ?? null,
    directFlankingActive: input.result.dynamicImpactTrace?.directFlankingActive ?? false,
    fieldContinuation: input.result.dynamicImpactTrace?.fieldContinuation ?? null,
    id: input.id,
    missingPhysicalInputs: input.missingPhysicalInputs ?? [],
    publicEntryPoint: input.publicEntryPoint,
    status: input.status,
    supportedTargetOutputs: input.result.supportedTargetOutputs,
    targetOutputs: input.result.targetOutputs,
    unsupportedTargetOutputs: input.result.unsupportedTargetOutputs,
    valuePins: valuePinsFromImpact(input.result.impact, input.result.targetOutputs),
    warnings: input.result.warnings
  };
}

export function buildPersonalUseMvpCoverageSprintGateBJScenarioPack():
  readonly PersonalUseMvpCoverageSprintGateBJRuntimeScenario[] {
  const fieldRuntime = calculateAssembly(GATE_BJ_HEAVY_FLOATING_FLOOR_STACK, {
    airborneContext: GATE_BJ_FIELD_AIRBORNE_CONTEXT,
    calculator: "dynamic",
    floorImpactContext: GATE_BJ_FLOOR_IMPACT_CONTEXT,
    impactFieldContext: GATE_BJ_FIELD_K_IMPACT_CONTEXT,
    targetOutputs: ["L'n,w", "L'nT,w"]
  });
  const buildingRuntime = calculateAssembly(GATE_BJ_HEAVY_FLOATING_FLOOR_STACK, {
    airborneContext: GATE_BJ_BUILDING_AIRBORNE_CONTEXT,
    calculator: "dynamic",
    floorImpactContext: GATE_BJ_FLOOR_IMPACT_CONTEXT,
    impactFieldContext: GATE_BJ_DIRECT_FLANKING_IMPACT_CONTEXT,
    targetOutputs: ["L'nT,w", "L'nT,50"]
  });
  const missingContext = calculateAssembly(GATE_BJ_HEAVY_FLOATING_FLOOR_STACK, {
    airborneContext: GATE_BJ_FIELD_AIRBORNE_CONTEXT,
    calculator: "dynamic",
    floorImpactContext: GATE_BJ_FLOOR_IMPACT_CONTEXT,
    targetOutputs: ["L'n,w", "L'nT,w"]
  });
  const lowFrequencyBlocked = calculateAssembly(GATE_BJ_HEAVY_FLOATING_FLOOR_STACK, {
    airborneContext: GATE_BJ_FIELD_AIRBORNE_CONTEXT,
    calculator: "dynamic",
    floorImpactContext: GATE_BJ_FLOOR_IMPACT_CONTEXT,
    impactFieldContext: GATE_BJ_FIELD_K_IMPACT_CONTEXT,
    targetOutputs: ["L'nT,50"]
  });
  const astmBoundary = calculateAssembly(GATE_BJ_HEAVY_FLOATING_FLOOR_STACK, {
    airborneContext: GATE_BJ_FIELD_AIRBORNE_CONTEXT,
    calculator: "dynamic",
    floorImpactContext: GATE_BJ_FLOOR_IMPACT_CONTEXT,
    impactFieldContext: GATE_BJ_FIELD_K_IMPACT_CONTEXT,
    targetOutputs: ["IIC", "AIIC"]
  });
  const impactOnlyDirectFlanking = calculateImpactOnly([{ materialId: "air_gap", thicknessMm: 90 }], {
    exactImpactSource: GATE_BJ_EXACT_IMPACT_SOURCE,
    impactFieldContext: GATE_BJ_DIRECT_FLANKING_IMPACT_CONTEXT,
    targetOutputs: ["L'n,w", "L'nT,w", "L'nT,50"]
  });

  return [
    scenarioFromResult({
      adapterBasis: "field_apparent",
      id: "gate_bj_complete_field_volume_runtime_corridor",
      publicEntryPoint: "calculateAssembly",
      result: toGateBJCalculationResult(fieldRuntime),
      status: "ready_with_runtime_corridor"
    }),
    scenarioFromResult({
      adapterBasis: "building_prediction",
      id: "gate_bj_complete_building_direct_flanking_runtime_corridor",
      publicEntryPoint: "calculateAssembly",
      result: toGateBJCalculationResult(buildingRuntime),
      status: "ready_with_runtime_corridor_and_low_frequency_boundary"
    }),
    scenarioFromResult({
      adapterBasis: "field_apparent",
      id: "gate_bj_missing_impact_field_context_needs_input",
      missingPhysicalInputs: ["impactFieldContext"],
      publicEntryPoint: "calculateAssembly",
      result: toGateBJCalculationResult(missingContext),
      status: "needs_input"
    }),
    scenarioFromResult({
      adapterBasis: "field_apparent",
      id: "gate_bj_low_frequency_lnt50_stays_blocked_without_owner",
      missingPhysicalInputs: ["lowFrequencyImpactSpectrumOrCI50_2500Owner"],
      publicEntryPoint: "calculateAssembly",
      result: toGateBJCalculationResult(lowFrequencyBlocked),
      status: "blocked_low_frequency_owner"
    }),
    scenarioFromResult({
      adapterBasis: "unsupported",
      id: "gate_bj_astm_iic_aiic_remains_unsupported",
      publicEntryPoint: "calculateAssembly",
      result: toGateBJCalculationResult(astmBoundary),
      status: "unsupported_basis"
    }),
    scenarioFromResult({
      adapterBasis: "impact_only_field",
      id: "gate_bj_impact_only_direct_flanking_runtime_payload",
      publicEntryPoint: "calculateImpactOnly",
      result: toGateBJCalculationResult(impactOnlyDirectFlanking),
      status: "ready_with_runtime_corridor"
    })
  ];
}

export function buildPersonalUseMvpCoverageSprintGateBJContract():
  PersonalUseMvpCoverageSprintGateBJContract {
  const gateBI = buildPersonalUseMvpCoverageSprintGateBIContract();

  if (gateBI.selectedNextAction !== PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_LANDED_GATE) {
    throw new Error("Gate BJ can only land after Gate BI selects the floor-impact field/building runtime corridor.");
  }

  return {
    astmImpactAdapterAdded: false,
    buildingPredictionUsesDirectFlankingOwner: true,
    fieldBudgetOrigin: FLOOR_IMPACT_FIELD_BUILDING_ADAPTER_ERROR_BUDGET_ORIGIN,
    fieldRuntimeCorridorPromoted: true,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_LANDED_GATE,
    lowConfidenceDirectFlankingFallbackRemoved: true,
    lowFrequencyRuntimePromoted: false,
    noLabFieldBuildingAlias: true,
    previousGateBI: {
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_LANDED_GATE,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTION_STATUS
    },
    runtimeValueRetune: false,
    scenarioPack: buildPersonalUseMvpCoverageSprintGateBJScenarioPack(),
    selectedImplementationSlice:
      "personal_use_mvp_coverage_sprint_after_gate_bi_floor_impact_field_building_runtime_corridor",
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_FILE,
    selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_LABEL,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    tolerancePins: {
      directFlankingLPrimeNTw: FLOOR_IMPACT_DIRECT_FLANKING_LPRIME_NT_W_TOLERANCE_DB,
      directFlankingLPrimeNW: FLOOR_IMPACT_DIRECT_FLANKING_LPRIME_NW_TOLERANCE_DB,
      fieldVolumeLPrimeNTw: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_W_TOLERANCE_DB,
      fieldVolumeLPrimeNW: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NW_TOLERANCE_DB
    }
  };
}

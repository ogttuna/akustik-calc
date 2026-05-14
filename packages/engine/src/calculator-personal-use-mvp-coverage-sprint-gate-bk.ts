import type {
  AcousticInputFieldId,
  ImpactCalculation,
  ImpactOnlyCalculation,
  ImpactPredictorInput,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  buildGateADSteelFloorImpactFormulaScenarioPack,
  getMissingSteelFloorSuspendedCeilingFormulaInputs,
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_LN_W_TOLERANCE_DB
} from "./steel-floor-impact-formula-corridor";
import { maybeBuildImpactPredictorInputFromLayerStack } from "./impact-predictor-input";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bj";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_LANDED_GATE =
  "gate_bk_personal_use_mvp_steel_floor_low_confidence_fallback_cleanup_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTION_STATUS =
  "gate_bk_personal_use_mvp_steel_floor_low_confidence_fallback_cleanup_landed_selected_suspended_ceiling_input_surface_gate_bl";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_ACTION =
  "gate_bl_personal_use_mvp_steel_floor_suspended_ceiling_input_surface_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bl-steel-floor-suspended-ceiling-input-surface-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_LABEL =
  "steel-floor suspended-ceiling input surface";

type GateBKScenarioStatus =
  | "exact_source_precedence"
  | "needs_input_before_cleanup"
  | "ready_with_existing_upper_lower_formula"
  | "ready_with_suspended_ceiling_formula";

export type PersonalUseMvpCoverageSprintGateBKBudgetPin = {
  estimate: number;
  metricId: string;
  origin: string;
  termIds: readonly string[];
  toleranceDb: number;
  totalBudgetDb: number;
};

export type PersonalUseMvpCoverageSprintGateBKMetricValuePin = {
  metric: RequestedOutputId;
  value: number;
};

export type PersonalUseMvpCoverageSprintGateBKRuntimeScenario = {
  basisId: ImpactCalculation["basis"] | null;
  budgetPins: readonly PersonalUseMvpCoverageSprintGateBKBudgetPin[];
  confidenceLevel: ImpactCalculation["confidence"]["level"] | null;
  floorSystemEstimateKind: string | null;
  id: string;
  lowConfidenceFallbackActive: boolean;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  publicEntryPoint: "calculateAssembly" | "calculateImpactOnly" | "contract_only";
  status: GateBKScenarioStatus;
  supportedTargetOutputs: readonly RequestedOutputId[];
  targetOutputs: readonly RequestedOutputId[];
  unsupportedTargetOutputs: readonly RequestedOutputId[];
  valuePins: readonly PersonalUseMvpCoverageSprintGateBKMetricValuePin[];
  warnings: readonly string[];
};

export type PersonalUseMvpCoverageSprintGateBKContract = {
  completeSteelSuspendedCeilingLowConfidenceRemoved: true;
  existingGateADRuntimeFrozen: true;
  generatedFallbackStillRequiresInputSurface: true;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_LANDED_GATE;
  noAstmOrFieldAliasAdded: true;
  previousGateBJ: {
    landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_LANDED_GATE;
    selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_FILE;
    selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTION_STATUS;
  };
  runtimeValueRetune: false;
  scenarioPack: readonly PersonalUseMvpCoverageSprintGateBKRuntimeScenario[];
  selectedImplementationSlice: "personal_use_mvp_coverage_sprint_after_gate_bj_steel_floor_low_confidence_cleanup";
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_LABEL;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTION_STATUS;
  sourceRowsRequiredForSuspendedCeilingRuntime: false;
  tolerancePins: {
    existingGateADDeltaLw: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    existingGateADLnW: typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB;
    suspendedCeilingLnW: typeof STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_LN_W_TOLERANCE_DB;
  };
};

export const GATE_BK_COMPLETE_STEEL_SUSPENDED_CEILING_INPUT = {
  baseSlab: {
    densityKgM3: 7850,
    materialClass: "lightweight_steel_carrier",
    thicknessMm: 250
  },
  carrierSpacingMm: 600,
  floorCovering: {
    densityKgM3: 1400,
    materialClass: "vinyl_flooring",
    mode: "material_layer",
    thicknessMm: 3
  },
  impactSystemType: "suspended_ceiling_only",
  lowerTreatment: {
    boardLayerCount: 2,
    boardMaterialClass: "firestop_board",
    boardThicknessMm: 16,
    cavityDepthMm: 120,
    cavityFillThicknessMm: 100,
    supportClass: "furred_channels",
    type: "suspended_ceiling_elastic_hanger"
  },
  structuralSupportType: "steel_joists",
  supportForm: "joist_or_purlin"
} as const satisfies ImpactPredictorInput;

export const GATE_BK_GENERATED_STEEL_FALLBACK_STACK = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 120 },
  { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 3 },
  { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const GATE_BK_TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  "Rw",
  "Ctr",
  "IIC",
  "AIIC",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const PLITEQ_EXACT_SOURCE_STACK = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 120 },
  { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 2.5 },
  { floorRole: "resilient_layer", materialId: "geniemat_rst02", thicknessMm: 2 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function valuePinsFromImpact(
  impact: ImpactCalculation | null | undefined,
  targetOutputs: readonly RequestedOutputId[]
): PersonalUseMvpCoverageSprintGateBKMetricValuePin[] {
  const pins: PersonalUseMvpCoverageSprintGateBKMetricValuePin[] = [];
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
): PersonalUseMvpCoverageSprintGateBKBudgetPin[] {
  return (impact?.errorBudgets ?? []).map((budget) => ({
    estimate: budget.estimate,
    metricId: budget.metricId,
    origin: budget.origin,
    termIds: budget.terms.map((term) => term.termId),
    toleranceDb: budget.toleranceDb,
    totalBudgetDb: budget.totalBudgetDb
  }));
}

function scenarioFromImpactOnly(input: {
  id: string;
  missingPhysicalInputs?: readonly AcousticInputFieldId[];
  result: ImpactOnlyCalculation;
  status: GateBKScenarioStatus;
  targetOutputs: readonly RequestedOutputId[];
}): PersonalUseMvpCoverageSprintGateBKRuntimeScenario {
  return {
    basisId: input.result.impact?.basis ?? null,
    budgetPins: budgetPinsFromImpact(input.result.impact),
    confidenceLevel: input.result.impact?.confidence.level ?? null,
    floorSystemEstimateKind: input.result.floorSystemEstimate?.kind ?? null,
    id: input.id,
    lowConfidenceFallbackActive: input.result.floorSystemEstimate?.kind === "low_confidence",
    missingPhysicalInputs: input.missingPhysicalInputs ?? [],
    publicEntryPoint: "calculateImpactOnly",
    status: input.status,
    supportedTargetOutputs: input.result.supportedTargetOutputs,
    targetOutputs: input.targetOutputs,
    unsupportedTargetOutputs: input.result.unsupportedTargetOutputs,
    valuePins: valuePinsFromImpact(input.result.impact, input.targetOutputs),
    warnings: input.result.warnings
  };
}

function generatedSteelFallbackScenario(): PersonalUseMvpCoverageSprintGateBKRuntimeScenario {
  const predictorInput = maybeBuildImpactPredictorInputFromLayerStack(GATE_BK_GENERATED_STEEL_FALLBACK_STACK);
  const result = calculateAssembly(GATE_BK_GENERATED_STEEL_FALLBACK_STACK, {
    impactPredictorInput: predictorInput,
    targetOutputs: GATE_BK_TARGET_OUTPUTS
  });

  return {
    basisId: result.impact?.basis ?? null,
    budgetPins: budgetPinsFromImpact(result.impact),
    confidenceLevel: result.impact?.confidence.level ?? null,
    floorSystemEstimateKind: result.floorSystemEstimate?.kind ?? null,
    id: "gate_bk_generated_steel_fallback_missing_owner_set",
    lowConfidenceFallbackActive: result.floorSystemEstimate?.kind === "low_confidence",
    missingPhysicalInputs: getMissingSteelFloorSuspendedCeilingFormulaInputs(predictorInput),
    publicEntryPoint: "calculateAssembly",
    status: "needs_input_before_cleanup",
    supportedTargetOutputs: result.supportedTargetOutputs,
    targetOutputs: GATE_BK_TARGET_OUTPUTS,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs,
    valuePins: valuePinsFromImpact(result.impact, GATE_BK_TARGET_OUTPUTS),
    warnings: result.warnings
  };
}

export function buildPersonalUseMvpCoverageSprintGateBKScenarioPack(): readonly PersonalUseMvpCoverageSprintGateBKRuntimeScenario[] {
  const suspendedRuntime = calculateImpactOnly([], {
    impactPredictorInput: GATE_BK_COMPLETE_STEEL_SUSPENDED_CEILING_INPUT,
    targetOutputs: GATE_BK_TARGET_OUTPUTS
  });
  const existingGateAD = buildGateADSteelFloorImpactFormulaScenarioPack()[0]?.contract.impact ?? null;
  const exactSource = calculateImpactOnly(PLITEQ_EXACT_SOURCE_STACK, {
    targetOutputs: GATE_BK_TARGET_OUTPUTS
  });

  return [
    scenarioFromImpactOnly({
      id: "gate_bk_complete_suspended_ceiling_steel_formula_corridor",
      result: suspendedRuntime,
      status: "ready_with_suspended_ceiling_formula",
      targetOutputs: GATE_BK_TARGET_OUTPUTS
    }),
    {
      basisId: existingGateAD?.basis ?? null,
      budgetPins: budgetPinsFromImpact(existingGateAD),
      confidenceLevel: existingGateAD?.confidence.level ?? null,
      floorSystemEstimateKind: null,
      id: "gate_bk_existing_gate_ad_upper_lower_formula_stays_frozen",
      lowConfidenceFallbackActive: false,
      missingPhysicalInputs: [],
      publicEntryPoint: "contract_only",
      status: "ready_with_existing_upper_lower_formula",
      supportedTargetOutputs: ["Ln,w", "DeltaLw"],
      targetOutputs: ["Ln,w", "DeltaLw"],
      unsupportedTargetOutputs: [],
      valuePins: valuePinsFromImpact(existingGateAD, ["Ln,w", "DeltaLw"]),
      warnings: []
    },
    scenarioFromImpactOnly({
      id: "gate_bk_exact_source_precedence_stays_first",
      result: exactSource,
      status: "exact_source_precedence",
      targetOutputs: GATE_BK_TARGET_OUTPUTS
    }),
    generatedSteelFallbackScenario()
  ];
}

export function buildPersonalUseMvpCoverageSprintGateBKContract(): PersonalUseMvpCoverageSprintGateBKContract {
  return {
    completeSteelSuspendedCeilingLowConfidenceRemoved: true,
    existingGateADRuntimeFrozen: true,
    generatedFallbackStillRequiresInputSurface: true,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_LANDED_GATE,
    noAstmOrFieldAliasAdded: true,
    previousGateBJ: {
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_LANDED_GATE,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_SELECTION_STATUS
    },
    runtimeValueRetune: false,
    scenarioPack: buildPersonalUseMvpCoverageSprintGateBKScenarioPack(),
    selectedImplementationSlice:
      "personal_use_mvp_coverage_sprint_after_gate_bj_steel_floor_low_confidence_cleanup",
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_FILE,
    selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTED_NEXT_LABEL,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_SELECTION_STATUS,
    sourceRowsRequiredForSuspendedCeilingRuntime: false,
    tolerancePins: {
      existingGateADDeltaLw: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      existingGateADLnW: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
      suspendedCeilingLnW: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_LN_W_TOLERANCE_DB
    }
  };
}

export const GATE_BK_STEEL_FLOOR_BASIS_REGISTRY = {
  existingUpperLowerBasis: STEEL_FLOOR_FORMULA_BASIS,
  suspendedCeilingOnlyBasis: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS
} as const;

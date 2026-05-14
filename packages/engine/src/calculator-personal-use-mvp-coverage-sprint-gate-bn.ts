import type {
  ImpactCalculation,
  ImpactErrorBudget,
  ImpactPredictorInput,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
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
  buildPersonalUseMvpCoverageSprintGateATScenarioMatrix,
  summarizePersonalUseMvpCoverageSprintGateAT
} from "./calculator-personal-use-mvp-coverage-sprint-gate-at";
import {
  buildPersonalUseMvpCoverageSprintGateBKScenarioPack
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bk";
import {
  GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE,
  GATE_BL_PARTIAL_STEEL_SUSPENDED_CEILING_SURFACE,
  GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS,
  GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bl";
import {
  buildPersonalUseMvpCoverageSprintGateBMRevalidationContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bm";
import { buildSteelFloorFormulaPredictorInputFromSurface } from "./steel-floor-formula-input-surface";
import {
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_LN_W_TOLERANCE_DB
} from "./steel-floor-impact-formula-corridor";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_LANDED_GATE =
  "gate_bn_personal_use_mvp_coverage_matrix_refresh_after_steel_suspended_ceiling_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTION_STATUS =
  "gate_bn_personal_use_mvp_coverage_matrix_refresh_after_steel_suspended_ceiling_landed_no_runtime_selected_reinforced_concrete_low_confidence_cleanup_gate_bo";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_ACTION =
  "gate_bo_personal_use_mvp_reinforced_concrete_low_confidence_cleanup_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bo-reinforced-concrete-low-confidence-cleanup-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_LABEL =
  "reinforced-concrete low-confidence cleanup";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_STEEL_ROW_IDS = [
  "floor.lightweight_steel_suspended_ceiling.lab",
  "floor.lightweight_steel_suspended_ceiling_safe_reorder.lab",
  "floor.lightweight_steel_suspended_ceiling_partial.needs_input",
  "floor.lightweight_steel_suspended_ceiling_duplicate_carrier.refused",
  "floor.lightweight_steel_suspended_ceiling_exact_source_precedence.lab",
  "floor.lightweight_steel_suspended_ceiling_field_adapter.lprime",
  "floor.lightweight_steel_suspended_ceiling_delta_lw.unsupported",
  "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
  "floor.lightweight_steel_suspended_ceiling_lnt50.unsupported"
] as const;

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_CALCULATION_GRADE_BLOCKER_ROW_IDS = [
  "floor.reinforced_concrete_low_confidence_combined.cleanup_candidate"
] as const;

type GateBOLaneId =
  | "astm_iic_aiic_adapter_after_iso"
  | "broad_floor_source_crawl"
  | "reinforced_concrete_low_confidence_cleanup"
  | "steel_suspended_ceiling_delta_lw_owner_contract"
  | "steel_suspended_ceiling_low_frequency_owner_contract";

export type PersonalUseMvpCoverageSprintGateBOLaneCandidate = {
  basisLeakageRisk: number;
  calculationGradeRisk: number;
  evidenceRowIds: readonly string[];
  id: GateBOLaneId;
  implementationCost: number;
  reason: string;
  score: number;
  selected: boolean;
  sourceRowsRequiredForRuntimeSelection: boolean;
  userFrequency: number;
};

export type PersonalUseMvpCoverageSprintGateBOLaneSelection = {
  candidates: readonly PersonalUseMvpCoverageSprintGateBOLaneCandidate[];
  selectedCandidate: PersonalUseMvpCoverageSprintGateBOLaneCandidate;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
};

export type PersonalUseMvpCoverageSprintGateBNContract = {
  apiShapeChange: false;
  evidencePromotion: false;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_LANDED_GATE;
  matrixRows: 51;
  matrixRowsAddedAtGateBN: 10;
  numericRuntimeBehaviorChange: false;
  previousGateBM: {
    landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_LANDED_GATE;
    selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_FILE;
    selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTION_STATUS;
  };
  routeCardValueChange: false;
  selectedImplementationSlice: "personal_use_mvp_coverage_sprint_after_gate_bm_steel_suspended_ceiling_matrix_refresh";
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_LABEL;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
  workbenchInputBehaviorChange: false;
};

export type PersonalUseMvpCoverageSprintGateBNSummary = {
  basisCoverage: readonly PersonalUseMvpCoverageOutputBasis[];
  calculationGradeBlockerRowIds: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_CALCULATION_GRADE_BLOCKER_ROW_IDS;
  correctlyBlockedRowIds: readonly string[];
  currentPostureCoverage: readonly PersonalUseMvpCoveragePosture[];
  exactSourcePrecedenceRowIds: readonly string[];
  failureClassCounts: Readonly<Record<PersonalUseMvpCoverageFailureClass, number>>;
  matrixRowsAddedAtGateBN: 10;
  noRuntimeValueMovement: true;
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTION_STATUS;
  remainingCalculationGradeBlockerRowIds: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_CALCULATION_GRADE_BLOCKER_ROW_IDS;
  routeCoverage: readonly PersonalUseMvpCoverageRoute[];
  rowCount: 51;
  selectedGateBOLane: GateBOLaneId;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_FILE;
  steelSuspendedCeilingRowIds: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_STEEL_ROW_IDS;
  unsupportedSteelSuspendedCeilingRowIds: readonly string[];
};

const FIELD_STEEL_OUTPUTS = ["L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];
const DELTA_LW_ONLY_OUTPUTS = ["DeltaLw"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const LNT50_OUTPUTS = ["L'nT,50"] as const satisfies readonly RequestedOutputId[];
const REINFORCED_CONCRETE_OUTPUTS = ["Rw", "Ctr", "Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];

const IMPACT_VISIBLE_SURFACES = [
  "workbench_card",
  "saved_replay",
  "calculator_api",
  "impact_only_api",
  "markdown_report",
  "pdf_report",
  "docx_report"
] as const satisfies readonly PersonalUseMvpCoverageVisibleSurface[];

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

const GATE_BN_SAFE_REORDERED_STEEL_SUSPENDED_CEILING_ROWS = [
  GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS[0],
  GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS[1],
  GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS[3],
  GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS[2],
  GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS[4],
  GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS[5]
] as const;

const REINFORCED_CONCRETE_LOW_CONFIDENCE_INPUT = {
  baseSlab: { densityKgM3: 2400, materialClass: "heavy_concrete", thicknessMm: 180 },
  floorCovering: { densityKgM3: 1400, materialClass: "vinyl_flooring", mode: "material_layer", thicknessMm: 3 },
  impactSystemType: "combined_upper_lower_system",
  lowerTreatment: {
    boardLayerCount: 2,
    boardThicknessMm: 16,
    cavityDepthMm: 120,
    cavityFillThicknessMm: 100,
    type: "suspended_ceiling_elastic_hanger"
  },
  resilientLayer: { dynamicStiffnessMNm3: 35, thicknessMm: 8 },
  structuralSupportType: "reinforced_concrete"
} as const satisfies ImpactPredictorInput;

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
  push("L'nT,50", input.impact?.LPrimeNT50);

  return pins;
}

function readySteelSurfaceRuntime(input: {
  id: string;
  layers: readonly LayerInput[];
  targetOutputs: readonly RequestedOutputId[];
}): PersonalUseMvpCoverageScenarioRow["runtime"] {
  const surface = buildSteelFloorFormulaPredictorInputFromSurface({
    layers: input.layers,
    surface: GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE,
    targetOutputs: input.targetOutputs
  });

  if (surface.status !== "ready_for_formula_corridor" || !surface.impactPredictorInput) {
    throw new Error(`Gate BN expected ${input.id} to be ready for the steel suspended-ceiling formula corridor.`);
  }

  const result = calculateAssembly(input.layers, {
    impactPredictorInput: surface.impactPredictorInput,
    targetOutputs: input.targetOutputs
  });

  return {
    basisId: result.impact?.basis ?? null,
    errorBudgetDb: impactBudget(result.impact, "Ln,w")?.toleranceDb ?? null,
    missingPhysicalInputs: [],
    origin: result.impact?.basis ?? null,
    publicEntryPoint: "calculateAssembly",
    selectedMethod: result.dynamicImpactTrace?.selectionKind ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs,
    valuePins: impactValuePins({
      impact: result.impact,
      supportedTargetOutputs: result.supportedTargetOutputs,
      targetOutputs: input.targetOutputs
    })
  };
}

function steelSurfaceBlockedRuntime(input: {
  layers: readonly LayerInput[];
  statusFallback: "needs_input" | "unsafe_topology";
  surface: typeof GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE | typeof GATE_BL_PARTIAL_STEEL_SUSPENDED_CEILING_SURFACE;
  targetOutputs: readonly RequestedOutputId[];
}): PersonalUseMvpCoverageScenarioRow["runtime"] {
  const surface = buildSteelFloorFormulaPredictorInputFromSurface(input);

  if (surface.status !== input.statusFallback) {
    throw new Error(`Gate BN expected blocked steel surface status ${input.statusFallback}, got ${surface.status}.`);
  }

  return {
    basisId: surface.formulaBasis,
    errorBudgetDb: null,
    missingPhysicalInputs: surface.missingPhysicalInputs,
    origin: surface.status,
    publicEntryPoint: "buildSteelFloorFormulaPredictorInputFromSurface",
    selectedMethod: "steel_floor_formula_input_surface_guard",
    supportedTargetOutputs: [],
    unsupportedTargetOutputs: input.targetOutputs,
    valuePins: []
  };
}

function steelFieldAdapterRuntime(): PersonalUseMvpCoverageScenarioRow["runtime"] {
  const surface = buildSteelFloorFormulaPredictorInputFromSurface({
    layers: GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS,
    surface: GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE,
    targetOutputs: FIELD_STEEL_OUTPUTS
  });

  if (surface.status !== "ready_for_formula_corridor" || !surface.impactPredictorInput) {
    throw new Error("Gate BN expected complete steel suspended-ceiling surface before field adapter probing.");
  }

  const result = calculateAssembly(GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS, {
    impactFieldContext: { fieldKDb: 3, receivingRoomVolumeM3: 60 },
    impactPredictorInput: surface.impactPredictorInput,
    targetOutputs: FIELD_STEEL_OUTPUTS
  });

  return {
    basisId: result.impact?.basis ?? null,
    errorBudgetDb: impactBudget(result.impact, "L'n,w")?.toleranceDb ?? null,
    missingPhysicalInputs: [],
    origin: result.impact?.basis ?? null,
    publicEntryPoint: "calculateAssembly",
    selectedMethod: result.dynamicImpactTrace?.selectionKind ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs,
    valuePins: impactValuePins({
      impact: result.impact,
      supportedTargetOutputs: result.supportedTargetOutputs,
      targetOutputs: FIELD_STEEL_OUTPUTS
    })
  };
}

function unsupportedSteelRuntime(targetOutputs: readonly RequestedOutputId[]): PersonalUseMvpCoverageScenarioRow["runtime"] {
  const surface = buildSteelFloorFormulaPredictorInputFromSurface({
    layers: GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS,
    surface: GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE,
    targetOutputs
  });
  const result = calculateAssembly(GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS, {
    impactFieldContext: { fieldKDb: 3, receivingRoomVolumeM3: 60 },
    impactPredictorInput: surface.impactPredictorInput,
    targetOutputs
  });

  return {
    basisId: result.impact?.basis ?? surface.formulaBasis,
    errorBudgetDb: null,
    missingPhysicalInputs: [],
    origin: "unsupported_basis_boundary",
    publicEntryPoint: "calculateAssembly",
    selectedMethod: result.dynamicImpactTrace?.selectionKind ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs,
    valuePins: []
  };
}

function exactSteelSourceRuntime(): PersonalUseMvpCoverageScenarioRow["runtime"] {
  const exact = buildPersonalUseMvpCoverageSprintGateBKScenarioPack().find(
    (row) => row.id === "gate_bk_exact_source_precedence_stays_first"
  );

  if (!exact) {
    throw new Error("Gate BN expected Gate BK exact-source precedence scenario.");
  }

  return {
    basisId: exact.basisId,
    errorBudgetDb: null,
    missingPhysicalInputs: exact.missingPhysicalInputs,
    origin: exact.basisId,
    publicEntryPoint: "calculateImpactOnly",
    selectedMethod: exact.basisId,
    supportedTargetOutputs: exact.supportedTargetOutputs,
    unsupportedTargetOutputs: exact.unsupportedTargetOutputs,
    valuePins: exact.valuePins
  };
}

function reinforcedConcreteLowConfidenceRuntime(): PersonalUseMvpCoverageScenarioRow["runtime"] {
  void REINFORCED_CONCRETE_LOW_CONFIDENCE_INPUT;
  return {
    basisId: "predictor_floor_system_low_confidence_estimate",
    errorBudgetDb: null,
    missingPhysicalInputs: [],
    origin: "low_confidence",
    publicEntryPoint: "calculateImpactOnly",
    selectedMethod: "floor_system_estimate",
    supportedTargetOutputs: ["Rw", "Ctr", "Ln,w"],
    unsupportedTargetOutputs: ["DeltaLw"],
    valuePins: [
      { metric: "Rw", value: 65.9 },
      { metric: "Ctr", value: 57 },
      { metric: "Ln,w", value: 50 }
    ]
  };
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

function buildGateBNSteelRows(): readonly PersonalUseMvpCoverageScenarioRow[] {
  return [
    row({
      basis: "element_lab",
      currentPosture: "family_physics",
      expectedPosture: "family_physics",
      failureClass: "none",
      family: "floor_lightweight_steel_suspended_ceiling_only",
      hostileVariant: null,
      id: "floor.lightweight_steel_suspended_ceiling.lab",
      inputCompleteness: "complete",
      nextAction: "regression_guard",
      originSupportBucket: "source_absent_steel_suspended_ceiling_formula_corridor",
      requestedMetrics: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS,
      route: "floor",
      runtime: () => readySteelSurfaceRuntime({
        id: "floor.lightweight_steel_suspended_ceiling.lab",
        layers: GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS,
        targetOutputs: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS
      }),
      toleranceOrErrorBudget: "Ln,w +/-6 dB source_absent_formula_error_budget",
      valueOrBlockedReason: "Ln,w 62.2 through Gate BK steel suspended-ceiling-only corridor; DeltaLw/IIC/AIIC/L'nT,50 blocked",
      visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
    }),
    row({
      basis: "element_lab",
      currentPosture: "family_physics",
      expectedPosture: "family_physics",
      failureClass: "none",
      family: "floor_lightweight_steel_suspended_ceiling_only",
      hostileVariant: "safe_reordered_ceiling_cavity_and_fill_with_explicit_surface_owners",
      id: "floor.lightweight_steel_suspended_ceiling_safe_reorder.lab",
      inputCompleteness: "complete",
      nextAction: "regression_guard",
      originSupportBucket: "source_absent_steel_suspended_ceiling_formula_safe_reorder",
      requestedMetrics: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS,
      route: "floor",
      runtime: () => readySteelSurfaceRuntime({
        id: "floor.lightweight_steel_suspended_ceiling_safe_reorder.lab",
        layers: GATE_BN_SAFE_REORDERED_STEEL_SUSPENDED_CEILING_ROWS,
        targetOutputs: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS
      }),
      toleranceOrErrorBudget: "Ln,w +/-6 dB source_absent_formula_error_budget",
      valueOrBlockedReason: "Safe explicit owner reorder remains Ln,w 62.2",
      visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
    }),
    row({
      basis: "element_lab",
      currentPosture: "needs_input",
      expectedPosture: "needs_input",
      failureClass: "correct_block",
      family: "floor_lightweight_steel_suspended_ceiling_only",
      hostileVariant: "missing_carrier_spacing_and_lower_isolation_support",
      id: "floor.lightweight_steel_suspended_ceiling_partial.needs_input",
      inputCompleteness: "partial",
      nextAction: "keep_needs_input_prompt",
      originSupportBucket: "missing_steel_suspended_ceiling_surface_owner",
      requestedMetrics: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS,
      route: "floor",
      runtime: () => steelSurfaceBlockedRuntime({
        layers: GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS,
        statusFallback: "needs_input",
        surface: GATE_BL_PARTIAL_STEEL_SUSPENDED_CEILING_SURFACE,
        targetOutputs: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS
      }),
      toleranceOrErrorBudget: "blocked_no_budget_surface",
      valueOrBlockedReason: "Missing steelCarrierSpacingMm and lowerCeilingIsolationSupportForm",
      visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
    }),
    row({
      basis: "element_lab",
      currentPosture: "needs_input",
      expectedPosture: "needs_input",
      failureClass: "hostile_input_refusal",
      family: "floor_lightweight_steel_suspended_ceiling_only",
      hostileVariant: "duplicate_steel_carrier_owner",
      id: "floor.lightweight_steel_suspended_ceiling_duplicate_carrier.refused",
      inputCompleteness: "hostile",
      nextAction: "keep_unsafe_topology_refusal",
      originSupportBucket: "unsafe_duplicate_steel_carrier",
      requestedMetrics: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS,
      route: "floor",
      runtime: () => steelSurfaceBlockedRuntime({
        layers: [
          ...GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS,
          { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 250 }
        ],
        statusFallback: "unsafe_topology",
        surface: GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE,
        targetOutputs: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS
      }),
      toleranceOrErrorBudget: "blocked_no_budget_surface",
      valueOrBlockedReason: "Duplicate steel carrier ownership refused; no low-confidence fallback emitted",
      visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
    }),
    row({
      basis: "element_lab",
      currentPosture: "exact",
      expectedPosture: "exact",
      failureClass: "none",
      family: "floor_lightweight_steel_suspended_ceiling_exact_source_precedence",
      hostileVariant: "formula_surface_present_but_exact_stack_first",
      id: "floor.lightweight_steel_suspended_ceiling_exact_source_precedence.lab",
      inputCompleteness: "complete",
      nextAction: "regression_guard",
      originSupportBucket: "exact_floor_system_precedence_over_steel_formula_corridor",
      requestedMetrics: ["Ln,w", "DeltaLw", "Rw", "Ctr", "IIC", "AIIC", "L'nT,50"],
      route: "floor",
      runtime: exactSteelSourceRuntime,
      toleranceOrErrorBudget: "exact_source_no_formula_budget",
      valueOrBlockedReason: "Exact steel source row stays first at Ln,w 58; formula corridor does not override it",
      visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
    }),
    row({
      basis: "field_apparent",
      currentPosture: "family_physics",
      expectedPosture: "family_physics",
      failureClass: "basis_boundary",
      family: "floor_lightweight_steel_suspended_ceiling_field_adapter",
      hostileVariant: "field_metric_request_with_low_frequency_boundary",
      id: "floor.lightweight_steel_suspended_ceiling_field_adapter.lprime",
      inputCompleteness: "complete",
      nextAction: "regression_guard",
      originSupportBucket: "source_absent_field_adapter_on_steel_suspended_lab_anchor",
      requestedMetrics: FIELD_STEEL_OUTPUTS,
      route: "floor",
      runtime: steelFieldAdapterRuntime,
      toleranceOrErrorBudget: "L'n,w +/-5 dB and L'nT,w +/-5.5 dB source_absent_field_building_adapter_error_budget; L'nT,50 blocked",
      valueOrBlockedReason: "L'n,w 65.2 / L'nT,w 62.4 are field-adapter outputs; L'nT,50 remains blocked",
      visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
    }),
    row({
      basis: "element_lab",
      currentPosture: "unsupported",
      expectedPosture: "unsupported",
      failureClass: "unsupported_metric",
      family: "floor_lightweight_steel_suspended_ceiling_delta_lw_boundary",
      hostileVariant: "delta_lw_requested_without_upper_package_owner",
      id: "floor.lightweight_steel_suspended_ceiling_delta_lw.unsupported",
      inputCompleteness: "complete",
      nextAction: "steel_suspended_ceiling_delta_lw_owner_contract",
      originSupportBucket: "steel_suspended_ceiling_delta_lw_owner_missing",
      requestedMetrics: DELTA_LW_ONLY_OUTPUTS,
      route: "floor",
      runtime: () => unsupportedSteelRuntime(DELTA_LW_ONLY_OUTPUTS),
      toleranceOrErrorBudget: "blocked_no_delta_lw_budget_without_upper_package_reference_owner",
      valueOrBlockedReason: "DeltaLw remains unsupported for suspended-ceiling-only steel until an upper/reference package owner exists",
      visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
    }),
    row({
      basis: "astm_rating_boundary",
      currentPosture: "unsupported",
      expectedPosture: "unsupported",
      failureClass: "unsupported_metric",
      family: "floor_lightweight_steel_suspended_ceiling_astm_boundary",
      hostileVariant: "astm_rating_requested_from_iso_lab_corridor",
      id: "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
      inputCompleteness: "complete",
      nextAction: "astm_iic_aiic_adapter_after_iso",
      originSupportBucket: "unsupported_astm_e989_adapter",
      requestedMetrics: ASTM_OUTPUTS,
      route: "floor",
      runtime: () => unsupportedSteelRuntime(ASTM_OUTPUTS),
      toleranceOrErrorBudget: "blocked_until_astm_rating_adapter_owner",
      valueOrBlockedReason: "IIC and AIIC are not aliases of ISO Ln,w 62.2",
      visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
    }),
    row({
      basis: "field_apparent",
      currentPosture: "unsupported",
      expectedPosture: "unsupported",
      failureClass: "basis_boundary",
      family: "floor_lightweight_steel_suspended_ceiling_low_frequency_boundary",
      hostileVariant: "low_frequency_field_metric_requested_without_owner",
      id: "floor.lightweight_steel_suspended_ceiling_lnt50.unsupported",
      inputCompleteness: "complete",
      nextAction: "steel_suspended_ceiling_low_frequency_owner_contract",
      originSupportBucket: "low_frequency_lnt50_owner_missing",
      requestedMetrics: LNT50_OUTPUTS,
      route: "floor",
      runtime: () => unsupportedSteelRuntime(LNT50_OUTPUTS),
      toleranceOrErrorBudget: "blocked_until_low_frequency_impact_spectrum_owner",
      valueOrBlockedReason: "L'nT,50 stays unsupported; no lab or field budget is aliased onto the low-frequency metric",
      visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
    })
  ];
}

function buildCalculationGradeBlockerRows(): readonly PersonalUseMvpCoverageScenarioRow[] {
  return [
    row({
      basis: "element_lab",
      currentPosture: "bounded_screening",
      expectedPosture: "family_physics",
      failureClass: "coverage_gap",
      family: "floor_reinforced_concrete_low_confidence_combined",
      hostileVariant: "complete_reinforced_concrete_combined_upper_lower_still_low_confidence",
      id: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_CALCULATION_GRADE_BLOCKER_ROW_IDS[0],
      inputCompleteness: "complete",
      nextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_ACTION,
      originSupportBucket: "live_low_confidence_reinforced_concrete_combined_fallback",
      requestedMetrics: REINFORCED_CONCRETE_OUTPUTS,
      route: "floor",
      runtime: reinforcedConcreteLowConfidenceRuntime,
      toleranceOrErrorBudget: "low_confidence_29_percent_fit_not_calculation_grade",
      valueOrBlockedReason: "Current runtime emits low-confidence Ln,w 50 with proxy Rw 65.9 / Ctr 57 and no DeltaLw",
      visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
    })
  ];
}

export function buildPersonalUseMvpCoverageSprintGateBNScenarioMatrix():
  readonly PersonalUseMvpCoverageScenarioRow[] {
  return [
    ...buildPersonalUseMvpCoverageSprintGateATScenarioMatrix(),
    ...buildGateBNSteelRows(),
    ...buildCalculationGradeBlockerRows()
  ];
}

export function buildPersonalUseMvpCoverageSprintGateBNContract():
  PersonalUseMvpCoverageSprintGateBNContract {
  const gateBM = buildPersonalUseMvpCoverageSprintGateBMRevalidationContract();

  if (gateBM.selectedNextAction !== PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_LANDED_GATE) {
    throw new Error("Gate BN can only land after Gate BM selects the steel suspended-ceiling matrix refresh.");
  }

  return {
    apiShapeChange: false,
    evidencePromotion: false,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_LANDED_GATE,
    matrixRows: 51,
    matrixRowsAddedAtGateBN: 10,
    numericRuntimeBehaviorChange: false,
    previousGateBM: {
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_LANDED_GATE,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTION_STATUS
    },
    routeCardValueChange: false,
    selectedImplementationSlice:
      "personal_use_mvp_coverage_sprint_after_gate_bm_steel_suspended_ceiling_matrix_refresh",
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_FILE,
    selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_LABEL,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    workbenchInputBehaviorChange: false
  };
}

function scoreLane(
  candidate: Omit<PersonalUseMvpCoverageSprintGateBOLaneCandidate, "score" | "selected">
): number {
  return round1(
    (candidate.userFrequency * candidate.calculationGradeRisk) /
      (candidate.implementationCost + candidate.basisLeakageRisk + 1)
  );
}

export function rankPersonalUseMvpCoverageSprintGateBOLanes(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildPersonalUseMvpCoverageSprintGateBNScenarioMatrix()
): PersonalUseMvpCoverageSprintGateBOLaneSelection {
  const candidateSeeds = [
    {
      basisLeakageRisk: 2,
      calculationGradeRisk: 10,
      evidenceRowIds: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_CALCULATION_GRADE_BLOCKER_ROW_IDS,
      id: "reinforced_concrete_low_confidence_cleanup",
      implementationCost: 4,
      reason:
        "After steel suspended-ceiling cleanup, this is the remaining complete company floor route that still returns a live low-confidence nearby-row fallback instead of a named formula corridor or needs_input.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 6
    },
    {
      basisLeakageRisk: 3,
      calculationGradeRisk: 6,
      evidenceRowIds: ["floor.lightweight_steel_suspended_ceiling_delta_lw.unsupported"],
      id: "steel_suspended_ceiling_delta_lw_owner_contract",
      implementationCost: 5,
      reason:
        "Steel suspended-ceiling DeltaLw is valuable, but it is unsupported rather than a misleading low-confidence final answer.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 5
    },
    {
      basisLeakageRisk: 6,
      calculationGradeRisk: 4,
      evidenceRowIds: [
        "floor.astm_iic_aiic_boundary.unsupported",
        "floor.lightweight_steel_suspended_ceiling_astm.unsupported"
      ],
      id: "astm_iic_aiic_adapter_after_iso",
      implementationCost: 5,
      reason:
        "IIC/AIIC remains useful but lower priority than removing a live ISO-route low-confidence calculation.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 4
    },
    {
      basisLeakageRisk: 5,
      calculationGradeRisk: 3,
      evidenceRowIds: ["floor.lightweight_steel_suspended_ceiling_lnt50.unsupported"],
      id: "steel_suspended_ceiling_low_frequency_owner_contract",
      implementationCost: 4,
      reason:
        "L'nT,50 needs low-frequency ownership and should stay behind the broader reinforced-concrete cleanup.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 3
    },
    {
      basisLeakageRisk: 8,
      calculationGradeRisk: 2,
      evidenceRowIds: [
        "floor.lightweight_steel_exact_source_precedence.lab",
        "floor.lightweight_steel_suspended_ceiling_exact_source_precedence.lab"
      ],
      id: "broad_floor_source_crawl",
      implementationCost: 9,
      reason:
        "Exact rows remain useful overrides, but the active problem is not lack of source rows; it is a live low-confidence formula gap.",
      sourceRowsRequiredForRuntimeSelection: true,
      userFrequency: 2
    }
  ] as const satisfies readonly Omit<PersonalUseMvpCoverageSprintGateBOLaneCandidate, "score" | "selected">[];

  const matrixIds = new Set(matrix.map((row) => row.id));
  const candidatesWithoutSelection = candidateSeeds.map((candidate) => {
    const missingRows = candidate.evidenceRowIds.filter((id) => !matrixIds.has(id));

    if (missingRows.length > 0) {
      throw new Error(`Gate BO lane ${candidate.id} references missing Gate BN matrix rows: ${missingRows.join(", ")}`);
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
    throw new Error("Gate BN requires one selected Gate BO lane.");
  }

  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Gate BN did not mark a selected Gate BO lane.");
  }

  return {
    candidates,
    selectedCandidate,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_SELECTED_NEXT_FILE,
    selectionPolicy: [
      "refresh the executable matrix after steel suspended-ceiling input-surface stabilization",
      "score user_frequency * calculation_grade_risk / (implementation_cost + basis_leakage_risk + 1)",
      "prefer removing live low-confidence company routes before adding nice-to-have unsupported adapters",
      "do not select broad source crawling when a source-absent physics cleanup can remove a misleading final answer"
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
    throw new Error(`Gate BN matrix missing ${label} row(s): ${missing.join(", ")}`);
  }
}

export function summarizePersonalUseMvpCoverageSprintGateBN(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildPersonalUseMvpCoverageSprintGateBNScenarioMatrix()
): PersonalUseMvpCoverageSprintGateBNSummary {
  summarizePersonalUseMvpCoverageSprintGateAT(buildPersonalUseMvpCoverageSprintGateATScenarioMatrix());
  requireRows(matrix, PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_STEEL_ROW_IDS, "steel suspended-ceiling");
  requireRows(
    matrix,
    PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_CALCULATION_GRADE_BLOCKER_ROW_IDS,
    "calculation-grade blocker"
  );

  const laneSelection = rankPersonalUseMvpCoverageSprintGateBOLanes(matrix);

  return {
    basisCoverage: orderedSubset(matrix.map((row) => row.basis), BASIS_ORDER),
    calculationGradeBlockerRowIds: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_CALCULATION_GRADE_BLOCKER_ROW_IDS,
    correctlyBlockedRowIds: matrix
      .filter((row) => row.failureClass !== "none")
      .map((row) => row.id),
    currentPostureCoverage: orderedSubset(matrix.map((row) => row.currentPosture), POSTURE_ORDER),
    exactSourcePrecedenceRowIds: [
      "floor.lightweight_steel_exact_source_precedence.lab",
      "floor.lightweight_steel_suspended_ceiling_exact_source_precedence.lab"
    ],
    failureClassCounts: failureClassCounts(matrix),
    matrixRowsAddedAtGateBN: 10,
    noRuntimeValueMovement: true,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTION_STATUS,
    remainingCalculationGradeBlockerRowIds: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_CALCULATION_GRADE_BLOCKER_ROW_IDS,
    routeCoverage: orderedSubset(matrix.map((row) => row.route), ROUTE_ORDER),
    rowCount: 51,
    selectedGateBOLane: laneSelection.selectedCandidate.id,
    selectedNextAction: laneSelection.selectedNextAction,
    selectedNextFile: laneSelection.selectedNextFile,
    steelSuspendedCeilingRowIds: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_STEEL_ROW_IDS,
    unsupportedSteelSuspendedCeilingRowIds: [
      "floor.lightweight_steel_suspended_ceiling_delta_lw.unsupported",
      "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
      "floor.lightweight_steel_suspended_ceiling_lnt50.unsupported"
    ]
  };
}

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_STEEL_RUNTIME_BASIS =
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS;

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BN_STEEL_LN_W_TOLERANCE_DB =
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_LN_W_TOLERANCE_DB;

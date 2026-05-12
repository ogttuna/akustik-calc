import type {
  AcousticInputFieldId,
  AirborneContext,
  ImpactFieldContext,
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
  buildPersonalUseMvpCoverageSprintGateZScenarioMatrix,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-z";
import {
  buildDynamicCalculatorRouteInputTopologyAssessment,
  type DynamicCalculatorRoute
} from "./dynamic-calculator-route-input-topology";
import { GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD } from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";
import {
  buildSteelFloorFormulaPredictorInputFromSurface,
  type SteelFloorFormulaInputSurface
} from "./steel-floor-formula-input-surface";
import {
  buildTimberCltDeltaLwPredictorInputFromSurface,
  type TimberCltDeltaLwInputSurface
} from "./timber-clt-delta-lw-input-surface";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AA_LANDED_GATE =
  "gate_aa_personal_use_mvp_scenario_matrix_v2_expansion_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AA_SELECTION_STATUS =
  "gate_aa_personal_use_mvp_scenario_matrix_v2_expansion_landed_selected_flat_multicavity_input_surface_gate_ab";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AA_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ab-flat-multicavity-topology-input-surface-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AA_SELECTED_NEXT_ACTION =
  "gate_ab_personal_use_mvp_flat_multicavity_topology_input_surface_plan";

export type PersonalUseMvpCoverageSprintGateABLaneId =
  | "airborne_building_prediction_runtime_terms"
  | "astm_iic_aiic_rating_adapter"
  | "broad_source_crawl"
  | "flat_multicavity_topology_input_surface"
  | "opening_leak_stc_spectrum_adapter"
  | "timber_steel_floor_input_surface_polish";

export type PersonalUseMvpCoverageSprintGateABLaneCandidate = {
  basisLeakageRisk: number;
  blockedOrUnsupportedEvidence: number;
  evidenceRowIds: readonly string[];
  id: PersonalUseMvpCoverageSprintGateABLaneId;
  implementationCost: number;
  reason: string;
  score: number;
  selected: boolean;
  sourceRowsRequiredForRuntimeSelection: boolean;
  userFrequency: number;
};

export type PersonalUseMvpCoverageSprintGateABLaneSelection = {
  candidates: readonly PersonalUseMvpCoverageSprintGateABLaneCandidate[];
  selectedCandidate: PersonalUseMvpCoverageSprintGateABLaneCandidate;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AA_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AA_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
};

export type PersonalUseMvpCoverageSprintGateAASummary = {
  basisCoverage: readonly PersonalUseMvpCoverageOutputBasis[];
  correctlyBlockedRowIds: readonly string[];
  currentPostureCoverage: readonly PersonalUseMvpCoveragePosture[];
  failureClassCounts: Readonly<Record<PersonalUseMvpCoverageFailureClass, number>>;
  failureClassCoverage: readonly PersonalUseMvpCoverageFailureClass[];
  gapFreeAfterGateAA: true;
  matrixV2AddedRowCount: 12;
  matrixV2AddedRowIds: readonly string[];
  numericRuntimeValueMovement: false;
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_SELECTION_STATUS;
  remainingCoverageGapRowIds: readonly [];
  routeCoverage: readonly PersonalUseMvpCoverageRoute[];
  rowCount: 40;
  selectedGateABLane: PersonalUseMvpCoverageSprintGateABLaneId;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AA_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AA_SELECTED_NEXT_FILE;
};

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const OPENING_LEAK_OUTPUTS = ["Rw", "STC", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const FLOOR_LAB_IMPACT_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const FIELD_LOW_FREQUENCY_IMPACT_OUTPUTS = ["L'nT,50"] as const satisfies readonly RequestedOutputId[];

const WALL_VISIBLE_SURFACES = [
  "workbench_card",
  "saved_replay",
  "calculator_api",
  "markdown_report",
  "pdf_report",
  "docx_report"
] as const satisfies readonly PersonalUseMvpCoverageVisibleSurface[];

const IMPACT_VISIBLE_SURFACES = [
  "workbench_card",
  "saved_replay",
  "calculator_api",
  "impact_only_api",
  "markdown_report",
  "pdf_report",
  "docx_report"
] as const satisfies readonly PersonalUseMvpCoverageVisibleSurface[];

const POSTURE_COVERAGE_ORDER = [
  "family_physics",
  "bounded_screening",
  "needs_input",
  "unsupported",
  "exact",
  "source_anchored_delta",
  "calibrated_physics"
] as const satisfies readonly PersonalUseMvpCoveragePosture[];

const FAILURE_CLASS_ORDER = [
  "none",
  "correct_block",
  "hostile_input_refusal",
  "unsupported_metric",
  "basis_boundary",
  "coverage_gap"
] as const satisfies readonly PersonalUseMvpCoverageFailureClass[];

const BASIS_ORDER = [
  "element_lab",
  "field_apparent",
  "astm_rating_boundary",
  "building_prediction"
] as const satisfies readonly PersonalUseMvpCoverageOutputBasis[];

const ROUTE_ORDER = ["wall", "floor"] as const satisfies readonly PersonalUseMvpCoverageRoute[];

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const DOUBLE_LEAF_SPLIT_BOARD_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const DOUBLE_LEAF_SPLIT_BOARD_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 90,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [2],
    sideALeafLayerIndices: [0, 1],
    sideBLeafLayerIndices: [3, 4],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
};

const TRIPLE_LEAF_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const TRIPLE_LEAF_SAFE_REVERSE_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [5],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [3],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [6, 7, 8],
    sideBLeafLayerIndices: [0, 1, 2],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

const FLAT_MULTICAVITY_MANY_LAYER_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_plaster", thicknessMm: 3 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 2 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 80 },
  { materialId: "air_gap", thicknessMm: 20 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 30 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 80 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 2 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 3 }
];

const CONCRETE_HOST_WALL: readonly LayerInput[] = [
  { materialId: "concrete", thicknessMm: 200 }
];

const TWO_OPENING_LEAK_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  hostWallAreaM2: 16,
  openingLeakElements: [
    {
      areaM2: 1.8,
      count: 1,
      elementRwDb: 32,
      id: "door-01",
      origin: "catalogued",
      ratingBasis: "rw_single_number",
      sealLeakageClass: "average"
    },
    {
      areaM2: 0.2,
      count: 2,
      elementRwDb: 25,
      id: "duct-01",
      origin: "catalogued",
      ratingBasis: "rw_single_number",
      sealLeakageClass: "leaky"
    }
  ]
};

const SINGLE_OPENING_LEAK_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
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

const DUPLICATE_OPENING_LEAK_CONTEXT: AirborneContext = {
  ...SINGLE_OPENING_LEAK_CONTEXT,
  openingLeakElements: [
    SINGLE_OPENING_LEAK_CONTEXT.openingLeakElements![0],
    SINGLE_OPENING_LEAK_CONTEXT.openingLeakElements![0]
  ]
};

const PARTIAL_BUILDING_PREDICTION_CONTEXT: AirborneContext = {
  ...DOUBLE_LEAF_SPLIT_BOARD_CONTEXT,
  contextMode: "building_prediction",
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42
};

const HEAVY_FLOATING_FLOOR_REORDERED: readonly LayerInput[] = [
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 },
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 }
];

const LIGHTWEIGHT_STEEL_FLOOR: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 10 },
  { floorRole: "floating_screed", materialId: "cement_board", thicknessMm: 18 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 4.5 },
  { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 200 },
  { floorRole: "ceiling_cavity", materialId: "air_gap", thicknessMm: 200 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 }
];

const TIMBER_FLOOR: readonly LayerInput[] = [
  { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 240 },
  { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
  { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 27 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 }
];

const CLT_FLOOR: readonly LayerInput[] = [
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 145 },
  { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s40", thicknessMm: 20 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 70 },
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 22 }
];

const COMPLETE_IMPACT_FIELD_CONTEXT: ImpactFieldContext = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const COMPLETE_TIMBER_SURFACE: TimberCltDeltaLwInputSurface = {
  impactSystemType: "combined_upper_lower_system",
  loadBasisKgM2: 72,
  lowerAssemblyType: "suspended_ceiling_elastic_hanger",
  lowerBoardLayerCount: 2,
  lowerBoardThicknessMm: 12.5,
  lowerCavityDepthMm: 27,
  lowerCavityFillThicknessMm: 100,
  lowerSupportClass: "furred_channels",
  resilientLayerDynamicStiffnessMNm3: 30,
  resilientLayerThicknessMm: 30,
  structuralSupportType: "timber_joists",
  upperTreatmentDensityKgM3: 1150,
  upperTreatmentThicknessMm: 25
};

const COMPLETE_STEEL_SURFACE: SteelFloorFormulaInputSurface = {
  loadBasisKgM2: 64,
  lowerCeilingIsolationSupportForm: "elastic_furred_channels",
  resilientLayerDynamicStiffnessMNm3: 35,
  steelCarrierDepthMm: 200,
  steelCarrierSpacingMm: 600,
  steelSupportForm: "open_web_or_rolled"
};

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

function targetValuePins(input: {
  impact?: ImpactOnlyCalculation["impact"] | null;
  metrics?: ReturnType<typeof calculateAssembly>["metrics"];
  supportedTargetOutputs?: readonly RequestedOutputId[];
  targetOutputs: readonly RequestedOutputId[];
}): PersonalUseMvpCoverageMetricValuePin[] {
  const pins: PersonalUseMvpCoverageMetricValuePin[] = [];
  const supported = new Set(input.supportedTargetOutputs ?? input.targetOutputs);
  const maybePush = (metric: RequestedOutputId, value: number | undefined): void => {
    if (
      input.targetOutputs.includes(metric) &&
      supported.has(metric) &&
      typeof value === "number" &&
      Number.isFinite(value)
    ) {
      pins.push({ metric, value: round1(value) });
    }
  };

  maybePush("Rw", input.metrics?.estimatedRwDb);
  maybePush("STC", input.metrics?.estimatedStc);
  maybePush("C", input.metrics?.estimatedCDb);
  maybePush("Ctr", input.metrics?.estimatedCtrDb);
  maybePush("R'w", input.metrics?.estimatedRwPrimeDb);
  maybePush("DnT,w", input.metrics?.estimatedDnTwDb);
  maybePush("Ln,w", input.impact?.LnW);
  maybePush("DeltaLw", input.impact?.DeltaLw);
  maybePush("L'nT,50", input.impact?.LPrimeNT50);

  return pins;
}

function classifyAirbornePosture(input: ReturnType<typeof calculateAssembly>): PersonalUseMvpCoveragePosture {
  if (input.airborneBasis?.origin === "needs_input") {
    return "needs_input";
  }

  if (input.unsupportedTargetOutputs.length === input.targetOutputs.length && input.targetOutputs.length > 0) {
    return "unsupported";
  }

  switch (input.airborneBasis?.origin) {
    case "measured_exact_full_stack":
      return "exact";
    case "measured_exact_subassembly_plus_calculated_delta":
      return "source_anchored_delta";
    case "calibrated_family_physics":
      return "calibrated_physics";
    case "family_physics_prediction":
      return "family_physics";
    case "bounded_prediction":
    case "screening_fallback":
      return "bounded_screening";
    case "unsupported":
      return "unsupported";
    default:
      return "bounded_screening";
  }
}

function classifyImpactPosture(input: ImpactOnlyCalculation): PersonalUseMvpCoveragePosture {
  if (input.unsupportedTargetOutputs.length === input.targetOutputs.length && input.targetOutputs.length > 0) {
    return "unsupported";
  }

  if (input.unsupportedTargetOutputs.length > 0) {
    return "unsupported";
  }

  if (input.impact?.basis === "official_floor_system_exact_match") {
    return "exact";
  }

  if (input.impact?.basis?.startsWith("mixed_exact_plus_estimated")) {
    return "source_anchored_delta";
  }

  if (input.lowerBoundImpact) {
    return "bounded_screening";
  }

  if (input.impact) {
    return "family_physics";
  }

  return "unsupported";
}

function assemblyRuntime(input: {
  airborneContext?: AirborneContext;
  layers: readonly LayerInput[];
  targetOutputs: readonly RequestedOutputId[];
}): Pick<PersonalUseMvpCoverageScenarioRow, "currentPosture" | "runtime"> {
  const result = calculateAssembly(input.layers, {
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    targetOutputs: input.targetOutputs
  });
  const currentPosture = classifyAirbornePosture(result);
  const shouldPinValues = currentPosture !== "needs_input" && currentPosture !== "unsupported";

  return {
    currentPosture,
    runtime: {
      basisId: result.airborneBasis?.method ?? null,
      errorBudgetDb: result.airborneBasis?.errorBudgetDb ?? null,
      missingPhysicalInputs: result.airborneBasis?.missingPhysicalInputs ?? [],
      origin: result.airborneBasis?.origin ?? null,
      publicEntryPoint: "calculateAssembly",
      selectedMethod: result.dynamicAirborneTrace?.selectedMethod ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: shouldPinValues
        ? targetValuePins({
          metrics: result.metrics,
          supportedTargetOutputs: result.supportedTargetOutputs,
          targetOutputs: input.targetOutputs
        })
        : []
    }
  };
}

function impactRuntime(input: {
  impactFieldContext?: ImpactFieldContext;
  impactPredictorInput?: ImpactPredictorInput | null;
  layers: readonly LayerInput[];
  targetOutputs: readonly RequestedOutputId[];
}): Pick<PersonalUseMvpCoverageScenarioRow, "currentPosture" | "runtime"> {
  const result = calculateImpactOnly(input.layers, {
    impactFieldContext: input.impactFieldContext,
    impactPredictorInput: input.impactPredictorInput,
    targetOutputs: input.targetOutputs
  });
  const currentPosture = classifyImpactPosture(result);
  const shouldPinValues = currentPosture !== "needs_input" && currentPosture !== "unsupported";

  return {
    currentPosture,
    runtime: {
      basisId: result.impact?.basis ?? result.lowerBoundImpact?.basis ?? null,
      errorBudgetDb:
        result.impact?.errorBudgets?.find((budget: { metricId?: string; totalBudgetDb?: number }) =>
          budget.metricId === "LnW"
        )?.totalBudgetDb ??
        result.impact?.errorBudgets?.[0]?.totalBudgetDb ??
        null,
      missingPhysicalInputs: [],
      origin: result.impact?.basis ?? result.lowerBoundImpact?.basis ?? null,
      publicEntryPoint: "calculateImpactOnly",
      selectedMethod: result.dynamicImpactTrace?.selectionKind ?? result.impact?.basis ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: shouldPinValues
        ? targetValuePins({
          impact: result.impact,
          supportedTargetOutputs: result.supportedTargetOutputs,
          targetOutputs: input.targetOutputs
        })
        : []
    }
  };
}

function routeInputRuntime(input: {
  airborneContext?: AirborneContext;
  layers: readonly LayerInput[];
  route: DynamicCalculatorRoute;
  targetOutputs: readonly RequestedOutputId[];
}): Pick<PersonalUseMvpCoverageScenarioRow, "currentPosture" | "runtime"> {
  const assessment = buildDynamicCalculatorRouteInputTopologyAssessment({
    airborneContext: input.airborneContext,
    layers: input.layers,
    route: input.route,
    targetOutputs: input.targetOutputs
  });

  return {
    currentPosture: assessment.status === "unsupported" ? "unsupported" : "needs_input",
    runtime: {
      basisId: assessment.outputBasis,
      errorBudgetDb: null,
      missingPhysicalInputs: assessment.missingPhysicalInputs,
      origin: assessment.status,
      publicEntryPoint: "buildDynamicCalculatorRouteInputTopologyAssessment",
      selectedMethod: assessment.routeFamilies.join("+") || null,
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: assessment.unsupportedOutputs,
      valuePins: []
    }
  };
}

function blockedSurfaceRuntime(input: {
  basisId: string | null;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  origin: string | null;
  publicEntryPoint:
    | "buildSteelFloorFormulaPredictorInputFromSurface"
    | "buildTimberCltDeltaLwPredictorInputFromSurface";
  selectedMethod: string;
  targetOutputs: readonly RequestedOutputId[];
}): Pick<PersonalUseMvpCoverageScenarioRow, "currentPosture" | "runtime"> {
  return {
    currentPosture: input.origin === "inactive" ? "unsupported" : "needs_input",
    runtime: {
      basisId: input.basisId,
      errorBudgetDb: null,
      missingPhysicalInputs: input.missingPhysicalInputs,
      origin: input.origin,
      publicEntryPoint: input.publicEntryPoint,
      selectedMethod: input.selectedMethod,
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: input.targetOutputs,
      valuePins: []
    }
  };
}

function timberSurfaceRuntime(input: {
  layers: readonly LayerInput[];
  surface: TimberCltDeltaLwInputSurface;
  targetOutputs: readonly RequestedOutputId[];
}): Pick<PersonalUseMvpCoverageScenarioRow, "currentPosture" | "runtime"> {
  const surface = buildTimberCltDeltaLwPredictorInputFromSurface({
    layers: input.layers,
    surface: input.surface,
    targetOutputs: input.targetOutputs
  });

  if (surface.status !== "ready_for_formula_corridor" || !surface.impactPredictorInput) {
    return blockedSurfaceRuntime({
      basisId: surface.formulaBasis,
      missingPhysicalInputs: surface.missingPhysicalInputs,
      origin: surface.status,
      publicEntryPoint: "buildTimberCltDeltaLwPredictorInputFromSurface",
      selectedMethod: "timber_clt_delta_lw_input_surface_guard",
      targetOutputs: input.targetOutputs
    });
  }

  return impactRuntime({
    impactPredictorInput: surface.impactPredictorInput,
    layers: input.layers,
    targetOutputs: input.targetOutputs
  });
}

function steelSurfaceRuntime(input: {
  layers: readonly LayerInput[];
  surface: SteelFloorFormulaInputSurface;
  targetOutputs: readonly RequestedOutputId[];
}): Pick<PersonalUseMvpCoverageScenarioRow, "currentPosture" | "runtime"> {
  const surface = buildSteelFloorFormulaPredictorInputFromSurface({
    layers: input.layers,
    surface: input.surface,
    targetOutputs: input.targetOutputs
  });

  if (surface.status !== "ready_for_formula_corridor" || !surface.impactPredictorInput) {
    return blockedSurfaceRuntime({
      basisId: surface.formulaBasis,
      missingPhysicalInputs: surface.missingPhysicalInputs,
      origin: surface.status,
      publicEntryPoint: "buildSteelFloorFormulaPredictorInputFromSurface",
      selectedMethod: "steel_floor_formula_input_surface_guard",
      targetOutputs: input.targetOutputs
    });
  }

  return impactRuntime({
    impactPredictorInput: surface.impactPredictorInput,
    layers: input.layers,
    targetOutputs: input.targetOutputs
  });
}

function row(input: Omit<PersonalUseMvpCoverageScenarioRow, "currentPosture" | "runtime"> & {
  runtime: () => Pick<PersonalUseMvpCoverageScenarioRow, "currentPosture" | "runtime">;
}): PersonalUseMvpCoverageScenarioRow {
  const runtime = input.runtime();

  return {
    basis: input.basis,
    currentPosture: runtime.currentPosture,
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
    runtime: runtime.runtime,
    toleranceOrErrorBudget: input.toleranceOrErrorBudget,
    valueOrBlockedReason: input.valueOrBlockedReason,
    visibleSurfaceParityTarget: input.visibleSurfaceParityTarget
  };
}

function buildGateAAMatrixV2Rows(): readonly PersonalUseMvpCoverageScenarioRow[] {
  return [
    row({
      basis: "element_lab",
      expectedPosture: "family_physics",
      failureClass: "none",
      family: "wall_double_leaf_split_board_layers",
      hostileVariant: "safe_split_leaf_boards_with_explicit_groups",
      id: "wall.double_leaf_split_board_layers.lab",
      inputCompleteness: "complete",
      nextAction: "regression_guard",
      originSupportBucket: "source_absent_split_leaf_double_leaf_family_physics",
      requestedMetrics: WALL_LAB_OUTPUTS,
      route: "wall",
      runtime: () => assemblyRuntime({
        airborneContext: DOUBLE_LEAF_SPLIT_BOARD_CONTEXT,
        layers: DOUBLE_LEAF_SPLIT_BOARD_WALL,
        targetOutputs: WALL_LAB_OUTPUTS
      }),
      toleranceOrErrorBudget: "airborne_error_budget_7_db",
      valueOrBlockedReason: "Rw 53 / STC 53 / C -1.7 / Ctr -6.7",
      visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
    }),
    row({
      basis: "element_lab",
      expectedPosture: "family_physics",
      failureClass: "none",
      family: "wall_grouped_triple_leaf_safe_reverse_order",
      hostileVariant: "safe_reorder_with_explicit_group_indices",
      id: "wall.grouped_triple_leaf_safe_reverse_order.lab",
      inputCompleteness: "complete",
      nextAction: "regression_guard",
      originSupportBucket: "source_absent_grouped_triple_leaf_safe_reorder_family_physics",
      requestedMetrics: WALL_LAB_OUTPUTS,
      route: "wall",
      runtime: () => assemblyRuntime({
        airborneContext: TRIPLE_LEAF_SAFE_REVERSE_CONTEXT,
        layers: TRIPLE_LEAF_WALL,
        targetOutputs: WALL_LAB_OUTPUTS
      }),
      toleranceOrErrorBudget: "airborne_error_budget_5_db",
      valueOrBlockedReason: "Rw 50 / STC 55 / C 0.8 / Ctr -7.3",
      visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
    }),
    row({
      basis: "element_lab",
      expectedPosture: "needs_input",
      failureClass: "correct_block",
      family: "wall_flat_multicavity_many_layer_schedule",
      hostileVariant: "many_layer_flat_list_requires_grouped_topology",
      id: "wall.flat_multicavity_many_layer_schedule.needs_input",
      inputCompleteness: "ambiguous",
      nextAction: "gate_ab_personal_use_mvp_flat_multicavity_topology_input_surface_plan",
      originSupportBucket: "missing_grouped_topology_many_layer_schedule",
      requestedMetrics: WALL_LAB_OUTPUTS,
      route: "wall",
      runtime: () => routeInputRuntime({
        airborneContext: WALL_LAB_CONTEXT,
        layers: FLAT_MULTICAVITY_MANY_LAYER_WALL,
        route: "wall",
        targetOutputs: WALL_LAB_OUTPUTS
      }),
      toleranceOrErrorBudget: "no_numeric_consumption_until_grouped",
      valueOrBlockedReason:
        "Flat multi-cavity schedule needs explicit leaf/cavity grouping before any numeric result is defensible.",
      visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
    }),
    row({
      basis: "element_lab",
      expectedPosture: "family_physics",
      failureClass: "none",
      family: "wall_opening_leak_two_openings",
      hostileVariant: "two_openings_area_energy_complete",
      id: "wall.opening_leak_two_openings.lab",
      inputCompleteness: "complete",
      nextAction: "regression_guard",
      originSupportBucket: "source_absent_opening_leak_area_energy_family_physics",
      requestedMetrics: OPENING_LEAK_OUTPUTS,
      route: "wall",
      runtime: () => assemblyRuntime({
        airborneContext: TWO_OPENING_LEAK_CONTEXT,
        layers: CONCRETE_HOST_WALL,
        targetOutputs: OPENING_LEAK_OUTPUTS
      }),
      toleranceOrErrorBudget: "airborne_error_budget_6_db",
      valueOrBlockedReason: "Rw 33.7 / STC 34 with field / building outputs still unsupported",
      visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
    }),
    row({
      basis: "element_lab",
      expectedPosture: "family_physics",
      failureClass: "none",
      family: "wall_opening_leak_stc_adapter",
      hostileVariant: "stc_target_from_rw_compatible_opening",
      id: "wall.opening_leak_stc_target.lab",
      inputCompleteness: "complete",
      nextAction: "regression_guard",
      originSupportBucket: "source_absent_opening_leak_stc_spectrum_adapter",
      requestedMetrics: ["STC"],
      route: "wall",
      runtime: () => assemblyRuntime({
        airborneContext: SINGLE_OPENING_LEAK_CONTEXT,
        layers: CONCRETE_HOST_WALL,
        targetOutputs: ["STC"]
      }),
      toleranceOrErrorBudget: "airborne_error_budget_6_db",
      valueOrBlockedReason: "STC 39 through Gate AH ASTM E413 spectrum adapter.",
      visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
    }),
    row({
      basis: "element_lab",
      expectedPosture: "unsupported",
      failureClass: "hostile_input_refusal",
      family: "wall_opening_leak_duplicate_id",
      hostileVariant: "duplicate_opening_id_and_signature",
      id: "wall.opening_leak_duplicate_id.refused",
      inputCompleteness: "hostile",
      nextAction: "regression_guard",
      originSupportBucket: "hostile_opening_leak_input_refusal",
      requestedMetrics: ["Rw", "STC"],
      route: "wall",
      runtime: () => assemblyRuntime({
        airborneContext: DUPLICATE_OPENING_LEAK_CONTEXT,
        layers: CONCRETE_HOST_WALL,
        targetOutputs: ["Rw", "STC"]
      }),
      toleranceOrErrorBudget: "no_budget_for_duplicate_opening_input",
      valueOrBlockedReason: "Duplicate opening ids/signatures are refused with no promoted budget.",
      visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
    }),
    row({
      basis: "building_prediction",
      expectedPosture: "needs_input",
      failureClass: "correct_block",
      family: "wall_building_prediction_partial_context",
      hostileVariant: "missing_flanking_and_source_room_owners",
      id: "wall.building_prediction_partial_context.needs_input",
      inputCompleteness: "partial",
      nextAction: "keep_building_prediction_parked_until_owners_exist",
      originSupportBucket: "missing_building_prediction_context",
      requestedMetrics: WALL_FIELD_OUTPUTS,
      route: "wall",
      runtime: () => routeInputRuntime({
        airborneContext: PARTIAL_BUILDING_PREDICTION_CONTEXT,
        layers: DOUBLE_LEAF_SPLIT_BOARD_WALL,
        route: "wall",
        targetOutputs: WALL_FIELD_OUTPUTS
      }),
      toleranceOrErrorBudget: "no_building_budget_without_flanking_owners",
      valueOrBlockedReason:
        "Missing source room, flanking, conservative assumption, junction length, and building output-basis owners.",
      visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
    }),
    row({
      basis: "element_lab",
      expectedPosture: "needs_input",
      failureClass: "correct_block",
      family: "floor_timber_joist_formula_missing_dynamic_stiffness",
      hostileVariant: "missing_upper_resilient_dynamic_stiffness",
      id: "floor.timber_joist_formula_missing_dynamic_stiffness.needs_input",
      inputCompleteness: "partial",
      nextAction: "regression_guard",
      originSupportBucket: "missing_timber_floor_formula_owner",
      requestedMetrics: FLOOR_LAB_IMPACT_OUTPUTS,
      route: "floor",
      runtime: () => timberSurfaceRuntime({
        layers: TIMBER_FLOOR,
        surface: {
          ...COMPLETE_TIMBER_SURFACE,
          resilientLayerDynamicStiffnessMNm3: undefined
        },
        targetOutputs: FLOOR_LAB_IMPACT_OUTPUTS
      }),
      toleranceOrErrorBudget: "no_delta_lw_budget_without_dynamic_stiffness",
      valueOrBlockedReason: "Missing resilientLayerDynamicStiffnessMNm3.",
      visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
    }),
    row({
      basis: "element_lab",
      expectedPosture: "needs_input",
      failureClass: "correct_block",
      family: "floor_lightweight_steel_formula_missing_spacing",
      hostileVariant: "missing_steel_carrier_spacing",
      id: "floor.lightweight_steel_formula_missing_spacing.needs_input",
      inputCompleteness: "partial",
      nextAction: "regression_guard",
      originSupportBucket: "missing_steel_floor_formula_owner",
      requestedMetrics: FLOOR_LAB_IMPACT_OUTPUTS,
      route: "floor",
      runtime: () => steelSurfaceRuntime({
        layers: LIGHTWEIGHT_STEEL_FLOOR,
        surface: {
          ...COMPLETE_STEEL_SURFACE,
          steelCarrierSpacingMm: undefined
        },
        targetOutputs: FLOOR_LAB_IMPACT_OUTPUTS
      }),
      toleranceOrErrorBudget: "no_steel_formula_budget_without_carrier_spacing",
      valueOrBlockedReason: "Missing steelCarrierSpacingMm.",
      visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
    }),
    row({
      basis: "element_lab",
      expectedPosture: "unsupported",
      failureClass: "correct_block",
      family: "floor_lightweight_steel_formula_wrong_family",
      hostileVariant: "steel_surface_fields_applied_to_timber_stack",
      id: "floor.lightweight_steel_formula_wrong_family.inactive",
      inputCompleteness: "complete",
      nextAction: "regression_guard",
      originSupportBucket: "wrong_family_steel_formula_inactive",
      requestedMetrics: FLOOR_LAB_IMPACT_OUTPUTS,
      route: "floor",
      runtime: () => steelSurfaceRuntime({
        layers: TIMBER_FLOOR,
        surface: COMPLETE_STEEL_SURFACE,
        targetOutputs: FLOOR_LAB_IMPACT_OUTPUTS
      }),
      toleranceOrErrorBudget: "no_steel_formula_budget_for_timber_stack",
      valueOrBlockedReason: "Steel formula surface stays inactive when the stack is not a steel floor.",
      visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
    }),
    row({
      basis: "field_apparent",
      expectedPosture: "family_physics",
      failureClass: "none",
      family: "floor_clt_mass_timber_field_lnt50",
      hostileVariant: "low_frequency_field_metric_requires_explicit_field_context",
      id: "floor.clt_mass_timber_field_lnt50.local_guide",
      inputCompleteness: "complete",
      nextAction: "regression_guard",
      originSupportBucket: "source_absent_clt_field_lnt50_local_guide",
      requestedMetrics: FIELD_LOW_FREQUENCY_IMPACT_OUTPUTS,
      route: "floor",
      runtime: () => impactRuntime({
        impactFieldContext: COMPLETE_IMPACT_FIELD_CONTEXT,
        layers: CLT_FLOOR,
        targetOutputs: FIELD_LOW_FREQUENCY_IMPACT_OUTPUTS
      }),
      toleranceOrErrorBudget: "field_low_frequency_output_requires_explicit_k_and_room_volume",
      valueOrBlockedReason: "L'nT,50 49.0 with explicit K and receiving-room volume.",
      visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
    }),
    row({
      basis: "element_lab",
      expectedPosture: "family_physics",
      failureClass: "none",
      family: "floor_heavy_concrete_floating_floor_safe_reorder",
      hostileVariant: "role_tagged_floor_layers_reordered",
      id: "floor.heavy_concrete_floating_floor_safe_reorder.lab",
      inputCompleteness: "complete",
      nextAction: "regression_guard",
      originSupportBucket: "source_absent_heavy_floating_floor_formula_safe_reorder",
      requestedMetrics: FLOOR_LAB_IMPACT_OUTPUTS,
      route: "floor",
      runtime: () => impactRuntime({
        layers: HEAVY_FLOATING_FLOOR_REORDERED,
        targetOutputs: FLOOR_LAB_IMPACT_OUTPUTS
      }),
      toleranceOrErrorBudget: "formula_estimate_medium_confidence",
      valueOrBlockedReason: "Ln,w 39.2 / DeltaLw 32.6 after safe role-tagged reorder.",
      visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
    })
  ];
}

function scoreLane(candidate: Omit<PersonalUseMvpCoverageSprintGateABLaneCandidate, "score" | "selected">): number {
  return Math.round(
    (
      (candidate.userFrequency * candidate.blockedOrUnsupportedEvidence) /
      (candidate.implementationCost + candidate.basisLeakageRisk)
    ) * 10
  ) / 10;
}

function failureClassCounts(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[]
): Readonly<Record<PersonalUseMvpCoverageFailureClass, number>> {
  return FAILURE_CLASS_ORDER.reduce((accumulator, failureClass) => {
    accumulator[failureClass] = matrix.filter((entry) => entry.failureClass === failureClass).length;
    return accumulator;
  }, {} as Record<PersonalUseMvpCoverageFailureClass, number>);
}

export function buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix(): readonly PersonalUseMvpCoverageScenarioRow[] {
  return [
    ...buildPersonalUseMvpCoverageSprintGateZScenarioMatrix(),
    ...buildGateAAMatrixV2Rows()
  ];
}

export function rankPersonalUseMvpCoverageSprintGateABLanes(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix()
): PersonalUseMvpCoverageSprintGateABLaneSelection {
  const candidateSeeds = [
    {
      basisLeakageRisk: 1,
      blockedOrUnsupportedEvidence: 6,
      evidenceRowIds: [
        "wall.flat_list_multicavity_ambiguity.needs_input",
        "wall.flat_multicavity_many_layer_schedule.needs_input",
        "wall.grouped_triple_leaf_safe_reverse_order.lab"
      ],
      id: "flat_multicavity_topology_input_surface",
      implementationCost: 3,
      reason:
        "Matrix v2 shows grouped topology is the lowest-risk way to unlock many-layer wall inputs without autogrouping or guessing leaf ownership.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 8
    },
    {
      basisLeakageRisk: 5,
      blockedOrUnsupportedEvidence: 3,
      evidenceRowIds: [
        "wall.opening_leak_composite.lab",
        "wall.opening_leak_two_openings.lab",
        "wall.opening_leak_stc_target.lab"
      ],
      id: "opening_leak_stc_spectrum_adapter",
      implementationCost: 4,
      reason:
        "Opening/leak Rw works, and the new STC target row now proves why a real spectrum/rating adapter was needed before promotion.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 5
    },
    {
      basisLeakageRisk: 7,
      blockedOrUnsupportedEvidence: 4,
      evidenceRowIds: [
        "wall.complete_building_prediction.unsupported",
        "wall.building_prediction_partial_context.needs_input"
      ],
      id: "airborne_building_prediction_runtime_terms",
      implementationCost: 6,
      reason:
        "Building prediction still lacks executable path-by-path direct/flanking/junction terms, so it stays parked behind topology input work.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 5
    },
    {
      basisLeakageRisk: 2,
      blockedOrUnsupportedEvidence: 3,
      evidenceRowIds: [
        "floor.timber_joist_formula_missing_dynamic_stiffness.needs_input",
        "floor.lightweight_steel_formula_missing_spacing.needs_input",
        "floor.lightweight_steel_formula_wrong_family.inactive"
      ],
      id: "timber_steel_floor_input_surface_polish",
      implementationCost: 5,
      reason:
        "Floor formula owner prompts are important but already precise enough; wall flat-list topology is the broader immediate blocker.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 4
    },
    {
      basisLeakageRisk: 5,
      blockedOrUnsupportedEvidence: 2,
      evidenceRowIds: ["floor.astm_iic_aiic_boundary.unsupported"],
      id: "astm_iic_aiic_rating_adapter",
      implementationCost: 4,
      reason:
        "ASTM support must not alias ISO impact values and remains lower ROI than topology input ownership.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 3
    },
    {
      basisLeakageRisk: 8,
      blockedOrUnsupportedEvidence: 1,
      evidenceRowIds: ["wall.aac_nonhomogeneous_masonry.lab", "wall.clt_mass_timber.lab"],
      id: "broad_source_crawl",
      implementationCost: 8,
      reason:
        "Broad source crawling is still not selected because the next blocker is input topology, not a missing exact row.",
      sourceRowsRequiredForRuntimeSelection: true,
      userFrequency: 2
    }
  ] as const satisfies readonly Omit<PersonalUseMvpCoverageSprintGateABLaneCandidate, "score" | "selected">[];

  const rowIds = new Set(matrix.map((entry) => entry.id));
  const candidatesWithoutSelection = candidateSeeds.map((candidate) => {
    const missingRows = candidate.evidenceRowIds.filter((id) => !rowIds.has(id));
    if (missingRows.length > 0) {
      throw new Error(`Gate AB lane ${candidate.id} references missing matrix rows: ${missingRows.join(", ")}`);
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
    throw new Error("Personal-use MVP Coverage Sprint Gate AA requires a Gate AB lane candidate.");
  }

  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Personal-use MVP Coverage Sprint Gate AA did not mark a selected Gate AB lane.");
  }

  return {
    candidates,
    selectedCandidate,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AA_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AA_SELECTED_NEXT_FILE,
    selectionPolicy: [
      "expand representative realistic and hostile rows before promoting another narrow adapter",
      "score user_frequency * blocked_or_unsupported_evidence / (implementation_cost + basis_leakage_risk)",
      "prefer low-basis-leakage input ownership when it unlocks many-layer calculator workflows",
      "keep building, ASTM, opening STC, and broad source crawling behind explicit basis owners"
    ]
  };
}

export function summarizePersonalUseMvpCoverageSprintGateAA(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix()
): PersonalUseMvpCoverageSprintGateAASummary {
  const remainingCoverageGapRowIds = matrix
    .filter((entry) => entry.failureClass === "coverage_gap")
    .map((entry) => entry.id);

  if (remainingCoverageGapRowIds.length > 0) {
    throw new Error(`Gate AA expected a gap-free matrix v2, found: ${remainingCoverageGapRowIds.join(", ")}`);
  }

  const laneSelection = rankPersonalUseMvpCoverageSprintGateABLanes(matrix);
  const matrixV2AddedRowIds = buildGateAAMatrixV2Rows().map((entry) => entry.id);

  return {
    basisCoverage: orderedSubset(matrix.map((entry) => entry.basis), BASIS_ORDER),
    correctlyBlockedRowIds: matrix
      .filter((entry) => entry.failureClass !== "none")
      .map((entry) => entry.id),
    currentPostureCoverage: orderedSubset(matrix.map((entry) => entry.currentPosture), POSTURE_COVERAGE_ORDER),
    failureClassCounts: failureClassCounts(matrix),
    failureClassCoverage: unique(matrix.map((entry) => entry.failureClass)),
    gapFreeAfterGateAA: true,
    matrixV2AddedRowCount: 12,
    matrixV2AddedRowIds,
    numericRuntimeValueMovement: false,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Z_SELECTION_STATUS,
    remainingCoverageGapRowIds: [],
    routeCoverage: orderedSubset(matrix.map((entry) => entry.route), ROUTE_ORDER),
    rowCount: 40,
    selectedGateABLane: laneSelection.selectedCandidate.id,
    selectedNextAction: laneSelection.selectedNextAction,
    selectedNextFile: laneSelection.selectedNextFile
  };
}

export { GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD as PERSONAL_USE_MVP_GATE_AA_OPENING_RUNTIME_METHOD };

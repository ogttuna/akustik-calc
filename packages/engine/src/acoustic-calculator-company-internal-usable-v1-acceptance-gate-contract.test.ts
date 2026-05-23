import type {
  AirborneContext,
  AssemblyCalculation,
  ExactImpactSource,
  ImpactOnlyCalculation,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ASTM_IIC_AIIC_REQUIRED_INPUTS,
  ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ASTM_IIC_AIIC_UNSUPPORTED_METHOD,
  ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_IMPACT_NEEDS_INPUT_METHOD,
  ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ROLELESS_HELPER_ONLY_METHOD,
  ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ROLELESS_HELPER_ONLY_MISSING_INPUTS
} from "./acoustic-answer-engine-v1-floor-boundary";
import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import type { DynamicCalculatorFloorImpactContext } from "./dynamic-calculator-route-input-topology";
import { HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS } from "./helper-only-timber-open-web-impact-stack-estimate";
import { HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS } from "./impact-estimate";
import { EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS } from "./impact-exact";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";

const WALL_AIRBORNE_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const FLOOR_MIXED_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "IIC"
] as const satisfies readonly RequestedOutputId[];
const FLOOR_IMPACT_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const FLOOR_ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const SINGLE_GYPSUM_BOARD = [
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const SPLIT_SINGLE_GYPSUM_BOARD = [
  { materialId: "gypsum_board", thicknessMm: 6.25 },
  { materialId: "gypsum_board", thicknessMm: 6.25 }
] as const satisfies readonly LayerInput[];

const DOUBLE_LEAF_ABSORBED_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const EXACT_LSF_LAB_STACK = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 5 },
  { materialId: "glasswool", thicknessMm: 70 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const LINED_MASSIVE_WALL = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const satisfies readonly LayerInput[];

const HELPER_ONLY_OPEN_WEB = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const HELPER_ONLY_OPEN_WEB_ROLELESS = [
  { materialId: "firestop_board", thicknessMm: 16 },
  { materialId: "firestop_board", thicknessMm: 16 },
  { materialId: "rockwool", thicknessMm: 145 },
  { materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const DRY_GYPSUM_FIBER_SOURCE_ABSENT = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 32 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 45 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const EXACT_FLOOR_R5B_PACKAGE = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const HEAVY_FLOATING_FLOOR_STACK = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
] as const satisfies readonly LayerInput[];

const EXACT_IMPACT_ASSEMBLY_FLOOR = [
  { materialId: "ceramic_tile", thicknessMm: 8 },
  { materialId: "screed", thicknessMm: 50 },
  { materialId: "generic_resilient_underlay", thicknessMm: 8 },
  { materialId: "concrete", thicknessMm: 150 }
] as const satisfies readonly LayerInput[];

const EXACT_IMPACT_SOURCE_19 = {
  frequenciesHz: [50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150],
  labOrField: "lab",
  levelsDb: [60, 59, 58, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43]
} as const satisfies ExactImpactSource;

const EXACT_LSF_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "element_lab",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const DOUBLE_LEAF_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab",
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 90,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
};

const PARTIAL_FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms"
};

const OPENING_BUILDING_CONTEXT: AirborneContext = {
  airtightness: "good",
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  hostWallAreaM2: 12,
  junctionCouplingLengthM: 4.8,
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
  ],
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42,
  sourceRoomVolumeM3: 38
};

const HEAVY_FLOATING_FLOOR_IMPACT_CONTEXT = {
  loadBasisKgM2: 76,
  resilientLayerDynamicStiffnessMNm3: 30
} as const satisfies DynamicCalculatorFloorImpactContext;

type CalculationResult = AssemblyCalculation | ImpactOnlyCalculation;

type CompanyInternalUsableV1Case = {
  readonly airborneContext?: AirborneContext;
  readonly expectedBoundary?: {
    readonly method?: string;
    readonly missingPhysicalInputs?: readonly string[];
    readonly origin: "needs_input" | "unsupported";
    readonly unsupportedOutputs: readonly RequestedOutputId[];
  };
  readonly expectedCandidateKind: NonNullable<CalculationResult["layerCombinationResolverTrace"]>["candidateKind"];
  readonly expectedRuntimeBasisId?: string | null;
  readonly expectedSelectedCandidateId: string;
  readonly expectedSupportedMetrics?: readonly RequestedOutputId[];
  readonly expectedSupportedOutputs: readonly RequestedOutputId[];
  readonly expectedSupportBucket: NonNullable<CalculationResult["layerCombinationResolverTrace"]>["supportBucket"];
  readonly expectedUnsupportedOutputs: readonly RequestedOutputId[];
  readonly expectedValuePins?: readonly { readonly metric: RequestedOutputId; readonly value: number }[];
  readonly exactImpactSource?: ExactImpactSource;
  readonly floorImpactContext?: DynamicCalculatorFloorImpactContext;
  readonly impactOnly?: boolean;
  readonly label: string;
  readonly layers: readonly LayerInput[];
  readonly route: "floor" | "wall";
  readonly shouldHaveBudget?: boolean;
  readonly targetOutputs: readonly RequestedOutputId[];
};

function runCompanyInternalUsableV1Case(testCase: CompanyInternalUsableV1Case): CalculationResult {
  if (testCase.impactOnly) {
    return calculateImpactOnly(testCase.layers, {
      exactImpactSource: testCase.exactImpactSource,
      targetOutputs: testCase.targetOutputs
    });
  }

  return calculateAssembly(testCase.layers, {
    airborneContext: testCase.airborneContext,
    calculator: "dynamic",
    exactImpactSource: testCase.exactImpactSource,
    floorImpactContext: testCase.floorImpactContext,
    targetOutputs: testCase.targetOutputs
  });
}

function expectNoUnownedPublishedValues(label: string, result: CalculationResult): void {
  const trace = result.layerCombinationResolverTrace;
  expect(trace, `${label} resolver trace`).toBeDefined();
  if (!trace) {
    return;
  }

  const supportedOutputs = new Set(result.supportedTargetOutputs);
  const supportedMetrics = new Set(trace.supportedMetrics);
  const unownedSupportedOutputs = result.supportedTargetOutputs.filter((output) => !supportedMetrics.has(output));
  const unownedValuePins = trace.valuePins.filter((pin) => !supportedOutputs.has(pin.metric));

  expect(unownedSupportedOutputs, `${label} unowned supported outputs`).toEqual([]);
  expect(unownedValuePins, `${label} unowned value pins`).toEqual([]);
}

function expectCompanyInternalUsableV1Case(testCase: CompanyInternalUsableV1Case): void {
  const result = runCompanyInternalUsableV1Case(testCase);
  const trace = result.layerCombinationResolverTrace;

  expect(result.targetOutputs, `${testCase.label} requested outputs`).toEqual([...testCase.targetOutputs]);
  expect(result.supportedTargetOutputs, `${testCase.label} supported outputs`).toEqual([
    ...testCase.expectedSupportedOutputs
  ]);
  expect(result.unsupportedTargetOutputs, `${testCase.label} unsupported outputs`).toEqual([
    ...testCase.expectedUnsupportedOutputs
  ]);
  expect(trace, `${testCase.label} trace`).toMatchObject({
    candidateKind: testCase.expectedCandidateKind,
    route: testCase.route,
    runtimeBasisId:
      "expectedRuntimeBasisId" in testCase ? testCase.expectedRuntimeBasisId : expect.anything(),
    selectedCandidateId: testCase.expectedSelectedCandidateId,
    supportBucket: testCase.expectedSupportBucket,
    supportedMetrics: [...(testCase.expectedSupportedMetrics ?? testCase.expectedSupportedOutputs)]
  });
  expect(trace?.rejectedCandidateIds.length ?? 0, `${testCase.label} rejected candidate count`).toBeGreaterThan(0);

  if (testCase.expectedValuePins) {
    expect(trace?.valuePins, `${testCase.label} value pins`).toEqual(
      expect.arrayContaining(testCase.expectedValuePins.map((pin) => ({ ...pin })))
    );
  } else {
    expect(trace?.valuePins, `${testCase.label} no value pins`).toEqual([]);
  }

  if (testCase.shouldHaveBudget) {
    expect(trace?.errorBudgetMetrics.length ?? 0, `${testCase.label} budget metrics`).toBeGreaterThan(0);
  }

  if (testCase.expectedBoundary) {
    expect(result.acousticAnswerBoundary, `${testCase.label} boundary`).toMatchObject({
      method: testCase.expectedBoundary.method ?? expect.any(String),
      missingPhysicalInputs: [...(testCase.expectedBoundary.missingPhysicalInputs ?? [])],
      origin: testCase.expectedBoundary.origin,
      route: testCase.route,
      unsupportedOutputs: [...testCase.expectedBoundary.unsupportedOutputs]
    });
  } else {
    expect(result.acousticAnswerBoundary, `${testCase.label} boundary`).toBeUndefined();
    expectNoUnownedPublishedValues(testCase.label, result);
  }
}

describe("acoustic calculator company-internal usable V1 acceptance gate", () => {
  it("keeps the company-internal answer path on calculator candidates across realistic wall and floor rows", () => {
    const cases = [
      {
        airborneContext: EXACT_LSF_LAB_CONTEXT,
        expectedCandidateKind: "exact_measured_override",
        expectedRuntimeBasisId: "verified_airborne_exact_source",
        expectedSelectedCandidateId: "wall.exact_verified_airborne.same_leaf_schedule",
        expectedSupportedOutputs: ["Rw"],
        expectedSupportBucket: "exact",
        expectedUnsupportedOutputs: ["STC", "C", "Ctr"],
        expectedValuePins: [{ metric: "Rw", value: 55 }],
        label: "wall exact measured row wins without metric aliasing",
        layers: EXACT_LSF_LAB_STACK,
        route: "wall",
        targetOutputs: WALL_AIRBORNE_OUTPUTS
      },
      {
        airborneContext: EXACT_LSF_LAB_CONTEXT,
        expectedCandidateKind: "exact_measured_override",
        expectedRuntimeBasisId: "verified_airborne_exact_source",
        expectedSelectedCandidateId: "wall.exact_verified_airborne.same_leaf_schedule",
        expectedSupportedOutputs: ["Rw"],
        expectedSupportBucket: "exact",
        expectedUnsupportedOutputs: [],
        expectedValuePins: [{ metric: "Rw", value: 55 }],
        label: "wall safe reversed exact order stays exact",
        layers: [...EXACT_LSF_LAB_STACK].reverse(),
        route: "wall",
        targetOutputs: ["Rw"]
      },
      {
        airborneContext: { contextMode: "element_lab" },
        expectedCandidateKind: "source_absent_family_solver",
        expectedRuntimeBasisId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
        expectedSelectedCandidateId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
        expectedSupportedMetrics: ["Rw", "C", "Ctr", "STC"],
        expectedSupportedOutputs: ["Rw", "STC", "C", "Ctr"],
        expectedSupportBucket: "source_absent_estimate",
        expectedUnsupportedOutputs: [],
        expectedValuePins: [
          { metric: "Rw", value: 31 },
          { metric: "STC", value: 31 }
        ],
        label: "wall source-absent single-leaf formula",
        layers: SINGLE_GYPSUM_BOARD,
        route: "wall",
        shouldHaveBudget: true,
        targetOutputs: WALL_AIRBORNE_OUTPUTS
      },
      {
        airborneContext: { contextMode: "element_lab" },
        expectedCandidateKind: "source_absent_family_solver",
        expectedRuntimeBasisId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
        expectedSelectedCandidateId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
        expectedSupportedMetrics: ["Rw", "C", "Ctr", "STC"],
        expectedSupportedOutputs: ["Rw", "STC", "C", "Ctr"],
        expectedSupportBucket: "source_absent_estimate",
        expectedUnsupportedOutputs: [],
        expectedValuePins: [
          { metric: "Rw", value: 31 },
          { metric: "STC", value: 31 }
        ],
        label: "wall duplicate split layers stay on the owned formula",
        layers: SPLIT_SINGLE_GYPSUM_BOARD,
        route: "wall",
        shouldHaveBudget: true,
        targetOutputs: WALL_AIRBORNE_OUTPUTS
      },
      {
        airborneContext: DOUBLE_LEAF_CONTEXT,
        expectedCandidateKind: "source_absent_family_solver",
        expectedRuntimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
        expectedSelectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
        expectedSupportedMetrics: ["Rw", "C", "Ctr", "STC"],
        expectedSupportedOutputs: ["Rw", "STC", "C", "Ctr"],
        expectedSupportBucket: "source_absent_estimate",
        expectedUnsupportedOutputs: [],
        expectedValuePins: [
          { metric: "Rw", value: 45 },
          { metric: "STC", value: 45 },
          { metric: "C", value: -1 },
          { metric: "Ctr", value: -6.1 }
        ],
        label: "wall source-absent double-leaf formula",
        layers: DOUBLE_LEAF_ABSORBED_STACK,
        route: "wall",
        shouldHaveBudget: true,
        targetOutputs: WALL_AIRBORNE_OUTPUTS
      },
      {
        airborneContext: { contextMode: "element_lab" },
        expectedBoundary: {
          missingPhysicalInputs: [
            "sideALeafGroup",
            "cavity1DepthMm",
            "sideBLeafGroup",
            "frameBridgeClass",
            "supportTopology",
            "supportSpacingMm"
          ],
          origin: "needs_input",
          unsupportedOutputs: WALL_AIRBORNE_OUTPUTS
        },
        expectedCandidateKind: "needs_input_boundary",
        expectedRuntimeBasisId: null,
        expectedSelectedCandidateId: "generic.required_input_owner.needs_input_boundary",
        expectedSupportedOutputs: [],
        expectedSupportBucket: "needs_input",
        expectedUnsupportedOutputs: WALL_AIRBORNE_OUTPUTS,
        label: "wall missing double-leaf topology asks for physical inputs",
        layers: DOUBLE_LEAF_ABSORBED_STACK,
        route: "wall",
        targetOutputs: WALL_AIRBORNE_OUTPUTS
      },
      {
        airborneContext: PARTIAL_FIELD_CONTEXT,
        expectedBoundary: {
          missingPhysicalInputs: ["partitionAreaM2", "receivingRoomVolumeM3", "receivingRoomRt60S"],
          origin: "needs_input",
          unsupportedOutputs: WALL_FIELD_OUTPUTS
        },
        expectedCandidateKind: "needs_input_boundary",
        expectedRuntimeBasisId: null,
        expectedSelectedCandidateId: "generic.required_input_owner.needs_input_boundary",
        expectedSupportedOutputs: [],
        expectedSupportBucket: "needs_input",
        expectedUnsupportedOutputs: WALL_FIELD_OUTPUTS,
        label: "wall field request without room context is value-less",
        layers: LINED_MASSIVE_WALL,
        route: "wall",
        targetOutputs: WALL_FIELD_OUTPUTS
      },
      {
        airborneContext: OPENING_BUILDING_CONTEXT,
        expectedBoundary: {
          origin: "unsupported",
          unsupportedOutputs: ["Rw", "STC", "R'w", "DnT,w"]
        },
        expectedCandidateKind: "basis_boundary",
        expectedRuntimeBasisId: null,
        expectedSelectedCandidateId: "generic.lab_field_building_basis_boundary",
        expectedSupportedOutputs: [],
        expectedSupportBucket: "basis_boundary",
        expectedUnsupportedOutputs: ["Rw", "STC", "R'w", "DnT,w"],
        label: "wall building/opening request stays unsupported",
        layers: LINED_MASSIVE_WALL,
        route: "wall",
        targetOutputs: ["Rw", "STC", "R'w", "DnT,w"]
      },
      {
        expectedCandidateKind: "exact_measured_override",
        expectedRuntimeBasisId: "open_measured_floor_system_exact_match",
        expectedSelectedCandidateId: "floor.exact_measured_floor_system.same_topology_metric_basis",
        expectedSupportedOutputs: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
        expectedSupportBucket: "exact",
        expectedUnsupportedOutputs: ["STC", "Ctr", "L'n,w", "IIC"],
        expectedValuePins: [
          { metric: "Rw", value: 75 },
          { metric: "Ln,w", value: 44 },
          { metric: "Ln,w+CI", value: 44 }
        ],
        label: "floor exact row keeps ASTM and field aliases out",
        layers: EXACT_FLOOR_R5B_PACKAGE,
        route: "floor",
        targetOutputs: FLOOR_MIXED_OUTPUTS
      },
      {
        expectedCandidateKind: "similarity_anchor",
        expectedRuntimeBasisId: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
        expectedSelectedCandidateId: "floor.open_box_timber.package_transfer_similarity",
        expectedSupportedOutputs: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
        expectedSupportBucket: "anchored_estimate",
        expectedUnsupportedOutputs: ["STC", "Ctr", "L'n,w", "IIC"],
        expectedValuePins: [
          { metric: "Rw", value: 66 },
          { metric: "Ln,w", value: 50.8 },
          { metric: "Ln,w+CI", value: 52 }
        ],
        label: "floor compatible package-transfer anchor",
        layers: DRY_GYPSUM_FIBER_SOURCE_ABSENT,
        route: "floor",
        shouldHaveBudget: true,
        targetOutputs: FLOOR_MIXED_OUTPUTS
      },
      {
        expectedCandidateKind: "source_absent_family_solver",
        expectedRuntimeBasisId: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS,
        expectedSelectedCandidateId: "floor.helper_only_timber_open_web.source_absent",
        expectedSupportedOutputs: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
        expectedSupportBucket: "source_absent_estimate",
        expectedUnsupportedOutputs: ["IIC"],
        expectedValuePins: [
          { metric: "Rw", value: 46.7 },
          { metric: "Ln,w", value: 59.6 },
          { metric: "Ln,w+CI", value: 60.6 }
        ],
        label: "floor helper-only source-absent formula",
        layers: HELPER_ONLY_OPEN_WEB,
        route: "floor",
        shouldHaveBudget: true,
        targetOutputs: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "IIC"]
      },
      {
        expectedCandidateKind: "source_absent_family_solver",
        expectedRuntimeBasisId: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS,
        expectedSelectedCandidateId: "floor.heavy_concrete_floating_floor.lab_impact_formula",
        expectedSupportedOutputs: ["Ln,w", "DeltaLw"],
        expectedSupportBucket: "source_absent_estimate",
        expectedUnsupportedOutputs: [],
        expectedValuePins: [
          { metric: "Ln,w", value: 50.3 },
          { metric: "DeltaLw", value: 24.3 }
        ],
        floorImpactContext: HEAVY_FLOATING_FLOOR_IMPACT_CONTEXT,
        label: "floor heavy floating lab-impact formula",
        layers: HEAVY_FLOATING_FLOOR_STACK,
        route: "floor",
        shouldHaveBudget: true,
        targetOutputs: FLOOR_IMPACT_OUTPUTS
      },
      {
        expectedBoundary: {
          method: ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_IMPACT_NEEDS_INPUT_METHOD,
          missingPhysicalInputs: ["loadBasisKgM2"],
          origin: "needs_input",
          unsupportedOutputs: FLOOR_IMPACT_OUTPUTS
        },
        expectedCandidateKind: "needs_input_boundary",
        expectedRuntimeBasisId: null,
        expectedSelectedCandidateId: "generic.required_input_owner.needs_input_boundary",
        expectedSupportedOutputs: [],
        expectedSupportBucket: "needs_input",
        expectedUnsupportedOutputs: FLOOR_IMPACT_OUTPUTS,
        label: "floor lab-impact formula missing load basis",
        layers: HEAVY_FLOATING_FLOOR_STACK,
        route: "floor",
        targetOutputs: FLOOR_IMPACT_OUTPUTS
      },
      {
        expectedBoundary: {
          method: ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ROLELESS_HELPER_ONLY_METHOD,
          missingPhysicalInputs: ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ROLELESS_HELPER_ONLY_MISSING_INPUTS,
          origin: "needs_input",
          unsupportedOutputs: FLOOR_IMPACT_OUTPUTS
        },
        expectedCandidateKind: "needs_input_boundary",
        expectedRuntimeBasisId: null,
        expectedSelectedCandidateId: "generic.required_input_owner.needs_input_boundary",
        expectedSupportedOutputs: [],
        expectedSupportBucket: "needs_input",
        expectedUnsupportedOutputs: FLOOR_IMPACT_OUTPUTS,
        impactOnly: true,
        label: "impact-only roleless helper stack asks for floor roles",
        layers: HELPER_ONLY_OPEN_WEB_ROLELESS,
        route: "floor",
        targetOutputs: FLOOR_IMPACT_OUTPUTS
      },
      {
        expectedBoundary: {
          method: ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ASTM_IIC_AIIC_UNSUPPORTED_METHOD,
          missingPhysicalInputs: [],
          origin: "unsupported",
          unsupportedOutputs: FLOOR_ASTM_OUTPUTS
        },
        expectedCandidateKind: "unsupported_boundary",
        expectedRuntimeBasisId: null,
        expectedSelectedCandidateId: "generic.astm_iic_aiic.unsupported_boundary",
        expectedSupportedOutputs: [],
        expectedSupportBucket: "unsupported",
        expectedUnsupportedOutputs: FLOOR_ASTM_OUTPUTS,
        impactOnly: true,
        label: "impact-only pure ASTM request stays unsupported",
        layers: EXACT_FLOOR_R5B_PACKAGE,
        route: "floor",
        targetOutputs: FLOOR_ASTM_OUTPUTS
      },
      {
        exactImpactSource: EXACT_IMPACT_SOURCE_19,
        expectedCandidateKind: "exact_measured_override",
        expectedRuntimeBasisId: EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS,
        expectedSelectedCandidateId: "floor.exact_impact_band_source.metric_basis",
        expectedSupportedOutputs: ["Ln,w", "CI"],
        expectedSupportBucket: "exact",
        expectedUnsupportedOutputs: ["Rw", "STC", "C", "Ctr", "IIC"],
        expectedValuePins: [
          { metric: "Ln,w", value: 53 },
          { metric: "CI", value: -3 }
        ],
        label: "floor exact impact-band keeps airborne companions out",
        layers: EXACT_IMPACT_ASSEMBLY_FLOOR,
        route: "floor",
        targetOutputs: ["Rw", "STC", "C", "Ctr", "Ln,w", "CI", "IIC"]
      }
    ] as const satisfies readonly CompanyInternalUsableV1Case[];

    expect(cases.map((testCase) => testCase.expectedCandidateKind)).toEqual(
      expect.arrayContaining([
        "exact_measured_override",
        "similarity_anchor",
        "source_absent_family_solver",
        "needs_input_boundary",
        "unsupported_boundary",
        "basis_boundary"
      ])
    );

    for (const testCase of cases) {
      expectCompanyInternalUsableV1Case(testCase);
    }
  });

  it("keeps metric alias negatives explicit for company-internal use", () => {
    const floorAstm = calculateImpactOnly(EXACT_FLOOR_R5B_PACKAGE, {
      targetOutputs: FLOOR_ASTM_OUTPUTS
    });
    const wallBuilding = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: OPENING_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC", "R'w", "DnT,w"]
    });
    const mixedImpactBand = calculateAssembly(EXACT_IMPACT_ASSEMBLY_FLOOR, {
      calculator: "dynamic",
      exactImpactSource: EXACT_IMPACT_SOURCE_19,
      targetOutputs: ["Rw", "STC", "C", "Ctr", "Ln,w", "CI", "IIC"]
    });

    expect(floorAstm.acousticAnswerBoundary).toMatchObject({
      method: ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ASTM_IIC_AIIC_UNSUPPORTED_METHOD,
      requiredInputs: [...ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ASTM_IIC_AIIC_REQUIRED_INPUTS],
      unsupportedOutputs: [...FLOOR_ASTM_OUTPUTS]
    });
    expect(floorAstm.layerCombinationResolverTrace?.valuePins).toEqual([]);
    expect(floorAstm.layerCombinationResolverTrace?.supportedMetrics).not.toContain("Ln,w");

    expect(wallBuilding.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "basis_boundary",
      requestedBasis: "building_prediction",
      selectedCandidateId: "generic.lab_field_building_basis_boundary",
      supportedMetrics: [],
      valuePins: []
    });
    expect(wallBuilding.supportedTargetOutputs).toEqual([]);

    expect(mixedImpactBand.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "exact_measured_override",
      runtimeBasisId: EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS,
      supportedMetrics: ["Ln,w", "CI"],
      valuePins: [
        { metric: "Ln,w", value: 53 },
        { metric: "CI", value: -3 }
      ]
    });
    expect(mixedImpactBand.unsupportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr", "IIC"]);
    expect(mixedImpactBand.layerCombinationResolverTrace?.supportedMetrics).not.toContain("Rw");
    expect(mixedImpactBand.layerCombinationResolverTrace?.supportedMetrics).not.toContain("STC");
    expect(mixedImpactBand.layerCombinationResolverTrace?.supportedMetrics).not.toContain("IIC");
  });
});

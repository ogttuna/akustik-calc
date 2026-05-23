import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  AirborneContext,
  AssemblyCalculation,
  ExactImpactSource,
  ImpactFieldContext,
  ImpactOnlyCalculation,
  LayerCombinationResolverTrace,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ASTM_IIC_AIIC_REQUIRED_INPUTS,
  ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ASTM_IIC_AIIC_UNSUPPORTED_METHOD,
  ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_FIELD_IMPACT_NEEDS_INPUT_METHOD,
  ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_IMPACT_NEEDS_INPUT_METHOD,
  ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ROLELESS_HELPER_ONLY_METHOD,
  ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ROLELESS_HELPER_ONLY_MISSING_INPUTS
} from "./acoustic-answer-engine-v1-floor-boundary";
import { ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_OWNER_AUDIT_WARNING_PREFIX } from "./acoustic-answer-engine-v1-owner-audit";
import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  FLAT_LIST_MULTILEAF_GUARD_FIELD_RUNTIME_METHOD,
  FLAT_LIST_MULTILEAF_GUARD_FIELD_SELECTED_CANDIDATE_ID,
  FLAT_LIST_MULTILEAF_GUARD_LAB_RUNTIME_METHOD,
  FLAT_LIST_MULTILEAF_GUARD_LAB_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-flat-list-multileaf-guard";
import {
  COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_RUNTIME_METHOD,
  COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-company-internal-heavy-composite-wall";
import {
  GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD,
  GATE_H_LINED_MASSIVE_WALL_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-h-lined-masonry-clt";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
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
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_PROXY_OUTPUTS = [
  "R'w",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];
const FLOOR_OUTPUTS = [
  "Rw",
  "C",
  "Ctr",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "IIC"
] as const satisfies readonly RequestedOutputId[];
const FLOOR_EXACT_MIXED_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "IIC"
] as const satisfies readonly RequestedOutputId[];
const EXACT_IMPACT_LAB_OUTPUTS = [
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "DeltaLw",
  "IIC"
] as const satisfies readonly RequestedOutputId[];
const EXACT_IMPACT_FIELD_OUTPUTS = [
  "LnT,A",
  "L'nT,w",
  "CI",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];
const EXACT_IMPACT_MIXED_FLOOR_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "Ln,w",
  "CI",
  "IIC"
] as const satisfies readonly RequestedOutputId[];
const FLOOR_LAB_IMPACT_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const FLOOR_FIELD_IMPACT_OUTPUTS = ["L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];
const FLOOR_ASTM_ONLY_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const SINGLE_GYPSUM_BOARD = [
  { materialId: "gypsum_board", thicknessMm: 12.5 }
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

const EXACT_DNTAK_FIELD_STACK = [
  { materialId: "gypsum", thicknessMm: 12.5 },
  { materialId: "gypsum", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 60 },
  { materialId: "glasswool", thicknessMm: 40 },
  { materialId: "gypsum", thicknessMm: 12.5 },
  { materialId: "gypsum", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const FLAT_MULTICAVITY_UNGROUPED_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "glasswool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "glasswool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const ADJACENT_FLAT_LIST_ROCKWOOL_GUARD_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const FLAT_MULTICAVITY_MISSING_INPUTS = [
  "sideALeafGroup",
  "cavity1DepthMm",
  "internalLeafGroup",
  "internalLeafCoupling",
  "cavity2DepthMm",
  "sideBLeafGroup",
  "supportTopology"
] as const;

const INDEPENDENT_ABSORBED_CONTEXT: AirborneContext = {
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

const EXACT_LSF_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "element_lab",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const EXACT_DNTAK_FIELD_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "field_between_rooms",
  electricalBoxes: "none",
  junctionQuality: "good",
  panelHeightMm: 2600,
  panelWidthMm: 3000,
  penetrationState: "none",
  perimeterSeal: "good",
  receivingRoomVolumeM3: 30,
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const RESILIENT_MISSING_SIDE_COUNT_CONTEXT: AirborneContext = {
  connectionType: "resilient_channel",
  contextMode: "element_lab",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 75,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "resilient_channel",
    topologyMode: "double_leaf_framed"
  }
};

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

const RAW_OPEN_BOX_TIMBER = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_WEB_300 = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
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

const SUPPORTED_BAND_PACKAGE = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
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

const EXACT_IMPACT_SOURCE_19 = {
  frequenciesHz: [50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150],
  labOrField: "lab",
  levelsDb: [60, 59, 58, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43]
} as const satisfies ExactImpactSource;

const EXACT_FIELD_OCTAVE_SOURCE_5 = {
  frequenciesHz: [125, 250, 500, 1000, 2000],
  labOrField: "field",
  levelsDb: [60.3, 61.7, 63.1, 63.5, 59.2],
  standardMethod: "NEN 5077 / ISO 16283-2"
} as const satisfies ExactImpactSource;

const EXACT_IMPACT_ASSEMBLY_FLOOR = [
  { materialId: "ceramic_tile", thicknessMm: 8 },
  { materialId: "screed", thicknessMm: 50 },
  { materialId: "generic_resilient_underlay", thicknessMm: 8 },
  { materialId: "concrete", thicknessMm: 150 }
] as const satisfies readonly LayerInput[];

const HEAVY_FLOATING_FLOOR_STACK = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
] as const satisfies readonly LayerInput[];

const DIRECT_FIXED_OPEN_WEB = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const HEAVY_FLOATING_FLOOR_IMPACT_CONTEXT = {
  loadBasisKgM2: 76,
  resilientLayerDynamicStiffnessMNm3: 30
} as const satisfies DynamicCalculatorFloorImpactContext;

const LINED_MASSIVE_WALL = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const satisfies readonly LayerInput[];

const HEAVY_COMPOSITE_WALL = [
  { materialId: "concrete", thicknessMm: 80 },
  { materialId: "pumice_block", thicknessMm: 100 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "concrete", thicknessMm: 80 }
] as const satisfies readonly LayerInput[];

const PARTIAL_FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms"
};

const PARTIAL_FIELD_CONTEXT_MISSING_RT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomVolumeM3: 42
};

const COMPLETE_FIELD_CONTEXT: AirborneContext = {
  ...PARTIAL_FIELD_CONTEXT_MISSING_RT,
  receivingRoomRt60S: 0.55
};

const FLOOR_FIELD_AIRBORNE_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const FLOOR_IMPACT_FIELD_CONTEXT: ImpactFieldContext = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const PARTIAL_BUILDING_CONTEXT: AirborneContext = {
  airtightness: "good",
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  sourceRoomVolumeM3: 38
};

const OPENING_BUILDING_CONTEXT: AirborneContext = {
  ...PARTIAL_BUILDING_CONTEXT,
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
  ],
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42
};

const REQUIRED_SURFACES = [
  "packages/engine/src/acoustic-calculator-answer-engine-v1-contract.test.ts",
  "packages/engine/src/calculate-assembly.ts",
  "packages/engine/src/dynamic-calculator-route-input-topology.ts",
  "packages/engine/src/layer-combination-resolver-runtime-candidate-surface-parity.ts",
  "docs/calculator/USABLE_V1_EXECUTION_PLAN.md",
  "docs/calculator/ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_PLAN_2026-05-21.md",
  "docs/calculator/CHECKPOINT_2026-05-22_ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_RECONCILIATION.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

type AnswerEngineV1OwnedOutputProbe = Pick<
  AssemblyCalculation | ImpactOnlyCalculation,
  "layerCombinationResolverTrace" | "supportedTargetOutputs" | "unsupportedTargetOutputs"
>;

type WallV1AcceptanceCase = {
  readonly context: AirborneContext;
  readonly expectedBoundary?: {
    readonly missingPhysicalInputs?: readonly string[];
    readonly origin: "needs_input" | "unsupported";
    readonly unsupportedOutputs: readonly RequestedOutputId[];
  };
  readonly expectedTrace: Partial<LayerCombinationResolverTrace>;
  readonly expectedUnsupported: readonly RequestedOutputId[];
  readonly expectedValues?: readonly {
    readonly metric: RequestedOutputId;
    readonly value: number;
  }[];
  readonly label: string;
  readonly layers: readonly LayerInput[];
  readonly targetOutputs: readonly RequestedOutputId[];
};

type FloorV1AcceptanceCase = {
  readonly airborneContext?: AirborneContext;
  readonly exactImpactSource?: ExactImpactSource;
  readonly expectedBoundary?: {
    readonly missingPhysicalInputs?: readonly string[];
    readonly origin: "needs_input" | "unsupported";
    readonly unsupportedOutputs: readonly RequestedOutputId[];
  };
  readonly expectedSupported: readonly RequestedOutputId[];
  readonly expectedTrace: Partial<LayerCombinationResolverTrace>;
  readonly expectedUnsupported: readonly RequestedOutputId[];
  readonly expectedValues?: readonly {
    readonly metric: RequestedOutputId;
    readonly value: number;
  }[];
  readonly floorImpactContext?: DynamicCalculatorFloorImpactContext;
  readonly impactFieldContext?: ImpactFieldContext;
  readonly label: string;
  readonly layers: readonly LayerInput[];
  readonly targetOutputs: readonly RequestedOutputId[];
};

function expectSupportedOutputsOwnedBySelectedCandidate(
  label: string,
  result: AnswerEngineV1OwnedOutputProbe
): void {
  const trace: LayerCombinationResolverTrace | undefined = result.layerCombinationResolverTrace;
  expect(trace, `${label} resolver trace`).toBeDefined();
  if (!trace) {
    return;
  }

  const ownedMetricSet = new Set<RequestedOutputId>(trace.supportedMetrics);
  const supportedOutputSet = new Set<RequestedOutputId>(result.supportedTargetOutputs);
  const ownerlessSupportedOutputs = result.supportedTargetOutputs.filter(
    (output) => !ownedMetricSet.has(output)
  );

  expect(ownerlessSupportedOutputs, `${label} ownerless supported outputs`).toEqual([]);
  for (const pin of trace.valuePins) {
    expect(ownedMetricSet.has(pin.metric), `${label} value pin ${pin.metric} is selected-owner metric`).toBe(true);
    expect(supportedOutputSet.has(pin.metric), `${label} value pin ${pin.metric} is published output`).toBe(true);
  }
}

function expectWallV1AcceptanceCase(testCase: WallV1AcceptanceCase): void {
  const result = calculateAssembly(testCase.layers, {
    airborneContext: testCase.context,
    calculator: "dynamic",
    targetOutputs: testCase.targetOutputs
  });
  const trace = result.layerCombinationResolverTrace;

  expect(result.targetOutputs, `${testCase.label} requested outputs`).toEqual([...testCase.targetOutputs]);
  expect(result.unsupportedTargetOutputs, `${testCase.label} unsupported outputs`).toEqual([
    ...testCase.expectedUnsupported
  ]);
  expectSupportedOutputsOwnedBySelectedCandidate(testCase.label, result);
  expect(trace, `${testCase.label} resolver trace`).toMatchObject(testCase.expectedTrace);

  if (testCase.expectedValues) {
    expect(trace?.valuePins, `${testCase.label} value pins`).toEqual(
      expect.arrayContaining(testCase.expectedValues.map((pin) => ({ ...pin })))
    );
  } else {
    expect(trace?.valuePins, `${testCase.label} value pins`).toEqual([]);
  }

  if (testCase.expectedBoundary) {
    expect(result.acousticAnswerBoundary, `${testCase.label} answer boundary`).toMatchObject({
      origin: testCase.expectedBoundary.origin,
      route: "wall",
      unsupportedOutputs: [...testCase.expectedBoundary.unsupportedOutputs]
    });
    if (testCase.expectedBoundary.missingPhysicalInputs) {
      expect(
        result.acousticAnswerBoundary?.missingPhysicalInputs,
        `${testCase.label} missing physical inputs`
      ).toEqual([...testCase.expectedBoundary.missingPhysicalInputs]);
    }
  } else {
    expect(result.acousticAnswerBoundary, `${testCase.label} answer boundary`).toBeUndefined();
  }

  if (testCase.expectedTrace.requestedBasis === "field_apparent") {
    expect(trace?.supportedMetrics, `${testCase.label} no lab Rw alias in field trace`).not.toContain("Rw");
    expect(trace?.supportedMetrics, `${testCase.label} no lab STC alias in field trace`).not.toContain("STC");
  }
}

function expectFloorV1AcceptanceCase(testCase: FloorV1AcceptanceCase): void {
  const result = calculateAssembly(testCase.layers, {
    airborneContext: testCase.airborneContext,
    calculator: "dynamic",
    exactImpactSource: testCase.exactImpactSource,
    floorImpactContext: testCase.floorImpactContext,
    impactFieldContext: testCase.impactFieldContext,
    targetOutputs: testCase.targetOutputs
  });
  const trace = result.layerCombinationResolverTrace;

  expect(result.targetOutputs, `${testCase.label} requested outputs`).toEqual([...testCase.targetOutputs]);
  expect(result.supportedTargetOutputs, `${testCase.label} supported outputs`).toEqual([
    ...testCase.expectedSupported
  ]);
  expect(result.unsupportedTargetOutputs, `${testCase.label} unsupported outputs`).toEqual([
    ...testCase.expectedUnsupported
  ]);
  expectSupportedOutputsOwnedBySelectedCandidate(testCase.label, result);
  expect(trace, `${testCase.label} resolver trace`).toMatchObject(testCase.expectedTrace);

  if (testCase.expectedValues) {
    expect(trace?.valuePins, `${testCase.label} value pins`).toEqual(
      expect.arrayContaining(testCase.expectedValues.map((pin) => ({ ...pin })))
    );
  } else {
    expect(trace?.valuePins, `${testCase.label} value pins`).toEqual([]);
  }

  if (testCase.expectedBoundary) {
    expect(result.acousticAnswerBoundary, `${testCase.label} answer boundary`).toMatchObject({
      origin: testCase.expectedBoundary.origin,
      route: "floor",
      unsupportedOutputs: [...testCase.expectedBoundary.unsupportedOutputs]
    });
    if (testCase.expectedBoundary.missingPhysicalInputs) {
      expect(
        result.acousticAnswerBoundary?.missingPhysicalInputs,
        `${testCase.label} missing physical inputs`
      ).toEqual([...testCase.expectedBoundary.missingPhysicalInputs]);
    }
  } else {
    expect(result.acousticAnswerBoundary, `${testCase.label} answer boundary`).toBeUndefined();
  }

  expect(trace?.supportedMetrics, `${testCase.label} no ASTM alias in selected owner`).not.toContain("IIC");
  expect(trace?.supportedMetrics, `${testCase.label} no ASTM field alias in selected owner`).not.toContain("AIIC");
}

describe("acoustic calculator answer engine V1 contract", () => {
  it("locks the active work to calculator answers instead of source catalog drift", () => {
    const plan = readRepoFile("docs/calculator/ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_PLAN_2026-05-21.md");
    const usableV1Plan = readRepoFile("docs/calculator/USABLE_V1_EXECUTION_PLAN.md");
    const agents = readRepoFile("AGENTS.md");
    const currentState = readRepoFile("docs/calculator/CURRENT_STATE.md");
    const nextImplementationPlan = readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md");
    const gate = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(plan).toContain("Product Direction Lock - 2026-05-22");
    expect(plan).toMatch(/DynEcho must keep moving toward a usable\s+acoustic calculator/);
    expect(plan).toContain("not a source catalog");
    expect(plan).toContain("packages/engine/src/acoustic-calculator-answer-engine-v1-contract.test.ts");
    expect(usableV1Plan).toContain("binding finish plan for company-internal");
    expect(usableV1Plan).toContain("Every calculator answer must be selected in this order");
    expect(usableV1Plan).toContain("## Architecture Rules");
    expect(usableV1Plan).toContain("## UI And Surface Rules");
    expect(usableV1Plan).toContain("## API, Persistence, And Report Rules");
    expect(usableV1Plan).toContain("## Test And Gate Rules");
    expect(usableV1Plan).toContain("## Execution Protocol For Agents");
    expect(usableV1Plan).toContain("selected candidate owns a route, basis, metric set");
    expect(usableV1Plan).toContain("The UI opens only fields required by the selected route");
    expect(usableV1Plan).toContain("API responses must include enough structured data");
    expect(usableV1Plan).toContain("Negative tests are mandatory");
    expect(usableV1Plan).toContain("Start every implementation by naming the usable V1 step being closed");
    expect(usableV1Plan).toContain("Step 5 - Company-Internal Acceptance Gate");
    expect(usableV1Plan).toContain("If a step is not backed by tests, it is not done.");
    expect(agents).toContain("docs/calculator/USABLE_V1_EXECUTION_PLAN.md");
    expect(agents).toContain("Do not answer \"how much is left\" with an");
    expect(currentState).toContain("USABLE_V1_EXECUTION_PLAN.md");
    expect(nextImplementationPlan).toContain("USABLE_V1_EXECUTION_PLAN.md");
    expect(gate).toContain("src/acoustic-calculator-answer-engine-v1-contract.test.ts");

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps representative V1 supported outputs inside selected candidate ownership", () => {
    const probes: readonly (readonly [string, AnswerEngineV1OwnedOutputProbe])[] = [
      [
        "wall source-absent single leaf",
        calculateAssembly(SINGLE_GYPSUM_BOARD, {
          airborneContext: { contextMode: "element_lab" },
          calculator: "dynamic",
          targetOutputs: WALL_OUTPUTS
        })
      ],
      [
        "wall exact measured metric scope",
        calculateAssembly(EXACT_LSF_LAB_STACK, {
          airborneContext: EXACT_LSF_LAB_CONTEXT,
          calculator: "dynamic",
          targetOutputs: WALL_OUTPUTS
        })
      ],
      [
        "wall source-absent lined massive formula",
        calculateAssembly(LINED_MASSIVE_WALL, {
          airborneContext: { contextMode: "element_lab" },
          calculator: "dynamic",
          targetOutputs: WALL_OUTPUTS
        })
      ],
      [
        "wall source-absent heavy-composite formula",
        calculateAssembly(HEAVY_COMPOSITE_WALL, {
          airborneContext: { contextMode: "element_lab" },
          calculator: "dynamic",
          targetOutputs: WALL_OUTPUTS
        })
      ],
      [
        "wall field needs-input boundary",
        calculateAssembly(LINED_MASSIVE_WALL, {
          airborneContext: PARTIAL_FIELD_CONTEXT,
          calculator: "dynamic",
          targetOutputs: WALL_FIELD_OUTPUTS
        })
      ],
      [
        "floor source-absent helper-only formula",
        calculateAssembly(HELPER_ONLY_OPEN_WEB, {
          calculator: "dynamic",
          targetOutputs: FLOOR_OUTPUTS
        })
      ],
      [
        "floor exact measured metric scope",
        calculateAssembly(EXACT_FLOOR_R5B_PACKAGE, {
          calculator: "dynamic",
          targetOutputs: FLOOR_EXACT_MIXED_OUTPUTS
        })
      ],
      [
        "floor exact impact-band mixed assembly",
        calculateAssembly(EXACT_IMPACT_ASSEMBLY_FLOOR, {
          calculator: "dynamic",
          exactImpactSource: EXACT_IMPACT_SOURCE_19,
          targetOutputs: EXACT_IMPACT_MIXED_FLOOR_OUTPUTS
        })
      ],
      [
        "impact-only exact measured metric scope",
        calculateImpactOnly(EXACT_FLOOR_R5B_PACKAGE, {
          targetOutputs: FLOOR_EXACT_MIXED_OUTPUTS
        })
      ],
      [
        "impact-only ASTM unsupported boundary",
        calculateImpactOnly(EXACT_FLOOR_R5B_PACKAGE, {
          targetOutputs: FLOOR_ASTM_ONLY_OUTPUTS
        })
      ],
      [
        "impact-only roleless helper needs-input boundary",
        calculateImpactOnly(HELPER_ONLY_OPEN_WEB_ROLELESS, {
          targetOutputs: FLOOR_LAB_IMPACT_OUTPUTS
        })
      ]
    ];

    for (const [label, result] of probes) {
      expectSupportedOutputsOwnedBySelectedCandidate(label, result);
    }
  });

  it("covers the Step 2 wall V1 answer matrix with basis-owned values or explicit stops", () => {
    const matrix = [
      {
        context: EXACT_LSF_LAB_CONTEXT,
        expectedTrace: {
          candidateKind: "exact_measured_override",
          requestedBasis: "element_lab",
          route: "wall",
          runtimeBasisId: "verified_airborne_exact_source",
          selectedCandidateId: "wall.exact_verified_airborne.same_leaf_schedule",
          supportBucket: "exact",
          supportedMetrics: ["Rw"],
          valuePins: [{ metric: "Rw", value: 55 }]
        },
        expectedUnsupported: ["STC", "C", "Ctr"],
        expectedValues: [{ metric: "Rw", value: 55 }],
        label: "wall exact measured same-stack metric scope",
        layers: EXACT_LSF_LAB_STACK,
        targetOutputs: WALL_OUTPUTS
      },
      {
        context: EXACT_LSF_LAB_CONTEXT,
        expectedTrace: {
          candidateKind: "exact_measured_override",
          requestedBasis: "element_lab",
          route: "wall",
          runtimeBasisId: "verified_airborne_exact_source",
          selectedCandidateId: "wall.exact_verified_airborne.same_leaf_schedule",
          supportBucket: "exact",
          supportedMetrics: ["Rw"],
          valuePins: [{ metric: "Rw", value: 55 }]
        },
        expectedUnsupported: [],
        expectedValues: [{ metric: "Rw", value: 55 }],
        label: "wall exact measured reversed same-stack",
        layers: [...EXACT_LSF_LAB_STACK].reverse(),
        targetOutputs: ["Rw"]
      },
      {
        context: { contextMode: "element_lab" },
        expectedTrace: {
          candidateKind: "source_absent_family_solver",
          requestedBasis: "element_lab",
          route: "wall",
          runtimeBasisId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
          selectedCandidateId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
          supportBucket: "source_absent_estimate",
          supportedMetrics: ["Rw", "C", "Ctr", "STC"]
        },
        expectedUnsupported: [],
        expectedValues: [
          { metric: "Rw", value: 31 },
          { metric: "STC", value: 31 }
        ],
        label: "wall source-absent single-leaf formula",
        layers: SINGLE_GYPSUM_BOARD,
        targetOutputs: WALL_OUTPUTS
      },
      {
        context: INDEPENDENT_ABSORBED_CONTEXT,
        expectedTrace: {
          candidateKind: "source_absent_family_solver",
          requestedBasis: "element_lab",
          route: "wall",
          runtimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
          selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
          supportBucket: "source_absent_estimate",
          supportedMetrics: ["Rw", "C", "Ctr", "STC"]
        },
        expectedUnsupported: [],
        expectedValues: [
          { metric: "Rw", value: 45 },
          { metric: "STC", value: 45 },
          { metric: "C", value: -1 },
          { metric: "Ctr", value: -6.1 }
        ],
        label: "wall source-absent double-leaf formula",
        layers: DOUBLE_LEAF_ABSORBED_STACK,
        targetOutputs: WALL_OUTPUTS
      },
      {
        context: { contextMode: "element_lab" },
        expectedTrace: {
          candidateKind: "source_absent_family_solver",
          requestedBasis: "element_lab",
          route: "wall",
          runtimeBasisId: FLAT_LIST_MULTILEAF_GUARD_LAB_RUNTIME_METHOD,
          selectedCandidateId: FLAT_LIST_MULTILEAF_GUARD_LAB_SELECTED_CANDIDATE_ID,
          supportBucket: "source_absent_estimate",
          supportedMetrics: ["Rw", "STC", "C", "Ctr"]
        },
        expectedUnsupported: [],
        expectedValues: [
          { metric: "Rw", value: 51 },
          { metric: "STC", value: 51 },
          { metric: "C", value: -1.8 },
          { metric: "Ctr", value: -7.3 }
        ],
        label: "wall flat-list adjacent-swap guarded double-leaf formula",
        layers: ADJACENT_FLAT_LIST_ROCKWOOL_GUARD_STACK,
        targetOutputs: WALL_OUTPUTS
      },
      {
        context: { contextMode: "element_lab" },
        expectedTrace: {
          candidateKind: "source_absent_family_solver",
          requestedBasis: "element_lab",
          route: "wall",
          runtimeBasisId: GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD,
          selectedCandidateId: GATE_H_LINED_MASSIVE_WALL_SELECTED_CANDIDATE_ID,
          supportBucket: "source_absent_estimate",
          supportedMetrics: ["Rw", "STC", "C", "Ctr"]
        },
        expectedUnsupported: [],
        expectedValues: [
          { metric: "Rw", value: 60 },
          { metric: "STC", value: 60 },
          { metric: "C", value: -0.8 },
          { metric: "Ctr", value: -5.7 }
        ],
        label: "wall source-absent lined massive formula",
        layers: LINED_MASSIVE_WALL,
        targetOutputs: WALL_OUTPUTS
      },
      {
        context: { contextMode: "element_lab" },
        expectedTrace: {
          candidateKind: "source_absent_family_solver",
          requestedBasis: "element_lab",
          route: "wall",
          runtimeBasisId: COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_RUNTIME_METHOD,
          selectedCandidateId: COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_SELECTED_CANDIDATE_ID,
          supportBucket: "source_absent_estimate",
          supportedMetrics: ["Rw", "STC", "C", "Ctr"]
        },
        expectedUnsupported: [],
        expectedValues: [
          { metric: "Rw", value: 63 },
          { metric: "STC", value: 63 },
          { metric: "C", value: -1.4 },
          { metric: "Ctr", value: -6.3 }
        ],
        label: "wall source-absent heavy-composite formula",
        layers: HEAVY_COMPOSITE_WALL,
        targetOutputs: WALL_OUTPUTS
      },
      {
        context: COMPLETE_FIELD_CONTEXT,
        expectedTrace: {
          candidateKind: "field_building_adapter",
          requestedBasis: "field_apparent",
          route: "wall",
          runtimeBasisId: FLAT_LIST_MULTILEAF_GUARD_FIELD_RUNTIME_METHOD,
          selectedCandidateId: FLAT_LIST_MULTILEAF_GUARD_FIELD_SELECTED_CANDIDATE_ID,
          supportBucket: "field_adapter",
          supportedMetrics: ["R'w", "DnT,w"]
        },
        expectedUnsupported: [],
        expectedValues: [
          { metric: "R'w", value: 49 },
          { metric: "DnT,w", value: 50 }
        ],
        label: "wall flat-list adjacent-swap guarded field adapter",
        layers: ADJACENT_FLAT_LIST_ROCKWOOL_GUARD_STACK,
        targetOutputs: WALL_FIELD_OUTPUTS
      },
      {
        context: { contextMode: "element_lab" },
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
          unsupportedOutputs: WALL_OUTPUTS
        },
        expectedTrace: {
          candidateKind: "needs_input_boundary",
          requiredInputs: [
            "sideALeafGroup",
            "cavity1DepthMm",
            "sideBLeafGroup",
            "frameBridgeClass",
            "supportTopology",
            "supportSpacingMm"
          ],
          requestedBasis: "element_lab",
          route: "wall",
          runtimeBasisId: null,
          selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
          supportBucket: "needs_input",
          supportedMetrics: []
        },
        expectedUnsupported: WALL_OUTPUTS,
        label: "wall flat double-leaf missing topology",
        layers: DOUBLE_LEAF_ABSORBED_STACK,
        targetOutputs: WALL_OUTPUTS
      },
      {
        context: RESILIENT_MISSING_SIDE_COUNT_CONTEXT,
        expectedBoundary: {
          missingPhysicalInputs: ["resilientBarSideCount"],
          origin: "needs_input",
          unsupportedOutputs: WALL_OUTPUTS
        },
        expectedTrace: {
          candidateKind: "needs_input_boundary",
          requiredInputs: ["resilientBarSideCount"],
          requestedBasis: "element_lab",
          route: "wall",
          runtimeBasisId: null,
          selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
          supportBucket: "needs_input",
          supportedMetrics: []
        },
        expectedUnsupported: WALL_OUTPUTS,
        label: "wall resilient bar missing side-count",
        layers: DOUBLE_LEAF_ABSORBED_STACK,
        targetOutputs: WALL_OUTPUTS
      },
      {
        context: { contextMode: "element_lab" },
        expectedBoundary: {
          missingPhysicalInputs: FLAT_MULTICAVITY_MISSING_INPUTS,
          origin: "needs_input",
          unsupportedOutputs: WALL_OUTPUTS
        },
        expectedTrace: {
          candidateKind: "needs_input_boundary",
          requiredInputs: [...FLAT_MULTICAVITY_MISSING_INPUTS],
          requestedBasis: "element_lab",
          route: "wall",
          runtimeBasisId: null,
          selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
          supportBucket: "needs_input",
          supportedMetrics: []
        },
        expectedUnsupported: WALL_OUTPUTS,
        label: "wall grouped multicavity missing topology",
        layers: FLAT_MULTICAVITY_UNGROUPED_STACK,
        targetOutputs: WALL_OUTPUTS
      },
      {
        context: COMPLETE_FIELD_CONTEXT,
        expectedTrace: {
          candidateKind: "field_building_adapter",
          requestedBasis: "field_apparent",
          route: "wall",
          runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
          selectedCandidateId: "wall.airborne_field_context.field_apparent_adapter",
          supportBucket: "field_adapter",
          supportedMetrics: ["R'w", "DnT,w"]
        },
        expectedUnsupported: [],
        expectedValues: [
          { metric: "R'w", value: 58 },
          { metric: "DnT,w", value: 59 }
        ],
        label: "wall complete field-apparent adapter",
        layers: LINED_MASSIVE_WALL,
        targetOutputs: WALL_FIELD_OUTPUTS
      },
      {
        context: PARTIAL_FIELD_CONTEXT,
        expectedBoundary: {
          missingPhysicalInputs: ["partitionAreaM2", "receivingRoomVolumeM3", "receivingRoomRt60S"],
          origin: "needs_input",
          unsupportedOutputs: WALL_FIELD_OUTPUTS
        },
        expectedTrace: {
          candidateKind: "needs_input_boundary",
          requestedBasis: "field_apparent",
          requiredInputs: ["partitionAreaM2", "receivingRoomVolumeM3", "receivingRoomRt60S"],
          route: "wall",
          runtimeBasisId: null,
          selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
          supportBucket: "needs_input",
          supportedMetrics: []
        },
        expectedUnsupported: WALL_FIELD_OUTPUTS,
        label: "wall partial field context needs input",
        layers: LINED_MASSIVE_WALL,
        targetOutputs: WALL_FIELD_OUTPUTS
      },
      {
        context: OPENING_BUILDING_CONTEXT,
        expectedBoundary: {
          origin: "unsupported",
          unsupportedOutputs: ["Rw", "STC", "R'w", "DnT,w"]
        },
        expectedTrace: {
          candidateKind: "basis_boundary",
          requestedBasis: "building_prediction",
          route: "wall",
          runtimeBasisId: null,
          selectedCandidateId: "generic.lab_field_building_basis_boundary",
          supportBucket: "basis_boundary",
          supportedMetrics: []
        },
        expectedUnsupported: ["Rw", "STC", "R'w", "DnT,w"],
        label: "wall unsupported opening building owner",
        layers: LINED_MASSIVE_WALL,
        targetOutputs: ["Rw", "STC", ...WALL_FIELD_OUTPUTS]
      }
    ] as const satisfies readonly WallV1AcceptanceCase[];

    for (const testCase of matrix) {
      expectWallV1AcceptanceCase(testCase);
    }
  });

  it("covers the Step 3 floor V1 answer matrix with basis-owned values or explicit stops", () => {
    const matrix = [
      {
        expectedSupported: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
        expectedTrace: {
          candidateKind: "exact_measured_override",
          route: "floor",
          runtimeBasisId: "open_measured_floor_system_exact_match",
          selectedCandidateId: "floor.exact_measured_floor_system.same_topology_metric_basis",
          supportBucket: "exact",
          supportedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]
        },
        expectedUnsupported: ["STC", "Ctr", "IIC"],
        expectedValues: [
          { metric: "Rw", value: 75 },
          { metric: "C", value: -3.1 },
          { metric: "Ln,w", value: 44 },
          { metric: "CI", value: 0 },
          { metric: "CI,50-2500", value: 3 },
          { metric: "Ln,w+CI", value: 44 }
        ],
        label: "floor exact measured same-topology metric scope",
        layers: EXACT_FLOOR_R5B_PACKAGE,
        targetOutputs: FLOOR_EXACT_MIXED_OUTPUTS
      },
      {
        exactImpactSource: EXACT_IMPACT_SOURCE_19,
        expectedSupported: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
        expectedTrace: {
          boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
          candidateKind: "exact_measured_override",
          requestedBasis: "element_lab",
          route: "floor",
          runtimeBasisId: EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS,
          selectedCandidateId: "floor.exact_impact_band_source.metric_basis",
          supportBucket: "exact",
          supportedMetrics: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]
        },
        expectedUnsupported: ["DeltaLw", "IIC"],
        expectedValues: [
          { metric: "Ln,w", value: 53 },
          { metric: "CI", value: -3 },
          { metric: "CI,50-2500", value: -1 },
          { metric: "Ln,w+CI", value: 50 }
        ],
        label: "floor exact ISO 717-2 impact-band metric scope",
        layers: EXACT_IMPACT_ASSEMBLY_FLOOR,
        targetOutputs: EXACT_IMPACT_LAB_OUTPUTS
      },
      {
        expectedSupported: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
        expectedTrace: {
          candidateKind: "similarity_anchor",
          route: "floor",
          runtimeBasisId: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
          selectedCandidateId: "floor.open_box_timber.package_transfer_similarity",
          supportBucket: "anchored_estimate",
          supportedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]
        },
        expectedUnsupported: ["Ctr", "IIC"],
        expectedValues: [
          { metric: "Rw", value: 66 },
          { metric: "C", value: -3.9 },
          { metric: "Ln,w", value: 50.8 },
          { metric: "CI", value: 1.3 },
          { metric: "CI,50-2500", value: 3.3 },
          { metric: "Ln,w+CI", value: 52 }
        ],
        label: "floor open-box timber package-transfer anchor",
        layers: DRY_GYPSUM_FIBER_SOURCE_ABSENT,
        targetOutputs: FLOOR_OUTPUTS
      },
      {
        expectedSupported: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"],
        expectedTrace: {
          candidateKind: "similarity_anchor",
          route: "floor",
          runtimeBasisId: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS,
          selectedCandidateId: "floor.open_web.supported_band_similarity",
          supportBucket: "anchored_estimate",
          supportedMetrics: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"]
        },
        expectedUnsupported: ["C", "CI,50-2500", "IIC"],
        expectedValues: [
          { metric: "Rw", value: 61.5 },
          { metric: "Ctr", value: -5.5 },
          { metric: "Ln,w", value: 61.5 },
          { metric: "CI", value: -1.5 },
          { metric: "Ln,w+CI", value: 60 }
        ],
        label: "floor open-web supported-band anchor",
        layers: SUPPORTED_BAND_PACKAGE,
        targetOutputs: FLOOR_OUTPUTS
      },
      {
        expectedSupported: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
        expectedTrace: {
          candidateKind: "source_absent_family_solver",
          route: "floor",
          runtimeBasisId: "broad_accuracy_floor_open_box_timber_raw_bare_source_absent_formula_corridor",
          selectedCandidateId: "floor.open_box_timber.raw_bare_source_absent",
          supportBucket: "source_absent_estimate",
          supportedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]
        },
        expectedUnsupported: ["IIC"],
        expectedValues: [
          { metric: "Rw", value: 42.3 },
          { metric: "C", value: -1.4 },
          { metric: "Ctr", value: -5.8 },
          { metric: "Ln,w", value: 88.2 },
          { metric: "CI", value: -1.1 },
          { metric: "CI,50-2500", value: 3.1 },
          { metric: "Ln,w+CI", value: 87.1 }
        ],
        label: "floor open-box raw-bare source-absent formula",
        layers: RAW_OPEN_BOX_TIMBER,
        targetOutputs: FLOOR_OUTPUTS
      },
      {
        expectedSupported: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
        expectedTrace: {
          candidateKind: "source_absent_family_solver",
          route: "floor",
          runtimeBasisId: "broad_accuracy_floor_open_web_raw_bare_source_absent_formula_corridor",
          selectedCandidateId: "floor.open_web.raw_bare_source_absent",
          supportBucket: "source_absent_estimate",
          supportedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]
        },
        expectedUnsupported: ["IIC"],
        expectedValues: [
          { metric: "Rw", value: 32 },
          { metric: "C", value: -2.2 },
          { metric: "Ctr", value: -7.8 },
          { metric: "Ln,w", value: 96 },
          { metric: "CI", value: 1.8 },
          { metric: "CI,50-2500", value: 5.2 },
          { metric: "Ln,w+CI", value: 97.8 }
        ],
        label: "floor open-web raw-bare source-absent formula",
        layers: RAW_OPEN_WEB_300,
        targetOutputs: FLOOR_OUTPUTS
      },
      {
        expectedSupported: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
        expectedTrace: {
          candidateKind: "source_absent_family_solver",
          route: "floor",
          runtimeBasisId: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS,
          selectedCandidateId: "floor.helper_only_timber_open_web.source_absent",
          supportBucket: "source_absent_estimate",
          supportedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]
        },
        expectedUnsupported: ["IIC"],
        expectedValues: [
          { metric: "Rw", value: 46.7 },
          { metric: "C", value: -1.7 },
          { metric: "Ctr", value: -7.9 },
          { metric: "Ln,w", value: 59.6 },
          { metric: "CI", value: 1 },
          { metric: "CI,50-2500", value: 4 },
          { metric: "Ln,w+CI", value: 60.6 }
        ],
        label: "floor helper-only source-absent formula",
        layers: HELPER_ONLY_OPEN_WEB,
        targetOutputs: FLOOR_OUTPUTS
      },
      {
        expectedSupported: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"],
        expectedTrace: {
          candidateKind: "source_absent_family_solver",
          route: "floor",
          runtimeBasisId: "broad_accuracy_floor_open_web_direct_fixed_lining_direct_source_interpolation_formula_corridor",
          selectedCandidateId: "floor.open_web.direct_fixed_lining.source_absent",
          supportBucket: "source_absent_estimate",
          supportedMetrics: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"]
        },
        expectedUnsupported: ["C", "CI,50-2500", "IIC"],
        expectedValues: [
          { metric: "Rw", value: 51 },
          { metric: "Ctr", value: -7.5 },
          { metric: "Ln,w", value: 71 },
          { metric: "CI", value: -0.5 },
          { metric: "Ln,w+CI", value: 70.5 }
        ],
        label: "floor open-web direct-fixed formula",
        layers: DIRECT_FIXED_OPEN_WEB,
        targetOutputs: FLOOR_OUTPUTS
      },
      {
        expectedSupported: ["Ln,w", "DeltaLw"],
        expectedTrace: {
          boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
          candidateKind: "source_absent_family_solver",
          route: "floor",
          runtimeBasisId: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS,
          selectedCandidateId: "floor.heavy_concrete_floating_floor.lab_impact_formula",
          supportBucket: "source_absent_estimate",
          supportedMetrics: ["Ln,w", "DeltaLw"]
        },
        expectedUnsupported: ["IIC"],
        expectedValues: [
          { metric: "Ln,w", value: 50.3 },
          { metric: "DeltaLw", value: 24.3 }
        ],
        floorImpactContext: HEAVY_FLOATING_FLOOR_IMPACT_CONTEXT,
        label: "floor heavy floating lab-impact formula with ASTM parked",
        layers: HEAVY_FLOATING_FLOOR_STACK,
        targetOutputs: ["Ln,w", "DeltaLw", "IIC"]
      },
      {
        expectedBoundary: {
          missingPhysicalInputs: ["loadBasisKgM2"],
          origin: "needs_input",
          unsupportedOutputs: FLOOR_LAB_IMPACT_OUTPUTS
        },
        expectedSupported: [],
        expectedTrace: {
          candidateKind: "needs_input_boundary",
          requestedBasis: "element_lab",
          requiredInputs: ["loadBasisKgM2"],
          route: "floor",
          selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
          supportBucket: "needs_input",
          supportedMetrics: []
        },
        expectedUnsupported: FLOOR_LAB_IMPACT_OUTPUTS,
        label: "floor lab-impact formula missing load basis",
        layers: HEAVY_FLOATING_FLOOR_STACK,
        targetOutputs: FLOOR_LAB_IMPACT_OUTPUTS
      },
      {
        expectedBoundary: {
          missingPhysicalInputs: [
            "contextMode",
            "partitionAreaM2",
            "receivingRoomVolumeM3",
            "receivingRoomRt60S",
            "impactFieldContext"
          ],
          origin: "needs_input",
          unsupportedOutputs: FLOOR_FIELD_IMPACT_OUTPUTS
        },
        expectedSupported: [],
        expectedTrace: {
          candidateKind: "needs_input_boundary",
          requestedBasis: "field_apparent",
          requiredInputs: [
            "contextMode",
            "partitionAreaM2",
            "receivingRoomVolumeM3",
            "receivingRoomRt60S",
            "impactFieldContext"
          ],
          route: "floor",
          selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
          supportBucket: "needs_input",
          supportedMetrics: []
        },
        expectedUnsupported: FLOOR_FIELD_IMPACT_OUTPUTS,
        floorImpactContext: HEAVY_FLOATING_FLOOR_IMPACT_CONTEXT,
        label: "floor field-impact missing field context",
        layers: HEAVY_FLOATING_FLOOR_STACK,
        targetOutputs: FLOOR_FIELD_IMPACT_OUTPUTS
      },
      {
        expectedBoundary: {
          origin: "unsupported",
          unsupportedOutputs: FLOOR_ASTM_ONLY_OUTPUTS
        },
        expectedSupported: [],
        expectedTrace: {
          candidateKind: "unsupported_boundary",
          requestedBasis: "astm_rating_boundary",
          requiredInputs: [
            ...ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ASTM_IIC_AIIC_REQUIRED_INPUTS
          ],
          route: "floor",
          selectedCandidateId: "generic.astm_iic_aiic.unsupported_boundary",
          supportBucket: "unsupported",
          supportedMetrics: []
        },
        expectedUnsupported: FLOOR_ASTM_ONLY_OUTPUTS,
        label: "floor ASTM-only unsupported boundary",
        layers: EXACT_FLOOR_R5B_PACKAGE,
        targetOutputs: FLOOR_ASTM_ONLY_OUTPUTS
      }
    ] as const satisfies readonly FloorV1AcceptanceCase[];

    for (const testCase of matrix) {
      expectFloorV1AcceptanceCase(testCase);
    }
  });

  it("keeps complete source-absent formula lanes as published calculator answers", () => {
    const singleLeaf = calculateAssembly(SINGLE_GYPSUM_BOARD, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const doubleLeaf = calculateAssembly(DOUBLE_LEAF_ABSORBED_STACK, {
      airborneContext: INDEPENDENT_ABSORBED_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const helperOnlyFloor = calculateAssembly(HELPER_ONLY_OPEN_WEB, {
      calculator: "dynamic",
      targetOutputs: FLOOR_OUTPUTS
    });

    expect(singleLeaf.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(singleLeaf.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      supportBucket: "source_absent_estimate",
      valuePins: expect.arrayContaining([{ metric: "Rw", value: 31 }])
    });
    expect(singleLeaf.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);

    expect(doubleLeaf.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(doubleLeaf.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      supportBucket: "source_absent_estimate",
      valuePins: expect.arrayContaining([
        { metric: "Rw", value: 45 },
        { metric: "STC", value: 45 },
        { metric: "C", value: -1 },
        { metric: "Ctr", value: -6.1 }
      ])
    });
    expect(doubleLeaf.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);

    expect(helperOnlyFloor.impact).toMatchObject({
      basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS,
      LnW: 59.6
    });
    expect(helperOnlyFloor.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "source_absent_family_solver",
      route: "floor",
      runtimeBasisId: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS,
      supportBucket: "source_absent_estimate"
    });
    expect(helperOnlyFloor.supportedTargetOutputs).toEqual([
      "Rw",
      "C",
      "Ctr",
      "Ln,w",
      "CI",
      "CI,50-2500",
      "Ln,w+CI"
    ]);
    expect(helperOnlyFloor.unsupportedTargetOutputs).toEqual(["IIC"]);
  });

  it("keeps floor anchor and field-adapter traces scoped to the outputs actually published", () => {
    const packageTransfer = calculateAssembly(DRY_GYPSUM_FIBER_SOURCE_ABSENT, {
      calculator: "dynamic",
      targetOutputs: [
        "Rw",
        "C",
        "Ctr",
        "R'w",
        "DnT,w",
        "Ln,w",
        "CI",
        "CI,50-2500",
        "Ln,w+CI",
        "L'n,w",
        "L'nT,w",
        "L'nT,50",
        "IIC"
      ]
    });
    const supportedBand = calculateAssembly(SUPPORTED_BAND_PACKAGE, {
      calculator: "dynamic",
      targetOutputs: FLOOR_OUTPUTS
    });
    const fieldAdapter = calculateAssembly(SUPPORTED_BAND_PACKAGE, {
      airborneContext: FLOOR_FIELD_AIRBORNE_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      targetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50", "IIC"]
    });

    expect(packageTransfer.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "similarity_anchor",
      runtimeBasisId: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
      selectedCandidateId: "floor.open_box_timber.package_transfer_similarity",
      supportBucket: "anchored_estimate",
      supportedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]
    });
    expect(packageTransfer.supportedTargetOutputs).toEqual([
      "Rw",
      "C",
      "Ln,w",
      "CI",
      "CI,50-2500",
      "Ln,w+CI"
    ]);
    expect(packageTransfer.unsupportedTargetOutputs).toEqual([
      "Ctr",
      "R'w",
      "DnT,w",
      "L'n,w",
      "L'nT,w",
      "L'nT,50",
      "IIC"
    ]);
    expect(packageTransfer.layerCombinationResolverTrace?.supportedMetrics).not.toContain("Ctr");
    expect(packageTransfer.layerCombinationResolverTrace?.supportedMetrics).not.toContain("L'n,w");
    expect(packageTransfer.layerCombinationResolverTrace?.valuePins).toEqual(
      expect.arrayContaining([
        { metric: "Rw", value: 66 },
        { metric: "C", value: -3.9 },
        { metric: "Ln,w", value: 50.8 },
        { metric: "CI", value: 1.3 },
        { metric: "CI,50-2500", value: 3.3 },
        { metric: "Ln,w+CI", value: 52 }
      ])
    );

    expect(supportedBand.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "similarity_anchor",
      runtimeBasisId: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS,
      selectedCandidateId: "floor.open_web.supported_band_similarity",
      supportBucket: "anchored_estimate",
      supportedMetrics: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"]
    });
    expect(supportedBand.supportedTargetOutputs).toEqual(["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"]);
    expect(supportedBand.unsupportedTargetOutputs).toEqual(["C", "CI,50-2500", "IIC"]);
    expect(supportedBand.layerCombinationResolverTrace?.valuePins).toEqual(
      expect.arrayContaining([
        { metric: "Rw", value: 61.5 },
        { metric: "Ctr", value: -5.5 },
        { metric: "Ln,w", value: 61.5 },
        { metric: "CI", value: -1.5 },
        { metric: "Ln,w+CI", value: 60 }
      ])
    );

    expect(fieldAdapter.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "field_building_adapter",
      requestedBasis: "field_apparent",
      runtimeBasisId: "source_absent_field_building_adapter_error_budget",
      selectedCandidateId: "floor.open_web.field_building_adapter.exact_anchor_continuation",
      supportBucket: "field_adapter",
      supportedMetrics: ["R'w", "DnT,w", "L'n,w", "L'nT,w", "L'nT,50"]
    });
    expect(fieldAdapter.supportedTargetOutputs).toEqual([
      "Rw",
      "R'w",
      "DnT,w",
      "Ln,w",
      "L'n,w",
      "L'nT,w",
      "L'nT,50"
    ]);
    expect(fieldAdapter.unsupportedTargetOutputs).toEqual(["IIC"]);
    expect(fieldAdapter.layerCombinationResolverTrace?.supportedMetrics).not.toContain("Rw");
    expect(fieldAdapter.layerCombinationResolverTrace?.supportedMetrics).not.toContain("Ln,w");
    expect(fieldAdapter.layerCombinationResolverTrace?.valuePins).toEqual(
      expect.arrayContaining([
        { metric: "R'w", value: 45 },
        { metric: "DnT,w", value: 48 },
        { metric: "L'n,w", value: 63.5 },
        { metric: "L'nT,w", value: 61.1 },
        { metric: "L'nT,50", value: 60 }
      ])
    );
  });

  it("lets exact measured wall rows win before formula missing-input prompts", () => {
    const result = calculateAssembly(EXACT_LSF_LAB_STACK, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(result.metrics.estimatedRwDb).toBe(55);
    expect(result.airborneBasis).toMatchObject({
      exactSourceId: "knauf_lab_416889_primary_2026",
      method: "verified_airborne_catalog_exact_match",
      origin: "measured_exact_full_stack"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_blocked_rockwool_exact_source",
      selectedOrigin: "measured_exact_full_stack"
    });
    expect(result.acousticAnswerBoundary).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual(["Rw"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "exact_measured_override",
      requiredInputs: [
        "route",
        "leafGrouping",
        "cavityGrouping",
        "metricBasis",
        "sourceAssemblyId"
      ],
      route: "wall",
      runtimeBasisId: "verified_airborne_exact_source",
      selectedCandidateId: "wall.exact_verified_airborne.same_leaf_schedule",
      supportBucket: "exact",
      supportedMetrics: ["Rw"],
      valuePins: [{ metric: "Rw", value: 55 }]
    });
    expect(result.layerCombinationResolverTrace?.surfaceDetail).toContain("selected exact measured row");

    const mixedMetrics = calculateAssembly(EXACT_LSF_LAB_STACK, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });

    expect(mixedMetrics.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_blocked_rockwool_exact_source",
      selectedOrigin: "measured_exact_full_stack"
    });
    expect(mixedMetrics.supportedTargetOutputs).toEqual(["Rw"]);
    expect(mixedMetrics.unsupportedTargetOutputs).toEqual(["STC", "C", "Ctr"]);
    expect(mixedMetrics.layerCombinationResolverTrace).toMatchObject({
      route: "wall",
      runtimeBasisId: "verified_airborne_exact_source",
      selectedCandidateId: "wall.exact_verified_airborne.same_leaf_schedule",
      supportBucket: "exact",
      supportedMetrics: ["Rw"],
      valuePins: [{ metric: "Rw", value: 55 }]
    });
    expect(mixedMetrics.warnings.some((warning) =>
      /reports Rw; DynEcho kept STC, C, Ctr out of the exact answer/i.test(warning)
    )).toBe(true);
  });

  it("keeps field exact source traces scoped to the measured field metric", () => {
    const result = calculateAssembly(EXACT_DNTAK_FIELD_STACK, {
      airborneContext: EXACT_DNTAK_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_PROXY_OUTPUTS
    });

    expect(result.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_blocked_rockwool_exact_source",
      selectedOrigin: "measured_exact_full_stack"
    });
    expect(result.airborneBasis).toMatchObject({
      exactSourceId: "knauf_w112_50_100_40mw_a_field_2026",
      method: "verified_airborne_catalog_exact_match",
      origin: "measured_exact_full_stack"
    });
    expect(result.supportedTargetOutputs).toEqual(["DnT,A", "DnT,A,k"]);
    expect(result.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      basis: "field_apparent",
      candidateKind: "exact_measured_override",
      requestedBasis: "field_apparent",
      route: "wall",
      runtimeBasisId: "verified_airborne_exact_source",
      selectedCandidateId: "wall.exact_verified_airborne.same_leaf_schedule",
      supportBucket: "exact",
      supportedMetrics: ["DnT,A", "DnT,A,k"],
      valuePins: [
        { metric: "DnT,A", value: 43 },
        { metric: "DnT,A,k", value: 43 }
      ]
    });
    expect(result.layerCombinationResolverTrace?.supportedMetrics).not.toContain("Rw");
    expect(result.layerCombinationResolverTrace?.valuePins).not.toContainEqual({ metric: "Rw", value: 42 });
    expect(result.warnings.some((warning) =>
      /reports DnT,A,k; DynEcho kept R'w, DnT,w out of the exact answer/i.test(warning)
    )).toBe(true);
  });

  it("keeps exact measured floor rows scoped to measured floor metrics", () => {
    const result = calculateAssembly(EXACT_FLOOR_R5B_PACKAGE, {
      calculator: "dynamic",
      targetOutputs: FLOOR_EXACT_MIXED_OUTPUTS
    });

    expect(result.floorSystemMatch?.system.id).toBe("tuas_r5b_open_box_timber_measured_2026");
    expect(result.floorSystemRatings).toMatchObject({
      Rw: 75,
      basis: "open_measured_floor_system_exact_match"
    });
    expect(result.impact).toMatchObject({
      basis: "open_measured_floor_system_exact_match",
      CI: 0,
      CI50_2500: 3,
      LnW: 44,
      LnWPlusCI: 44
    });
    expect(result.supportedTargetOutputs).toEqual([
      "Rw",
      "C",
      "Ln,w",
      "CI",
      "CI,50-2500",
      "Ln,w+CI"
    ]);
    expect(result.unsupportedTargetOutputs).toEqual(["STC", "Ctr", "IIC"]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "exact_measured_override",
      route: "floor",
      runtimeBasisId: "open_measured_floor_system_exact_match",
      selectedCandidateId: "floor.exact_measured_floor_system.same_topology_metric_basis",
      supportBucket: "exact",
      supportedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      valuePins: [
        { metric: "Rw", value: 75 },
        { metric: "C", value: -3.1 },
        { metric: "Ln,w", value: 44 },
        { metric: "CI", value: 0 },
        { metric: "CI,50-2500", value: 3 },
        { metric: "Ln,w+CI", value: 44 }
      ]
    });
    expect(result.layerCombinationResolverTrace?.supportedMetrics).not.toContain("STC");
    expect(result.layerCombinationResolverTrace?.supportedMetrics).not.toContain("IIC");
    expect(result.layerCombinationResolverTrace?.valuePins).not.toContainEqual({ metric: "STC", value: 56 });
    expect(result.warnings.some((warning) =>
      /Exact measured floor source .* reports Rw, C, Ln,w, CI, CI,50-2500, Ln,w\+CI; DynEcho kept STC out of the exact answer/i.test(warning)
    )).toBe(true);
  });

  it("keeps impact-only exact floor traces scoped to measured floor metrics", () => {
    const result = calculateImpactOnly(EXACT_FLOOR_R5B_PACKAGE, {
      targetOutputs: FLOOR_EXACT_MIXED_OUTPUTS
    });

    expect(result.floorSystemMatch?.system.id).toBe("tuas_r5b_open_box_timber_measured_2026");
    expect(result.floorSystemRatings).toMatchObject({
      Rw: 75,
      basis: "open_measured_floor_system_exact_match"
    });
    expect(result.impact).toMatchObject({
      basis: "open_measured_floor_system_exact_match",
      CI: 0,
      CI50_2500: 3,
      LnW: 44,
      LnWPlusCI: 44
    });
    expect(result.supportedTargetOutputs).toEqual([
      "Rw",
      "C",
      "Ln,w",
      "CI",
      "CI,50-2500",
      "Ln,w+CI"
    ]);
    expect(result.unsupportedTargetOutputs).toEqual(["STC", "Ctr", "IIC"]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "exact_measured_override",
      route: "floor",
      runtimeBasisId: "open_measured_floor_system_exact_match",
      selectedCandidateId: "floor.exact_measured_floor_system.same_topology_metric_basis",
      supportBucket: "exact",
      supportedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      valuePins: [
        { metric: "Rw", value: 75 },
        { metric: "C", value: -3.1 },
        { metric: "Ln,w", value: 44 },
        { metric: "CI", value: 0 },
        { metric: "CI,50-2500", value: 3 },
        { metric: "Ln,w+CI", value: 44 }
      ]
    });
    expect(result.layerCombinationResolverTrace?.supportedMetrics).not.toContain("IIC");
    expect(result.layerCombinationResolverTrace?.supportedMetrics).not.toContain("R'w");
    expect(result.layerCombinationResolverTrace?.valuePins).not.toContainEqual({ metric: "IIC", value: 56 });
  });

  it("keeps exact impact-band sources on their ISO metric basis instead of ASTM aliases", () => {
    const impactOnlyLab = calculateImpactOnly([{ materialId: "air_gap", thicknessMm: 90 }], {
      exactImpactSource: EXACT_IMPACT_SOURCE_19,
      targetOutputs: EXACT_IMPACT_LAB_OUTPUTS
    });
    const assemblyLab = calculateAssembly(EXACT_IMPACT_ASSEMBLY_FLOOR, {
      calculator: "dynamic",
      exactImpactSource: EXACT_IMPACT_SOURCE_19,
      targetOutputs: EXACT_IMPACT_LAB_OUTPUTS
    });
    const mixedAssemblyLab = calculateAssembly(EXACT_IMPACT_ASSEMBLY_FLOOR, {
      calculator: "dynamic",
      exactImpactSource: EXACT_IMPACT_SOURCE_19,
      targetOutputs: EXACT_IMPACT_MIXED_FLOOR_OUTPUTS
    });
    const impactOnlyField = calculateImpactOnly([{ materialId: "air_gap", thicknessMm: 90 }], {
      exactImpactSource: EXACT_FIELD_OCTAVE_SOURCE_5,
      targetOutputs: EXACT_IMPACT_FIELD_OUTPUTS
    });

    for (const result of [impactOnlyLab, assemblyLab]) {
      expect(result.impact).toMatchObject({
        basis: EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS,
        CI: -3,
        CI50_2500: -1,
        LnW: 53,
        LnWPlusCI: 50
      });
      expect(result.supportedTargetOutputs).toEqual(["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
      expect(result.unsupportedTargetOutputs).toEqual(["DeltaLw", "IIC"]);
      expect(result.layerCombinationResolverTrace).toMatchObject({
        basis: "element_lab",
        boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
        candidateKind: "exact_measured_override",
        requestedBasis: "element_lab",
        route: "floor",
        runtimeBasisId: EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS,
        selectedCandidateId: "floor.exact_impact_band_source.metric_basis",
        supportBucket: "exact",
        supportedMetrics: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
        valuePins: [
          { metric: "Ln,w", value: 53 },
          { metric: "CI", value: -3 },
          { metric: "CI,50-2500", value: -1 },
          { metric: "Ln,w+CI", value: 50 }
        ]
      });
      expect(result.layerCombinationResolverTrace?.supportedMetrics).not.toContain("IIC");
      expect(result.layerCombinationResolverTrace?.valuePins).not.toContainEqual({ metric: "IIC", value: 53 });
    }

    expect(impactOnlyField.impact).toMatchObject({
      basis: EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS,
      CI: -12,
      LnTA: 53.8,
      LPrimeNTw: 66
    });
    expect(impactOnlyField.supportedTargetOutputs).toEqual(["LnT,A", "L'nT,w", "CI"]);
    expect(impactOnlyField.unsupportedTargetOutputs).toEqual(["AIIC"]);
    expect(impactOnlyField.layerCombinationResolverTrace).toMatchObject({
      basis: "field_apparent",
      boundaryCandidateIds: ["generic.astm_iic_aiic.unsupported_boundary"],
      candidateKind: "exact_measured_override",
      requestedBasis: "field_apparent",
      route: "floor",
      runtimeBasisId: EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS,
      selectedCandidateId: "floor.exact_impact_band_source.metric_basis",
      supportBucket: "exact",
      supportedMetrics: ["LnT,A", "L'nT,w", "CI"],
      valuePins: expect.arrayContaining([
        { metric: "LnT,A", value: 53.8 },
        { metric: "L'nT,w", value: 66 },
        { metric: "CI", value: -12 }
      ])
    });
    expect(impactOnlyField.layerCombinationResolverTrace?.supportedMetrics).not.toContain("AIIC");
    expect(impactOnlyField.layerCombinationResolverTrace?.valuePins).not.toContainEqual({ metric: "AIIC", value: 66 });

    expect(mixedAssemblyLab.supportedTargetOutputs).toEqual(["Ln,w", "CI"]);
    expect(mixedAssemblyLab.unsupportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr", "IIC"]);
    expect(mixedAssemblyLab.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "exact_measured_override",
      route: "floor",
      runtimeBasisId: EXACT_IMPACT_SOURCE_BAND_CURVE_BASIS,
      selectedCandidateId: "floor.exact_impact_band_source.metric_basis",
      supportBucket: "exact",
      supportedMetrics: ["Ln,w", "CI"],
      valuePins: [
        { metric: "Ln,w", value: 53 },
        { metric: "CI", value: -3 }
      ]
    });
    expect(mixedAssemblyLab.layerCombinationResolverTrace?.surfaceDetail).toContain(
      "airborne companion outputs stay on their own calculation basis"
    );
    expect(mixedAssemblyLab.layerCombinationResolverTrace?.supportedMetrics).not.toContain("Rw");
    expect(mixedAssemblyLab.layerCombinationResolverTrace?.supportedMetrics).not.toContain("STC");
    expect(mixedAssemblyLab.layerCombinationResolverTrace?.supportedMetrics).not.toContain("Ctr");
    expect(mixedAssemblyLab.layerCombinationResolverTrace?.valuePins).not.toContainEqual({ metric: "Rw", value: 59 });
    expect(mixedAssemblyLab.layerCombinationResolverTrace?.valuePins).not.toContainEqual({ metric: "Ctr", value: -7.2 });
    expect(mixedAssemblyLab.warnings.some((warning) =>
      warning.includes(ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_OWNER_AUDIT_WARNING_PREFIX) &&
      /Rw, STC, C, Ctr/i.test(warning)
    )).toBe(true);
  });

  it("keeps pure floor ASTM IIC/AIIC requests on an unsupported answer boundary", () => {
    const assemblyExactFloor = calculateAssembly(EXACT_FLOOR_R5B_PACKAGE, {
      calculator: "dynamic",
      targetOutputs: FLOOR_ASTM_ONLY_OUTPUTS
    });
    const impactOnlyExactFloor = calculateImpactOnly(EXACT_FLOOR_R5B_PACKAGE, {
      targetOutputs: FLOOR_ASTM_ONLY_OUTPUTS
    });
    const impactOnlyExactBands = calculateImpactOnly([{ materialId: "air_gap", thicknessMm: 90 }], {
      exactImpactSource: EXACT_IMPACT_SOURCE_19,
      targetOutputs: FLOOR_ASTM_ONLY_OUTPUTS
    });

    for (const result of [assemblyExactFloor, impactOnlyExactFloor, impactOnlyExactBands]) {
      expect(result.acousticAnswerBoundary).toMatchObject({
        method: ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ASTM_IIC_AIIC_UNSUPPORTED_METHOD,
        missingPhysicalInputs: [],
        origin: "unsupported",
        requiredInputs: [
          ...ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ASTM_IIC_AIIC_REQUIRED_INPUTS
        ],
        route: "floor",
        unsupportedOutputs: [...FLOOR_ASTM_ONLY_OUTPUTS]
      });
      expect(result.supportedImpactOutputs).toEqual([]);
      expect(result.supportedTargetOutputs).toEqual([]);
      expect(result.unsupportedTargetOutputs).toEqual([...FLOOR_ASTM_ONLY_OUTPUTS]);
      expect(result.layerCombinationResolverTrace).toMatchObject({
        candidateKind: "unsupported_boundary",
        requestedBasis: "astm_rating_boundary",
        requiredInputs: [
          ...ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ASTM_IIC_AIIC_REQUIRED_INPUTS
        ],
        route: "floor",
        runtimeBasisId: null,
        selectedCandidateId: "generic.astm_iic_aiic.unsupported_boundary",
        supportBucket: "unsupported",
        supportedMetrics: [],
        valuePins: []
      });
      expect(result.layerCombinationResolverTrace?.surfaceDetail).toContain("Unsupported answer outputs");
      expect(result.warnings.some((warning) => /ASTM IIC\/AIIC need/i.test(warning))).toBe(true);
    }
  });

  it("parks pure floor field-impact requests until field context is supplied", () => {
    const assemblyExactFloor = calculateAssembly(EXACT_FLOOR_R5B_PACKAGE, {
      calculator: "dynamic",
      targetOutputs: FLOOR_FIELD_IMPACT_OUTPUTS
    });
    const impactOnlyExactFloor = calculateImpactOnly(EXACT_FLOOR_R5B_PACKAGE, {
      targetOutputs: FLOOR_FIELD_IMPACT_OUTPUTS
    });
    const impactOnlyExactBands = calculateImpactOnly([{ materialId: "air_gap", thicknessMm: 90 }], {
      exactImpactSource: EXACT_IMPACT_SOURCE_19,
      targetOutputs: FLOOR_FIELD_IMPACT_OUTPUTS
    });
    const mixedExactFloor = calculateAssembly(EXACT_FLOOR_R5B_PACKAGE, {
      calculator: "dynamic",
      targetOutputs: ["Ln,w", "L'n,w"]
    });

    expect(assemblyExactFloor.acousticAnswerBoundary).toMatchObject({
      method: ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_FIELD_IMPACT_NEEDS_INPUT_METHOD,
      missingPhysicalInputs: [
        "contextMode",
        "partitionAreaM2",
        "receivingRoomVolumeM3",
        "receivingRoomRt60S",
        "impactFieldContext"
      ],
      origin: "needs_input",
      route: "floor",
      unsupportedOutputs: [...FLOOR_FIELD_IMPACT_OUTPUTS]
    });
    expect(assemblyExactFloor.supportedTargetOutputs).toEqual([]);
    expect(assemblyExactFloor.unsupportedTargetOutputs).toEqual([...FLOOR_FIELD_IMPACT_OUTPUTS]);
    expect(assemblyExactFloor.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "field_apparent",
      requiredInputs: [
        "contextMode",
        "partitionAreaM2",
        "receivingRoomVolumeM3",
        "receivingRoomRt60S",
        "impactFieldContext"
      ],
      runtimeBasisId: null,
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportBucket: "needs_input",
      supportedMetrics: [],
      valuePins: []
    });

    for (const result of [impactOnlyExactFloor, impactOnlyExactBands]) {
      expect(result.acousticAnswerBoundary).toMatchObject({
        method: ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_FIELD_IMPACT_NEEDS_INPUT_METHOD,
        missingPhysicalInputs: ["impactFieldContext"],
        origin: "needs_input",
        route: "floor",
        unsupportedOutputs: [...FLOOR_FIELD_IMPACT_OUTPUTS]
      });
      expect(result.supportedTargetOutputs).toEqual([]);
      expect(result.unsupportedTargetOutputs).toEqual([...FLOOR_FIELD_IMPACT_OUTPUTS]);
      expect(result.layerCombinationResolverTrace).toMatchObject({
        requestedBasis: "field_apparent",
        requiredInputs: ["impactFieldContext"],
        runtimeBasisId: null,
        selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
        supportBucket: "needs_input",
        supportedMetrics: [],
        valuePins: []
      });
    }

    expect(mixedExactFloor.acousticAnswerBoundary).toBeUndefined();
    expect(mixedExactFloor.supportedTargetOutputs).toEqual(["Ln,w"]);
    expect(mixedExactFloor.unsupportedTargetOutputs).toEqual(["L'n,w"]);
    expect(mixedExactFloor.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: "floor.exact_measured_floor_system.same_topology_metric_basis",
      supportBucket: "exact",
      supportedMetrics: ["Ln,w"],
      valuePins: [{ metric: "Ln,w", value: 44 }]
    });
  });

  it("parks floor impact answers until required physical inputs are supplied", () => {
    const missingLoad = calculateAssembly(HEAVY_FLOATING_FLOOR_STACK, {
      calculator: "dynamic",
      targetOutputs: FLOOR_LAB_IMPACT_OUTPUTS
    });
    const missingFieldContext = calculateAssembly(HEAVY_FLOATING_FLOOR_STACK, {
      calculator: "dynamic",
      floorImpactContext: HEAVY_FLOATING_FLOOR_IMPACT_CONTEXT,
      targetOutputs: FLOOR_FIELD_IMPACT_OUTPUTS
    });

    expect(missingLoad.acousticAnswerBoundary).toMatchObject({
      method: ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_IMPACT_NEEDS_INPUT_METHOD,
      missingPhysicalInputs: ["loadBasisKgM2"],
      origin: "needs_input",
      requiredInputs: ["loadBasisKgM2"],
      route: "floor",
      unsupportedOutputs: ["Ln,w", "DeltaLw"]
    });
    expect(missingLoad.impact).toBeNull();
    expect(missingLoad.supportedTargetOutputs).toEqual([]);
    expect(missingLoad.unsupportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(missingLoad.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "element_lab",
      requiredInputs: ["loadBasisKgM2"],
      route: "floor",
      runtimeBasisId: null,
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportBucket: "needs_input",
      supportedMetrics: [],
      valuePins: []
    });
    expect(missingLoad.layerCombinationResolverTrace?.surfaceDetail).toContain("Missing physical inputs");

    expect(missingFieldContext.acousticAnswerBoundary).toMatchObject({
      method: ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_IMPACT_NEEDS_INPUT_METHOD,
      missingPhysicalInputs: [
        "contextMode",
        "partitionAreaM2",
        "receivingRoomVolumeM3",
        "receivingRoomRt60S",
        "impactFieldContext"
      ],
      origin: "needs_input",
      route: "floor",
      unsupportedOutputs: ["L'n,w", "L'nT,w"]
    });
    expect(missingFieldContext.impact).toBeNull();
    expect(missingFieldContext.supportedTargetOutputs).toEqual([]);
    expect(missingFieldContext.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w"]);
    expect(missingFieldContext.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "field_apparent",
      requiredInputs: [
        "contextMode",
        "partitionAreaM2",
        "receivingRoomVolumeM3",
        "receivingRoomRt60S",
        "impactFieldContext"
      ],
      route: "floor",
      runtimeBasisId: null,
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportBucket: "needs_input",
      supportedMetrics: [],
      valuePins: []
    });
  });

  it("does not publish wall values when the selected path is missing a physical input", () => {
    const result = calculateAssembly(DOUBLE_LEAF_ABSORBED_STACK, {
      airborneContext: RESILIENT_MISSING_SIDE_COUNT_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });

    expect(result.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input",
      selectedBasis: {
        missingPhysicalInputs: ["resilientBarSideCount"],
        origin: "needs_input"
      }
    });
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requiredInputs: ["resilientBarSideCount"],
      route: "wall",
      runtimeBasisId: null,
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportBucket: "needs_input",
      supportedMetrics: [],
      valuePins: []
    });
    expect(result.warnings.some((warning) => /Answer Engine V1 selected needs_input/i.test(warning))).toBe(true);
  });

  it("parks flat double-leaf-like wall stacks until topology fields are supplied", () => {
    const result = calculateAssembly(DOUBLE_LEAF_ABSORBED_STACK, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });

    expect(result.airborneBasis).toMatchObject({
      missingPhysicalInputs: [
        "sideALeafGroup",
        "cavity1DepthMm",
        "sideBLeafGroup",
        "frameBridgeClass",
        "supportTopology",
        "supportSpacingMm"
      ],
      origin: "needs_input"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requiredInputs: [
        "sideALeafGroup",
        "cavity1DepthMm",
        "sideBLeafGroup",
        "frameBridgeClass",
        "supportTopology",
        "supportSpacingMm"
      ],
      route: "wall",
      runtimeBasisId: null,
      supportBucket: "needs_input",
      valuePins: []
    });
    expect(result.layerCombinationResolverTrace?.surfaceDetail).toContain("Missing physical inputs");
  });

  it("parks flat multicavity wall answers until grouped topology fields are supplied", () => {
    const result = calculateAssembly(FLAT_MULTICAVITY_UNGROUPED_STACK, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });

    expect(result.airborneCandidateResolution).toMatchObject({
      inputCompletenessIds: ["gate_k_triple_leaf_multicavity_route_inputs"],
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(result.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: [...FLAT_MULTICAVITY_MISSING_INPUTS],
      origin: "needs_input",
      requiredInputs: [...FLAT_MULTICAVITY_MISSING_INPUTS],
      route: "wall",
      unsupportedOutputs: ["Rw", "STC", "C", "Ctr"]
    });
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      requiredInputs: [...FLAT_MULTICAVITY_MISSING_INPUTS],
      route: "wall",
      runtimeBasisId: null,
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportBucket: "needs_input",
      supportedMetrics: [],
      valuePins: []
    });
    expect(result.layerCombinationResolverTrace?.surfaceDetail).toContain("Missing physical inputs");
    expect(result.warnings.some((warning) => /Answer Engine V1 selected needs_input/i.test(warning))).toBe(true);
  });

  it("parks wall field-apparent answers until required room context is supplied", () => {
    const missingAllContext = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: PARTIAL_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const missingRt = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: PARTIAL_FIELD_CONTEXT_MISSING_RT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const completeField = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: COMPLETE_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });

    expect(missingAllContext.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["partitionAreaM2", "receivingRoomVolumeM3", "receivingRoomRt60S"],
      origin: "needs_input",
      requiredInputs: ["partitionAreaM2", "receivingRoomVolumeM3", "receivingRoomRt60S"],
      route: "wall",
      unsupportedOutputs: [...WALL_FIELD_OUTPUTS]
    });
    expect(missingAllContext.supportedTargetOutputs).toEqual([]);
    expect(missingAllContext.unsupportedTargetOutputs).toEqual([...WALL_FIELD_OUTPUTS]);
    expect(missingAllContext.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "field_apparent",
      requiredInputs: ["partitionAreaM2", "receivingRoomVolumeM3", "receivingRoomRt60S"],
      route: "wall",
      runtimeBasisId: null,
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportBucket: "needs_input",
      supportedMetrics: [],
      valuePins: []
    });

    expect(missingRt.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["receivingRoomRt60S"],
      origin: "needs_input",
      requiredInputs: ["receivingRoomRt60S"],
      route: "wall",
      unsupportedOutputs: [...WALL_FIELD_OUTPUTS]
    });
    expect(missingRt.supportedTargetOutputs).toEqual([]);
    expect(missingRt.unsupportedTargetOutputs).toEqual([...WALL_FIELD_OUTPUTS]);
    expect(missingRt.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "field_apparent",
      requiredInputs: ["receivingRoomRt60S"],
      route: "wall",
      runtimeBasisId: null,
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportBucket: "needs_input",
      supportedMetrics: [],
      valuePins: []
    });

    expect(completeField.acousticAnswerBoundary).toBeUndefined();
    expect(completeField.airborneBasis).toMatchObject({
      method: "gate_i_airborne_field_apparent_context_adapter_runtime",
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(completeField.supportedTargetOutputs).toEqual([...WALL_FIELD_OUTPUTS]);
    expect(completeField.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps wall field/building boundaries on the wall answer trace instead of floor artifacts", () => {
    const partialBuilding = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: PARTIAL_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const openingBuilding = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: OPENING_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC", ...WALL_FIELD_OUTPUTS]
    });

    expect(partialBuilding.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["receivingRoomVolumeM3", "receivingRoomRt60S"],
      origin: "needs_input",
      requiredInputs: ["receivingRoomVolumeM3", "receivingRoomRt60S"],
      route: "wall",
      unsupportedOutputs: [...WALL_FIELD_OUTPUTS]
    });
    expect(partialBuilding.supportedTargetOutputs).toEqual([]);
    expect(partialBuilding.unsupportedTargetOutputs).toEqual([...WALL_FIELD_OUTPUTS]);
    expect(partialBuilding.layerCombinationResolverTrace).toMatchObject({
      boundaryCandidateIds: ["generic.lab_field_building_basis_boundary"],
      requestedBasis: "building_prediction",
      requiredInputs: ["receivingRoomVolumeM3", "receivingRoomRt60S"],
      route: "wall",
      runtimeBasisId: null,
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportBucket: "needs_input",
      supportedMetrics: [],
      valuePins: []
    });

    expect(openingBuilding.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: [],
      origin: "unsupported",
      route: "wall",
      unsupportedOutputs: ["Rw", "STC", "R'w", "DnT,w"]
    });
    expect(openingBuilding.acousticAnswerBoundary?.requiredInputs).toContain(
      "ISO_12354_1_flanking_transmission_adapter_owner"
    );
    expect(openingBuilding.supportedTargetOutputs).toEqual([]);
    expect(openingBuilding.unsupportedTargetOutputs).toEqual(["Rw", "STC", "R'w", "DnT,w"]);
    expect(openingBuilding.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "building_prediction",
      route: "wall",
      runtimeBasisId: null,
      selectedCandidateId: "generic.lab_field_building_basis_boundary",
      supportBucket: "basis_boundary",
      supportedMetrics: [],
      valuePins: []
    });
    expect(openingBuilding.layerCombinationResolverTrace?.requiredInputs).toContain(
      "ISO_12354_1_flanking_transmission_adapter_owner"
    );
  });

  it("parks roleless helper-only floor-like stacks until floor roles are assigned", () => {
    const assembly = calculateAssembly(HELPER_ONLY_OPEN_WEB_ROLELESS, {
      calculator: "dynamic",
      targetOutputs: FLOOR_OUTPUTS
    });
    const impactOnly = calculateImpactOnly(HELPER_ONLY_OPEN_WEB_ROLELESS, {
      targetOutputs: FLOOR_OUTPUTS
    });

    for (const result of [assembly, impactOnly]) {
      expect(result.acousticAnswerBoundary).toMatchObject({
        method: ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ROLELESS_HELPER_ONLY_METHOD,
        missingPhysicalInputs: [
          ...ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ROLELESS_HELPER_ONLY_MISSING_INPUTS
        ],
        origin: "needs_input",
        requiredInputs: [
          ...ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ROLELESS_HELPER_ONLY_MISSING_INPUTS
        ],
        route: "floor",
        unsupportedOutputs: [...FLOOR_OUTPUTS]
      });
      expect(result.impact).toBeNull();
      expect(result.floorSystemEstimate).toBeNull();
      expect(result.floorSystemRatings).toBeNull();
      expect(result.supportedImpactOutputs).toEqual([]);
      expect(result.supportedTargetOutputs).toEqual([]);
      expect(result.unsupportedTargetOutputs).toEqual([...FLOOR_OUTPUTS]);
      expect(result.layerCombinationResolverTrace).toMatchObject({
        requiredInputs: [
          ...ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ROLELESS_HELPER_ONLY_MISSING_INPUTS
        ],
        route: "floor",
        runtimeBasisId: null,
        selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
        supportBucket: "needs_input",
        supportedMetrics: [],
        valuePins: []
      });
      expect(result.layerCombinationResolverTrace?.surfaceDetail).toContain("Missing physical inputs");
      expect(result.warnings.some((warning) =>
        /Floor roles needed before impact output promotion/i.test(warning)
      )).toBe(true);
    }
  });
});

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD } from "./dynamic-airborne-gate-h-lined-masonry-clt";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";
import { getDefaultMaterialCatalog } from "./material-catalog";

const WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["R'w", "Dn,w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const WALL_TOPOLOGY_INPUTS = new Set([
  "sideALeafGroup",
  "cavity1DepthMm",
  "sideBLeafGroup",
  "frameBridgeClass",
  "supportTopology",
  "supportSpacingMm"
]);

const FLAT_DOUBLE_LEAF_NEEDS_INPUT_METHOD =
  "acoustic_calculator_answer_engine_v1_flat_double_leaf_missing_topology";

const ROUTE_INPUT_CONTRACT_METHOD = "dynamic_calculator_route_input_contract_missing_physical_fields";

const SCREENING_METHOD = "screening_mass_law_curve_seed_v3";

const GYPSUM_THICKNESS_SWEEP_MM = [8, 12.5, 50, 75, 82.29, 82.3, 90, 100, 140, 150] as const;

const DENSE_BOARD_AUTO_REPRESENTATIVES = [
  { id: "gypsum_board_100", materialId: "gypsum_board", thicknessMm: 100 },
  { id: "acoustic_gypsum_board_75", materialId: "acoustic_gypsum_board", thicknessMm: 75 },
  { id: "silentboard_50", materialId: "silentboard", thicknessMm: 50 },
  { id: "security_board_100", materialId: "security_board", thicknessMm: 100 },
  { id: "diamond_board_75", materialId: "diamond_board", thicknessMm: 75 },
  { id: "fire_board_100", materialId: "fire_board", thicknessMm: 100 },
  { id: "cement_board_50", materialId: "cement_board", thicknessMm: 50 },
  { id: "mlv_50", materialId: "mlv", thicknessMm: 50 },
  { id: "bitumen_membrane_50", materialId: "bitumen_membrane", thicknessMm: 50 },
  { id: "osb_150", materialId: "osb", thicknessMm: 150 },
  { id: "plywood_150", materialId: "plywood", thicknessMm: 150 }
] as const;

const USER_REPORTED_LAST_LAYER_SUBSTITUTIONS = [
  { id: "gypsum_board_100", materialId: "gypsum_board", thicknessMm: 100 },
  { id: "acoustic_gypsum_board_100", materialId: "acoustic_gypsum_board", thicknessMm: 100 },
  { id: "silentboard_100", materialId: "silentboard", thicknessMm: 100 },
  { id: "security_board_100", materialId: "security_board", thicknessMm: 100 },
  { id: "diamond_board_100", materialId: "diamond_board", thicknessMm: 100 },
  { id: "cement_board_100", materialId: "cement_board", thicknessMm: 100 },
  { id: "mlv_50", materialId: "mlv", thicknessMm: 50 },
  { id: "bitumen_membrane_50", materialId: "bitumen_membrane", thicknessMm: 50 },
  { id: "osb_150", materialId: "osb", thicknessMm: 150 },
  { id: "plywood_150", materialId: "plywood", thicknessMm: 150 }
] as const;

const COMPLETE_INDEPENDENT_DOUBLE_LEAF_REPRESENTATIVES = [
  { id: "gypsum_board_100", materialId: "gypsum_board", thicknessMm: 100 },
  { id: "acoustic_gypsum_board_100", materialId: "acoustic_gypsum_board", thicknessMm: 100 },
  { id: "plywood_150", materialId: "plywood", thicknessMm: 150 }
] as const;

const MASSIVE_CORE_AUTO_CONTROLS = [
  {
    expectedMethod: GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD,
    expectedOrigin: "bounded_prediction",
    id: "concrete_100",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "concrete", thicknessMm: 100 }
    ] as const satisfies readonly LayerInput[]
  },
  {
    expectedMethod: GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD,
    expectedOrigin: "bounded_prediction",
    id: "aac_150",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "ytong_aac_d700", thicknessMm: 150 }
    ] as const satisfies readonly LayerInput[]
  },
  {
    expectedMethod: GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD,
    expectedOrigin: "bounded_prediction",
    id: "porotherm_100",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "porotherm_pls_100", thicknessMm: 100 }
    ] as const satisfies readonly LayerInput[]
  },
  {
    expectedMethod: SCREENING_METHOD,
    expectedOrigin: "screening_fallback",
    id: "clt_150_screening_posture",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "clt_panel", thicknessMm: 150 }
    ] as const satisfies readonly LayerInput[]
  }
] as const;

const DOUBLE_LEAF_MODE_ONLY_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  wallTopology: {
    topologyMode: "double_leaf_framed"
  }
};

const DOUBLE_LEAF_CAVITY_DEPTH_ONLY_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1DepthMm: 50,
    topologyMode: "double_leaf_framed"
  }
};

const DOUBLE_LEAF_CAVITY_TYPED_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    topologyMode: "double_leaf_framed"
  }
};

const FIELD_CAVITY_TYPED_CONTEXT: AirborneContext = {
  ...DOUBLE_LEAF_CAVITY_TYPED_CONTEXT,
  contextMode: "field_between_rooms"
};

const BUILDING_CAVITY_TYPED_CONTEXT: AirborneContext = {
  ...DOUBLE_LEAF_CAVITY_TYPED_CONTEXT,
  contextMode: "building_prediction"
};

const PARTIAL_DOUBLE_LEAF_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    topologyMode: "double_leaf_framed"
  }
};

const COMPLETE_INDEPENDENT_DOUBLE_LEAF_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab",
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
};

const EXPLICIT_LINED_MASSIVE_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "direct_fixed",
    topologyMode: "lined_massive_wall"
  }
};

function thickBoardStack(materialId: string, thicknessMm: number): readonly LayerInput[] {
  return [
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "rockwool", thicknessMm: 50 },
    { materialId, thicknessMm }
  ];
}

function mirroredThickBoardStack(materialId: string, thicknessMm: number): readonly LayerInput[] {
  return [
    { materialId, thicknessMm },
    { materialId: "rockwool", thicknessMm: 50 },
    { materialId: "gypsum_board", thicknessMm: 12.5 }
  ];
}

function calculateWall(layers: readonly LayerInput[], airborneContext?: AirborneContext) {
  return calculateWallWithOutputs(layers, WALL_OUTPUTS, airborneContext);
}

function calculateWallWithOutputs(
  layers: readonly LayerInput[],
  targetOutputs: readonly RequestedOutputId[],
  airborneContext?: AirborneContext
) {
  return calculateAssembly(layers, {
    airborneContext: airborneContext ?? { contextMode: "element_lab" },
    calculator: "dynamic",
    targetOutputs
  });
}

function missingPhysicalInputs(result: ReturnType<typeof calculateWall>): readonly string[] {
  return [...new Set([
    ...(result.airborneBasis?.missingPhysicalInputs ?? []),
    ...(result.acousticAnswerBoundary?.missingPhysicalInputs ?? [])
  ])];
}

function wouldWorkbenchShowWallTopologyInputs(result: ReturnType<typeof calculateWall>): boolean {
  return missingPhysicalInputs(result).some((field) => WALL_TOPOLOGY_INPUTS.has(field));
}

function expectFlatBoardNeedsInput(result: ReturnType<typeof calculateWall>): void {
  expect(result.dynamicAirborneTrace?.detectedFamily).toBe("double_leaf");
  expect(result.airborneCandidateResolution).toMatchObject({
    selectedCandidateId: "candidate_dynamic_needs_input",
    selectedOrigin: "needs_input"
  });
  expect(result.airborneBasis).toMatchObject({
    method: FLAT_DOUBLE_LEAF_NEEDS_INPUT_METHOD,
    origin: "needs_input"
  });
  expect(result.supportedTargetOutputs).toEqual([]);
  expect(result.unsupportedTargetOutputs).toEqual([...WALL_OUTPUTS]);
  expect(missingPhysicalInputs(result)).toEqual([
    "sideALeafGroup",
    "cavity1DepthMm",
    "sideBLeafGroup",
    "frameBridgeClass",
    "supportTopology",
    "supportSpacingMm"
  ]);
  expect(wouldWorkbenchShowWallTopologyInputs(result)).toBe(true);
}

function expectRouteInputNeedsInput(
  result: ReturnType<typeof calculateWall>,
  expectedMissingPhysicalInputs: readonly string[],
  expectedUnsupportedTargetOutputs: readonly RequestedOutputId[] = WALL_OUTPUTS
): void {
  expect(result.dynamicAirborneTrace?.detectedFamily).toBe("double_leaf");
  expect(result.airborneCandidateResolution).toMatchObject({
    selectedCandidateId: "candidate_dynamic_needs_input",
    selectedOrigin: "needs_input"
  });
  expect(result.airborneBasis).toMatchObject({
    method: ROUTE_INPUT_CONTRACT_METHOD,
    origin: "needs_input"
  });
  expect(result.supportedTargetOutputs).toEqual([]);
  expect(result.unsupportedTargetOutputs).toEqual([...expectedUnsupportedTargetOutputs]);
  expect(missingPhysicalInputs(result)).toEqual([...expectedMissingPhysicalInputs]);
  expect(wouldWorkbenchShowWallTopologyInputs(result)).toBe(true);
}

describe("post-V1 thick board Auto family-boundary safety", () => {
  it("keeps the threshold edge parked instead of crossing into a silent screening answer", () => {
    const belowThreshold = calculateWall(thickBoardStack("gypsum_board", 82.29));
    const atThreshold = calculateWall(thickBoardStack("gypsum_board", 82.3));

    expectFlatBoardNeedsInput(belowThreshold);
    expectFlatBoardNeedsInput(atThreshold);
  });

  it.each(GYPSUM_THICKNESS_SWEEP_MM)(
    "keeps topology inputs visible across the user-reported gypsum thickness sweep: %s mm",
    (thicknessMm) => {
      const result = calculateWall(thickBoardStack("gypsum_board", thicknessMm));

      expectFlatBoardNeedsInput(result);
      expect(result.airborneBasis?.method).not.toBe(SCREENING_METHOD);
    }
  );

  it.each(DENSE_BOARD_AUTO_REPRESENTATIVES)(
    "keeps generic thick board/panel/membrane Auto stack parked as needs_input: $id",
    ({ materialId, thicknessMm }) => {
      const materialExists = getDefaultMaterialCatalog().some((material) => material.id === materialId);
      expect(materialExists, `${materialId} must exist in the seed catalog for this safety contract`).toBe(true);

      const result = calculateWall(thickBoardStack(materialId, thicknessMm));

      expectFlatBoardNeedsInput(result);
      expect(result.airborneBasis?.method).not.toBe(SCREENING_METHOD);
    }
  );

  it.each(USER_REPORTED_LAST_LAYER_SUBSTITUTIONS)(
    "keeps topology inputs visible when the last layer is swapped to a high-mass board-like leaf: $id",
    ({ materialId, thicknessMm }) => {
      const materialExists = getDefaultMaterialCatalog().some((material) => material.id === materialId);
      expect(materialExists, `${materialId} must exist in the seed catalog for this safety contract`).toBe(true);

      const result = calculateWall(thickBoardStack(materialId, thicknessMm));

      expectFlatBoardNeedsInput(result);
      expect(result.airborneBasis?.method).not.toBe(SCREENING_METHOD);
    }
  );

  it.each(USER_REPORTED_LAST_LAYER_SUBSTITUTIONS)(
    "keeps mirrored high-mass board Auto stack parked instead of depending on leaf order: $id",
    ({ materialId, thicknessMm }) => {
      const result = calculateWall(mirroredThickBoardStack(materialId, thicknessMm));

      expectFlatBoardNeedsInput(result);
      expect(result.airborneBasis?.method).not.toBe(SCREENING_METHOD);
    }
  );

  it("keeps topology inputs visible after the user chooses double-leaf mode but before fields are complete", () => {
    const result = calculateWall(thickBoardStack("gypsum_board", 100), DOUBLE_LEAF_MODE_ONLY_CONTEXT);

    expectRouteInputNeedsInput(result, [
      "sideALeafGroup",
      "cavity1DepthMm",
      "sideBLeafGroup",
      "frameBridgeClass",
      "supportTopology",
      "supportSpacingMm"
    ]);
  });

  it("keeps topology inputs visible after the user types only cavity depth", () => {
    const result = calculateWall(thickBoardStack("gypsum_board", 100), DOUBLE_LEAF_CAVITY_DEPTH_ONLY_CONTEXT);

    expectRouteInputNeedsInput(result, [
      "sideALeafGroup",
      "sideBLeafGroup",
      "frameBridgeClass",
      "supportTopology",
      "supportSpacingMm"
    ]);
  });

  it("keeps topology inputs visible after the user types cavity depth, absorption, and fill", () => {
    const result = calculateWall(thickBoardStack("gypsum_board", 100), DOUBLE_LEAF_CAVITY_TYPED_CONTEXT);

    expectRouteInputNeedsInput(result, [
      "sideALeafGroup",
      "sideBLeafGroup",
      "frameBridgeClass",
      "supportTopology",
      "supportSpacingMm"
    ]);
  });

  it("does not convert a typed cavity plus acoustic gypsum board substitution into screening fallback", () => {
    const result = calculateWall(thickBoardStack("acoustic_gypsum_board", 100), DOUBLE_LEAF_CAVITY_TYPED_CONTEXT);

    expectRouteInputNeedsInput(result, [
      "sideALeafGroup",
      "sideBLeafGroup",
      "frameBridgeClass",
      "supportTopology",
      "supportSpacingMm"
    ]);
    expect(result.airborneBasis?.method).not.toBe(SCREENING_METHOD);
  });

  it("keeps typed-cavity field requests parked without publishing field outputs or screening fallback", () => {
    const result = calculateWallWithOutputs(
      thickBoardStack("gypsum_board", 100),
      FIELD_OUTPUTS,
      FIELD_CAVITY_TYPED_CONTEXT
    );

    expectRouteInputNeedsInput(result, [
      "sideALeafGroup",
      "sideBLeafGroup",
      "frameBridgeClass",
      "supportTopology",
      "supportSpacingMm",
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S"
    ], FIELD_OUTPUTS);
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(result.airborneBasis?.method).not.toBe(SCREENING_METHOD);
  });

  it("keeps typed-cavity building requests parked without publishing building outputs or screening fallback", () => {
    const result = calculateWallWithOutputs(
      thickBoardStack("gypsum_board", 100),
      FIELD_OUTPUTS,
      BUILDING_CAVITY_TYPED_CONTEXT
    );

    expectRouteInputNeedsInput(result, [
      "sideALeafGroup",
      "sideBLeafGroup",
      "frameBridgeClass",
      "supportTopology",
      "supportSpacingMm",
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S",
      "sourceRoomVolumeM3",
      "flankingJunctionClass",
      "conservativeFlankingAssumption",
      "junctionCouplingLengthM",
      "buildingPredictionOutputBasis"
    ], FIELD_OUTPUTS);
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(result.airborneBasis?.method).not.toBe(SCREENING_METHOD);
  });

  it.each([
    {
      context: { contextMode: "field_between_rooms" } satisfies AirborneContext,
      id: "field_between_rooms",
      missing: ["partitionAreaM2", "receivingRoomVolumeM3", "receivingRoomRt60S"]
    },
    {
      context: { contextMode: "building_prediction" } satisfies AirborneContext,
      id: "building_prediction",
      missing: [
        "partitionAreaM2",
        "receivingRoomVolumeM3",
        "receivingRoomRt60S",
        "sourceRoomVolumeM3",
        "flankingJunctionClass",
        "conservativeFlankingAssumption",
        "junctionCouplingLengthM",
        "buildingPredictionOutputBasis"
      ]
    }
  ])(
    "keeps thick-board Auto $id requests from publishing field/building answers",
    ({ context, missing }) => {
      const result = calculateWallWithOutputs(thickBoardStack("gypsum_board", 100), FIELD_OUTPUTS, context);

      expect(result.dynamicAirborneTrace?.detectedFamily).toBe("double_leaf");
      expect(result.airborneCandidateResolution).toMatchObject({
        selectedCandidateId: "candidate_dynamic_needs_input",
        selectedOrigin: "needs_input"
      });
      expect(result.airborneBasis).toMatchObject({
        method: ROUTE_INPUT_CONTRACT_METHOD,
        origin: "needs_input"
      });
      expect(result.supportedTargetOutputs).toEqual([]);
      expect(result.unsupportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
      expect(missingPhysicalInputs(result)).toEqual(missing);
      expect(result.airborneBasis?.method).not.toBe(SCREENING_METHOD);
    }
  );

  it("keeps partial topology parked on the remaining route-required support fields", () => {
    const result = calculateWall(thickBoardStack("gypsum_board", 100), PARTIAL_DOUBLE_LEAF_CONTEXT);

    expectRouteInputNeedsInput(result, [
      "frameBridgeClass",
      "supportTopology",
      "supportSpacingMm"
    ]);
  });

  it.each([82.3, 100, 150] as const)(
    "keeps role-owned gypsum topology parked on support fields at high thickness: %s mm",
    (thicknessMm) => {
      const result = calculateWall(thickBoardStack("gypsum_board", thicknessMm), PARTIAL_DOUBLE_LEAF_CONTEXT);

      expectRouteInputNeedsInput(result, [
        "frameBridgeClass",
        "supportTopology",
        "supportSpacingMm"
      ]);
    }
  );

  it.each(COMPLETE_INDEPENDENT_DOUBLE_LEAF_REPRESENTATIVES)(
    "keeps complete independent double-leaf topology on the owned framed formula corridor: $id",
    ({ materialId, thicknessMm }) => {
      const result = calculateWall(thickBoardStack(materialId, thicknessMm), COMPLETE_INDEPENDENT_DOUBLE_LEAF_CONTEXT);

      expect(result.airborneCandidateResolution).toMatchObject({
        selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
        selectedOrigin: "family_physics_prediction"
      });
      expect(result.airborneBasis).toMatchObject({
        method: "layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor",
        origin: "family_physics_prediction"
      });
      expect(result.supportedTargetOutputs).toEqual([...WALL_OUTPUTS]);
      expect(result.unsupportedTargetOutputs).toEqual([]);
      expect(missingPhysicalInputs(result)).toEqual([]);
      expect(wouldWorkbenchShowWallTopologyInputs(result)).toBe(false);
    }
  );

  it("keeps explicit lined-massive topology available as explicit user intent", () => {
    const result = calculateWall(thickBoardStack("gypsum_board", 100), EXPLICIT_LINED_MASSIVE_CONTEXT);

    expect(result.dynamicAirborneTrace?.detectedFamily).toBe("lined_massive_wall");
    expect(result.airborneBasis?.family).toBe("lined_massive_wall");
    expect(result.airborneBasis?.method).toBe(SCREENING_METHOD);
    expect(result.airborneCandidateResolution?.selectedOrigin).toBe("screening_fallback");
    expect(result.supportedTargetOutputs).toEqual([...WALL_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
  });

  it.each(MASSIVE_CORE_AUTO_CONTROLS)(
    "preserves true massive-core Auto posture: $id",
    ({ expectedMethod, expectedOrigin, layers }) => {
      const result = calculateWall(layers);

      expect(result.dynamicAirborneTrace?.detectedFamily).toBe("lined_massive_wall");
      expect(result.airborneCandidateResolution?.selectedOrigin).toBe(expectedOrigin);
      expect(result.airborneBasis?.origin).toBe(expectedOrigin);
      expect(result.airborneBasis?.method).toBe(expectedMethod);
      expect(result.supportedTargetOutputs).toEqual([...WALL_OUTPUTS]);
      expect(result.unsupportedTargetOutputs).toEqual([]);
      expect(missingPhysicalInputs(result)).toEqual([]);
    }
  );
});

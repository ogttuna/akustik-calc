import type { AirborneContext, LayerInput, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";
import { getDefaultMaterialCatalog } from "./material-catalog";
import {
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID
} from "./post-v1-wall-compatible-anchor-delta";

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const C_CTR_PAIR_OUTPUTS = ["C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const COMPATIBLE_ANCHOR_OWNED_LAB_REQUESTS: readonly {
  label: string;
  targetOutputs: readonly RequestedOutputId[];
}[] = [
  { label: "STC singleton", targetOutputs: ["STC"] },
  { label: "C singleton", targetOutputs: ["C"] },
  { label: "Ctr singleton", targetOutputs: ["Ctr"] },
  { label: "C+Ctr pair", targetOutputs: ["C", "Ctr"] },
  { label: "reverse Ctr+C pair", targetOutputs: ["Ctr", "C"] },
  { label: "Rw+STC", targetOutputs: ["Rw", "STC"] },
  { label: "Rw+C", targetOutputs: ["Rw", "C"] },
  { label: "Rw+Ctr", targetOutputs: ["Rw", "Ctr"] },
  { label: "Rw+C+Ctr", targetOutputs: ["Rw", "C", "Ctr"] },
  { label: "Rw+STC+C", targetOutputs: ["Rw", "STC", "C"] },
  { label: "Rw+STC+Ctr", targetOutputs: ["Rw", "STC", "Ctr"] },
  { label: "full Rw+STC+C+Ctr", targetOutputs: WALL_LAB_OUTPUTS }
];
const COMPATIBLE_ANCHOR_LAB_WITH_UNSUPPORTED_EXTRAS: readonly {
  label: string;
  supportedOutputs: readonly RequestedOutputId[];
  targetOutputs: readonly RequestedOutputId[];
  unsupportedOutputs: readonly RequestedOutputId[];
}[] = [
  {
    label: "C+Ctr plus unsupported impact alias",
    supportedOutputs: ["C", "Ctr"],
    targetOutputs: ["C", "Ctr", "IIC"],
    unsupportedOutputs: ["IIC"]
  },
  {
    label: "Rw+C+Ctr plus unsupported ASTM impact aliases",
    supportedOutputs: ["Rw", "C", "Ctr"],
    targetOutputs: ["Rw", "C", "Ctr", "IIC", "AIIC"],
    unsupportedOutputs: ["IIC", "AIIC"]
  },
  {
    label: "full lab companions plus unsupported impact alias",
    supportedOutputs: WALL_LAB_OUTPUTS,
    targetOutputs: ["Rw", "STC", "C", "Ctr", "IIC"],
    unsupportedOutputs: ["IIC"]
  }
];
const ADJACENT_UNOWNED_COMPANION_REQUESTS: readonly {
  label: string;
  targetOutputs: readonly RequestedOutputId[];
}[] = [
  { label: "STC+C without Rw", targetOutputs: ["STC", "C"] },
  { label: "STC+Ctr without Rw", targetOutputs: ["STC", "Ctr"] },
  { label: "STC+C+Ctr without Rw", targetOutputs: ["STC", "C", "Ctr"] }
];
const FIELD_BUILDING_WITH_LAB_COMPANIONS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = ["R'w", "Dn,w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const CUSTOM_PANEL_ID = "custom_companion_audit_panel_leaf";
const CUSTOM_ABSORBER_ID = "custom_companion_audit_porous_absorber";
const CUSTOM_DOUBLE_LEAF_STACK = [
  { materialId: CUSTOM_PANEL_ID, thicknessMm: 12.5 },
  { materialId: CUSTOM_ABSORBER_ID, thicknessMm: 90 },
  { materialId: CUSTOM_PANEL_ID, thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const CUSTOM_MATERIAL_CATALOG: readonly MaterialDefinition[] = [
  ...getDefaultMaterialCatalog(),
  {
    acoustic: {
      behavior: "panel_leaf",
      notes: [],
      propertySourceStatus: "user_supplied"
    },
    category: "finish",
    densityKgM3: 848,
    id: CUSTOM_PANEL_ID,
    name: "Custom Companion Audit Panel Leaf",
    tags: ["gypsum", "board", "custom"]
  },
  {
    acoustic: {
      absorberClass: "porous_absorptive",
      behavior: "porous_absorber",
      flowResistivityPaSM2: 15000,
      notes: [],
      propertySourceStatus: "user_supplied"
    },
    category: "insulation",
    densityKgM3: 45,
    id: CUSTOM_ABSORBER_ID,
    name: "Custom Companion Audit Porous Absorber",
    tags: ["porous", "rockwool", "mineral_wool", "custom"]
  }
] as const;

const CUSTOM_DOUBLE_LEAF_CONTEXT: AirborneContext = {
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

const EXACT_LSF_LAB_STACK = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 5 },
  { materialId: "glasswool", thicknessMm: 70 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  ...EXACT_LSF_LAB_STACK,
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const NON_KNAUF_ONE_SIDE_BOARD_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 5 },
  { materialId: "glasswool", thicknessMm: 70 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const EXACT_LSF_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "element_lab",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const EXACT_LSF_BUILDING_CONTEXT: AirborneContext = {
  ...EXACT_LSF_LAB_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  sourceRoomVolumeM3: 48
};

function expectedCompatibleAnchorMetricValue(output: RequestedOutputId): number {
  switch (output) {
    case "Rw":
    case "STC":
      return 59;
    case "C":
      return -1.1;
    case "Ctr":
      return -6;
    default:
      throw new Error(`Unexpected compatible anchor lab metric ${output}.`);
  }
}

describe("post-V1 companion metric completeness audit", () => {
  it("keeps owned lab companion metrics complete only on routes that own the requested basis", () => {
    const userMaterialLab = calculateAssembly(CUSTOM_DOUBLE_LEAF_STACK, {
      airborneContext: CUSTOM_DOUBLE_LEAF_CONTEXT,
      calculator: "dynamic",
      catalog: CUSTOM_MATERIAL_CATALOG,
      targetOutputs: WALL_LAB_OUTPUTS
    });
    expect(userMaterialLab.supportedTargetOutputs).toEqual([...WALL_LAB_OUTPUTS]);
    expect(userMaterialLab.unsupportedTargetOutputs).toEqual([]);
    expect(userMaterialLab.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 46,
      estimatedStc: 46
    });
    expect(userMaterialLab.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      valuePins: expect.arrayContaining([
        { metric: "Rw", value: 46 },
        { metric: "STC", value: 46 },
        { metric: "C", value: -1 },
        { metric: "Ctr", value: -6.1 }
      ])
    });
    expect(userMaterialLab.layerCombinationResolverTrace?.supportedMetrics).toEqual(
      expect.arrayContaining([...WALL_LAB_OUTPUTS])
    );

    const compatibleAnchorCAndCtr = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: C_CTR_PAIR_OUTPUTS
    });
    expect(compatibleAnchorCAndCtr.supportedTargetOutputs).toEqual(["C", "Ctr"]);
    expect(compatibleAnchorCAndCtr.unsupportedTargetOutputs).toEqual([]);
    expect(compatibleAnchorCAndCtr.metrics).toMatchObject({
      estimatedCDb: -1.1,
      estimatedCtrDb: -6
    });
    expect(compatibleAnchorCAndCtr.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["C", "Ctr"],
      valuePins: [
        { metric: "C", value: -1.1 },
        { metric: "Ctr", value: -6 }
      ]
    });
  });

  it("supports the owned compatible anchor-delta lab companion request-shape matrix", () => {
    for (const scenario of COMPATIBLE_ANCHOR_OWNED_LAB_REQUESTS) {
      const result = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
        airborneContext: EXACT_LSF_LAB_CONTEXT,
        calculator: "dynamic",
        targetOutputs: scenario.targetOutputs
      });
      const expectedPins = scenario.targetOutputs.map((output) => ({
        metric: output,
        value: expectedCompatibleAnchorMetricValue(output)
      }));

      expect(result.supportedTargetOutputs, scenario.label).toHaveLength(scenario.targetOutputs.length);
      expect(result.supportedTargetOutputs, scenario.label).toEqual(
        expect.arrayContaining([...scenario.targetOutputs])
      );
      expect(result.unsupportedTargetOutputs, scenario.label).toEqual([]);
      expect(result.layerCombinationResolverTrace, scenario.label).toMatchObject({
        runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
        selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID
      });
      expect(result.layerCombinationResolverTrace?.supportedMetrics, scenario.label).toHaveLength(
        scenario.targetOutputs.length
      );
      expect(result.layerCombinationResolverTrace?.supportedMetrics, scenario.label).toEqual(
        expect.arrayContaining([...scenario.targetOutputs])
      );
      expect(result.layerCombinationResolverTrace?.valuePins, scenario.label).toHaveLength(expectedPins.length);
      expect(result.layerCombinationResolverTrace?.valuePins, scenario.label).toEqual(
        expect.arrayContaining(expectedPins)
      );
      expect(result.metrics, scenario.label).toMatchObject({
        estimatedCDb: -1.1,
        estimatedCtrDb: -6,
        estimatedRwDb: 59,
        estimatedStc: 59
      });
    }
  });

  it("keeps owned lab companion subsets live when unrelated impact aliases are also requested", () => {
    for (const scenario of COMPATIBLE_ANCHOR_LAB_WITH_UNSUPPORTED_EXTRAS) {
      const result = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
        airborneContext: EXACT_LSF_LAB_CONTEXT,
        calculator: "dynamic",
        targetOutputs: scenario.targetOutputs
      });
      const expectedPins = scenario.supportedOutputs.map((output) => ({
        metric: output,
        value: expectedCompatibleAnchorMetricValue(output)
      }));

      expect(result.supportedTargetOutputs, scenario.label).toHaveLength(scenario.supportedOutputs.length);
      expect(result.supportedTargetOutputs, scenario.label).toEqual(
        expect.arrayContaining([...scenario.supportedOutputs])
      );
      expect(result.unsupportedTargetOutputs, scenario.label).toEqual([...scenario.unsupportedOutputs]);
      expect(result.layerCombinationResolverTrace, scenario.label).toMatchObject({
        runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
        selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID
      });
      expect(result.layerCombinationResolverTrace?.supportedMetrics, scenario.label).toHaveLength(
        scenario.supportedOutputs.length
      );
      expect(result.layerCombinationResolverTrace?.supportedMetrics, scenario.label).toEqual(
        expect.arrayContaining([...scenario.supportedOutputs])
      );
      expect(result.layerCombinationResolverTrace?.valuePins, scenario.label).toHaveLength(expectedPins.length);
      expect(result.layerCombinationResolverTrace?.valuePins, scenario.label).toEqual(
        expect.arrayContaining(expectedPins)
      );
    }
  });

  it("keeps adjacent compatible anchor-delta lab companion request shapes closed without Rw ownership", () => {
    for (const scenario of ADJACENT_UNOWNED_COMPANION_REQUESTS) {
      const result = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
        airborneContext: EXACT_LSF_LAB_CONTEXT,
        calculator: "dynamic",
        targetOutputs: scenario.targetOutputs
      });

      expect(result.supportedTargetOutputs, scenario.label).toEqual([]);
      expect(result.unsupportedTargetOutputs, scenario.label).toEqual([...scenario.targetOutputs]);
      expect(result.metrics, scenario.label).toMatchObject({
        estimatedCDb: -1.1,
        estimatedCtrDb: -6,
        estimatedStc: 59
      });
      expect(result.layerCombinationResolverTrace?.selectedCandidateId, scenario.label).not.toBe(
        POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID
      );
    }

    const buildingCAndCtr = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: C_CTR_PAIR_OUTPUTS
    });
    expect(buildingCAndCtr.supportedTargetOutputs).toEqual([]);
    expect(buildingCAndCtr.unsupportedTargetOutputs).toEqual(["C", "Ctr"]);
    expect(buildingCAndCtr.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID
    );

    const nonKnaufCAndCtr = calculateAssembly(NON_KNAUF_ONE_SIDE_BOARD_STACK, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: C_CTR_PAIR_OUTPUTS
    });
    expect(nonKnaufCAndCtr.supportedTargetOutputs).toEqual([]);
    expect(nonKnaufCAndCtr.unsupportedTargetOutputs).toEqual(["C", "Ctr"]);
    expect(nonKnaufCAndCtr.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID
    );
  });

  it("keeps lab companion aliases unsupported across field/building basis boundaries", () => {
    const compatibleBuildingMixed = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_BUILDING_WITH_LAB_COMPANIONS
    });

    expect(compatibleBuildingMixed.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(compatibleBuildingMixed.unsupportedTargetOutputs).toEqual(["STC", "C", "Ctr"]);
    expect(typeof compatibleBuildingMixed.metrics.estimatedCDb).toBe("number");
    expect(typeof compatibleBuildingMixed.metrics.estimatedCtrDb).toBe("number");
    expect(compatibleBuildingMixed.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID
    );
    expect(compatibleBuildingMixed.layerCombinationResolverTrace?.supportedMetrics).toEqual([...FIELD_BUILDING_OUTPUTS]);

    const compatibleBuildingMixedWithImpactAlias = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: [...FIELD_BUILDING_WITH_LAB_COMPANIONS, "IIC"]
    });
    expect(compatibleBuildingMixedWithImpactAlias.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(compatibleBuildingMixedWithImpactAlias.unsupportedTargetOutputs).toEqual(["STC", "C", "Ctr", "IIC"]);
    expect(compatibleBuildingMixedWithImpactAlias.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID
    );
    expect(compatibleBuildingMixedWithImpactAlias.layerCombinationResolverTrace?.supportedMetrics).toEqual([
      ...FIELD_BUILDING_OUTPUTS
    ]);
  });
});

import { calculateAssembly } from "@dynecho/engine";
import type { AssemblyCalculation, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  buildEstimatePayload,
  buildIllustrationLayers,
  buildOutputRows
} from "./calculator-workbench";
import { WORKBENCH_V2_DEFAULT_CONTEXT } from "./workbench-v2-project-snapshot";

const CUSTOM_PANEL_ID = "custom_panel_leaf_surface";
const CUSTOM_ABSORBER_ID = "custom_porous_absorber_surface";
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const customMaterials: readonly MaterialDefinition[] = [
  {
    acoustic: {
      behavior: "panel_leaf",
      notes: [],
      propertySourceStatus: "user_supplied"
    },
    category: "finish",
    densityKgM3: 848,
    id: CUSTOM_PANEL_ID,
    name: "Surface Custom Panel Leaf",
    tags: ["custom-workbench-material", "board", "panel_leaf"]
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
    name: "Surface Custom Porous Absorber",
    tags: ["custom-workbench-material", "insulation", "porous_absorber"]
  }
];

const customLayerStack = [
  { id: "surface-layer-1", materialId: CUSTOM_PANEL_ID, role: "side_a", thicknessMm: "12.5" },
  { id: "surface-layer-2", materialId: CUSTOM_ABSORBER_ID, role: "cavity", thicknessMm: "90" },
  { id: "surface-layer-3", materialId: CUSTOM_PANEL_ID, role: "side_b", thicknessMm: "12.5" }
] as const;

const explicitDoubleLeafContext = {
  ...WORKBENCH_V2_DEFAULT_CONTEXT,
  supportSpacingMm: "600",
  wallCavity1AbsorptionClass: "porous_absorptive" as const,
  wallCavity1DepthMm: "90",
  wallCavity1FillCoverage: "full" as const,
  wallCavity1LayerIndices: "2",
  wallSideALeafLayerIndices: "1",
  wallSideBLeafLayerIndices: "3",
  wallSupportTopology: "independent_frames" as const,
  wallTopologyMode: "double_leaf_framed" as const
};

const seededBuildingLayerStack = [
  { id: "surface-building-layer-1", materialId: "gypsum_board", role: "side_a", thicknessMm: "12.5" },
  { id: "surface-building-layer-2", materialId: "rockwool", role: "cavity", thicknessMm: "50" },
  { id: "surface-building-layer-3", materialId: "gypsum_board", role: "side_b", thicknessMm: "12.5" }
] as const;

const explicitBuildingContext = {
  ...WORKBENCH_V2_DEFAULT_CONTEXT,
  airborneMode: "building_prediction" as const,
  buildingPredictionOutputBasis: "apparent_and_standardized" as const,
  conservativeFlankingAssumption: "single_conservative_path" as const,
  flankingJunctionClass: "rigid_cross_junction" as const,
  junctionCouplingLengthM: "12",
  panelHeightMm: "2600",
  panelWidthMm: "3000",
  receivingRoomRt60S: "0.5",
  receivingRoomVolumeM3: "50",
  sourceRoomVolumeM3: "55",
  supportSpacingMm: "600",
  wallCavity1AbsorptionClass: "porous_absorptive" as const,
  wallCavity1DepthMm: "50",
  wallCavity1FillCoverage: "full" as const,
  wallCavity1LayerIndices: "2",
  wallSideALeafLayerIndices: "1",
  wallSideBLeafLayerIndices: "3",
  wallSupportTopology: "independent_frames" as const,
  wallTopologyMode: "double_leaf_framed" as const
};

const seededSingleLeafFieldLayerStack = [
  { id: "surface-field-layer-1", materialId: "concrete", role: "side_a", thicknessMm: "150" }
] as const;

const explicitFieldContext = {
  ...WORKBENCH_V2_DEFAULT_CONTEXT,
  airborneMode: "field_between_rooms" as const,
  fieldKDb: "2",
  panelHeightMm: "2600",
  panelWidthMm: "3000",
  receivingRoomRt60S: "0.5",
  receivingRoomVolumeM3: "50"
};

describe("material editor surface parity", () => {
  it("renders visible lab companion metrics instead of stale rating-surface values", () => {
    const result = {
      curve: {
        frequenciesHz: [100, 125, 160],
        transmissionLossDb: [40, 44, 48]
      },
      impact: null,
      layers: [],
      metrics: {
        airGapCount: 1,
        estimatedCDb: -1,
        estimatedCtrDb: -6.1,
        estimatedRwDb: 46,
        estimatedStc: 46,
        insulationCount: 1,
        method: "dynamic",
        surfaceMassKgM2: 21.2,
        totalThicknessMm: 115
      },
      ok: true,
      ratings: {
        astmE413: {
          STC: 40
        },
        iso717: {
          C: 0,
          Ctr: 0,
          Rw: 40,
          composite: "Rw 40 (0;0)",
          descriptor: "Rw"
        }
      },
      supportedTargetOutputs: [...LAB_OUTPUTS],
      targetOutputs: [...LAB_OUTPUTS],
      unsupportedTargetOutputs: [],
      warnings: []
    } as AssemblyCalculation;

    expect(buildOutputRows(result, LAB_OUTPUTS)).toEqual([
      { detail: "Calculated", label: "Rw", status: "live", value: "46 dB" },
      { detail: "Calculated", label: "STC", status: "live", value: "46 dB" },
      { detail: "Calculated", label: "C", status: "live", value: "-1 dB" },
      { detail: "Calculated", label: "Ctr", status: "live", value: "-6.1 dB" }
    ]);
  });

  it("does not display stale helper values outside the supported output bucket", () => {
    const result = {
      impact: null,
      layers: [],
      metrics: {
        airGapCount: 1,
        estimatedCDb: -1,
        estimatedCtrDb: -6,
        estimatedRwDb: 46,
        estimatedRwPrimeDb: 40,
        estimatedStc: 46,
        insulationCount: 1,
        method: "dynamic",
        surfaceMassKgM2: 21.2,
        totalThicknessMm: 115
      },
      ok: true,
      ratings: {
        astmE413: {
          STC: 46
        },
        field: {
          RwPrime: 40
        },
        iso717: {
          C: -1,
          Ctr: -6,
          Rw: 46
        }
      },
      supportedTargetOutputs: ["Rw"],
      targetOutputs: ["R'w", "STC"],
      unsupportedTargetOutputs: ["R'w"],
      warnings: []
    } as AssemblyCalculation;

    expect(buildOutputRows(result, ["R'w", "STC"])).toEqual([
      {
        detail: "Unsupported by the current route",
        label: "R'w",
        status: "unsupported",
        value: "--"
      },
      {
        detail: "No supported value for the selected output yet",
        label: "STC",
        status: "pending",
        value: "--"
      }
    ]);
  });

  it("uses human route-input labels for material-property needs-input rows", () => {
    const result = {
      acousticAnswerBoundary: {
        basis: "route_input_test",
        missingPhysicalInputs: ["flowResistivityPaSM2"],
        origin: "needs_input",
        status: "needs_input",
        unsupportedOutputs: ["Rw"]
      },
      impact: null,
      metrics: {
        airGapCount: 1,
        estimatedCDb: -1,
        estimatedCtrDb: -6,
        insulationCount: 1,
        method: "dynamic",
        surfaceMassKgM2: 21.2,
        totalThicknessMm: 115
      },
      ok: true,
      ratings: {
        astmE413: {},
        iso717: {}
      },
      supportedTargetOutputs: [],
      targetOutputs: ["Rw"],
      unsupportedTargetOutputs: ["Rw"],
      warnings: []
    } as unknown as AssemblyCalculation;

    expect(buildOutputRows(result, ["Rw"])).toEqual([
      { detail: "Needs Flow resistivity", label: "Rw", status: "needs_input", value: "--" }
    ]);
  });

  it("uses human route-input labels for grouped impact field-context needs-input rows", () => {
    const result = {
      acousticAnswerBoundary: {
        basis: "route_input_test",
        missingPhysicalInputs: ["impactFieldContext", "impactFieldContext.ci50_2500Db"],
        origin: "needs_input",
        status: "needs_input",
        unsupportedOutputs: ["L'nT,50"]
      },
      impact: null,
      metrics: {
        airGapCount: 0,
        insulationCount: 0,
        method: "dynamic",
        surfaceMassKgM2: 300,
        totalThicknessMm: 200
      },
      ok: true,
      ratings: {
        astmE413: {},
        iso717: {}
      },
      supportedTargetOutputs: [],
      targetOutputs: ["L'nT,50"],
      unsupportedTargetOutputs: ["L'nT,50"],
      warnings: []
    } as unknown as AssemblyCalculation;

    expect(buildOutputRows(result, ["L'nT,50"])).toEqual([
      { detail: "Needs Impact field context, CI,50-2500", label: "L'nT,50", status: "needs_input", value: "--" }
    ]);
  });

  it("keeps solver-active custom materials live from workbench payload through output rows", () => {
    const payload = buildEstimatePayload("wall", customLayerStack, LAB_OUTPUTS, explicitDoubleLeafContext, customMaterials);

    expect(payload).toMatchObject({
      airborneContext: {
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
      },
      calculator: "dynamic",
      layers: [
        { materialId: CUSTOM_PANEL_ID, thicknessMm: 12.5 },
        { materialId: CUSTOM_ABSORBER_ID, thicknessMm: 90 },
        { materialId: CUSTOM_PANEL_ID, thicknessMm: 12.5 }
      ],
      materialCatalog: customMaterials,
      targetOutputs: [...LAB_OUTPUTS]
    });

    const result = calculateAssembly(payload!.layers, {
      airborneContext: payload!.airborneContext,
      calculator: payload!.calculator,
      catalog: payload!.materialCatalog,
      targetOutputs: payload!.targetOutputs
    });
    const rows = buildOutputRows(result, LAB_OUTPUTS);

    expect(result.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(rows).toEqual([
      { detail: "Calculated", label: "Rw", status: "live", value: "46 dB" },
      { detail: "Calculated", label: "STC", status: "live", value: "46 dB" },
      { detail: "Calculated", label: "C", status: "live", value: "-1 dB" },
      { detail: "Calculated", label: "Ctr", status: "live", value: "-6.1 dB" }
    ]);
  });

  it("shows Rw when a complete building-prediction wall computes the direct lab companion", () => {
    const payload = buildEstimatePayload("wall", seededBuildingLayerStack, ["Rw"], explicitBuildingContext, []);

    expect(payload).toMatchObject({
      airborneContext: {
        buildingPredictionOutputBasis: "apparent_and_standardized",
        conservativeFlankingAssumption: "single_conservative_path",
        contextMode: "building_prediction",
        flankingJunctionClass: "rigid_cross_junction",
        junctionCouplingLengthM: 12,
        panelHeightMm: 2600,
        panelWidthMm: 3000,
        receivingRoomRt60S: 0.5,
        receivingRoomVolumeM3: 50,
        sourceRoomVolumeM3: 55,
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
      },
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    const result = calculateAssembly(payload!.layers, {
      airborneContext: payload!.airborneContext,
      calculator: payload!.calculator,
      targetOutputs: payload!.targetOutputs
    });
    const rows = buildOutputRows(result, ["Rw"]);

    expect(result.supportedTargetOutputs).toEqual(["Rw"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(rows).toEqual([
      { detail: "Calculated", label: "Rw", status: "live", value: "38 dB" }
    ]);
  });

  it("shows Rw when a complete field-between-rooms single-leaf wall computes the direct lab companion", () => {
    const payload = buildEstimatePayload("wall", seededSingleLeafFieldLayerStack, ["Rw"], explicitFieldContext, []);

    expect(payload).toMatchObject({
      airborneContext: {
        contextMode: "field_between_rooms",
        panelHeightMm: 2600,
        panelWidthMm: 3000,
        receivingRoomRt60S: 0.5,
        receivingRoomVolumeM3: 50
      },
      calculator: "dynamic",
      impactFieldContext: {
        fieldKDb: 2
      },
      targetOutputs: ["Rw"]
    });

    const result = calculateAssembly(payload!.layers, {
      airborneContext: payload!.airborneContext,
      calculator: payload!.calculator,
      targetOutputs: payload!.targetOutputs
    });
    const rows = buildOutputRows(result, ["Rw"]);

    expect(result.supportedTargetOutputs).toEqual(["Rw"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(rows).toEqual([
      { detail: "Calculated", label: "Rw", status: "live", value: "53 dB" }
    ]);
  });

  it("keeps custom material visual overrides tied to the illustration layers", () => {
    const materialById = new Map(customMaterials.map((material) => [material.id, material]));
    const illustrationLayers = buildIllustrationLayers(customLayerStack, "wall", "surface-layer-2", materialById, [
      {
        fillColor: "#123456",
        materialId: CUSTOM_ABSORBER_ID,
        patternColor: "#345678",
        sideColor: "#234567",
        strokeColor: "#456789",
        updatedAtIso: "2026-06-12T10:00:00.000Z"
      }
    ]);

    expect(illustrationLayers).toMatchObject([
      {
        active: false,
        label: "Surface Custom Panel Leaf",
        roleLabel: "Side A",
        visualStyle: undefined
      },
      {
        active: true,
        label: "Surface Custom Porous Absorber",
        roleLabel: "Cavity",
        visualStyle: {
          "--layer-fill": "#123456",
          "--layer-pattern": "#345678",
          "--layer-side": "#234567",
          "--layer-stroke": "#456789"
        }
      },
      {
        active: false,
        label: "Surface Custom Panel Leaf",
        roleLabel: "Side B",
        visualStyle: undefined
      }
    ]);
  });
});

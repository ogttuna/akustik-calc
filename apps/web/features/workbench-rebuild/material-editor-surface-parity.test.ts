import { calculateAssembly } from "@dynecho/engine";
import type { MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
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

describe("material editor surface parity", () => {
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

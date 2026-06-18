import type { MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  WORKBENCH_V2_CALCULATOR_ASSISTANT_TOOL_DEFINITIONS,
  previewDescribedLayerConfiguration,
  previewWorkbenchV2CalculatorSnapshot
} from "./workbench-v2-calculator-assistant";
import {
  WORKBENCH_V2_DEFAULT_CONTEXT,
  buildWorkbenchV2ProjectSnapshot
} from "./workbench-v2-project-snapshot";

const CUSTOM_PANEL_ID = "assistant_custom_panel_leaf";
const CUSTOM_ABSORBER_ID = "assistant_custom_porous_absorber";
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
    name: "Assistant Custom Panel Leaf",
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
    name: "Assistant Custom Porous Absorber",
    tags: ["custom-workbench-material", "insulation", "porous_absorber"]
  }
];

function wallSnapshot() {
  return buildWorkbenchV2ProjectSnapshot({
    context: {
      ...WORKBENCH_V2_DEFAULT_CONTEXT,
      supportSpacingMm: "600",
      wallCavity1AbsorptionClass: "porous_absorptive",
      wallCavity1DepthMm: "90",
      wallCavity1FillCoverage: "full",
      wallCavity1LayerIndices: "2",
      wallSideALeafLayerIndices: "1",
      wallSideBLeafLayerIndices: "3",
      wallSupportTopology: "independent_frames",
      wallTopologyMode: "double_leaf_framed"
    },
    customMaterials,
    id: "assistant-calculator-wall-snapshot",
    layers: [
      { id: "assistant-layer-1", materialId: CUSTOM_PANEL_ID, role: "side_a", thicknessMm: "12.5" },
      { id: "assistant-layer-2", materialId: CUSTOM_ABSORBER_ID, role: "cavity", thicknessMm: "90" },
      { id: "assistant-layer-3", materialId: CUSTOM_PANEL_ID, role: "side_b", thicknessMm: "12.5" }
    ],
    materialVisualOverrides: [],
    mode: "wall",
    name: "Assistant calculator wall preview",
    savedAtIso: "2026-06-17T08:00:00.000Z",
    selectedLayerId: "assistant-layer-2",
    selectedOutputs: LAB_OUTPUTS
  });
}

describe("workbench v2 calculator assistant", () => {
  it("declares preview-only non-mutating calculator access", () => {
    expect(WORKBENCH_V2_CALCULATOR_ASSISTANT_TOOL_DEFINITIONS).toEqual(expect.arrayContaining([
      expect.objectContaining({
        mutates: false,
        name: "preview_workbench_v2_calculator_snapshot",
        previewOnly: true,
        requiredInputs: ["snapshot"]
      }),
      expect.objectContaining({
        mutates: false,
        name: "preview_described_layer_configuration",
        previewOnly: true,
        requiredInputs: ["description"]
      })
    ]));
  });

  it("runs the existing calculator from a Workbench V2 snapshot without mutating state", () => {
    const result = previewWorkbenchV2CalculatorSnapshot({
      snapshot: wallSnapshot()
    });

    expect(result).toMatchObject({
      mutates: false,
      name: "preview_workbench_v2_calculator_snapshot",
      ok: true,
      previewOnly: true
    });
    expect(result.ok && result.preview.calculationSummary).toEqual({
      primaryOutput: "Rw",
      primaryValueLabel: "46 dB",
      selectedOutputs: [...LAB_OUTPUTS],
      status: "ready"
    });
    expect(result.ok && result.preview.outputRows).toEqual([
      { detail: "Calculated", label: "Rw", status: "live", value: "46 dB" },
      { detail: "Calculated", label: "STC", status: "live", value: "46 dB" },
      { detail: "Calculated", label: "C", status: "live", value: "-1 dB" },
      { detail: "Calculated", label: "Ctr", status: "live", value: "-6.1 dB" }
    ]);
    expect(result.ok && result.preview.tasks).toEqual([]);
    expect(result.ok && result.preview.estimatePayload).toMatchObject({
      airborneContext: {
        studSpacingMm: 600,
        wallTopology: {
          cavity1LayerIndices: [1],
          sideALeafLayerIndices: [0],
          sideBLeafLayerIndices: [2],
          topologyMode: "double_leaf_framed"
        }
      },
      calculator: "dynamic",
      targetOutputs: [...LAB_OUTPUTS]
    });
  });

  it("returns needs_input preview instead of calculating incomplete snapshots", () => {
    const snapshot = buildWorkbenchV2ProjectSnapshot({
      context: WORKBENCH_V2_DEFAULT_CONTEXT,
      customMaterials: [],
      id: "assistant-calculator-incomplete-snapshot",
      layers: [{ id: "assistant-layer-1", materialId: "gypsum_board", role: "side_a", thicknessMm: "" }],
      materialVisualOverrides: [],
      mode: "wall",
      name: "Incomplete assistant snapshot",
      savedAtIso: "2026-06-17T08:00:00.000Z",
      selectedLayerId: "assistant-layer-1",
      selectedOutputs: ["Rw"]
    });
    const result = previewWorkbenchV2CalculatorSnapshot({ snapshot });

    expect(result.ok && result.preview.calculationSummary).toEqual({
      primaryOutput: "Rw",
      primaryValueLabel: undefined,
      selectedOutputs: ["Rw"],
      status: "needs_input"
    });
    expect(result.ok && result.preview.estimatePayload).toBeUndefined();
    expect(result.ok && result.preview.tasks).toEqual([
      {
        detail: "Layer 1 needs a positive thickness before calculation.",
        id: "missing-thickness-assistant-layer-1",
        label: "Missing thickness",
        source: "workbench_snapshot"
      }
    ]);
  });

  it("rejects invalid snapshots and unsupported output overrides", () => {
    expect(previewWorkbenchV2CalculatorSnapshot({ snapshot: { id: "not-a-workbench-snapshot" } })).toMatchObject({
      code: "invalid_workbench_v2_calculator_snapshot",
      mutates: false,
      ok: false,
      previewOnly: true,
      statusCode: 400
    });
    expect(
      previewWorkbenchV2CalculatorSnapshot({
        snapshot: wallSnapshot(),
        targetOutputs: ["NISR"]
      })
    ).toMatchObject({
      code: "invalid_workbench_v2_calculator_outputs",
      mutates: false,
      ok: false,
      previewOnly: true,
      statusCode: 400
    });
  });

  it("parses a described wall layer configuration and runs the calculator", () => {
    const result = previewDescribedLayerConfiguration({
      description: "Calculate Rw and STC for 12.5 mm alcipan + 50 mm tasyunu + 100 mm beton"
    });

    expect(result).toMatchObject({
      mutates: false,
      name: "preview_described_layer_configuration",
      ok: true,
      previewOnly: true
    });
    expect(result.ok && result.preview.calculationSummary).toEqual({
      primaryOutput: "Rw",
      primaryValueLabel: "57 dB",
      selectedOutputs: ["Rw", "STC"],
      status: "ready"
    });
    expect(result.ok && result.preview.describedConfiguration).toMatchObject({
      layers: [
        { materialId: "gypsum_board", materialName: "Gypsum Board", role: "side_a", thicknessMm: 12.5 },
        { materialId: "rockwool", materialName: "Rock Wool", role: "cavity", thicknessMm: 50 },
        { materialId: "concrete", materialName: "Concrete", role: "side_b", thicknessMm: 100 }
      ],
      parser: "deterministic_wall_layer_description_v1"
    });
    expect(result.ok && result.preview.outputRows).toEqual([
      { detail: "Calculated", label: "Rw", status: "live", value: "57 dB" },
      { detail: "Calculated", label: "STC", status: "live", value: "57 dB" }
    ]);
    expect(result.ok && result.preview.estimatePayload).toMatchObject({
      calculator: "dynamic",
      layers: [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "rockwool", thicknessMm: 50 },
        { materialId: "concrete", thicknessMm: 100 }
      ],
      targetOutputs: ["Rw", "STC"]
    });
  });

  it("expands repeated described wall layers before running the calculator", () => {
    const result = previewDescribedLayerConfiguration({
      description: "Calculate Rw for 2x12.5 mm alcipan + 50 mm tasyunu + 100 mm beton"
    });

    expect(result).toMatchObject({
      mutates: false,
      name: "preview_described_layer_configuration",
      ok: true,
      previewOnly: true
    });
    expect(result.ok && result.preview.describedConfiguration).toMatchObject({
      layers: [
        { materialId: "gypsum_board", role: "side_a", thicknessMm: 12.5 },
        { materialId: "gypsum_board", role: "side_a", thicknessMm: 12.5 },
        { materialId: "rockwool", role: "cavity", thicknessMm: 50 },
        { materialId: "concrete", role: "side_b", thicknessMm: 100 }
      ],
      parser: "deterministic_wall_layer_description_v1"
    });
    expect(result.ok && result.preview.estimatePayload).toMatchObject({
      layers: [
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "gypsum_board", thicknessMm: 12.5 },
        { materialId: "rockwool", thicknessMm: 50 },
        { materialId: "concrete", thicknessMm: 100 }
      ],
      targetOutputs: ["Rw"]
    });
  });

  it("parses comma-separated and material-before-thickness wall descriptions", () => {
    const commaSeparated = previewDescribedLayerConfiguration({
      description: "Rw hesapla: 12,5 mm alcipan, 50 mm tas yunu, 100 mm beton"
    });
    const reversed = previewDescribedLayerConfiguration({
      description: "Calculate STC for gypsum board 12.5 mm + rockwool 50 mm + concrete 100 mm"
    });

    expect(commaSeparated.ok && commaSeparated.preview.describedConfiguration?.layers.map((layer) => layer.materialId)).toEqual([
      "gypsum_board",
      "rockwool",
      "concrete"
    ]);
    expect(reversed.ok && reversed.preview.describedConfiguration?.layers.map((layer) => layer.materialId)).toEqual([
      "gypsum_board",
      "rockwool",
      "concrete"
    ]);
    expect(reversed.ok && reversed.preview.calculationSummary.selectedOutputs).toEqual(["STC"]);
  });

  it("returns needs_input when a described material cannot be matched", () => {
    const result = previewDescribedLayerConfiguration({
      description: "Calculate Rw for 12.5 mm unknown magic board + 100 mm concrete"
    });

    expect(result).toMatchObject({
      mutates: false,
      name: "preview_described_layer_configuration",
      ok: true,
      preview: {
        calculationSummary: {
          selectedOutputs: ["Rw"],
          status: "needs_input"
        },
        tasks: [
          expect.objectContaining({
            label: "Layer description needs input",
            source: "described_layer_configuration"
          })
        ]
      },
      previewOnly: true
    });
    expect(result.ok && result.preview.estimatePayload).toBeUndefined();
  });
});

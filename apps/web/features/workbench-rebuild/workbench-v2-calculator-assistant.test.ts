import type { MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  WORKBENCH_V2_CALCULATOR_ASSISTANT_TOOL_DEFINITIONS,
  previewDescribedLayerConfiguration,
  previewReportAssistantLayerStackDraft,
  previewWorkbenchV2CalculatorSnapshot
} from "./workbench-v2-calculator-assistant";
import {
  WORKBENCH_V2_DEFAULT_CONTEXT,
  buildWorkbenchV2ProjectSnapshot
} from "./workbench-v2-project-snapshot";
import type { ReportAssistantLayerStackDraft } from "../workbench/report-assistant-layer-stack-draft";

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

function buildingRwSnapshot() {
  return buildWorkbenchV2ProjectSnapshot({
    context: {
      ...WORKBENCH_V2_DEFAULT_CONTEXT,
      airborneMode: "building_prediction",
      buildingPredictionOutputBasis: "apparent_and_standardized",
      conservativeFlankingAssumption: "single_conservative_path",
      flankingJunctionClass: "rigid_cross_junction",
      junctionCouplingLengthM: "12",
      panelHeightMm: "2600",
      panelWidthMm: "3000",
      receivingRoomRt60S: "0.5",
      receivingRoomVolumeM3: "50",
      sourceRoomVolumeM3: "55",
      supportSpacingMm: "600",
      wallCavity1AbsorptionClass: "porous_absorptive",
      wallCavity1DepthMm: "50",
      wallCavity1FillCoverage: "full",
      wallCavity1LayerIndices: "2",
      wallSideALeafLayerIndices: "1",
      wallSideBLeafLayerIndices: "3",
      wallSupportTopology: "independent_frames",
      wallTopologyMode: "double_leaf_framed"
    },
    customMaterials: [],
    id: "assistant-calculator-building-rw-snapshot",
    layers: [
      { id: "assistant-building-layer-1", materialId: "gypsum_board", role: "side_a", thicknessMm: "12.5" },
      { id: "assistant-building-layer-2", materialId: "rockwool", role: "cavity", thicknessMm: "50" },
      { id: "assistant-building-layer-3", materialId: "gypsum_board", role: "side_b", thicknessMm: "12.5" }
    ],
    materialVisualOverrides: [],
    mode: "wall",
    name: "Assistant calculator building Rw preview",
    savedAtIso: "2026-06-19T08:00:00.000Z",
    selectedLayerId: "assistant-building-layer-1",
    selectedOutputs: ["Rw"]
  });
}

function readyFloorImpactDraft(input: {
  floorImpactDraft?: ReportAssistantLayerStackDraft["floorImpactDraft"];
  requestedOutputs: readonly RequestedOutputId[];
}): ReportAssistantLayerStackDraft {
  return {
    assumptions: ["Floor impact physical inputs were provided explicitly."],
    contextSignature: `ctx.ready.floor.${input.requestedOutputs.join(".")}`,
    customMaterials: [],
    draftId: `draft.ready.floor.${input.requestedOutputs.join(".")}`,
    floorImpactDraft: input.floorImpactDraft ?? {
      dynamicStiffnessMNm3: 15,
      loadBasisKgM2: 200,
      requiredPhysicalInputs: ["dynamic_stiffness", "load_basis"]
    },
    layers: [
      {
        id: "floor-layer-1",
        materialId: "concrete",
        materialName: "Concrete",
        originalPhrase: "150 mm concrete",
        role: "base_structure",
        thicknessMm: 150
      },
      {
        id: "floor-layer-2",
        materialId: "geniemat_rst05",
        materialName: "GenieMat RST05",
        originalPhrase: "5 mm geniemat",
        role: "resilient_layer",
        thicknessMm: 5
      },
      {
        id: "floor-layer-3",
        materialId: "screed",
        materialName: "Screed",
        originalPhrase: "50 mm screed",
        role: "floating_screed",
        thicknessMm: 50
      }
    ],
    mode: "floor",
    originalPhrases: ["150 mm concrete", "5 mm geniemat", "50 mm screed"],
    requestedOutputs: input.requestedOutputs,
    source: "user_instruction",
    sourceInstruction: "structured ready floor impact draft",
    warnings: []
  };
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
      }),
      expect.objectContaining({
        mutates: false,
        name: "preview_layer_stack_draft",
        previewOnly: true,
        requiredInputs: ["draft"]
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

  it("shows Rw when a building-prediction preview has already calculated the direct lab companion", () => {
    const result = previewWorkbenchV2CalculatorSnapshot({
      snapshot: buildingRwSnapshot()
    });

    expect(result).toMatchObject({
      mutates: false,
      name: "preview_workbench_v2_calculator_snapshot",
      ok: true,
      previewOnly: true
    });
    expect(result.ok && result.preview.calculationSummary).toEqual({
      primaryOutput: "Rw",
      primaryValueLabel: "38 dB",
      selectedOutputs: ["Rw"],
      status: "ready"
    });
    expect(result.ok && result.preview.engineSummary).toMatchObject({
      supportedTargetOutputs: ["Rw"],
      unsupportedTargetOutputs: []
    });
    expect(result.ok && result.preview.outputRows).toEqual([
      { detail: "Calculated", label: "Rw", status: "live", value: "38 dB" }
    ]);
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
    expect(result.ok && result.preview.layerStackDraft).toMatchObject({
      draft: {
        layers: [
          { materialId: "gypsum_board", originalPhrase: "STC for 12.5 mm alcipan", role: "side_a", thicknessMm: 12.5 },
          { materialId: "rockwool", originalPhrase: "50 mm tasyunu", role: "cavity", thicknessMm: 50 },
          { materialId: "concrete", originalPhrase: "100 mm beton", role: "side_b", thicknessMm: 100 }
        ],
        lastCalculatorPreview: {
          routeStatus: "ready"
        },
        mode: "wall",
        requestedOutputs: ["Rw", "STC"],
        source: "user_instruction"
      },
      validation: {
        missingInputs: [],
        ok: true,
        status: "ready"
      }
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

  it("runs the calculator from a ready typed layer-stack draft without reparsing prose", () => {
    const result = previewReportAssistantLayerStackDraft({
      draft: {
        assumptions: ["Layer roles were provided through structured clarification answers."],
        contextSignature: "ctx.ready.draft",
        customMaterials: [],
        draftId: "draft.ready.wall",
        layers: [
          {
            id: "draft-layer-1",
            materialId: "gypsum_board",
            materialName: "Gypsum Board",
            originalPhrase: "12.5 mm gypsum board",
            role: "side_a",
            thicknessMm: 12.5
          },
          {
            id: "draft-layer-2",
            materialId: "rockwool",
            materialName: "Rockwool",
            originalPhrase: "50 mm rockwool",
            role: "cavity",
            thicknessMm: 50
          },
          {
            id: "draft-layer-3",
            materialId: "concrete",
            materialName: "Concrete",
            originalPhrase: "100 mm concrete",
            role: "side_b",
            thicknessMm: 100
          }
        ],
        mode: "wall",
        originalPhrases: ["12.5 mm gypsum board", "50 mm rockwool", "100 mm concrete"],
        requestedOutputs: ["Rw", "STC"],
        source: "user_instruction",
        sourceInstruction: "structured ready draft",
        wallTopologyDraft: {
          leafMapping: "not_required",
          topology: "single_leaf"
        },
        warnings: []
      }
    });

    expect(result).toMatchObject({
      mutates: false,
      name: "preview_layer_stack_draft",
      ok: true,
      previewOnly: true
    });
    expect(result.ok && result.preview.calculationSummary).toEqual({
      primaryOutput: "Rw",
      primaryValueLabel: "57 dB",
      selectedOutputs: ["Rw", "STC"],
      status: "ready"
    });
    expect(result.ok && result.preview.outputRows).toEqual([
      { detail: "Calculated", label: "Rw", status: "live", value: "57 dB" },
      { detail: "Calculated", label: "STC", status: "live", value: "57 dB" }
    ]);
    expect(result.ok && result.preview.layerStackDraft).toMatchObject({
      draft: {
        draftId: "draft.ready.wall",
        lastCalculatorPreview: {
          routeStatus: "ready",
          snapshotSignature: "ctx.ready.draft"
        }
      },
      validation: {
        missingInputs: [],
        ok: true,
        status: "ready"
      }
    });
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

  it("runs a complete owned floor impact draft through calculator preview for Ln,w", () => {
    const result = previewReportAssistantLayerStackDraft({
      draft: readyFloorImpactDraft({
        requestedOutputs: ["Ln,w"]
      })
    });

    expect(result).toMatchObject({
      mutates: false,
      name: "preview_layer_stack_draft",
      ok: true,
      previewOnly: true
    });
    expect(result.ok && result.preview.calculationSummary).toEqual({
      primaryOutput: "Ln,w",
      primaryValueLabel: "40.5 dB",
      selectedOutputs: ["Ln,w"],
      status: "ready"
    });
    expect(result.ok && result.preview.describedConfiguration).toMatchObject({
      parser: "deterministic_floor_layer_description_v1"
    });
    expect(result.ok && result.preview.outputRows).toEqual([
      { detail: "Calculated", label: "Ln,w", status: "live", value: "40.5 dB" }
    ]);
    expect(result.ok && result.preview.estimatePayload).toMatchObject({
      calculator: "dynamic",
      floorImpactContext: {
        loadBasisKgM2: 200,
        resilientLayerDynamicStiffnessMNm3: 15
      },
      layers: [
        { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
        { floorRole: "resilient_layer", materialId: "geniemat_rst05", thicknessMm: 5 },
        { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 }
      ],
      targetOutputs: ["Ln,w"]
    });
    expect(result.ok && result.preview.layerStackDraft).toMatchObject({
      draft: {
        lastCalculatorPreview: {
          routeStatus: "ready",
          snapshotSignature: "ctx.ready.floor.Ln,w"
        }
      },
      validation: {
        missingInputs: [],
        ok: true,
        status: "ready"
      }
    });
  });

  it("carries field impact room volume into the calculator payload and keeps L'nT,50 blocked on route-required CI input", () => {
    const result = previewReportAssistantLayerStackDraft({
      draft: readyFloorImpactDraft({
        floorImpactDraft: {
          dynamicStiffnessMNm3: 15,
          fieldLabContext: "field",
          loadBasisKgM2: 200,
          receivingRoomVolumeM3: 50,
          requiredPhysicalInputs: ["dynamic_stiffness", "load_basis", "field_lab_context", "room_volume"]
        },
        requestedOutputs: ["L'nT,50"]
      })
    });

    expect(result.ok && result.preview.describedConfiguration).toMatchObject({
      parser: "deterministic_floor_layer_description_v1"
    });
    expect(result.ok && result.preview.estimatePayload).toMatchObject({
      floorImpactContext: {
        loadBasisKgM2: 200,
        resilientLayerDynamicStiffnessMNm3: 15
      },
      impactFieldContext: {
        receivingRoomVolumeM3: 50
      },
      targetOutputs: ["L'nT,50"]
    });
    expect(result.ok && result.preview.calculationSummary).toEqual({
      primaryOutput: "L'nT,50",
      selectedOutputs: ["L'nT,50"],
      status: "needs_input"
    });
    expect(result.ok && result.preview.outputRows).toEqual([
      {
        detail: "Needs impactFieldContext, CI,50-2500",
        label: "L'nT,50",
        status: "needs_input",
        value: "--"
      }
    ]);
    expect(result.ok && result.preview.tasks.map((task) => task.id)).toEqual([
      "route-impactFieldContext",
      "route-impactFieldContext.ci50_2500Db"
    ]);
  });

  it("blocks AIIC and IIC numeric rows until required floor impact physical inputs are explicit", () => {
    const result = previewReportAssistantLayerStackDraft({
      draft: readyFloorImpactDraft({
        floorImpactDraft: {
          requiredPhysicalInputs: ["dynamic_stiffness", "load_basis", "target_metric_basis"],
          targetMetricBasis: "astm"
        },
        requestedOutputs: ["AIIC", "IIC"]
      })
    });

    expect(result.ok && result.preview.calculationSummary).toEqual({
      primaryOutput: "AIIC",
      selectedOutputs: ["AIIC", "IIC"],
      status: "needs_input"
    });
    expect(result.ok && result.preview.outputRows).toEqual([
      { detail: "Pending until the layer-stack draft is complete.", label: "AIIC", status: "pending", value: "--" },
      { detail: "Pending until the layer-stack draft is complete.", label: "IIC", status: "pending", value: "--" }
    ]);
    expect(result.ok && result.preview.tasks.map((task) => task.id)).toEqual([
      "assistant_floor_impact_dynamic_stiffness_missing",
      "assistant_floor_impact_load_basis_missing"
    ]);
    expect(result.ok && result.preview.estimatePayload).toBeUndefined();
  });

  it("keeps ASTM impact outputs unsupported instead of substituting an ISO impact value", () => {
    const result = previewReportAssistantLayerStackDraft({
      draft: readyFloorImpactDraft({
        floorImpactDraft: {
          dynamicStiffnessMNm3: 15,
          loadBasisKgM2: 200,
          requiredPhysicalInputs: ["dynamic_stiffness", "load_basis", "target_metric_basis"],
          targetMetricBasis: "astm"
        },
        requestedOutputs: ["AIIC"]
      })
    });

    expect(result.ok && result.preview.calculationSummary).toEqual({
      primaryOutput: "AIIC",
      selectedOutputs: ["AIIC"],
      status: "unsupported"
    });
    expect(result.ok && result.preview.outputRows).toEqual([
      { detail: "Unsupported for route", label: "AIIC", status: "unsupported", value: "--" }
    ]);
    expect(result.ok && result.preview.engineSummary?.acousticBoundary).toMatchObject({
      origin: "unsupported",
      route: "floor",
      unsupportedOutputs: ["AIIC"]
    });
  });

  it("does not alias mixed Rw/STC plus ASTM impact requests into a fabricated impact value", () => {
    const result = previewReportAssistantLayerStackDraft({
      draft: readyFloorImpactDraft({
        floorImpactDraft: {
          dynamicStiffnessMNm3: 15,
          loadBasisKgM2: 200,
          requiredPhysicalInputs: ["dynamic_stiffness", "load_basis", "target_metric_basis"],
          targetMetricBasis: "astm"
        },
        requestedOutputs: ["Rw", "STC", "AIIC"]
      })
    });

    expect(result.ok && result.preview.outputRows).toEqual([
      { detail: "Calculated", label: "Rw", status: "live", value: "58 dB" },
      { detail: "Calculated", label: "STC", status: "live", value: "59 dB" },
      { detail: "Unsupported for route", label: "AIIC", status: "unsupported", value: "--" }
    ]);
    expect(result.ok && result.preview.estimatePayload).toMatchObject({
      floorImpactContext: {
        loadBasisKgM2: 200,
        resilientLayerDynamicStiffnessMNm3: 15
      },
      targetOutputs: ["Rw", "STC", "AIIC"]
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
    expect(result.ok && result.preview.layerStackDraft?.validation).toMatchObject({
      ok: false,
      status: "needs_input"
    });
    expect(result.ok && result.preview.layerStackDraft?.validation.missingInputs.map((input) => input.code)).toEqual([
      "assistant_layer_material_missing",
      "assistant_layer_role_missing"
    ]);
  });

  it("parses described floor impact layers into a typed draft without numeric preview", () => {
    const result = previewDescribedLayerConfiguration({
      description: "120 mm concrete floor + 30 mm rockwool için Ln,w hesapla"
    });

    expect(result).toMatchObject({
      mutates: false,
      name: "preview_described_layer_configuration",
      ok: true,
      preview: {
        calculationSummary: {
          selectedOutputs: ["Ln,w"],
          status: "needs_input"
        },
        describedConfiguration: {
          layers: [
            { materialId: "concrete", role: "base_structure", thicknessMm: 120 },
            { materialId: "rockwool", role: "resilient_layer", thicknessMm: 30 }
          ],
          parser: "deterministic_floor_layer_description_v1"
        },
        outputRows: [
          {
            detail: "Pending until the described layer configuration is complete.",
            label: "Ln,w",
            status: "pending",
            value: "--"
          }
        ]
      },
      previewOnly: true
    });
    expect(result.ok && result.preview.estimatePayload).toBeUndefined();
    expect(result.ok && result.preview.layerStackDraft?.draft).toMatchObject({
      floorImpactDraft: {
        requiredPhysicalInputs: ["dynamic_stiffness", "load_basis"]
      },
      layers: [
        { materialId: "concrete", role: "base_structure", thicknessMm: 120 },
        { materialId: "rockwool", role: "resilient_layer", thicknessMm: 30 }
      ],
      mode: "floor",
      requestedOutputs: ["Ln,w"]
    });
    expect(result.ok && result.preview.layerStackDraft?.validation.missingInputs.map((input) => input.code)).toEqual([
      "assistant_floor_impact_dynamic_stiffness_missing",
      "assistant_floor_impact_load_basis_missing"
    ]);
  });

  it("asks for target metric basis for ASTM impact metrics instead of aliasing them", () => {
    const result = previewDescribedLayerConfiguration({
      description: "120 mm concrete slab + 5 mm geniemat + 50 mm screed için AIIC hesapla"
    });

    expect(result.ok && result.preview.calculationSummary).toEqual({
      primaryOutput: "AIIC",
      selectedOutputs: ["AIIC"],
      status: "needs_input"
    });
    expect(result.ok && result.preview.describedConfiguration?.layers.map((layer) => ({
      materialId: layer.materialId,
      role: layer.role,
      thicknessMm: layer.thicknessMm
    }))).toEqual([
      { materialId: "concrete", role: "base_structure", thicknessMm: 120 },
      { materialId: "geniemat_rst05", role: "resilient_layer", thicknessMm: 5 },
      { materialId: "screed", role: "floating_screed", thicknessMm: 50 }
    ]);
    expect(result.ok && result.preview.layerStackDraft?.validation.missingInputs.map((input) => input.code)).toEqual([
      "assistant_floor_impact_dynamic_stiffness_missing",
      "assistant_floor_impact_load_basis_missing",
      "assistant_floor_impact_target_metric_basis_missing"
    ]);
    expect(result.ok && result.preview.outputRows).toEqual([
      {
        detail: "Pending until the described layer configuration is complete.",
        label: "AIIC",
        status: "pending",
        value: "--"
      }
    ]);
  });

  it("maps ceiling board roles only when the user explicitly names a ceiling", () => {
    const ceiling = previewDescribedLayerConfiguration({
      description: "150 mm concrete floor + 13 mm gypsum ceiling board için L'nT,w hesapla"
    });
    const noCeiling = previewDescribedLayerConfiguration({
      description: "150 mm concrete floor + 13 mm gypsum board için L'nT,w hesapla"
    });

    expect(ceiling.ok && ceiling.preview.describedConfiguration?.layers.map((layer) => ({
      materialId: layer.materialId,
      role: layer.role
    }))).toEqual([
      { materialId: "concrete", role: "base_structure" },
      { materialId: "gypsum_board", role: "ceiling_board" }
    ]);
    expect(noCeiling.ok && noCeiling.preview.describedConfiguration?.layers.map((layer) => ({
      materialId: layer.materialId,
      role: layer.role
    }))).toEqual([
      { materialId: "concrete", role: "base_structure" },
      { materialId: "gypsum_board", role: "floor_covering" }
    ]);
    expect(ceiling.ok && ceiling.preview.layerStackDraft?.validation.missingInputs.map((input) => input.code)).toEqual([
      "assistant_floor_impact_dynamic_stiffness_missing",
      "assistant_floor_impact_load_basis_missing",
      "assistant_floor_impact_field_lab_context_missing",
      "assistant_floor_impact_room_volume_missing"
    ]);
  });

  it("keeps field impact room volume and field context as typed tasks", () => {
    const result = previewDescribedLayerConfiguration({
      description: "150 mm concrete floor için L'nT,50 hesapla"
    });

    expect(result.ok && result.preview.layerStackDraft?.draft.floorImpactDraft).toMatchObject({
      requiredPhysicalInputs: ["dynamic_stiffness", "load_basis", "field_lab_context", "room_volume"]
    });
    expect(result.ok && result.preview.layerStackDraft?.validation.missingInputs.map((input) => input.code)).toEqual([
      "assistant_floor_impact_dynamic_stiffness_missing",
      "assistant_floor_impact_load_basis_missing",
      "assistant_floor_impact_field_lab_context_missing",
      "assistant_floor_impact_room_volume_missing"
    ]);
  });

  it("returns unsupported for generic ASTM or ISO impact aliases without an explicit metric", () => {
    const result = previewDescribedLayerConfiguration({
      description: "ASTM impact için 120 mm concrete floor + 30 mm rockwool"
    });

    expect(result).toMatchObject({
      mutates: false,
      name: "preview_described_layer_configuration",
      ok: true,
      preview: {
        calculationSummary: {
          selectedOutputs: [],
          status: "unsupported"
        },
        outputRows: [],
        tasks: [
          {
            detail: "Generic ASTM/ISO impact basis wording is not a target metric. Ask for AIIC, IIC, Ln,w, L'nT,w, or another supported output explicitly.",
            id: "unsupported-generic-impact-metric-basis",
            label: "Unsupported generic impact metric alias",
            source: "described_layer_configuration"
          }
        ]
      },
      previewOnly: true
    });
    expect(result.ok && result.preview.estimatePayload).toBeUndefined();
    expect(result.ok && result.preview.layerStackDraft).toBeUndefined();
  });
});

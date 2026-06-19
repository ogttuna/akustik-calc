import { describe, expect, it } from "vitest";

import {
  buildReportAssistantLayerStackDraftEditorContinuation,
  getReportAssistantLayerStackDraftEditorStateFromQueryPayload,
  type ReportAssistantLayerStackDraftEditorState
} from "./report-assistant-layer-stack-draft-editor-state";
import {
  validateReportAssistantLayerStackDraft,
  type ReportAssistantLayerStackDraft
} from "./report-assistant-layer-stack-draft";

function incompleteWallDraft(): ReportAssistantLayerStackDraft {
  return {
    assumptions: ["Keep the parsed layer order."],
    contextSignature: "ctx.wall.draft",
    customMaterials: [],
    draftId: "draft.wall",
    layers: [
      {
        id: "layer-1",
        materialId: "gypsum_board",
        materialName: "Gypsum Board",
        originalPhrase: "12.5 mm gypsum board",
        role: "side_a",
        thicknessMm: 12.5
      },
      {
        id: "layer-2",
        originalPhrase: "mystery board",
        role: "unknown"
      }
    ],
    mode: "wall",
    originalPhrases: ["12.5 mm gypsum board", "mystery board"],
    requestedOutputs: [],
    source: "user_instruction",
    sourceInstruction: "12.5 mm gypsum board + mystery board hesapla",
    wallTopologyDraft: {
      leafMapping: "not_required",
      topology: "single_leaf"
    },
    warnings: []
  };
}

function incompleteFloorImpactDraft(): ReportAssistantLayerStackDraft {
  return {
    assumptions: [],
    contextSignature: "ctx.floor.draft",
    customMaterials: [],
    draftId: "draft.floor",
    floorImpactDraft: {
      requiredPhysicalInputs: ["dynamic_stiffness", "load_basis", "target_metric_basis"]
    },
    layers: [
      {
        id: "layer-1",
        materialId: "concrete",
        materialName: "Concrete",
        originalPhrase: "150 mm concrete",
        role: "slab",
        thicknessMm: 150
      },
      {
        id: "layer-2",
        materialId: "rockwool",
        materialName: "Rockwool",
        originalPhrase: "30 mm rockwool",
        role: "resilient_layer",
        thicknessMm: 30
      }
    ],
    mode: "floor",
    originalPhrases: ["150 mm concrete", "30 mm rockwool"],
    requestedOutputs: ["Ln,w"],
    source: "user_instruction",
    sourceInstruction: "150 mm concrete + 30 mm rockwool icin Ln,w hesapla",
    warnings: []
  };
}

function editorState(
  draft: ReportAssistantLayerStackDraft,
  assistantContextSignature = "report-context:active"
): ReportAssistantLayerStackDraftEditorState {
  return {
    assistantContextSignature,
    draft,
    validation: validateReportAssistantLayerStackDraft(draft)
  };
}

describe("report assistant layer-stack draft editor state", () => {
  it("extracts typed layer-stack draft state from query calculator preview payloads", () => {
    const draft = incompleteWallDraft();
    const state = getReportAssistantLayerStackDraftEditorStateFromQueryPayload({
      calculatorPreview: {
        mutates: false,
        name: "preview_described_layer_configuration",
        preview: {
          layerStackDraft: {
            draft,
            validation: validateReportAssistantLayerStackDraft(draft)
          }
        },
        previewOnly: true
      }
    }, "report-context:active");

    expect(state).toMatchObject({
      assistantContextSignature: "report-context:active",
      draft: {
        draftId: "draft.wall"
      },
      validation: {
        ok: false,
        status: "needs_input"
      }
    });
  });

  it("builds structured continuation answers only for unresolved layer fields", () => {
    const result = buildReportAssistantLayerStackDraftEditorContinuation({
      assistantContextSignature: "report-context:active",
      instruction: "Beton, 100 mm, side B, hedef Rw",
      state: editorState(incompleteWallDraft())
    });

    expect(result.ok).toBe(true);
    expect(result.ok && result.draftContinuation.answers).toEqual([
      {
        contextSignature: "ctx.wall.draft",
        draftId: "draft.wall",
        kind: "layer_material",
        layerId: "layer-2",
        materialId: "concrete",
        materialName: "Concrete"
      },
      {
        contextSignature: "ctx.wall.draft",
        draftId: "draft.wall",
        kind: "layer_thickness",
        layerId: "layer-2",
        thicknessMm: 100
      },
      {
        contextSignature: "ctx.wall.draft",
        draftId: "draft.wall",
        kind: "layer_role",
        layerId: "layer-2",
        role: "side_b"
      },
      {
        contextSignature: "ctx.wall.draft",
        draftId: "draft.wall",
        kind: "target_outputs",
        requestedOutputs: ["Rw"]
      }
    ]);
  });

  it("refuses to invent a material id from an unknown material answer", () => {
    const result = buildReportAssistantLayerStackDraftEditorContinuation({
      assistantContextSignature: "report-context:active",
      instruction: "mystery acoustic foam",
      state: editorState(incompleteWallDraft())
    });

    expect(result).toMatchObject({
      ok: false,
      questions: [
        "Which material should be used for \"mystery board\"?",
        "What is the mm thickness for \"mystery board\"?",
        "What role should \"mystery board\" use in the stack?",
        "Which outputs should be calculated? Example: Rw, STC, DnT,w, Ln,w."
      ]
    });
  });

  it("builds floor impact physical-input answers without calculator preview", () => {
    const result = buildReportAssistantLayerStackDraftEditorContinuation({
      assistantContextSignature: "report-context:active",
      instruction: "dynamic stiffness 15 MN/m3, load basis 100 kg/m2, ISO",
      state: editorState(incompleteFloorImpactDraft())
    });

    expect(result.ok).toBe(true);
    expect(result.ok && result.draftContinuation.answers).toEqual([
      {
        contextSignature: "ctx.floor.draft",
        draftId: "draft.floor",
        dynamicStiffnessMNm3: 15,
        kind: "floor_impact_dynamic_stiffness"
      },
      {
        contextSignature: "ctx.floor.draft",
        draftId: "draft.floor",
        kind: "floor_impact_load_basis",
        loadBasisKgM2: 100
      },
      {
        contextSignature: "ctx.floor.draft",
        draftId: "draft.floor",
        kind: "floor_impact_target_metric_basis",
        targetMetricBasis: "iso"
      }
    ]);
  });

  it("builds field impact context and room-volume answers without calculator preview", () => {
    const draft = incompleteFloorImpactDraft();
    const result = buildReportAssistantLayerStackDraftEditorContinuation({
      assistantContextSignature: "report-context:active",
      instruction: "field context, receiving room volume 65 m3",
      state: editorState({
        ...draft,
        floorImpactDraft: {
          requiredPhysicalInputs: ["field_lab_context", "room_volume"]
        },
        requestedOutputs: ["L'nT,50"]
      })
    });

    expect(result.ok).toBe(true);
    expect(result.ok && result.draftContinuation.answers).toEqual([
      {
        contextSignature: "ctx.floor.draft",
        draftId: "draft.floor",
        fieldLabContext: "field",
        kind: "floor_impact_field_context"
      },
      {
        contextSignature: "ctx.floor.draft",
        draftId: "draft.floor",
        kind: "floor_impact_room_volume",
        receivingRoomVolumeM3: 65
      }
    ]);
  });

  it("builds wall support-spacing answers for framed wall drafts", () => {
    const draft = incompleteWallDraft();
    const result = buildReportAssistantLayerStackDraftEditorContinuation({
      assistantContextSignature: "report-context:active",
      instruction: "stud spacing 600 mm",
      state: editorState({
        ...draft,
        layers: [
          {
            id: "layer-1",
            materialId: "gypsum_board",
            materialName: "Gypsum Board",
            originalPhrase: "12.5 mm gypsum board",
            role: "side_a",
            thicknessMm: 12.5
          },
          {
            id: "layer-2",
            materialId: "rockwool",
            materialName: "Rockwool",
            originalPhrase: "50 mm rockwool",
            role: "cavity",
            thicknessMm: 50
          },
          {
            id: "layer-3",
            materialId: "gypsum_board",
            materialName: "Gypsum Board",
            originalPhrase: "12.5 mm gypsum board",
            role: "side_b",
            thicknessMm: 12.5
          }
        ],
        requestedOutputs: ["Rw"],
        wallTopologyDraft: {
          leafMapping: "explicit",
          supportTopology: "independent_frames",
          topology: "double_leaf_framed"
        }
      })
    });

    expect(result.ok).toBe(true);
    expect(result.ok && result.draftContinuation.answers).toEqual([
      {
        contextSignature: "ctx.wall.draft",
        draftId: "draft.wall",
        kind: "wall_support_spacing",
        supportSpacingMm: 600
      }
    ]);
  });

  it("rejects locally stale active draft context before route submission", () => {
    const result = buildReportAssistantLayerStackDraftEditorContinuation({
      assistantContextSignature: "report-context:new",
      instruction: "Rw",
      state: editorState(incompleteWallDraft(), "report-context:old")
    });

    expect(result).toEqual({
      errors: ["Active layer-stack draft belongs to an older assistant context."],
      ok: false,
      questions: ["Restart the layer-stack draft from the current report context."]
    });
  });
});

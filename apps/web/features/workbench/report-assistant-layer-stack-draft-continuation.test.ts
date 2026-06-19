import { describe, expect, it } from "vitest";

import {
  mergeReportAssistantLayerStackDraftContinuation,
  type ReportAssistantLayerStackDraftContinuationAnswer
} from "./report-assistant-layer-stack-draft-continuation";
import type { ReportAssistantLayerStackDraft } from "./report-assistant-layer-stack-draft";

function incompleteWallDraft(overrides: Partial<ReportAssistantLayerStackDraft> = {}): ReportAssistantLayerStackDraft {
  return {
    assumptions: ["Keep previous user-described stack order."],
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
    warnings: [],
    ...overrides
  };
}

function answerBase(): Pick<ReportAssistantLayerStackDraftContinuationAnswer, "contextSignature" | "draftId"> {
  return {
    contextSignature: "ctx.wall.draft",
    draftId: "draft.wall"
  };
}

describe("report assistant layer-stack draft continuation", () => {
  it("merges structured layer answers into only unresolved fields", () => {
    const result = mergeReportAssistantLayerStackDraftContinuation({
      answers: [
        {
          ...answerBase(),
          kind: "layer_material",
          layerId: "layer-2",
          materialId: "concrete",
          materialName: "Concrete"
        },
        {
          ...answerBase(),
          kind: "layer_thickness",
          layerId: "layer-2",
          thicknessMm: 100
        },
        {
          ...answerBase(),
          kind: "layer_role",
          layerId: "layer-2",
          role: "side_b"
        },
        {
          ...answerBase(),
          kind: "target_outputs",
          requestedOutputs: ["Rw"]
        }
      ],
      currentContextSignature: "ctx.wall.draft",
      draft: incompleteWallDraft()
    });

    expect(result).toMatchObject({
      appliedAnswerKinds: ["layer_material", "layer_thickness", "layer_role", "target_outputs"],
      ok: true,
      status: "ready",
      validation: {
        missingInputs: [],
        ok: true,
        status: "ready"
      }
    });
    expect(result.ok && result.draft.layers[1]).toMatchObject({
      materialId: "concrete",
      materialName: "Concrete",
      originalPhrase: "mystery board",
      role: "side_b",
      thicknessMm: 100
    });
    expect(result.ok && result.draft.assumptions).toEqual(["Keep previous user-described stack order."]);
  });

  it("keeps partial answers as needs_input with a smaller task list", () => {
    const result = mergeReportAssistantLayerStackDraftContinuation({
      answers: [
        {
          ...answerBase(),
          kind: "layer_material",
          layerId: "layer-2",
          materialId: "concrete"
        }
      ],
      draft: incompleteWallDraft()
    });

    expect(result).toMatchObject({
      ok: true,
      status: "needs_input"
    });
    expect(result.ok && result.validation.missingInputs.map((input) => input.code)).toEqual([
      "assistant_layer_thickness_missing",
      "assistant_layer_role_missing",
      "assistant_target_outputs_missing"
    ]);
  });

  it("rejects stale context signatures before changing the draft", () => {
    const draft = incompleteWallDraft();
    const result = mergeReportAssistantLayerStackDraftContinuation({
      answers: [
        {
          ...answerBase(),
          kind: "target_outputs",
          requestedOutputs: ["Rw"]
        }
      ],
      currentContextSignature: "ctx.wall.changed",
      draft
    });

    expect(result).toMatchObject({
      draft,
      ok: false,
      status: "stale"
    });
    expect(result.ok).toBe(false);
  });

  it("rejects answers for a different draft id", () => {
    const result = mergeReportAssistantLayerStackDraftContinuation({
      answers: [
        {
          contextSignature: "ctx.wall.draft",
          draftId: "draft.other",
          kind: "target_outputs",
          requestedOutputs: ["Rw"]
        }
      ],
      draft: incompleteWallDraft()
    });

    expect(result).toMatchObject({
      ok: false,
      status: "invalid_answer"
    });
    expect(result.ok || result.errors).toEqual([
      'Answer draftId "draft.other" does not match active draft "draft.wall".'
    ]);
  });

  it("rejects attempts to mutate fields that are not unresolved", () => {
    const readyDraft = incompleteWallDraft({
      layers: [
        {
          id: "layer-1",
          materialId: "gypsum_board",
          materialName: "Gypsum Board",
          originalPhrase: "12.5 mm gypsum board",
          role: "side_a",
          thicknessMm: 12.5
        }
      ],
      requestedOutputs: ["Rw"]
    });

    const result = mergeReportAssistantLayerStackDraftContinuation({
      answers: [
        {
          ...answerBase(),
          kind: "layer_thickness",
          layerId: "layer-1",
          thicknessMm: 15
        }
      ],
      draft: readyDraft
    });

    expect(result).toMatchObject({
      ok: false,
      status: "invalid_answer"
    });
    expect(result.ok || result.errors).toEqual([
      'Answer kind "layer_thickness" does not match any unresolved draft input.'
    ]);
  });

  it("fills double-leaf wall topology mapping without touching layers", () => {
    const draft = incompleteWallDraft({
      layers: [
        {
          id: "layer-1",
          materialId: "gypsum_board",
          originalPhrase: "12.5 mm gypsum board",
          role: "side_a",
          thicknessMm: 12.5
        },
        {
          id: "layer-2",
          materialId: "rockwool",
          originalPhrase: "50 mm rockwool",
          role: "cavity",
          thicknessMm: 50
        },
        {
          id: "layer-3",
          materialId: "gypsum_board",
          originalPhrase: "12.5 mm gypsum board",
          role: "side_b",
          thicknessMm: 12.5
        }
      ],
      requestedOutputs: ["Rw"],
      wallTopologyDraft: {
        leafMapping: "missing",
        topology: "double_leaf_framed"
      }
    });

    const result = mergeReportAssistantLayerStackDraftContinuation({
      answers: [
        {
          ...answerBase(),
          kind: "wall_topology",
          wallTopologyDraft: {
            leafMapping: "explicit",
            supportTopology: "independent_frames",
            topology: "double_leaf_framed"
          }
        },
        {
          ...answerBase(),
          kind: "wall_support_spacing",
          supportSpacingMm: 600
        }
      ],
      draft
    });

    expect(result).toMatchObject({
      appliedAnswerKinds: ["wall_topology", "wall_support_spacing"],
      ok: true,
      status: "ready"
    });
    expect(result.ok && result.draft.wallTopologyDraft).toEqual({
      leafMapping: "explicit",
      supportSpacingMm: 600,
      supportTopology: "independent_frames",
      topology: "double_leaf_framed"
    });
  });

  it("merges floor impact physical inputs in one bounded answer batch", () => {
    const floorDraft: ReportAssistantLayerStackDraft = {
      assumptions: [],
      contextSignature: "ctx.floor.draft",
      customMaterials: [],
      draftId: "draft.floor",
      floorImpactDraft: {
        requiredPhysicalInputs: ["dynamic_stiffness", "load_basis", "target_metric_basis"]
      },
      layers: [
        {
          id: "floor-layer-1",
          materialId: "concrete",
          originalPhrase: "120 mm concrete slab",
          role: "slab",
          thicknessMm: 120
        }
      ],
      mode: "floor",
      originalPhrases: ["120 mm concrete slab"],
      requestedOutputs: ["Ln,w"],
      source: "user_instruction",
      sourceInstruction: "120 mm concrete floor için Ln,w hesapla",
      warnings: []
    };
    const base = {
      contextSignature: "ctx.floor.draft",
      draftId: "draft.floor"
    };
    const result = mergeReportAssistantLayerStackDraftContinuation({
      answers: [
        {
          ...base,
          dynamicStiffnessMNm3: 15,
          kind: "floor_impact_dynamic_stiffness"
        },
        {
          ...base,
          kind: "floor_impact_load_basis",
          loadBasisKgM2: 200
        },
        {
          ...base,
          kind: "floor_impact_target_metric_basis",
          targetMetricBasis: "iso"
        }
      ],
      currentContextSignature: "ctx.floor.draft",
      draft: floorDraft
    });

    expect(result).toMatchObject({
      appliedAnswerKinds: [
        "floor_impact_dynamic_stiffness",
        "floor_impact_load_basis",
        "floor_impact_target_metric_basis"
      ],
      ok: true,
      status: "ready",
      validation: {
        missingInputs: [],
        ok: true
      }
    });
    expect(result.ok && result.draft.floorImpactDraft).toMatchObject({
      dynamicStiffnessMNm3: 15,
      loadBasisKgM2: 200,
      targetMetricBasis: "iso"
    });
  });
});

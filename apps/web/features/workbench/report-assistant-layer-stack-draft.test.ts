import { describe, expect, it } from "vitest";

import {
  isReportAssistantLayerStackDraftReady,
  validateReportAssistantLayerStackDraft,
  type ReportAssistantLayerStackDraft
} from "./report-assistant-layer-stack-draft";

function readyWallDraft(overrides: Partial<ReportAssistantLayerStackDraft> = {}): ReportAssistantLayerStackDraft {
  return {
    assumptions: [],
    contextSignature: "ctx.wall.ready",
    customMaterials: [],
    draftId: "draft.wall.ready",
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
        materialName: "Rock Wool",
        originalPhrase: "50 mm rockwool",
        role: "cavity",
        thicknessMm: 50
      },
      {
        id: "layer-3",
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
    sourceInstruction: "Calculate Rw and STC for 12.5 mm gypsum board + 50 mm rockwool + 100 mm concrete",
    wallTopologyDraft: {
      leafMapping: "inferred",
      topology: "single_leaf"
    },
    warnings: [],
    ...overrides
  };
}

describe("report assistant layer-stack draft", () => {
  it("marks a complete wall stack draft as ready without calculator execution", () => {
    const draft = readyWallDraft();

    expect(validateReportAssistantLayerStackDraft(draft)).toEqual({
      clarifyingQuestions: [],
      missingInputs: [],
      ok: true,
      status: "ready"
    });
    expect(isReportAssistantLayerStackDraftReady(draft)).toBe(true);
  });

  it("preserves original phrases in material clarification questions", () => {
    const draft = readyWallDraft({
      layers: [
        {
          id: "layer-unknown",
          originalPhrase: "18 mm mystery acoustic board",
          role: "side_a",
          thicknessMm: 18
        }
      ],
      requestedOutputs: ["Rw"],
      wallTopologyDraft: {
        leafMapping: "not_required",
        topology: "single_leaf"
      }
    });

    const validation = validateReportAssistantLayerStackDraft(draft);

    expect(validation).toMatchObject({
      ok: false,
      status: "needs_input"
    });
    expect(validation.missingInputs).toEqual([
      {
        category: "material",
        code: "assistant_layer_material_missing",
        layerId: "layer-unknown",
        message: "Layer 1 has no normalized material id.",
        question: 'Which material should be used for "18 mm mystery acoustic board"?'
      }
    ]);
  });

  it("blocks incomplete layer and target-output drafts from numeric readiness", () => {
    const draft = readyWallDraft({
      layers: [
        {
          id: "layer-no-thickness",
          materialId: "gypsum_board",
          materialName: "Gypsum Board",
          originalPhrase: "gypsum board",
          role: "unknown"
        }
      ],
      requestedOutputs: [],
      wallTopologyDraft: {
        leafMapping: "not_required",
        topology: "single_leaf"
      }
    });

    const validation = validateReportAssistantLayerStackDraft(draft);

    expect(validation.ok).toBe(false);
    expect(validation.status).toBe("needs_input");
    expect(validation.missingInputs.map((input) => input.code)).toEqual([
      "assistant_layer_thickness_missing",
      "assistant_layer_role_missing",
      "assistant_target_outputs_missing"
    ]);
    expect(validation.clarifyingQuestions).toEqual([
      'What is the mm thickness for "gypsum board"?',
      'What role should "gypsum board" use in the stack?',
      "Which outputs should be calculated? Example: Rw, STC, DnT,w, Ln,w."
    ]);
  });

  it("requires explicit side/cavity mapping for double-leaf framed wall drafts", () => {
    const validation = validateReportAssistantLayerStackDraft(readyWallDraft({
      wallTopologyDraft: {
        leafMapping: "missing",
        supportTopology: "unknown",
        topology: "double_leaf_framed"
      }
    }));

    expect(validation.ok).toBe(false);
    expect(validation.missingInputs).toEqual([
      {
        category: "topology",
        code: "assistant_wall_leaf_mapping_missing",
        message: "Double-leaf wall draft has no explicit side/cavity layer mapping.",
        physicalInput: "wall_leaf_mapping",
        question: "Which layers are side A, cavity, and side B for the double-leaf wall?"
      }
    ]);
  });

  it("requires support spacing for double-leaf framed wall drafts with framed support", () => {
    const validation = validateReportAssistantLayerStackDraft(readyWallDraft({
      wallTopologyDraft: {
        leafMapping: "explicit",
        supportTopology: "independent_frames",
        topology: "double_leaf_framed"
      }
    }));

    expect(validation.ok).toBe(false);
    expect(validation.missingInputs).toEqual([
      {
        category: "physical_input",
        code: "assistant_wall_support_spacing_missing",
        message: "Double-leaf framed wall draft has no support spacing.",
        physicalInput: "wall_support_spacing",
        question: "What stud/support spacing in mm should the framed wall route use?"
      }
    ]);
  });

  it("captures route-required floor impact physical inputs before preview", () => {
    const floorDraft: ReportAssistantLayerStackDraft = {
      assumptions: [],
      contextSignature: "ctx.floor.missing-impact",
      customMaterials: [],
      draftId: "draft.floor.missing-impact",
      floorImpactDraft: {
        requiredPhysicalInputs: ["dynamic_stiffness", "load_basis", "target_metric_basis"]
      },
      layers: [
        {
          id: "floor-layer-1",
          materialId: "concrete",
          materialName: "Concrete",
          originalPhrase: "120 mm concrete slab",
          role: "slab",
          thicknessMm: 120
        }
      ],
      mode: "floor",
      originalPhrases: ["120 mm concrete slab"],
      requestedOutputs: ["Ln,w", "AIIC"],
      source: "user_instruction",
      sourceInstruction: "120 mm concrete floor için Ln,w ve AIIC hesapla",
      warnings: []
    };

    const validation = validateReportAssistantLayerStackDraft(floorDraft);

    expect(validation.ok).toBe(false);
    expect(validation.missingInputs.map((input) => input.code)).toEqual([
      "assistant_floor_impact_dynamic_stiffness_missing",
      "assistant_floor_impact_load_basis_missing",
      "assistant_floor_impact_target_metric_basis_missing"
    ]);
    expect(validation.clarifyingQuestions).toEqual([
      "What is the resilient layer dynamic stiffness in MN/m3?",
      "What load basis in kg/m2 should the floor impact route use?",
      "Which metric basis applies here: ISO or ASTM?"
    ]);
  });

  it("marks a floor impact draft ready only after required physical inputs are explicit", () => {
    const floorDraft: ReportAssistantLayerStackDraft = {
      assumptions: [],
      contextSignature: "ctx.floor.ready-impact",
      customMaterials: [],
      draftId: "draft.floor.ready-impact",
      floorImpactDraft: {
        dynamicStiffnessMNm3: 15,
        loadBasisKgM2: 200,
        requiredPhysicalInputs: ["dynamic_stiffness", "load_basis", "target_metric_basis"],
        targetMetricBasis: "iso"
      },
      layers: [
        {
          id: "floor-layer-1",
          materialId: "concrete",
          materialName: "Concrete",
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

    expect(validateReportAssistantLayerStackDraft(floorDraft)).toMatchObject({
      clarifyingQuestions: [],
      missingInputs: [],
      ok: true,
      status: "ready"
    });
  });
});

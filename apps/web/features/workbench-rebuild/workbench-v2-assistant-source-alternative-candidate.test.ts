import { describe, expect, it } from "vitest";

import { buildResolvedMaterialCatalog } from "./material-editor-state";
import { getWorkbenchV2AssistantLayerStackSignature } from "./workbench-v2-assistant-layer-stack-command";
import {
  createWorkbenchV2AssistantSourceAlternativeCandidatesFromReview,
  createWorkbenchV2AssistantSourceAlternativeCandidate,
  WORKBENCH_SOURCE_ALTERNATIVE_CANDIDATE_ID_PREFIX
} from "./workbench-v2-assistant-source-alternative-candidate";
import type { WorkbenchV2DraftLayer } from "./workbench-v2-project-snapshot";

const materials = buildResolvedMaterialCatalog([]);

const currentWallLayers: readonly WorkbenchV2DraftLayer[] = [
  { id: "current-side-a", materialId: "gypsum_board", role: "side_a", thicknessMm: "12.5" },
  { id: "current-cavity", materialId: "rockwool", role: "cavity", thicknessMm: "50" },
  { id: "current-side-b", materialId: "gypsum_board", role: "side_b", thicknessMm: "12.5" }
];

describe("workbench source alternative candidate adapter", () => {
  it("maps explicit catalog-backed advisory layers into a canonical Workbench candidate stack", () => {
    const result = createWorkbenchV2AssistantSourceAlternativeCandidate({
      alternativeId: "cavity-reference",
      currentLayers: currentWallLayers,
      idFactory: (index) => `source-alt-layer-${index + 1}`,
      layers: [
        { materialName: "Gypsum Board", role: "side_a", thicknessMm: "12.5" },
        { materialName: "Rock Wool", role: "cavity", thicknessMm: 75 },
        { materialName: "gypsum_board", role: "side_b", thicknessMm: "12,5" }
      ],
      materials,
      mode: "wall",
      selectedOutputs: ["Rw", "STC"],
      sourceEvidence: {
        comparability: "partial",
        sourceQuality: "mixed",
        sourceTitle: "Cavity absorber reference"
      }
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.candidateStack).toMatchObject({
      candidateId: `${WORKBENCH_SOURCE_ALTERNATIVE_CANDIDATE_ID_PREFIX}cavity-reference`,
      contextPatch: {
        wallCavity1DepthMm: "75",
        wallCavity1LayerIndices: "2",
        wallSideALeafLayerIndices: "1",
        wallSideBLeafLayerIndices: "3",
        wallTopologyMode: "double_leaf_framed"
      },
      label: "Source alternative: Cavity absorber reference",
      mode: "wall",
      selectedLayerId: "source-alt-layer-1",
      sourceLayerSignature: getWorkbenchV2AssistantLayerStackSignature(currentWallLayers),
      tasks: []
    });
    expect(result.candidateStack.layers).toEqual([
      { id: "source-alt-layer-1", materialId: "gypsum_board", role: "side_a", thicknessMm: "12.5" },
      { id: "source-alt-layer-2", materialId: "rockwool", role: "cavity", thicknessMm: "75" },
      { id: "source-alt-layer-3", materialId: "gypsum_board", role: "side_b", thicknessMm: "12.5" }
    ]);
    expect(result.candidateStack.warnings.join(" ")).toContain("preview through the calculator");
    expect(result.candidateStack.warnings.join(" ")).toContain("No source, provider, or model-supplied dB value");
    expect(result.warnings.join(" ")).toContain("advisory");
  });

  it("rejects unmapped provider material terms without producing a candidate stack", () => {
    const result = createWorkbenchV2AssistantSourceAlternativeCandidate({
      alternativeId: "proprietary-board",
      currentLayers: currentWallLayers,
      layers: [
        { materialName: "SilentFX proprietary board", role: "side_a", thicknessMm: "15" },
        { materialName: "Rock Wool", role: "cavity", thicknessMm: "75" }
      ],
      materials,
      mode: "wall",
      selectedOutputs: ["Rw"]
    });

    expect(result).toMatchObject({
      code: "missing_material_mapping",
      ok: false
    });
    if (result.ok) {
      return;
    }

    expect(result.tasks).toEqual([
      {
        code: "assistant_source_alternative_material_unmapped",
        detail: "Layer 1 uses provider/source material term \"SilentFX proprietary board\", which does not explicitly match the Workbench material catalog.",
        label: "Map source material"
      }
    ]);
    expect(result.clarificationPrompts).toEqual([
      {
        code: "assistant_source_alternative_map_material",
        layerIndex: 0,
        message: "SilentFX proprietary board is not in the Workbench material catalog. Choose an existing catalog material to map it to, or provide a custom material with the required acoustic properties before preview.",
        sourceMaterialName: "SilentFX proprietary board"
      }
    ]);
    expect(result.warnings.join(" ")).toContain("No Workbench candidate was created");
  });

  it("rejects ambiguous catalog mappings instead of guessing between materials", () => {
    const gypsum = materials.find((material) => material.id === "gypsum_board");
    expect(gypsum).toBeTruthy();

    const result = createWorkbenchV2AssistantSourceAlternativeCandidate({
      alternativeId: "ambiguous-gypsum",
      currentLayers: currentWallLayers,
      layers: [
        { materialName: "Gypsum Board", role: "side_a", thicknessMm: "12.5" }
      ],
      materials: [
        ...materials,
        {
          ...gypsum!,
          id: "custom_duplicate_gypsum_board"
        }
      ],
      mode: "wall",
      selectedOutputs: ["Rw"]
    });

    expect(result).toMatchObject({
      code: "ambiguous_material_mapping",
      ok: false
    });
    if (!result.ok) {
      expect(result.tasks[0]).toMatchObject({
        code: "assistant_source_alternative_material_ambiguous",
        label: "Clarify source material"
      });
      expect(result.clarificationPrompts[0]).toMatchObject({
        code: "assistant_source_alternative_choose_material",
        layerIndex: 0,
        sourceMaterialName: "Gypsum Board"
      });
    }
  });

  it("rejects missing or non-positive thicknesses before candidate preview", () => {
    const result = createWorkbenchV2AssistantSourceAlternativeCandidate({
      alternativeId: "invalid-thickness",
      currentLayers: currentWallLayers,
      layers: [
        { materialName: "Gypsum Board", role: "side_a", thicknessMm: "0" },
        { materialName: "Rock Wool", role: "cavity", thicknessMm: "" }
      ],
      materials,
      mode: "wall",
      selectedOutputs: ["Rw"]
    });

    expect(result).toMatchObject({
      code: "invalid_layer_input",
      ok: false
    });
    if (!result.ok) {
      expect(result.tasks.map((task) => task.code)).toEqual([
        "assistant_source_alternative_thickness_invalid",
        "assistant_source_alternative_thickness_invalid"
      ]);
    }
  });

  it("builds candidate stacks from review suggestions only when candidateLayers are explicit", () => {
    const result = createWorkbenchV2AssistantSourceAlternativeCandidatesFromReview({
      currentLayers: currentWallLayers,
      idFactory: (candidateIndex, layerIndex) => `review-alt-${candidateIndex + 1}-layer-${layerIndex + 1}`,
      materials,
      mode: "wall",
      review: {
        affectedLayers: ["2. Rock wool - 50 mm"],
        answerText: "Provider suggested one explicit stack and one advisory-only option.",
        comparableAssemblies: [],
        comparability: "partial",
        expectedMetricDirection: "higher_airborne_insulation",
        expectedTradeoffs: [],
        missingEvidence: [],
        rationale: [],
        sourceQuality: "mixed",
        sources: [],
        suggestedAlternatives: [
          {
            affectedLayers: ["2. Rock wool - 50 mm"],
            candidateLayers: [
              { materialName: "Gypsum Board", role: "side_a", thicknessMm: "12.5" },
              { materialName: "Rock Wool", role: "cavity", thicknessMm: "75" },
              { materialName: "Gypsum Board", role: "side_b", thicknessMm: "12.5" }
            ],
            expectedMetricDirection: "higher_airborne_insulation",
            expectedTradeoffs: ["More depth."],
            label: "Mapped source stack",
            rationale: ["Candidate layers were explicit."]
          },
          {
            affectedLayers: ["2. Rock wool - 50 mm"],
            expectedMetricDirection: "higher_airborne_insulation",
            expectedTradeoffs: [],
            label: "Advisory-only source note",
            rationale: ["No candidate layer stack was returned."]
          },
          {
            affectedLayers: ["1. Board"],
            candidateLayers: [
              { materialName: "SilentFX proprietary board", role: "side_a", thicknessMm: "15" }
            ],
            expectedMetricDirection: "higher_airborne_insulation",
            expectedTradeoffs: [],
            label: "Unmapped provider material",
            rationale: ["Material term is not catalog-explicit."]
          }
        ]
      },
      selectedOutputs: ["Rw"]
    });

    expect(result.candidateStacks).toHaveLength(1);
    expect(result.candidateStacks[0]).toMatchObject({
      candidateId: "source-alt-mapped-source-stack",
      label: "Source alternative: Mapped source stack",
      selectedLayerId: "review-alt-1-layer-1"
    });
    expect(result.candidateStacks[0]?.layers.map((layer) => layer.materialId)).toEqual([
      "gypsum_board",
      "rockwool",
      "gypsum_board"
    ]);
    expect(result.tasks.map((task) => task.code)).toEqual([
      "assistant_source_alternative_candidate_layers_missing",
      "assistant_source_alternative_material_unmapped"
    ]);
    expect(result.clarificationPrompts).toEqual([
      {
        code: "assistant_source_alternative_map_material",
        layerIndex: 0,
        message: "SilentFX proprietary board is not in the Workbench material catalog. Choose an existing catalog material to map it to, or provide a custom material with the required acoustic properties before preview.",
        sourceMaterialName: "SilentFX proprietary board"
      }
    ]);
    expect(result.sourceEvidenceByCandidateId["source-alt-mapped-source-stack"]).toMatchObject({
      comparability: "partial",
      sourceQuality: "mixed",
      suggestedAlternativeLabel: "Mapped source stack"
    });
  });
});

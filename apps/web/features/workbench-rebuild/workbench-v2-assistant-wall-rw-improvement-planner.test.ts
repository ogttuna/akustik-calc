import { describe, expect, it } from "vitest";

import { buildResolvedMaterialCatalog } from "./material-editor-state";
import { getWorkbenchV2AssistantLayerStackSignature } from "./workbench-v2-assistant-layer-stack-command";
import { planWorkbenchWallRwImprovementCandidates } from "./workbench-v2-assistant-wall-rw-improvement-planner";
import type { WorkbenchV2DraftLayer } from "./workbench-v2-project-snapshot";

const materials = buildResolvedMaterialCatalog([]);

const wallLayers: readonly WorkbenchV2DraftLayer[] = [
  { id: "layer-a", materialId: "gypsum_board", role: "side_a", thicknessMm: "12.5" },
  { id: "layer-cavity", materialId: "rockwool", role: "cavity", thicknessMm: "50" },
  { id: "layer-b", materialId: "gypsum_board", role: "side_b", thicknessMm: "12.5" }
];

describe("workbench wall Rw improvement planner", () => {
  it("creates canonical preview-required candidates without mutating the source stack", () => {
    const plan = planWorkbenchWallRwImprovementCandidates({
      candidateCap: 3,
      constraints: {
        maxAddedLayers: 2
      },
      currentLayers: wallLayers,
      idFactory: (index) => `planned-layer-${index + 1}`,
      materials,
      mode: "wall",
      selectedOutputs: ["Rw"]
    });

    expect(plan).toMatchObject({
      mutatesSavedState: false,
      objective: {
        direction: "increase",
        metric: "Rw"
      },
      previewRequired: true,
      sourceLayerSignature: getWorkbenchV2AssistantLayerStackSignature(wallLayers)
    });
    expect(plan.candidateStacks).toHaveLength(3);
    expect(wallLayers).toEqual([
      { id: "layer-a", materialId: "gypsum_board", role: "side_a", thicknessMm: "12.5" },
      { id: "layer-cavity", materialId: "rockwool", role: "cavity", thicknessMm: "50" },
      { id: "layer-b", materialId: "gypsum_board", role: "side_b", thicknessMm: "12.5" }
    ]);

    expect(plan.candidateStacks.map((candidate) => candidate.candidateId)).toEqual([
      "wall-rw-improvement-1",
      "wall-rw-improvement-2",
      "wall-rw-improvement-3"
    ]);
    expect(plan.candidateStacks.every((candidate) => candidate.mode === "wall")).toBe(true);
    expect(plan.candidateStacks.every((candidate) => candidate.sourceLayerSignature === plan.sourceLayerSignature)).toBe(true);
    expect(plan.candidateStacks.every((candidate) => candidate.tasks.length === 0)).toBe(true);
    expect(plan.candidateStacks.every((candidate) =>
      candidate.warnings.some((warning) => warning.includes("preview through the calculator"))
    )).toBe(true);

    expect(plan.candidateStacks[0]?.layers.map((layer) => layer.materialId)).toEqual([
      "acoustic_gypsum_board",
      "rockwool",
      "gypsum_board"
    ]);
    expect(plan.metadataByCandidateId["wall-rw-improvement-1"]).toMatchObject({
      expectedMechanism: "added_mass",
      generatedBy: "wall_rw_improvement_planner_v1",
      objectiveMetric: "Rw"
    });

    expect(plan.candidateStacks[1]?.layers.map((layer) => layer.id)).toEqual([
      "layer-a",
      "planned-layer-1",
      "layer-cavity",
      "layer-b"
    ]);
    expect(plan.candidateStacks[1]?.contextPatch).toMatchObject({
      wallCavity1DepthMm: "50",
      wallCavity1LayerIndices: "3",
      wallSideALeafLayerIndices: "1,2",
      wallSideBLeafLayerIndices: "4",
      wallTopologyMode: "double_leaf_framed"
    });

    expect(plan.candidateStacks[2]?.layers.map((layer) => layer.id)).toEqual([
      "layer-a",
      "planned-layer-2",
      "layer-cavity",
      "layer-b",
      "planned-layer-3"
    ]);
    expect(plan.metadataByCandidateId["wall-rw-improvement-3"]?.expectedMechanism).toBe("symmetric_boarding");
  });

  it("respects candidate cap and max added layer constraints", () => {
    const capped = planWorkbenchWallRwImprovementCandidates({
      candidateCap: 1,
      constraints: {
        maxAddedLayers: 2
      },
      currentLayers: wallLayers,
      materials,
      mode: "wall"
    });
    const oneAddedLayer = planWorkbenchWallRwImprovementCandidates({
      candidateCap: 3,
      constraints: {
        maxAddedLayers: 1
      },
      currentLayers: wallLayers,
      materials,
      mode: "wall"
    });

    expect(capped.candidateStacks).toHaveLength(1);
    expect(oneAddedLayer.candidateStacks.map((candidate) => candidate.label)).not.toContain("Add symmetric Acoustic Gypsum Board boards");
  });

  it("keeps unsupported modes outside the planner scope", () => {
    const plan = planWorkbenchWallRwImprovementCandidates({
      currentLayers: wallLayers,
      materials,
      mode: "floor"
    });

    expect(plan.candidateStacks).toEqual([]);
    expect(plan.warnings).toContain("Wall/Rw improvement planner only supports wall mode.");
  });

  it("creates porous absorber thickness candidates only when route context is present", () => {
    const withoutAcousticGypsum = materials.filter((material) => material.id !== "acoustic_gypsum_board");
    const missingContext = planWorkbenchWallRwImprovementCandidates({
      candidateCap: 3,
      constraints: {
        maxAddedLayers: 0
      },
      currentLayers: wallLayers,
      materials: withoutAcousticGypsum,
      mode: "wall"
    });
    const readyContext = planWorkbenchWallRwImprovementCandidates({
      candidateCap: 3,
      constraints: {
        maxAddedLayers: 0
      },
      context: {
        supportSpacingMm: "600",
        wallCavity1DepthMm: "50"
      },
      currentLayers: wallLayers,
      materials: withoutAcousticGypsum,
      mode: "wall"
    });

    expect(missingContext.candidateStacks).toEqual([]);
    expect(missingContext.warnings).toContain(
      "Porous absorber thickness candidate skipped because cavity depth/support spacing context is incomplete."
    );
    expect(readyContext.candidateStacks).toHaveLength(1);
    expect(readyContext.candidateStacks[0]?.layers[1]).toMatchObject({
      materialId: "rockwool",
      role: "cavity",
      thicknessMm: "75"
    });
    expect(readyContext.metadataByCandidateId["wall-rw-improvement-1"]?.expectedMechanism).toBe("porous_cavity_damping");
  });
});

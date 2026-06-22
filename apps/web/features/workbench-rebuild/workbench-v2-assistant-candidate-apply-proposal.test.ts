import { describe, expect, it } from "vitest";

import { buildResolvedMaterialCatalog } from "./material-editor-state";
import { createWorkbenchV2AssistantCandidateApplyProposal } from "./workbench-v2-assistant-candidate-apply-proposal";
import {
  planWorkbenchWallRwImprovementCandidates,
  isWorkbenchWallRwImprovementCandidateStack
} from "./workbench-v2-assistant-wall-rw-improvement-planner";
import {
  WORKBENCH_V2_DEFAULT_CONTEXT,
  type WorkbenchV2DraftLayer
} from "./workbench-v2-project-snapshot";

const materials = buildResolvedMaterialCatalog([]);
const sourceLayers: readonly WorkbenchV2DraftLayer[] = [
  { id: "source-side-a", materialId: "gypsum_board", role: "side_a", thicknessMm: "12.5" },
  { id: "source-cavity", materialId: "rockwool", role: "cavity", thicknessMm: "50" },
  { id: "source-side-b", materialId: "gypsum_board", role: "side_b", thicknessMm: "12.5" }
];

function firstImprovementCandidate() {
  const plan = planWorkbenchWallRwImprovementCandidates({
    candidateCap: 3,
    constraints: {
      maxAddedLayers: 2
    },
    currentLayers: sourceLayers,
    idFactory: (index) => `candidate-added-${index + 1}`,
    materials,
    mode: "wall"
  });
  const candidate = plan.candidateStacks[1];

  if (!candidate) {
    throw new Error("Expected planner to produce an added-board candidate.");
  }

  return candidate;
}

describe("workbench v2 assistant candidate apply proposal", () => {
  it("adapts objective candidates into confirmation-required Workbench apply proposals", () => {
    const candidate = firstImprovementCandidate();
    const result = createWorkbenchV2AssistantCandidateApplyProposal({
      candidate,
      materials,
      preview: {
        outputRows: [
          { detail: "Previewed through calculator", label: "Rw", status: "live", value: "47 dB" },
          { detail: "Previewed through calculator", label: "STC", status: "live", value: "47" }
        ],
        primaryOutput: "Rw 47 dB",
        routeStatus: "ready",
        snapshotSignature: "candidate.preview.signature"
      },
      requestedOutputs: ["Rw", "STC"],
      targetWorkbench: {
        context: WORKBENCH_V2_DEFAULT_CONTEXT,
        layers: sourceLayers,
        mode: "wall",
        selectedOutputs: ["STC", "Rw"]
      }
    });

    expect(isWorkbenchWallRwImprovementCandidateStack(candidate)).toBe(true);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.proposal).toMatchObject({
      action: "apply_layer_stack_draft_to_workbench",
      mutates: false,
      previewOnly: true,
      requiresConfirmation: true,
      proposedWorkbench: {
        mode: "wall",
        selectedOutputs: ["Rw", "STC"]
      },
      sourceDraft: {
        draftId: candidate.candidateId.startsWith("wall-rw-improvement-")
          ? `draft.${candidate.candidateId}`
          : expect.any(String),
        layerCount: candidate.layers.length,
        mode: "wall",
        requestedOutputs: ["Rw", "STC"]
      },
      targetWorkbench: {
        layerCount: sourceLayers.length,
        mode: "wall",
        selectedOutputs: ["STC", "Rw"]
      }
    });
    expect(result.proposal.proposedWorkbench.layers).toEqual(candidate.layers);
    expect(result.proposal.proposedWorkbench.contextPatch).toMatchObject({
      wallCavity1LayerIndices: "3",
      wallSideALeafLayerIndices: "1,2",
      wallSideBLeafLayerIndices: "4",
      wallTopologyMode: "double_leaf_framed"
    });
    expect(result.proposal.calculatorPreviewSummary).toMatchObject({
      basis: [
        {
          basis: "workbench_v2_candidate_preview",
          metricId: "Rw",
          routeStatus: "ready",
          unit: "dB",
          valueLabel: "47 dB"
        },
        {
          basis: "workbench_v2_candidate_preview",
          metricId: "STC",
          routeStatus: "ready",
          valueLabel: "47"
        }
      ],
      primaryOutput: "Rw 47 dB",
      routeStatus: "ready",
      selectedOutputs: ["Rw", "STC"],
      snapshotSignature: "candidate.preview.signature"
    });
    expect(result.proposal.summary).toContain("Confirmation is required");
    expect(result.proposal.warnings.join(" ")).toContain("Objective candidate apply requires confirmation");
  });

  it("blocks proposal creation when a candidate still needs layer inputs", () => {
    const candidate = {
      ...firstImprovementCandidate(),
      layers: [
        { id: "bad-layer", materialId: "gypsum_board", role: "side_a", thicknessMm: "" }
      ]
    };
    const result = createWorkbenchV2AssistantCandidateApplyProposal({
      candidate,
      materials,
      requestedOutputs: ["Rw"],
      targetWorkbench: {
        context: WORKBENCH_V2_DEFAULT_CONTEXT,
        layers: sourceLayers,
        mode: "wall",
        selectedOutputs: ["Rw"]
      }
    });

    expect(result).toMatchObject({
      code: "draft_needs_input",
      mutates: false,
      ok: false
    });
  });
});

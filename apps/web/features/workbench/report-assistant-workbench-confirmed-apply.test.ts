import { describe, expect, it, vi } from "vitest";

import { confirmReportAssistantWorkbenchApplyProposal } from "./report-assistant-workbench-confirmed-apply";
import {
  createReportAssistantWorkbenchApplyProposal,
  createReportAssistantWorkbenchApplyTargetSignature
} from "./report-assistant-workbench-apply-proposal";
import type { ReportAssistantLayerStackDraft } from "./report-assistant-layer-stack-draft";
import {
  WORKBENCH_V2_DEFAULT_CONTEXT,
  type WorkbenchV2DraftLayer
} from "../workbench-rebuild/workbench-v2-project-snapshot";

function readyDraft(): ReportAssistantLayerStackDraft {
  return {
    assumptions: [],
    contextSignature: "ctx.confirmed.apply",
    customMaterials: [],
    draftId: "draft.confirmed.apply",
    layers: [
      {
        id: "assistant-layer-1",
        materialId: "gypsum_board",
        materialName: "Gypsum Board",
        originalPhrase: "12.5 mm gypsum",
        role: "side_a",
        thicknessMm: 12.5
      },
      {
        id: "assistant-layer-2",
        materialId: "rockwool",
        materialName: "Rock Wool",
        originalPhrase: "50 mm rock wool",
        role: "cavity",
        thicknessMm: 50
      },
      {
        id: "assistant-layer-3",
        materialId: "gypsum_board",
        materialName: "Gypsum Board",
        originalPhrase: "12.5 mm gypsum",
        role: "side_b",
        thicknessMm: 12.5
      }
    ],
    mode: "wall",
    originalPhrases: ["12.5 mm gypsum", "50 mm rock wool", "12.5 mm gypsum"],
    requestedOutputs: ["Rw", "STC"],
    source: "user_instruction",
    sourceInstruction: "gypsum rock wool gypsum diz",
    wallTopologyDraft: {
      leafMapping: "explicit",
      supportSpacingMm: 600,
      supportTopology: "independent_frames",
      topology: "double_leaf_framed"
    },
    warnings: []
  };
}

function proposalFixture() {
  const context = WORKBENCH_V2_DEFAULT_CONTEXT;
  const layers: WorkbenchV2DraftLayer[] = [
    {
      id: "current-layer-1",
      materialId: "concrete",
      role: "core",
      thicknessMm: "100"
    }
  ];
  const selectedOutputs = ["Rw"] as const;
  const targetSignature = createReportAssistantWorkbenchApplyTargetSignature({
    context,
    layers,
    mode: "wall",
    selectedOutputs
  });
  const result = createReportAssistantWorkbenchApplyProposal({
    draft: readyDraft(),
    expectedSourceDraftContextSignature: "ctx.confirmed.apply",
    expectedTargetWorkbenchSnapshotSignature: targetSignature,
    targetWorkbench: {
      context,
      layers,
      mode: "wall",
      selectedOutputs,
      snapshotSignature: targetSignature
    }
  });

  if (!result.ok) {
    throw new Error(result.errors.join(" "));
  }

  return {
    proposal: result.proposal,
    targetSignature
  };
}

describe("report assistant Workbench confirmed apply", () => {
  it("applies a confirmed proposal to an unsaved Workbench payload only", () => {
    const { proposal, targetSignature } = proposalFixture();
    const apply = vi.fn();

    const result = confirmReportAssistantWorkbenchApplyProposal({
      apply,
      confirm: () => true,
      currentTargetWorkbenchSnapshotSignature: targetSignature,
      proposal
    });

    expect(result).toEqual({
      appliedLayerCount: 3,
      code: "applied",
      mutatesSavedState: false,
      ok: true
    });
    expect(apply).toHaveBeenCalledOnce();
    expect(apply).toHaveBeenCalledWith({
      contextPatch: proposal.proposedWorkbench.contextPatch,
      layers: proposal.proposedWorkbench.layers,
      mode: "wall",
      selectedLayerId: "assistant-layer-1",
      selectedOutputs: ["Rw", "STC"]
    });
    expect(JSON.stringify(apply.mock.calls)).not.toContain("projectId");
    expect(JSON.stringify(apply.mock.calls)).not.toContain("reportId");
  });

  it("does not apply when the user cancels confirmation", () => {
    const { proposal, targetSignature } = proposalFixture();
    const apply = vi.fn();

    expect(confirmReportAssistantWorkbenchApplyProposal({
      apply,
      confirm: () => false,
      currentTargetWorkbenchSnapshotSignature: targetSignature,
      proposal
    })).toEqual({
      code: "cancelled",
      message: "Workbench apply proposal was cancelled before browser draft state changed.",
      mutatesSavedState: false,
      ok: false
    });
    expect(apply).not.toHaveBeenCalled();
  });

  it("does not apply stale proposals to a changed Workbench draft", () => {
    const { proposal } = proposalFixture();
    const apply = vi.fn();

    expect(confirmReportAssistantWorkbenchApplyProposal({
      apply,
      confirm: () => true,
      currentTargetWorkbenchSnapshotSignature: "workbench:changed",
      proposal
    })).toEqual({
      code: "stale_target_workbench",
      message: "The visible Workbench draft changed after this assistant proposal was created.",
      mutatesSavedState: false,
      ok: false
    });
    expect(apply).not.toHaveBeenCalled();
  });

  it("rejects malformed proposals before confirmation", () => {
    const { proposal, targetSignature } = proposalFixture();
    const apply = vi.fn();

    expect(confirmReportAssistantWorkbenchApplyProposal({
      apply,
      confirm: () => true,
      currentTargetWorkbenchSnapshotSignature: targetSignature,
      proposal: {
        ...proposal,
        requiresConfirmation: false
      } as unknown as typeof proposal
    })).toEqual({
      code: "invalid_proposal",
      message: "Workbench apply proposal must be non-mutating, preview-only, and confirmation-required.",
      mutatesSavedState: false,
      ok: false
    });
    expect(apply).not.toHaveBeenCalled();
  });

  it("rejects proposals whose selected outputs do not belong to the proposal mode", () => {
    const { proposal, targetSignature } = proposalFixture();
    const apply = vi.fn();
    const confirm = vi.fn(() => true);

    expect(confirmReportAssistantWorkbenchApplyProposal({
      apply,
      confirm,
      currentTargetWorkbenchSnapshotSignature: targetSignature,
      proposal: {
        ...proposal,
        proposedWorkbench: {
          ...proposal.proposedWorkbench,
          selectedOutputs: ["AIIC"]
        }
      } as typeof proposal
    })).toEqual({
      code: "invalid_proposal",
      message: "Workbench apply proposal selected outputs are not supported by its mode.",
      mutatesSavedState: false,
      ok: false
    });
    expect(confirm).not.toHaveBeenCalled();
    expect(apply).not.toHaveBeenCalled();
  });
});

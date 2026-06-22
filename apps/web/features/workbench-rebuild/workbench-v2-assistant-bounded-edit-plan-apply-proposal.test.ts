import { describe, expect, it, vi } from "vitest";

import {
  confirmReportAssistantWorkbenchApplyProposal,
  type ReportAssistantWorkbenchConfirmedApplyPayload
} from "../workbench/report-assistant-workbench-confirmed-apply";
import { createReportAssistantWorkbenchApplyTargetSignature } from "../workbench/report-assistant-workbench-apply-proposal";
import { buildResolvedMaterialCatalog } from "./material-editor-state";
import { createWorkbenchV2AssistantBoundedEditPlan } from "./workbench-v2-assistant-bounded-edit-plan";
import { createWorkbenchV2AssistantBoundedEditPlanApplyProposal } from "./workbench-v2-assistant-bounded-edit-plan-apply-proposal";
import {
  WORKBENCH_V2_DEFAULT_CONTEXT,
  type WorkbenchV2DraftLayer
} from "./workbench-v2-project-snapshot";

const materials = buildResolvedMaterialCatalog([]);
const baseLayers: readonly WorkbenchV2DraftLayer[] = [
  { id: "existing-layer-1", materialId: "gypsum_board", role: "side_a", thicknessMm: "12.5" },
  { id: "existing-layer-2", materialId: "rockwool", role: "cavity", thicknessMm: "50" },
  { id: "existing-layer-3", materialId: "gypsum_board", role: "side_b", thicknessMm: "12.5" }
];

function plan(instruction: string) {
  return createWorkbenchV2AssistantBoundedEditPlan({
    currentLayers: baseLayers,
    currentMode: "wall",
    currentSelectedOutputs: ["Rw"],
    idFactory: (index) => `bounded-plan-layer-${index + 1}`,
    instruction,
    materials
  });
}

function applyProposalFor(instruction: string) {
  return createWorkbenchV2AssistantBoundedEditPlanApplyProposal({
    materials,
    plan: plan(instruction),
    targetWorkbench: {
      context: WORKBENCH_V2_DEFAULT_CONTEXT,
      layers: baseLayers,
      mode: "wall",
      selectedOutputs: ["Rw"]
    }
  });
}

function readyApplyProposalFor(instruction: string) {
  const result = applyProposalFor(instruction);

  if (!result.ok) {
    throw new Error(result.errors.join(" "));
  }

  return result.proposal;
}

describe("workbench v2 assistant bounded edit-plan apply proposal", () => {
  it("adapts a successful dry-run plan into a confirmation-required Workbench proposal", () => {
    const dryRun = plan("15 mm gypsum ekle, Rw ve STC seç, hesapla");
    const targetSignature = createReportAssistantWorkbenchApplyTargetSignature({
      context: WORKBENCH_V2_DEFAULT_CONTEXT,
      layers: baseLayers,
      mode: "wall",
      selectedOutputs: ["Rw"]
    });
    const wrongFinalSignature = createReportAssistantWorkbenchApplyTargetSignature({
      context: WORKBENCH_V2_DEFAULT_CONTEXT,
      layers: dryRun.ok ? dryRun.finalLayers : [],
      mode: "wall",
      selectedOutputs: dryRun.ok ? dryRun.selectedOutputs : ["Rw"]
    });
    const result = createWorkbenchV2AssistantBoundedEditPlanApplyProposal({
      materials,
      plan: dryRun,
      targetWorkbench: {
        context: WORKBENCH_V2_DEFAULT_CONTEXT,
        layers: baseLayers,
        mode: "wall",
        selectedOutputs: ["Rw"]
      }
    });

    expect(dryRun.ok).toBe(true);
    expect(result.ok).toBe(true);
    if (!result.ok || !dryRun.ok) {
      return;
    }

    expect(result.proposal).toMatchObject({
      action: "apply_layer_stack_draft_to_workbench",
      mutates: false,
      previewOnly: true,
      requiresConfirmation: true,
      title: "Apply bounded edit plan to draft",
      proposedWorkbench: {
        mode: "wall",
        selectedOutputs: dryRun.selectedOutputs
      },
      sourceDraft: {
        draftId: `draft.${dryRun.planId}`,
        layerCount: dryRun.finalLayers.length,
        mode: "wall",
        requestedOutputs: dryRun.selectedOutputs
      },
      targetWorkbench: {
        layerCount: baseLayers.length,
        mode: "wall",
        selectedOutputs: ["Rw"],
        snapshotSignature: targetSignature
      }
    });
    expect(result.proposal.proposedWorkbench.layers).toEqual(dryRun.finalLayers);
    expect(result.proposal.staleGuards.targetWorkbenchSnapshotSignature).toBe(targetSignature);
    expect(result.proposal.staleGuards.targetWorkbenchSnapshotSignature).not.toBe(wrongFinalSignature);
    expect(result.proposal.summary).toContain("Confirmation is required");
    expect(result.proposal.warnings.join(" ")).toContain("Bounded edit-plan apply requires confirmation");
  });

  it("does not create a proposal from a blocked dry-run plan", () => {
    const result = applyProposalFor("rockwool'u çıkar, iki gypsum layer ekle, iki alternatif dene");

    expect(result).toMatchObject({
      code: "blocked_plan",
      mutates: false,
      ok: false
    });
  });

  it("reuses draft validation when final layers still need thickness input", () => {
    const result = applyProposalFor("gypsum ekle, Rw seç");

    expect(result).toMatchObject({
      code: "draft_needs_input",
      mutates: false,
      ok: false
    });
  });

  it("does not apply a bounded proposal when the user cancels confirmation", () => {
    const proposal = readyApplyProposalFor("15 mm gypsum ekle, Rw ve STC seç, hesapla");
    const apply = vi.fn<(payload: ReportAssistantWorkbenchConfirmedApplyPayload) => void>();

    expect(confirmReportAssistantWorkbenchApplyProposal({
      apply,
      confirm: () => false,
      currentTargetWorkbenchSnapshotSignature: proposal.targetWorkbench.snapshotSignature,
      proposal
    })).toEqual({
      code: "cancelled",
      message: "Workbench apply proposal was cancelled before browser draft state changed.",
      mutatesSavedState: false,
      ok: false
    });
    expect(apply).not.toHaveBeenCalled();
  });

  it("applies a confirmed bounded proposal only to the visible unsaved Workbench payload", () => {
    const proposal = readyApplyProposalFor("15 mm gypsum ekle, Rw ve STC seç, hesapla");
    const apply = vi.fn<(payload: ReportAssistantWorkbenchConfirmedApplyPayload) => void>();

    expect(confirmReportAssistantWorkbenchApplyProposal({
      apply,
      confirm: () => true,
      currentTargetWorkbenchSnapshotSignature: proposal.targetWorkbench.snapshotSignature,
      proposal
    })).toEqual({
      appliedLayerCount: proposal.proposedWorkbench.layers.length,
      code: "applied",
      mutatesSavedState: false,
      ok: true
    });
    expect(apply).toHaveBeenCalledOnce();
    expect(apply).toHaveBeenCalledWith({
      contextPatch: proposal.proposedWorkbench.contextPatch,
      layers: proposal.proposedWorkbench.layers,
      mode: proposal.proposedWorkbench.mode,
      selectedLayerId: proposal.proposedWorkbench.layers[0]?.id ?? null,
      selectedOutputs: proposal.proposedWorkbench.selectedOutputs
    });
    expect(JSON.stringify(apply.mock.calls)).not.toContain("projectId");
    expect(JSON.stringify(apply.mock.calls)).not.toContain("reportId");
  });

  it("blocks a bounded proposal when the visible Workbench target changed after preparation", () => {
    const proposal = readyApplyProposalFor("15 mm gypsum ekle, Rw ve STC seç, hesapla");
    const apply = vi.fn<(payload: ReportAssistantWorkbenchConfirmedApplyPayload) => void>();
    const changedTargetSignature = createReportAssistantWorkbenchApplyTargetSignature({
      context: WORKBENCH_V2_DEFAULT_CONTEXT,
      layers: [
        ...baseLayers,
        { id: "manual-layer-after-proposal", materialId: "gypsum_board", role: "side_b", thicknessMm: "15" }
      ],
      mode: "wall",
      selectedOutputs: ["Rw"]
    });

    expect(confirmReportAssistantWorkbenchApplyProposal({
      apply,
      confirm: () => true,
      currentTargetWorkbenchSnapshotSignature: changedTargetSignature,
      proposal
    })).toEqual({
      code: "stale_target_workbench",
      message: "The visible Workbench draft changed after this assistant proposal was created.",
      mutatesSavedState: false,
      ok: false
    });
    expect(apply).not.toHaveBeenCalled();
  });
});

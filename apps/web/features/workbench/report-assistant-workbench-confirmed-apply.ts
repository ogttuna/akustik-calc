import type { RequestedOutputId } from "@dynecho/shared";

import type { ReportAssistantWorkbenchApplyProposal } from "./report-assistant-workbench-apply-proposal";
import type {
  WorkbenchV2ContextDraft,
  WorkbenchV2DraftLayer,
  WorkbenchV2StudyMode
} from "../workbench-rebuild/workbench-v2-project-snapshot";
import { filterWorkbenchV2OutputsForMode } from "../workbench-rebuild/workbench-v2-output-catalog";

export type ReportAssistantWorkbenchConfirmedApplyPayload = {
  contextPatch: Partial<WorkbenchV2ContextDraft>;
  layers: readonly WorkbenchV2DraftLayer[];
  mode: WorkbenchV2StudyMode;
  selectedLayerId: string | null;
  selectedOutputs: readonly RequestedOutputId[];
};

export type ReportAssistantWorkbenchConfirmedApplyResult =
  | {
      appliedLayerCount: number;
      code: "applied";
      mutatesSavedState: false;
      ok: true;
    }
  | {
      code:
        | "cancelled"
        | "invalid_proposal"
        | "stale_target_workbench";
      message: string;
      mutatesSavedState: false;
      ok: false;
    };

export type ReportAssistantWorkbenchConfirmedApplyInput = {
  apply: (payload: ReportAssistantWorkbenchConfirmedApplyPayload) => void;
  confirm: () => boolean;
  currentTargetWorkbenchSnapshotSignature: string;
  proposal: ReportAssistantWorkbenchApplyProposal;
};

function validateApplyProposal(proposal: ReportAssistantWorkbenchApplyProposal): string | null {
  if (proposal.action !== "apply_layer_stack_draft_to_workbench") {
    return "Unsupported Workbench apply proposal action.";
  }

  if (proposal.mutates !== false || proposal.previewOnly !== true || proposal.requiresConfirmation !== true) {
    return "Workbench apply proposal must be non-mutating, preview-only, and confirmation-required.";
  }

  if (!proposal.proposedWorkbench.layers.length) {
    return "Workbench apply proposal has no layer rows to apply.";
  }

  const selectedOutputs = proposal.proposedWorkbench.selectedOutputs;
  if (!selectedOutputs.length) {
    return "Workbench apply proposal has no selected outputs to apply.";
  }

  if (filterWorkbenchV2OutputsForMode(selectedOutputs, proposal.proposedWorkbench.mode).length !== selectedOutputs.length) {
    return "Workbench apply proposal selected outputs are not supported by its mode.";
  }

  return null;
}

export function confirmReportAssistantWorkbenchApplyProposal(
  input: ReportAssistantWorkbenchConfirmedApplyInput
): ReportAssistantWorkbenchConfirmedApplyResult {
  const validationError = validateApplyProposal(input.proposal);
  if (validationError) {
    return {
      code: "invalid_proposal",
      message: validationError,
      mutatesSavedState: false,
      ok: false
    };
  }

  if (
    input.proposal.staleGuards.targetWorkbenchSnapshotSignature !== input.currentTargetWorkbenchSnapshotSignature ||
    input.proposal.targetWorkbench.snapshotSignature !== input.currentTargetWorkbenchSnapshotSignature
  ) {
    return {
      code: "stale_target_workbench",
      message: "The visible Workbench draft changed after this assistant proposal was created.",
      mutatesSavedState: false,
      ok: false
    };
  }

  if (!input.confirm()) {
    return {
      code: "cancelled",
      message: "Workbench apply proposal was cancelled before browser draft state changed.",
      mutatesSavedState: false,
      ok: false
    };
  }

  const firstLayerId = input.proposal.proposedWorkbench.layers[0]?.id ?? null;
  input.apply({
    contextPatch: input.proposal.proposedWorkbench.contextPatch,
    layers: input.proposal.proposedWorkbench.layers,
    mode: input.proposal.proposedWorkbench.mode,
    selectedLayerId: firstLayerId,
    selectedOutputs: input.proposal.proposedWorkbench.selectedOutputs
  });

  return {
    appliedLayerCount: input.proposal.proposedWorkbench.layers.length,
    code: "applied",
    mutatesSavedState: false,
    ok: true
  };
}

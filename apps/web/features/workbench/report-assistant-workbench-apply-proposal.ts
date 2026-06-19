import type { RequestedOutputId } from "@dynecho/shared";

import {
  validateReportAssistantLayerStackDraft,
  type ReportAssistantLayerStackDraft
} from "./report-assistant-layer-stack-draft";
import {
  createReportAssistantResultEnvelope,
  type ReportAssistantResultBasis,
  type ReportAssistantResultEnvelope
} from "./report-assistant-result-contract";
import type {
  WorkbenchV2ContextDraft,
  WorkbenchV2DraftLayer,
  WorkbenchV2StudyMode
} from "../workbench-rebuild/workbench-v2-project-snapshot";

export type ReportAssistantWorkbenchApplyAction = "apply_layer_stack_draft_to_workbench";

export type ReportAssistantWorkbenchApplyLayerSnapshot = {
  id: string;
  materialId: string;
  materialName?: string;
  role: string;
  sourcePhrase?: string;
  thicknessMm: string;
};

export type ReportAssistantWorkbenchApplyLayerDiff = {
  after?: ReportAssistantWorkbenchApplyLayerSnapshot;
  before?: ReportAssistantWorkbenchApplyLayerSnapshot;
  index: number;
  operation: "add" | "remove" | "replace" | "unchanged";
};

export type ReportAssistantWorkbenchApplySelectedOutputsDiff = {
  added: readonly RequestedOutputId[];
  after: readonly RequestedOutputId[];
  before: readonly RequestedOutputId[];
  removed: readonly RequestedOutputId[];
  unchanged: readonly RequestedOutputId[];
};

export type ReportAssistantWorkbenchApplyContextDiff = {
  after: string;
  before: string;
  field: keyof WorkbenchV2ContextDraft;
};

export type ReportAssistantWorkbenchApplyCalculatorPreviewSummary = {
  basis: readonly ReportAssistantResultBasis[];
  primaryOutput?: string;
  routeStatus: "needs_input" | "not_run" | "ready" | "unsupported";
  selectedOutputs: readonly RequestedOutputId[];
  snapshotSignature?: string;
};

export type ReportAssistantWorkbenchApplyProposal = {
  action: ReportAssistantWorkbenchApplyAction;
  assistantResult: ReportAssistantResultEnvelope;
  calculatorPreviewSummary: ReportAssistantWorkbenchApplyCalculatorPreviewSummary;
  diff: {
    context: readonly ReportAssistantWorkbenchApplyContextDiff[];
    layers: readonly ReportAssistantWorkbenchApplyLayerDiff[];
    selectedOutputs: ReportAssistantWorkbenchApplySelectedOutputsDiff;
  };
  mutates: false;
  previewOnly: true;
  proposedWorkbench: {
    contextPatch: Partial<WorkbenchV2ContextDraft>;
    layers: readonly WorkbenchV2DraftLayer[];
    mode: WorkbenchV2StudyMode;
    selectedOutputs: readonly RequestedOutputId[];
  };
  requiresConfirmation: true;
  sourceDraft: {
    contextSignature: string;
    draftId: string;
    layerCount: number;
    mode: WorkbenchV2StudyMode;
    requestedOutputs: readonly RequestedOutputId[];
  };
  staleGuards: {
    sourceDraftContextSignature: string;
    targetWorkbenchSnapshotSignature: string;
  };
  summary: string;
  targetWorkbench: {
    layerCount: number;
    mode: WorkbenchV2StudyMode;
    selectedOutputs: readonly RequestedOutputId[];
    snapshotSignature: string;
  };
  title: string;
  warnings: readonly string[];
};

export type ReportAssistantWorkbenchApplyProposalInput = {
  calculatorPreviewSummary?: Partial<ReportAssistantWorkbenchApplyCalculatorPreviewSummary>;
  draft: ReportAssistantLayerStackDraft;
  expectedSourceDraftContextSignature: string;
  expectedTargetWorkbenchSnapshotSignature: string;
  targetWorkbench: {
    context: WorkbenchV2ContextDraft;
    layers: readonly WorkbenchV2DraftLayer[];
    mode: WorkbenchV2StudyMode;
    selectedOutputs: readonly RequestedOutputId[];
    snapshotSignature: string;
  };
};

export type ReportAssistantWorkbenchApplyProposalResult =
  | {
      mutates: false;
      ok: true;
      proposal: ReportAssistantWorkbenchApplyProposal;
      warnings: readonly string[];
    }
  | {
      code:
        | "draft_needs_input"
        | "stale_source_draft"
        | "stale_target_workbench"
        | "unsupported_draft_mode";
      errors: readonly string[];
      mutates: false;
      ok: false;
      statusCode: 400 | 409;
      warnings: readonly string[];
    };

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) =>
      `${JSON.stringify(key)}:${stableStringify(record[key])}`
    ).join(",")}}`;
  }

  return JSON.stringify(value);
}

function hashSignature(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `workbench:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function createReportAssistantWorkbenchApplyTargetSignature(input: {
  context: WorkbenchV2ContextDraft;
  layers: readonly WorkbenchV2DraftLayer[];
  mode: WorkbenchV2StudyMode;
  selectedOutputs: readonly RequestedOutputId[];
}): string {
  return hashSignature(stableStringify({
    context: input.context,
    layers: input.layers.map((layer) => ({
      id: layer.id,
      materialId: layer.materialId,
      role: layer.role,
      thicknessMm: layer.thicknessMm
    })),
    mode: input.mode,
    selectedOutputs: input.selectedOutputs
  }));
}

function fail(input: {
  code: ReportAssistantWorkbenchApplyProposalResult extends infer TResult
    ? TResult extends { ok: false; code: infer TCode } ? TCode : never
    : never;
  errors: readonly string[];
  statusCode: 400 | 409;
  warnings?: readonly string[];
}): ReportAssistantWorkbenchApplyProposalResult {
  return {
    code: input.code,
    errors: input.errors,
    mutates: false,
    ok: false,
    statusCode: input.statusCode,
    warnings: input.warnings ?? []
  };
}

function uniqueOutputs(outputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  return [...new Set(outputs)];
}

function formatMm(value: number | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "";
  }

  return Number.isInteger(value) ? String(value) : String(value);
}

function proposedLayersFromDraft(draft: ReportAssistantLayerStackDraft): WorkbenchV2DraftLayer[] {
  return draft.layers.map((layer) => ({
    id: layer.id,
    materialId: layer.materialId ?? "",
    role: layer.role,
    thicknessMm: formatMm(layer.thicknessMm)
  }));
}

function layerSnapshot(
  layer: WorkbenchV2DraftLayer,
  draft: ReportAssistantLayerStackDraft | null
): ReportAssistantWorkbenchApplyLayerSnapshot {
  const draftLayer = draft?.layers.find((entry) => entry.id === layer.id);

  return {
    id: layer.id,
    materialId: layer.materialId,
    ...(draftLayer?.materialName ? { materialName: draftLayer.materialName } : {}),
    role: layer.role,
    ...(draftLayer?.originalPhrase ? { sourcePhrase: draftLayer.originalPhrase } : {}),
    thicknessMm: layer.thicknessMm
  };
}

function sameLayer(left: WorkbenchV2DraftLayer | undefined, right: WorkbenchV2DraftLayer | undefined): boolean {
  return Boolean(left && right) &&
    left?.materialId === right?.materialId &&
    left?.role === right?.role &&
    left?.thicknessMm === right?.thicknessMm;
}

function buildLayerDiff(input: {
  after: readonly WorkbenchV2DraftLayer[];
  before: readonly WorkbenchV2DraftLayer[];
  draft: ReportAssistantLayerStackDraft;
}): ReportAssistantWorkbenchApplyLayerDiff[] {
  const maxLength = Math.max(input.before.length, input.after.length);
  const diff: ReportAssistantWorkbenchApplyLayerDiff[] = [];

  for (let index = 0; index < maxLength; index += 1) {
    const before = input.before[index];
    const after = input.after[index];

    diff.push({
      ...(after ? { after: layerSnapshot(after, input.draft) } : {}),
      ...(before ? { before: layerSnapshot(before, null) } : {}),
      index,
      operation: before && after
        ? sameLayer(before, after) ? "unchanged" : "replace"
        : after ? "add" : "remove"
    });
  }

  return diff;
}

function buildSelectedOutputsDiff(input: {
  after: readonly RequestedOutputId[];
  before: readonly RequestedOutputId[];
}): ReportAssistantWorkbenchApplySelectedOutputsDiff {
  const before = uniqueOutputs(input.before);
  const after = uniqueOutputs(input.after);

  return {
    added: after.filter((output) => !before.includes(output)),
    after,
    before,
    removed: before.filter((output) => !after.includes(output)),
    unchanged: after.filter((output) => before.includes(output))
  };
}

function oneBasedIndicesForRole(layers: readonly WorkbenchV2DraftLayer[], role: string): string {
  return layers
    .flatMap((layer, index) => layer.role === role ? [String(index + 1)] : [])
    .join(",");
}

function withContextPatch<K extends keyof WorkbenchV2ContextDraft>(
  patch: Partial<WorkbenchV2ContextDraft>,
  current: WorkbenchV2ContextDraft,
  field: K,
  value: WorkbenchV2ContextDraft[K] | undefined
): void {
  if (value === undefined || current[field] === value) {
    return;
  }

  patch[field] = value;
}

function buildContextPatch(input: {
  current: WorkbenchV2ContextDraft;
  draft: ReportAssistantLayerStackDraft;
  proposedLayers: readonly WorkbenchV2DraftLayer[];
}): Partial<WorkbenchV2ContextDraft> {
  const patch: Partial<WorkbenchV2ContextDraft> = {};

  if (input.draft.mode === "wall") {
    const topology = input.draft.wallTopologyDraft;
    if (topology?.topology === "double_leaf_framed") {
      withContextPatch(patch, input.current, "wallTopologyMode", "double_leaf_framed");
      withContextPatch(patch, input.current, "wallSideALeafLayerIndices", oneBasedIndicesForRole(input.proposedLayers, "side_a"));
      withContextPatch(patch, input.current, "wallCavity1LayerIndices", oneBasedIndicesForRole(input.proposedLayers, "cavity"));
      withContextPatch(patch, input.current, "wallSideBLeafLayerIndices", oneBasedIndicesForRole(input.proposedLayers, "side_b"));

      if (topology.supportTopology && topology.supportTopology !== "unknown") {
        withContextPatch(patch, input.current, "wallSupportTopology", topology.supportTopology);
      }
      if (typeof topology.supportSpacingMm === "number" && Number.isFinite(topology.supportSpacingMm)) {
        withContextPatch(patch, input.current, "supportSpacingMm", formatMm(topology.supportSpacingMm));
      }
    } else if (topology?.topology === "single_leaf") {
      withContextPatch(patch, input.current, "wallTopologyMode", "auto");
      withContextPatch(patch, input.current, "wallSideALeafLayerIndices", "");
      withContextPatch(patch, input.current, "wallCavity1LayerIndices", "");
      withContextPatch(patch, input.current, "wallSideBLeafLayerIndices", "");
      withContextPatch(patch, input.current, "wallSupportTopology", "unknown");
    }
  }

  if (input.draft.mode === "floor") {
    const floorImpact = input.draft.floorImpactDraft;
    if (floorImpact?.fieldLabContext === "field") {
      withContextPatch(patch, input.current, "airborneMode", "field_between_rooms");
    } else if (floorImpact?.fieldLabContext === "lab") {
      withContextPatch(patch, input.current, "airborneMode", "element_lab");
    }
    if (typeof floorImpact?.dynamicStiffnessMNm3 === "number") {
      withContextPatch(patch, input.current, "resilientLayerDynamicStiffnessMNm3", formatMm(floorImpact.dynamicStiffnessMNm3));
    }
    if (typeof floorImpact?.loadBasisKgM2 === "number") {
      withContextPatch(patch, input.current, "loadBasisKgM2", formatMm(floorImpact.loadBasisKgM2));
    }
    if (typeof floorImpact?.receivingRoomVolumeM3 === "number") {
      withContextPatch(patch, input.current, "impactReceivingRoomVolumeM3", formatMm(floorImpact.receivingRoomVolumeM3));
    }
  }

  return patch;
}

function buildContextDiff(input: {
  current: WorkbenchV2ContextDraft;
  patch: Partial<WorkbenchV2ContextDraft>;
}): ReportAssistantWorkbenchApplyContextDiff[] {
  return (Object.keys(input.patch) as (keyof WorkbenchV2ContextDraft)[]).map((field) => ({
    after: String(input.patch[field] ?? ""),
    before: String(input.current[field] ?? ""),
    field
  }));
}

function buildCalculatorPreviewSummary(input: {
  draft: ReportAssistantLayerStackDraft;
  preview?: Partial<ReportAssistantWorkbenchApplyCalculatorPreviewSummary>;
  selectedOutputs: readonly RequestedOutputId[];
}): ReportAssistantWorkbenchApplyCalculatorPreviewSummary {
  return {
    basis: input.preview?.basis ?? [],
    ...(input.preview?.primaryOutput ? { primaryOutput: input.preview.primaryOutput } : {}),
    routeStatus: input.preview?.routeStatus ?? input.draft.lastCalculatorPreview?.routeStatus ?? "not_run",
    selectedOutputs: input.preview?.selectedOutputs ?? input.selectedOutputs,
    ...(input.preview?.snapshotSignature ?? input.draft.lastCalculatorPreview?.snapshotSignature
      ? { snapshotSignature: input.preview?.snapshotSignature ?? input.draft.lastCalculatorPreview?.snapshotSignature }
      : {})
  };
}

function proposalWarnings(input: {
  draft: ReportAssistantLayerStackDraft;
  preview: ReportAssistantWorkbenchApplyCalculatorPreviewSummary;
}): string[] {
  const warnings = [...input.draft.warnings];

  if (input.preview.routeStatus !== "ready") {
    warnings.push(
      "No ready calculator preview is attached; this proposal can apply the typed draft but cannot claim calculator-backed numeric values."
    );
  } else if (input.preview.basis.length === 0) {
    warnings.push(
      "Calculator preview is marked ready but no metric basis rows are attached to the apply proposal."
    );
  }

  return warnings;
}

function layerChangeSummary(diff: readonly ReportAssistantWorkbenchApplyLayerDiff[]): string {
  const changed = diff.filter((entry) => entry.operation !== "unchanged").length;
  return `${changed} layer row${changed === 1 ? "" : "s"} would change`;
}

export function createReportAssistantWorkbenchApplyProposal(
  input: ReportAssistantWorkbenchApplyProposalInput
): ReportAssistantWorkbenchApplyProposalResult {
  if (input.draft.contextSignature !== input.expectedSourceDraftContextSignature) {
    return fail({
      code: "stale_source_draft",
      errors: ["The source layer-stack draft no longer matches the expected assistant context signature."],
      statusCode: 409
    });
  }

  if (input.targetWorkbench.snapshotSignature !== input.expectedTargetWorkbenchSnapshotSignature) {
    return fail({
      code: "stale_target_workbench",
      errors: ["The target Workbench snapshot changed after the apply proposal was requested."],
      statusCode: 409
    });
  }

  if (input.draft.mode !== "floor" && input.draft.mode !== "wall") {
    return fail({
      code: "unsupported_draft_mode",
      errors: ["Only wall and floor layer-stack drafts can produce Workbench apply proposals."],
      statusCode: 400
    });
  }

  const validation = validateReportAssistantLayerStackDraft(input.draft);
  if (!validation.ok) {
    return fail({
      code: "draft_needs_input",
      errors: validation.clarifyingQuestions.length > 0
        ? validation.clarifyingQuestions
        : validation.missingInputs.map((missingInput) => missingInput.message),
      statusCode: 400
    });
  }

  const proposedLayers = proposedLayersFromDraft(input.draft);
  const proposedSelectedOutputs = uniqueOutputs(input.draft.requestedOutputs);
  const contextPatch = buildContextPatch({
    current: input.targetWorkbench.context,
    draft: input.draft,
    proposedLayers
  });
  const layerDiff = buildLayerDiff({
    after: proposedLayers,
    before: input.targetWorkbench.layers,
    draft: input.draft
  });
  const selectedOutputsDiff = buildSelectedOutputsDiff({
    after: proposedSelectedOutputs,
    before: input.targetWorkbench.selectedOutputs
  });
  const contextDiff = buildContextDiff({
    current: input.targetWorkbench.context,
    patch: contextPatch
  });
  const calculatorPreviewSummary = buildCalculatorPreviewSummary({
    draft: input.draft,
    preview: input.calculatorPreviewSummary,
    selectedOutputs: proposedSelectedOutputs
  });
  const warnings = proposalWarnings({
    draft: input.draft,
    preview: calculatorPreviewSummary
  });
  const title = "Apply assistant layer-stack draft to Workbench";
  const summary = `${layerChangeSummary(layerDiff)} in the unsaved Workbench calculator draft. Confirmation is required before browser state changes.`;

  const assistantResult = createReportAssistantResultEnvelope({
    authority: "draft_only",
    capabilityName: "report_assistant_workbench_apply_proposal",
    confidenceReason: "A deterministic diff was built from a validated layer-stack draft and a stale-guarded Workbench snapshot.",
    evidence: [
      {
        detail: input.draft.draftId,
        label: "Source draft"
      },
      {
        detail: input.targetWorkbench.snapshotSignature,
        label: "Target Workbench snapshot"
      },
      {
        detail: layerChangeSummary(layerDiff),
        label: "Layer diff"
      },
      {
        detail: contextDiff.map((entry) => entry.field).join(", ") || "none",
        label: "Context patch fields"
      }
    ],
    routeStatus: "ready",
    sourceTrace: [
      {
        detail: "No Workbench state was mutated while building this proposal.",
        kind: "deterministic",
        label: "report_assistant_workbench_apply_proposal"
      }
    ],
    warnings
  });

  return {
    mutates: false,
    ok: true,
    proposal: {
      action: "apply_layer_stack_draft_to_workbench",
      assistantResult,
      calculatorPreviewSummary,
      diff: {
        context: contextDiff,
        layers: layerDiff,
        selectedOutputs: selectedOutputsDiff
      },
      mutates: false,
      previewOnly: true,
      proposedWorkbench: {
        contextPatch,
        layers: proposedLayers,
        mode: input.draft.mode,
        selectedOutputs: proposedSelectedOutputs
      },
      requiresConfirmation: true,
      sourceDraft: {
        contextSignature: input.draft.contextSignature,
        draftId: input.draft.draftId,
        layerCount: input.draft.layers.length,
        mode: input.draft.mode,
        requestedOutputs: proposedSelectedOutputs
      },
      staleGuards: {
        sourceDraftContextSignature: input.expectedSourceDraftContextSignature,
        targetWorkbenchSnapshotSignature: input.expectedTargetWorkbenchSnapshotSignature
      },
      summary,
      targetWorkbench: {
        layerCount: input.targetWorkbench.layers.length,
        mode: input.targetWorkbench.mode,
        selectedOutputs: uniqueOutputs(input.targetWorkbench.selectedOutputs),
        snapshotSignature: input.targetWorkbench.snapshotSignature
      },
      title,
      warnings
    },
    warnings
  };
}

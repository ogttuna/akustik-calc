import type { MaterialDefinition, RequestedOutputId } from "@dynecho/shared";

import type {
  ReportAssistantLayerStackDraft,
  ReportAssistantLayerStackDraftLayer,
  ReportAssistantLayerStackDraftLayerRole
} from "../workbench/report-assistant-layer-stack-draft";
import {
  createReportAssistantWorkbenchApplyProposal,
  createReportAssistantWorkbenchApplyTargetSignature,
  type ReportAssistantWorkbenchApplyCalculatorPreviewSummary,
  type ReportAssistantWorkbenchApplyProposalResult
} from "../workbench/report-assistant-workbench-apply-proposal";
import type { ReportAssistantResultBasis } from "../workbench/report-assistant-result-contract";
import type { WorkbenchV2AssistantLayerStackCandidateStack } from "./workbench-v2-assistant-layer-stack-command";
import type { WorkbenchV2CalculatorAssistantOutputRow } from "./workbench-v2-calculator-assistant";
import type {
  WorkbenchV2ContextDraft,
  WorkbenchV2DraftLayer,
  WorkbenchV2StudyMode
} from "./workbench-v2-project-snapshot";

export type WorkbenchV2AssistantCandidateApplyPreviewSummary = {
  outputRows: readonly WorkbenchV2CalculatorAssistantOutputRow[];
  primaryOutput?: string;
  routeStatus: "needs_input" | "not_run" | "ready" | "unsupported";
  snapshotSignature?: string;
};

export type WorkbenchV2AssistantCandidateApplyProposalInput = {
  candidate: WorkbenchV2AssistantLayerStackCandidateStack;
  materials: readonly MaterialDefinition[];
  requestedOutputs: readonly RequestedOutputId[];
  targetWorkbench: {
    context: WorkbenchV2ContextDraft;
    layers: readonly WorkbenchV2DraftLayer[];
    mode: WorkbenchV2StudyMode;
    selectedOutputs: readonly RequestedOutputId[];
  };
  preview?: WorkbenchV2AssistantCandidateApplyPreviewSummary;
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

  return `candidate:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function materialById(materials: readonly MaterialDefinition[]): ReadonlyMap<string, MaterialDefinition> {
  return new Map(materials.map((material) => [material.id, material]));
}

function parsePositiveThicknessMm(value: string): number | undefined {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function parsePositiveContextNumber(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  return parsePositiveThicknessMm(value);
}

function normalizeDraftRole(role: string): ReportAssistantLayerStackDraftLayerRole {
  switch (role) {
    case "cavity":
    case "core":
    case "finish":
    case "resilient_layer":
    case "side_a":
    case "side_b":
    case "slab":
      return role;
    default:
      return "unknown";
  }
}

function layerOriginalPhrase(input: {
  layer: WorkbenchV2DraftLayer;
  materialName: string;
}): string {
  const thickness = input.layer.thicknessMm.trim();
  return thickness ? `${thickness} mm ${input.materialName}` : input.materialName;
}

function candidateLayersToDraftLayers(input: {
  candidate: WorkbenchV2AssistantLayerStackCandidateStack;
  materials: readonly MaterialDefinition[];
}): ReportAssistantLayerStackDraftLayer[] {
  const materials = materialById(input.materials);

  return input.candidate.layers.map((layer): ReportAssistantLayerStackDraftLayer => {
    const material = materials.get(layer.materialId);
    const materialName = material?.name ?? layer.materialId;

    return {
      id: layer.id,
      materialId: layer.materialId,
      materialName,
      originalPhrase: layerOriginalPhrase({
        layer,
        materialName
      }),
      role: normalizeDraftRole(layer.role),
      thicknessMm: parsePositiveThicknessMm(layer.thicknessMm)
    };
  });
}

function buildWallTopologyDraft(input: {
  candidate: WorkbenchV2AssistantLayerStackCandidateStack;
  mergedContext: Partial<WorkbenchV2ContextDraft>;
}): ReportAssistantLayerStackDraft["wallTopologyDraft"] {
  if (input.candidate.mode !== "wall") {
    return undefined;
  }

  const hasCavity = input.candidate.layers.some((layer) => layer.role === "cavity");
  const hasSideA = input.candidate.layers.some((layer) => layer.role === "side_a");
  const hasSideB = input.candidate.layers.some((layer) => layer.role === "side_b");

  if (!hasCavity) {
    return {
      leafMapping: "not_required",
      topology: "single_leaf"
    };
  }

  return {
    leafMapping: hasSideA && hasSideB ? "explicit" : "missing",
    supportSpacingMm: parsePositiveContextNumber(input.mergedContext.supportSpacingMm),
    supportTopology: input.mergedContext.wallSupportTopology ?? "unknown",
    topology: "double_leaf_framed"
  };
}

function buildCandidateDraft(input: {
  candidate: WorkbenchV2AssistantLayerStackCandidateStack;
  materials: readonly MaterialDefinition[];
  requestedOutputs: readonly RequestedOutputId[];
  targetContext: WorkbenchV2ContextDraft;
}): ReportAssistantLayerStackDraft {
  const mergedContext: Partial<WorkbenchV2ContextDraft> = {
    ...input.targetContext,
    ...input.candidate.contextPatch
  };
  const contextSignature = hashSignature(stableStringify({
    candidateId: input.candidate.candidateId,
    contextPatch: input.candidate.contextPatch,
    layers: input.candidate.layers,
    requestedOutputs: input.requestedOutputs,
    sourceLayerSignature: input.candidate.sourceLayerSignature
  }));
  const draftLayers = candidateLayersToDraftLayers({
    candidate: input.candidate,
    materials: input.materials
  });

  return {
    assumptions: [],
    contextSignature,
    customMaterials: [],
    draftId: `draft.${input.candidate.candidateId}`,
    layers: draftLayers,
    mode: input.candidate.mode,
    originalPhrases: draftLayers.map((layer) => layer.originalPhrase),
    requestedOutputs: [...input.requestedOutputs],
    source: "current_workbench_stack",
    sourceInstruction: `Apply assistant candidate ${input.candidate.label}`,
    wallTopologyDraft: buildWallTopologyDraft({
      candidate: input.candidate,
      mergedContext
    }),
    warnings: [
      ...input.candidate.warnings,
      "Objective candidate apply requires confirmation before the visible Workbench draft changes."
    ]
  };
}

function basisFromPreview(preview: WorkbenchV2AssistantCandidateApplyPreviewSummary | undefined): ReportAssistantResultBasis[] {
  if (!preview || preview.routeStatus !== "ready") {
    return [];
  }

  return preview.outputRows
    .filter((row) => row.status === "live")
    .map((row) => ({
      basis: "workbench_v2_candidate_preview",
      metricId: row.label,
      routeStatus: "ready" as const,
      unit: row.value.includes("dB") ? "dB" : undefined,
      valueLabel: row.value
    }));
}

function calculatorPreviewSummary(
  preview: WorkbenchV2AssistantCandidateApplyPreviewSummary | undefined,
  requestedOutputs: readonly RequestedOutputId[]
): Partial<ReportAssistantWorkbenchApplyCalculatorPreviewSummary> | undefined {
  if (!preview) {
    return undefined;
  }

  return {
    basis: basisFromPreview(preview),
    ...(preview.primaryOutput ? { primaryOutput: preview.primaryOutput } : {}),
    routeStatus: preview.routeStatus,
    selectedOutputs: requestedOutputs,
    ...(preview.snapshotSignature ? { snapshotSignature: preview.snapshotSignature } : {})
  };
}

export function createWorkbenchV2AssistantCandidateApplyProposal(
  input: WorkbenchV2AssistantCandidateApplyProposalInput
): ReportAssistantWorkbenchApplyProposalResult {
  const targetWorkbench = {
    ...input.targetWorkbench,
    snapshotSignature: createReportAssistantWorkbenchApplyTargetSignature(input.targetWorkbench)
  };
  const draft = buildCandidateDraft({
    candidate: input.candidate,
    materials: input.materials,
    requestedOutputs: input.requestedOutputs,
    targetContext: input.targetWorkbench.context
  });

  return createReportAssistantWorkbenchApplyProposal({
    calculatorPreviewSummary: calculatorPreviewSummary(input.preview, input.requestedOutputs),
    draft,
    expectedSourceDraftContextSignature: draft.contextSignature,
    expectedTargetWorkbenchSnapshotSignature: targetWorkbench.snapshotSignature,
    targetWorkbench
  });
}

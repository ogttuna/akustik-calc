import type { MaterialDefinition, RequestedOutputId } from "@dynecho/shared";

import type {
  ReportAssistantLayerStackDraft,
  ReportAssistantLayerStackDraftLayer,
  ReportAssistantLayerStackDraftLayerRole
} from "../workbench/report-assistant-layer-stack-draft";
import {
  createReportAssistantWorkbenchApplyProposal,
  createReportAssistantWorkbenchApplyTargetSignature,
  type ReportAssistantWorkbenchApplyProposalResult
} from "../workbench/report-assistant-workbench-apply-proposal";
import {
  type WorkbenchV2AssistantBoundedEditPlanResult
} from "./workbench-v2-assistant-bounded-edit-plan";
import type {
  WorkbenchV2ContextDraft,
  WorkbenchV2DraftLayer,
  WorkbenchV2StudyMode
} from "./workbench-v2-project-snapshot";

export type WorkbenchV2AssistantBoundedEditPlanApplyProposalInput = {
  materials: readonly MaterialDefinition[];
  plan: WorkbenchV2AssistantBoundedEditPlanResult;
  targetWorkbench: {
    context: WorkbenchV2ContextDraft;
    layers: readonly WorkbenchV2DraftLayer[];
    mode: WorkbenchV2StudyMode;
    selectedOutputs: readonly RequestedOutputId[];
  };
};

export type WorkbenchV2AssistantBoundedEditPlanApplyProposalResult =
  | ReportAssistantWorkbenchApplyProposalResult
  | {
      code: "blocked_plan";
      errors: readonly string[];
      mutates: false;
      ok: false;
      statusCode: 400;
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

  return `bounded-plan:${(hash >>> 0).toString(16).padStart(8, "0")}`;
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

function planLayersToDraftLayers(input: {
  layers: readonly WorkbenchV2DraftLayer[];
  materials: readonly MaterialDefinition[];
}): ReportAssistantLayerStackDraftLayer[] {
  const materials = materialById(input.materials);

  return input.layers.map((layer): ReportAssistantLayerStackDraftLayer => {
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
  contextPatch: Partial<WorkbenchV2ContextDraft>;
  layers: readonly WorkbenchV2DraftLayer[];
}): ReportAssistantLayerStackDraft["wallTopologyDraft"] {
  const hasCavity = input.layers.some((layer) => layer.role === "cavity");
  const hasSideA = input.layers.some((layer) => layer.role === "side_a");
  const hasSideB = input.layers.some((layer) => layer.role === "side_b");

  if (!hasCavity) {
    return {
      leafMapping: "not_required",
      topology: "single_leaf"
    };
  }

  return {
    leafMapping: hasSideA && hasSideB ? "explicit" : "missing",
    supportSpacingMm: parsePositiveContextNumber(input.contextPatch.supportSpacingMm),
    supportTopology: input.contextPatch.wallSupportTopology ?? "unknown",
    topology: "double_leaf_framed"
  };
}

function buildPlanDraft(input: {
  materials: readonly MaterialDefinition[];
  plan: Extract<WorkbenchV2AssistantBoundedEditPlanResult, { ok: true }>;
}): ReportAssistantLayerStackDraft {
  const contextSignature = hashSignature(stableStringify({
    contextPatch: input.plan.contextPatch,
    finalLayerSignature: input.plan.finalLayerSignature,
    initialLayerSignature: input.plan.initialLayerSignature,
    planId: input.plan.planId,
    selectedOutputs: input.plan.selectedOutputs,
    steps: input.plan.steps.map((step) => ({
      commandKind: step.commandKind,
      stepId: step.stepId
    }))
  }));
  const layers = planLayersToDraftLayers({
    layers: input.plan.finalLayers,
    materials: input.materials
  });

  return {
    assumptions: [],
    contextSignature,
    customMaterials: [],
    draftId: `draft.${input.plan.planId}`,
    layers,
    mode: input.plan.mode,
    originalPhrases: layers.map((layer) => layer.originalPhrase),
    requestedOutputs: [...input.plan.selectedOutputs],
    source: "current_workbench_stack",
    sourceInstruction: `Apply bounded assistant edit plan ${input.plan.planId}`,
    wallTopologyDraft: input.plan.mode === "wall"
      ? buildWallTopologyDraft({
          contextPatch: input.plan.contextPatch,
          layers: input.plan.finalLayers
        })
      : undefined,
    warnings: [
      ...input.plan.warnings,
      "Bounded edit-plan apply requires confirmation before the visible Workbench draft changes.",
      "This proposal is derived from a dry-run plan; no calculator value is written by the assistant."
    ]
  };
}

export function createWorkbenchV2AssistantBoundedEditPlanApplyProposal(
  input: WorkbenchV2AssistantBoundedEditPlanApplyProposalInput
): WorkbenchV2AssistantBoundedEditPlanApplyProposalResult {
  if (!input.plan.ok) {
    return {
      code: "blocked_plan",
      errors: [input.plan.message],
      mutates: false,
      ok: false,
      statusCode: 400,
      warnings: input.plan.warnings
    };
  }

  const targetWorkbench = {
    ...input.targetWorkbench,
    snapshotSignature: createReportAssistantWorkbenchApplyTargetSignature(input.targetWorkbench)
  };
  const draft = buildPlanDraft({
    materials: input.materials,
    plan: input.plan
  });

  const result = createReportAssistantWorkbenchApplyProposal({
    draft,
    expectedSourceDraftContextSignature: draft.contextSignature,
    expectedTargetWorkbenchSnapshotSignature: targetWorkbench.snapshotSignature,
    targetWorkbench
  });

  if (!result.ok) {
    return result;
  }

  return {
    ...result,
    proposal: {
      ...result.proposal,
      title: "Apply bounded edit plan to draft"
    }
  };
}

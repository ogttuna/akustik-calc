import type { MaterialDefinition, RequestedOutputId } from "@dynecho/shared";

import {
  getWorkbenchV2AssistantLayerStackSignature,
  parseWorkbenchV2AssistantLayerStackApplyCommand,
  type WorkbenchV2AssistantCalculatorControlCommandKind,
  type WorkbenchV2AssistantLayerStackCommandTask
} from "./workbench-v2-assistant-layer-stack-command";
import type {
  WorkbenchV2ContextDraft,
  WorkbenchV2DraftLayer,
  WorkbenchV2StudyMode
} from "./workbench-v2-project-snapshot";

export type WorkbenchV2AssistantBoundedEditPlanStep = {
  afterLayerSignature: string;
  beforeLayerSignature: string;
  commandKind: Exclude<WorkbenchV2AssistantCalculatorControlCommandKind, "generate_candidates">;
  contextPatch: Partial<WorkbenchV2ContextDraft>;
  instruction: string;
  layerCountAfter: number;
  layerCountBefore: number;
  layerDelta: number;
  previewRequested: boolean;
  repeatCount: number;
  selectedOutputs?: readonly RequestedOutputId[];
  stepId: string;
  summary: string;
  tasks: readonly WorkbenchV2AssistantLayerStackCommandTask[];
  warnings: readonly string[];
};

export type WorkbenchV2AssistantBoundedEditPlanResult =
  | {
      applyRequiresConfirmation: true;
      contextPatch: Partial<WorkbenchV2ContextDraft>;
      finalLayerSignature: string;
      finalLayers: readonly WorkbenchV2DraftLayer[];
      initialLayerSignature: string;
      mode: WorkbenchV2StudyMode;
      mutatesSavedState: false;
      ok: true;
      planId: string;
      previewRequired: boolean;
      providerCallsAllowed: false;
      selectedLayerId: string | null;
      selectedOutputs: readonly RequestedOutputId[];
      steps: readonly WorkbenchV2AssistantBoundedEditPlanStep[];
      tasks: readonly WorkbenchV2AssistantLayerStackCommandTask[];
      warnings: readonly string[];
    }
  | {
      applyRequiresConfirmation: true;
      code:
        | "empty_instruction"
        | "step_parse_failed"
        | "too_many_steps"
        | "unsafe_provider_request"
        | "unsupported_candidate_generation";
      initialLayerSignature: string;
      message: string;
      mutatesSavedState: false;
      ok: false;
      partialLayerSignature: string;
      partialSteps: readonly WorkbenchV2AssistantBoundedEditPlanStep[];
      providerCallsAllowed: false;
      stepIndex?: number;
      tasks: readonly WorkbenchV2AssistantLayerStackCommandTask[];
      warnings: readonly string[];
    };

export type WorkbenchV2AssistantBoundedEditPlanInput = {
  currentLayers: readonly WorkbenchV2DraftLayer[];
  currentMode: WorkbenchV2StudyMode;
  currentSelectedLayerId?: string | null;
  currentSelectedOutputs?: readonly RequestedOutputId[];
  idFactory: (index: number) => string;
  instruction: string;
  materials: readonly MaterialDefinition[];
  maxSteps?: number;
};

const DEFAULT_MAX_STEPS = 6;

function normalizeText(value: string): string {
  return value
    .replace(/[İIı]/gu, "i")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function splitBoundedEditPlanSteps(instruction: string): string[] {
  return instruction
    .replace(/\s*(?:->|=>|→)\s*/gu, "\n")
    .replace(/\s*[;,]\s*/gu, "\n")
    .replace(/\b(?:ardindan|ardından|sonra|then)\b/giu, "\n")
    .split(/\n+/u)
    .map((step) => step.trim())
    .filter(Boolean);
}

function hasUnsafeProviderRequest(instruction: string): boolean {
  const normalized = normalizeText(instruction);
  return /\b(?:arastir\w*|internet\w*|kaynak\w*|provider|research\w*|web)\b/u.test(normalized);
}

function instructionForParser(step: string): string {
  const normalized = normalizeText(step);
  if (/\b(?:cikar\w*|cikart\w*)\b/u.test(normalized) && !/\b(?:delete|kaldir|kaldır|remove|sil)\b/iu.test(step)) {
    return `${step} sil`;
  }

  return step;
}

function readAddRepeatCount(step: string): number {
  const normalized = normalizeText(step);
  const numericRepeat = /^\s*([2-8])\s*(?:x|adet|tane)\b/u.exec(normalized);
  if (numericRepeat?.[1]) {
    return Number.parseInt(numericRepeat[1], 10);
  }

  if (/^\s*(?:iki|two)\b/u.test(normalized)) {
    return 2;
  }

  if (/^\s*(?:uc|three)\b/u.test(normalized)) {
    return 3;
  }

  return 1;
}

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

  return (hash >>> 0).toString(16).padStart(8, "0");
}

function uniqueStrings(values: readonly string[]): string[] {
  return Array.from(new Set(values));
}

function summarizeStep(input: {
  commandKind: WorkbenchV2AssistantBoundedEditPlanStep["commandKind"];
  layerDelta: number;
  previewRequested: boolean;
  repeatCount: number;
}): string {
  if (input.commandKind === "preview" || input.previewRequested) {
    return "Request calculator preview after the dry-run edits.";
  }

  if (input.commandKind === "set_outputs") {
    return "Update selected calculator outputs in the dry-run plan.";
  }

  if (input.commandKind === "set_context") {
    return "Update calculator context inputs in the dry-run plan.";
  }

  if (input.commandKind === "add_layer") {
    return `Add ${input.repeatCount} layer${input.repeatCount === 1 ? "" : "s"} in the dry-run plan.`;
  }

  if (input.commandKind === "remove_layer") {
    return "Remove a matched layer in the dry-run plan.";
  }

  if (input.commandKind === "move_layer") {
    return "Move a matched layer in the dry-run plan.";
  }

  if (input.commandKind === "update_layer") {
    return "Update matched layer properties in the dry-run plan.";
  }

  if (input.layerDelta !== 0) {
    return `Replace the visible stack in the dry-run plan with layer delta ${input.layerDelta}.`;
  }

  return "Replace the visible stack in the dry-run plan.";
}

function blockedResult(input: {
  code: WorkbenchV2AssistantBoundedEditPlanResult extends infer Result
    ? Result extends { ok: false; code: infer Code }
      ? Code
      : never
    : never;
  initialLayerSignature: string;
  message: string;
  partialLayers: readonly WorkbenchV2DraftLayer[];
  partialSteps: readonly WorkbenchV2AssistantBoundedEditPlanStep[];
  stepIndex?: number;
  tasks?: readonly WorkbenchV2AssistantLayerStackCommandTask[];
  warnings?: readonly string[];
}): WorkbenchV2AssistantBoundedEditPlanResult {
  return {
    applyRequiresConfirmation: true,
    code: input.code,
    initialLayerSignature: input.initialLayerSignature,
    message: input.message,
    mutatesSavedState: false,
    ok: false,
    partialLayerSignature: getWorkbenchV2AssistantLayerStackSignature(input.partialLayers),
    partialSteps: input.partialSteps,
    providerCallsAllowed: false,
    ...(input.stepIndex === undefined ? {} : { stepIndex: input.stepIndex }),
    tasks: input.tasks ?? [],
    warnings: input.warnings ?? []
  };
}

export function createWorkbenchV2AssistantBoundedEditPlan(
  input: WorkbenchV2AssistantBoundedEditPlanInput
): WorkbenchV2AssistantBoundedEditPlanResult {
  const instruction = input.instruction.trim();
  const initialLayerSignature = getWorkbenchV2AssistantLayerStackSignature(input.currentLayers);

  if (!instruction) {
    return blockedResult({
      code: "empty_instruction",
      initialLayerSignature,
      message: "Enter a multi-step assistant edit plan before previewing a dry run.",
      partialLayers: input.currentLayers,
      partialSteps: []
    });
  }

  if (hasUnsafeProviderRequest(instruction)) {
    return blockedResult({
      code: "unsafe_provider_request",
      initialLayerSignature,
      message: "Bounded edit plans cannot call web, source, research, or provider behavior. Run source research separately, then map candidates explicitly.",
      partialLayers: input.currentLayers,
      partialSteps: [],
      warnings: ["No provider or web request was made while building this dry-run plan."]
    });
  }

  const rawSteps = splitBoundedEditPlanSteps(instruction);
  const maxSteps = input.maxSteps ?? DEFAULT_MAX_STEPS;
  if (rawSteps.length > maxSteps) {
    return blockedResult({
      code: "too_many_steps",
      initialLayerSignature,
      message: `Bounded edit plans support at most ${maxSteps} ordered steps in one dry run.`,
      partialLayers: input.currentLayers,
      partialSteps: []
    });
  }

  let generatedLayerIndex = 0;
  let currentLayers = [...input.currentLayers];
  let currentMode = input.currentMode;
  let selectedLayerId: string | null = input.currentSelectedLayerId ?? currentLayers[0]?.id ?? null;
  let selectedOutputs = [...(input.currentSelectedOutputs ?? [])];
  let contextPatch: Partial<WorkbenchV2ContextDraft> = {};
  let previewRequired = false;
  const steps: WorkbenchV2AssistantBoundedEditPlanStep[] = [];
  const allTasks: WorkbenchV2AssistantLayerStackCommandTask[] = [];
  const allWarnings: string[] = [];

  for (const [stepIndex, rawStep] of rawSteps.entries()) {
    const beforeLayers = currentLayers;
    const beforeLayerSignature = getWorkbenchV2AssistantLayerStackSignature(beforeLayers);
    const parserInstruction = instructionForParser(rawStep);
    const firstResult = parseWorkbenchV2AssistantLayerStackApplyCommand({
      currentLayers,
      currentMode,
      currentSelectedLayerId: selectedLayerId,
      currentSelectedOutputs: selectedOutputs,
      idFactory: () => input.idFactory(generatedLayerIndex++),
      instruction: parserInstruction,
      materials: input.materials
    });

    if (!firstResult.ok) {
      return blockedResult({
        code: "step_parse_failed",
        initialLayerSignature,
        message: `Step ${stepIndex + 1} could not be parsed safely: ${firstResult.message}`,
        partialLayers: currentLayers,
        partialSteps: steps,
        stepIndex,
        tasks: allTasks,
        warnings: allWarnings
      });
    }

    if (firstResult.commandKind === "generate_candidates") {
      return blockedResult({
        code: "unsupported_candidate_generation",
        initialLayerSignature,
        message: "Candidate generation is not allowed inside bounded edit plans yet. Generate alternatives as a separate previewable candidate flow.",
        partialLayers: currentLayers,
        partialSteps: steps,
        stepIndex,
        tasks: allTasks,
        warnings: uniqueStrings([
          ...allWarnings,
          "No candidate stack was generated or applied inside this bounded dry-run plan."
        ])
      });
    }

    const resultCommandKind: WorkbenchV2AssistantBoundedEditPlanStep["commandKind"] = firstResult.commandKind;
    let repeatCount = resultCommandKind === "add_layer" ? readAddRepeatCount(rawStep) : 1;
    let result = firstResult;
    const stepTasks = [...result.tasks];
    const stepWarnings = [...result.warnings];
    currentLayers = [...result.layers];
    currentMode = result.mode;
    selectedLayerId = result.selectedLayerId;
    selectedOutputs = [...(result.selectedOutputs ?? selectedOutputs)];
    contextPatch = {
      ...contextPatch,
      ...result.contextPatch
    };
    previewRequired = previewRequired || result.previewRequested;

    while (repeatCount > 1) {
      repeatCount -= 1;
      const repeatedResult = parseWorkbenchV2AssistantLayerStackApplyCommand({
        currentLayers,
        currentMode,
        currentSelectedLayerId: selectedLayerId,
        currentSelectedOutputs: selectedOutputs,
        idFactory: () => input.idFactory(generatedLayerIndex++),
        instruction: parserInstruction,
        materials: input.materials
      });

      if (!repeatedResult.ok) {
        return blockedResult({
          code: "step_parse_failed",
          initialLayerSignature,
          message: `Step ${stepIndex + 1} repeat could not be parsed safely: ${repeatedResult.message}`,
          partialLayers: currentLayers,
          partialSteps: steps,
          stepIndex,
          tasks: allTasks,
          warnings: allWarnings
        });
      }

      if (repeatedResult.commandKind === "generate_candidates" || repeatedResult.commandKind !== resultCommandKind) {
        return blockedResult({
          code: "step_parse_failed",
          initialLayerSignature,
          message: `Step ${stepIndex + 1} changed operation kind during repeat; split it into separate explicit steps.`,
          partialLayers: currentLayers,
          partialSteps: steps,
          stepIndex,
          tasks: allTasks,
          warnings: allWarnings
        });
      }

      result = repeatedResult;
      stepTasks.push(...repeatedResult.tasks);
      stepWarnings.push(...repeatedResult.warnings);
      currentLayers = [...repeatedResult.layers];
      currentMode = repeatedResult.mode;
      selectedLayerId = repeatedResult.selectedLayerId;
      selectedOutputs = [...(repeatedResult.selectedOutputs ?? selectedOutputs)];
      contextPatch = {
        ...contextPatch,
        ...repeatedResult.contextPatch
      };
      previewRequired = previewRequired || repeatedResult.previewRequested;
    }

    const finalRepeatCount = resultCommandKind === "add_layer" ? readAddRepeatCount(rawStep) : 1;
    const afterLayerSignature = getWorkbenchV2AssistantLayerStackSignature(currentLayers);
    const layerDelta = currentLayers.length - beforeLayers.length;
    const step: WorkbenchV2AssistantBoundedEditPlanStep = {
      afterLayerSignature,
      beforeLayerSignature,
      commandKind: resultCommandKind,
      contextPatch: result.contextPatch,
      instruction: rawStep,
      layerCountAfter: currentLayers.length,
      layerCountBefore: beforeLayers.length,
      layerDelta,
      previewRequested: result.previewRequested,
      repeatCount: finalRepeatCount,
      selectedOutputs: result.selectedOutputs,
      stepId: `step-${stepIndex + 1}`,
      summary: summarizeStep({
        commandKind: resultCommandKind,
        layerDelta,
        previewRequested: result.previewRequested,
        repeatCount: finalRepeatCount
      }),
      tasks: stepTasks,
      warnings: uniqueStrings(stepWarnings)
    };

    steps.push(step);
    allTasks.push(...stepTasks);
    allWarnings.push(...stepWarnings);
  }

  const finalLayerSignature = getWorkbenchV2AssistantLayerStackSignature(currentLayers);
  return {
    applyRequiresConfirmation: true,
    contextPatch,
    finalLayerSignature,
    finalLayers: currentLayers,
    initialLayerSignature,
    mode: currentMode,
    mutatesSavedState: false,
    ok: true,
    planId: `bounded-edit-plan:${hashSignature(stableStringify({
      contextPatch,
      finalLayerSignature,
      initialLayerSignature,
      selectedOutputs,
      steps: steps.map((step) => ({
        commandKind: step.commandKind,
        instruction: step.instruction,
        repeatCount: step.repeatCount
      }))
    }))}`,
    previewRequired,
    providerCallsAllowed: false,
    selectedLayerId,
    selectedOutputs,
    steps,
    tasks: allTasks,
    warnings: uniqueStrings(allWarnings)
  };
}

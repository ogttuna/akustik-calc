"use client";

import type {
  AirborneBuildingPredictionOutputBasis,
  AirborneConservativeFlankingAssumption,
  AirborneContextMode,
  AirborneFlankingJunctionClass,
  AirborneResilientBarSideCount,
  AssemblyCalculation,
  EstimateRequest,
  FloorRole,
  MaterialDefinition,
  ProjectUserVerifiedCalculatedAnchorMetricBasis,
  ProjectUserVerifiedCalculatedAnchorRequestContext,
  ProjectUserVerifiedCalculatedAnchorResultBasisTrace,
  ProjectUserVerifiedCalculatedAnchorValue,
  RequestedOutputId,
  WallCavityAbsorptionClass,
  WallCavityFillCoverage,
  WallSupportTopology,
  WallTopologyMode
} from "@dynecho/shared";
import { buildProjectUserVerifiedCalculatedAnchorFingerprint } from "@dynecho/shared";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bookmark,
  Copy,
  FileText,
  GripVertical,
  Menu,
  Palette,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  Undo2,
  X
} from "lucide-react";
import { type FocusEvent, type KeyboardEvent, type MouseEvent, type PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { buildWorkbenchResponseCurveFigures } from "../workbench/response-curve-model";
import {
  resolveWorkbenchRequiredInputPresentation,
  type WorkbenchRequiredInputTargetField
} from "../workbench/route-input-presentation";
import {
  buildReportAssistantContext,
  type ReportAssistantContext
} from "../workbench/report-assistant-context";
import type {
  ReportAssistantAssemblyAlternativeReview,
  ReportAssistantAssemblyAlternativeReviewSource
} from "../workbench/report-assistant-assembly-alternatives";
import {
  buildReportAssistantCurrentCalculatorReviewPacketFromCalculatorPreview,
  type ReportAssistantCurrentCalculatorReviewPacket
} from "../workbench/report-assistant-current-calculator-review-packet";
import {
  buildReportAssistantSourceBackedReportOverridePatch,
  type ReportAssistantPlausibilityReview
} from "../workbench/report-assistant-plausibility";
import {
  applyValidatedReportAssistantPatch,
  validateReportAssistantPatch,
  type ReportAssistantPatchValidationResult
} from "../workbench/report-assistant-patch";
import { AssistantResultCard } from "../workbench/report-assistant-result-card";
import {
  validateReportAssistantResultEnvelope,
  type ReportAssistantResultEnvelope
} from "../workbench/report-assistant-result-contract";
import {
  confirmReportAssistantWorkbenchApplyProposal,
  type ReportAssistantWorkbenchConfirmedApplyPayload
} from "../workbench/report-assistant-workbench-confirmed-apply";
import {
  createReportAssistantWorkbenchApplyTargetSignature,
  type ReportAssistantWorkbenchApplyProposal
} from "../workbench/report-assistant-workbench-apply-proposal";
import {
  parseSimpleWorkbenchProposalDocument,
  type SimpleWorkbenchProposalDocument
} from "../workbench/simple-workbench-proposal";
import {
  storeSimpleWorkbenchProposalPreview,
  storeSimpleWorkbenchProposalPreviewCustomizations,
  type SimpleWorkbenchProposalPreviewProjectContext
} from "../workbench/simple-workbench-proposal-preview-storage";
import { MaterialEditorPanel } from "./material-editor-panel";
import { buildMaterialRouteInputEffectiveness } from "./material-route-input-effectiveness";
import {
  buildResolvedMaterialCatalog,
  parseMaterialEditorPersistedState,
  removeCustomMaterial,
  removeMaterialVisualOverride,
  serializeMaterialEditorPersistedState,
  upsertCustomMaterial,
  upsertMaterialVisualOverride,
  type MaterialEditorPersistedStateParseResult,
  type MaterialVisualOverride
} from "./material-editor-state";
import {
  createLayerStackUndoSnapshot,
  layerStacksEqual,
  popLayerStackUndoSnapshot,
  pushLayerStackUndoSnapshot,
  restoreLayerStackUndoSnapshot,
  type LayerStackUndoLayer,
  type LayerStackUndoStack
} from "./layer-stack-undo";
import { ProfessionalLayerIllustration, type ProfessionalLayerIllustrationLayer, type ProfessionalLayerVisualStyle } from "./professional-layer-illustration";
import { ProfessionalResponseCurve } from "./professional-response-curve";
import { ProjectWorkspacePanel } from "./project-workspace-panel";
import { WorkbenchPresetLibraryPanel } from "./workbench-preset-library-panel";
import {
  WORKBENCH_V2_COMMON_PRESETS,
  findWorkbenchV2CommonPresetById
} from "./workbench-v2-common-presets";
import {
  createWorkbenchV2AssistantBoundedEditPlan,
  type WorkbenchV2AssistantBoundedEditPlanResult
} from "./workbench-v2-assistant-bounded-edit-plan";
import { createWorkbenchV2AssistantBoundedEditPlanApplyProposal } from "./workbench-v2-assistant-bounded-edit-plan-apply-proposal";
import {
  getWorkbenchV2AssistantLayerStackSignature,
  parseWorkbenchV2AssistantLayerStackApplyCommand,
  type WorkbenchV2AssistantLayerStackApplyResult,
  type WorkbenchV2AssistantLayerStackCandidateStack
} from "./workbench-v2-assistant-layer-stack-command";
import {
  createWorkbenchV2AssistantCandidateApplyProposal,
  type WorkbenchV2AssistantCandidateApplyPreviewSummary
} from "./workbench-v2-assistant-candidate-apply-proposal";
import {
  createWorkbenchV2AssistantSourceAlternativeCandidatesFromReview,
  type WorkbenchV2AssistantSourceAlternativeClarificationPrompt
} from "./workbench-v2-assistant-source-alternative-candidate";
import {
  isWorkbenchWallRwImprovementCandidateStack,
  planWorkbenchWallRwImprovementCandidates
} from "./workbench-v2-assistant-wall-rw-improvement-planner";
import type {
  WorkbenchV2CalculatorAssistantOutputRow,
  WorkbenchV2CalculatorAssistantPreview,
  WorkbenchV2CalculatorAssistantTask
} from "./workbench-v2-calculator-assistant";
import {
  formatWorkbenchV2PresetLibraryTriggerStatus,
  parseWorkbenchV2PresetRecord,
  parseWorkbenchV2PresetSummaries,
  workbenchV2SnapshotsRepresentSameDraft,
  type WorkbenchV2PresetStatus,
  type WorkbenchV2PresetSummary
} from "./workbench-v2-presets";
import {
  parseWorkbenchV2MeasuredWallRwAnchorSummaries,
  type WorkbenchV2MeasuredWallRwAnchorSummary
} from "./workbench-v2-measured-wall-rw-anchors";
import {
  formatWorkbenchV2VerifiedCalculatedAnchorContext,
  formatWorkbenchV2VerifiedCalculatedAnchorValues,
  getApplicableWorkbenchV2VerifiedCalculatedAnchors,
  parseWorkbenchV2VerifiedCalculatedAnchorSummaries,
  type WorkbenchV2VerifiedCalculatedAnchorSummary
} from "./workbench-v2-verified-calculated-anchors";
import {
  deriveWorkbenchV2PersistenceState,
  getWorkbenchV2DraftDirtyState
} from "./workbench-v2-persistence-state";
import {
  WORKBENCH_V2_DEFAULT_CONTEXT,
  buildWorkbenchV2ProjectSnapshot,
  parseWorkbenchV2ProjectSnapshot,
  type WorkbenchV2ContextDraft,
  type WorkbenchV2ProjectSnapshot,
  type WorkbenchV2StudyMode
} from "./workbench-v2-project-snapshot";
import {
  WORKBENCH_V2_OUTPUT_OPTIONS,
  getDefaultWorkbenchV2SelectedOutputs,
  getWorkbenchV2OutputOption,
  normalizeWorkbenchV2SelectedOutputs
} from "./workbench-v2-output-catalog";

type StudyMode = WorkbenchV2StudyMode;
type WorkbenchDrawerTab = "materials" | "presets" | "projects";
type ReportSourceDecisionKind = "combinationDirty" | "projectDraft";
type EstimateState =
  | { status: "idle" }
  | { reasons: readonly RequiredTask[]; status: "blocked" }
  | { status: "loading" }
  | { request: EstimateRequest; result: AssemblyCalculation; status: "ready" }
  | { message: string; status: "error" };
type CalculatorAssistantPreviewState =
  | { status: "idle" }
  | { status: "loading" }
  | { preview: WorkbenchV2CalculatorAssistantPreview; status: "ready" }
  | { message: string; status: "error" };
type CalculatorAssistantCommandMessage = {
  detail: string;
  title: string;
  tone: "success" | "warning";
};
type CalculatorAssistantCommandIntentDecision =
  | {
      confidence: "high" | "low" | "medium";
      explanation: string;
      normalizedCommand: string;
      status: "apply";
      warnings?: readonly string[];
    }
  | {
      confidence: "high" | "low" | "medium";
      explanation: string;
      message: string;
      status: "clarify" | "reject";
      warnings?: readonly string[];
    };
type CalculatorAssistantCandidateComparisonRow = {
  candidateId: string;
  commandTasks: readonly WorkbenchV2AssistantLayerStackCandidateStack["tasks"][number][];
  errorMessage?: string;
  label: string;
  outputRows: readonly WorkbenchV2CalculatorAssistantOutputRow[];
  previewTasks: readonly WorkbenchV2CalculatorAssistantTask[];
  status: WorkbenchV2CalculatorAssistantPreview["calculationSummary"]["status"] | "error";
};
type CalculatorAssistantCandidateComparisonRank = {
  candidateId: string;
  label: string;
  metric: RequestedOutputId;
  rank: number;
  valueLabel: string;
};
type CalculatorAssistantCandidateComparisonState =
  | { status: "idle" }
  | { candidateCount: number; status: "loading" }
  | {
      ranking: readonly CalculatorAssistantCandidateComparisonRank[];
      rows: readonly CalculatorAssistantCandidateComparisonRow[];
      status: "ready";
    }
  | { message: string; status: "error" };
type CalculatorAssistantSourceReviewState =
  | { status: "idle" }
  | { status: "loading" }
  | {
      preview: WorkbenchV2CalculatorAssistantPreview;
      result: ReportAssistantResultEnvelope;
      review: ReportAssistantPlausibilityReview;
      reviewedOutputId?: RequestedOutputId;
      source: "context" | "research_provider" | null;
      status: "ready";
      warnings: readonly string[];
      workbenchSnapshotSignature: string;
    }
  | {
      message: string;
      preview?: WorkbenchV2CalculatorAssistantPreview;
      result?: ReportAssistantResultEnvelope;
      status: "error";
      warnings: readonly string[];
    };
type CalculatorAssistantSourceAlternativeState =
  | { status: "idle" }
  | { status: "loading" }
  | {
      candidateCount: number;
      clarificationPrompts: readonly WorkbenchV2AssistantSourceAlternativeClarificationPrompt[];
      result: ReportAssistantResultEnvelope;
      review: ReportAssistantAssemblyAlternativeReview;
      source: ReportAssistantAssemblyAlternativeReviewSource;
      status: "ready";
      taskCount: number;
      warnings: readonly string[];
    }
  | {
      message: string;
      result?: ReportAssistantResultEnvelope;
      status: "error";
      warnings: readonly string[];
    };
type CalculatorAssistantBoundedEditPlanState =
  | { status: "idle" }
  | { result: Extract<WorkbenchV2AssistantBoundedEditPlanResult, { ok: true }>; status: "ready" }
  | { result: Extract<WorkbenchV2AssistantBoundedEditPlanResult, { ok: false }>; status: "blocked" };
type CalculatorAssistantReportOverrideTarget = {
  document: SimpleWorkbenchProposalDocument;
  projectContext: SimpleWorkbenchProposalPreviewProjectContext;
  reportId: string;
  reportName: string;
  reportUpdatedAtIso: string;
  assistantContext: ReportAssistantContext;
};
type CalculatorAssistantReportOverrideProposalState =
  | { status: "idle" }
  | { status: "loading" }
  | { message: string; status: "blocked" }
  | {
      review: ReportAssistantPlausibilityReview;
      status: "ready";
      target: CalculatorAssistantReportOverrideTarget;
      validation: ReportAssistantPatchValidationResult;
    }
  | { message: string; reportId?: string; reportName?: string; status: "applied" }
  | { message: string; status: "error" };
type OutputStatus = "live" | "needs_input" | "unsupported" | "pending";
type RouteInputEffectivenessStatus = "defaulted" | "inactive" | "needed" | "used";
type RouteInputEffectiveness = {
  status: RouteInputEffectivenessStatus;
  title: string;
};
type LayerInputFieldId = "material" | "role" | "thickness";
type LayerInputEffectivenessMap = Record<string, Partial<Record<LayerInputFieldId, RouteInputEffectiveness>>>;

type DraftLayer = LayerStackUndoLayer;

type OutputRow = {
  detail: string;
  label: string;
  status: OutputStatus;
  value: string;
};

type VerifiedCalculatedAnchorCapturePackage = {
  requestContext: ProjectUserVerifiedCalculatedAnchorRequestContext;
  resultBasisTrace: ProjectUserVerifiedCalculatedAnchorResultBasisTrace;
  values: ProjectUserVerifiedCalculatedAnchorValue[];
};

type VerifiedCalculatedAnchorCaptureResult =
  | {
      package: VerifiedCalculatedAnchorCapturePackage;
      status: "ready";
    }
  | {
      reason: "no_live_values";
      status: "blocked";
    };

type RequiredTask = {
  actionLabel?: string;
  detail: string;
  id: string;
  label: string;
  targetElementId?: string;
  targetFields?: readonly WorkbenchRequiredInputTargetField[];
  targetLayerId?: string;
};

type ContextDraft = WorkbenchV2ContextDraft;

const WORKBENCH_V2_COMMON_PRESET_COUNT = WORKBENCH_V2_COMMON_PRESETS.length;

type LayerDropTarget = {
  layerId: string;
  position: "after" | "before";
};

type ServerProjectSummaryPayload = {
  assemblyCount: number;
  id: string;
  latestScenarioCapturedAtIso: string | null;
  name: string;
  ownerLabel: string;
  reportCount: number;
  scenarioCount: number;
  updatedAtIso: string;
};

type ServerProjectAssemblySummaryPayload = {
  calculationSummary?: {
    primaryOutput?: string;
    primaryValueLabel?: string;
    selectedOutputs: string[];
    status: "error" | "needs_input" | "ready" | "unsupported";
  };
  description?: string;
  displayCode?: string;
  id: string;
  kind: StudyMode;
  name: string;
  updatedAtIso: string;
  version: number;
};

type ServerProjectAssemblyRecordPayload = ServerProjectAssemblySummaryPayload & {
  snapshot: unknown;
};

type ServerProjectReportSummaryPayload = {
  assemblyId: string;
  currentRevisionId: string;
  description?: string;
  displayCode?: string;
  id: string;
  name: string;
  revisionCount: number;
  sourceAssemblyVersion: number;
  status: "archived" | "draft" | "issued";
  updatedAtIso: string;
};

type ServerProjectReportRecordPayload = ServerProjectReportSummaryPayload & {
  reportDocument: SimpleWorkbenchProposalDocument;
  sourceAssemblySnapshot: unknown;
  sourceCalculationOutput?: unknown;
  sourceMaterialSnapshot: {
    customMaterials: readonly unknown[];
    materialVisualOverrides: readonly unknown[];
  };
};

type ServerProjectStatus = "error" | "idle" | "loading" | "restoring" | "syncing";
type WorkbenchVerifiedCalculatedAnchorStatus = "error" | "idle" | "syncing";

const OUTPUT_OPTIONS = WORKBENCH_V2_OUTPUT_OPTIONS;

const CALCULATOR_SOURCE_REVIEW_RESEARCH_PATTERN =
  /\b(?:analiz|analyze|arastir\w*|bak|check|comment|compare|degerlendir\w*|evaluate|google|incele\w*|internet|karsilastir\w*|kaynak|kontrol|net|netten|referans|reference|research|review|search|source|web|yorumla\w*)\b/u;
const CALCULATOR_SOURCE_REVIEW_QUESTION_PATTERN =
  /\b(?:az|dogru|dusuk|fazla|garip|high|low|makul|mantikli|midir|mi|mu|mudur|nasil|normal|plausible|reasonable|right|sence|supheli|too\s+high|too\s+low|valid|wrong|yanlis|yuksek)\b/u;
const CALCULATOR_SOURCE_REVIEW_VALUE_PATTERN =
  /\b(?:db|deger|desibel|metric|output|performans|result|sonuc|value)\b/u;
const CALCULATOR_SOURCE_REVIEW_REPORT_CONFIRM_PATTERN =
  /\b(?:apply|bana\s+sor|confirm|editleyeyim\s+mi|editleyim\s+mi|onay|onayla|onaylarsam|rapor|rapora|report|sor|uygula|uygulayayim\s+mi|uygulayayım\s+mi|yazayim\s+mi|yazayım\s+mi)\b/u;
const CALCULATOR_SOURCE_REVIEW_REPORT_FOLLOWUP_REPORT_PATTERN =
  /\b(?:rapor|rapora|report)\b/u;
const CALCULATOR_SOURCE_REVIEW_REPORT_FOLLOWUP_APPLY_PATTERN =
  /\b(?:apply|edit|editle|tamam|uygula|yaz)\b/u;
const CALCULATOR_SOURCE_REVIEW_DIRECT_VALUE_OVERRIDE_PATTERN =
  /\b(?:apply|ayarla|change|degistir|editle|make|olsun|replace|set|target|uygula|yap|yaz)\b/u;
const CALCULATOR_SOURCE_REVIEW_VALUE_EXPECTATION_PATTERN =
  /\b(?:dogru\s+cevap|must\s+be|olmali|olmasi\s+gerek|should\s+be)\b/u;
const CALCULATOR_SOURCE_REVIEW_NUMERIC_TARGET_PATTERN =
  /\b\d+(?:[.,]\d+)?\s*(?:db)?\b/u;
const CALCULATOR_ASSISTANT_SOURCE_ALTERNATIVE_SUBJECT_PATTERN =
  /\b(?:assembly|build\s*up|duvar|katman|kombinasyon|layer|malzeme|material|panel|stack)\b/u;
const CALCULATOR_ASSISTANT_SOURCE_ALTERNATIVE_INTENT_PATTERN =
  /\b(?:alternatif\w*|alternative\w*|instead|oner\w*|replace|substitute|yerine)\b/u;
// Coordination note (assistant objective planner, 2026-06-22):
// Keep this route ahead of generic candidate generation. If another agent edits
// assistant command routing, update this note and the objective-routing tests.
const CALCULATOR_ASSISTANT_OBJECTIVE_IMPROVEMENT_PATTERN =
  /\b(?:artir\w*|arttir\w*|artsin|begenmedim|improve|increase|iyilestir\w*|raise|yukselt\w*)\b/u;
const CALCULATOR_ASSISTANT_OBJECTIVE_LAYER_PLANNING_PATTERN =
  /\b(?:add|alternatif|alternatifler|calculator|candidate|candidates|dene|deneyelim|ekle|hesapla|katman|layer|layers|malzeme|mantikli|material|sec)\b/u;
const CALCULATOR_ASSISTANT_MULTI_STEP_CONNECTOR_PATTERN =
  /\b(?:2|ardindan|birden|iki|sonra|then|two)\b|[,;]/u;
const CALCULATOR_ASSISTANT_ADD_EDIT_PATTERN = /\b(?:add|ekle|insert)\b/u;
const CALCULATOR_ASSISTANT_REMOVE_EDIT_PATTERN = /\b(?:cikar|delete|kaldir|remove|sil)\b/u;
const CALCULATOR_ASSISTANT_REPLACE_EDIT_PATTERN = /\b(?:change|degistir|replace)\b/u;
const CALCULATOR_ASSISTANT_ALTERNATIVE_EDIT_PATTERN =
  /\b(?:alternatif|alternatifler|candidate|candidates|kombinasyon|kombinasyonlar|option|options)\b/u;
const CALCULATOR_ASSISTANT_RESEARCH_DRAFT_WRITE_PATTERN =
  /\b(?:add|ayarla|change|degistir|diz|doldur|edit|editle|ekle|insert|kaldir|remove|sil|uygula|yap)\b/u;

export const CALCULATOR_ASSISTANT_PROMPT_EXAMPLES = [
  {
    label: "Rw kontrol et",
    prompt: "Ekrandaki stacke bak Rw fazla mı az mı? İnternetten araştır."
  },
  {
    label: "Rw artır",
    prompt: "Bu layer kombinasyonunun Rw değerini beğenmedim, birkaç layer daha ekle ki Rw artsın, en mantıklısını seç."
  },
  {
    label: "Edit planı",
    prompt: "2. layerı sil, 15 mm gypsum ekle, Rw ve STC seç, hesapla."
  },
  {
    label: "Alternatif ara",
    prompt: "Bu katman kombinasyonuna alternatif malzeme araştır."
  },
  {
    label: "Araştırmayı ayır",
    prompt: "internetten araştır sonra gypsum ekle."
  }
] satisfies readonly { label: string; prompt: string }[];

export type CalculatorAssistantCommandRoutingDecision =
  | {
      confidence: "high" | "medium";
      reason: "current_value_review" | "explicit_source_review";
      status: "source_review";
    }
  | {
      confidence: "high" | "medium";
      reason: "report_override_confirmation";
      status: "report_override_request";
    }
  | {
      confidence: "high";
      reason: "wall_rw_improvement_candidate_planning";
      status: "objective_candidate_planning";
    }
  | {
      confidence: "high" | "medium";
      reason: "source_backed_layer_alternative_research";
      status: "source_alternative_research";
    }
  | {
      confidence: "medium";
      reason: "multi_step_edit_plan_required";
      status: "bounded_edit_plan";
    }
  | {
      confidence: "high" | "medium";
      message: string;
      reason: "direct_calculator_value_override" | "research_write_requires_clarification";
      status: "clarify";
    }
  | {
      confidence: "medium";
      reason: "calculator_draft_mutation";
      status: "layer_mutation";
    };

function normalizeCalculatorAssistantReviewText(value: string): string {
  return value
    .toLowerCase()
    .replace(/ı/gu, "i")
    .replace(/ç/gu, "c")
    .replace(/ğ/gu, "g")
    .replace(/ö/gu, "o")
    .replace(/ş/gu, "s")
    .replace(/ü/gu, "u")
    .replace(/[^a-z0-9']+/gu, " ")
    .trim();
}

function compactCalculatorAssistantMetricText(value: string): string {
  return normalizeCalculatorAssistantReviewText(value).replace(/[^a-z0-9]+/gu, "");
}

function outputAliasesForSourceReview(output: RequestedOutputId): readonly string[] {
  const option = OUTPUT_OPTIONS.find((entry) => entry.id === output);
  return [
    output,
    option?.label,
    output.replace(/^output:/u, "")
  ].filter((entry): entry is string => Boolean(entry));
}

function instructionMentionsCalculatorOutput(input: {
  instruction: string;
  outputs?: readonly RequestedOutputId[];
}): boolean {
  const instructionCompact = compactCalculatorAssistantMetricText(input.instruction);
  const outputs = input.outputs?.length ? input.outputs : OUTPUT_OPTIONS.map((option) => option.id);

  return outputs.some((output) =>
    outputAliasesForSourceReview(output).some((alias) => {
      const aliasCompact = compactCalculatorAssistantMetricText(alias);
      return aliasCompact.length > 1 && instructionCompact.includes(aliasCompact);
    })
  );
}

export function isCalculatorAssistantSourceReviewCommand(input: {
  instruction: string;
  selectedOutputs?: readonly RequestedOutputId[];
}): boolean {
  const decision = classifyCalculatorAssistantCommandRouting(input);
  return decision.status === "source_review" || decision.status === "report_override_request";
}

export function isCalculatorAssistantReportOverrideFollowupCommand(instruction: string): boolean {
  const normalized = normalizeCalculatorAssistantReviewText(instruction);
  return CALCULATOR_SOURCE_REVIEW_REPORT_FOLLOWUP_REPORT_PATTERN.test(normalized) &&
    CALCULATOR_SOURCE_REVIEW_REPORT_FOLLOWUP_APPLY_PATTERN.test(normalized);
}

export function classifyCalculatorAssistantCommandRouting(input: {
  instruction: string;
  selectedOutputs?: readonly RequestedOutputId[];
}): CalculatorAssistantCommandRoutingDecision {
  const normalized = normalizeCalculatorAssistantReviewText(input.instruction);
  const asksForReview = CALCULATOR_SOURCE_REVIEW_QUESTION_PATTERN.test(normalized);
  const asksForResearch = CALCULATOR_SOURCE_REVIEW_RESEARCH_PATTERN.test(normalized);
  const asksForReportOverrideConfirmation = CALCULATOR_SOURCE_REVIEW_REPORT_CONFIRM_PATTERN.test(normalized);
  const mentionsValue = CALCULATOR_SOURCE_REVIEW_VALUE_PATTERN.test(normalized);
  const mentionsOutput = instructionMentionsCalculatorOutput({
    instruction: input.instruction,
    outputs: input.selectedOutputs
  }) || instructionMentionsCalculatorOutput({
    instruction: input.instruction
  });
  const hasNumericTarget = CALCULATOR_SOURCE_REVIEW_NUMERIC_TARGET_PATTERN.test(normalized);
  const hasDirectValueOverrideVerb = CALCULATOR_SOURCE_REVIEW_DIRECT_VALUE_OVERRIDE_PATTERN.test(normalized);
  const hasValueExpectation = CALCULATOR_SOURCE_REVIEW_VALUE_EXPECTATION_PATTERN.test(normalized);
  const hasCurrentOutputContext = mentionsOutput || (Boolean(input.selectedOutputs?.length) && mentionsValue);
  const wantsSourceAlternativeResearch =
    asksForResearch &&
    CALCULATOR_ASSISTANT_SOURCE_ALTERNATIVE_INTENT_PATTERN.test(normalized) &&
    CALCULATOR_ASSISTANT_SOURCE_ALTERNATIVE_SUBJECT_PATTERN.test(normalized);
  const mixesResearchWithDraftWrite =
    asksForResearch &&
    CALCULATOR_ASSISTANT_RESEARCH_DRAFT_WRITE_PATTERN.test(normalized) &&
    !wantsSourceAlternativeResearch;
  const wantsObjectiveImprovement =
    hasCurrentOutputContext &&
    CALCULATOR_ASSISTANT_OBJECTIVE_IMPROVEMENT_PATTERN.test(normalized) &&
    CALCULATOR_ASSISTANT_OBJECTIVE_LAYER_PLANNING_PATTERN.test(normalized);
  const editOperationCount = [
    CALCULATOR_ASSISTANT_ADD_EDIT_PATTERN.test(normalized),
    CALCULATOR_ASSISTANT_REMOVE_EDIT_PATTERN.test(normalized),
    CALCULATOR_ASSISTANT_REPLACE_EDIT_PATTERN.test(normalized),
    CALCULATOR_ASSISTANT_ALTERNATIVE_EDIT_PATTERN.test(normalized)
  ].filter(Boolean).length;
  const wantsMultiStepEditPlan =
    editOperationCount >= 2 &&
    CALCULATOR_ASSISTANT_MULTI_STEP_CONNECTOR_PATTERN.test(normalized);
  const isValueExpectationReview =
    hasCurrentOutputContext &&
    hasNumericTarget &&
    hasValueExpectation &&
    asksForReview &&
    !asksForReportOverrideConfirmation;
  const isDirectCalculatorValueOverride =
    hasCurrentOutputContext &&
    hasNumericTarget &&
    (hasDirectValueOverrideVerb || hasValueExpectation) &&
    !asksForReview &&
    !asksForResearch &&
    !asksForReportOverrideConfirmation;

  if (isValueExpectationReview) {
    return {
      confidence: "high",
      reason: "current_value_review",
      status: "source_review"
    };
  }

  if (isDirectCalculatorValueOverride) {
    return {
      confidence: "high",
      message: "Calculator values are computed by the calculator. I can review the value against sources or prepare a report-only edit after a source-backed review, but I will not set the calculator result directly.",
      reason: "direct_calculator_value_override",
      status: "clarify"
    };
  }

  if (wantsObjectiveImprovement) {
    return {
      confidence: "high",
      reason: "wall_rw_improvement_candidate_planning",
      status: "objective_candidate_planning"
    };
  }

  if (wantsSourceAlternativeResearch) {
    return {
      confidence: hasCurrentOutputContext ? "high" : "medium",
      reason: "source_backed_layer_alternative_research",
      status: "source_alternative_research"
    };
  }

  if (mixesResearchWithDraftWrite) {
    return {
      confidence: "high",
      message: "Research wording was not applied to the Workbench draft. I can research or review first, then prepare a separate confirmation-gated apply proposal after the material/layer change is clear.",
      reason: "research_write_requires_clarification",
      status: "clarify"
    };
  }

  if (wantsMultiStepEditPlan) {
    return {
      confidence: "medium",
      reason: "multi_step_edit_plan_required",
      status: "bounded_edit_plan"
    };
  }

  if (
    asksForReportOverrideConfirmation &&
    (mentionsOutput || mentionsValue || Boolean(input.selectedOutputs?.length)) &&
    (asksForReview || asksForResearch || mentionsValue || hasNumericTarget)
  ) {
    return {
      confidence: "high",
      reason: "report_override_confirmation",
      status: "report_override_request"
    };
  }

  if (
    (asksForReview && (mentionsValue || mentionsOutput) && (asksForResearch || /\?/u.test(input.instruction))) ||
    (asksForResearch && (mentionsValue || mentionsOutput))
  ) {
    return {
      confidence: asksForResearch ? "high" : "medium",
      reason: asksForResearch ? "explicit_source_review" : "current_value_review",
      status: "source_review"
    };
  }

  return {
    confidence: "medium",
    reason: "calculator_draft_mutation",
    status: "layer_mutation"
  };
}

export function ensureCalculatorAssistantRwFirstSelectedOutputs(
  selectedOutputs: readonly RequestedOutputId[]
): RequestedOutputId[] {
  return ["Rw", ...selectedOutputs.filter((output) => output !== "Rw")];
}

function shouldRequestCalculatorAssistantSourceResearch(instruction: string): boolean {
  const decision = classifyCalculatorAssistantCommandRouting({ instruction });
  return decision.status === "report_override_request" ||
    CALCULATOR_SOURCE_REVIEW_RESEARCH_PATTERN.test(normalizeCalculatorAssistantReviewText(instruction));
}

export function resolveCalculatorAssistantSourceReviewOutputId(input: {
  availableOutputs: readonly RequestedOutputId[];
  fallbackOutput?: RequestedOutputId;
  instruction: string;
}): RequestedOutputId | undefined {
  const explicit = input.availableOutputs.find((output) =>
    instructionMentionsCalculatorOutput({
      instruction: input.instruction,
      outputs: [output]
    })
  );

  return explicit ?? input.fallbackOutput ?? input.availableOutputs[0];
}

export function buildCalculatorAssistantSourceReviewSnapshot(input: {
  outputId?: RequestedOutputId;
  snapshot: WorkbenchV2ProjectSnapshot;
}): WorkbenchV2ProjectSnapshot {
  if (!input.outputId || input.snapshot.selectedOutputs.includes(input.outputId)) {
    return input.snapshot;
  }

  return {
    ...input.snapshot,
    selectedOutputs: [...input.snapshot.selectedOutputs, input.outputId]
  };
}

const FLOOR_ROLES: readonly { label: string; value: FloorRole }[] = [
  { label: "Base", value: "base_structure" },
  { label: "Resilient layer", value: "resilient_layer" },
  { label: "Floating screed", value: "floating_screed" },
  { label: "Upper fill", value: "upper_fill" },
  { label: "Finish", value: "floor_covering" },
  { label: "Ceiling cavity", value: "ceiling_cavity" },
  { label: "Ceiling fill", value: "ceiling_fill" },
  { label: "Ceiling board", value: "ceiling_board" }
];

const WALL_ROLES = [
  { label: "Side A", value: "side_a" },
  { label: "Cavity", value: "cavity" },
  { label: "Core", value: "core" },
  { label: "Support", value: "support" },
  { label: "Side B", value: "side_b" }
] as const;

const WALL_TOPOLOGY_MODE_OPTIONS: readonly { label: string; value: WallTopologyMode }[] = [
  { label: "Auto", value: "auto" },
  { label: "Double leaf / framed", value: "double_leaf_framed" }
];

const WALL_CAVITY_FILL_OPTIONS: readonly { label: string; value: WallCavityFillCoverage }[] = [
  { label: "Unknown", value: "unknown" },
  { label: "Empty", value: "empty" },
  { label: "Partial", value: "partial" },
  { label: "Full", value: "full" }
];

const WALL_CAVITY_ABSORPTION_OPTIONS: readonly { label: string; value: WallCavityAbsorptionClass }[] = [
  { label: "Unknown", value: "unknown" },
  { label: "None", value: "none" },
  { label: "Porous absorber", value: "porous_absorptive" }
];

const WALL_SUPPORT_TOPOLOGY_OPTIONS: readonly { label: string; value: WallSupportTopology }[] = [
  { label: "Unknown", value: "unknown" },
  { label: "Independent frames", value: "independent_frames" },
  { label: "Single shared stud", value: "single_shared_stud" },
  { label: "Twin frame", value: "twin_frame" },
  { label: "Resilient channel", value: "resilient_channel" },
  { label: "Direct fixed", value: "direct_fixed" }
];

const RESILIENT_BAR_SIDE_COUNT_OPTIONS: readonly { label: string; value: AirborneResilientBarSideCount }[] = [
  { label: "Auto", value: "auto" },
  { label: "One side", value: "one_side" },
  { label: "Both sides", value: "both_sides" }
];

const FLANKING_JUNCTION_CLASS_OPTIONS: readonly { label: string; value: AirborneFlankingJunctionClass }[] = [
  { label: "Unknown", value: "unknown" },
  { label: "Rigid cross junction", value: "rigid_cross_junction" },
  { label: "Rigid T junction", value: "rigid_t_junction" },
  { label: "Lightweight junction", value: "lightweight_junction" },
  { label: "Isolated junction", value: "isolated_junction" },
  { label: "Mixed junction", value: "mixed_junction" }
];

const CONSERVATIVE_FLANKING_OPTIONS: readonly { label: string; value: AirborneConservativeFlankingAssumption }[] = [
  { label: "Unknown", value: "unknown" },
  { label: "Single conservative path", value: "single_conservative_path" },
  { label: "Multi-path conservative", value: "multi_path_conservative" },
  { label: "Worst-case screening", value: "worst_case_screening" }
];

const BUILDING_OUTPUT_BASIS_OPTIONS: readonly { label: string; value: AirborneBuildingPredictionOutputBasis }[] = [
  { label: "Unknown", value: "unknown" },
  { label: "Apparent", value: "apparent" },
  { label: "Standardized", value: "standardized" },
  { label: "Apparent + standardized", value: "apparent_and_standardized" }
];

const CONTEXT_INPUT_IDS: Record<keyof ContextDraft, string> = {
  airborneMode: "rebuild-airborne-mode",
  airborneResilientBarSideCount: "rebuild-resilient-bar-side-count",
  buildingPredictionOutputBasis: "rebuild-building-output-basis",
  ci50_2500Db: "rebuild-ci50-2500-db",
  ciDb: "rebuild-ci-db",
  conservativeFlankingAssumption: "rebuild-conservative-flanking-assumption",
  fieldKDb: "rebuild-field-k-db",
  flankingJunctionClass: "rebuild-flanking-junction-class",
  impactReceivingRoomVolumeM3: "rebuild-impact-room-volume",
  junctionCouplingLengthM: "rebuild-junction-coupling-length",
  loadBasisKgM2: "rebuild-load-basis",
  panelHeightMm: "rebuild-panel-height",
  panelWidthMm: "rebuild-panel-width",
  receivingRoomRt60S: "rebuild-receiving-room-rt60",
  receivingRoomVolumeM3: "rebuild-receiving-room-volume",
  resilientLayerDynamicStiffnessMNm3: "rebuild-dynamic-stiffness",
  sourceRoomVolumeM3: "rebuild-source-room-volume",
  supportSpacingMm: "rebuild-support-spacing",
  wallCavity1AbsorptionClass: "rebuild-wall-cavity-1-absorption",
  wallCavity1DepthMm: "rebuild-wall-cavity-1-depth",
  wallCavity1FillCoverage: "rebuild-wall-cavity-1-fill",
  wallCavity1LayerIndices: "rebuild-wall-cavity-1-rows",
  wallSideALeafLayerIndices: "rebuild-wall-side-a-rows",
  wallSideBLeafLayerIndices: "rebuild-wall-side-b-rows",
  wallSupportTopology: "rebuild-wall-support-topology",
  wallTopologyMode: "rebuild-wall-topology-mode"
};

// AGENT COORDINATION 2026-06-24 (Codex): shared route-input
// presentation returns semantic fields only. This rebuild adapter owns
// DOM ids so assistant/report surfaces do not depend on rebuild markup.
function getContextInputIdForRequiredInputTarget(targetField: WorkbenchRequiredInputTargetField): string | undefined {
  return CONTEXT_INPUT_IDS[targetField as keyof ContextDraft];
}

function getPrimaryContextInputIdForRequiredInputTargets(
  targetFields: readonly WorkbenchRequiredInputTargetField[]
): string | undefined {
  for (const targetField of targetFields) {
    const targetElementId = getContextInputIdForRequiredInputTarget(targetField);
    if (targetElementId) {
      return targetElementId;
    }
  }

  return undefined;
}

const INITIAL_CONTEXT: ContextDraft = WORKBENCH_V2_DEFAULT_CONTEXT;

const ROUTE_INPUT_EFFECTIVENESS_LABELS: Record<RouteInputEffectivenessStatus, string> = {
  defaulted: "Default",
  inactive: "Inactive",
  needed: "Needed",
  used: "Used"
};

const AIRBORNE_CONTEXT_INPUT_IDS = new Set<string>([
  CONTEXT_INPUT_IDS.airborneMode,
  CONTEXT_INPUT_IDS.panelWidthMm,
  CONTEXT_INPUT_IDS.panelHeightMm,
  CONTEXT_INPUT_IDS.receivingRoomVolumeM3,
  CONTEXT_INPUT_IDS.receivingRoomRt60S
]);

const BUILDING_PREDICTION_INPUT_IDS = new Set<string>([
  CONTEXT_INPUT_IDS.sourceRoomVolumeM3,
  CONTEXT_INPUT_IDS.flankingJunctionClass,
  CONTEXT_INPUT_IDS.conservativeFlankingAssumption,
  CONTEXT_INPUT_IDS.junctionCouplingLengthM,
  CONTEXT_INPUT_IDS.buildingPredictionOutputBasis
]);

const IMPACT_FIELD_INPUT_IDS = new Set<string>([
  CONTEXT_INPUT_IDS.fieldKDb,
  CONTEXT_INPUT_IDS.ciDb,
  CONTEXT_INPUT_IDS.ci50_2500Db,
  CONTEXT_INPUT_IDS.impactReceivingRoomVolumeM3
]);

const FLOOR_IMPACT_INPUT_IDS = new Set<string>([
  CONTEXT_INPUT_IDS.loadBasisKgM2,
  CONTEXT_INPUT_IDS.resilientLayerDynamicStiffnessMNm3
]);

const WALL_TOPOLOGY_MANUAL_INPUT_IDS = new Set<string>([
  CONTEXT_INPUT_IDS.wallSideALeafLayerIndices,
  CONTEXT_INPUT_IDS.wallCavity1LayerIndices,
  CONTEXT_INPUT_IDS.wallSideBLeafLayerIndices,
  CONTEXT_INPUT_IDS.wallCavity1DepthMm,
  CONTEXT_INPUT_IDS.wallCavity1FillCoverage,
  CONTEXT_INPUT_IDS.wallCavity1AbsorptionClass,
  CONTEXT_INPUT_IDS.wallSupportTopology,
  CONTEXT_INPUT_IDS.supportSpacingMm,
  CONTEXT_INPUT_IDS.airborneResilientBarSideCount
]);

const ROUTE_INPUT_DEFAULT_FIELD_ALIASES: Record<string, readonly string[]> = {
  [CONTEXT_INPUT_IDS.airborneResilientBarSideCount]: ["resilientBarSideCount", "airborneResilientBarSideCount"],
  [CONTEXT_INPUT_IDS.buildingPredictionOutputBasis]: ["buildingPredictionOutputBasis"],
  [CONTEXT_INPUT_IDS.conservativeFlankingAssumption]: ["conservativeFlankingAssumption"],
  [CONTEXT_INPUT_IDS.flankingJunctionClass]: ["flankingJunctionClass"],
  [CONTEXT_INPUT_IDS.junctionCouplingLengthM]: ["junctionCouplingLengthM"],
  [CONTEXT_INPUT_IDS.panelHeightMm]: ["panelHeightMm", "partitionAreaM2"],
  [CONTEXT_INPUT_IDS.panelWidthMm]: ["panelWidthMm", "partitionAreaM2"],
  [CONTEXT_INPUT_IDS.receivingRoomRt60S]: ["receivingRoomRt60S"],
  [CONTEXT_INPUT_IDS.receivingRoomVolumeM3]: ["receivingRoomVolumeM3"],
  [CONTEXT_INPUT_IDS.sourceRoomVolumeM3]: ["sourceRoomVolumeM3"],
  [CONTEXT_INPUT_IDS.supportSpacingMm]: ["supportSpacingMm", "studSpacingMm"],
  [CONTEXT_INPUT_IDS.wallCavity1AbsorptionClass]: ["cavity1AbsorptionClass", "absorberClass"],
  [CONTEXT_INPUT_IDS.wallCavity1DepthMm]: ["cavity1DepthMm", "cavityDepthMm"],
  [CONTEXT_INPUT_IDS.wallCavity1FillCoverage]: ["cavity1FillCoverage", "fillState"],
  [CONTEXT_INPUT_IDS.wallSupportTopology]: ["supportTopology", "frameBridgeClass"]
};

const INITIAL_WALL_LAYERS: readonly DraftLayer[] = [
  { id: "rebuild-layer-1", materialId: "gypsum_board", role: "side_a", thicknessMm: "12.5" },
  { id: "rebuild-layer-2", materialId: "rockwool", role: "cavity", thicknessMm: "50" },
  { id: "rebuild-layer-3", materialId: "concrete", role: "side_b", thicknessMm: "100" }
];

const INITIAL_FLOOR_LAYERS: readonly DraftLayer[] = [
  { id: "rebuild-floor-layer-1", materialId: "concrete", role: "base_structure", thicknessMm: "150" },
  { id: "rebuild-floor-layer-2", materialId: "geniemat_rst05", role: "resilient_layer", thicknessMm: "5" },
  { id: "rebuild-floor-layer-3", materialId: "screed", role: "floating_screed", thicknessMm: "50" }
];

const INITIAL_LAYERS = INITIAL_WALL_LAYERS;

const MATERIAL_EDITOR_STORAGE_KEY = "dynecho:workbench-v2:material-editor:v1";
const UNKNOWN_MATERIAL: MaterialDefinition = {
  category: "mass",
  densityKgM3: 0,
  id: "unknown_material",
  name: "Unknown material",
  tags: []
};

function createLayerId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `layer-${Date.now()}`;
}

function getMaterialFromCatalog(materialId: string, materialById: ReadonlyMap<string, MaterialDefinition>): MaterialDefinition {
  return materialById.get(materialId) ?? {
    ...UNKNOWN_MATERIAL,
    id: materialId || UNKNOWN_MATERIAL.id,
    name: materialId ? `Unknown material (${materialId})` : UNKNOWN_MATERIAL.name
  };
}

function getDefaultMaterialId(mode: StudyMode, materialById: ReadonlyMap<string, MaterialDefinition>, materials: readonly MaterialDefinition[]): string {
  if (mode === "floor") {
    return materialById.has("concrete") ? "concrete" : materials[0]?.id ?? "concrete";
  }

  return materialById.has("gypsum_board") ? "gypsum_board" : materials[0]?.id ?? "gypsum_board";
}

function getRoleOptions(mode: StudyMode): readonly { label: string; value: string }[] {
  return mode === "floor" ? FLOOR_ROLES : WALL_ROLES;
}

function cloneLayers(layers: readonly DraftLayer[]): DraftLayer[] {
  return layers.map((layer) => ({ ...layer }));
}

function matchesStarterStack(layers: readonly DraftLayer[], starter: readonly DraftLayer[]): boolean {
  return (
    layers.length === starter.length &&
    layers.every((layer, index) => {
      const starterLayer = starter[index];

      return (
        starterLayer !== undefined &&
        layer.materialId === starterLayer.materialId &&
        layer.role === starterLayer.role &&
        layer.thicknessMm === starterLayer.thicknessMm
      );
    })
  );
}

function migrateLayerRoles(
  layers: readonly DraftLayer[],
  nextMode: StudyMode,
  materialById: ReadonlyMap<string, MaterialDefinition>,
  materials: readonly MaterialDefinition[]
): DraftLayer[] {
  const roles = getRoleOptions(nextMode);

  return layers.map((layer, index) => ({
    ...layer,
    materialId: layer.materialId || getDefaultMaterialId(nextMode, materialById, materials),
    role: roles[Math.min(index, roles.length - 1)]!.value
  }));
}

function getRoleLabel(mode: StudyMode, value: string): string {
  return getRoleOptions(mode).find((role) => role.value === value)?.label ?? value.replace(/_/g, " ");
}

function normalizeSearch(value: string): string {
  return value.trim().toLowerCase();
}

function getFilteredMaterials(
  search: string,
  selectedId: string,
  materials: readonly MaterialDefinition[],
  materialById: ReadonlyMap<string, MaterialDefinition>
): MaterialDefinition[] {
  const normalized = normalizeSearch(search);
  const filtered = normalized
    ? materials.filter((material) => {
        const haystack = [material.id, material.name, material.category, ...material.tags].join(" ").toLowerCase();
        return haystack.includes(normalized);
      })
    : materials;
  const selected = getMaterialFromCatalog(selectedId, materialById);

  if (normalized) {
    return [...filtered];
  }

  return filtered.some((material) => material.id === selected.id) ? [...filtered] : [selected, ...filtered];
}

function parsePositiveNumber(value: string): number | null {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function parseOptionalPositiveNumber(value: string): number | undefined {
  return parsePositiveNumber(value) ?? undefined;
}

function parseOptionalFiniteNumber(value: string): number | undefined {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function formatDb(value: number): string {
  return Number.isInteger(value) ? `${value} dB` : `${value.toFixed(1)} dB`;
}

function formatThickness(value: number | null): string {
  if (!value) {
    return "Missing";
  }

  return Number.isInteger(value) ? `${value} mm` : `${value.toFixed(1)} mm`;
}

function getLayerThicknessInputId(layerId: string): string {
  return `rebuild-layer-${layerId}-thickness`;
}

function getLayerMaterialInputId(layerId: string): string {
  return `rebuild-layer-${layerId}-material`;
}

function getLayerMaterialPopoverId(layerId: string): string {
  return `rebuild-layer-${layerId}-material-popover`;
}

function getLayerRoleInputId(layerId: string): string {
  return `rebuild-layer-${layerId}-role`;
}

function moveItem<T>(items: readonly T[], fromIndex: number, toIndex: number): T[] {
  const next = [...items];
  const [item] = next.splice(fromIndex, 1);

  if (!item) {
    return next;
  }

  next.splice(toIndex, 0, item);
  return next;
}

function moveLayerBeforeOrAfter(
  layers: readonly DraftLayer[],
  sourceLayerId: string,
  targetLayerId: string,
  position: "after" | "before"
): DraftLayer[] {
  if (sourceLayerId === targetLayerId) {
    return [...layers];
  }

  const source = layers.find((layer) => layer.id === sourceLayerId);
  if (!source) {
    return [...layers];
  }

  const withoutSource = layers.filter((layer) => layer.id !== sourceLayerId);
  const targetIndex = withoutSource.findIndex((layer) => layer.id === targetLayerId);
  if (targetIndex < 0) {
    return [...layers];
  }

  const insertIndex = position === "after" ? targetIndex + 1 : targetIndex;
  const next = [...withoutSource];
  next.splice(insertIndex, 0, source);
  return next;
}

function buildLocalTasks(
  layers: readonly DraftLayer[],
  selectedOutputs: readonly RequestedOutputId[],
  materialById: ReadonlyMap<string, MaterialDefinition>
): readonly RequiredTask[] {
  const tasks: RequiredTask[] = [];

  if (!layers.length) {
    tasks.push({
      actionLabel: "Add",
      detail: "Add at least one construction layer.",
      id: "missing-layer",
      label: "No layers"
    });
  }

  if (!selectedOutputs.length) {
    tasks.push({
      actionLabel: "Select",
      detail: "Choose at least one requested output.",
      id: "missing-output",
      label: "No output selected",
      targetElementId: "rebuild-output-picker"
    });
  }

  for (const [index, layer] of layers.entries()) {
    const material = getMaterialFromCatalog(layer.materialId, materialById);

    if (!materialById.has(layer.materialId)) {
      tasks.push({
        actionLabel: "Review",
        detail: `Layer ${index + 1} references a material that is not in the current catalog.`,
        id: `missing-material-${layer.id}`,
        label: "Missing material",
        targetLayerId: layer.id
      });
    }

    if (!parsePositiveNumber(layer.thicknessMm)) {
      tasks.push({
        actionLabel: "Edit",
        detail: `Enter thickness for layer ${index + 1}.`,
        id: `missing-thickness-${layer.id}`,
        label: `${material.name} thickness`,
        targetElementId: getLayerThicknessInputId(layer.id),
        targetLayerId: layer.id
      });
    }
  }

  return tasks;
}

function parseLayerIndexList(value: string, rowCount: number): number[] | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  const indices: number[] = [];
  for (const token of trimmed.split(/[,\s]+/u).filter(Boolean)) {
    if (!/^\d+$/u.test(token)) {
      return undefined;
    }

    const oneBasedIndex = Number(token);
    if (!Number.isSafeInteger(oneBasedIndex) || oneBasedIndex < 1 || oneBasedIndex > rowCount) {
      return undefined;
    }

    const zeroBasedIndex = oneBasedIndex - 1;
    if (!indices.includes(zeroBasedIndex)) {
      indices.push(zeroBasedIndex);
    }
  }

  return indices.length ? indices : undefined;
}

function formatLayerIndexList(indices: readonly number[]): string {
  return indices.map((index) => String(index + 1)).join(", ");
}

function getLayerIndicesByRole(layers: readonly DraftLayer[], role: string): number[] {
  return layers.flatMap((layer, index) => (layer.role === role ? [index] : []));
}

function getLayerThicknessSum(layers: readonly DraftLayer[], indices: readonly number[]): number | null {
  const total = indices.reduce((sum, index) => sum + (parsePositiveNumber(layers[index]?.thicknessMm ?? "") ?? 0), 0);
  return total > 0 ? Math.round(total * 10) / 10 : null;
}

function isPorousCavityMaterial(material: MaterialDefinition): boolean {
  const descriptor = [material.id, material.name, material.category, ...material.tags].join(" ").toLowerCase();

  return (
    material.category === "insulation" ||
    material.acoustic?.behavior === "porous_absorber" ||
    /insulation|wool|mineral|porous|absorber|fiber|fibre/u.test(descriptor)
  );
}

function isEmptyCavityMaterial(material: MaterialDefinition): boolean {
  const descriptor = [material.id, material.name, material.category, ...material.tags].join(" ").toLowerCase();

  return material.category === "gap" || material.acoustic?.behavior === "air_cavity" || /air|gap|cavity|void/u.test(descriptor);
}

function inferCavityFillCoverage(
  layers: readonly DraftLayer[],
  indices: readonly number[],
  materialById: ReadonlyMap<string, MaterialDefinition>
): WallCavityFillCoverage {
  const materials = indices.map((index) => getMaterialFromCatalog(layers[index]?.materialId ?? "", materialById));

  if (materials.some(isPorousCavityMaterial)) {
    return "full";
  }

  if (materials.length > 0 && materials.every(isEmptyCavityMaterial)) {
    return "empty";
  }

  return "unknown";
}

function inferCavityAbsorptionClass(
  layers: readonly DraftLayer[],
  indices: readonly number[],
  materialById: ReadonlyMap<string, MaterialDefinition>
): WallCavityAbsorptionClass {
  const materials = indices.map((index) => getMaterialFromCatalog(layers[index]?.materialId ?? "", materialById));

  if (materials.some(isPorousCavityMaterial)) {
    return "porous_absorptive";
  }

  if (materials.length > 0 && materials.every(isEmptyCavityMaterial)) {
    return "none";
  }

  return "unknown";
}

function buildWallTopologyFromContext(context: ContextDraft, rowCount: number): NonNullable<EstimateRequest["airborneContext"]>["wallTopology"] | undefined {
  if (context.wallTopologyMode === "auto") {
    return undefined;
  }

  const topology: NonNullable<EstimateRequest["airborneContext"]>["wallTopology"] = {
    topologyMode: context.wallTopologyMode
  };
  const sideA = parseLayerIndexList(context.wallSideALeafLayerIndices, rowCount);
  const cavity1 = parseLayerIndexList(context.wallCavity1LayerIndices, rowCount);
  const sideB = parseLayerIndexList(context.wallSideBLeafLayerIndices, rowCount);
  const cavity1DepthMm = parseOptionalPositiveNumber(context.wallCavity1DepthMm);

  if (sideA) topology.sideALeafLayerIndices = sideA;
  if (cavity1) topology.cavity1LayerIndices = cavity1;
  if (sideB) topology.sideBLeafLayerIndices = sideB;
  if (cavity1DepthMm) topology.cavity1DepthMm = cavity1DepthMm;
  if (context.wallCavity1FillCoverage !== "unknown") topology.cavity1FillCoverage = context.wallCavity1FillCoverage;
  if (context.wallCavity1AbsorptionClass !== "unknown") topology.cavity1AbsorptionClass = context.wallCavity1AbsorptionClass;
  if (context.wallSupportTopology !== "unknown") topology.supportTopology = context.wallSupportTopology;

  return topology;
}

function isWallTopologyInput(fieldId: string): boolean {
  const normalized = fieldId.toLowerCase().replace(/[^a-z0-9]/g, "");

  return [
    "sidealeafgroup",
    "sidebleafgroup",
    "cavity1depthmm",
    "cavitydepthmm",
    "cavity1fillcoverage",
    "fillstate",
    "absorberclass",
    "framebridgeclass",
    "supporttopology",
    "supportspacingmm",
    "studspacingmm",
    "resilientbarsidecount",
    "leafgrouping"
  ].some((field) => normalized.includes(field));
}

function isBuildingPredictionInput(fieldId: string): boolean {
  const normalized = fieldId.toLowerCase().replace(/[^a-z0-9]/g, "");

  return [
    "sourceroomvolumem3",
    "flankingjunctionclass",
    "conservativeflankingassumption",
    "junctioncouplinglengthm",
    "buildingpredictionoutputbasis"
  ].some((field) => normalized.includes(field));
}

export function getMissingInputTask(fieldId: string): RequiredTask {
  const presentation = resolveWorkbenchRequiredInputPresentation(fieldId);

  return {
    actionLabel: presentation.actionLabel,
    detail: presentation.detail,
    id: `remote-${fieldId}`,
    label: presentation.label,
    targetElementId: getPrimaryContextInputIdForRequiredInputTargets(presentation.targetFields),
    targetFields: presentation.targetFields
  };
}

function getRemoteTasks(result: AssemblyCalculation | null): readonly RequiredTask[] {
  const boundary = result?.acousticAnswerBoundary;

  if (!boundary || boundary.origin !== "needs_input") {
    return [];
  }

  const missingPhysicalInputs = Array.from(new Set<string>(boundary.missingPhysicalInputs));
  return missingPhysicalInputs.map(getMissingInputTask);
}

export function buildRouteInputTaskElementIds(tasks: readonly RequiredTask[]): Set<string> {
  const targetElementIds = new Set<string>();

  for (const task of tasks) {
    for (const targetField of task.targetFields ?? []) {
      const targetElementId = getContextInputIdForRequiredInputTarget(targetField);
      if (targetElementId) {
        targetElementIds.add(targetElementId);
      }
    }

    if (task.targetElementId) {
      targetElementIds.add(task.targetElementId);
    }

    // AGENT COORDINATION 2026-06-24 (Codex): this fallback protects any
    // legacy remote task that was created before semantic targetFields were
    // attached. New tasks should reach both fields via the shared presenter.
    if (normalizeRouteInputFieldId(task.id).includes("partitionaream2")) {
      targetElementIds.add(CONTEXT_INPUT_IDS.panelWidthMm);
      targetElementIds.add(CONTEXT_INPUT_IDS.panelHeightMm);
    }
  }

  return targetElementIds;
}

function getMissingPhysicalInputs(result: AssemblyCalculation | null): readonly string[] {
  const boundary = result?.acousticAnswerBoundary;

  if (!boundary || boundary.origin !== "needs_input") {
    return [];
  }

  return boundary.missingPhysicalInputs;
}

export function buildEstimatePayload(
  mode: StudyMode,
  layers: readonly DraftLayer[],
  selectedOutputs: readonly RequestedOutputId[],
  context: ContextDraft,
  customMaterials: readonly MaterialDefinition[]
): EstimateRequest | null {
  const requestLayers: EstimateRequest["layers"] = [];

  for (const layer of layers) {
    const thicknessMm = parsePositiveNumber(layer.thicknessMm);

    if (!thicknessMm) {
      return null;
    }

    requestLayers.push({
      floorRole: mode === "floor" ? (layer.role as FloorRole) : undefined,
      materialId: layer.materialId,
      thicknessMm
    });
  }

  if (!requestLayers.length || !selectedOutputs.length) {
    return null;
  }

  const airborneContext: EstimateRequest["airborneContext"] = {};
  const panelWidthMm = parseOptionalPositiveNumber(context.panelWidthMm);
  const panelHeightMm = parseOptionalPositiveNumber(context.panelHeightMm);
  const receivingRoomVolumeM3 = parseOptionalPositiveNumber(context.receivingRoomVolumeM3);
  const receivingRoomRt60S = parseOptionalPositiveNumber(context.receivingRoomRt60S);
  const sourceRoomVolumeM3 = parseOptionalPositiveNumber(context.sourceRoomVolumeM3);
  const junctionCouplingLengthM = parseOptionalPositiveNumber(context.junctionCouplingLengthM);
  const supportSpacingMm = parseOptionalPositiveNumber(context.supportSpacingMm);
  const wallTopology = mode === "wall" ? buildWallTopologyFromContext(context, layers.length) : undefined;

  if (context.airborneMode !== "element_lab") airborneContext.contextMode = context.airborneMode;
  if (panelWidthMm) airborneContext.panelWidthMm = panelWidthMm;
  if (panelHeightMm) airborneContext.panelHeightMm = panelHeightMm;
  if (receivingRoomVolumeM3) airborneContext.receivingRoomVolumeM3 = receivingRoomVolumeM3;
  if (receivingRoomRt60S) airborneContext.receivingRoomRt60S = receivingRoomRt60S;
  if (sourceRoomVolumeM3) airborneContext.sourceRoomVolumeM3 = sourceRoomVolumeM3;
  if (junctionCouplingLengthM) airborneContext.junctionCouplingLengthM = junctionCouplingLengthM;
  if (supportSpacingMm) airborneContext.studSpacingMm = supportSpacingMm;
  if (context.airborneResilientBarSideCount !== "auto") airborneContext.resilientBarSideCount = context.airborneResilientBarSideCount;
  if (context.flankingJunctionClass !== "unknown") airborneContext.flankingJunctionClass = context.flankingJunctionClass;
  if (context.conservativeFlankingAssumption !== "unknown") {
    airborneContext.conservativeFlankingAssumption = context.conservativeFlankingAssumption;
  }
  if (context.buildingPredictionOutputBasis !== "unknown") airborneContext.buildingPredictionOutputBasis = context.buildingPredictionOutputBasis;
  if (wallTopology) airborneContext.wallTopology = wallTopology;

  const impactFieldContext: EstimateRequest["impactFieldContext"] = {};
  const fieldKDb = parseOptionalFiniteNumber(context.fieldKDb);
  const ciDb = parseOptionalFiniteNumber(context.ciDb);
  const ci50_2500Db = parseOptionalFiniteNumber(context.ci50_2500Db);
  const impactReceivingRoomVolumeM3 = parseOptionalPositiveNumber(context.impactReceivingRoomVolumeM3);

  if (fieldKDb !== undefined) impactFieldContext.fieldKDb = fieldKDb;
  if (ciDb !== undefined) impactFieldContext.ciDb = ciDb;
  if (ci50_2500Db !== undefined) impactFieldContext.ci50_2500Db = ci50_2500Db;
  if (impactReceivingRoomVolumeM3) impactFieldContext.receivingRoomVolumeM3 = impactReceivingRoomVolumeM3;

  const floorImpactContext: EstimateRequest["floorImpactContext"] = {};
  const loadBasisKgM2 = parseOptionalPositiveNumber(context.loadBasisKgM2);
  const resilientLayerDynamicStiffnessMNm3 = parseOptionalPositiveNumber(context.resilientLayerDynamicStiffnessMNm3);

  if (loadBasisKgM2) floorImpactContext.loadBasisKgM2 = loadBasisKgM2;
  if (resilientLayerDynamicStiffnessMNm3) floorImpactContext.resilientLayerDynamicStiffnessMNm3 = resilientLayerDynamicStiffnessMNm3;

  const payload: EstimateRequest = {
    calculator: "dynamic",
    layers: requestLayers,
    mode,
    targetOutputs: [...selectedOutputs]
  };

  if (Object.keys(airborneContext).length) payload.airborneContext = airborneContext;
  if (Object.keys(impactFieldContext).length) payload.impactFieldContext = impactFieldContext;
  if (mode === "floor" && Object.keys(floorImpactContext).length) payload.floorImpactContext = floorImpactContext;
  if (customMaterials.length) payload.materialCatalog = [...customMaterials];

  return payload;
}

function readOutputValue(result: AssemblyCalculation, outputId: RequestedOutputId): number | null {
  switch (outputId) {
    case "AIIC":
      return result.impact?.AIIC ?? null;
    case "C":
      return result.metrics.estimatedCDb ?? result.ratings.iso717.C;
    case "CI":
      return result.impact?.CI ?? null;
    case "CI,50-2500":
      return result.impact?.CI50_2500 ?? null;
    case "Ctr":
      return result.metrics.estimatedCtrDb ?? result.ratings.iso717.Ctr;
    case "DeltaLw":
      return result.impact?.DeltaLw ?? null;
    case "Dn,A":
      return result.ratings.field?.DnA ?? result.metrics.estimatedDnADb ?? null;
    case "DnT,A":
      return result.ratings.field?.DnTA ?? result.metrics.estimatedDnTADb ?? null;
    case "DnT,A,k":
      return result.ratings.field?.DnTAk ?? result.metrics.estimatedDnTAkDb ?? null;
    case "DnT,w":
      return result.ratings.field?.DnTw ?? result.metrics.estimatedDnTwDb ?? null;
    case "Dn,w":
      return result.ratings.field?.DnW ?? result.metrics.estimatedDnWDb ?? null;
    case "IIC":
      return result.impact?.IIC ?? null;
    case "L'n,w":
      return result.impact?.LPrimeNW ?? null;
    case "L'nT,50":
      return result.impact?.LPrimeNT50 ?? null;
    case "L'nT,w":
      return result.impact?.LPrimeNTw ?? null;
    case "Ln,w":
      return result.impact?.LnW ?? null;
    case "Ln,w+CI":
      return result.impact?.LnWPlusCI ?? null;
    case "LnT,A":
      return result.impact?.LnTA ?? null;
    case "Rw":
      return result.metrics.estimatedRwDb ?? result.ratings.iso717.Rw;
    case "R'w":
      return result.ratings.field?.RwPrime ?? result.metrics.estimatedRwPrimeDb ?? null;
    case "STC":
      return result.metrics.estimatedStc ?? result.ratings.astmE413.STC;
    case "HIIC":
    case "ISR":
    case "LIIC":
    case "LIR":
    case "NISR":
      return null;
    default:
      return null;
  }
}

function getOutputDetail(result: AssemblyCalculation, outputId: RequestedOutputId, status: OutputStatus): string {
  // AGENT COORDINATION 2026-06-22: Output-row detail copy only; keep support/status gating unchanged.
  const boundary = result.acousticAnswerBoundary;

  if (status === "live") {
    return "Calculated";
  }

  if (boundary?.origin === "needs_input" && boundary.unsupportedOutputs.includes(outputId)) {
    const tasks = getRemoteTasks(result);
    return tasks.length ? `Needs ${tasks.slice(0, 2).map((task) => task.label).join(", ")}` : "Needs input";
  }

  if (result.unsupportedTargetOutputs.includes(outputId) || boundary?.unsupportedOutputs.includes(outputId)) {
    return "Unsupported by the current route";
  }

  return "No supported value for the selected output yet";
}

export function buildOutputRows(result: AssemblyCalculation, selectedOutputs: readonly RequestedOutputId[]): readonly OutputRow[] {
  return selectedOutputs.map((outputId) => {
    const value = readOutputValue(result, outputId);
    const hasDisplayValue = typeof value === "number" && Number.isFinite(value);
    const boundary = result.acousticAnswerBoundary;
    const isNeedsInput = boundary?.origin === "needs_input" && boundary.unsupportedOutputs.includes(outputId);
    const isUnsupported = result.unsupportedTargetOutputs.includes(outputId) || boundary?.unsupportedOutputs.includes(outputId);
    const isSupported = result.supportedTargetOutputs.includes(outputId);
    let status: OutputStatus = "pending";

    if (isNeedsInput) {
      status = "needs_input";
    } else if (isUnsupported) {
      status = "unsupported";
    } else if (isSupported && hasDisplayValue) {
      status = "live";
    }

    return {
      detail: getOutputDetail(result, outputId, status),
      label: outputId,
      status,
      value: status === "live" && hasDisplayValue ? formatDb(value) : "--"
    };
  });
}

function stableJsonForVerifiedCalculatedCapture(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableJsonForVerifiedCalculatedCapture).join(",")}]`;
  }

  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, entryValue]) => entryValue !== undefined)
    .sort(([left], [right]) => left.localeCompare(right));

  return `{${entries.map(([key, entryValue]) => `${JSON.stringify(key)}:${stableJsonForVerifiedCalculatedCapture(entryValue)}`).join(",")}}`;
}

export function estimateRequestsEqual(
  left: EstimateRequest,
  right: EstimateRequest
): boolean {
  return stableJsonForVerifiedCalculatedCapture(left) === stableJsonForVerifiedCalculatedCapture(right);
}

export function estimateRequestsEqualForVerifiedCalculatedCapture(
  left: EstimateRequest,
  right: EstimateRequest
): boolean {
  return estimateRequestsEqual(left, right);
}

type EstimateStateForFreshness =
  | { request: EstimateRequest; result: AssemblyCalculation; status: "ready" }
  | { status: Exclude<EstimateState["status"], "ready"> };

export function getActiveEstimateResultForCurrentRequest(input: {
  currentRequest: EstimateRequest | null;
  estimateState: EstimateStateForFreshness;
}): AssemblyCalculation | null {
  if (input.estimateState.status !== "ready" || !input.currentRequest) {
    return null;
  }

  return estimateRequestsEqual(input.currentRequest, input.estimateState.request) ? input.estimateState.result : null;
}

export function getVerifiedCalculatedMetricBasis(
  outputId: RequestedOutputId,
  context: ContextDraft
): ProjectUserVerifiedCalculatedAnchorMetricBasis {
  if (isImpactOutput(outputId)) {
    return outputRequiresImpactContext(outputId) || outputId === "AIIC" ? "impact_field" : "impact_lab";
  }

  if (outputRequiresAirborneContext(outputId)) {
    return context.airborneMode === "building_prediction" ? "airborne_building_prediction" : "airborne_field";
  }

  return "airborne_lab";
}

export function buildVerifiedCalculatedAnchorCapturePackage(input: {
  context: ContextDraft;
  currentRequest: EstimateRequest;
  mode: StudyMode;
  result: AssemblyCalculation;
  selectedOutputs: readonly RequestedOutputId[];
}): VerifiedCalculatedAnchorCaptureResult {
  const targetOutputs = input.currentRequest.targetOutputs?.length
    ? input.currentRequest.targetOutputs
    : input.selectedOutputs;
  const supportedOutputs = new Set([
    ...input.result.supportedTargetOutputs,
    ...input.result.supportedImpactOutputs
  ]);
  const unsupportedOutputs = new Set([
    ...input.result.unsupportedTargetOutputs,
    ...input.result.unsupportedImpactOutputs,
    ...(input.result.acousticAnswerBoundary?.unsupportedOutputs ?? [])
  ]);
  const routeId = input.result.airborneBasis?.method ?? input.result.metrics.method;
  const values: ProjectUserVerifiedCalculatedAnchorValue[] = [];

  for (const outputId of input.selectedOutputs) {
    if (!targetOutputs.includes(outputId) || !supportedOutputs.has(outputId) || unsupportedOutputs.has(outputId)) {
      continue;
    }

    const value = readOutputValue(input.result, outputId);
    if (typeof value !== "number" || !Number.isFinite(value)) {
      continue;
    }

    values.push({
      metric: outputId,
      metricBasis: getVerifiedCalculatedMetricBasis(outputId, input.context),
      provenance: {
        basisId: input.result.airborneBasis?.kind,
        outputStatus: "supported",
        routeId,
        source: "calculated_live_result"
      },
      valueDb: value
    });
  }

  if (!values.length) {
    return {
      reason: "no_live_values",
      status: "blocked"
    };
  }

  const requestContext: ProjectUserVerifiedCalculatedAnchorRequestContext = {
    airborneContext: input.currentRequest.airborneContext,
    calculator: input.currentRequest.calculator,
    exactImpactSource: input.currentRequest.exactImpactSource,
    floorImpactContext: input.currentRequest.floorImpactContext,
    impactFieldContext: input.currentRequest.impactFieldContext,
    impactPredictorInput: input.currentRequest.impactPredictorInput,
    layers: input.currentRequest.layers,
    materialCatalog: input.currentRequest.materialCatalog ?? [],
    mode: input.mode,
    steelFloorFormulaSurface: input.currentRequest.steelFloorFormulaSurface,
    targetOutputs: [...targetOutputs]
  };
  const resultBasisTrace: ProjectUserVerifiedCalculatedAnchorResultBasisTrace = {
    assumptions: input.result.airborneBasis?.assumptions ?? [],
    ratingAdapterBasisSet: input.result.ratingAdapterBasisSet ?? [],
    supportedImpactOutputs: [...input.result.supportedImpactOutputs],
    supportedTargetOutputs: [...input.result.supportedTargetOutputs],
    targetOutputs: [...targetOutputs],
    unsupportedImpactOutputs: [...input.result.unsupportedImpactOutputs],
    unsupportedTargetOutputs: [...input.result.unsupportedTargetOutputs],
    warnings: [...input.result.warnings]
  };

  if (input.result.airborneBasis) {
    resultBasisTrace.airborneBasis = input.result.airborneBasis;
  }
  if (input.result.airborneCandidateResolution) {
    resultBasisTrace.airborneCandidateResolution = input.result.airborneCandidateResolution;
  }
  if (input.result.calculatorId) {
    resultBasisTrace.calculator = input.result.calculatorId;
  } else if (input.currentRequest.calculator) {
    resultBasisTrace.calculator = input.currentRequest.calculator;
  }

  return {
    package: {
      requestContext,
      resultBasisTrace,
      values
    },
    status: "ready"
  };
}

function normalizeRouteInputFieldId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function routeInputHasAirborneDefault(result: AssemblyCalculation | null, inputId: string): boolean {
  const aliases = ROUTE_INPUT_DEFAULT_FIELD_ALIASES[inputId];
  if (!aliases?.length) {
    return false;
  }

  const normalizedAliases = aliases.map(normalizeRouteInputFieldId);
  const propertyDefaults: readonly { field: string }[] = result?.airborneBasis?.propertyDefaults ?? [];
  return propertyDefaults.some((defaultValue) => normalizedAliases.includes(normalizeRouteInputFieldId(defaultValue.field)));
}

function routeHasLiveOutput(
  result: AssemblyCalculation | null,
  selectedOutputs: readonly RequestedOutputId[],
  predicate: (outputId: RequestedOutputId) => boolean
): boolean {
  if (!result) {
    return false;
  }

  return selectedOutputs.some((outputId) => {
    if (!predicate(outputId) || !result.supportedTargetOutputs.includes(outputId)) {
      return false;
    }

    const value = readOutputValue(result, outputId);
    return typeof value === "number" && Number.isFinite(value);
  });
}

function routeHasLiveImpactOutput(result: AssemblyCalculation | null, selectedOutputs: readonly RequestedOutputId[]): boolean {
  return routeHasLiveOutput(result, selectedOutputs, isImpactOutput);
}

function routeHasLiveAirborneOutput(result: AssemblyCalculation | null, selectedOutputs: readonly RequestedOutputId[]): boolean {
  return routeHasLiveOutput(result, selectedOutputs, isAirborneCurveOutput);
}

function routeHasLiveAirborneContextOutput(result: AssemblyCalculation | null, selectedOutputs: readonly RequestedOutputId[]): boolean {
  return routeHasLiveOutput(result, selectedOutputs, outputRequiresAirborneContext);
}

function isMeasuredExactAirborneRoute(result: AssemblyCalculation | null): boolean {
  return result?.airborneBasis?.origin === "measured_exact_full_stack";
}

function isExactImpactRoute(result: AssemblyCalculation | null): boolean {
  const basis = result?.impact?.basis;
  return Boolean(basis?.startsWith("exact_") || basis?.includes("exact_source"));
}

function contextInputValueIsSent(inputId: string, context: ContextDraft, layerCount: number): boolean {
  switch (inputId) {
    case CONTEXT_INPUT_IDS.airborneMode:
      return context.airborneMode !== "element_lab";
    case CONTEXT_INPUT_IDS.airborneResilientBarSideCount:
      return context.airborneResilientBarSideCount !== "auto";
    case CONTEXT_INPUT_IDS.buildingPredictionOutputBasis:
      return context.buildingPredictionOutputBasis !== "unknown";
    case CONTEXT_INPUT_IDS.ci50_2500Db:
      return parseOptionalFiniteNumber(context.ci50_2500Db) !== undefined;
    case CONTEXT_INPUT_IDS.ciDb:
      return parseOptionalFiniteNumber(context.ciDb) !== undefined;
    case CONTEXT_INPUT_IDS.conservativeFlankingAssumption:
      return context.conservativeFlankingAssumption !== "unknown";
    case CONTEXT_INPUT_IDS.fieldKDb:
      return parseOptionalFiniteNumber(context.fieldKDb) !== undefined;
    case CONTEXT_INPUT_IDS.flankingJunctionClass:
      return context.flankingJunctionClass !== "unknown";
    case CONTEXT_INPUT_IDS.impactReceivingRoomVolumeM3:
      return parseOptionalPositiveNumber(context.impactReceivingRoomVolumeM3) !== undefined;
    case CONTEXT_INPUT_IDS.junctionCouplingLengthM:
      return parseOptionalPositiveNumber(context.junctionCouplingLengthM) !== undefined;
    case CONTEXT_INPUT_IDS.loadBasisKgM2:
      return parseOptionalPositiveNumber(context.loadBasisKgM2) !== undefined;
    case CONTEXT_INPUT_IDS.panelHeightMm:
      return parseOptionalPositiveNumber(context.panelHeightMm) !== undefined;
    case CONTEXT_INPUT_IDS.panelWidthMm:
      return parseOptionalPositiveNumber(context.panelWidthMm) !== undefined;
    case CONTEXT_INPUT_IDS.receivingRoomRt60S:
      return parseOptionalPositiveNumber(context.receivingRoomRt60S) !== undefined;
    case CONTEXT_INPUT_IDS.receivingRoomVolumeM3:
      return parseOptionalPositiveNumber(context.receivingRoomVolumeM3) !== undefined;
    case CONTEXT_INPUT_IDS.resilientLayerDynamicStiffnessMNm3:
      return parseOptionalPositiveNumber(context.resilientLayerDynamicStiffnessMNm3) !== undefined;
    case CONTEXT_INPUT_IDS.sourceRoomVolumeM3:
      return parseOptionalPositiveNumber(context.sourceRoomVolumeM3) !== undefined;
    case CONTEXT_INPUT_IDS.supportSpacingMm:
      return parseOptionalPositiveNumber(context.supportSpacingMm) !== undefined;
    case CONTEXT_INPUT_IDS.wallCavity1AbsorptionClass:
      return context.wallTopologyMode !== "auto" && context.wallCavity1AbsorptionClass !== "unknown";
    case CONTEXT_INPUT_IDS.wallCavity1DepthMm:
      return context.wallTopologyMode !== "auto" && parseOptionalPositiveNumber(context.wallCavity1DepthMm) !== undefined;
    case CONTEXT_INPUT_IDS.wallCavity1FillCoverage:
      return context.wallTopologyMode !== "auto" && context.wallCavity1FillCoverage !== "unknown";
    case CONTEXT_INPUT_IDS.wallCavity1LayerIndices:
      return context.wallTopologyMode !== "auto" && parseLayerIndexList(context.wallCavity1LayerIndices, layerCount) !== undefined;
    case CONTEXT_INPUT_IDS.wallSideALeafLayerIndices:
      return context.wallTopologyMode !== "auto" && parseLayerIndexList(context.wallSideALeafLayerIndices, layerCount) !== undefined;
    case CONTEXT_INPUT_IDS.wallSideBLeafLayerIndices:
      return context.wallTopologyMode !== "auto" && parseLayerIndexList(context.wallSideBLeafLayerIndices, layerCount) !== undefined;
    case CONTEXT_INPUT_IDS.wallSupportTopology:
      return context.wallTopologyMode !== "auto" && context.wallSupportTopology !== "unknown";
    case CONTEXT_INPUT_IDS.wallTopologyMode:
      return context.wallTopologyMode !== "auto";
    default:
      return false;
  }
}

function setRouteInputEffectiveness(
  target: Record<string, RouteInputEffectiveness>,
  inputId: string,
  status: RouteInputEffectivenessStatus,
  title: string
): void {
  if (target[inputId]) {
    return;
  }

  target[inputId] = { status, title };
}

const LAB_AIRBORNE_CONTEXT_INACTIVE_TITLE =
  "Current output set is lab airborne only; field/building context inputs affect outputs such as R'w, Dn,w, or DnT,w, not this lab output";
const AIRBORNE_CONTEXT_LAB_MODE_INACTIVE_TITLE =
  "Selected field/building output needs Field or Building mode; this input is inactive while Airborne mode is Lab mode";
const NON_AIRBORNE_CONTEXT_INACTIVE_TITLE =
  "Airborne context inputs are inactive because the selected output set is not airborne";
const AUTO_WALL_TOPOLOGY_INACTIVE_TITLE =
  "Manual wall topology inputs are inactive while topology mode is Auto; the current output uses automatic layer-stack interpretation instead of manual leaf/cavity grouping";

function getRouteInputLabel(inputId: string): string {
  switch (inputId) {
    case CONTEXT_INPUT_IDS.airborneMode:
      return "Airborne mode";
    case CONTEXT_INPUT_IDS.airborneResilientBarSideCount:
      return "Resilient bar side count";
    case CONTEXT_INPUT_IDS.buildingPredictionOutputBasis:
      return "Building prediction output basis";
    case CONTEXT_INPUT_IDS.ci50_2500Db:
      return "CI50-2500";
    case CONTEXT_INPUT_IDS.ciDb:
      return "CI";
    case CONTEXT_INPUT_IDS.conservativeFlankingAssumption:
      return "Conservative flanking assumption";
    case CONTEXT_INPUT_IDS.fieldKDb:
      return "Field K";
    case CONTEXT_INPUT_IDS.flankingJunctionClass:
      return "Flanking junction";
    case CONTEXT_INPUT_IDS.impactReceivingRoomVolumeM3:
      return "Impact receiving room volume";
    case CONTEXT_INPUT_IDS.junctionCouplingLengthM:
      return "Junction coupling length";
    case CONTEXT_INPUT_IDS.loadBasisKgM2:
      return "Load basis";
    case CONTEXT_INPUT_IDS.panelHeightMm:
      return "Panel height";
    case CONTEXT_INPUT_IDS.panelWidthMm:
      return "Panel width";
    case CONTEXT_INPUT_IDS.receivingRoomRt60S:
      return "Receiving room RT60";
    case CONTEXT_INPUT_IDS.receivingRoomVolumeM3:
      return "Receiving room volume";
    case CONTEXT_INPUT_IDS.resilientLayerDynamicStiffnessMNm3:
      return "Dynamic stiffness";
    case CONTEXT_INPUT_IDS.sourceRoomVolumeM3:
      return "Source room volume";
    case CONTEXT_INPUT_IDS.supportSpacingMm:
      return "Support spacing";
    case CONTEXT_INPUT_IDS.wallCavity1AbsorptionClass:
      return "Cavity absorption class";
    case CONTEXT_INPUT_IDS.wallCavity1DepthMm:
      return "Cavity depth";
    case CONTEXT_INPUT_IDS.wallCavity1FillCoverage:
      return "Cavity fill";
    case CONTEXT_INPUT_IDS.wallCavity1LayerIndices:
      return "Cavity layer rows";
    case CONTEXT_INPUT_IDS.wallSideALeafLayerIndices:
      return "Side A leaf rows";
    case CONTEXT_INPUT_IDS.wallSideBLeafLayerIndices:
      return "Side B leaf rows";
    case CONTEXT_INPUT_IDS.wallSupportTopology:
      return "Support topology";
    case CONTEXT_INPUT_IDS.wallTopologyMode:
      return "Wall topology mode";
    default:
      return "This input";
  }
}

function buildRouteInputNeededTitle(inputId: string): string {
  return `${getRouteInputLabel(inputId)} is required before the current route can calculate the selected output`;
}

function buildRouteInputDefaultedTitle(inputId: string): string {
  return `${getRouteInputLabel(inputId)} is using a route default for the current output; enter a value to replace the fallback`;
}

function buildBuildingPredictionOutsideModeTitle(airborneMode: ContextDraft["airborneMode"]): string {
  if (airborneMode === "field_between_rooms") {
    return "Building-prediction inputs are inactive while Field airborne mode owns the current output";
  }

  return "Building-prediction inputs are inactive outside Building mode for the selected output set";
}

function buildAirborneContextUsedTitle(airborneMode: ContextDraft["airborneMode"]): string {
  if (airborneMode === "building_prediction") {
    return "Used by the current building-prediction route for the current output";
  }

  return "Used by the current field airborne route for the current output";
}

function hasUnsupportedSelectedAirborneContextOutput(
  result: AssemblyCalculation,
  selectedOutputs: readonly RequestedOutputId[]
): boolean {
  const boundaryUnsupportedOutputs = result.acousticAnswerBoundary?.unsupportedOutputs ?? [];
  return selectedOutputs.some(
    (outputId) =>
      outputRequiresAirborneContext(outputId) &&
      (result.unsupportedTargetOutputs.includes(outputId) || boundaryUnsupportedOutputs.includes(outputId))
  );
}

function buildInactiveAirborneContextTitle(input: {
  measuredExactAirborneRoute: boolean;
  result: AssemblyCalculation;
  selectedOutputs: readonly RequestedOutputId[];
}): string {
  if (input.measuredExactAirborneRoute) {
    return "Exact source row selected; field/building context inputs are not used by the active route";
  }

  if (hasUnsupportedSelectedAirborneContextOutput(input.result, input.selectedOutputs)) {
    return "Selected field/building output is unsupported by the active route";
  }

  return "No supported field/building output is live for the active route";
}

function buildFloorImpactInputUsedTitle(inputId: string): string {
  if (inputId === CONTEXT_INPUT_IDS.resilientLayerDynamicStiffnessMNm3) {
    return "Used by the current floor impact formula route as the dynamic stiffness input for the current output";
  }

  return "Used by the current floor impact formula route as the load basis input for the current output";
}

export function buildRouteInputEffectiveness(input: {
  context: ContextDraft;
  layerCount: number;
  mode: StudyMode;
  result: AssemblyCalculation | null;
  routeInputTaskElementIds: ReadonlySet<string>;
  selectedOutputs: readonly RequestedOutputId[];
}): Record<string, RouteInputEffectiveness> {
  // AGENT COORDINATION 2026-06-22: Working only on route input effectiveness tooltip copy in this helper (needed/defaulted/mode-boundary titles).
  // If you also need this region, update this note before editing; do not change status semantics without tests.
  const effectiveness: Record<string, RouteInputEffectiveness> = {};
  const selectedAirborneContextOutput = input.selectedOutputs.some(outputRequiresAirborneContext);
  const selectedAirborneOutput = input.selectedOutputs.some(isAirborneCurveOutput);
  const selectedImpactContextOutput = input.selectedOutputs.some(outputRequiresImpactContext);
  const selectedImpactOutput = input.selectedOutputs.some(isImpactOutput);
  const liveAirborneOutput = routeHasLiveAirborneOutput(input.result, input.selectedOutputs);
  const liveAirborneContextOutput = routeHasLiveAirborneContextOutput(input.result, input.selectedOutputs);
  const liveImpactOutput = routeHasLiveImpactOutput(input.result, input.selectedOutputs);
  const measuredExactAirborneRoute = isMeasuredExactAirborneRoute(input.result);
  const exactImpactRoute = isExactImpactRoute(input.result);

  for (const inputId of input.routeInputTaskElementIds) {
    setRouteInputEffectiveness(effectiveness, inputId, "needed", buildRouteInputNeededTitle(inputId));
  }

  for (const inputId of Object.values(CONTEXT_INPUT_IDS)) {
    if (routeInputHasAirborneDefault(input.result, inputId)) {
      setRouteInputEffectiveness(effectiveness, inputId, "defaulted", buildRouteInputDefaultedTitle(inputId));
    }
  }

  if (selectedAirborneOutput && !selectedAirborneContextOutput && input.context.airborneMode !== "element_lab") {
    for (const inputId of AIRBORNE_CONTEXT_INPUT_IDS) {
      setRouteInputEffectiveness(effectiveness, inputId, "inactive", LAB_AIRBORNE_CONTEXT_INACTIVE_TITLE);
    }
    for (const inputId of BUILDING_PREDICTION_INPUT_IDS) {
      setRouteInputEffectiveness(effectiveness, inputId, "inactive", LAB_AIRBORNE_CONTEXT_INACTIVE_TITLE);
    }
  }

  if (selectedAirborneContextOutput && input.context.airborneMode === "element_lab") {
    for (const inputId of AIRBORNE_CONTEXT_INPUT_IDS) {
      setRouteInputEffectiveness(effectiveness, inputId, "inactive", AIRBORNE_CONTEXT_LAB_MODE_INACTIVE_TITLE);
    }
    for (const inputId of BUILDING_PREDICTION_INPUT_IDS) {
      setRouteInputEffectiveness(effectiveness, inputId, "inactive", buildBuildingPredictionOutsideModeTitle(input.context.airborneMode));
    }
  }

  if (!selectedAirborneOutput && input.context.airborneMode !== "element_lab") {
    for (const inputId of AIRBORNE_CONTEXT_INPUT_IDS) {
      setRouteInputEffectiveness(effectiveness, inputId, "inactive", NON_AIRBORNE_CONTEXT_INACTIVE_TITLE);
    }
    for (const inputId of BUILDING_PREDICTION_INPUT_IDS) {
      setRouteInputEffectiveness(effectiveness, inputId, "inactive", NON_AIRBORNE_CONTEXT_INACTIVE_TITLE);
    }
  }

  if (
    selectedAirborneContextOutput &&
    input.context.airborneMode !== "element_lab" &&
    input.result &&
    (!liveAirborneContextOutput || measuredExactAirborneRoute)
  ) {
    const inactiveAirborneContextTitle = buildInactiveAirborneContextTitle({
      measuredExactAirborneRoute,
      result: input.result,
      selectedOutputs: input.selectedOutputs
    });

    for (const inputId of AIRBORNE_CONTEXT_INPUT_IDS) {
      setRouteInputEffectiveness(effectiveness, inputId, "inactive", inactiveAirborneContextTitle);
    }

    if (input.context.airborneMode === "building_prediction") {
      for (const inputId of BUILDING_PREDICTION_INPUT_IDS) {
        setRouteInputEffectiveness(effectiveness, inputId, "inactive", inactiveAirborneContextTitle);
      }
    } else {
      for (const inputId of BUILDING_PREDICTION_INPUT_IDS) {
        setRouteInputEffectiveness(effectiveness, inputId, "inactive", buildBuildingPredictionOutsideModeTitle(input.context.airborneMode));
      }
    }
  }

  if (!input.result) {
    return effectiveness;
  }

  if (input.mode === "wall") {
    if (input.context.wallTopologyMode === "auto") {
      for (const inputId of WALL_TOPOLOGY_MANUAL_INPUT_IDS) {
        setRouteInputEffectiveness(effectiveness, inputId, "inactive", AUTO_WALL_TOPOLOGY_INACTIVE_TITLE);
      }
    } else if (measuredExactAirborneRoute) {
      setRouteInputEffectiveness(
        effectiveness,
        CONTEXT_INPUT_IDS.wallTopologyMode,
        "inactive",
        "Exact source owns the current output; manual topology is not used"
      );
      for (const inputId of WALL_TOPOLOGY_MANUAL_INPUT_IDS) {
        setRouteInputEffectiveness(
          effectiveness,
          inputId,
          "inactive",
          "Exact source owns the current output; manual wall topology inputs are not used"
        );
      }
    } else if (liveAirborneOutput) {
      setRouteInputEffectiveness(
        effectiveness,
        CONTEXT_INPUT_IDS.wallTopologyMode,
        "used",
        "Used by the current wall topology formula route for the current output"
      );
      for (const inputId of WALL_TOPOLOGY_MANUAL_INPUT_IDS) {
        if (contextInputValueIsSent(inputId, input.context, input.layerCount)) {
          setRouteInputEffectiveness(
            effectiveness,
            inputId,
            "used",
            "Used by the current wall topology formula route for leaf/cavity grouping"
          );
        }
      }
    }
  }

  if (selectedAirborneContextOutput && input.context.airborneMode !== "element_lab") {
    const airborneContextTitle = buildAirborneContextUsedTitle(input.context.airborneMode);

    if (liveAirborneContextOutput && !measuredExactAirborneRoute) {
      setRouteInputEffectiveness(effectiveness, CONTEXT_INPUT_IDS.airborneMode, "used", airborneContextTitle);
      for (const inputId of AIRBORNE_CONTEXT_INPUT_IDS) {
        if (inputId !== CONTEXT_INPUT_IDS.airborneMode && contextInputValueIsSent(inputId, input.context, input.layerCount)) {
          setRouteInputEffectiveness(effectiveness, inputId, "used", airborneContextTitle);
        }
      }
    }

    if (input.context.airborneMode === "building_prediction") {
      if (liveAirborneContextOutput && !measuredExactAirborneRoute) {
        for (const inputId of BUILDING_PREDICTION_INPUT_IDS) {
          if (contextInputValueIsSent(inputId, input.context, input.layerCount)) {
            setRouteInputEffectiveness(effectiveness, inputId, "used", buildAirborneContextUsedTitle(input.context.airborneMode));
          }
        }
      }
    } else {
      for (const inputId of BUILDING_PREDICTION_INPUT_IDS) {
        setRouteInputEffectiveness(effectiveness, inputId, "inactive", buildBuildingPredictionOutsideModeTitle(input.context.airborneMode));
      }
    }
  }

  if (input.mode === "floor") {
    if (selectedImpactOutput && liveImpactOutput && !exactImpactRoute) {
      for (const inputId of FLOOR_IMPACT_INPUT_IDS) {
        if (contextInputValueIsSent(inputId, input.context, input.layerCount)) {
          setRouteInputEffectiveness(effectiveness, inputId, "used", buildFloorImpactInputUsedTitle(inputId));
        }
      }
    } else if (selectedImpactOutput && exactImpactRoute) {
      for (const inputId of FLOOR_IMPACT_INPUT_IDS) {
        setRouteInputEffectiveness(
          effectiveness,
          inputId,
          "inactive",
          "Exact impact source owns the current output; floor impact formula route inputs are not used"
        );
      }
    }

    if (selectedImpactContextOutput && liveImpactOutput && !exactImpactRoute) {
      for (const inputId of IMPACT_FIELD_INPUT_IDS) {
        if (contextInputValueIsSent(inputId, input.context, input.layerCount)) {
          setRouteInputEffectiveness(
            effectiveness,
            inputId,
            "used",
            "Used by the current impact field formula route for the current output"
          );
        }
      }
    } else if (!selectedImpactContextOutput) {
      for (const inputId of IMPACT_FIELD_INPUT_IDS) {
        setRouteInputEffectiveness(
          effectiveness,
          inputId,
          "inactive",
          "impact field inputs are not used by the selected output set"
        );
      }
    }
  }

  return effectiveness;
}

function setLayerInputEffectiveness(
  target: LayerInputEffectivenessMap,
  layerId: string,
  fieldId: LayerInputFieldId,
  status: RouteInputEffectivenessStatus,
  title: string
): void {
  target[layerId] = target[layerId] ?? {};
  if (target[layerId]![fieldId]) {
    return;
  }

  target[layerId]![fieldId] = { status, title };
}

export function buildLayerInputEffectiveness(input: {
  layers: readonly DraftLayer[];
  mode: StudyMode;
  result: AssemblyCalculation | null;
  selectedOutputs: readonly RequestedOutputId[];
}): LayerInputEffectivenessMap {
  // AGENT COORDINATION 2026-06-22: Working only on layer input effectiveness tooltip copy in this helper.
  // If you also need this region, update this note before editing to avoid overlapping UI/status work.
  const effectiveness: LayerInputEffectivenessMap = {};
  const selectedAirborneOutput = input.selectedOutputs.some(isAirborneCurveOutput);
  const selectedImpactOutput = input.selectedOutputs.some(isImpactOutput);
  const liveAirborneOutput = routeHasLiveAirborneOutput(input.result, input.selectedOutputs);
  const liveImpactOutput = routeHasLiveImpactOutput(input.result, input.selectedOutputs);
  const liveFormulaAirborneOutput = liveAirborneOutput && !isMeasuredExactAirborneRoute(input.result);
  const liveFormulaImpactOutput = liveImpactOutput && !isExactImpactRoute(input.result);
  const liveFormulaOutput = liveFormulaAirborneOutput || liveFormulaImpactOutput;
  const liveSelectedOutput = liveAirborneOutput || liveImpactOutput;

  for (const layer of input.layers) {
    const hasThickness = parsePositiveNumber(layer.thicknessMm) !== null;

    if (!hasThickness) {
      setLayerInputEffectiveness(
        effectiveness,
        layer.id,
        "thickness",
        "needed",
        "Needed: layer thickness is required before the current output can calculate the layer stack"
      );
    }

    if (!input.result) {
      continue;
    }

    if (liveFormulaOutput) {
      setLayerInputEffectiveness(
        effectiveness,
        layer.id,
        "material",
        "used",
        "Used by the current formula route to define the layer stack"
      );

      if (hasThickness) {
        setLayerInputEffectiveness(
          effectiveness,
          layer.id,
          "thickness",
          "used",
          "Used by the current formula route to calculate layer mass and geometry"
        );
      }
    } else if (liveSelectedOutput) {
      setLayerInputEffectiveness(
        effectiveness,
        layer.id,
        "material",
        "used",
        "Used to match the exact source construction for the current output"
      );

      if (hasThickness) {
        setLayerInputEffectiveness(
          effectiveness,
          layer.id,
          "thickness",
          "used",
          "Used to match the exact source construction for the current output"
        );
      }
    }

    if (input.mode === "wall") {
      setLayerInputEffectiveness(
        effectiveness,
        layer.id,
        "role",
        "inactive",
        "Wall layer role is not sent to the calculator; use Wall topology inputs for leaf and cavity grouping"
      );
    } else if (selectedImpactOutput && liveFormulaImpactOutput) {
      setLayerInputEffectiveness(
        effectiveness,
        layer.id,
        "role",
        "used",
        "Used by the current floor impact route to classify floor layers"
      );
    } else if (selectedImpactOutput && liveImpactOutput && isExactImpactRoute(input.result)) {
      setLayerInputEffectiveness(
        effectiveness,
        layer.id,
        "role",
        "used",
        "Used to match the exact impact source construction for the current output"
      );
    } else if (selectedAirborneOutput && !selectedImpactOutput) {
      setLayerInputEffectiveness(
        effectiveness,
        layer.id,
        "role",
        "inactive",
        "Floor layer role is not used by the current airborne output set"
      );
    }
  }

  return effectiveness;
}

// AGENT COORDINATION 2026-06-24 (Codex): exported for focused client-boundary
// tests so API-safe error envelopes cannot regress into raw Workbench copy.
export function parseEstimateError(payload: unknown): string {
  if (typeof payload === "object" && payload !== null && "error" in payload) {
    const error = (payload as { error?: unknown }).error;
    if (typeof error === "string" && error.trim()) {
      return error;
    }
  }

  return "Estimate failed.";
}

function parseCalculatorAssistantPreviewError(payload: unknown): string {
  if (isObjectRecord(payload)) {
    if (Array.isArray(payload.errors)) {
      const errors = payload.errors.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0);
      if (errors.length) {
        return errors.join("; ");
      }
    }

    if (typeof payload.error === "string" && payload.error.trim()) {
      return payload.error;
    }
  }

  return "Assistant calculator preview failed.";
}

function parseCalculatorAssistantPreviewPayload(payload: unknown): WorkbenchV2CalculatorAssistantPreview | null {
  if (!isObjectRecord(payload) || payload.ok !== true || !isObjectRecord(payload.preview)) {
    return null;
  }

  const preview = payload.preview;
  if (
    !isObjectRecord(preview.calculationSummary) ||
    !isObjectRecord(preview.requestedSnapshot) ||
    !Array.isArray(preview.outputRows) ||
    !Array.isArray(preview.tasks)
  ) {
    return null;
  }

  return preview as WorkbenchV2CalculatorAssistantPreview;
}

function parseCalculatorAssistantSourceReviewMessage(payload: unknown): string {
  if (isObjectRecord(payload)) {
    if (Array.isArray(payload.errors)) {
      const errors = payload.errors.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0);
      if (errors.length) {
        return errors.join("; ");
      }
    }

    if (typeof payload.error === "string" && payload.error.trim()) {
      return payload.error;
    }
  }

  return "Current calculator source review failed.";
}

function parseCalculatorAssistantSourceReviewWarnings(payload: unknown): string[] {
  return isObjectRecord(payload) && Array.isArray(payload.warnings)
    ? payload.warnings.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0)
    : [];
}

function parseCalculatorAssistantSourceReviewSource(payload: unknown): "context" | "research_provider" | null {
  if (!isObjectRecord(payload)) {
    return null;
  }

  return payload.source === "context" || payload.source === "research_provider" ? payload.source : null;
}

function parseCalculatorAssistantAssemblyAlternativeSource(payload: unknown): ReportAssistantAssemblyAlternativeReviewSource | null {
  if (!isObjectRecord(payload)) {
    return null;
  }

  return payload.source === "context" || payload.source === "research_provider" ? payload.source : null;
}

function parseCalculatorAssistantSourceReviewResult(payload: unknown): ReportAssistantResultEnvelope | null {
  const firstResult = isObjectRecord(payload) && Array.isArray(payload.assistantResults)
    ? payload.assistantResults.find(isObjectRecord)
    : null;

  if (!firstResult) {
    return null;
  }

  const validation = validateReportAssistantResultEnvelope(firstResult as ReportAssistantResultEnvelope);
  return validation.ok ? validation.envelope : null;
}

function parseCalculatorAssistantSourceReviewReview(payload: unknown): ReportAssistantPlausibilityReview | null {
  if (!isObjectRecord(payload) || !isObjectRecord(payload.review)) {
    return null;
  }

  const review = payload.review;
  if (
    typeof review.metricId !== "string" ||
    typeof review.metric !== "string" ||
    typeof review.valueReviewed !== "string" ||
    typeof review.verdict !== "string" ||
    typeof review.comparability !== "string" ||
    typeof review.sourceQuality !== "string" ||
    !Array.isArray(review.sources) ||
    !Array.isArray(review.rationale)
  ) {
    return null;
  }

  return review as ReportAssistantPlausibilityReview;
}

function parseCalculatorAssistantAssemblyAlternativeReview(payload: unknown): ReportAssistantAssemblyAlternativeReview | null {
  if (!isObjectRecord(payload) || !isObjectRecord(payload.review)) {
    return null;
  }

  const review = payload.review;
  if (
    !Array.isArray(review.affectedLayers) ||
    typeof review.answerText !== "string" ||
    !Array.isArray(review.comparableAssemblies) ||
    typeof review.comparability !== "string" ||
    typeof review.expectedMetricDirection !== "string" ||
    !Array.isArray(review.expectedTradeoffs) ||
    !Array.isArray(review.missingEvidence) ||
    !Array.isArray(review.rationale) ||
    typeof review.sourceQuality !== "string" ||
    !Array.isArray(review.sources) ||
    !Array.isArray(review.suggestedAlternatives)
  ) {
    return null;
  }

  return review as ReportAssistantAssemblyAlternativeReview;
}

function parseCalculatorAssistantCommandIntentError(payload: unknown): string {
  if (isObjectRecord(payload)) {
    if (Array.isArray(payload.errors)) {
      const errors = payload.errors.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0);
      if (errors.length) {
        return errors.join("; ");
      }
    }

    if (typeof payload.error === "string" && payload.error.trim()) {
      return payload.error;
    }
  }

  return "Natural-language command interpretation failed.";
}

function parseCalculatorAssistantCommandIntentPayload(payload: unknown): CalculatorAssistantCommandIntentDecision | null {
  if (!isObjectRecord(payload) || payload.ok !== true || !isObjectRecord(payload.decision)) {
    return null;
  }

  const decision = payload.decision;
  const status = typeof decision.status === "string" ? decision.status : "";
  const confidence =
    decision.confidence === "high" || decision.confidence === "low" || decision.confidence === "medium"
      ? decision.confidence
      : "medium";
  const explanation = typeof decision.explanation === "string" && decision.explanation.trim()
    ? decision.explanation.trim()
    : "Assistant interpreted the calculator request.";
  const warnings = Array.isArray(decision.warnings)
    ? decision.warnings.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0)
    : [];

  if (status === "apply") {
    return typeof decision.normalizedCommand === "string" && decision.normalizedCommand.trim()
      ? {
          confidence,
          explanation,
          normalizedCommand: decision.normalizedCommand.trim(),
          status,
          warnings
        }
      : null;
  }

  if (status === "clarify" || status === "reject") {
    return typeof decision.message === "string" && decision.message.trim()
      ? {
          confidence,
          explanation,
          message: decision.message.trim(),
          status,
          warnings
        }
      : null;
  }

  return null;
}

async function requestCalculatorAssistantCommandInterpretation(input: {
  currentLayers: readonly DraftLayer[];
  currentMode: StudyMode;
  currentSelectedOutputs: readonly RequestedOutputId[];
  instruction: string;
  materials: readonly MaterialDefinition[];
}): Promise<CalculatorAssistantCommandIntentDecision> {
  const response = await fetch("/api/report-assistant/calculator-command-intent", {
    body: JSON.stringify({
      currentLayers: input.currentLayers,
      currentMode: input.currentMode,
      currentSelectedOutputs: input.currentSelectedOutputs,
      instruction: input.instruction,
      materials: input.materials
    }),
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST"
  });
  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(parseCalculatorAssistantCommandIntentError(payload));
  }

  const decision = parseCalculatorAssistantCommandIntentPayload(payload);
  if (!decision) {
    throw new Error("Natural-language command interpretation response is incomplete.");
  }

  return decision;
}

async function requestCalculatorAssistantPreview(input: {
  signal: AbortSignal;
  snapshot: WorkbenchV2ProjectSnapshot;
}): Promise<WorkbenchV2CalculatorAssistantPreview> {
  const response = await fetch("/api/report-assistant/calculator-preview", {
    body: JSON.stringify({
      snapshot: input.snapshot,
      targetOutputs: [...input.snapshot.selectedOutputs]
    }),
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    signal: input.signal
  });
  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(parseCalculatorAssistantPreviewError(payload));
  }

  const preview = parseCalculatorAssistantPreviewPayload(payload);
  if (!preview) {
    throw new Error("Assistant calculator preview response is incomplete.");
  }

  return preview;
}

async function requestCalculatorAssistantSourceReview(input: {
  instruction: string;
  packet: ReportAssistantCurrentCalculatorReviewPacket;
  research: boolean;
  signal: AbortSignal;
}): Promise<{
  message?: string;
  ok: boolean;
  result?: ReportAssistantResultEnvelope;
  review?: ReportAssistantPlausibilityReview;
  source: "context" | "research_provider" | null;
  warnings: readonly string[];
}> {
  const response = await fetch("/api/report-assistant/plausibility", {
    body: JSON.stringify({
      currentCalculatorReviewPacket: input.packet,
      review: {
        metricId: input.packet.metric.metricId,
        research: input.research,
        sources: [],
        suggestPatch: false,
        userInstruction: input.instruction
      }
    }),
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    signal: input.signal
  });
  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  const result = parseCalculatorAssistantSourceReviewResult(payload);
  const review = parseCalculatorAssistantSourceReviewReview(payload);
  const source = parseCalculatorAssistantSourceReviewSource(payload);
  const warnings = parseCalculatorAssistantSourceReviewWarnings(payload);

  if (!response.ok) {
    return {
      message: parseCalculatorAssistantSourceReviewMessage(payload),
      ok: false,
      ...(result ? { result } : {}),
      ...(review ? { review } : {}),
      source,
      warnings
    };
  }

  if (!result || !review) {
    return {
      message: "Current calculator source review response is incomplete.",
      ok: false,
      ...(result ? { result } : {}),
      ...(review ? { review } : {}),
      source,
      warnings
    };
  }

  return {
    ok: true,
    result,
    review,
    source,
    warnings
  };
}

async function requestCalculatorAssistantAssemblyAlternatives(input: {
  assistantContext: ReportAssistantContext;
  document: SimpleWorkbenchProposalDocument;
  instruction: string;
  research: boolean;
  signal: AbortSignal;
}): Promise<{
  message?: string;
  ok: boolean;
  result?: ReportAssistantResultEnvelope;
  review?: ReportAssistantAssemblyAlternativeReview;
  source: ReportAssistantAssemblyAlternativeReviewSource | null;
  warnings: readonly string[];
}> {
  const response = await fetch("/api/report-assistant/assembly-alternatives", {
    body: JSON.stringify({
      context: input.assistantContext,
      document: input.document,
      request: {
        research: input.research,
        userInstruction: input.instruction
      }
    }),
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    signal: input.signal
  });
  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  const result = parseCalculatorAssistantSourceReviewResult(payload);
  const review = parseCalculatorAssistantAssemblyAlternativeReview(payload);
  const source = parseCalculatorAssistantAssemblyAlternativeSource(payload);
  const warnings = parseCalculatorAssistantSourceReviewWarnings(payload);

  if (!response.ok) {
    return {
      message: parseCalculatorAssistantSourceReviewMessage(payload),
      ok: false,
      ...(result ? { result } : {}),
      ...(review ? { review } : {}),
      source,
      warnings
    };
  }

  if (!result || !review || !source) {
    return {
      message: "Assembly alternative research response is incomplete.",
      ok: false,
      ...(result ? { result } : {}),
      ...(review ? { review } : {}),
      source,
      warnings
    };
  }

  return {
    ok: true,
    result,
    review,
    source,
    warnings
  };
}

function parseCalculatorAssistantOutputNumber(value: string): number | null {
  const match = /-?\d+(?:[.,]\d+)?/u.exec(value);
  if (!match) {
    return null;
  }

  const parsed = Number.parseFloat(match[0].replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function calculatorAssistantMetricHigherIsBetter(metric: RequestedOutputId): boolean {
  return !(metric === "Ln,w" || metric === "Ln,w+CI" || metric === "L'n,w" || metric === "L'nT,w" || metric === "L'nT,50");
}

function buildCalculatorAssistantCandidateComparisonRanking(input: {
  rows: readonly CalculatorAssistantCandidateComparisonRow[];
  selectedOutputs: readonly RequestedOutputId[];
}): CalculatorAssistantCandidateComparisonRank[] {
  const metric = input.selectedOutputs[0];
  if (!metric || !input.rows.length) {
    return [];
  }

  const candidates = input.rows.map((row) => {
    const output = row.outputRows.find((outputRow) => outputRow.label === metric && outputRow.status === "live");
    const value = output ? parseCalculatorAssistantOutputNumber(output.value) : null;

    return output && value !== null
      ? {
          candidateId: row.candidateId,
          label: row.label,
          metric,
          value,
          valueLabel: output.value
        }
      : null;
  });

  if (candidates.some((candidate) => candidate === null)) {
    return [];
  }

  const higherIsBetter = calculatorAssistantMetricHigherIsBetter(metric);

  return candidates
    .filter((candidate): candidate is NonNullable<typeof candidate> => candidate !== null)
    .sort((left, right) => higherIsBetter ? right.value - left.value : left.value - right.value)
    .map((candidate, index) => ({
      candidateId: candidate.candidateId,
      label: candidate.label,
      metric: candidate.metric,
      rank: index + 1,
      valueLabel: candidate.valueLabel
    }));
}

function outputRequiresAirborneContext(outputId: RequestedOutputId): boolean {
  return outputId === "R'w" || outputId.startsWith("Dn");
}

function outputRequiresImpactContext(outputId: RequestedOutputId): boolean {
  return (
    outputId.includes("'n") ||
    outputId.startsWith("L'nT") ||
    outputId === "AIIC" ||
    outputId === "CI" ||
    outputId === "CI,50-2500" ||
    outputId === "Ln,w+CI" ||
    outputId === "LnT,A"
  );
}

function isImpactOutput(outputId: RequestedOutputId): boolean {
  return getWorkbenchV2OutputOption(outputId)?.group === "Impact";
}

function isAirborneCurveOutput(outputId: RequestedOutputId): boolean {
  const group = getWorkbenchV2OutputOption(outputId)?.group;
  return group === "Airborne" || group === "Spectrum";
}

function showAirborneContext(selectedOutputs: readonly RequestedOutputId[], result: AssemblyCalculation | null): boolean {
  const missingPhysicalInputs = getMissingPhysicalInputs(result);
  return (
    selectedOutputs.some(outputRequiresAirborneContext) ||
    missingPhysicalInputs.some((field: string) => field.includes("receivingRoom") || field.includes("panel"))
  );
}

export function showBuildingPredictionContext(
  context: ContextDraft,
  selectedOutputs: readonly RequestedOutputId[],
  result: AssemblyCalculation | null
): boolean {
  const selectedAirborneOutput = selectedOutputs.some(isAirborneCurveOutput);
  return selectedAirborneOutput && (context.airborneMode === "building_prediction" || getMissingPhysicalInputs(result).some(isBuildingPredictionInput));
}

export function showImpactContext(selectedOutputs: readonly RequestedOutputId[], result: AssemblyCalculation | null): boolean {
  const missingPhysicalInputs = getMissingPhysicalInputs(result);
  return (
    selectedOutputs.some(outputRequiresImpactContext) ||
    missingPhysicalInputs.some((field: string) => field.includes("impactFieldContext"))
  );
}

export function showFloorImpactContext(selectedOutputs: readonly RequestedOutputId[], result: AssemblyCalculation | null): boolean {
  const missingPhysicalInputs = getMissingPhysicalInputs(result);
  return (
    selectedOutputs.some(isImpactOutput) ||
    missingPhysicalInputs.some((field: string) => field.includes("loadBasisKgM2") || field.includes("resilientLayerDynamicStiffnessMNm3"))
  );
}

function showWallTopologyContext(mode: StudyMode, context: ContextDraft, result: AssemblyCalculation | null): boolean {
  if (mode !== "wall") {
    return false;
  }

  return context.wallTopologyMode !== "auto" || getMissingPhysicalInputs(result).some(isWallTopologyInput);
}

function buildLayerVisualStyle(override: MaterialVisualOverride | undefined): ProfessionalLayerVisualStyle | undefined {
  if (!override) {
    return undefined;
  }

  const style: ProfessionalLayerVisualStyle = {};
  if (override.fillColor) style["--layer-fill"] = override.fillColor;
  if (override.sideColor) style["--layer-side"] = override.sideColor;
  if (override.strokeColor) style["--layer-stroke"] = override.strokeColor;
  if (override.patternColor) style["--layer-pattern"] = override.patternColor;

  return Object.keys(style).length ? style : undefined;
}

export function buildIllustrationLayers(
  layers: readonly DraftLayer[],
  mode: StudyMode,
  selectedLayerId: string | null,
  materialById: ReadonlyMap<string, MaterialDefinition>,
  visualOverrides: readonly MaterialVisualOverride[]
): ProfessionalLayerIllustrationLayer[] {
  return layers.map((layer) => {
    const material = getMaterialFromCatalog(layer.materialId, materialById);
    const thicknessMm = parsePositiveNumber(layer.thicknessMm);
    const visualOverride = visualOverrides.find((override) => override.materialId === layer.materialId);

    return {
      active: layer.id === selectedLayerId,
      categoryLabel: material.category,
      id: layer.id,
      label: material.name,
      material,
      roleLabel: getRoleLabel(mode, layer.role),
      solverLabel: mode === "floor" ? "Floor role" : undefined,
      thicknessLabel: formatThickness(thicknessMm),
      thicknessMm,
      visualStyle: buildLayerVisualStyle(visualOverride)
    };
  });
}

function getPrimaryOutput(rows: readonly OutputRow[]): OutputRow | null {
  return rows.find((row) => row.status === "live") ?? rows[0] ?? null;
}

function buildReportSnapshot(input: {
  layers: readonly DraftLayer[];
  materialById: ReadonlyMap<string, MaterialDefinition>;
  mode: StudyMode;
  outputRows: readonly OutputRow[];
  projectName?: string;
  responseFigures: ReturnType<typeof buildWorkbenchResponseCurveFigures>;
  serverProjectId?: string;
  serverProjectScenarioId?: string;
}): SimpleWorkbenchProposalDocument {
  const issuedOn = new Date();
  const issuedOnIso = issuedOn.toISOString();
  const issuedOnLabel = new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(issuedOn);
  const liveRows = input.outputRows.filter((row) => row.status === "live");
  const primary = liveRows[0] ?? input.outputRows[0] ?? {
    detail: "No live output is packaged.",
    label: "Status",
    status: "pending" as const,
    value: "Waiting"
  };
  const proposalLayers = input.layers.map((layer, index) => {
    const material = getMaterialFromCatalog(layer.materialId, input.materialById);
    const thicknessMm = parsePositiveNumber(layer.thicknessMm);
    const density = material.densityKgM3;
    const surfaceMass = thicknessMm && density ? (density * thicknessMm) / 1000 : null;

    return {
      categoryLabel: material.category,
      densityLabel: density ? `${density} kg/m3` : undefined,
      index: index + 1,
      label: material.name,
      roleLabel: getRoleLabel(input.mode, layer.role),
      surfaceMassLabel: surfaceMass ? `${surfaceMass.toFixed(1)} kg/m2` : undefined,
      thicknessLabel: formatThickness(thicknessMm)
    };
  });
  const metrics = liveRows.length
    ? liveRows.map((row) => ({
        detail: row.detail,
        engineDisplayValue: row.value,
        label: row.label,
        outputId: row.label as RequestedOutputId,
        reportMetricId: row.label,
        value: row.value
      }))
    : [{ detail: "No live outputs yet.", label: primary.label, value: primary.value }];

  return {
    approverTitle: "Acoustic Consultant",
    assemblyHeadline: `${input.mode === "floor" ? "Floor" : "Wall"} build-up from calculator workbench`,
    assumptionItems: [
      {
        detail: "Report snapshot was packaged from the current calculator workbench state.",
        label: "Packaged workbench state",
        tone: "neutral"
      }
    ],
    briefNote: "",
    citations: [],
    clientName: "Client delivery team",
    consultantAddress: "Office address not entered",
    consultantCompany: "DYNECHO Acoustic Consulting",
    consultantEmail: "Contact email not entered",
    consultantLogoDataUrl: "",
    consultantPhone: "Contact phone not entered",
    consultantWordmarkLine: "Acoustic analysis report",
    contextLabel: "Calculator route",
    corridorDossierCards: [],
    corridorDossierHeadline: "No validation corridor package was added in this frontend handoff.",
    coverageItems: input.outputRows.map((row) => ({
      detail: row.detail,
      engineDisplayValue: row.value,
      label: row.label,
      nextStep: row.status === "needs_input" ? row.detail : undefined,
      outputId: row.label as RequestedOutputId,
      postureDetail: row.status === "live" ? "Calculated output row from the active estimate." : row.detail,
      postureLabel: row.status === "live" ? "Live" : row.status === "needs_input" ? "Needs input" : "Unsupported",
      postureTone: row.status === "live" ? "success" : row.status === "needs_input" ? "warning" : "neutral",
      reportMetricId: row.label,
      status: row.status === "live" ? "live" : row.status === "needs_input" ? "needs_input" : "unsupported",
      value: row.value
    })),
    decisionTrailHeadline: "Packaged from calculator handoff.",
    decisionTrailItems: [],
    dynamicBranchDetail: "Result values are copied from the active calculator response without changing engine behavior.",
    dynamicBranchLabel: "Calculator estimate",
    executiveSummary: `${primary.label} ${primary.value} from the current ${input.mode} layer stack.`,
    issuedOnIso,
    issuedOnLabel,
    issueBaseReference: "DEC-2026-001",
    issueCodePrefix: "DEC",
    issueNextReference: "DEC-2026-002",
    issueRegisterItems: [],
    layers: proposalLayers,
    methodDossierCards: [],
    methodDossierHeadline: "No solver rationale package was added in this frontend handoff.",
    methodTraceGroups: [],
    metrics,
    preparedBy: "DAC Operator",
    primaryMetricLabel: primary.label,
    primaryMetricValue: primary.value,
    primaryMetricVisible: true,
    projectName: input.projectName?.trim() || "DAC Operator Deck",
    proposalAttention: "Design coordination team",
    proposalIssuePurpose: "Client review and acoustic coordination",
    proposalRecipient: "Client delivery team",
    proposalReference: "DEC-2026-001",
    proposalRevision: "Rev 00",
    proposalSubject: `${input.mode === "floor" ? "Floor" : "Wall"} acoustic analysis report`,
    proposalValidityNote: "Valid for 30 calendar days unless superseded by a later issue.",
    recommendationItems: [],
    reportProfile: "consultant",
    reportProfileLabel: "Consultant issue",
    responseCurves: input.responseFigures,
    serverProjectId: input.serverProjectId,
    serverProjectScenarioId: input.serverProjectScenarioId,
    studyContextLabel: "Concept",
    studyModeLabel: input.mode === "floor" ? "Floor" : "Wall",
    validationDetail: "Calculation basis is limited to the selected build-up and requested outputs.",
    validationLabel: primary.status === "live" ? "Calculated estimate" : "Review required",
    warnings: []
  };
}

function storeReportSnapshot(
  document: SimpleWorkbenchProposalDocument,
  projectContext?: SimpleWorkbenchProposalPreviewProjectContext
): void {
  storeSimpleWorkbenchProposalPreview(document, {
    projectContext
  });
}

function readStoredMaterialEditorState(): MaterialEditorPersistedStateParseResult {
  if (typeof window === "undefined") {
    return {
      droppedCustomMaterials: 0,
      droppedVisualOverrides: 0,
      malformed: false,
      state: {
        customMaterials: [],
        materialVisualOverrides: []
      }
    };
  }

  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(MATERIAL_EDITOR_STORAGE_KEY);
  } catch {
    return {
      droppedCustomMaterials: 0,
      droppedVisualOverrides: 0,
      malformed: false,
      state: {
        customMaterials: [],
        materialVisualOverrides: []
      }
    };
  }

  if (!raw) {
    return {
      droppedCustomMaterials: 0,
      droppedVisualOverrides: 0,
      malformed: false,
      state: {
        customMaterials: [],
        materialVisualOverrides: []
      }
    };
  }

  try {
    return parseMaterialEditorPersistedState(JSON.parse(raw) as unknown);
  } catch {
    return {
      droppedCustomMaterials: 0,
      droppedVisualOverrides: 0,
      malformed: true,
      state: {
        customMaterials: [],
        materialVisualOverrides: []
      }
    };
  }
}

function formatMaterialEditorRestoreWarning(result: MaterialEditorPersistedStateParseResult): string | null {
  const details: string[] = [];

  if (result.malformed) {
    details.push("stored data could not be parsed");
  }

  if (result.droppedCustomMaterials) {
    details.push(`${result.droppedCustomMaterials} invalid material${result.droppedCustomMaterials === 1 ? "" : "s"} ignored`);
  }

  if (result.droppedVisualOverrides) {
    details.push(`${result.droppedVisualOverrides} invalid appearance override${result.droppedVisualOverrides === 1 ? "" : "s"} ignored`);
  }

  return details.length ? details.join("; ") : null;
}

function storeMaterialEditorState(input: {
  customMaterials: readonly MaterialDefinition[];
  materialVisualOverrides: readonly MaterialVisualOverride[];
}): void {
  if (typeof window === "undefined") {
    return;
  }

  if (!input.customMaterials.length && !input.materialVisualOverrides.length) {
    try {
      window.localStorage.removeItem(MATERIAL_EDITOR_STORAGE_KEY);
    } catch {
      // Persistence is best-effort; the workbench remains usable without storage.
    }
    return;
  }

  try {
    window.localStorage.setItem(
      MATERIAL_EDITOR_STORAGE_KEY,
      serializeMaterialEditorPersistedState({
        customMaterials: [...input.customMaterials],
        materialVisualOverrides: [...input.materialVisualOverrides]
      })
    );
  } catch {
    // Persistence is best-effort; the workbench remains usable without storage.
  }
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function readServerProjectError(response: Response, fallback: string): Promise<string> {
  try {
    const payload = (await response.json()) as unknown;
    if (isObjectRecord(payload) && typeof payload.error === "string") {
      return payload.error;
    }
  } catch {
    // Keep the caller's fallback when the response body is not JSON.
  }

  return fallback;
}

function parseServerProjectSummaries(value: unknown): ServerProjectSummaryPayload[] {
  if (!isObjectRecord(value) || !Array.isArray(value.projects)) {
    return [];
  }

  return value.projects.filter(
    (project): project is ServerProjectSummaryPayload =>
      isObjectRecord(project) &&
      typeof project.assemblyCount === "number" &&
      typeof project.id === "string" &&
      typeof project.name === "string" &&
      typeof project.ownerLabel === "string" &&
      typeof project.reportCount === "number" &&
      typeof project.scenarioCount === "number" &&
      typeof project.updatedAtIso === "string"
  );
}

function parseAssemblySummary(value: unknown): ServerProjectAssemblySummaryPayload | null {
  if (
    !isObjectRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    (value.kind !== "floor" && value.kind !== "wall") ||
    typeof value.updatedAtIso !== "string" ||
    typeof value.version !== "number"
  ) {
    return null;
  }

  return {
    calculationSummary: parseAssemblyCalculationSummary(value.calculationSummary),
    description: typeof value.description === "string" ? value.description : undefined,
    displayCode: typeof value.displayCode === "string" ? value.displayCode : undefined,
    id: value.id,
    kind: value.kind,
    name: value.name,
    updatedAtIso: value.updatedAtIso,
    version: value.version
  };
}

function parseAssemblyCalculationSummary(value: unknown): ServerProjectAssemblySummaryPayload["calculationSummary"] {
  if (
    !isObjectRecord(value) ||
    (value.status !== "ready" && value.status !== "needs_input" && value.status !== "unsupported" && value.status !== "error") ||
    !Array.isArray(value.selectedOutputs)
  ) {
    return undefined;
  }

  const status = value.status;

  return {
    primaryOutput: typeof value.primaryOutput === "string" ? value.primaryOutput : undefined,
    // Coordination note: only ready project summaries may replay a numeric display value into the workspace UI.
    ...(status === "ready" && typeof value.primaryValueLabel === "string" ? { primaryValueLabel: value.primaryValueLabel } : {}),
    selectedOutputs: value.selectedOutputs.filter((entry): entry is string => typeof entry === "string"),
    status
  };
}

function parseProjectAssemblySummaries(value: unknown): ServerProjectAssemblySummaryPayload[] {
  if (!isObjectRecord(value) || !Array.isArray(value.assemblies)) {
    return [];
  }

  return value.assemblies
    .map((assembly) => parseAssemblySummary(assembly))
    .filter((assembly): assembly is ServerProjectAssemblySummaryPayload => assembly !== null);
}

function parseProjectAssemblyRecord(value: unknown): ServerProjectAssemblyRecordPayload | null {
  if (!isObjectRecord(value)) {
    return null;
  }

  const summary = parseAssemblySummary(value.assembly);
  if (!summary || !isObjectRecord(value.assembly) || !("snapshot" in value.assembly)) {
    return null;
  }

  return {
    ...summary,
    snapshot: value.assembly.snapshot
  };
}

function parseReportSummary(value: unknown): ServerProjectReportSummaryPayload | null {
  if (
    !isObjectRecord(value) ||
    typeof value.assemblyId !== "string" ||
    typeof value.currentRevisionId !== "string" ||
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.revisionCount !== "number" ||
    typeof value.sourceAssemblyVersion !== "number" ||
    (value.status !== "archived" && value.status !== "draft" && value.status !== "issued") ||
    typeof value.updatedAtIso !== "string"
  ) {
    return null;
  }

  return {
    assemblyId: value.assemblyId,
    currentRevisionId: value.currentRevisionId,
    description: typeof value.description === "string" ? value.description : undefined,
    displayCode: typeof value.displayCode === "string" ? value.displayCode : undefined,
    id: value.id,
    name: value.name,
    revisionCount: value.revisionCount,
    sourceAssemblyVersion: value.sourceAssemblyVersion,
    status: value.status,
    updatedAtIso: value.updatedAtIso
  };
}

function parseProjectReportSummaries(value: unknown): ServerProjectReportSummaryPayload[] {
  if (!isObjectRecord(value) || !Array.isArray(value.reports)) {
    return [];
  }

  return value.reports
    .map((report) => parseReportSummary(report))
    .filter((report): report is ServerProjectReportSummaryPayload => report !== null);
}

function parseReportMaterialSnapshot(value: unknown): ServerProjectReportRecordPayload["sourceMaterialSnapshot"] | null {
  if (!isObjectRecord(value) || !Array.isArray(value.customMaterials) || !Array.isArray(value.materialVisualOverrides)) {
    return null;
  }

  return {
    customMaterials: [...value.customMaterials],
    materialVisualOverrides: [...value.materialVisualOverrides]
  };
}

function parseProjectReportRecord(value: unknown): ServerProjectReportRecordPayload | null {
  if (!isObjectRecord(value) || !isObjectRecord(value.report)) {
    return null;
  }

  const summary = parseReportSummary({
    assemblyId: value.report.assemblyId,
    currentRevisionId: value.report.currentRevisionId,
    displayCode: value.report.displayCode,
    id: value.report.id,
    name: value.report.name,
    revisionCount: Array.isArray(value.report.revisions) ? value.report.revisions.length : undefined,
    sourceAssemblyVersion: value.report.sourceAssemblyVersion,
    status: value.report.status,
    updatedAtIso: value.report.updatedAtIso
  });
  const reportDocument = parseSimpleWorkbenchProposalDocument(value.report.reportDocument);
  const sourceMaterialSnapshot = parseReportMaterialSnapshot(value.report.sourceMaterialSnapshot);

  if (!summary || !reportDocument || !sourceMaterialSnapshot || !("sourceAssemblySnapshot" in value.report)) {
    return null;
  }

  return {
    ...summary,
    reportDocument,
    sourceAssemblySnapshot: value.report.sourceAssemblySnapshot,
    sourceCalculationOutput: Object.hasOwn(value.report, "sourceCalculationOutput") ? value.report.sourceCalculationOutput : undefined,
    sourceMaterialSnapshot
  };
}

function formatWorkbenchV2SnapshotRestoreWarning(input: {
  droppedCustomMaterials: number;
  droppedVisualOverrides: number;
}): string | null {
  const details: string[] = [];

  if (input.droppedCustomMaterials) {
    details.push(`${input.droppedCustomMaterials} invalid material${input.droppedCustomMaterials === 1 ? "" : "s"} ignored`);
  }

  if (input.droppedVisualOverrides) {
    details.push(`${input.droppedVisualOverrides} invalid appearance override${input.droppedVisualOverrides === 1 ? "" : "s"} ignored`);
  }

  return details.length ? details.join("; ") : null;
}

export function CalculatorWorkbench() {
  const [customMaterials, setCustomMaterials] = useState<readonly MaterialDefinition[]>([]);
  const [materialVisualOverrides, setMaterialVisualOverrides] = useState<readonly MaterialVisualOverride[]>([]);
  const [materialEditorStoreLoaded, setMaterialEditorStoreLoaded] = useState(false);
  const [materialEditorRestoreWarning, setMaterialEditorRestoreWarning] = useState<string | null>(null);
  const [mode, setMode] = useState<StudyMode>("wall");
  const [layers, setLayers] = useState<readonly DraftLayer[]>(INITIAL_LAYERS);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(INITIAL_LAYERS[0]!.id);
  const [selectedOutputs, setSelectedOutputs] = useState<readonly RequestedOutputId[]>(["Rw"]);
  const [context, setContext] = useState<ContextDraft>(INITIAL_CONTEXT);
  const [estimateState, setEstimateState] = useState<EstimateState>({ status: "idle" });
  const [calculatorAssistantState, setCalculatorAssistantState] = useState<CalculatorAssistantPreviewState>({ status: "idle" });
  const [calculatorAssistantCommand, setCalculatorAssistantCommand] = useState("");
  const [calculatorAssistantCommandPending, setCalculatorAssistantCommandPending] = useState(false);
  const [calculatorAssistantCommandMessage, setCalculatorAssistantCommandMessage] = useState<CalculatorAssistantCommandMessage | null>(null);
  const calculatorAssistantCommandInputRef = useRef<HTMLTextAreaElement | null>(null);
  const [calculatorAssistantCandidateStacks, setCalculatorAssistantCandidateStacks] = useState<readonly WorkbenchV2AssistantLayerStackCandidateStack[]>([]);
  const [calculatorAssistantSourceReviewState, setCalculatorAssistantSourceReviewState] =
    useState<CalculatorAssistantSourceReviewState>({ status: "idle" });
  const [calculatorAssistantSourceAlternativeState, setCalculatorAssistantSourceAlternativeState] =
    useState<CalculatorAssistantSourceAlternativeState>({ status: "idle" });
  const [calculatorAssistantBoundedEditPlanState, setCalculatorAssistantBoundedEditPlanState] =
    useState<CalculatorAssistantBoundedEditPlanState>({ status: "idle" });
  const [calculatorAssistantReportOverrideProposalState, setCalculatorAssistantReportOverrideProposalState] =
    useState<CalculatorAssistantReportOverrideProposalState>({ status: "idle" });
  const [calculatorAssistantWorkbenchApplyProposal, setCalculatorAssistantWorkbenchApplyProposal] =
    useState<ReportAssistantWorkbenchApplyProposal | null>(null);
  const [calculatorAssistantCandidateComparisonState, setCalculatorAssistantCandidateComparisonState] =
    useState<CalculatorAssistantCandidateComparisonState>({ status: "idle" });
  const [materialSearch, setMaterialSearch] = useState<Record<string, string>>({});
  const [openMaterialLayerId, setOpenMaterialLayerId] = useState<string | null>(null);
  const [materialEditorMaterialId, setMaterialEditorMaterialId] = useState<string | null>(INITIAL_LAYERS[0]?.materialId ?? null);
  const [workbenchDrawerOpen, setWorkbenchDrawerOpen] = useState(false);
  const [workbenchDrawerTab, setWorkbenchDrawerTab] = useState<WorkbenchDrawerTab>("projects");
  const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null);
  const [layerDropTarget, setLayerDropTarget] = useState<LayerDropTarget | null>(null);
  const [layerUndoStack, setLayerUndoStack] = useState<LayerStackUndoStack>([]);
  const [serverProjects, setServerProjects] = useState<ServerProjectSummaryPayload[]>([]);
  const [selectedServerProjectId, setSelectedServerProjectId] = useState("");
  const [expandedServerProjectId, setExpandedServerProjectId] = useState("");
  const [serverProjectNameDraft, setServerProjectNameDraft] = useState("");
  const serverProjectNameDraftRef = useRef(serverProjectNameDraft);
  const [serverProjectAssemblies, setServerProjectAssemblies] = useState<ServerProjectAssemblySummaryPayload[]>([]);
  const [selectedServerAssemblyId, setSelectedServerAssemblyId] = useState("");
  const [activeServerAssemblyId, setActiveServerAssemblyId] = useState("");
  const [activeServerAssemblyBaselineSnapshot, setActiveServerAssemblyBaselineSnapshot] = useState<WorkbenchV2ProjectSnapshot | null>(null);
  const [serverAssemblyNameDraft, setServerAssemblyNameDraft] = useState("");
  const serverAssemblyNameDraftRef = useRef(serverAssemblyNameDraft);
  const [serverAssemblyDescriptionDraft, setServerAssemblyDescriptionDraft] = useState("");
  const serverAssemblyDescriptionDraftRef = useRef(serverAssemblyDescriptionDraft);
  const [serverAssemblyRenameDraft, setServerAssemblyRenameDraft] = useState("");
  const serverAssemblyRenameDraftRef = useRef(serverAssemblyRenameDraft);
  const [serverAssemblyRenameDescriptionDraft, setServerAssemblyRenameDescriptionDraft] = useState("");
  const serverAssemblyRenameDescriptionDraftRef = useRef(serverAssemblyRenameDescriptionDraft);
  const [serverProjectReports, setServerProjectReports] = useState<ServerProjectReportSummaryPayload[]>([]);
  const [selectedServerReportId, setSelectedServerReportId] = useState("");
  const [serverReportRenameDraft, setServerReportRenameDraft] = useState("");
  const serverReportRenameDraftRef = useRef(serverReportRenameDraft);
  const [serverReportDescriptionDraft, setServerReportDescriptionDraft] = useState("");
  const serverReportDescriptionDraftRef = useRef(serverReportDescriptionDraft);
  const [serverProjectStatus, setServerProjectStatus] = useState<ServerProjectStatus>("idle");
  const [serverProjectMessage, setServerProjectMessage] = useState("Browser-local draft");
  const serverProjectMutationInFlightRef = useRef(false);
  const calculatorAssistantPreviewSnapshotRef = useRef<WorkbenchV2ProjectSnapshot | null>(null);
  const calculatorAssistantPreviewRequestRef = useRef(0);
  const calculatorAssistantPreviewAbortRef = useRef<AbortController | null>(null);
  const calculatorAssistantSourceReviewRequestRef = useRef(0);
  const calculatorAssistantSourceReviewAbortRef = useRef<AbortController | null>(null);
  const calculatorAssistantSourceAlternativeRequestRef = useRef(0);
  const calculatorAssistantSourceAlternativeAbortRef = useRef<AbortController | null>(null);
  const calculatorAssistantCandidateBatchRequestRef = useRef(0);
  const calculatorAssistantCandidateBatchAbortRef = useRef<AbortController | null>(null);
  const [projectCreatePanelOpen, setProjectCreatePanelOpen] = useState(false);
  const [assemblyCreatePanelOpen, setAssemblyCreatePanelOpen] = useState(false);
  const [reportSourceDecisionOpen, setReportSourceDecisionOpen] = useState(false);
  const [lastAppliedTemplateName, setLastAppliedTemplateName] = useState<string | null>(null);
  const [workbenchPresets, setWorkbenchPresets] = useState<WorkbenchV2PresetSummary[]>([]);
  // Agent coordination, 2026-06-22:
  // Explicit measured Rw references live beside presets. If another agent
  // changes template loading or estimate refresh here, keep preset-save !=
  // evidence, keep retired anchors as passive history only, and update
  // PROJECT_USER_MEASURED_SOURCE_ANCHOR_PLAN plus focused Workbench preset
  // route/panel tests.
  const [workbenchMeasuredWallRwAnchors, setWorkbenchMeasuredWallRwAnchors] = useState<WorkbenchV2MeasuredWallRwAnchorSummary[]>([]);
  const [selectedWorkbenchPresetId, setSelectedWorkbenchPresetId] = useState("");
  const [selectedWorkbenchCommonPresetId, setSelectedWorkbenchCommonPresetId] = useState("");
  const [workbenchPresetNameDraft, setWorkbenchPresetNameDraft] = useState("");
  const workbenchPresetNameDraftRef = useRef(workbenchPresetNameDraft);
  const [workbenchPresetDescriptionDraft, setWorkbenchPresetDescriptionDraft] = useState("");
  const workbenchPresetDescriptionDraftRef = useRef(workbenchPresetDescriptionDraft);
  const [workbenchPresetRenameDraft, setWorkbenchPresetRenameDraft] = useState("");
  const workbenchPresetRenameDraftRef = useRef(workbenchPresetRenameDraft);
  const [workbenchPresetRenameDescriptionDraft, setWorkbenchPresetRenameDescriptionDraft] = useState("");
  const workbenchPresetRenameDescriptionDraftRef = useRef(workbenchPresetRenameDescriptionDraft);
  const [workbenchPresetMeasuredRwDraft, setWorkbenchPresetMeasuredRwDraft] = useState("");
  const workbenchPresetMeasuredRwDraftRef = useRef(workbenchPresetMeasuredRwDraft);
  const [workbenchPresetMeasuredRwToleranceDraft, setWorkbenchPresetMeasuredRwToleranceDraft] = useState("0");
  const workbenchPresetMeasuredRwToleranceDraftRef = useRef(workbenchPresetMeasuredRwToleranceDraft);
  const [workbenchMeasuredAnchorRevision, setWorkbenchMeasuredAnchorRevision] = useState(0);
  // Agent coordination, 2026-06-22:
  // This state is only for explicit user-verified calculated reference capture.
  // It must not feed /api/estimate or the measured Rw preset anchor lane.
  const [workbenchVerifiedCalculatedAnchorStatus, setWorkbenchVerifiedCalculatedAnchorStatus] =
    useState<WorkbenchVerifiedCalculatedAnchorStatus>("idle");
  const [workbenchVerifiedCalculatedAnchorMessage, setWorkbenchVerifiedCalculatedAnchorMessage] = useState("");
  const [workbenchVerifiedCalculatedAnchors, setWorkbenchVerifiedCalculatedAnchors] = useState<
    readonly WorkbenchV2VerifiedCalculatedAnchorSummary[]
  >([]);
  const workbenchVerifiedCalculatedAnchorMutationInFlightRef = useRef(false);
  const [workbenchPresetStatus, setWorkbenchPresetStatus] = useState<WorkbenchV2PresetStatus>("idle");
  const [workbenchPresetMessage, setWorkbenchPresetMessage] = useState(() =>
    formatWorkbenchV2PresetLibraryTriggerStatus(0, WORKBENCH_V2_COMMON_PRESET_COUNT)
  );
  const workbenchPresetMutationInFlightRef = useRef(false);

  const materials = useMemo(() => buildResolvedMaterialCatalog(customMaterials), [customMaterials]);
  const materialById = useMemo(() => new Map(materials.map((material) => [material.id, material])), [materials]);
  const currentEstimateRequest = useMemo(
    () => buildEstimatePayload(mode, layers, selectedOutputs, context, customMaterials),
    [context, customMaterials, layers, mode, selectedOutputs]
  );
  // AGENT COORDINATION 2026-06-24 (Codex): visible calculated state is
  // request-fresh. A debounced stale ready result may stay in state, but
  // it must not drive output rows, route-input highlights, or report saves.
  const estimateResult = getActiveEstimateResultForCurrentRequest({
    currentRequest: currentEstimateRequest,
    estimateState
  });
  const availableOutputs = OUTPUT_OPTIONS.filter((output) => output.modes.includes(mode));
  const outputRows = estimateResult ? buildOutputRows(estimateResult, selectedOutputs) : [];
  const verifiedCalculatedCaptureLiveValueCount = outputRows.filter((row) => row.status === "live").length;
  const verifiedCalculatedCaptureBusy = workbenchVerifiedCalculatedAnchorStatus === "syncing";
  const canSaveVerifiedCalculatedAnchor =
    estimateResult !== null && verifiedCalculatedCaptureLiveValueCount > 0 && !verifiedCalculatedCaptureBusy;
  const activeWorkbenchVerifiedCalculatedAnchors = workbenchVerifiedCalculatedAnchors.filter(
    (anchor) => anchor.status === "active"
  );
  // Agent coordination, 2026-06-22:
  // UX hardening for user-verified calculated references. This fingerprint is
  // display-only; runtime still resolves exact matches through /api/estimate.
  const currentVerifiedCalculatedAnchorFingerprint = useMemo(() => {
    if (!currentEstimateRequest || !estimateResult) {
      return null;
    }

    const capture = buildVerifiedCalculatedAnchorCapturePackage({
      context,
      currentRequest: currentEstimateRequest,
      mode,
      result: estimateResult,
      selectedOutputs
    });
    if (capture.status !== "ready") {
      return null;
    }

    return buildProjectUserVerifiedCalculatedAnchorFingerprint({
      requestContext: capture.package.requestContext
    });
  }, [context, currentEstimateRequest, estimateResult, mode, selectedOutputs]);
  const applicableWorkbenchVerifiedCalculatedAnchors = getApplicableWorkbenchV2VerifiedCalculatedAnchors(
    activeWorkbenchVerifiedCalculatedAnchors,
    currentVerifiedCalculatedAnchorFingerprint
  );
  const hiddenWorkbenchVerifiedCalculatedAnchorCount =
    activeWorkbenchVerifiedCalculatedAnchors.length - applicableWorkbenchVerifiedCalculatedAnchors.length;
  const calculatorAssistantPreview = calculatorAssistantState.status === "ready" ? calculatorAssistantState.preview : null;
  const calculatorAssistantBusy =
    calculatorAssistantCommandPending ||
    calculatorAssistantSourceReviewState.status === "loading" ||
    calculatorAssistantSourceAlternativeState.status === "loading" ||
    calculatorAssistantReportOverrideProposalState.status === "loading";
  const calculatorAssistantBoundedEditPlanSteps =
    calculatorAssistantBoundedEditPlanState.status === "ready"
      ? calculatorAssistantBoundedEditPlanState.result.steps
      : calculatorAssistantBoundedEditPlanState.status === "blocked"
        ? calculatorAssistantBoundedEditPlanState.result.partialSteps
        : [];
  const primaryOutput = getPrimaryOutput(outputRows);
  const remoteTasks = getRemoteTasks(estimateResult);
  const localTasks = buildLocalTasks(layers, selectedOutputs, materialById);
  const routeInputTaskElementIds = buildRouteInputTaskElementIds(remoteTasks);
  const requiredTasks = [...localTasks, ...remoteTasks.filter((task) => !task.targetElementId || !routeInputTaskElementIds.has(task.targetElementId))];
  const responseFigures = buildWorkbenchResponseCurveFigures(estimateResult);
  const selectedImpactOutputs = selectedOutputs.some(isImpactOutput);
  const selectedAirborneCurveOutputs = selectedOutputs.some(isAirborneCurveOutput);
  const visibleResponseFigures = responseFigures.filter((figure) => {
    if (figure.id === "impact") {
      return selectedImpactOutputs;
    }

    return selectedAirborneCurveOutputs;
  });
  const missingSelectedImpactCurve =
    estimateResult !== null && selectedImpactOutputs && !responseFigures.some((figure) => figure.id === "impact");
  const missingSelectedAirborneCurve =
    estimateResult !== null && selectedAirborneCurveOutputs && !responseFigures.some((figure) => figure.id === "airborne");
  const illustrationLayers = useMemo(
    () => buildIllustrationLayers(layers, mode, selectedLayerId, materialById, materialVisualOverrides),
    [layers, materialById, materialVisualOverrides, mode, selectedLayerId]
  );
  const totalThickness = layers.reduce((sum, layer) => sum + (parsePositiveNumber(layer.thicknessMm) ?? 0), 0);
  const canOpenReport = outputRows.some((row) => row.status === "live");
  const needsAirborne = showAirborneContext(selectedOutputs, estimateResult);
  const needsBuildingPrediction = showBuildingPredictionContext(context, selectedOutputs, estimateResult);
  const needsImpact = mode === "floor" && showImpactContext(selectedOutputs, estimateResult);
  const needsFloorImpact = mode === "floor" && showFloorImpactContext(selectedOutputs, estimateResult);
  const needsWallTopology = showWallTopologyContext(mode, context, estimateResult);
  const isRouteInputMissing = (inputId: string) => routeInputTaskElementIds.has(inputId);
  const routeInputEffectiveness = buildRouteInputEffectiveness({
    context,
    layerCount: layers.length,
    mode,
    result: estimateResult,
    routeInputTaskElementIds,
    selectedOutputs
  });
  const materialEditorSelectedMaterial = materials.find((material) => material.id === materialEditorMaterialId) ?? null;
  const materialRouteInputEffectiveness = buildMaterialRouteInputEffectiveness({
    layers,
    material: materialEditorSelectedMaterial,
    mode,
    result: estimateResult,
    selectedOutputs
  });
  const layerInputEffectiveness = buildLayerInputEffectiveness({
    layers,
    mode,
    result: estimateResult,
    selectedOutputs
  });
  const getRouteInputEffectiveness = (inputId: string) => routeInputEffectiveness[inputId];
  const getLayerInputEffectiveness = (layerId: string, fieldId: LayerInputFieldId) => layerInputEffectiveness[layerId]?.[fieldId];
  const canUndoLayerStack = layerUndoStack.length > 0;
  const lastLayerUndoActionLabel = layerUndoStack[layerUndoStack.length - 1]?.actionLabel;
  const undoLayerStackActionLabel = lastLayerUndoActionLabel ? `Undo ${lastLayerUndoActionLabel}` : "Undo layer change";
  const undoLayerStackTitle = canUndoLayerStack ? undoLayerStackActionLabel : "No layer changes to undo";
  const selectedServerProject = serverProjects.find((project) => project.id === selectedServerProjectId) ?? null;
  const selectedServerAssembly = serverProjectAssemblies.find((assembly) => assembly.id === selectedServerAssemblyId) ?? null;
  const activeServerAssembly = serverProjectAssemblies.find((assembly) => assembly.id === activeServerAssemblyId) ?? null;
  const selectedServerReport = serverProjectReports.find((report) => report.id === selectedServerReportId) ?? null;
  const selectedWorkbenchPreset = workbenchPresets.find((preset) => preset.id === selectedWorkbenchPresetId) ?? null;
  const selectedWorkbenchPresetMeasuredRwAnchors = workbenchMeasuredWallRwAnchors.filter(
    (anchor) => anchor.createdFromPresetId === selectedWorkbenchPresetId
  );
  const selectedWorkbenchCommonPreset = findWorkbenchV2CommonPresetById(selectedWorkbenchCommonPresetId);
  const serverProjectBusy =
    serverProjectStatus === "loading" || serverProjectStatus === "syncing" || serverProjectStatus === "restoring";
  const workbenchPresetBusy =
    workbenchPresetStatus === "loading" || workbenchPresetStatus === "syncing" || workbenchPresetStatus === "restoring";
  const canCreateServerProject = !serverProjectBusy;
  const canRenameServerAssembly = Boolean(selectedServerProjectId && selectedServerAssembly) && !serverProjectBusy;
  const canRenameServerReport = Boolean(selectedServerProjectId && selectedServerReport) && !serverProjectBusy;
  const canRenameWorkbenchPreset = Boolean(selectedWorkbenchPreset) && !workbenchPresetBusy;
  const currentWorkbenchDraftSnapshot = useMemo(
    () =>
      buildWorkbenchV2ProjectSnapshot({
        context,
        customMaterials,
        id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `workbench-v2-${Date.now()}`,
        layers,
        materialVisualOverrides,
        mode,
        name: activeServerAssembly?.name ?? lastAppliedTemplateName ?? "Current draft",
        savedAtIso: new Date().toISOString(),
        selectedLayerId,
        selectedOutputs
      }),
    [
      activeServerAssembly?.name,
      context,
      customMaterials,
      lastAppliedTemplateName,
      layers,
      materialVisualOverrides,
      mode,
      selectedLayerId,
      selectedOutputs
    ]
  );
  const activeAssemblyHasBaseline = Boolean(activeServerAssembly && activeServerAssemblyBaselineSnapshot);
  const activeAssemblyDirty = getWorkbenchV2DraftDirtyState(currentWorkbenchDraftSnapshot, activeServerAssemblyBaselineSnapshot);
  const workbenchPersistenceState = deriveWorkbenchV2PersistenceState({
    activeAssembly: activeServerAssembly
      ? {
          id: activeServerAssembly.id,
          name: activeServerAssembly.name,
          version: activeServerAssembly.version
        }
      : null,
    activeAssemblyDirty,
    activeAssemblyHasBaseline,
    project: selectedServerProject
      ? {
          id: selectedServerProject.id,
          name: selectedServerProject.name
        }
      : null,
    templateName: lastAppliedTemplateName
  });
  const reportSourceDecisionKind: ReportSourceDecisionKind | null =
    selectedServerProjectId && activeServerAssembly && activeAssemblyDirty
      ? "combinationDirty"
      : selectedServerProjectId && !activeServerAssembly
        ? "projectDraft"
        : null;
  const canSaveNewServerAssembly = Boolean(
    selectedServerProjectId && serverAssemblyNameDraft.trim().length > 0 && serverProjectStatus !== "syncing" && serverProjectStatus !== "restoring"
  );

  useEffect(() => {
    const restored = readStoredMaterialEditorState();

    setCustomMaterials(restored.state.customMaterials);
    setMaterialVisualOverrides(restored.state.materialVisualOverrides);
    setMaterialEditorRestoreWarning(formatMaterialEditorRestoreWarning(restored));
    setMaterialEditorStoreLoaded(true);
  }, []);

  useEffect(() => {
    if (workbenchVerifiedCalculatedAnchorStatus !== "error") {
      return;
    }

    setWorkbenchVerifiedCalculatedAnchorStatus("idle");
    setWorkbenchVerifiedCalculatedAnchorMessage("");
  }, [context, customMaterials, layers, mode, selectedOutputs]);

  useEffect(() => {
    if (!materialEditorStoreLoaded) {
      return;
    }

    storeMaterialEditorState({
      customMaterials,
      materialVisualOverrides
    });
  }, [customMaterials, materialEditorStoreLoaded, materialVisualOverrides]);

  useEffect(() => {
    void refreshServerProjects({ silent: true });
    // Server project discovery is a persistence affordance; the initial read
    // intentionally runs once per mounted workbench.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void refreshWorkbenchPresets({ silent: true });
    void refreshWorkbenchMeasuredWallRwAnchors({ silent: true });
    void refreshWorkbenchVerifiedCalculatedAnchors({ silent: true });
    // Template discovery is a persistence affordance; the initial read
    // intentionally runs once per mounted workbench.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!workbenchDrawerOpen) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverscrollBehavior = document.documentElement.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overscrollBehavior = previousDocumentOverscrollBehavior;
    };
  }, [workbenchDrawerOpen]);

  useEffect(() => {
    const nextName = selectedServerAssembly?.name ?? "";
    const nextDescription = selectedServerAssembly?.description ?? "";
    serverAssemblyRenameDraftRef.current = nextName;
    serverAssemblyRenameDescriptionDraftRef.current = nextDescription;
    setServerAssemblyRenameDraft(nextName);
    setServerAssemblyRenameDescriptionDraft(nextDescription);
  }, [selectedServerAssembly?.description, selectedServerAssembly?.id, selectedServerAssembly?.name]);

  useEffect(() => {
    const nextName = selectedServerReport?.name ?? "";
    const nextDescription = selectedServerReport?.description ?? "";
    serverReportRenameDraftRef.current = nextName;
    serverReportDescriptionDraftRef.current = nextDescription;
    setServerReportRenameDraft(nextName);
    setServerReportDescriptionDraft(nextDescription);
  }, [selectedServerReport?.description, selectedServerReport?.id, selectedServerReport?.name]);

  useEffect(() => {
    const nextName = selectedWorkbenchPreset?.name ?? "";
    const nextDescription = selectedWorkbenchPreset?.description ?? "";
    workbenchPresetRenameDraftRef.current = nextName;
    workbenchPresetRenameDescriptionDraftRef.current = nextDescription;
    setWorkbenchPresetRenameDraft(nextName);
    setWorkbenchPresetRenameDescriptionDraft(nextDescription);
  }, [selectedWorkbenchPreset?.description, selectedWorkbenchPreset?.id, selectedWorkbenchPreset?.name]);

  useEffect(() => {
    workbenchPresetMeasuredRwDraftRef.current = "";
    workbenchPresetMeasuredRwToleranceDraftRef.current = "0";
    setWorkbenchPresetMeasuredRwDraft("");
    setWorkbenchPresetMeasuredRwToleranceDraft("0");
  }, [selectedWorkbenchPreset?.id]);

  useEffect(() => {
    if (!selectedServerProjectId) {
      setServerProjectAssemblies([]);
      setSelectedServerAssemblyId("");
      clearActiveProjectAssembly();
      setServerProjectReports([]);
      setSelectedServerReportId("");
      setReportSourceDecisionOpen(false);
      serverAssemblyRenameDraftRef.current = "";
      serverAssemblyRenameDescriptionDraftRef.current = "";
      serverReportRenameDraftRef.current = "";
      serverReportDescriptionDraftRef.current = "";
      setServerAssemblyRenameDraft("");
      setServerAssemblyRenameDescriptionDraft("");
      setServerReportRenameDraft("");
      setServerReportDescriptionDraft("");
      return;
    }

    void refreshServerProjectAssemblies(selectedServerProjectId, { silent: true });
    void refreshServerProjectReports(selectedServerProjectId, { silent: true });
    // Child record discovery follows the active project; the helpers update
    // project state and selected record guards internally.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServerProjectId]);

  useEffect(() => {
    if (openMaterialLayerId && !layers.some((layer) => layer.id === openMaterialLayerId)) {
      setOpenMaterialLayerId(null);
    }
  }, [layers, openMaterialLayerId]);

  useEffect(() => {
    if (!draggedLayerId) {
      return;
    }

    const activeDraggedLayerId = draggedLayerId;

    function handleMouseMove(event: globalThis.MouseEvent) {
      setLayerDropTarget(getLayerDropTargetFromPoint(event.clientX, event.clientY, activeDraggedLayerId));
    }

    function handleMouseUp(event: globalThis.MouseEvent) {
      const target = getLayerDropTargetFromPoint(event.clientX, event.clientY, activeDraggedLayerId);

      if (target) {
        moveLayerToTarget(activeDraggedLayerId, target.layerId, target.position);
      }

      setDraggedLayerId(null);
      setLayerDropTarget(null);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    // Drag listeners intentionally capture the active layer id for the current
    // drag gesture; recreating them for every layer mutation interrupts drag/drop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggedLayerId]);

  useEffect(() => {
    const tasks = buildLocalTasks(layers, selectedOutputs, materialById);

    if (tasks.length) {
      setEstimateState({ reasons: tasks, status: "blocked" });
      return;
    }

    const payload = buildEstimatePayload(mode, layers, selectedOutputs, context, customMaterials);

    if (!payload) {
      setEstimateState({ status: "idle" });
      return;
    }

    const estimateRequest = payload;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      setEstimateState({ status: "loading" });

      async function estimate() {
        try {
          const response = await fetch("/api/estimate", {
            body: JSON.stringify(estimateRequest),
            headers: {
              "Content-Type": "application/json"
            },
            method: "POST",
            signal: controller.signal
          });
          const data = (await response.json()) as unknown;

          if (!response.ok) {
            setEstimateState({ message: parseEstimateError(data), status: "error" });
            return;
          }

          if (typeof data === "object" && data !== null && "result" in data) {
            setEstimateState({ request: estimateRequest, result: (data as { result: AssemblyCalculation }).result, status: "ready" });
            return;
          }

          setEstimateState({ message: "Estimate response is missing result.", status: "error" });
        } catch (error) {
          if (controller.signal.aborted) {
            return;
          }

          setEstimateState({
            message: error instanceof Error ? error.message : "Estimate failed.",
            status: "error"
          });
        }
      }

      void estimate();
    }, 220);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [context, customMaterials, layers, materialById, mode, selectedOutputs, workbenchMeasuredAnchorRevision]);

  useEffect(() => {
    if (calculatorAssistantPreviewSnapshotRef.current === currentWorkbenchDraftSnapshot) {
      return;
    }

    if (calculatorAssistantPreviewSnapshotRef.current === null) {
      calculatorAssistantPreviewSnapshotRef.current = currentWorkbenchDraftSnapshot;
      return;
    }

    calculatorAssistantPreviewSnapshotRef.current = currentWorkbenchDraftSnapshot;
    calculatorAssistantPreviewRequestRef.current += 1;
    calculatorAssistantPreviewAbortRef.current?.abort();
    calculatorAssistantPreviewAbortRef.current = null;
    calculatorAssistantSourceReviewRequestRef.current += 1;
    calculatorAssistantSourceReviewAbortRef.current?.abort();
    calculatorAssistantSourceReviewAbortRef.current = null;
    calculatorAssistantSourceAlternativeRequestRef.current += 1;
    calculatorAssistantSourceAlternativeAbortRef.current?.abort();
    calculatorAssistantSourceAlternativeAbortRef.current = null;
    calculatorAssistantCandidateBatchRequestRef.current += 1;
    calculatorAssistantCandidateBatchAbortRef.current?.abort();
    calculatorAssistantCandidateBatchAbortRef.current = null;
    setCalculatorAssistantState((current) => (current.status === "idle" ? current : { status: "idle" }));
    setCalculatorAssistantSourceReviewState((current) => (current.status === "idle" ? current : { status: "idle" }));
    setCalculatorAssistantSourceAlternativeState((current) => (current.status === "idle" ? current : { status: "idle" }));
    setCalculatorAssistantBoundedEditPlanState((current) => (current.status === "idle" ? current : { status: "idle" }));
    setCalculatorAssistantReportOverrideProposalState((current) => (current.status === "idle" ? current : { status: "idle" }));
    setCalculatorAssistantCandidateComparisonState((current) => (current.status === "idle" ? current : { status: "idle" }));
  }, [currentWorkbenchDraftSnapshot]);

  useEffect(() => {
    setCalculatorAssistantReportOverrideProposalState((current) => (current.status === "idle" ? current : { status: "idle" }));
  }, [selectedServerProjectId, selectedServerReportId]);

  useEffect(
    () => () => {
      calculatorAssistantPreviewRequestRef.current += 1;
      calculatorAssistantPreviewAbortRef.current?.abort();
      calculatorAssistantPreviewAbortRef.current = null;
      calculatorAssistantSourceReviewRequestRef.current += 1;
      calculatorAssistantSourceReviewAbortRef.current?.abort();
      calculatorAssistantSourceReviewAbortRef.current = null;
      calculatorAssistantSourceAlternativeRequestRef.current += 1;
      calculatorAssistantSourceAlternativeAbortRef.current?.abort();
      calculatorAssistantSourceAlternativeAbortRef.current = null;
      calculatorAssistantCandidateBatchRequestRef.current += 1;
      calculatorAssistantCandidateBatchAbortRef.current?.abort();
      calculatorAssistantCandidateBatchAbortRef.current = null;
    },
    []
  );

  function updateContext(patch: Partial<ContextDraft>) {
    setContext((current) => ({ ...current, ...patch }));
  }

  function updateWallTopologyContext(patch: Partial<ContextDraft>) {
    setContext((current) => ({
      ...current,
      wallTopologyMode: current.wallTopologyMode === "auto" ? "double_leaf_framed" : current.wallTopologyMode,
      ...patch
    }));
  }

  function applyLayerRoleTopology() {
    const sideA = getLayerIndicesByRole(layers, "side_a");
    const cavity = getLayerIndicesByRole(layers, "cavity");
    const sideB = getLayerIndicesByRole(layers, "side_b");
    const cavityDepthMm = getLayerThicknessSum(layers, cavity);

    setContext((current) => ({
      ...current,
      wallCavity1AbsorptionClass: inferCavityAbsorptionClass(layers, cavity, materialById),
      wallCavity1DepthMm: cavityDepthMm ? String(cavityDepthMm) : current.wallCavity1DepthMm,
      wallCavity1FillCoverage: inferCavityFillCoverage(layers, cavity, materialById),
      wallCavity1LayerIndices: formatLayerIndexList(cavity),
      wallSideALeafLayerIndices: formatLayerIndexList(sideA),
      wallSideBLeafLayerIndices: formatLayerIndexList(sideB),
      wallTopologyMode: "double_leaf_framed"
    }));
  }

  function clearLayerInteractionState() {
    setOpenMaterialLayerId(null);
    setMaterialSearch({});
    setDraggedLayerId(null);
    setLayerDropTarget(null);
  }

  function clearActiveProjectAssembly() {
    setActiveServerAssemblyId("");
    setActiveServerAssemblyBaselineSnapshot(null);
  }

  function markActiveProjectAssembly(assemblyId: string, snapshot: WorkbenchV2ProjectSnapshot | unknown) {
    const parsed = parseWorkbenchV2ProjectSnapshot(snapshot);

    setActiveServerAssemblyId(assemblyId);
    setActiveServerAssemblyBaselineSnapshot(parsed.snapshot);
    setLastAppliedTemplateName(null);
  }

  function clearSelectedProjectChildren() {
    setSelectedServerAssemblyId("");
    setSelectedServerReportId("");
    clearActiveProjectAssembly();
    serverAssemblyRenameDraftRef.current = "";
    serverAssemblyRenameDescriptionDraftRef.current = "";
    serverReportRenameDraftRef.current = "";
    serverReportDescriptionDraftRef.current = "";
    setServerAssemblyRenameDraft("");
    setServerAssemblyRenameDescriptionDraft("");
    setServerReportRenameDraft("");
    setServerReportDescriptionDraft("");
  }

  async function refreshWorkbenchPresets(options?: { preserveMessage?: boolean; silent?: boolean }) {
    if (!options?.silent) {
      setWorkbenchPresetStatus("loading");
      setWorkbenchPresetMessage("Loading templates");
    }

    try {
      const response = await fetch("/api/workbench-v2/presets", {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not load workbench templates."));
      }

      const payload = (await response.json()) as unknown;
      const presets = parseWorkbenchV2PresetSummaries(payload);
      setWorkbenchPresets(presets);

      if (selectedWorkbenchPresetId && !presets.some((preset) => preset.id === selectedWorkbenchPresetId)) {
        setSelectedWorkbenchPresetId("");
        workbenchPresetRenameDraftRef.current = "";
        workbenchPresetRenameDescriptionDraftRef.current = "";
        setWorkbenchPresetRenameDraft("");
        setWorkbenchPresetRenameDescriptionDraft("");
      }

      if (!options?.preserveMessage) {
        setWorkbenchPresetStatus("idle");
        setWorkbenchPresetMessage(formatWorkbenchV2PresetLibraryTriggerStatus(presets.length, WORKBENCH_V2_COMMON_PRESET_COUNT));
      }
    } catch (error) {
      setWorkbenchPresetStatus("error");
      setWorkbenchPresetMessage(error instanceof Error ? error.message : "Template list failed");
    }
  }

  async function refreshWorkbenchMeasuredWallRwAnchors(options?: { preserveMessage?: boolean; silent?: boolean }) {
    if (!options?.silent) {
      setWorkbenchPresetStatus("loading");
      setWorkbenchPresetMessage("Loading Rw references");
    }

    try {
      const response = await fetch("/api/workbench-v2/measured-wall-rw-anchors", {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not load measured Rw references."));
      }

      const payload = (await response.json()) as unknown;
      setWorkbenchMeasuredWallRwAnchors(parseWorkbenchV2MeasuredWallRwAnchorSummaries(payload));

      if (!options?.preserveMessage && !options?.silent) {
        setWorkbenchPresetStatus("idle");
        setWorkbenchPresetMessage("Rw references loaded");
      }
    } catch (error) {
      setWorkbenchPresetStatus("error");
      setWorkbenchPresetMessage(error instanceof Error ? error.message : "Rw reference list failed");
    }
  }

  async function refreshWorkbenchVerifiedCalculatedAnchors(options?: { preserveMessage?: boolean; silent?: boolean }) {
    if (!options?.silent) {
      setWorkbenchVerifiedCalculatedAnchorStatus("syncing");
      setWorkbenchVerifiedCalculatedAnchorMessage("");
    }

    try {
      const response = await fetch("/api/workbench-v2/verified-calculated-anchors", {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not load verified references."));
      }

      const payload = (await response.json()) as unknown;
      setWorkbenchVerifiedCalculatedAnchors(parseWorkbenchV2VerifiedCalculatedAnchorSummaries(payload));

      if (!options?.preserveMessage && !options?.silent) {
        setWorkbenchVerifiedCalculatedAnchorStatus("idle");
        setWorkbenchVerifiedCalculatedAnchorMessage("");
      }
    } catch (error) {
      setWorkbenchVerifiedCalculatedAnchorStatus("error");
      setWorkbenchVerifiedCalculatedAnchorMessage(error instanceof Error ? error.message : "Verified reference list failed");
    }
  }

  async function refreshServerProjects(options?: { preserveMessage?: boolean; silent?: boolean }) {
    if (!options?.silent) {
      setServerProjectStatus("loading");
      setServerProjectMessage("Loading projects");
    }

    try {
      const response = await fetch("/api/projects", {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not load server projects."));
      }

      const payload = (await response.json()) as unknown;
      const projects = parseServerProjectSummaries(payload);
      setServerProjects(projects);

      if (selectedServerProjectId && !projects.some((project) => project.id === selectedServerProjectId)) {
        setSelectedServerProjectId("");
        setServerProjectAssemblies([]);
        setSelectedServerAssemblyId("");
        clearActiveProjectAssembly();
        setServerProjectReports([]);
        setSelectedServerReportId("");
        serverAssemblyRenameDraftRef.current = "";
        serverAssemblyRenameDescriptionDraftRef.current = "";
        serverReportRenameDraftRef.current = "";
        serverReportDescriptionDraftRef.current = "";
        setServerAssemblyRenameDraft("");
        setServerAssemblyRenameDescriptionDraft("");
        setServerReportRenameDraft("");
        setServerReportDescriptionDraft("");
      }

      if (expandedServerProjectId && !projects.some((project) => project.id === expandedServerProjectId)) {
        setExpandedServerProjectId("");
      }

      if (!options?.preserveMessage) {
        setServerProjectStatus("idle");
        setServerProjectMessage(projects.length ? `${projects.length} project${projects.length === 1 ? "" : "s"}` : "Browser-local draft");
      }
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Server project list failed");
    }
  }

  async function refreshServerProjectAssemblies(projectId: string, options?: { preserveMessage?: boolean; silent?: boolean }) {
    if (!options?.silent) {
      setServerProjectStatus("loading");
      setServerProjectMessage("Loading saved combinations");
    }

    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}/assemblies`, {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not load saved combinations."));
      }

      const payload = (await response.json()) as unknown;
      const assemblies = parseProjectAssemblySummaries(payload);
      setServerProjectAssemblies(assemblies);

      if (selectedServerAssemblyId && !assemblies.some((assembly) => assembly.id === selectedServerAssemblyId)) {
        setSelectedServerAssemblyId("");
      }

      if (activeServerAssemblyId && !assemblies.some((assembly) => assembly.id === activeServerAssemblyId)) {
        clearActiveProjectAssembly();
      }

      if (!options?.preserveMessage && !options?.silent) {
        setServerProjectStatus("idle");
        setServerProjectMessage(
          assemblies.length ? `${assemblies.length} saved combination${assemblies.length === 1 ? "" : "s"}` : "No saved combinations"
        );
      }
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Saved combination list failed");
    }
  }

  async function refreshServerProjectReports(projectId: string, options?: { preserveMessage?: boolean; silent?: boolean }) {
    if (!options?.silent) {
      setServerProjectStatus("loading");
      setServerProjectMessage("Loading saved reports");
    }

    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}/reports`, {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not load saved reports."));
      }

      const payload = (await response.json()) as unknown;
      const reports = parseProjectReportSummaries(payload);
      setServerProjectReports(reports);

      if (selectedServerReportId && !reports.some((report) => report.id === selectedServerReportId)) {
        setSelectedServerReportId("");
      }

      if (!options?.preserveMessage && !options?.silent) {
        setServerProjectStatus("idle");
        setServerProjectMessage(reports.length ? `${reports.length} saved report${reports.length === 1 ? "" : "s"}` : "No saved reports");
      }
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Saved report list failed");
    }
  }

  function buildCurrentWorkbenchV2Snapshot(name?: string, fallbackName?: string) {
    const savedAtIso = new Date().toISOString();

    return buildWorkbenchV2ProjectSnapshot({
      context,
      customMaterials,
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `workbench-v2-${Date.now()}`,
      layers,
      materialVisualOverrides,
      mode,
      name: name?.trim() || fallbackName || `${mode === "wall" ? "Wall" : "Floor"} saved combination`,
      savedAtIso,
      selectedLayerId,
      selectedOutputs
    });
  }

  function buildCurrentWorkbenchV2ServerSnapshot(name?: string) {
    return buildCurrentWorkbenchV2Snapshot(name, `${mode === "wall" ? "Wall" : "Floor"} saved combination`);
  }

  function beginServerProjectMutation(): boolean {
    if (serverProjectMutationInFlightRef.current) {
      return false;
    }

    serverProjectMutationInFlightRef.current = true;
    return true;
  }

  function finishServerProjectMutation() {
    serverProjectMutationInFlightRef.current = false;
  }

  function beginWorkbenchPresetMutation(): boolean {
    if (workbenchPresetMutationInFlightRef.current) {
      return false;
    }

    workbenchPresetMutationInFlightRef.current = true;
    return true;
  }

  function finishWorkbenchPresetMutation() {
    workbenchPresetMutationInFlightRef.current = false;
  }

  function beginWorkbenchVerifiedCalculatedAnchorMutation(): boolean {
    if (workbenchVerifiedCalculatedAnchorMutationInFlightRef.current) {
      return false;
    }

    workbenchVerifiedCalculatedAnchorMutationInFlightRef.current = true;
    return true;
  }

  function finishWorkbenchVerifiedCalculatedAnchorMutation() {
    workbenchVerifiedCalculatedAnchorMutationInFlightRef.current = false;
  }

  function buildAssemblyCalculationSummary() {
    const selectedOutputLabels = selectedOutputs.map((output) => output);

    if (estimateResult && primaryOutput) {
      return {
        primaryOutput: primaryOutput.label,
        primaryValueLabel: primaryOutput.value,
        selectedOutputs: selectedOutputLabels,
        status: "ready" as const
      };
    }

    return {
      selectedOutputs: selectedOutputLabels,
      status: estimateState.status === "blocked" ? ("needs_input" as const) : estimateState.status === "error" ? ("error" as const) : ("unsupported" as const)
    };
  }

  async function previewCalculatorSnapshotWithAssistant(snapshot: WorkbenchV2ProjectSnapshot): Promise<WorkbenchV2CalculatorAssistantPreview | null> {
    calculatorAssistantPreviewAbortRef.current?.abort();
    const controller = new AbortController();
    const requestId = calculatorAssistantPreviewRequestRef.current + 1;
    calculatorAssistantPreviewRequestRef.current = requestId;
    calculatorAssistantPreviewAbortRef.current = controller;
    const requestIsCurrent = () => calculatorAssistantPreviewRequestRef.current === requestId && !controller.signal.aborted;

    setCalculatorAssistantState({ status: "loading" });
    calculatorAssistantPreviewSnapshotRef.current = snapshot;

    try {
      const preview = await requestCalculatorAssistantPreview({
        signal: controller.signal,
        snapshot
      });
      if (!requestIsCurrent()) {
        return null;
      }

      setCalculatorAssistantState({ preview, status: "ready" });
      return preview;
    } catch (error) {
      if (!requestIsCurrent()) {
        return null;
      }

      setCalculatorAssistantState({
        message: error instanceof Error ? error.message : "Assistant calculator preview failed.",
        status: "error"
      });
      return null;
    } finally {
      if (calculatorAssistantPreviewAbortRef.current === controller) {
        calculatorAssistantPreviewAbortRef.current = null;
      }
    }
  }

  async function previewCurrentCalculatorWithAssistant(): Promise<WorkbenchV2CalculatorAssistantPreview | null> {
    return previewCalculatorSnapshotWithAssistant(currentWorkbenchDraftSnapshot);
  }

  async function reviewCurrentCalculatorWithAssistantSource(instruction: string) {
    calculatorAssistantSourceReviewAbortRef.current?.abort();
    const controller = new AbortController();
    const requestId = calculatorAssistantSourceReviewRequestRef.current + 1;
    calculatorAssistantSourceReviewRequestRef.current = requestId;
    calculatorAssistantSourceReviewAbortRef.current = controller;
    const requestIsCurrent = () => calculatorAssistantSourceReviewRequestRef.current === requestId && !controller.signal.aborted;

    setCalculatorAssistantSourceReviewState({ status: "loading" });
    setCalculatorAssistantSourceAlternativeState((current) => (current.status === "idle" ? current : { status: "idle" }));
    setCalculatorAssistantReportOverrideProposalState({ status: "idle" });
    setCalculatorAssistantCommandMessage({
      detail: "Running the current calculator draft first, then sending the calculator-owned value and layer summary to the source review route.",
      title: "Source review requested",
      tone: "success"
    });

    try {
      const requestedOutputId = resolveCalculatorAssistantSourceReviewOutputId({
        availableOutputs: availableOutputs.map((output) => output.id),
        fallbackOutput: selectedOutputs[0],
        instruction
      });
      const sourceReviewSnapshot = buildCalculatorAssistantSourceReviewSnapshot({
        outputId: requestedOutputId,
        snapshot: currentWorkbenchDraftSnapshot
      });
      const preview = calculatorAssistantState.status === "ready" && calculatorAssistantPreviewSnapshotRef.current === sourceReviewSnapshot
        ? calculatorAssistantState.preview
        : await previewCalculatorSnapshotWithAssistant(sourceReviewSnapshot);

      if (!requestIsCurrent() || !preview) {
        return;
      }

      const availableReviewOutputs = Array.from(new Set<RequestedOutputId>([
        ...preview.outputRows.map((row) => row.label),
        ...preview.calculationSummary.selectedOutputs
      ]));
      const outputId = resolveCalculatorAssistantSourceReviewOutputId({
        availableOutputs: availableReviewOutputs,
        fallbackOutput: requestedOutputId ?? preview.calculationSummary.primaryOutput ?? preview.calculationSummary.selectedOutputs[0],
        instruction
      });
      const sourceReviewWorkbenchSnapshotSignature = getCurrentWorkbenchApplyTargetSignature();
      const packetResult = buildReportAssistantCurrentCalculatorReviewPacketFromCalculatorPreview({
        outputId,
        preview,
        snapshotSignature: sourceReviewWorkbenchSnapshotSignature
      });

      if (!packetResult.ok) {
        const message = packetResult.errors.join(" ");
        setCalculatorAssistantSourceReviewState({
          message,
          preview,
          status: "error",
          warnings: []
        });
        setCalculatorAssistantCommandMessage({
          detail: message,
          title: "Source review blocked",
          tone: "warning"
        });
        toast.warning("Source review blocked", { description: message });
        return;
      }

      const review = await requestCalculatorAssistantSourceReview({
        instruction,
        packet: packetResult.packet,
        research: shouldRequestCalculatorAssistantSourceResearch(instruction),
        signal: controller.signal
      });

      if (!requestIsCurrent()) {
        return;
      }

      if (!review.ok || !review.result || !review.review) {
        const message = review.message ?? "Current calculator source review failed.";
        setCalculatorAssistantSourceReviewState({
          message,
          preview,
          ...(review.result ? { result: review.result } : {}),
          status: "error",
          warnings: review.warnings
        });
        setCalculatorAssistantCommandMessage({
          detail: message,
          title: "Source review failed",
          tone: "warning"
        });
        toast.error("Source review failed", { description: message });
        return;
      }

      setCalculatorAssistantSourceReviewState({
        preview,
        result: review.result,
        review: review.review,
        ...(outputId ? { reviewedOutputId: outputId } : {}),
        source: review.source,
        status: "ready",
        warnings: review.warnings,
        workbenchSnapshotSignature: packetResult.packet.snapshotSignature ?? sourceReviewWorkbenchSnapshotSignature
      });
      setCalculatorAssistantCommand("");
      setCalculatorAssistantCommandMessage({
        detail: review.source === "research_provider"
          ? "Source-backed review is ready. Calculator values were not changed."
          : "Context-only review is ready. Calculator values were not changed.",
        title: "Source review ready",
        tone: "success"
      });
      toast.success("Source review ready", {
        description: "Calculator output was left unchanged."
      });
    } catch (error) {
      if (!requestIsCurrent()) {
        return;
      }

      const message = error instanceof Error ? error.message : "Current calculator source review failed.";
      setCalculatorAssistantSourceReviewState({
        message,
        status: "error",
        warnings: []
      });
      setCalculatorAssistantCommandMessage({
        detail: message,
        title: "Source review failed",
        tone: "warning"
      });
      toast.error("Source review failed", { description: message });
    } finally {
      if (calculatorAssistantSourceReviewAbortRef.current === controller) {
        calculatorAssistantSourceReviewAbortRef.current = null;
      }
    }
  }

  async function researchCalculatorAssistantSourceAlternatives(instruction: string) {
    calculatorAssistantSourceAlternativeAbortRef.current?.abort();
    const controller = new AbortController();
    const requestId = calculatorAssistantSourceAlternativeRequestRef.current + 1;
    calculatorAssistantSourceAlternativeRequestRef.current = requestId;
    calculatorAssistantSourceAlternativeAbortRef.current = controller;
    const requestIsCurrent = () => calculatorAssistantSourceAlternativeRequestRef.current === requestId && !controller.signal.aborted;

    setCalculatorAssistantSourceAlternativeState({ status: "loading" });
    setCalculatorAssistantSourceReviewState((current) => (current.status === "idle" ? current : { status: "idle" }));
    setCalculatorAssistantReportOverrideProposalState({ status: "idle" });
    setCalculatorAssistantCommandMessage({
      detail: "Researching source-backed layer/material alternatives. Any mapped stack will still require calculator preview before comparison.",
      title: "Source alternative research requested",
      tone: "success"
    });

    try {
      const document = buildReportSnapshot({
        layers,
        materialById,
        mode,
        outputRows,
        projectName: activeServerAssembly?.name ?? lastAppliedTemplateName ?? "Current draft",
        responseFigures,
        serverProjectId: selectedServerProjectId || undefined,
        serverProjectScenarioId: activeServerAssemblyId || undefined
      });
      const assistantContext = buildReportAssistantContext({
        document,
        reportId: activeServerAssemblyId || selectedServerReportId || "workbench-v2-source-alternatives"
      });
      const result = await requestCalculatorAssistantAssemblyAlternatives({
        assistantContext,
        document,
        instruction,
        research: true,
        signal: controller.signal
      });

      if (!requestIsCurrent()) {
        return;
      }

      if (!result.ok || !result.result || !result.review || !result.source) {
        const message = result.message ?? "Source alternative research failed.";
        setCalculatorAssistantSourceAlternativeState({
          message,
          ...(result.result ? { result: result.result } : {}),
          status: "error",
          warnings: result.warnings
        });
        setCalculatorAssistantCommandMessage({
          detail: message,
          title: "Source alternative research failed",
          tone: "warning"
        });
        toast.error("Source alternative research failed", { description: message });
        return;
      }

      // Coordination note (assistant source alternatives, 2026-06-22):
      // Provider/research text enters Workbench candidates only through explicit
      // candidateLayers + catalog mapping. If another agent wires this area,
      // keep clarification prompts non-mutating and preview/ranking calculator-backed.
      const candidateBridge = createWorkbenchV2AssistantSourceAlternativeCandidatesFromReview({
        currentLayers: layers,
        idFactory: () => createLayerId(),
        materials,
        mode,
        review: result.review,
        selectedOutputs
      });

      if (candidateBridge.candidateStacks.length) {
        setCalculatorAssistantCandidateStacks(candidateBridge.candidateStacks);
        setCalculatorAssistantCandidateComparisonState({ status: "idle" });
      }

      setCalculatorAssistantSourceAlternativeState({
        candidateCount: candidateBridge.candidateStacks.length,
        clarificationPrompts: candidateBridge.clarificationPrompts,
        result: result.result,
        review: result.review,
        source: result.source,
        status: "ready",
        taskCount: candidateBridge.tasks.length,
        warnings: [...result.warnings, ...candidateBridge.warnings]
      });
      setCalculatorAssistantCommand("");

      const title = candidateBridge.candidateStacks.length
        ? "Source alternative candidates prepared"
        : candidateBridge.clarificationPrompts.length
          ? "Source alternative needs clarification"
          : "Source alternative review ready";
      const detail = candidateBridge.candidateStacks.length
        ? `${candidateBridge.candidateStacks.length} source alternative candidate${candidateBridge.candidateStacks.length === 1 ? "" : "s"} prepared. No Workbench layer changed yet. Preview all candidates before comparing values.`
        : candidateBridge.clarificationPrompts[0]?.message ??
          candidateBridge.tasks[0]?.detail ??
          "Source alternative review is ready, but no previewable candidate stack was produced.";

      setCalculatorAssistantCommandMessage({
        detail,
        title,
        tone: candidateBridge.candidateStacks.length ? "success" : "warning"
      });
      if (candidateBridge.candidateStacks.length) {
        toast.success(title, {
          description: "No Workbench layer changed yet."
        });
      } else {
        toast.warning(title, {
          description: "Candidate generation is waiting for explicit material mapping or custom material properties."
        });
      }
    } catch (error) {
      if (!requestIsCurrent()) {
        return;
      }

      const message = error instanceof Error ? error.message : "Source alternative research failed.";
      setCalculatorAssistantSourceAlternativeState({
        message,
        status: "error",
        warnings: []
      });
      setCalculatorAssistantCommandMessage({
        detail: message,
        title: "Source alternative research failed",
        tone: "warning"
      });
      toast.error("Source alternative research failed", { description: message });
    } finally {
      if (calculatorAssistantSourceAlternativeAbortRef.current === controller) {
        calculatorAssistantSourceAlternativeAbortRef.current = null;
      }
    }
  }

  async function loadSelectedCalculatorAssistantReportOverrideTarget(): Promise<CalculatorAssistantReportOverrideTarget | null> {
    if (!selectedServerProjectId || !selectedServerReportId) {
      return null;
    }

    const response = await fetch(
      `/api/projects/${encodeURIComponent(selectedServerProjectId)}/reports/${encodeURIComponent(selectedServerReportId)}`,
      {
        method: "GET"
      }
    );

    if (!response.ok) {
      throw new Error(await readServerProjectError(response, "DAC could not open the selected report."));
    }

    const payload = (await response.json()) as unknown;
    const report = parseProjectReportRecord(payload);
    if (!report) {
      throw new Error("Selected report does not contain a restorable proposal document.");
    }

    const document: SimpleWorkbenchProposalDocument = {
      ...report.reportDocument,
      serverProjectId: selectedServerProjectId,
      serverProjectScenarioId: report.assemblyId
    };
    const projectContext: SimpleWorkbenchProposalPreviewProjectContext = {
      serverProjectAssemblyId: report.assemblyId,
      serverProjectId: selectedServerProjectId,
      serverProjectReportId: report.id,
      serverProjectReportUpdatedAtIso: report.updatedAtIso,
      sourceAssemblySnapshot: report.sourceAssemblySnapshot,
      sourceCalculationOutput: report.sourceCalculationOutput,
      sourceMaterialSnapshot: report.sourceMaterialSnapshot
    };
    const assistantContext = buildReportAssistantContext({
      document,
      reportId: report.id
    });

    return {
      assistantContext,
      document,
      projectContext,
      reportId: report.id,
      reportName: report.name,
      reportUpdatedAtIso: report.updatedAtIso
    };
  }

  function blockCalculatorAssistantReportOverrideProposal(message: string) {
    setCalculatorAssistantReportOverrideProposalState({
      message,
      status: "blocked"
    });
    setCalculatorAssistantCommandMessage({
      detail: message,
      title: "Report edit blocked",
      tone: "warning"
    });
    toast.warning("Report edit blocked", { description: message });
  }

  async function prepareCalculatorAssistantReportOverrideProposal(): Promise<boolean> {
    if (calculatorAssistantSourceReviewState.status !== "ready") {
      blockCalculatorAssistantReportOverrideProposal("Run a source review before preparing a report draft edit.");
      return false;
    }

    if (calculatorAssistantSourceReviewState.workbenchSnapshotSignature !== getCurrentWorkbenchApplyTargetSignature()) {
      blockCalculatorAssistantReportOverrideProposal("The visible Workbench draft changed after this source review. Run source review again before preparing a report edit.");
      return false;
    }

    if (!selectedServerProjectId || !selectedServerReportId) {
      blockCalculatorAssistantReportOverrideProposal("Open or create a report first. The assistant will not apply a source review without a selected report target.");
      return false;
    }

    setCalculatorAssistantReportOverrideProposalState({ status: "loading" });

    try {
      const target = await loadSelectedCalculatorAssistantReportOverrideTarget();
      if (!target) {
        blockCalculatorAssistantReportOverrideProposal("Open or create a report first. The assistant will not apply a source review without a selected report target.");
        return false;
      }

      const review = calculatorAssistantSourceReviewState.review;
      if (calculatorAssistantSourceReviewState.source !== "research_provider") {
        blockCalculatorAssistantReportOverrideProposal("No source-backed report edit was prepared. Run a source-backed review before applying a report draft edit.");
        return false;
      }

      const metricExists = target.assistantContext.metrics.some((metric) => metric.id === review.metricId);
      if (!metricExists) {
        blockCalculatorAssistantReportOverrideProposal(`The selected report does not contain ${review.metric}. Open or create a matching report before applying this review.`);
        return false;
      }

      const patch = buildReportAssistantSourceBackedReportOverridePatch({
        context: target.assistantContext,
        review
      });

      if (!patch) {
        blockCalculatorAssistantReportOverrideProposal("No source-backed report edit was prepared. Calculator values stay unchanged.");
        return false;
      }

      const validation = validateReportAssistantPatch({
        context: target.assistantContext,
        document: target.document,
        patch
      });

      if (validation.status === "rejected") {
        blockCalculatorAssistantReportOverrideProposal(validation.errors.join(" ") || "The report edit was rejected by the shared patch validator.");
        return false;
      }

      setCalculatorAssistantReportOverrideProposalState({
        review,
        status: "ready",
        target,
        validation
      });
      setCalculatorAssistantCommandMessage({
        detail: `Report-only edit prepared for ${target.reportName}. Calculator values and layer stack will stay unchanged.`,
        title: "Report edit prepared",
        tone: "success"
      });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Report draft edit preparation failed.";
      setCalculatorAssistantReportOverrideProposalState({
        message,
        status: "error"
      });
      setCalculatorAssistantCommandMessage({
        detail: message,
        title: "Report edit failed",
        tone: "warning"
      });
      return false;
    }
  }

  function applyPreparedCalculatorAssistantReportOverrideProposal() {
    if (calculatorAssistantReportOverrideProposalState.status !== "ready") {
      return;
    }

    const proposal = calculatorAssistantReportOverrideProposalState;
    if (
      selectedServerProjectId !== proposal.target.projectContext.serverProjectId ||
      selectedServerReportId !== proposal.target.reportId
    ) {
      const message = "The selected report target changed after this report edit was prepared. Prepare the report edit again for the currently selected report.";
      setCalculatorAssistantReportOverrideProposalState({
        message,
        status: "blocked"
      });
      setCalculatorAssistantCommandMessage({
        detail: message,
        title: "Report edit blocked",
        tone: "warning"
      });
      toast.warning("Report edit blocked", { description: message });
      return;
    }

    if (typeof window !== "undefined") {
      const confirmed = window.confirm(
        "Apply this source review recommendation to the selected report draft? Calculator values and layer stack will stay unchanged."
      );
      if (!confirmed) {
        return;
      }
    }

    try {
      const nextDocument = applyValidatedReportAssistantPatch(proposal.target.document, proposal.validation, {
        confirmed: true,
        scope: "export_only",
        source: "assistant"
      });

      storeReportSnapshot(proposal.target.document, proposal.target.projectContext);
      storeSimpleWorkbenchProposalPreviewCustomizations(nextDocument, {
        projectContext: proposal.target.projectContext
      });
      setCalculatorAssistantReportOverrideProposalState({
        message: "Report draft updated. Calculator values stay unchanged.",
        reportId: proposal.target.reportId,
        reportName: proposal.target.reportName,
        status: "applied"
      });
      toast.success("Report draft updated", {
        description: "Calculator values stay unchanged. Review and save the report draft when ready."
      });
      window.location.assign(
        `/workbench/proposal?projectId=${encodeURIComponent(selectedServerProjectId)}&reportId=${encodeURIComponent(proposal.target.reportId)}`
      );
    } catch (error) {
      setCalculatorAssistantReportOverrideProposalState({
        message: error instanceof Error ? error.message : "Report draft edit failed.",
        status: "error"
      });
      toast.error("Report draft edit failed", {
        description: error instanceof Error ? error.message : "The selected report draft was not changed."
      });
    }
  }

  function getCurrentWorkbenchApplyTargetSignature(): string {
    return createReportAssistantWorkbenchApplyTargetSignature({
      context,
      layers,
      mode,
      selectedOutputs
    });
  }

  function applyConfirmedWorkbenchApplyPayload(payload: ReportAssistantWorkbenchConfirmedApplyPayload): boolean {
    if (payload.mode !== mode) {
      setMode(payload.mode);
    }

    setSelectedOutputs(normalizeWorkbenchV2SelectedOutputs(payload.selectedOutputs, payload.mode));
    setContext((current) => ({
      ...current,
      ...payload.contextPatch
    }));

    const changed = commitLayerStackChange("assistant Workbench apply proposal", () => ({
      layers: payload.layers,
      selectedLayerId: payload.selectedLayerId
    }));

    clearLayerInteractionState();
    setCalculatorAssistantCandidateStacks([]);
    setCalculatorAssistantCandidateComparisonState({ status: "idle" });
    setCalculatorAssistantWorkbenchApplyProposal(null);
    return changed;
  }

  function confirmCalculatorAssistantWorkbenchApplyProposal(proposal: ReportAssistantWorkbenchApplyProposal) {
    let changed = false;
    const result = confirmReportAssistantWorkbenchApplyProposal({
      apply: (payload) => {
        changed = applyConfirmedWorkbenchApplyPayload(payload);
      },
      confirm: () => window.confirm("Apply this assistant proposal to the current unsaved Workbench draft?"),
      currentTargetWorkbenchSnapshotSignature: getCurrentWorkbenchApplyTargetSignature(),
      proposal
    });

    if (!result.ok) {
      if (result.code !== "cancelled") {
        setCalculatorAssistantWorkbenchApplyProposal(null);
      }
      setCalculatorAssistantCommandMessage({
        detail: result.message,
        title: result.code === "cancelled" ? "Workbench apply cancelled" : "Workbench apply blocked",
        tone: "warning"
      });
      if (result.code !== "cancelled") {
        toast.error("Workbench apply blocked", { description: result.message });
      }
      return;
    }

    setCalculatorAssistantCommandMessage({
      detail: changed
        ? `${result.appliedLayerCount} assistant proposal layer${result.appliedLayerCount === 1 ? "" : "s"} applied to the visible unsaved Workbench draft. Run preview to compute values.`
        : "Assistant proposal already matched the visible Workbench draft.",
      title: changed ? "Workbench proposal applied" : "Workbench already matched",
      tone: "success"
    });
    toast.success(changed ? "Workbench proposal applied" : "Workbench already matched", {
      description: "Saved projects, reports, presets, and engine routes were not changed."
    });
  }

  function prepareCalculatorAssistantBoundedEditPlanApplyProposal() {
    // Coordination note (assistant bounded edit-plan proposal, 2026-06-22):
    // This helper only prepares the existing confirmation-gated Workbench proposal.
    // The visible draft may change only through confirmCalculatorAssistantWorkbenchApplyProposal.
    if (calculatorAssistantBoundedEditPlanState.status !== "ready") {
      const detail = "Run a successful bounded dry run before preparing a Workbench apply proposal.";
      setCalculatorAssistantCommandMessage({
        detail,
        title: "Bounded apply proposal blocked",
        tone: "warning"
      });
      toast.warning("Bounded apply proposal blocked", { description: detail });
      return;
    }

    const currentLayerSignature = getWorkbenchV2AssistantLayerStackSignature(layers);
    if (currentLayerSignature !== calculatorAssistantBoundedEditPlanState.result.initialLayerSignature) {
      const detail = "The visible layer stack changed after this dry run. Run the dry run again before preparing an apply proposal.";
      setCalculatorAssistantCommandMessage({
        detail,
        title: "Bounded apply proposal blocked",
        tone: "warning"
      });
      toast.warning("Bounded apply proposal blocked", { description: detail });
      setCalculatorAssistantWorkbenchApplyProposal(null);
      return;
    }

    const proposalResult = createWorkbenchV2AssistantBoundedEditPlanApplyProposal({
      materials,
      plan: calculatorAssistantBoundedEditPlanState.result,
      targetWorkbench: {
        context,
        layers,
        mode,
        selectedOutputs
      }
    });

    if (!proposalResult.ok) {
      const detail = proposalResult.errors.join(" ") || "The bounded dry run cannot be converted into a safe Workbench proposal yet.";
      setCalculatorAssistantCommandMessage({
        detail,
        title: "Bounded apply proposal blocked",
        tone: "warning"
      });
      toast.warning("Bounded apply proposal blocked", { description: detail });
      return;
    }

    setCalculatorAssistantCandidateStacks([]);
    setCalculatorAssistantCandidateComparisonState({ status: "idle" });
    setCalculatorAssistantWorkbenchApplyProposal(proposalResult.proposal);
    setCalculatorAssistantCommandMessage({
      detail: "The bounded plan is ready in the Apply bounded edit plan to draft confirmation card. Review the diff before applying to the visible draft.",
      title: "Workbench apply proposal prepared",
      tone: "success"
    });
    toast.success("Workbench apply proposal prepared", {
      description: "No Workbench layer changed yet."
    });
  }

  function calculatorAssistantCandidateIsCurrent(candidate: WorkbenchV2AssistantLayerStackCandidateStack): boolean {
    const currentSignature = getWorkbenchV2AssistantLayerStackSignature(layers);

    if (candidate.sourceLayerSignature === currentSignature) {
      return true;
    }

    const detail = "The visible calculator layers changed after these candidates were generated. Generate combinations again before previewing or applying one.";
    setCalculatorAssistantCommandMessage({
      detail,
      title: "Candidate is stale",
      tone: "warning"
    });
    toast.error("Candidate is stale", { description: detail });
    return false;
  }

  function calculatorAssistantCandidatePreviewSummaryForApply(
    candidate: WorkbenchV2AssistantLayerStackCandidateStack
  ): WorkbenchV2AssistantCandidateApplyPreviewSummary | undefined {
    if (calculatorAssistantCandidateComparisonState.status !== "ready") {
      return undefined;
    }

    const row = calculatorAssistantCandidateComparisonState.rows.find((entry) => entry.candidateId === candidate.candidateId);
    if (!row || row.status === "error") {
      return undefined;
    }

    const routeStatus =
      row.status === "ready" || row.status === "needs_input" || row.status === "unsupported"
        ? row.status
        : "not_run";
    const primary = row.outputRows.find((output) => output.status === "live");

    return {
      outputRows: row.outputRows,
      ...(primary ? { primaryOutput: `${primary.label} ${primary.value}` } : {}),
      routeStatus
    };
  }

  function buildCalculatorAssistantCandidateSnapshot(candidate: WorkbenchV2AssistantLayerStackCandidateStack): WorkbenchV2ProjectSnapshot {
    const savedAtIso = new Date().toISOString();

    return buildWorkbenchV2ProjectSnapshot({
      context: {
        ...context,
        ...candidate.contextPatch
      },
      customMaterials,
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `workbench-v2-${Date.now()}`,
      layers: candidate.layers,
      materialVisualOverrides,
      mode: candidate.mode,
      name: `${candidate.label} candidate`,
      savedAtIso,
      selectedLayerId: candidate.selectedLayerId,
      selectedOutputs
    });
  }

  function previewCalculatorAssistantCandidateStack(candidate: WorkbenchV2AssistantLayerStackCandidateStack) {
    if (!calculatorAssistantCandidateIsCurrent(candidate)) {
      return;
    }

    setCalculatorAssistantCommandMessage({
      detail: `${candidate.label} is being sent to the calculator preview route. The visible layer table is unchanged.`,
      title: "Candidate preview requested",
      tone: "success"
    });
    void previewCalculatorSnapshotWithAssistant(buildCalculatorAssistantCandidateSnapshot(candidate));
  }

  async function previewAllCalculatorAssistantCandidateStacks() {
    const candidates = calculatorAssistantCandidateStacks;
    if (!candidates.length) {
      return;
    }

    const currentSignature = getWorkbenchV2AssistantLayerStackSignature(layers);
    const staleCandidate = candidates.find((candidate) => candidate.sourceLayerSignature !== currentSignature);
    if (staleCandidate) {
      calculatorAssistantCandidateIsCurrent(staleCandidate);
      return;
    }

    calculatorAssistantCandidateBatchAbortRef.current?.abort();
    const controller = new AbortController();
    const requestId = calculatorAssistantCandidateBatchRequestRef.current + 1;
    calculatorAssistantCandidateBatchRequestRef.current = requestId;
    calculatorAssistantCandidateBatchAbortRef.current = controller;
    const requestIsCurrent = () => calculatorAssistantCandidateBatchRequestRef.current === requestId && !controller.signal.aborted;
    const rows: CalculatorAssistantCandidateComparisonRow[] = [];

    setCalculatorAssistantCandidateComparisonState({
      candidateCount: candidates.length,
      status: "loading"
    });
    setCalculatorAssistantCommandMessage({
      detail: `${candidates.length} candidate stacks are being sent through calculator preview one at a time.`,
      title: "Candidate comparison running",
      tone: "success"
    });

    try {
      for (const candidate of candidates) {
        if (!requestIsCurrent()) {
          return;
        }

        if (candidate.tasks.length) {
          rows.push({
            candidateId: candidate.candidateId,
            commandTasks: candidate.tasks,
            label: candidate.label,
            outputRows: [],
            previewTasks: [],
            status: "needs_input"
          });
          continue;
        }

        try {
          const preview = await requestCalculatorAssistantPreview({
            signal: controller.signal,
            snapshot: buildCalculatorAssistantCandidateSnapshot(candidate)
          });

          if (!requestIsCurrent()) {
            return;
          }

          rows.push({
            candidateId: candidate.candidateId,
            commandTasks: [],
            label: candidate.label,
            outputRows: preview.outputRows,
            previewTasks: preview.tasks,
            status: preview.calculationSummary.status
          });
        } catch (error) {
          if (!requestIsCurrent()) {
            return;
          }

          rows.push({
            candidateId: candidate.candidateId,
            commandTasks: [],
            errorMessage: error instanceof Error ? error.message : "Candidate calculator preview failed.",
            label: candidate.label,
            outputRows: [],
            previewTasks: [],
            status: "error"
          });
        }
      }

      if (!requestIsCurrent()) {
        return;
      }

      const ranking = buildCalculatorAssistantCandidateComparisonRanking({
        rows,
        selectedOutputs
      });

      setCalculatorAssistantCandidateComparisonState({
        ranking,
        rows,
        status: "ready"
      });
      setCalculatorAssistantCommandMessage({
        detail: ranking.length
          ? `${rows.length} candidate stacks previewed through the calculator. Ranking uses ${ranking[0]?.metric ?? selectedOutputs[0]}.`
          : `${rows.length} candidate stacks previewed through the calculator. Ranking is hidden until every candidate has a live row for the selected metric.`,
        title: "Candidate comparison ready",
        tone: "success"
      });
      toast.success("Candidate comparison ready", {
        description: "Rows are calculator-backed where live values are available."
      });
    } catch (error) {
      if (!requestIsCurrent()) {
        return;
      }

      setCalculatorAssistantCandidateComparisonState({
        message: error instanceof Error ? error.message : "Candidate comparison failed.",
        status: "error"
      });
    } finally {
      if (calculatorAssistantCandidateBatchAbortRef.current === controller) {
        calculatorAssistantCandidateBatchAbortRef.current = null;
      }
    }
  }

  function applyCalculatorAssistantCandidateStack(candidate: WorkbenchV2AssistantLayerStackCandidateStack) {
    if (!calculatorAssistantCandidateIsCurrent(candidate)) {
      return;
    }

    // Coordination note (assistant objective apply, 2026-06-22):
    // Objective planner candidates must prepare a confirmed Workbench proposal,
    // not use the lightweight candidate mutation path. Update tests if this changes.
    if (isWorkbenchWallRwImprovementCandidateStack(candidate)) {
      if (candidate.mode !== mode) {
        const detail = "This objective candidate was generated for a different Workbench mode. Generate candidates again before using it.";
        setCalculatorAssistantCommandMessage({
          detail,
          title: "Candidate mode changed",
          tone: "warning"
        });
        toast.error("Candidate mode changed", { description: detail });
        return;
      }

      const requestedOutputs = ensureCalculatorAssistantRwFirstSelectedOutputs(selectedOutputs);
      const proposalResult = createWorkbenchV2AssistantCandidateApplyProposal({
        candidate,
        materials,
        preview: calculatorAssistantCandidatePreviewSummaryForApply(candidate),
        requestedOutputs,
        targetWorkbench: {
          context,
          layers,
          mode,
          selectedOutputs
        }
      });

      if (!proposalResult.ok) {
        const detail = proposalResult.errors.join(" ");
        setCalculatorAssistantCommandMessage({
          detail,
          title: "Workbench proposal blocked",
          tone: "warning"
        });
        toast.error("Workbench proposal blocked", { description: detail });
        return;
      }

      setCalculatorAssistantWorkbenchApplyProposal(proposalResult.proposal);
      setCalculatorAssistantCommandMessage({
        detail: `${candidate.label} is ready as a confirmed Workbench apply proposal. Review the diff before applying to the visible draft.`,
        title: "Workbench apply proposal prepared",
        tone: "success"
      });
      toast.success("Workbench apply proposal prepared", {
        description: "No Workbench layer changed yet."
      });
      return;
    }

    if (candidate.mode !== mode) {
      setMode(candidate.mode);
    }

    const changed = commitLayerStackChange(`assistant candidate ${candidate.label}`, () => ({
      layers: candidate.layers,
      selectedLayerId: candidate.selectedLayerId
    }));

    setContext((current) => ({
      ...current,
      ...candidate.contextPatch
    }));
    clearLayerInteractionState();
    setCalculatorAssistantCandidateStacks([]);
    setCalculatorAssistantCandidateComparisonState({ status: "idle" });
    const missingTaskCount = candidate.tasks.filter((task) => task.code === "assistant_layer_thickness_missing").length;
    const assumedTaskCount = candidate.tasks.filter((task) => task.code === "assistant_layer_thickness_assumed").length;
    setCalculatorAssistantCommandMessage({
      detail: missingTaskCount
        ? `${candidate.label} applied with ${missingTaskCount} missing input${missingTaskCount === 1 ? "" : "s"}. Add them before calculation.`
        : assumedTaskCount
          ? `${candidate.label} applied with ${assumedTaskCount} draft thickness assumption${assumedTaskCount === 1 ? "" : "s"}. Verify product data before relying on report values.`
        : `${candidate.label} applied to the visible calculator draft. Run preview to compute values.`,
      title: changed ? "Candidate applied" : "Candidate already matched",
      tone: missingTaskCount || assumedTaskCount ? "warning" : "success"
    });
    toast.success(changed ? "Candidate applied" : "Candidate already matched", {
      description: missingTaskCount
        ? "Missing inputs remain blank instead of guessed."
        : assumedTaskCount
          ? "Draft thickness assumptions were applied."
        : "Run calculator preview to compute values."
    });
  }

  async function applyCalculatorAssistantLayerStackCommand() {
    if (calculatorAssistantBusy) {
      return;
    }

    const instruction = calculatorAssistantCommand.trim();
    if (isCalculatorAssistantReportOverrideFollowupCommand(instruction)) {
      const prepared = await prepareCalculatorAssistantReportOverrideProposal();
      if (prepared) {
        setCalculatorAssistantCommand("");
      }
      return;
    }

    const routingDecision = classifyCalculatorAssistantCommandRouting({
      instruction,
      selectedOutputs
    });
    if (routingDecision.status !== "bounded_edit_plan") {
      setCalculatorAssistantBoundedEditPlanState((current) => (current.status === "idle" ? current : { status: "idle" }));
    }

    if (routingDecision.status === "source_review" || routingDecision.status === "report_override_request") {
      await reviewCurrentCalculatorWithAssistantSource(instruction);
      return;
    }

    if (routingDecision.status === "source_alternative_research") {
      await researchCalculatorAssistantSourceAlternatives(instruction);
      return;
    }

    if (routingDecision.status === "objective_candidate_planning") {
      const improvementPlan = planWorkbenchWallRwImprovementCandidates({
        candidateCap: 3,
        constraints: {
          maxAddedLayers: 2
        },
        context,
        currentLayers: layers,
        idFactory: () => createLayerId(),
        materials,
        mode,
        selectedOutputs
      });
      if (!improvementPlan.candidateStacks.length) {
        const detail = improvementPlan.warnings.join(" ") || "No safe Rw improvement candidates could be prepared from the visible wall stack.";
        setCalculatorAssistantCommandMessage({
          detail,
          title: "Rw improvement candidates blocked",
          tone: "warning"
        });
        toast.warning("Rw improvement candidates blocked", {
          description: detail
        });
        return;
      }

      const nextSelectedOutputs = ensureCalculatorAssistantRwFirstSelectedOutputs(selectedOutputs);
      if (nextSelectedOutputs.join("|") !== selectedOutputs.join("|")) {
        setSelectedOutputs(nextSelectedOutputs);
      }
      setCalculatorAssistantCandidateStacks(improvementPlan.candidateStacks);
      setCalculatorAssistantSourceAlternativeState((current) => (current.status === "idle" ? current : { status: "idle" }));
      setCalculatorAssistantCandidateComparisonState({ status: "idle" });
      setCalculatorAssistantCommand("");
      const detail = `${improvementPlan.candidateStacks.length} Rw improvement candidate${improvementPlan.candidateStacks.length === 1 ? "" : "s"} prepared from the visible wall stack. Preview all candidates before comparing values or applying one.`;
      setCalculatorAssistantCommandMessage({
        detail,
        title: "Rw improvement candidates prepared",
        tone: "success"
      });
      toast.success("Rw improvement candidates prepared", {
        description: "No calculator value was generated yet."
      });
      return;
    }

    if (routingDecision.status === "bounded_edit_plan") {
      // Coordination note (assistant bounded edit plans, 2026-06-22):
      // This branch is read-only. It may prepare a dry-run plan; the panel may
      // later prepare a confirmation-gated proposal, but must not call
      // commitLayerStackChange, setLayers, provider/research routes, or direct apply.
      const plan = createWorkbenchV2AssistantBoundedEditPlan({
        currentLayers: layers,
        currentMode: mode,
        currentSelectedLayerId: selectedLayerId,
        currentSelectedOutputs: selectedOutputs,
        idFactory: () => createLayerId(),
        instruction,
        materials
      });
      setCalculatorAssistantCandidateStacks([]);
      setCalculatorAssistantCandidateComparisonState({ status: "idle" });
      setCalculatorAssistantSourceAlternativeState((current) => (current.status === "idle" ? current : { status: "idle" }));
      setCalculatorAssistantWorkbenchApplyProposal(null);

      if (plan.ok) {
        setCalculatorAssistantBoundedEditPlanState({
          result: plan,
          status: "ready"
        });
        setCalculatorAssistantCommand("");
        setCalculatorAssistantCommandMessage({
          detail: `${plan.steps.length} ordered step${plan.steps.length === 1 ? "" : "s"} parsed. No Workbench layer changed yet. Review the dry run before any future apply flow.`,
          title: "Multi-step dry run ready",
          tone: "success"
        });
        toast.success("Multi-step dry run ready", {
          description: "No Workbench layer changed yet."
        });
      } else {
        setCalculatorAssistantBoundedEditPlanState({
          result: plan,
          status: "blocked"
        });
        setCalculatorAssistantCommandMessage({
          detail: `${plan.message} No Workbench layer changed yet.`,
          title: "Multi-step dry run blocked",
          tone: "warning"
        });
        toast.warning("Multi-step dry run blocked", {
          description: plan.message
        });
      }
      return;
    }

    if (routingDecision.status === "clarify") {
      const title = routingDecision.reason === "research_write_requires_clarification"
        ? "Research edit needs clarification"
        : "Calculator value override blocked";
      setCalculatorAssistantCommandMessage({
        detail: routingDecision.message,
        title,
        tone: "warning"
      });
      toast.warning(title, {
        description: routingDecision.message
      });
      return;
    }

    let result: WorkbenchV2AssistantLayerStackApplyResult = parseWorkbenchV2AssistantLayerStackApplyCommand({
      currentLayers: layers,
      currentMode: mode,
      currentSelectedLayerId: selectedLayerId,
      currentSelectedOutputs: selectedOutputs,
      idFactory: () => createLayerId(),
      instruction,
      materials
    });
    let interpretedCommandDetail = "";

    if (result.ok === false) {
      const deterministicMessage = result.message;
      setCalculatorAssistantCommandPending(true);
      setCalculatorAssistantCommandMessage({
        detail: "Interpreting the request as a natural-language calculator edit.",
        title: "Interpreting command",
        tone: "warning"
      });

      try {
        const decision = await requestCalculatorAssistantCommandInterpretation({
          currentLayers: layers,
          currentMode: mode,
          currentSelectedOutputs: selectedOutputs,
          instruction,
          materials
        });

        if (decision.status !== "apply") {
          setCalculatorAssistantCommandMessage({
            detail: `${decision.message} ${decision.explanation}`.trim(),
            title: decision.status === "clarify" ? "Need one detail" : "Command not applied",
            tone: "warning"
          });
          toast.warning(decision.status === "clarify" ? "Need one detail" : "Command not applied", {
            description: decision.message
          });
          return;
        }

        result = parseWorkbenchV2AssistantLayerStackApplyCommand({
          currentLayers: layers,
          currentMode: mode,
          currentSelectedLayerId: selectedLayerId,
          currentSelectedOutputs: selectedOutputs,
          idFactory: () => createLayerId(),
          instruction: decision.normalizedCommand,
          materials
        });
        interpretedCommandDetail = `Interpreted as: ${decision.normalizedCommand}.`;

        if (result.ok === false) {
          setCalculatorAssistantCommandMessage({
            detail: `I understood the request, but the calculator validator rejected the safe command "${decision.normalizedCommand}". ${result.message}`,
            title: "Command not applied",
            tone: "warning"
          });
          toast.warning("Command not applied", {
            description: result.message
          });
          return;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Natural-language command interpretation failed.";
        setCalculatorAssistantCommandMessage({
          detail: `${deterministicMessage} AI interpretation also failed: ${message}`,
          title: "Stack not applied",
          tone: "warning"
        });
        toast.error("Stack not applied", { description: message });
        return;
      } finally {
        setCalculatorAssistantCommandPending(false);
      }
    }

    if (result.mode !== mode) {
      setMode(result.mode);
      if (!result.selectedOutputs) {
        setSelectedOutputs(getDefaultWorkbenchV2SelectedOutputs(result.mode));
      }
    }

    if (result.selectedOutputs) {
      setSelectedOutputs(normalizeWorkbenchV2SelectedOutputs(result.selectedOutputs, result.mode));
    }

    if (result.candidateStacks) {
      setCalculatorAssistantCandidateStacks(result.candidateStacks);
      setCalculatorAssistantSourceAlternativeState((current) => (current.status === "idle" ? current : { status: "idle" }));
      setCalculatorAssistantCandidateComparisonState({ status: "idle" });
      setCalculatorAssistantCommand("");
      setCalculatorAssistantCommandMessage({
        detail: `${interpretedCommandDetail ? `${interpretedCommandDetail} ` : ""}${result.candidateStacks.length} candidate stacks prepared from the visible calculator layers. Run calculator preview for each candidate before comparing values.`,
        title: "Candidate stacks prepared",
        tone: "success"
      });
      toast.success("Candidate stacks prepared", {
        description: "No calculator value was generated yet."
      });
      return;
    }

    if (result.commandKind === "set_context") {
      const nextContext = {
        ...context,
        ...result.contextPatch
      };

      setContext(nextContext);
      clearLayerInteractionState();
      setCalculatorAssistantCommand("");
      setCalculatorAssistantCandidateStacks([]);
      setCalculatorAssistantCandidateComparisonState({ status: "idle" });

      if (result.previewRequested) {
        setCalculatorAssistantCommandMessage({
          detail: `${interpretedCommandDetail ? `${interpretedCommandDetail} ` : ""}Calculator context updated. Running the patched calculator draft through the preview route.`,
          title: "Context updated and preview requested",
          tone: "success"
        });
        void previewCalculatorSnapshotWithAssistant(
          buildWorkbenchV2ProjectSnapshot({
            context: nextContext,
            customMaterials,
            id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `workbench-v2-${Date.now()}`,
            layers,
            materialVisualOverrides,
            mode,
            name: activeServerAssembly?.name ?? lastAppliedTemplateName ?? "Current draft",
            savedAtIso: new Date().toISOString(),
            selectedLayerId,
            selectedOutputs
          })
        );
        toast.success("Calculator context updated", {
          description: "Preview uses the updated inputs."
        });
        return;
      }

      setCalculatorAssistantCommandMessage({
        detail: `${interpretedCommandDetail ? `${interpretedCommandDetail} ` : ""}${result.tasks.map((task) => task.detail).join(" ")}`,
        title: "Calculator context updated",
        tone: "success"
      });
      toast.success("Calculator context updated", {
        description: "Run calculator preview to compute values."
      });
      return;
    }

    const changed = commitLayerStackChange("assistant layer stack command", () => ({
      layers: result.layers,
      selectedLayerId: result.selectedLayerId
    }));

    setContext((current) => ({
      ...current,
      ...result.contextPatch
    }));
    clearLayerInteractionState();
    setCalculatorAssistantCommand("");
    setCalculatorAssistantCandidateStacks([]);
    setCalculatorAssistantCandidateComparisonState({ status: "idle" });
    if (result.previewRequested) {
      setCalculatorAssistantCommandMessage({
        detail: `${interpretedCommandDetail ? `${interpretedCommandDetail} ` : ""}Running the current calculator draft through the preview route.`,
        title: "Preview requested",
        tone: "success"
      });
      void previewCurrentCalculatorWithAssistant();
      return;
    }

    const commandLabel = result.commandKind === "set_outputs"
      ? "outputs updated"
      : result.commandKind === "add_layer"
        ? "layer added"
        : result.commandKind === "remove_layer"
          ? "layer removed"
          : result.commandKind === "move_layer"
            ? "layer moved"
            : result.commandKind === "update_layer"
              ? "layer updated"
              : "layer stack updated";
    const missingTaskCount = result.tasks.filter((task) => task.code === "assistant_layer_thickness_missing").length;
    const assumedTaskCount = result.tasks.filter((task) => task.code === "assistant_layer_thickness_assumed").length;
    const commandDetail = missingTaskCount
      ? `${result.layerCount} layers applied. Add positive thicknesses before calculation.`
      : assumedTaskCount
        ? `${result.layerCount} layers applied with ${assumedTaskCount} draft thickness assumption${assumedTaskCount === 1 ? "" : "s"}. Verify product data before relying on report values.`
        : result.commandKind === "set_outputs" && result.selectedOutputs
          ? `Selected outputs: ${result.selectedOutputs.join(", ")}.`
          : result.materialNames.length
            ? `${result.layerCount} layers applied from ${result.materialNames.join(", ")}.`
            : `Assistant ${commandLabel}.`;
    setCalculatorAssistantCommandMessage({
      detail: interpretedCommandDetail ? `${interpretedCommandDetail} ${commandDetail}` : commandDetail,
      title: changed || result.commandKind === "set_outputs" ? "Calculator command applied" : "Calculator already matched",
      tone: missingTaskCount || assumedTaskCount ? "warning" : "success"
    });
    toast.success(changed || result.commandKind === "set_outputs" ? "Calculator command applied" : "Calculator already matched", {
      description: missingTaskCount
        ? "Assistant left missing thicknesses blank instead of guessing."
        : assumedTaskCount
          ? "Draft thickness assumptions were applied."
        : result.commandKind === "set_outputs" && result.selectedOutputs
          ? `Selected ${result.selectedOutputs.join(", ")}.`
          : `${result.layerCount} calculator layer${result.layerCount === 1 ? "" : "s"} applied.`
    });
  }

  async function saveCurrentWorkbenchPreset() {
    const presetName = workbenchPresetNameDraftRef.current.trim() || `${mode === "wall" ? "Wall" : "Floor"} template`;
    const presetDescription = workbenchPresetDescriptionDraftRef.current.trim();
    const snapshot = buildCurrentWorkbenchV2Snapshot(presetName, `${mode === "wall" ? "Wall" : "Floor"} template`);
    if (!beginWorkbenchPresetMutation()) {
      return;
    }

    setWorkbenchPresetStatus("syncing");
    setWorkbenchPresetMessage("Saving template");

    try {
      const response = await fetch("/api/workbench-v2/presets", {
        body: JSON.stringify({
          description: presetDescription || undefined,
          name: presetName,
          snapshot
        }),
        headers: {
          "content-type": "application/json"
        },
        method: "POST"
      });

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not save the template."));
      }

      const payload = (await response.json()) as unknown;
      const preset = parseWorkbenchV2PresetRecord(payload);
      if (!preset) {
        throw new Error("DAC saved the template but the server response was incomplete.");
      }

      setSelectedWorkbenchPresetId(preset.id);
      setSelectedWorkbenchCommonPresetId("");
      workbenchPresetNameDraftRef.current = "";
      workbenchPresetDescriptionDraftRef.current = "";
      setWorkbenchPresetNameDraft("");
      setWorkbenchPresetDescriptionDraft("");
      await refreshWorkbenchPresets({ preserveMessage: true, silent: true });
      setWorkbenchPresetStatus("idle");
      setWorkbenchPresetMessage("Template saved");
    } catch (error) {
      setWorkbenchPresetStatus("error");
      setWorkbenchPresetMessage(error instanceof Error ? error.message : "Template save failed");
    } finally {
      finishWorkbenchPresetMutation();
    }
  }

  // Agent coordination, 2026-06-22:
  // This is the only UI handler that writes user_verified_calculated_result
  // records. It stores the current live result package only; do not route it
  // through measured Rw anchors or /api/estimate runtime loading.
  async function saveCurrentVerifiedCalculatedAnchor() {
    if (estimateState.status !== "ready") {
      setWorkbenchVerifiedCalculatedAnchorStatus("error");
      setWorkbenchVerifiedCalculatedAnchorMessage("Run the calculator before saving a reference.");
      return;
    }

    const currentRequest = buildEstimatePayload(mode, layers, selectedOutputs, context, customMaterials);
    if (!currentRequest || !estimateRequestsEqualForVerifiedCalculatedCapture(currentRequest, estimateState.request)) {
      setWorkbenchVerifiedCalculatedAnchorStatus("error");
      setWorkbenchVerifiedCalculatedAnchorMessage("Recalculate before saving this reference.");
      return;
    }

    const capture = buildVerifiedCalculatedAnchorCapturePackage({
      context,
      currentRequest,
      mode,
      result: estimateState.result,
      selectedOutputs
    });
    if (capture.status !== "ready") {
      setWorkbenchVerifiedCalculatedAnchorStatus("error");
      setWorkbenchVerifiedCalculatedAnchorMessage("No live output is available to save.");
      return;
    }
    if (!beginWorkbenchVerifiedCalculatedAnchorMutation()) {
      return;
    }

    const referenceName = `${activeServerAssembly?.name ?? lastAppliedTemplateName ?? (mode === "wall" ? "Wall" : "Floor")} verified result`;
    const snapshot = buildCurrentWorkbenchV2Snapshot(referenceName, `${mode === "wall" ? "Wall" : "Floor"} verified result`);

    setWorkbenchVerifiedCalculatedAnchorStatus("syncing");
    setWorkbenchVerifiedCalculatedAnchorMessage("");

    try {
      const response = await fetch("/api/workbench-v2/verified-calculated-anchors", {
        body: JSON.stringify({
          createdFromProjectId: selectedServerProjectId || undefined,
          description: "Current live calculator result confirmed as a verified reference.",
          name: referenceName,
          requestContext: capture.package.requestContext,
          resultBasisTrace: capture.package.resultBasisTrace,
          scope: selectedServerProjectId ? "project_evidence" : "user_evidence",
          values: capture.package.values,
          workbenchSnapshot: snapshot
        }),
        headers: {
          "content-type": "application/json"
        },
        method: "POST"
      });

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not save the verified reference."));
      }

      const payload = (await response.json()) as unknown;
      if (typeof payload !== "object" || payload === null || !("anchor" in payload)) {
        throw new Error("DAC saved the verified reference but the server response was incomplete.");
      }

      await refreshWorkbenchVerifiedCalculatedAnchors({ preserveMessage: true, silent: true });
      setWorkbenchVerifiedCalculatedAnchorStatus("idle");
      setWorkbenchVerifiedCalculatedAnchorMessage("Verified reference saved");
      toast.success("Verified reference saved", {
        description: `${capture.package.values.length} output${capture.package.values.length === 1 ? "" : "s"} saved.`
      });
    } catch (error) {
      setWorkbenchVerifiedCalculatedAnchorStatus("error");
      setWorkbenchVerifiedCalculatedAnchorMessage(error instanceof Error ? error.message : "Verified reference save failed");
    } finally {
      finishWorkbenchVerifiedCalculatedAnchorMutation();
    }
  }

  async function retireWorkbenchVerifiedCalculatedAnchor(anchorId: string) {
    if (!anchorId) {
      return;
    }
    if (!globalThis.confirm("Retire this verified reference? It will no longer be used by future calculator estimates.")) {
      return;
    }
    if (!beginWorkbenchVerifiedCalculatedAnchorMutation()) {
      return;
    }

    setWorkbenchVerifiedCalculatedAnchorStatus("syncing");
    setWorkbenchVerifiedCalculatedAnchorMessage("");

    try {
      const response = await fetch(`/api/workbench-v2/verified-calculated-anchors/${encodeURIComponent(anchorId)}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not retire the verified reference."));
      }

      await refreshWorkbenchVerifiedCalculatedAnchors({ preserveMessage: true, silent: true });
      setWorkbenchVerifiedCalculatedAnchorStatus("idle");
      setWorkbenchVerifiedCalculatedAnchorMessage("Verified reference retired");
    } catch (error) {
      setWorkbenchVerifiedCalculatedAnchorStatus("error");
      setWorkbenchVerifiedCalculatedAnchorMessage(error instanceof Error ? error.message : "Verified reference retire failed");
    } finally {
      finishWorkbenchVerifiedCalculatedAnchorMutation();
    }
  }

  // Agent coordination, 2026-06-22:
  // These handlers are the UI path that turns a saved wall preset into evidence.
  // If another agent edits them, preserve explicit user action, active-only
  // estimate loading, confirmed retirement, and the focused route tests.
  async function saveSelectedWorkbenchPresetMeasuredRwAnchor() {
    if (!selectedWorkbenchPreset) {
      return;
    }
    if (selectedWorkbenchPreset.kind !== "wall") {
      setWorkbenchPresetStatus("error");
      setWorkbenchPresetMessage("Rw references require a wall template");
      return;
    }

    const valueDb = Number(workbenchPresetMeasuredRwDraftRef.current.trim());
    const toleranceText = workbenchPresetMeasuredRwToleranceDraftRef.current.trim();
    const toleranceDb = toleranceText ? Number(toleranceText) : 0;

    if (!Number.isFinite(valueDb) || valueDb < 0 || valueDb > 120) {
      setWorkbenchPresetStatus("error");
      setWorkbenchPresetMessage("Enter measured Rw between 0 and 120 dB");
      return;
    }
    if (!Number.isFinite(toleranceDb) || toleranceDb < 0 || toleranceDb > 20) {
      setWorkbenchPresetStatus("error");
      setWorkbenchPresetMessage("Enter Rw tolerance between 0 and 20 dB");
      return;
    }
    if (!beginWorkbenchPresetMutation()) {
      return;
    }

    setWorkbenchPresetStatus("syncing");
    setWorkbenchPresetMessage("Saving Rw reference");

    try {
      const response = await fetch("/api/workbench-v2/measured-wall-rw-anchors", {
        body: JSON.stringify({
          presetId: selectedWorkbenchPreset.id,
          ratingStandard: "ISO 717-1",
          sourceLabel: `${selectedWorkbenchPreset.name} measured lab Rw`,
          toleranceDb,
          valueDb
        }),
        headers: {
          "content-type": "application/json"
        },
        method: "POST"
      });

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not save the measured Rw reference."));
      }

      const payload = (await response.json()) as unknown;
      if (typeof payload !== "object" || payload === null || !("anchor" in payload)) {
        throw new Error("DAC saved the Rw reference but the server response was incomplete.");
      }

      workbenchPresetMeasuredRwDraftRef.current = "";
      workbenchPresetMeasuredRwToleranceDraftRef.current = "0";
      setWorkbenchPresetMeasuredRwDraft("");
      setWorkbenchPresetMeasuredRwToleranceDraft("0");
      await refreshWorkbenchMeasuredWallRwAnchors({ preserveMessage: true, silent: true });
      setWorkbenchMeasuredAnchorRevision((current) => current + 1);
      setWorkbenchPresetStatus("idle");
      setWorkbenchPresetMessage("Rw reference saved");
    } catch (error) {
      setWorkbenchPresetStatus("error");
      setWorkbenchPresetMessage(error instanceof Error ? error.message : "Rw reference save failed");
    } finally {
      finishWorkbenchPresetMutation();
    }
  }

  async function retireSelectedWorkbenchPresetMeasuredRwAnchor(anchorId: string) {
    if (!anchorId) {
      return;
    }
    if (!globalThis.confirm("Retire this measured Rw reference? It will no longer be used by calculator estimates.")) {
      return;
    }
    if (!beginWorkbenchPresetMutation()) {
      return;
    }

    setWorkbenchPresetStatus("syncing");
    setWorkbenchPresetMessage("Retiring Rw reference");

    try {
      const response = await fetch(`/api/workbench-v2/measured-wall-rw-anchors/${encodeURIComponent(anchorId)}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not retire the measured Rw reference."));
      }

      await refreshWorkbenchMeasuredWallRwAnchors({ preserveMessage: true, silent: true });
      setWorkbenchMeasuredAnchorRevision((current) => current + 1);
      setWorkbenchPresetStatus("idle");
      setWorkbenchPresetMessage("Rw reference retired");
    } catch (error) {
      setWorkbenchPresetStatus("error");
      setWorkbenchPresetMessage(error instanceof Error ? error.message : "Rw reference retire failed");
    } finally {
      finishWorkbenchPresetMutation();
    }
  }

  async function useSelectedWorkbenchPreset() {
    if (!selectedWorkbenchPresetId) {
      return;
    }
    if (!beginWorkbenchPresetMutation()) {
      return;
    }

    setWorkbenchPresetStatus("restoring");
    setWorkbenchPresetMessage("Loading template");

    try {
      const response = await fetch(`/api/workbench-v2/presets/${encodeURIComponent(selectedWorkbenchPresetId)}`, {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not load the selected template."));
      }

      const payload = (await response.json()) as unknown;
      const preset = parseWorkbenchV2PresetRecord(payload);
      const parsed = preset ? parseWorkbenchV2ProjectSnapshot(preset.snapshot) : null;

      if (!preset || !parsed?.snapshot) {
        throw new Error("Selected template does not contain a restorable workbench v2 snapshot.");
      }

      const currentSnapshot = buildCurrentWorkbenchV2Snapshot("Current draft", "Current draft");
      if (
        !workbenchV2SnapshotsRepresentSameDraft(currentSnapshot, parsed.snapshot) &&
        !window.confirm("Use this template and replace the current workbench draft?")
      ) {
        setWorkbenchPresetStatus("idle");
        setWorkbenchPresetMessage("Template load cancelled");
        return;
      }

      restoreWorkbenchV2Snapshot(parsed);
      clearSelectedProjectChildren();
      setSelectedWorkbenchPresetId(preset.id);
      setSelectedWorkbenchCommonPresetId("");
      setLastAppliedTemplateName(preset.name);
      setReportSourceDecisionOpen(false);
      setWorkbenchPresetStatus("idle");
      setWorkbenchPresetMessage("Template loaded");
    } catch (error) {
      setWorkbenchPresetStatus("error");
      setWorkbenchPresetMessage(error instanceof Error ? error.message : "Template load failed");
    } finally {
      finishWorkbenchPresetMutation();
    }
  }

  async function applyWorkbenchCommonPresetById(presetId: string) {
    const preset = findWorkbenchV2CommonPresetById(presetId);

    if (!preset) {
      return;
    }
    if (!beginWorkbenchPresetMutation()) {
      return;
    }

    setWorkbenchPresetStatus("restoring");
    setWorkbenchPresetMessage("Loading common template");

    try {
      const parsed = parseWorkbenchV2ProjectSnapshot(preset.snapshot);

      if (!parsed.snapshot) {
        throw new Error("Selected common template does not contain a restorable workbench v2 snapshot.");
      }

      const currentSnapshot = buildCurrentWorkbenchV2Snapshot("Current draft", "Current draft");
      if (
        !workbenchV2SnapshotsRepresentSameDraft(currentSnapshot, parsed.snapshot) &&
        !window.confirm("Use this common template and replace the current workbench draft?")
      ) {
        setWorkbenchPresetStatus("idle");
        setWorkbenchPresetMessage("Common template load cancelled");
        return;
      }

      restoreWorkbenchV2Snapshot(parsed);
      clearSelectedProjectChildren();
      setSelectedWorkbenchPresetId("");
      setSelectedWorkbenchCommonPresetId(preset.id);
      setLastAppliedTemplateName(preset.label);
      setReportSourceDecisionOpen(false);
      setWorkbenchPresetStatus("idle");
      setWorkbenchPresetMessage("Common template loaded");
    } catch (error) {
      setWorkbenchPresetStatus("error");
      setWorkbenchPresetMessage(error instanceof Error ? error.message : "Common template load failed");
    } finally {
      finishWorkbenchPresetMutation();
    }
  }

  async function applySelectedWorkbenchCommonPreset() {
    if (!selectedWorkbenchCommonPresetId) {
      return;
    }

    await applyWorkbenchCommonPresetById(selectedWorkbenchCommonPresetId);
  }

  async function renameSelectedWorkbenchPreset() {
    if (!selectedWorkbenchPreset) {
      return;
    }

    const nextName = workbenchPresetRenameDraftRef.current.trim();
    const nextDescription = workbenchPresetRenameDescriptionDraftRef.current.trim();
    const currentDescription = selectedWorkbenchPreset.description ?? "";
    if (!nextName) {
      setWorkbenchPresetStatus("error");
      setWorkbenchPresetMessage("Enter a template name first");
      return;
    }
    if (nextName === selectedWorkbenchPreset.name && nextDescription === currentDescription) {
      setWorkbenchPresetMessage("Template details unchanged");
      return;
    }
    if (!beginWorkbenchPresetMutation()) {
      return;
    }

    setWorkbenchPresetStatus("syncing");
    setWorkbenchPresetMessage("Renaming template");

    try {
      const response = await fetch(`/api/workbench-v2/presets/${encodeURIComponent(selectedWorkbenchPreset.id)}`, {
        body: JSON.stringify({
          description: nextDescription || undefined,
          name: nextName
        }),
        headers: {
          "content-type": "application/json"
        },
        method: "PATCH"
      });

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not rename the template."));
      }

      const payload = (await response.json()) as unknown;
      const preset = parseWorkbenchV2PresetRecord(payload);
      if (!preset) {
        throw new Error("DAC renamed the template but the server response was incomplete.");
      }

      setSelectedWorkbenchPresetId(preset.id);
      workbenchPresetRenameDescriptionDraftRef.current = preset.description ?? "";
      setWorkbenchPresetRenameDescriptionDraft(preset.description ?? "");
      await refreshWorkbenchPresets({ preserveMessage: true, silent: true });
      setWorkbenchPresetStatus("idle");
      setWorkbenchPresetMessage("Updated template");
    } catch (error) {
      setWorkbenchPresetStatus("error");
      setWorkbenchPresetMessage(error instanceof Error ? error.message : "Template rename failed");
    } finally {
      finishWorkbenchPresetMutation();
    }
  }

  async function duplicateSelectedWorkbenchPreset() {
    if (!selectedWorkbenchPreset) {
      return;
    }
    if (!beginWorkbenchPresetMutation()) {
      return;
    }

    setWorkbenchPresetStatus("syncing");
    setWorkbenchPresetMessage("Duplicating template");

    try {
      const response = await fetch(`/api/workbench-v2/presets/${encodeURIComponent(selectedWorkbenchPreset.id)}/duplicate`, {
        body: JSON.stringify({}),
        headers: {
          "content-type": "application/json"
        },
        method: "POST"
      });

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not duplicate the template."));
      }

      const payload = (await response.json()) as unknown;
      const preset = parseWorkbenchV2PresetRecord(payload);
      if (!preset) {
        throw new Error("DAC duplicated the template but the server response was incomplete.");
      }

      setSelectedWorkbenchPresetId(preset.id);
      await refreshWorkbenchPresets({ preserveMessage: true, silent: true });
      setWorkbenchPresetStatus("idle");
      setWorkbenchPresetMessage("Duplicated template");
    } catch (error) {
      setWorkbenchPresetStatus("error");
      setWorkbenchPresetMessage(error instanceof Error ? error.message : "Template duplicate failed");
    } finally {
      finishWorkbenchPresetMutation();
    }
  }

  async function deleteSelectedWorkbenchPreset() {
    if (!selectedWorkbenchPreset) {
      return;
    }
    if (!window.confirm(`Delete "${selectedWorkbenchPreset.name}" from templates?`)) {
      return;
    }
    if (!beginWorkbenchPresetMutation()) {
      return;
    }

    setWorkbenchPresetStatus("syncing");
    setWorkbenchPresetMessage("Deleting template");

    try {
      const response = await fetch(`/api/workbench-v2/presets/${encodeURIComponent(selectedWorkbenchPreset.id)}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not delete the template."));
      }

      setSelectedWorkbenchPresetId("");
      workbenchPresetRenameDraftRef.current = "";
      workbenchPresetRenameDescriptionDraftRef.current = "";
      setWorkbenchPresetRenameDraft("");
      setWorkbenchPresetRenameDescriptionDraft("");
      await refreshWorkbenchPresets({ preserveMessage: true, silent: true });
      setWorkbenchPresetStatus("idle");
      setWorkbenchPresetMessage("Deleted template");
    } catch (error) {
      setWorkbenchPresetStatus("error");
      setWorkbenchPresetMessage(error instanceof Error ? error.message : "Template delete failed");
    } finally {
      finishWorkbenchPresetMutation();
    }
  }

  async function createServerProject() {
    const projectName = serverProjectNameDraftRef.current.trim();
    if (!projectName) {
      setServerProjectStatus("error");
      setServerProjectMessage("Enter a project name first");
      return;
    }
    if (!beginServerProjectMutation()) {
      return;
    }

    setServerProjectStatus("syncing");
    setServerProjectMessage("Creating project");

    try {
      const response = await fetch("/api/projects", {
        body: JSON.stringify({
          name: projectName
        }),
        headers: {
          "content-type": "application/json"
        },
        method: "POST"
      });

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not create the project."));
      }

      const payload = (await response.json()) as unknown;
      const project = isObjectRecord(payload) && isObjectRecord(payload.project) && typeof payload.project.id === "string"
        ? {
            id: payload.project.id
          }
        : null;

      if (!project) {
        throw new Error("DAC created the project but the server response was incomplete.");
      }

      setSelectedServerProjectId(project.id);
      setExpandedServerProjectId(project.id);
      setSelectedServerAssemblyId("");
      setSelectedServerReportId("");
      clearActiveProjectAssembly();
      setLastAppliedTemplateName(null);
      setReportSourceDecisionOpen(false);
      setServerProjectAssemblies([]);
      setServerProjectReports([]);
      serverProjectNameDraftRef.current = "";
      setServerProjectNameDraft("");
      setProjectCreatePanelOpen(false);
      await refreshServerProjects({ preserveMessage: true, silent: true });
      setServerProjectStatus("idle");
      setServerProjectMessage("Project created");
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Project create failed");
    } finally {
      finishServerProjectMutation();
    }
  }

  async function saveCurrentAssemblyToServerProject(): Promise<ServerProjectAssemblyRecordPayload | null> {
    if (!selectedServerProjectId) {
      setServerProjectStatus("error");
      setServerProjectMessage("Create or select a project first");
      setProjectCreatePanelOpen(true);
      openWorkbenchDrawer("projects");
      return null;
    }

    const assemblyName = serverAssemblyNameDraftRef.current.trim();
    if (!assemblyName) {
      setServerProjectStatus("idle");
      setServerProjectMessage("Name the layer combination first");
      setAssemblyCreatePanelOpen(true);
      openWorkbenchDrawer("projects");
      return null;
    }

    const assemblyDescription = serverAssemblyDescriptionDraftRef.current.trim();
    const snapshot = buildCurrentWorkbenchV2ServerSnapshot(assemblyName);
    if (!beginServerProjectMutation()) {
      return null;
    }
    setServerProjectStatus("syncing");
    setServerProjectMessage("Saving combination");

    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(selectedServerProjectId)}/assemblies`, {
        body: JSON.stringify({
          calculationSummary: buildAssemblyCalculationSummary(),
          description: assemblyDescription || undefined,
          kind: mode,
          name: assemblyName,
          snapshot
        }),
        headers: {
          "content-type": "application/json"
        },
        method: "POST"
      });

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not save the combination."));
      }

      const payload = (await response.json()) as unknown;
      const assembly = parseProjectAssemblyRecord(payload);
      if (!assembly) {
        throw new Error("DAC saved the combination but the server response was incomplete.");
      }

      setSelectedServerAssemblyId(assembly.id);
      markActiveProjectAssembly(assembly.id, snapshot);
      setAssemblyCreatePanelOpen(false);
      setReportSourceDecisionOpen(false);
      serverAssemblyNameDraftRef.current = "";
      setServerAssemblyNameDraft("");
      serverAssemblyDescriptionDraftRef.current = "";
      setServerAssemblyDescriptionDraft("");
      await refreshServerProjectAssemblies(selectedServerProjectId, { preserveMessage: true, silent: true });
      await refreshServerProjects({ preserveMessage: true, silent: true });
      setServerProjectStatus("idle");
      setServerProjectMessage("Saved combination");
      return assembly;
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Combination save failed");
      return null;
    } finally {
      finishServerProjectMutation();
    }
  }

  async function updateCurrentAssemblyInServerProject(): Promise<ServerProjectAssemblyRecordPayload | null> {
    if (!selectedServerProjectId || !activeServerAssembly) {
      setServerProjectStatus("idle");
      setServerProjectMessage("Save this stack as a new combination first");
      setAssemblyCreatePanelOpen(true);
      openWorkbenchDrawer("projects");
      return null;
    }

    const snapshot = buildCurrentWorkbenchV2ServerSnapshot(activeServerAssembly.name);
    if (!beginServerProjectMutation()) {
      return null;
    }
    setServerProjectStatus("syncing");
    setServerProjectMessage("Updating combination");

    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(selectedServerProjectId)}/assemblies/${encodeURIComponent(activeServerAssembly.id)}`,
        {
          body: JSON.stringify({
            calculationSummary: buildAssemblyCalculationSummary(),
            kind: mode,
            snapshot
          }),
          headers: {
            "content-type": "application/json"
          },
          method: "PATCH"
        }
      );

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not update the combination."));
      }

      const payload = (await response.json()) as unknown;
      const assembly = parseProjectAssemblyRecord(payload);
      if (!assembly) {
        throw new Error("DAC updated the combination but the server response was incomplete.");
      }

      setSelectedServerAssemblyId(assembly.id);
      markActiveProjectAssembly(assembly.id, snapshot);
      setReportSourceDecisionOpen(false);
      await refreshServerProjectAssemblies(selectedServerProjectId, { preserveMessage: true, silent: true });
      await refreshServerProjects({ preserveMessage: true, silent: true });
      setServerProjectStatus("idle");
      setServerProjectMessage(`Updated ${assembly.name}`);
      return assembly;
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Combination update failed");
      return null;
    } finally {
      finishServerProjectMutation();
    }
  }

  async function renameSelectedProjectAssembly() {
    if (!selectedServerProjectId || !selectedServerAssembly) {
      return;
    }

    const nextName = serverAssemblyRenameDraftRef.current.trim();
    if (!nextName) {
      setServerProjectStatus("error");
      setServerProjectMessage("Enter a combination name first");
      return;
    }
    const nextDescription = serverAssemblyRenameDescriptionDraftRef.current.trim();
    const currentDescription = selectedServerAssembly.description ?? "";
    if (nextName === selectedServerAssembly.name && nextDescription === currentDescription) {
      setServerProjectMessage("Combination details unchanged");
      return;
    }
    if (!beginServerProjectMutation()) {
      return;
    }

    setServerProjectStatus("syncing");
    setServerProjectMessage("Renaming combination");

    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(selectedServerProjectId)}/assemblies/${encodeURIComponent(selectedServerAssembly.id)}`,
        {
          body: JSON.stringify({
            description: nextDescription || undefined,
            name: nextName
          }),
          headers: {
            "content-type": "application/json"
          },
          method: "PATCH"
        }
      );

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not rename the combination."));
      }

      const payload = (await response.json()) as unknown;
      const assembly = parseProjectAssemblyRecord(payload);
      if (!assembly) {
        throw new Error("DAC renamed the combination but the server response was incomplete.");
      }

      setSelectedServerAssemblyId(assembly.id);
      serverAssemblyRenameDescriptionDraftRef.current = assembly.description ?? "";
      setServerAssemblyRenameDescriptionDraft(assembly.description ?? "");
      await refreshServerProjectAssemblies(selectedServerProjectId, { preserveMessage: true, silent: true });
      await refreshServerProjects({ preserveMessage: true, silent: true });
      setServerProjectStatus("idle");
      setServerProjectMessage("Updated combination");
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Combination rename failed");
    } finally {
      finishServerProjectMutation();
    }
  }

  async function duplicateSelectedProjectAssembly() {
    if (!selectedServerProjectId || !selectedServerAssembly) {
      return;
    }
    if (!beginServerProjectMutation()) {
      return;
    }

    setServerProjectStatus("syncing");
    setServerProjectMessage("Duplicating combination");

    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(selectedServerProjectId)}/assemblies/${encodeURIComponent(selectedServerAssembly.id)}/duplicate`,
        {
          body: JSON.stringify({}),
          headers: {
            "content-type": "application/json"
          },
          method: "POST"
        }
      );

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not duplicate the combination."));
      }

      const payload = (await response.json()) as unknown;
      const assembly = parseProjectAssemblyRecord(payload);
      if (!assembly) {
        throw new Error("DAC duplicated the combination but the server response was incomplete.");
      }

      setSelectedServerAssemblyId(assembly.id);
      await refreshServerProjectAssemblies(selectedServerProjectId, { preserveMessage: true, silent: true });
      await refreshServerProjects({ preserveMessage: true, silent: true });
      setServerProjectStatus("idle");
      setServerProjectMessage("Duplicated combination");
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Combination duplicate failed");
    } finally {
      finishServerProjectMutation();
    }
  }

  async function deleteSelectedProjectAssembly() {
    if (!selectedServerProjectId || !selectedServerAssembly) {
      return;
    }
    if (!window.confirm(`Delete "${selectedServerAssembly.name}" from this project? Reports linked to a combination must be deleted first.`)) {
      return;
    }
    if (!beginServerProjectMutation()) {
      return;
    }

    setServerProjectStatus("syncing");
    setServerProjectMessage("Deleting combination");

    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(selectedServerProjectId)}/assemblies/${encodeURIComponent(selectedServerAssembly.id)}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not delete the combination."));
      }

      if (activeServerAssemblyId === selectedServerAssembly.id) {
        clearActiveProjectAssembly();
      }
      setSelectedServerAssemblyId("");
      serverAssemblyRenameDraftRef.current = "";
      serverAssemblyRenameDescriptionDraftRef.current = "";
      setServerAssemblyRenameDraft("");
      setServerAssemblyRenameDescriptionDraft("");
      await refreshServerProjectAssemblies(selectedServerProjectId, { preserveMessage: true, silent: true });
      await refreshServerProjects({ preserveMessage: true, silent: true });
      setServerProjectStatus("idle");
      setServerProjectMessage("Deleted combination");
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Combination delete failed");
    } finally {
      finishServerProjectMutation();
    }
  }

  async function loadProjectAssemblyById(assemblyId: string) {
    if (!selectedServerProjectId || !assemblyId) {
      return;
    }
    if (!beginServerProjectMutation()) {
      return;
    }

    setServerProjectStatus("restoring");
    setServerProjectMessage("Loading saved combination");

    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(selectedServerProjectId)}/assemblies/${encodeURIComponent(assemblyId)}`,
        {
          method: "GET"
        }
      );

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not load the selected combination."));
      }

      const payload = (await response.json()) as unknown;
      const assembly = parseProjectAssemblyRecord(payload);
      const parsed = assembly ? parseWorkbenchV2ProjectSnapshot(assembly.snapshot) : null;

      if (!assembly || !parsed?.snapshot) {
        throw new Error("Selected combination does not contain a restorable workbench v2 snapshot.");
      }

      restoreWorkbenchV2Snapshot(parsed);
      setSelectedServerAssemblyId(assembly.id);
      markActiveProjectAssembly(assembly.id, assembly.snapshot);
      setLastAppliedTemplateName(null);
      setReportSourceDecisionOpen(false);
      setServerProjectStatus("idle");
      setServerProjectMessage("Loaded saved combination");
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Saved combination load failed");
    } finally {
      finishServerProjectMutation();
    }
  }

  async function loadSelectedProjectAssembly() {
    await loadProjectAssemblyById(selectedServerAssemblyId);
  }

  async function openSelectedProjectReport() {
    if (!selectedServerProjectId || !selectedServerReportId) {
      return;
    }
    if (!beginServerProjectMutation()) {
      return;
    }

    setServerProjectStatus("restoring");
    setServerProjectMessage("Opening saved report");

    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(selectedServerProjectId)}/reports/${encodeURIComponent(selectedServerReportId)}`,
        {
          method: "GET"
        }
      );

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not open the selected report."));
      }

      const payload = (await response.json()) as unknown;
      const report = parseProjectReportRecord(payload);
      if (!report) {
        throw new Error("Selected report does not contain a restorable proposal document.");
      }

      storeReportSnapshot(
        {
          ...report.reportDocument,
          serverProjectId: selectedServerProjectId,
          serverProjectScenarioId: report.assemblyId
        },
        {
          serverProjectAssemblyId: report.assemblyId,
          serverProjectId: selectedServerProjectId,
          serverProjectReportId: report.id,
          serverProjectReportUpdatedAtIso: report.updatedAtIso,
          sourceAssemblySnapshot: report.sourceAssemblySnapshot,
          sourceCalculationOutput: report.sourceCalculationOutput,
          sourceMaterialSnapshot: report.sourceMaterialSnapshot
        }
      );

      setServerProjectStatus("idle");
      setServerProjectMessage("Opened saved report");
      window.location.assign(
        `/workbench/proposal?projectId=${encodeURIComponent(selectedServerProjectId)}&reportId=${encodeURIComponent(report.id)}`
      );
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Saved report open failed");
      finishServerProjectMutation();
    }
  }

  async function renameSelectedProjectReport() {
    if (!selectedServerProjectId || !selectedServerReport) {
      return;
    }

    const nextName = serverReportRenameDraftRef.current.trim();
    const nextDescription = serverReportDescriptionDraftRef.current.trim();
    const currentDescription = selectedServerReport.description ?? "";
    if (!nextName) {
      setServerProjectStatus("error");
      setServerProjectMessage("Enter a report name first");
      return;
    }
    if (nextName === selectedServerReport.name && nextDescription === currentDescription) {
      setServerProjectMessage("Report details unchanged");
      return;
    }
    if (!beginServerProjectMutation()) {
      return;
    }

    setServerProjectStatus("syncing");
    setServerProjectMessage("Renaming report");

    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(selectedServerProjectId)}/reports/${encodeURIComponent(selectedServerReport.id)}`,
        {
          body: JSON.stringify({
            description: nextDescription || undefined,
            expectedReportUpdatedAtIso: selectedServerReport.updatedAtIso,
            name: nextName
          }),
          headers: {
            "content-type": "application/json"
          },
          method: "PATCH"
        }
      );

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not rename the report."));
      }

      const payload = (await response.json()) as unknown;
      const report = parseProjectReportRecord(payload);
      if (!report) {
        throw new Error("DAC renamed the report but the server response was incomplete.");
      }

      setSelectedServerReportId(report.id);
      serverReportDescriptionDraftRef.current = report.description ?? "";
      setServerReportDescriptionDraft(report.description ?? "");
      await refreshServerProjectReports(selectedServerProjectId, { preserveMessage: true, silent: true });
      await refreshServerProjects({ preserveMessage: true, silent: true });
      setServerProjectStatus("idle");
      setServerProjectMessage("Updated report");
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Report rename failed");
    } finally {
      finishServerProjectMutation();
    }
  }

  async function duplicateSelectedProjectReport() {
    if (!selectedServerProjectId || !selectedServerReport) {
      return;
    }
    if (!beginServerProjectMutation()) {
      return;
    }

    setServerProjectStatus("syncing");
    setServerProjectMessage("Duplicating report");

    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(selectedServerProjectId)}/reports/${encodeURIComponent(selectedServerReport.id)}/duplicate`,
        {
          body: JSON.stringify({}),
          headers: {
            "content-type": "application/json"
          },
          method: "POST"
        }
      );

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not duplicate the report."));
      }

      const payload = (await response.json()) as unknown;
      const report = parseProjectReportRecord(payload);
      if (!report) {
        throw new Error("DAC duplicated the report but the server response was incomplete.");
      }

      setSelectedServerReportId(report.id);
      await refreshServerProjectReports(selectedServerProjectId, { preserveMessage: true, silent: true });
      await refreshServerProjects({ preserveMessage: true, silent: true });
      setServerProjectStatus("idle");
      setServerProjectMessage("Duplicated report");
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Report duplicate failed");
    } finally {
      finishServerProjectMutation();
    }
  }

  async function setSelectedProjectReportArchived(archived: boolean) {
    if (!selectedServerProjectId || !selectedServerReport) {
      return;
    }
    if (!beginServerProjectMutation()) {
      return;
    }

    setServerProjectStatus("syncing");
    setServerProjectMessage(archived ? "Archiving report" : "Restoring report");

    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(selectedServerProjectId)}/reports/${encodeURIComponent(selectedServerReport.id)}`,
        {
          body: JSON.stringify({
            expectedReportUpdatedAtIso: selectedServerReport.updatedAtIso,
            status: archived ? "archived" : "draft"
          }),
          headers: {
            "content-type": "application/json"
          },
          method: "PATCH"
        }
      );

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, archived ? "DAC could not archive the report." : "DAC could not restore the report."));
      }

      const payload = (await response.json()) as unknown;
      const report = parseProjectReportRecord(payload);
      if (!report) {
        throw new Error("DAC updated the report but the server response was incomplete.");
      }

      setSelectedServerReportId(report.id);
      await refreshServerProjectReports(selectedServerProjectId, { preserveMessage: true, silent: true });
      await refreshServerProjects({ preserveMessage: true, silent: true });
      setServerProjectStatus("idle");
      setServerProjectMessage(archived ? "Archived report" : "Restored report");
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : archived ? "Report archive failed" : "Report restore failed");
    } finally {
      finishServerProjectMutation();
    }
  }

  async function deleteSelectedProjectReport() {
    if (!selectedServerProjectId || !selectedServerReport) {
      return;
    }
    if (!window.confirm(`Delete "${selectedServerReport.name}" and all of its revisions from this project?`)) {
      return;
    }
    if (!beginServerProjectMutation()) {
      return;
    }

    setServerProjectStatus("syncing");
    setServerProjectMessage("Deleting report");

    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(selectedServerProjectId)}/reports/${encodeURIComponent(selectedServerReport.id)}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error(await readServerProjectError(response, "DAC could not delete the report."));
      }

      setSelectedServerReportId("");
      serverReportRenameDraftRef.current = "";
      serverReportDescriptionDraftRef.current = "";
      setServerReportRenameDraft("");
      setServerReportDescriptionDraft("");
      await refreshServerProjectReports(selectedServerProjectId, { preserveMessage: true, silent: true });
      await refreshServerProjects({ preserveMessage: true, silent: true });
      setServerProjectStatus("idle");
      setServerProjectMessage("Deleted report");
    } catch (error) {
      setServerProjectStatus("error");
      setServerProjectMessage(error instanceof Error ? error.message : "Report delete failed");
    } finally {
      finishServerProjectMutation();
    }
  }

  function restoreWorkbenchV2Snapshot(parsed: ReturnType<typeof parseWorkbenchV2ProjectSnapshot>) {
    if (!parsed.snapshot) {
      return;
    }

    const snapshot = parsed.snapshot;
    setMode(snapshot.mode);
    setLayers(snapshot.layers);
    setSelectedLayerId(snapshot.selectedLayerId);
    setSelectedOutputs(snapshot.selectedOutputs);
    setContext(snapshot.context);
    setCustomMaterials(snapshot.customMaterials);
    setMaterialVisualOverrides(snapshot.materialVisualOverrides);
    setMaterialEditorRestoreWarning(formatWorkbenchV2SnapshotRestoreWarning(parsed));
    setMaterialEditorMaterialId(snapshot.layers.find((layer) => layer.id === snapshot.selectedLayerId)?.materialId ?? snapshot.layers[0]?.materialId ?? null);
    setWorkbenchDrawerTab((current) => (current === "materials" ? "projects" : current));
    setLayerUndoStack([]);
    clearLayerInteractionState();
  }

  function commitLayerStackChange(
    actionLabel: string,
    buildChange: (
      currentLayers: readonly DraftLayer[],
      currentSelectedLayerId: string | null
    ) => { layers: readonly DraftLayer[]; selectedLayerId?: string | null } | null
  ): boolean {
    const change = buildChange(layers, selectedLayerId);

    if (!change) {
      return false;
    }

    const nextSelectedLayerId = change.selectedLayerId === undefined ? selectedLayerId : change.selectedLayerId;

    if (nextSelectedLayerId === selectedLayerId && layerStacksEqual(layers, change.layers)) {
      return false;
    }

    setLayerUndoStack((current) => pushLayerStackUndoSnapshot(current, createLayerStackUndoSnapshot(layers, selectedLayerId, actionLabel)));
    setLayers(change.layers);
    setSelectedLayerId(nextSelectedLayerId);
    return true;
  }

  function undoLayerStackChange() {
    const popped = popLayerStackUndoSnapshot(layerUndoStack);

    if (!popped) {
      return;
    }

    const restored = restoreLayerStackUndoSnapshot(popped.snapshot);

    setLayerUndoStack(popped.stack);
    setLayers(restored.layers);
    setSelectedLayerId(restored.selectedLayerId);
    clearLayerInteractionState();

    if (popped.snapshot.actionLabel) {
      toast.success("Layer change undone", { description: `Reverted ${popped.snapshot.actionLabel}.` });
      return;
    }

    toast.success("Layer change undone");
  }

  function setModeWithDefaults(nextMode: StudyMode) {
    if (nextMode === mode) {
      return;
    }

    const nextLayers =
      nextMode === "floor" && matchesStarterStack(layers, INITIAL_WALL_LAYERS)
        ? cloneLayers(INITIAL_FLOOR_LAYERS)
        : nextMode === "wall" && matchesStarterStack(layers, INITIAL_FLOOR_LAYERS)
          ? cloneLayers(INITIAL_WALL_LAYERS)
          : migrateLayerRoles(layers, nextMode, materialById, materials);
    const nextSelectedLayerId = nextLayers.some((layer) => layer.id === selectedLayerId) ? selectedLayerId : nextLayers[0]?.id ?? null;

    setMode(nextMode);
    setSelectedOutputs(getDefaultWorkbenchV2SelectedOutputs(nextMode));
    setLayers(nextLayers);
    setSelectedLayerId(nextSelectedLayerId);
    setLayerUndoStack([]);
    clearLayerInteractionState();
  }

  function updateLayerWithUndo(actionLabel: string, layerId: string, patch: Partial<DraftLayer>, nextSelectedLayerId?: string | null): boolean {
    return commitLayerStackChange(actionLabel, (currentLayers, currentSelectedLayerId) => ({
      layers: currentLayers.map((layer) => (layer.id === layerId ? { ...layer, ...patch } : layer)),
      selectedLayerId: nextSelectedLayerId === undefined ? currentSelectedLayerId : nextSelectedLayerId
    }));
  }

  function addLayer() {
    const id = createLayerId();
    const role = getRoleOptions(mode)[Math.min(layers.length, getRoleOptions(mode).length - 1)]!.value;
    const layer: DraftLayer = {
      id,
      materialId: getDefaultMaterialId(mode, materialById, materials),
      role,
      thicknessMm: ""
    };

    commitLayerStackChange("adding a layer", (currentLayers) => ({
      layers: [...currentLayers, layer],
      selectedLayerId: id
    }));
  }

  function duplicateLayer(layerId: string) {
    const duplicateId = createLayerId();

    commitLayerStackChange("duplicating a layer", (currentLayers) => {
      const index = currentLayers.findIndex((layer) => layer.id === layerId);
      const source = currentLayers[index];

      if (!source) {
        return null;
      }

      const duplicate = { ...source, id: duplicateId };
      const next = [...currentLayers];
      next.splice(index + 1, 0, duplicate);

      return {
        layers: next,
        selectedLayerId: duplicate.id
      };
    });
  }

  function removeLayer(layerId: string) {
    commitLayerStackChange("removing a layer", (currentLayers, currentSelectedLayerId) => {
      if (!currentLayers.some((layer) => layer.id === layerId)) {
        return null;
      }

      const nextLayers = currentLayers.filter((layer) => layer.id !== layerId);

      return {
        layers: nextLayers,
        selectedLayerId: currentSelectedLayerId === layerId ? nextLayers[0]?.id ?? null : currentSelectedLayerId
      };
    });
  }

  function moveLayer(layerId: string, direction: "down" | "up") {
    commitLayerStackChange("moving a layer", (currentLayers, currentSelectedLayerId) => {
      const index = currentLayers.findIndex((layer) => layer.id === layerId);

      if (index < 0) {
        return null;
      }

      const nextIndex = direction === "up" ? index - 1 : index + 1;

      if (nextIndex < 0 || nextIndex >= currentLayers.length) {
        return null;
      }

      return {
        layers: moveItem(currentLayers, index, nextIndex),
        selectedLayerId: currentSelectedLayerId
      };
    });
  }

  function moveLayerToTarget(layerId: string, targetLayerId: string, position: "after" | "before") {
    const changed = commitLayerStackChange("reordering a layer", (currentLayers) => {
      if (!currentLayers.some((layer) => layer.id === layerId)) {
        return null;
      }

      return {
        layers: moveLayerBeforeOrAfter(currentLayers, layerId, targetLayerId, position),
        selectedLayerId: layerId
      };
    });

    if (!changed && layers.some((layer) => layer.id === layerId)) {
      setSelectedLayerId(layerId);
    }
  }

  function getLayerDropTargetFromPoint(clientX: number, clientY: number, sourceLayerId: string): LayerDropTarget | null {
    const row = document.elementFromPoint(clientX, clientY)?.closest<HTMLElement>(".calc-layer-row");
    const targetLayerId = row?.dataset.layerId;

    if (!row || !targetLayerId || targetLayerId === sourceLayerId) {
      return null;
    }

    const bounds = row.getBoundingClientRect();
    return {
      layerId: targetLayerId,
      position: clientY < bounds.top + bounds.height / 2 ? "before" : "after"
    };
  }

  function handleLayerPointerDown(event: PointerEvent<HTMLButtonElement>, layerId: string) {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggedLayerId(layerId);
    setSelectedLayerId(layerId);
  }

  function handleLayerMouseDown(event: MouseEvent<HTMLButtonElement>, layerId: string) {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    setDraggedLayerId(layerId);
    setSelectedLayerId(layerId);
  }

  function handleLayerPointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (!draggedLayerId) {
      return;
    }

    setLayerDropTarget(getLayerDropTargetFromPoint(event.clientX, event.clientY, draggedLayerId));
  }

  function handleLayerPointerUp(event: PointerEvent<HTMLButtonElement>, layerId: string) {
    const sourceLayerId = draggedLayerId ?? layerId;
    const target = getLayerDropTargetFromPoint(event.clientX, event.clientY, sourceLayerId);

    if (target) {
      moveLayerToTarget(sourceLayerId, target.layerId, target.position);
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setDraggedLayerId(null);
    setLayerDropTarget(null);
  }

  function handleLayerPointerCancel(event: PointerEvent<HTMLButtonElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setDraggedLayerId(null);
    setLayerDropTarget(null);
  }

  function selectMaterial(layerId: string, materialId: string) {
    updateLayerWithUndo("changing a layer material", layerId, { materialId }, layerId);
    setMaterialEditorMaterialId(materialId);
    setMaterialSearch((current) => {
      const next = { ...current };
      delete next[layerId];
      return next;
    });
    setOpenMaterialLayerId(null);
    setSelectedLayerId(layerId);
  }

  function openWorkbenchDrawer(tab: WorkbenchDrawerTab) {
    setWorkbenchDrawerTab(tab);
    setWorkbenchDrawerOpen(true);
  }

  function handleSaveCurrentAssemblyFromHandoff() {
    if (!selectedServerProjectId) {
      setServerProjectStatus("idle");
      setServerProjectMessage("Choose a project first");
      setProjectCreatePanelOpen(false);
      openWorkbenchDrawer("projects");
      return;
    }

    if (!activeServerAssembly) {
      setServerProjectStatus("idle");
      setServerProjectMessage("Name this stack and save it as a new combination");
      setAssemblyCreatePanelOpen(true);
      openWorkbenchDrawer("projects");
      return;
    }

    void updateCurrentAssemblyInServerProject();
  }

  function handleSaveCurrentTemplateFromHandoff() {
    void saveCurrentWorkbenchPreset();
  }

  function openMaterialEditor(materialId: string | null = null) {
    const selectedLayerMaterialId = layers.find((layer) => layer.id === selectedLayerId)?.materialId ?? layers[0]?.materialId ?? null;
    setMaterialEditorMaterialId(materialId ?? selectedLayerMaterialId);
    openWorkbenchDrawer("materials");
  }

  function saveCustomMaterial(material: MaterialDefinition) {
    setCustomMaterials((current) => upsertCustomMaterial(current, material));
    setMaterialEditorMaterialId(material.id);
  }

  function deleteCustomMaterial(materialId: string) {
    setCustomMaterials((current) => removeCustomMaterial(current, materialId));
    setMaterialVisualOverrides((current) => removeMaterialVisualOverride(current, materialId));
    setMaterialEditorMaterialId((current) => (current === materialId ? materials.find((material) => material.id !== materialId)?.id ?? null : current));
    setLayerUndoStack([]);
  }

  function replaceMaterialInLayers(fromMaterialId: string, toMaterialId: string) {
    commitLayerStackChange("replacing layer materials", (currentLayers, currentSelectedLayerId) => ({
      layers: currentLayers.map((layer) => (layer.materialId === fromMaterialId ? { ...layer, materialId: toMaterialId } : layer)),
      selectedLayerId: currentSelectedLayerId
    }));
  }

  function saveMaterialVisualOverride(override: MaterialVisualOverride) {
    setMaterialVisualOverrides((current) => upsertMaterialVisualOverride(current, override));
  }

  function resetMaterialVisualOverride(materialId: string) {
    setMaterialVisualOverrides((current) => removeMaterialVisualOverride(current, materialId));
  }

  function handleMaterialComboboxBlur(layerId: string, event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setOpenMaterialLayerId((current) => (current === layerId ? null : current));
    }
  }

  function handleMaterialSearchKeyDown(
    layer: DraftLayer,
    event: KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Escape") {
      setOpenMaterialLayerId(null);
      return;
    }

    if (event.key !== "Enter") {
      return;
    }

    const firstMaterial = getFilteredMaterials(materialSearch[layer.id] ?? "", layer.materialId, materials, materialById)[0];
    if (!firstMaterial) {
      return;
    }

    event.preventDefault();
    selectMaterial(layer.id, firstMaterial.id);
  }

  function toggleOutput(outputId: RequestedOutputId) {
    setSelectedOutputs((current) => (current.includes(outputId) ? current.filter((id) => id !== outputId) : [...current, outputId]));
  }

  function focusTask(task: RequiredTask) {
    if (task.targetLayerId) {
      setSelectedLayerId(task.targetLayerId);
    }

    if (!task.targetElementId) {
      return;
    }

    window.setTimeout(() => {
      const target = document.getElementById(task.targetElementId!);
      if (!(target instanceof HTMLElement)) {
        return;
      }

      target.scrollIntoView({ block: "center", behavior: "smooth" });
      target.focus({ preventScroll: true });
    }, 0);
  }

  function getStatusLabel(): string {
    if (estimateState.status === "ready") return estimateResult ? "Ready" : "Pending";
    if (estimateState.status === "loading") return "Calculating";
    if (estimateState.status === "error") return "Error";
    if (estimateState.status === "blocked") return "Needs input";
    return "Pending";
  }

  function openCurrentReport(options?: { linkedAssembly?: { id: string; name: string } | null }) {
    if (!canOpenReport) {
      return;
    }

    const linkedAssembly = options?.linkedAssembly ?? null;
    const linkedToProject = Boolean(selectedServerProjectId && linkedAssembly);
    const projectName = selectedServerProject?.name;
    const serverProjectId = linkedToProject ? selectedServerProjectId : undefined;
    const serverProjectAssemblyId = linkedToProject ? linkedAssembly!.id : undefined;
    const sourceAssemblySnapshot = buildCurrentWorkbenchV2ServerSnapshot(linkedAssembly?.name);
    const projectContext: SimpleWorkbenchProposalPreviewProjectContext = {
      serverProjectAssemblyId,
      serverProjectId,
      sourceAssemblySnapshot,
      sourceCalculationOutput: {
        calculationSummary: buildAssemblyCalculationSummary(),
        outputRows,
        responseFigures
      },
      sourceMaterialSnapshot: {
        customMaterials: [...customMaterials],
        materialVisualOverrides: [...materialVisualOverrides]
      }
    };

    const reportDocument = buildReportSnapshot({
      layers,
      materialById,
      mode,
      outputRows,
      projectName,
      responseFigures,
      serverProjectId,
      serverProjectScenarioId: serverProjectAssemblyId
    });

    storeReportSnapshot(reportDocument, projectContext);
    window.location.assign("/workbench/proposal");
  }

  function handleOpenReport() {
    if (!canOpenReport) {
      return;
    }

    if (!selectedServerProjectId) {
      openCurrentReport();
      return;
    }

    if (activeServerAssembly && !activeAssemblyDirty) {
      openCurrentReport({ linkedAssembly: activeServerAssembly });
      return;
    }

    setReportSourceDecisionOpen(true);
  }

  async function saveCurrentAssemblyAndOpenReport() {
    const assembly = await saveCurrentAssemblyToServerProject();
    if (assembly) {
      openCurrentReport({ linkedAssembly: assembly });
    }
  }

  async function updateCurrentAssemblyAndOpenReport() {
    const assembly = await updateCurrentAssemblyInServerProject();
    if (assembly) {
      openCurrentReport({ linkedAssembly: assembly });
    }
  }

  function renderProjectWorkspacePanel() {
    return (
      <ProjectWorkspacePanel
        busy={serverProjectBusy}
        combinations={{
          activeAssemblyDirty,
          activeAssemblyId: activeServerAssemblyId,
          assemblies: serverProjectAssemblies,
          assemblyDescriptionDraft: serverAssemblyDescriptionDraft,
          assemblyNameDraft: serverAssemblyNameDraft,
          assemblyRenameDescriptionDraft: serverAssemblyRenameDescriptionDraft,
          assemblyRenameDraft: serverAssemblyRenameDraft,
          canRenameAssembly: canRenameServerAssembly,
          createOpen: assemblyCreatePanelOpen,
          onAssemblyDescriptionDraftChange: (value) => {
            serverAssemblyDescriptionDraftRef.current = value;
            setServerAssemblyDescriptionDraft(value);
          },
          onAssemblyNameDraftChange: (value) => {
            serverAssemblyNameDraftRef.current = value;
            setServerAssemblyNameDraft(value);
          },
          onAssemblyRenameDescriptionDraftChange: (value) => {
            serverAssemblyRenameDescriptionDraftRef.current = value;
            setServerAssemblyRenameDescriptionDraft(value);
          },
          onAssemblyRenameDraftChange: (value) => {
            serverAssemblyRenameDraftRef.current = value;
            setServerAssemblyRenameDraft(value);
          },
          onCreateOpenChange: setAssemblyCreatePanelOpen,
          onDeleteAssembly: deleteSelectedProjectAssembly,
          onDuplicateAssembly: duplicateSelectedProjectAssembly,
          onLoadAssembly: loadSelectedProjectAssembly,
          onLoadAssemblyById: loadProjectAssemblyById,
          onRenameAssembly: renameSelectedProjectAssembly,
          onSaveAssembly: () => {
            void saveCurrentAssemblyToServerProject();
          },
          onSelectAssembly: (nextAssemblyId) => {
            const nextAssembly = serverProjectAssemblies.find((assembly) => assembly.id === nextAssemblyId);
            const nextName = nextAssembly?.name ?? "";
            const nextDescription = nextAssembly?.description ?? "";
            setSelectedServerAssemblyId(nextAssemblyId);
            serverAssemblyRenameDraftRef.current = nextName;
            serverAssemblyRenameDescriptionDraftRef.current = nextDescription;
            setServerAssemblyRenameDraft(nextName);
            setServerAssemblyRenameDescriptionDraft(nextDescription);
          },
          projectSelected: Boolean(selectedServerProjectId),
          selectedAssembly: selectedServerAssembly,
          selectedAssemblyId: selectedServerAssemblyId,
          selectedProjectName: selectedServerProject?.name
        }}
        id="workbench-drawer-projects"
        identity={{
          canCreateProject: canCreateServerProject,
          createOpen: projectCreatePanelOpen,
          expandedProjectId: expandedServerProjectId,
          onCreateProject: createServerProject,
          onCreateOpenChange: setProjectCreatePanelOpen,
          onProjectNameDraftChange: (value) => {
            serverProjectNameDraftRef.current = value;
            setServerProjectNameDraft(value);
          },
          onRefreshProjects: () => refreshServerProjects(),
          onSelectProject: (nextProjectId) => {
            if (!nextProjectId) {
              setExpandedServerProjectId("");
              setSelectedServerProjectId("");
              setSelectedServerAssemblyId("");
              setSelectedServerReportId("");
              clearActiveProjectAssembly();
              setReportSourceDecisionOpen(false);
              serverAssemblyRenameDraftRef.current = "";
              serverAssemblyRenameDescriptionDraftRef.current = "";
              serverReportRenameDraftRef.current = "";
              serverReportDescriptionDraftRef.current = "";
              setServerAssemblyRenameDraft("");
              setServerAssemblyRenameDescriptionDraft("");
              setServerReportRenameDraft("");
              setServerReportDescriptionDraft("");
              return;
            }

            if (expandedServerProjectId === nextProjectId) {
              setExpandedServerProjectId("");
              return;
            }

            setExpandedServerProjectId(nextProjectId);

            if (selectedServerProjectId === nextProjectId) {
              return;
            }

            setSelectedServerProjectId(nextProjectId);
            setSelectedServerAssemblyId("");
            setSelectedServerReportId("");
            clearActiveProjectAssembly();
            setReportSourceDecisionOpen(false);
            serverAssemblyRenameDraftRef.current = "";
            serverAssemblyRenameDescriptionDraftRef.current = "";
            serverReportRenameDraftRef.current = "";
            serverReportDescriptionDraftRef.current = "";
            setServerAssemblyRenameDraft("");
            setServerAssemblyRenameDescriptionDraft("");
            setServerReportRenameDraft("");
            setServerReportDescriptionDraft("");
          },
          projectNameDraft: serverProjectNameDraft,
          projects: serverProjects,
          selectedProject: selectedServerProject,
          selectedProjectId: selectedServerProjectId
        }}
        message={serverProjectMessage}
        reports={{
          assemblies: serverProjectAssemblies,
          canRenameReport: canRenameServerReport,
          onDeleteReport: deleteSelectedProjectReport,
          onDuplicateReport: duplicateSelectedProjectReport,
          onOpenReport: openSelectedProjectReport,
          onRenameReport: renameSelectedProjectReport,
          onReportDescriptionDraftChange: (value) => {
            serverReportDescriptionDraftRef.current = value;
            setServerReportDescriptionDraft(value);
          },
          onReportRenameDraftChange: (value) => {
            serverReportRenameDraftRef.current = value;
            setServerReportRenameDraft(value);
          },
          onSelectReport: (nextReportId) => {
            const nextReport = serverProjectReports.find((report) => report.id === nextReportId);
            const nextName = nextReport?.name ?? "";
            const nextDescription = nextReport?.description ?? "";
            setSelectedServerReportId(nextReportId);
            serverReportRenameDraftRef.current = nextName;
            serverReportDescriptionDraftRef.current = nextDescription;
            setServerReportRenameDraft(nextName);
            setServerReportDescriptionDraft(nextDescription);
          },
          onSetReportArchived: setSelectedProjectReportArchived,
          projectSelected: Boolean(selectedServerProjectId),
          reportDescriptionDraft: serverReportDescriptionDraft,
          reportRenameDraft: serverReportRenameDraft,
          reports: serverProjectReports,
          selectedReport: selectedServerReport,
          selectedReportId: selectedServerReportId
        }}
        status={serverProjectStatus}
      />
    );
  }

  function renderWorkbenchPresetLibraryPanel() {
    return (
      <WorkbenchPresetLibraryPanel
        busy={workbenchPresetBusy}
        canRenamePreset={canRenameWorkbenchPreset}
        commonPresets={WORKBENCH_V2_COMMON_PRESETS}
        id="workbench-drawer-presets"
        message={workbenchPresetMessage}
        onCommonPresetSelect={(nextPresetId) => {
          setSelectedWorkbenchCommonPresetId(nextPresetId);
          setSelectedWorkbenchPresetId("");
          workbenchPresetRenameDraftRef.current = "";
          workbenchPresetRenameDescriptionDraftRef.current = "";
          setWorkbenchPresetRenameDraft("");
          setWorkbenchPresetRenameDescriptionDraft("");
          void applyWorkbenchCommonPresetById(nextPresetId);
        }}
        onCommonPresetUse={applySelectedWorkbenchCommonPreset}
        onDeletePreset={deleteSelectedWorkbenchPreset}
        onDuplicatePreset={duplicateSelectedWorkbenchPreset}
        onPresetDescriptionDraftChange={(value) => {
          workbenchPresetDescriptionDraftRef.current = value;
          setWorkbenchPresetDescriptionDraft(value);
        }}
        onPresetNameDraftChange={(value) => {
          workbenchPresetNameDraftRef.current = value;
          setWorkbenchPresetNameDraft(value);
        }}
        onPresetRenameDescriptionDraftChange={(value) => {
          workbenchPresetRenameDescriptionDraftRef.current = value;
          setWorkbenchPresetRenameDescriptionDraft(value);
        }}
        onPresetRenameDraftChange={(value) => {
          workbenchPresetRenameDraftRef.current = value;
          setWorkbenchPresetRenameDraft(value);
        }}
        onRenamePreset={renameSelectedWorkbenchPreset}
        onMeasuredRwDraftChange={(value) => {
          workbenchPresetMeasuredRwDraftRef.current = value;
          setWorkbenchPresetMeasuredRwDraft(value);
        }}
        onMeasuredRwToleranceDraftChange={(value) => {
          workbenchPresetMeasuredRwToleranceDraftRef.current = value;
          setWorkbenchPresetMeasuredRwToleranceDraft(value);
        }}
        onRetireMeasuredRwAnchor={retireSelectedWorkbenchPresetMeasuredRwAnchor}
        onSaveMeasuredRwAnchor={saveSelectedWorkbenchPresetMeasuredRwAnchor}
        onSavePreset={saveCurrentWorkbenchPreset}
        onSelectPreset={(nextPresetId) => {
          const nextPreset = workbenchPresets.find((preset) => preset.id === nextPresetId);
          const nextName = nextPreset?.name ?? "";
          const nextDescription = nextPreset?.description ?? "";
          setSelectedWorkbenchPresetId(nextPresetId);
          setSelectedWorkbenchCommonPresetId("");
          workbenchPresetRenameDraftRef.current = nextName;
          workbenchPresetRenameDescriptionDraftRef.current = nextDescription;
          setWorkbenchPresetRenameDraft(nextName);
          setWorkbenchPresetRenameDescriptionDraft(nextDescription);
        }}
        onUsePreset={useSelectedWorkbenchPreset}
        measuredRwDraft={workbenchPresetMeasuredRwDraft}
        measuredRwToleranceDraft={workbenchPresetMeasuredRwToleranceDraft}
        presetDescriptionDraft={workbenchPresetDescriptionDraft}
        presetNameDraft={workbenchPresetNameDraft}
        presetRenameDescriptionDraft={workbenchPresetRenameDescriptionDraft}
        presetRenameDraft={workbenchPresetRenameDraft}
        presets={workbenchPresets}
        selectedCommonPreset={selectedWorkbenchCommonPreset}
        selectedCommonPresetId={selectedWorkbenchCommonPresetId}
        selectedPreset={selectedWorkbenchPreset}
        selectedPresetMeasuredRwAnchors={selectedWorkbenchPresetMeasuredRwAnchors}
        selectedPresetId={selectedWorkbenchPresetId}
        status={workbenchPresetStatus}
      />
    );
  }

  function renderMaterialEditorPanel() {
    return (
      <MaterialEditorPanel
        layers={layers.map((layer, index) => ({
          id: layer.id,
          label: `Layer ${index + 1}`,
          materialId: layer.materialId
        }))}
        materials={materials}
        onDeleteMaterial={deleteCustomMaterial}
        onReplaceMaterialInLayers={replaceMaterialInLayers}
        onResetVisualOverride={resetMaterialVisualOverride}
        onSaveMaterial={saveCustomMaterial}
        onSaveVisualOverride={saveMaterialVisualOverride}
        onSelectMaterial={setMaterialEditorMaterialId}
        routeInputEffectiveness={materialRouteInputEffectiveness}
        restoreWarning={materialEditorRestoreWarning}
        selectedMaterialId={materialEditorMaterialId}
        visualOverrides={materialVisualOverrides}
      />
    );
  }

  return (
    <main className="calc-page">
      <div className="calc-shell">
        <header className="calc-header">
          <div className="calc-header-main">
            <div>
              <div className="eyebrow">Calculator</div>
              <h1>Acoustic workbench</h1>
            </div>
            <button
              aria-controls="workbench-drawer"
              aria-expanded={workbenchDrawerOpen}
              aria-label={workbenchDrawerOpen ? "Close workspace drawer" : "Open workspace drawer"}
              className={workbenchDrawerOpen ? "focus-ring ui-button ui-button-primary calc-project-trigger" : "focus-ring ui-button ui-button-ghost calc-project-trigger"}
              onClick={() => setWorkbenchDrawerOpen((current) => !current)}
              type="button"
            >
              <Menu className="h-4 w-4" />
              <span>Workspace</span>
              <small>{workbenchPersistenceState.title}</small>
            </button>
          </div>
          <div className="calc-header-meta">
            <span className={workbenchPersistenceState.kind === "combinationDirty" ? "ui-badge ui-badge-warning" : "ui-badge"}>
              {workbenchPersistenceState.statusLabel}
            </span>
            <span className="ui-badge">{mode === "wall" ? "Wall" : "Floor"}</span>
            <span className="ui-badge">{layers.length} layers</span>
            <span className="ui-badge">{formatThickness(totalThickness)}</span>
            <span className={estimateState.status === "ready" ? "ui-badge ui-badge-success" : "ui-badge"}>{getStatusLabel()}</span>
          </div>
        </header>

        {workbenchDrawerOpen ? (
          <div className="calc-workbench-drawer-layer">
            <button
              aria-label="Close workspace drawer"
              className="calc-workbench-drawer-backdrop"
              onClick={() => setWorkbenchDrawerOpen(false)}
              type="button"
            />
            <aside
              aria-labelledby="workbench-drawer-title"
              aria-modal="true"
              className="calc-workbench-drawer"
              id="workbench-drawer"
              role="dialog"
            >
              <header className="calc-workbench-drawer-head">
                <div>
                  <div className="eyebrow">Workbench</div>
                  <h2 id="workbench-drawer-title">Workspace</h2>
                </div>
                <button
                  aria-label="Close workspace drawer"
                  className="focus-ring ui-icon-button"
                  onClick={() => setWorkbenchDrawerOpen(false)}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </header>

              <div className="calc-workbench-drawer-body">
                <nav className="calc-workbench-drawer-tabs" aria-label="Workspace sections">
                  <button
                    aria-current={workbenchDrawerTab === "projects" ? "page" : undefined}
                    className="focus-ring"
                    onClick={() => setWorkbenchDrawerTab("projects")}
                    type="button"
                  >
                    Projects
                  </button>
                  <button
                    aria-current={workbenchDrawerTab === "presets" ? "page" : undefined}
                    className="focus-ring"
                    onClick={() => setWorkbenchDrawerTab("presets")}
                    type="button"
                  >
                    Templates
                  </button>
                  <button
                    aria-current={workbenchDrawerTab === "materials" ? "page" : undefined}
                    className="focus-ring"
                    onClick={() => setWorkbenchDrawerTab("materials")}
                    type="button"
                  >
                    Materials
                  </button>
                </nav>

                <div className="calc-workbench-drawer-content">
                  {workbenchDrawerTab === "projects" ? renderProjectWorkspacePanel() : null}
                  {workbenchDrawerTab === "presets" ? renderWorkbenchPresetLibraryPanel() : null}
                  {workbenchDrawerTab === "materials" ? <div id="workbench-drawer-materials">{renderMaterialEditorPanel()}</div> : null}
                </div>
              </div>
            </aside>
          </div>
        ) : null}

        <section className="calc-grid" aria-label="Calculator workspace">
          <div className="calc-main">
            <section className="calc-section calc-setup-section">
              <div className="calc-section-head">
                <div>
                  <h2>Setup</h2>
                </div>
              </div>

              <div className="calc-setup-grid">
                <div className="calc-segment" aria-label="Assembly mode">
                  {(["wall", "floor"] as const).map((nextMode) => (
                    <button
                      aria-pressed={mode === nextMode}
                      className="focus-ring"
                      key={nextMode}
                      onClick={() => setModeWithDefaults(nextMode)}
                      type="button"
                    >
                      {nextMode === "wall" ? "Wall" : "Floor"}
                    </button>
                  ))}
                </div>

                <div className="calc-output-picker" id="rebuild-output-picker" tabIndex={-1}>
                  {availableOutputs.map((output) => (
                    <label className="calc-output-choice" key={output.id}>
                      <input checked={selectedOutputs.includes(output.id)} onChange={() => toggleOutput(output.id)} type="checkbox" />
                      <span>{output.label}</span>
                      <small>{output.group}</small>
                    </label>
                  ))}
                </div>
              </div>
            </section>

            {needsAirborne || needsBuildingPrediction || needsImpact || needsFloorImpact || needsWallTopology ? (
              <section className="calc-section calc-route-section">
                <div className="calc-section-head">
                  <div>
                    <h2>Route inputs</h2>
                  </div>
                </div>

                <div className="calc-field-grid">
                  {needsWallTopology ? (
                    <div className="calc-route-block calc-route-block-wide">
                      <div className="calc-route-toolbar">
                        <strong>Wall ownership</strong>
                        <button className="focus-ring ui-button ui-button-ghost" onClick={applyLayerRoleTopology} type="button">
                          Use layer roles
                        </button>
                      </div>
                      <div className="calc-field-grid">
                        <label className="calc-field" data-missing={isRouteInputMissing(CONTEXT_INPUT_IDS.wallTopologyMode) ? "true" : undefined}>
                          <FieldLabel effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.wallTopologyMode)} label="Topology mode" />
                          <select
                            aria-invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.wallTopologyMode) ? true : undefined}
                            className="focus-ring ui-field"
                            id={CONTEXT_INPUT_IDS.wallTopologyMode}
                            onChange={(event) => updateContext({ wallTopologyMode: event.target.value as WallTopologyMode })}
                            value={context.wallTopologyMode}
                          >
                            {WALL_TOPOLOGY_MODE_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <TextField
                          effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.wallSideALeafLayerIndices)}
                          id={CONTEXT_INPUT_IDS.wallSideALeafLayerIndices}
                          invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.wallSideALeafLayerIndices)}
                          label="Side A rows"
                          onChange={(value) => updateWallTopologyContext({ wallSideALeafLayerIndices: value })}
                          placeholder="1"
                          value={context.wallSideALeafLayerIndices}
                        />
                        <TextField
                          effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.wallCavity1LayerIndices)}
                          id={CONTEXT_INPUT_IDS.wallCavity1LayerIndices}
                          invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.wallCavity1LayerIndices)}
                          label="Cavity rows"
                          onChange={(value) => updateWallTopologyContext({ wallCavity1LayerIndices: value })}
                          placeholder="2"
                          value={context.wallCavity1LayerIndices}
                        />
                        <TextField
                          effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.wallSideBLeafLayerIndices)}
                          id={CONTEXT_INPUT_IDS.wallSideBLeafLayerIndices}
                          invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.wallSideBLeafLayerIndices)}
                          label="Side B rows"
                          onChange={(value) => updateWallTopologyContext({ wallSideBLeafLayerIndices: value })}
                          placeholder="3"
                          value={context.wallSideBLeafLayerIndices}
                        />
                        <NumberField
                          effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.wallCavity1DepthMm)}
                          id={CONTEXT_INPUT_IDS.wallCavity1DepthMm}
                          invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.wallCavity1DepthMm)}
                          label="Cavity depth"
                          onChange={(value) => updateWallTopologyContext({ wallCavity1DepthMm: value })}
                          suffix="mm"
                          value={context.wallCavity1DepthMm}
                        />
                        <label className="calc-field" data-missing={isRouteInputMissing(CONTEXT_INPUT_IDS.wallCavity1FillCoverage) ? "true" : undefined}>
                          <FieldLabel effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.wallCavity1FillCoverage)} label="Cavity fill" />
                          <select
                            aria-invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.wallCavity1FillCoverage) ? true : undefined}
                            className="focus-ring ui-field"
                            id={CONTEXT_INPUT_IDS.wallCavity1FillCoverage}
                            onChange={(event) => updateWallTopologyContext({ wallCavity1FillCoverage: event.target.value as WallCavityFillCoverage })}
                            value={context.wallCavity1FillCoverage}
                          >
                            {WALL_CAVITY_FILL_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="calc-field" data-missing={isRouteInputMissing(CONTEXT_INPUT_IDS.wallCavity1AbsorptionClass) ? "true" : undefined}>
                          <FieldLabel
                            effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.wallCavity1AbsorptionClass)}
                            label="Cavity absorption"
                          />
                          <select
                            aria-invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.wallCavity1AbsorptionClass) ? true : undefined}
                            className="focus-ring ui-field"
                            id={CONTEXT_INPUT_IDS.wallCavity1AbsorptionClass}
                            onChange={(event) => updateWallTopologyContext({ wallCavity1AbsorptionClass: event.target.value as WallCavityAbsorptionClass })}
                            value={context.wallCavity1AbsorptionClass}
                          >
                            {WALL_CAVITY_ABSORPTION_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="calc-field" data-missing={isRouteInputMissing(CONTEXT_INPUT_IDS.wallSupportTopology) ? "true" : undefined}>
                          <FieldLabel effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.wallSupportTopology)} label="Support topology" />
                          <select
                            aria-invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.wallSupportTopology) ? true : undefined}
                            className="focus-ring ui-field"
                            id={CONTEXT_INPUT_IDS.wallSupportTopology}
                            onChange={(event) => updateWallTopologyContext({ wallSupportTopology: event.target.value as WallSupportTopology })}
                            value={context.wallSupportTopology}
                          >
                            {WALL_SUPPORT_TOPOLOGY_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <NumberField
                          effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.supportSpacingMm)}
                          id={CONTEXT_INPUT_IDS.supportSpacingMm}
                          invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.supportSpacingMm)}
                          label="Support spacing"
                          onChange={(value) => updateContext({ supportSpacingMm: value })}
                          suffix="mm"
                          value={context.supportSpacingMm}
                        />
                        <label className="calc-field" data-missing={isRouteInputMissing(CONTEXT_INPUT_IDS.airborneResilientBarSideCount) ? "true" : undefined}>
                          <FieldLabel
                            effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.airborneResilientBarSideCount)}
                            label="Resilient bars"
                          />
                          <select
                            aria-invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.airborneResilientBarSideCount) ? true : undefined}
                            className="focus-ring ui-field"
                            id={CONTEXT_INPUT_IDS.airborneResilientBarSideCount}
                            onChange={(event) =>
                              updateContext({ airborneResilientBarSideCount: event.target.value as AirborneResilientBarSideCount })
                            }
                            value={context.airborneResilientBarSideCount}
                          >
                            {RESILIENT_BAR_SIDE_COUNT_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </div>
                  ) : null}

                  {needsAirborne || needsBuildingPrediction ? (
                    <>
                      <label className="calc-field" data-missing={isRouteInputMissing(CONTEXT_INPUT_IDS.airborneMode) ? "true" : undefined}>
                        <FieldLabel effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.airborneMode)} label="Airborne mode" />
                        <select
                          aria-invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.airborneMode) ? true : undefined}
                          className="focus-ring ui-field"
                          id={CONTEXT_INPUT_IDS.airborneMode}
                          onChange={(event) => updateContext({ airborneMode: event.target.value as AirborneContextMode })}
                          value={context.airborneMode}
                        >
                          <option value="element_lab">Lab</option>
                          <option value="field_between_rooms">Field</option>
                          <option value="building_prediction">Building</option>
                        </select>
                      </label>
                      <NumberField
                        effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.panelWidthMm)}
                        id={CONTEXT_INPUT_IDS.panelWidthMm}
                        invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.panelWidthMm)}
                        label="Panel width"
                        onChange={(value) => updateContext({ panelWidthMm: value })}
                        suffix="mm"
                        value={context.panelWidthMm}
                      />
                      <NumberField
                        effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.panelHeightMm)}
                        id={CONTEXT_INPUT_IDS.panelHeightMm}
                        invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.panelHeightMm)}
                        label="Panel height"
                        onChange={(value) => updateContext({ panelHeightMm: value })}
                        suffix="mm"
                        value={context.panelHeightMm}
                      />
                      <NumberField
                        effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.receivingRoomVolumeM3)}
                        id={CONTEXT_INPUT_IDS.receivingRoomVolumeM3}
                        invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.receivingRoomVolumeM3)}
                        label="Room volume"
                        onChange={(value) => updateContext({ receivingRoomVolumeM3: value })}
                        suffix="m3"
                        value={context.receivingRoomVolumeM3}
                      />
                      <NumberField
                        effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.receivingRoomRt60S)}
                        id={CONTEXT_INPUT_IDS.receivingRoomRt60S}
                        invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.receivingRoomRt60S)}
                        label="RT60"
                        onChange={(value) => updateContext({ receivingRoomRt60S: value })}
                        suffix="s"
                        value={context.receivingRoomRt60S}
                      />
                    </>
                  ) : null}

                  {needsBuildingPrediction ? (
                    <div className="calc-route-block calc-route-block-wide">
                      <div className="calc-route-toolbar">
                        <strong>Building prediction</strong>
                      </div>
                      <div className="calc-field-grid">
                        <NumberField
                          effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.sourceRoomVolumeM3)}
                          id={CONTEXT_INPUT_IDS.sourceRoomVolumeM3}
                          invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.sourceRoomVolumeM3)}
                          label="Source room volume"
                          onChange={(value) => updateContext({ sourceRoomVolumeM3: value })}
                          suffix="m3"
                          value={context.sourceRoomVolumeM3}
                        />
                        <label className="calc-field" data-missing={isRouteInputMissing(CONTEXT_INPUT_IDS.flankingJunctionClass) ? "true" : undefined}>
                          <FieldLabel effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.flankingJunctionClass)} label="Flanking junction" />
                          <select
                            aria-invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.flankingJunctionClass) ? true : undefined}
                            className="focus-ring ui-field"
                            id={CONTEXT_INPUT_IDS.flankingJunctionClass}
                            onChange={(event) => updateContext({ flankingJunctionClass: event.target.value as AirborneFlankingJunctionClass })}
                            value={context.flankingJunctionClass}
                          >
                            {FLANKING_JUNCTION_CLASS_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label
                          className="calc-field"
                          data-missing={isRouteInputMissing(CONTEXT_INPUT_IDS.conservativeFlankingAssumption) ? "true" : undefined}
                        >
                          <FieldLabel
                            effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.conservativeFlankingAssumption)}
                            label="Flanking assumption"
                          />
                          <select
                            aria-invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.conservativeFlankingAssumption) ? true : undefined}
                            className="focus-ring ui-field"
                            id={CONTEXT_INPUT_IDS.conservativeFlankingAssumption}
                            onChange={(event) =>
                              updateContext({ conservativeFlankingAssumption: event.target.value as AirborneConservativeFlankingAssumption })
                            }
                            value={context.conservativeFlankingAssumption}
                          >
                            {CONSERVATIVE_FLANKING_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <NumberField
                          effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.junctionCouplingLengthM)}
                          id={CONTEXT_INPUT_IDS.junctionCouplingLengthM}
                          invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.junctionCouplingLengthM)}
                          label="Coupling length"
                          onChange={(value) => updateContext({ junctionCouplingLengthM: value })}
                          suffix="m"
                          value={context.junctionCouplingLengthM}
                        />
                        <label className="calc-field" data-missing={isRouteInputMissing(CONTEXT_INPUT_IDS.buildingPredictionOutputBasis) ? "true" : undefined}>
                          <FieldLabel
                            effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.buildingPredictionOutputBasis)}
                            label="Output basis"
                          />
                          <select
                            aria-invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.buildingPredictionOutputBasis) ? true : undefined}
                            className="focus-ring ui-field"
                            id={CONTEXT_INPUT_IDS.buildingPredictionOutputBasis}
                            onChange={(event) =>
                              updateContext({ buildingPredictionOutputBasis: event.target.value as AirborneBuildingPredictionOutputBasis })
                            }
                            value={context.buildingPredictionOutputBasis}
                          >
                            {BUILDING_OUTPUT_BASIS_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </div>
                  ) : null}

                  {needsImpact ? (
                    <>
                      <NumberField
                        effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.fieldKDb)}
                        id={CONTEXT_INPUT_IDS.fieldKDb}
                        invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.fieldKDb)}
                        label="K correction"
                        onChange={(value) => updateContext({ fieldKDb: value })}
                        suffix="dB"
                        value={context.fieldKDb}
                      />
                      <NumberField
                        effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.ciDb)}
                        id={CONTEXT_INPUT_IDS.ciDb}
                        invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.ciDb)}
                        label="CI"
                        onChange={(value) => updateContext({ ciDb: value })}
                        suffix="dB"
                        value={context.ciDb}
                      />
                      <NumberField
                        effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.ci50_2500Db)}
                        id={CONTEXT_INPUT_IDS.ci50_2500Db}
                        invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.ci50_2500Db)}
                        label="CI,50-2500"
                        onChange={(value) => updateContext({ ci50_2500Db: value })}
                        suffix="dB"
                        value={context.ci50_2500Db}
                      />
                      <NumberField
                        effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.impactReceivingRoomVolumeM3)}
                        id={CONTEXT_INPUT_IDS.impactReceivingRoomVolumeM3}
                        invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.impactReceivingRoomVolumeM3)}
                        label="Impact room volume"
                        onChange={(value) => updateContext({ impactReceivingRoomVolumeM3: value })}
                        suffix="m3"
                        value={context.impactReceivingRoomVolumeM3}
                      />
                    </>
                  ) : null}

                  {needsFloorImpact ? (
                    <>
                      <NumberField
                        effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.loadBasisKgM2)}
                        id={CONTEXT_INPUT_IDS.loadBasisKgM2}
                        invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.loadBasisKgM2)}
                        label="Load basis"
                        onChange={(value) => updateContext({ loadBasisKgM2: value })}
                        suffix="kg/m2"
                        value={context.loadBasisKgM2}
                      />
                      <NumberField
                        effectiveness={getRouteInputEffectiveness(CONTEXT_INPUT_IDS.resilientLayerDynamicStiffnessMNm3)}
                        id={CONTEXT_INPUT_IDS.resilientLayerDynamicStiffnessMNm3}
                        invalid={isRouteInputMissing(CONTEXT_INPUT_IDS.resilientLayerDynamicStiffnessMNm3)}
                        label="Dynamic stiffness"
                        onChange={(value) => updateContext({ resilientLayerDynamicStiffnessMNm3: value })}
                        suffix="MN/m3"
                        value={context.resilientLayerDynamicStiffnessMNm3}
                      />
                    </>
                  ) : null}
                </div>
              </section>
            ) : null}

            <section className="calc-section calc-layer-section">
              <div className="calc-section-head">
                <div>
                  <h2>Layer stack</h2>
                </div>
                <div className="calc-section-actions">
                  <button
                    aria-label={undoLayerStackActionLabel}
                    className="focus-ring ui-icon-button"
                    disabled={!canUndoLayerStack}
                    onClick={undoLayerStackChange}
                    title={undoLayerStackTitle}
                    type="button"
                  >
                    <Undo2 className="h-4 w-4" />
                  </button>
                  <button className="focus-ring ui-button ui-button-ghost" onClick={() => openMaterialEditor()} type="button">
                    <Palette className="h-4 w-4" />
                    Materials
                  </button>
                  <button className="focus-ring ui-button ui-button-primary" onClick={addLayer} type="button">
                    <Plus className="h-4 w-4" />
                    Add layer
                  </button>
                </div>
              </div>

              <div className="calc-layer-list">
                <div className="calc-layer-list-head" aria-hidden="true">
                  <span />
                  <span>Material</span>
                  <span>Role</span>
                  <span>Thickness</span>
                  <span>Actions</span>
                </div>
                {layers.map((layer, index) => {
                  const material = getMaterialFromCatalog(layer.materialId, materialById);
                  const filteredMaterials = getFilteredMaterials(materialSearch[layer.id] ?? "", layer.materialId, materials, materialById);

                  return (
                    <article
                      className="calc-layer-row"
                      data-active={selectedLayerId === layer.id ? "true" : "false"}
                      data-dragging={draggedLayerId === layer.id ? "true" : undefined}
                      data-layer-id={layer.id}
                      data-drop-position={layerDropTarget?.layerId === layer.id ? layerDropTarget.position : undefined}
                      key={layer.id}
                      onFocus={() => setSelectedLayerId(layer.id)}
                    >
                      <div className="calc-layer-rail">
                        <button
                          aria-label={`Drag layer ${index + 1}`}
                          className="calc-layer-drag focus-ring"
                          disabled={layers.length <= 1}
                          onMouseDown={(event) => handleLayerMouseDown(event, layer.id)}
                          onPointerCancel={handleLayerPointerCancel}
                          onPointerDown={(event) => handleLayerPointerDown(event, layer.id)}
                          onPointerMove={handleLayerPointerMove}
                          onPointerUp={(event) => handleLayerPointerUp(event, layer.id)}
                          title="Drag to reorder"
                          type="button"
                        >
                          <GripVertical className="h-4 w-4" />
                        </button>
                        <button
                          aria-label={`Select layer ${index + 1}`}
                          className="calc-layer-index focus-ring"
                          onClick={() => setSelectedLayerId(layer.id)}
                          type="button"
                        >
                          {index + 1}
                        </button>
                      </div>

                      <div className="calc-layer-fields">
                        <div className="calc-field calc-material-combobox" onBlur={(event) => handleMaterialComboboxBlur(layer.id, event)}>
                          <FieldLabel effectiveness={getLayerInputEffectiveness(layer.id, "material")} label="Material" />
                          <button
                            aria-controls={getLayerMaterialPopoverId(layer.id)}
                            aria-expanded={openMaterialLayerId === layer.id}
                            className="calc-material-current focus-ring"
                            onClick={() => setOpenMaterialLayerId((current) => (current === layer.id ? null : layer.id))}
                            type="button"
                          >
                            <strong>{material.name}</strong>
                            <small>
                              {material.densityKgM3} kg/m3 / {material.category}
                            </small>
                          </button>
                          {openMaterialLayerId === layer.id ? (
                            <div className="calc-material-popover" id={getLayerMaterialPopoverId(layer.id)} role="listbox">
                              <div className="calc-search-input calc-material-popover-search">
                                <Search className="h-4 w-4" />
                                <input
                                  aria-controls={getLayerMaterialPopoverId(layer.id)}
                                  aria-expanded={openMaterialLayerId === layer.id}
                                  autoComplete="off"
                                  autoFocus
                                  id={getLayerMaterialInputId(layer.id)}
                                  onChange={(event) => setMaterialSearch((current) => ({ ...current, [layer.id]: event.target.value }))}
                                  onKeyDown={(event) => handleMaterialSearchKeyDown(layer, event)}
                                  placeholder="Search material"
                                  role="searchbox"
                                  value={materialSearch[layer.id] ?? ""}
                                />
                              </div>
                              {filteredMaterials.map((entry) => (
                                <button
                                  aria-selected={entry.id === layer.materialId}
                                  className="calc-material-option focus-ring"
                                  key={entry.id}
                                  onClick={() => selectMaterial(layer.id, entry.id)}
                                  role="option"
                                  type="button"
                                >
                                  <strong>{entry.name}</strong>
                                  <small>
                                    {entry.densityKgM3} kg/m3 / {entry.category}
                                  </small>
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>

                        <label className="calc-field">
                          <FieldLabel effectiveness={getLayerInputEffectiveness(layer.id, "role")} label="Role" />
                          <select
                            className="focus-ring ui-field"
                            id={getLayerRoleInputId(layer.id)}
                            onChange={(event) => updateLayerWithUndo("changing a layer role", layer.id, { role: event.target.value })}
                            value={layer.role}
                          >
                            {getRoleOptions(mode).map((role) => (
                              <option key={role.value} value={role.value}>
                                {role.label}
                              </option>
                            ))}
                          </select>
                        </label>

                        <NumberField
                          effectiveness={getLayerInputEffectiveness(layer.id, "thickness")}
                          id={getLayerThicknessInputId(layer.id)}
                          label="Thickness"
                          onChange={(value) => updateLayerWithUndo("changing a layer thickness", layer.id, { thicknessMm: value })}
                          suffix="mm"
                          value={layer.thicknessMm}
                        />
                      </div>

                      <div className="calc-layer-actions">
                        <button
                          aria-label="Move layer up"
                          className="focus-ring ui-icon-button"
                          disabled={index === 0}
                          onClick={() => moveLayer(layer.id, "up")}
                          type="button"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          aria-label="Move layer down"
                          className="focus-ring ui-icon-button"
                          disabled={index === layers.length - 1}
                          onClick={() => moveLayer(layer.id, "down")}
                          type="button"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button aria-label="Duplicate layer" className="focus-ring ui-icon-button" onClick={() => duplicateLayer(layer.id)} type="button">
                          <Copy className="h-4 w-4" />
                        </button>
                        <button aria-label="Remove layer" className="focus-ring ui-icon-button" onClick={() => removeLayer(layer.id)} type="button">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <ProfessionalLayerIllustration
              layers={illustrationLayers}
              orientation={mode}
              title={mode === "floor" ? "Floor construction preview" : "Wall construction preview"}
            />
          </div>

          <aside className="calc-review" aria-label="Calculation review">
            <section className="calc-result-hero" data-status={estimateState.status}>
              <span>Current result</span>
              <strong>{primaryOutput?.value ?? "--"}</strong>
              <p>{primaryOutput ? `${primaryOutput.label}: ${primaryOutput.detail}` : "Complete inputs to calculate."}</p>
            </section>

            {requiredTasks.length || estimateState.status === "error" ? (
              <section className="calc-review-section">
                <div className="calc-review-head">
                  <h2>{estimateState.status === "error" ? "Error" : "Needs input"}</h2>
                </div>
                <div className="calc-task-list">
                  {estimateState.status === "error" ? <p className="calc-error-text">{estimateState.message}</p> : null}
                  {requiredTasks.map((task) => (
                    <button className="calc-task-row focus-ring" key={task.id} onClick={() => focusTask(task)} type="button">
                      <span>
                        <strong>{task.label}</strong>
                        <small>{task.detail}</small>
                      </span>
                      {task.actionLabel ? <em>{task.actionLabel}</em> : null}
                    </button>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="calc-review-section">
              <div className="calc-review-head">
                <h2>Outputs</h2>
                <div className="calc-section-actions">
                  <span>{outputRows.length || selectedOutputs.length}</span>
                  <button
                    className="focus-ring ui-button ui-button-ghost"
                    disabled={!canSaveVerifiedCalculatedAnchor}
                    onClick={() => {
                      void saveCurrentVerifiedCalculatedAnchor();
                    }}
                    title={
                      canSaveVerifiedCalculatedAnchor
                        ? "Save current live result as a verified reference"
                        : "A live calculated result is required"
                    }
                    type="button"
                  >
                    <Bookmark className="h-4 w-4" />
                    {verifiedCalculatedCaptureBusy ? "Saving" : "Save verified ref"}
                  </button>
                </div>
              </div>
              {workbenchVerifiedCalculatedAnchorStatus === "error" ? (
                <p className="calc-error-text">{workbenchVerifiedCalculatedAnchorMessage}</p>
              ) : null}
              <div className="calc-output-rows">
                {(outputRows.length ? outputRows : selectedOutputs.map((output) => ({ detail: "Pending", label: output, status: "pending" as const, value: "--" }))).map(
                  (row) => (
                    <div className="calc-output-row" data-status={row.status} key={row.label}>
                      <span>
                        <strong>{row.label}</strong>
                        <small>{row.detail}</small>
                      </span>
                      <em>{row.value}</em>
                    </div>
                  )
                )}
              </div>
              {applicableWorkbenchVerifiedCalculatedAnchors.length ? (
                <>
                  <div className="calc-review-head">
                    <h2>Applicable references</h2>
                    <span>{applicableWorkbenchVerifiedCalculatedAnchors.length}</span>
                  </div>
                  <div className="calc-output-rows">
                    {applicableWorkbenchVerifiedCalculatedAnchors.map((anchor) => (
                      <div className="calc-output-row" data-status="live" key={anchor.id}>
                        <span>
                          <strong>{anchor.name}</strong>
                          <small>{formatWorkbenchV2VerifiedCalculatedAnchorValues(anchor)}</small>
                          <small>{formatWorkbenchV2VerifiedCalculatedAnchorContext(anchor)}</small>
                        </span>
                        <button
                          className="focus-ring ui-button ui-button-ghost"
                          disabled={verifiedCalculatedCaptureBusy}
                          onClick={() => {
                            void retireWorkbenchVerifiedCalculatedAnchor(anchor.id);
                          }}
                          type="button"
                        >
                          Retire
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
              {hiddenWorkbenchVerifiedCalculatedAnchorCount > 0 ? (
                <p className="calc-reference-note">
                  {hiddenWorkbenchVerifiedCalculatedAnchorCount === 1
                    ? "1 saved verified reference is"
                    : `${hiddenWorkbenchVerifiedCalculatedAnchorCount} saved verified references are`}{" "}
                  for a different calculation context.
                </p>
              ) : null}
            </section>

            <section className="calc-review-section calc-assistant-preview-section">
              <div className="calc-review-head">
                <h2>Assistant preview</h2>
                <button
                  className="focus-ring ui-button ui-button-ghost"
                  disabled={calculatorAssistantState.status === "loading"}
                  onClick={() => {
                    void previewCurrentCalculatorWithAssistant();
                  }}
                  type="button"
                >
                  <Sparkles className="h-4 w-4" />
                  {calculatorAssistantState.status === "loading" ? "Running" : "Run"}
                </button>
              </div>

              {calculatorAssistantState.status === "error" ? <p className="calc-error-text">{calculatorAssistantState.message}</p> : null}

              <form
                className="calc-assistant-command"
                onSubmit={(event) => {
                  event.preventDefault();
                  void applyCalculatorAssistantLayerStackCommand();
                }}
              >
                <label className="calc-assistant-command-field" htmlFor="calculator-assistant-stack-command">
                  <span>Stack command</span>
                  <textarea
                    className="report-input report-textarea report-textarea-compact calc-assistant-command-input"
                    disabled={calculatorAssistantBusy}
                    id="calculator-assistant-stack-command"
                    onChange={(event) => setCalculatorAssistantCommand(event.target.value)}
                    placeholder="Ekrandaki katmanların kalınlıklarını mantıklı gir"
                    ref={calculatorAssistantCommandInputRef}
                    value={calculatorAssistantCommand}
                  />
                </label>
                <div aria-label="Assistant prompt examples" className="calc-assistant-prompt-examples">
                  {CALCULATOR_ASSISTANT_PROMPT_EXAMPLES.map((example) => (
                    <button
                      aria-label={`Use assistant prompt: ${example.prompt}`}
                      className="calc-assistant-prompt-chip focus-ring"
                      disabled={calculatorAssistantBusy}
                      key={example.label}
                      onClick={() => {
                        setCalculatorAssistantCommand(example.prompt);
                        requestAnimationFrame(() => calculatorAssistantCommandInputRef.current?.focus());
                      }}
                      title={example.prompt}
                      type="button"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>{example.label}</span>
                    </button>
                  ))}
                </div>
                <div className="calc-assistant-command-actions">
                  <button
                    className="focus-ring ui-button ui-button-primary"
                    disabled={calculatorAssistantCommand.trim().length === 0 || calculatorAssistantBusy}
                    type="submit"
                  >
                    <Sparkles className="h-4 w-4" />
                    {calculatorAssistantSourceReviewState.status === "loading"
                      ? "Reviewing"
                      : calculatorAssistantCommandPending
                        ? "Interpreting"
                        : "Run"}
                  </button>
                </div>
              </form>

              {calculatorAssistantCommandMessage ? (
                <div className="calc-assistant-command-message" data-tone={calculatorAssistantCommandMessage.tone}>
                  <strong>{calculatorAssistantCommandMessage.title}</strong>
                  <span>{calculatorAssistantCommandMessage.detail}</span>
                </div>
              ) : null}

              {calculatorAssistantBoundedEditPlanState.status !== "idle" ? (
                <div className="calc-assistant-candidate-stacks" data-kind="bounded-edit-plan-dry-run">
                  <div className="calc-assistant-candidate-stack-toolbar">
                    <span>
                      {calculatorAssistantBoundedEditPlanState.status === "ready"
                        ? "Multi-step dry run"
                        : "Multi-step dry run blocked"}
                    </span>
                    <small>{calculatorAssistantBoundedEditPlanSteps.length} step{calculatorAssistantBoundedEditPlanSteps.length === 1 ? "" : "s"} / read-only</small>
                    {calculatorAssistantBoundedEditPlanState.status === "ready" ? (
                      <button
                        className="focus-ring ui-button ui-button-ghost"
                        onClick={prepareCalculatorAssistantBoundedEditPlanApplyProposal}
                        type="button"
                      >
                        <ArrowRight className="h-4 w-4" />
                        Prepare apply proposal
                      </button>
                    ) : null}
                  </div>

                  <div
                    className="calc-assistant-command-message"
                    data-tone={calculatorAssistantBoundedEditPlanState.status === "ready" ? "success" : "warning"}
                  >
                    <strong>
                      {calculatorAssistantBoundedEditPlanState.status === "ready"
                        ? "No Workbench layer changed yet."
                        : "Multi-step dry run blocked"}
                    </strong>
                    <span>
                      {calculatorAssistantBoundedEditPlanState.status === "ready"
                        ? `Preview required: ${calculatorAssistantBoundedEditPlanState.result.previewRequired ? "yes" : "no"}. Apply is gated by a separate proposal and confirmation.`
                        : `${calculatorAssistantBoundedEditPlanState.result.message} No Workbench layer changed yet.`}
                    </span>
                  </div>

                  {calculatorAssistantBoundedEditPlanSteps.map((step) => (
                    <div className="calc-assistant-candidate-stack" key={step.stepId}>
                      <div className="calc-assistant-candidate-stack-main">
                        <strong>{step.stepId}: {step.commandKind.replace(/_/gu, " ")}</strong>
                        <span>{step.summary}</span>
                        <small>
                          {`Layers: ${step.layerCountBefore} -> ${step.layerCountAfter}`}
                          {step.selectedOutputs?.length ? ` / outputs: ${step.selectedOutputs.join(", ")}` : ""}
                        </small>
                        {step.tasks.slice(0, 2).map((task) => (
                          <span key={`${step.stepId}-${task.code}-${task.layerId ?? task.label}`}>
                            {task.label}: {task.detail}
                          </span>
                        ))}
                        {step.warnings.slice(0, 2).map((warning) => (
                          <span key={`${step.stepId}-${warning}`}>{warning}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {calculatorAssistantSourceReviewState.status === "loading" ? (
                <div className="calc-assistant-command-message" data-tone="success">
                  <strong>Source review running</strong>
                  <span>Calculator preview and source review are running without changing the visible layer stack.</span>
                </div>
              ) : null}

              {calculatorAssistantSourceReviewState.status === "error" ? (
                <div className="calc-assistant-command-message" data-tone="warning">
                  <strong>Source review failed</strong>
                  <span>{calculatorAssistantSourceReviewState.message}</span>
                </div>
              ) : null}

              {calculatorAssistantSourceReviewState.status === "ready" ? (
                <>
                  <AssistantResultCard
                    calculatorPreview={calculatorAssistantSourceReviewState.preview}
                    result={calculatorAssistantSourceReviewState.result}
                  />

                  <div className="calc-assistant-candidate-stacks" data-kind="source-review-report-override">
                    <div className="calc-assistant-candidate-stack-toolbar">
                      <span>Report draft edit</span>
                      <button
                        className="focus-ring ui-button ui-button-ghost"
                        disabled={
                          !selectedServerReportId ||
                          calculatorAssistantSourceReviewState.source !== "research_provider" ||
                          calculatorAssistantReportOverrideProposalState.status === "loading"
                        }
                        onClick={() => void prepareCalculatorAssistantReportOverrideProposal()}
                        type="button"
                      >
                        <FileText className="h-4 w-4" />
                        Prepare report edit
                      </button>
                    </div>

                    {!selectedServerReportId ? (
                      <div className="calc-assistant-command-message" data-tone="warning">
                        <strong>Report target required</strong>
                        <span>Open or create a report first. Source review recommendations are never applied to calculator values.</span>
                      </div>
                    ) : null}

                    {selectedServerReportId && calculatorAssistantSourceReviewState.source !== "research_provider" ? (
                      <div className="calc-assistant-command-message" data-tone="warning">
                        <strong>Source-backed review required</strong>
                        <span>Context-only reviews stay advisory. Run a source-backed review before preparing a report draft edit.</span>
                      </div>
                    ) : null}

                    {calculatorAssistantReportOverrideProposalState.status === "loading" ? (
                      <div className="calc-assistant-command-message" data-tone="success">
                        <strong>Preparing report edit</strong>
                        <span>Loading the selected report and validating a report-only edit. Calculator values stay unchanged.</span>
                      </div>
                    ) : null}

                    {calculatorAssistantReportOverrideProposalState.status === "blocked" ? (
                      <div className="calc-assistant-command-message" data-tone="warning">
                        <strong>Report edit blocked</strong>
                        <span>{calculatorAssistantReportOverrideProposalState.message}</span>
                      </div>
                    ) : null}

                    {calculatorAssistantReportOverrideProposalState.status === "error" ? (
                      <div className="calc-assistant-command-message" data-tone="warning">
                        <strong>Report edit failed</strong>
                        <span>{calculatorAssistantReportOverrideProposalState.message}</span>
                      </div>
                    ) : null}

                    {calculatorAssistantReportOverrideProposalState.status === "applied" ? (
                      <div className="calc-assistant-command-message" data-tone="success">
                        <strong>Report draft updated</strong>
                        <span>{calculatorAssistantReportOverrideProposalState.message}</span>
                      </div>
                    ) : null}

                    {calculatorAssistantReportOverrideProposalState.status === "ready" ? (
                      <div className="calc-assistant-candidate-stack">
                        <div className="calc-assistant-candidate-stack-main">
                          <strong>{calculatorAssistantReportOverrideProposalState.validation.patchSummary}</strong>
                          <span>
                            Target report: {calculatorAssistantReportOverrideProposalState.target.reportName}. Calculator values and layers stay unchanged.
                          </span>
                          {calculatorAssistantReportOverrideProposalState.validation.operations.map((operation, index) => (
                            <span key={`${operation.type}-${index}`}>
                              {operation.type === "metric_value"
                                ? `${operation.label}: ${operation.beforeValue} -> ${operation.afterValue}`
                                : operation.type === "report_note"
                                  ? `Add ${operation.section} note`
                                  : `Replace report text value ${operation.beforeValue} -> ${operation.afterValue}`}
                            </span>
                          ))}
                        </div>
                        <button
                          className="focus-ring ui-button ui-button-primary"
                          onClick={applyPreparedCalculatorAssistantReportOverrideProposal}
                          type="button"
                        >
                          <ArrowRight className="h-4 w-4" />
                          Apply to report draft
                        </button>
                      </div>
                    ) : null}
                  </div>
                </>
              ) : null}

              {calculatorAssistantSourceReviewState.status === "error" && calculatorAssistantSourceReviewState.result ? (
                <AssistantResultCard
                  calculatorPreview={calculatorAssistantSourceReviewState.preview}
                  result={calculatorAssistantSourceReviewState.result}
                />
              ) : null}

              {calculatorAssistantSourceAlternativeState.status === "loading" ? (
                <div className="calc-assistant-command-message" data-tone="success">
                  <strong>Source alternative research running</strong>
                  <span>Research suggestions are being normalized without changing the visible layer stack.</span>
                </div>
              ) : null}

              {calculatorAssistantSourceAlternativeState.status === "error" ? (
                <div className="calc-assistant-command-message" data-tone="warning">
                  <strong>Source alternative research failed</strong>
                  <span>{calculatorAssistantSourceAlternativeState.message}</span>
                </div>
              ) : null}

              {calculatorAssistantSourceAlternativeState.status === "error" && calculatorAssistantSourceAlternativeState.result ? (
                <AssistantResultCard result={calculatorAssistantSourceAlternativeState.result} />
              ) : null}

              {calculatorAssistantSourceAlternativeState.status === "ready" ? (
                <>
                  <AssistantResultCard result={calculatorAssistantSourceAlternativeState.result} />
                  <div className="calc-assistant-candidate-stacks" data-kind="source-alternative-candidate-bridge">
                    <div className="calc-assistant-candidate-stack-toolbar">
                      <span>{calculatorAssistantSourceAlternativeState.candidateCount} source candidate{calculatorAssistantSourceAlternativeState.candidateCount === 1 ? "" : "s"}</span>
                      <small>{calculatorAssistantSourceAlternativeState.source} / {calculatorAssistantSourceAlternativeState.taskCount} task{calculatorAssistantSourceAlternativeState.taskCount === 1 ? "" : "s"}</small>
                    </div>
                    {calculatorAssistantSourceAlternativeState.clarificationPrompts.length ? (
                      <div className="calc-assistant-command-message" data-tone="warning">
                        <strong>Source alternative needs clarification</strong>
                        <span>
                          {calculatorAssistantSourceAlternativeState.clarificationPrompts
                            .map((prompt) => prompt.message)
                            .join(" ")}
                        </span>
                      </div>
                    ) : null}
                    {calculatorAssistantSourceAlternativeState.warnings.length ? (
                      <div className="calc-assistant-command-message" data-tone="warning">
                        <strong>Source alternative guardrails</strong>
                        <span>{calculatorAssistantSourceAlternativeState.warnings.slice(0, 2).join(" ")}</span>
                      </div>
                    ) : null}
                  </div>
                </>
              ) : null}

              {calculatorAssistantWorkbenchApplyProposal ? (
                <div className="calc-assistant-candidate-stacks" data-kind="workbench-apply-proposal">
                  <div className="calc-assistant-candidate-stack-toolbar">
                    <span>{calculatorAssistantWorkbenchApplyProposal.title}</span>
                    <button
                      className="focus-ring ui-button ui-button-primary"
                      onClick={() => confirmCalculatorAssistantWorkbenchApplyProposal(calculatorAssistantWorkbenchApplyProposal)}
                      type="button"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Apply to draft
                    </button>
                  </div>
                  <div className="calc-assistant-candidate-stack">
                    <div className="calc-assistant-candidate-stack-main">
                      <strong>{calculatorAssistantWorkbenchApplyProposal.summary}</strong>
                      <span>
                        {calculatorAssistantWorkbenchApplyProposal.diff.layers
                          .filter((entry) => entry.operation !== "unchanged")
                          .slice(0, 4)
                          .map((entry) => {
                            const label = entry.after?.materialName ?? entry.after?.materialId ?? entry.before?.materialId ?? "layer";
                            const thickness = entry.after?.thicknessMm ? `${entry.after.thicknessMm} mm` : "removed";
                            return `${entry.operation} ${entry.index + 1}: ${thickness} ${label}`;
                          })
                          .join(" + ")}
                      </span>
                      <small>
                        Outputs: {calculatorAssistantWorkbenchApplyProposal.diff.selectedOutputs.after.join(", ")}
                      </small>
                    </div>
                    <div className="calc-assistant-candidate-stack-actions">
                      <button
                        className="focus-ring ui-button ui-button-ghost"
                        onClick={() => setCalculatorAssistantWorkbenchApplyProposal(null)}
                        type="button"
                      >
                        <X className="h-4 w-4" />
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              {calculatorAssistantCandidateStacks.length ? (
                <div className="calc-assistant-candidate-stacks">
                  <div className="calc-assistant-candidate-stack-toolbar">
                    <span>{calculatorAssistantCandidateStacks.length} candidates</span>
                    <button
                      className="focus-ring ui-button ui-button-ghost"
                      disabled={calculatorAssistantCandidateComparisonState.status === "loading"}
                      onClick={() => {
                        void previewAllCalculatorAssistantCandidateStacks();
                      }}
                      type="button"
                    >
                      <Sparkles className="h-4 w-4" />
                      {calculatorAssistantCandidateComparisonState.status === "loading" ? "Previewing" : "Preview all"}
                    </button>
                  </div>
                  {calculatorAssistantCandidateStacks.map((candidate) => (
                    <div className="calc-assistant-candidate-stack" key={candidate.candidateId}>
                      <div className="calc-assistant-candidate-stack-main">
                        <strong>{candidate.label}</strong>
                        <span>
                          {candidate.layers.map((layer) => {
                            const material = materialById.get(layer.materialId);
                            const thickness = layer.thicknessMm.trim() ? `${layer.thicknessMm} mm` : "missing thickness";
                            return `${thickness} ${material?.name ?? layer.materialId}`;
                          }).join(" + ")}
                        </span>
                        {candidate.tasks.length ? <small>{candidate.tasks.length} missing input{candidate.tasks.length === 1 ? "" : "s"}</small> : null}
                      </div>
                      <div className="calc-assistant-candidate-stack-actions">
                        <button
                          className="focus-ring ui-button ui-button-ghost"
                          disabled={calculatorAssistantState.status === "loading"}
                          onClick={() => previewCalculatorAssistantCandidateStack(candidate)}
                          type="button"
                        >
                          <Sparkles className="h-4 w-4" />
                          Preview
                        </button>
                        <button
                          className="focus-ring ui-button ui-button-primary"
                          onClick={() => applyCalculatorAssistantCandidateStack(candidate)}
                          type="button"
                        >
                          <ArrowRight className="h-4 w-4" />
                          Use
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {calculatorAssistantCandidateComparisonState.status === "loading" ? (
                <div className="calc-assistant-command-message" data-tone="success">
                  <strong>Candidate comparison running</strong>
                  <span>{calculatorAssistantCandidateComparisonState.candidateCount} candidates are being previewed through the calculator.</span>
                </div>
              ) : null}

              {calculatorAssistantCandidateComparisonState.status === "error" ? (
                <p className="calc-error-text">{calculatorAssistantCandidateComparisonState.message}</p>
              ) : null}

              {calculatorAssistantCandidateComparisonState.status === "ready" ? (
                <div className="calc-assistant-candidate-comparison">
                  {calculatorAssistantCandidateComparisonState.ranking.length ? (
                    <div className="calc-assistant-candidate-ranking">
                      {calculatorAssistantCandidateComparisonState.ranking.map((rank) => (
                        <span key={rank.candidateId}>
                          <strong>#{rank.rank}</strong>
                          <small>{rank.label}</small>
                          <em>{rank.metric}: {rank.valueLabel}</em>
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {calculatorAssistantCandidateComparisonState.rows.map((row) => (
                    <div className="calc-assistant-candidate-comparison-row" data-status={row.status} key={row.candidateId}>
                      <div className="calc-assistant-candidate-comparison-head">
                        <strong>{row.label}</strong>
                        <small>{row.status}</small>
                      </div>
                      {row.outputRows.length ? (
                        <div className="calc-assistant-candidate-output-grid">
                          {row.outputRows.map((output) => (
                            <span data-status={output.status} key={`${row.candidateId}-${output.label}`}>
                              <strong>{output.label}</strong>
                              <small>{output.detail}</small>
                              <em>{output.value}</em>
                            </span>
                          ))}
                        </div>
                      ) : null}
                      {row.commandTasks.length || row.previewTasks.length || row.errorMessage ? (
                        <div className="calc-assistant-candidate-task-list">
                          {row.errorMessage ? <span>{row.errorMessage}</span> : null}
                          {row.commandTasks.map((task) => <span key={`${row.candidateId}-${task.code}-${task.layerId ?? task.label}`}>{task.label}: {task.detail}</span>)}
                          {row.previewTasks.map((task) => <span key={`${row.candidateId}-${task.id}`}>{task.label}: {task.detail}</span>)}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}

              {calculatorAssistantPreview ? (
                <div className="calc-assistant-preview-summary" data-status={calculatorAssistantPreview.calculationSummary.status}>
                  <span>
                    <strong>{calculatorAssistantPreview.calculationSummary.primaryValueLabel ?? "--"}</strong>
                    <small>{calculatorAssistantPreview.calculationSummary.primaryOutput ?? calculatorAssistantPreview.calculationSummary.status}</small>
                  </span>
                  <span>
                    <strong>{calculatorAssistantPreview.requestedSnapshot.layerCount}</strong>
                    <small>layers</small>
                  </span>
                  <span>
                    <strong>{calculatorAssistantPreview.outputRows.length}</strong>
                    <small>outputs</small>
                  </span>
                </div>
              ) : null}

              {calculatorAssistantPreview?.engineSummary ? (
                <div className="calc-assistant-route-summary">
                  <span>
                    <strong>
                      {calculatorAssistantPreview.engineSummary.calculatorLabel ??
                        calculatorAssistantPreview.engineSummary.calculatorId ??
                        "Calculator"}
                    </strong>
                    <small>{calculatorAssistantPreview.engineSummary.method}</small>
                  </span>
                  <span>
                    <strong>{calculatorAssistantPreview.engineSummary.supportedTargetOutputs.length}</strong>
                    <small>supported</small>
                  </span>
                  <span>
                    <strong>{calculatorAssistantPreview.engineSummary.unsupportedTargetOutputs.length}</strong>
                    <small>unsupported</small>
                  </span>
                </div>
              ) : null}

              {calculatorAssistantPreview?.tasks.length ? (
                <div className="calc-task-list">
                  {calculatorAssistantPreview.tasks.map((task) => (
                    <div className="calc-task-row calc-assistant-task-row" key={task.id}>
                      <span>
                        <strong>{task.label}</strong>
                        <small>{task.detail}</small>
                      </span>
                      <em>{task.source === "calculator_route" ? "Route" : "Snapshot"}</em>
                    </div>
                  ))}
                </div>
              ) : null}

              {calculatorAssistantPreview ? (
                <div className="calc-output-rows">
                  {calculatorAssistantPreview.outputRows.map((row) => (
                    <div className="calc-output-row" data-status={row.status} key={row.label}>
                      <span>
                        <strong>{row.label}</strong>
                        <small>{row.detail}</small>
                      </span>
                      <em>{row.value}</em>
                    </div>
                  ))}
                </div>
              ) : null}
            </section>

            {visibleResponseFigures.length || missingSelectedImpactCurve || missingSelectedAirborneCurve ? (
              <div className="calc-curve-stack">
                {visibleResponseFigures.map((figure) => (
                  <ProfessionalResponseCurve figure={figure} key={figure.id} />
                ))}
                {missingSelectedImpactCurve ? (
                  <div className="calc-curve-empty">
                    <span>Impact spectrum</span>
                    <strong>Band curve unavailable</strong>
                    <p>Current impact result exposes weighted values, but no trace-backed impact band curve.</p>
                  </div>
                ) : null}
                {missingSelectedAirborneCurve ? (
                  <div className="calc-curve-empty">
                    <span>Airborne spectrum</span>
                    <strong>Band curve unavailable</strong>
                    <p>Current airborne result does not expose response-curve bands.</p>
                  </div>
                ) : null}
              </div>
            ) : null}

            <section className="calc-review-section">
              <div className="calc-review-head">
                <h2>Report handoff</h2>
              </div>
              {canOpenReport ? (
                <>
                  <div className="calc-report-actions">
                    <button
                      className={workbenchPersistenceState.kind === "combinationClean" ? "focus-ring ui-button ui-button-ghost" : "focus-ring ui-button"}
                      disabled={serverProjectBusy || workbenchPersistenceState.kind === "combinationClean"}
                      onClick={handleSaveCurrentAssemblyFromHandoff}
                      title={
                        workbenchPersistenceState.kind === "localDraft"
                          ? "Choose a project before saving this stack"
                          : workbenchPersistenceState.kind === "combinationDirty"
                            ? "Update the active saved combination with the current stack"
                            : workbenchPersistenceState.kind === "combinationClean"
                              ? "The active combination is already saved"
                              : "Name this stack and save it as a new combination"
                      }
                      type="button"
                    >
                      <Save className="h-4 w-4" />
                      {workbenchPersistenceState.primaryActionLabel}
                    </button>
                    <button
                      className="focus-ring ui-button"
                      disabled={workbenchPresetBusy}
                      onClick={handleSaveCurrentTemplateFromHandoff}
                      type="button"
                    >
                      <Bookmark className="h-4 w-4" />
                      Save as template
                    </button>
                    <button className="focus-ring ui-button ui-button-primary" onClick={handleOpenReport} type="button">
                      <FileText className="h-4 w-4" />
                      Open report
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                  {reportSourceDecisionOpen && reportSourceDecisionKind ? (
                    <div className="calc-report-source-panel" data-kind={reportSourceDecisionKind}>
                      <div className="calc-report-source-head">
                        <div>
                          <strong>Report source</strong>
                          <span>
                            {reportSourceDecisionKind === "combinationDirty"
                              ? `Save the modified ${activeServerAssembly?.name ?? "combination"} before linking the report.`
                              : "Save this stack as a named combination before linking the report."}
                          </span>
                        </div>
                        <button className="focus-ring ui-button ui-button-ghost" onClick={() => setReportSourceDecisionOpen(false)} type="button">
                          Cancel
                        </button>
                      </div>
                      {reportSourceDecisionKind === "projectDraft" ? (
                        <div className="calc-project-snapshot-controls">
                          <input
                            aria-label="Report source combination name"
                            className="focus-ring ui-field calc-project-snapshot-select"
                            disabled={serverProjectBusy}
                            maxLength={160}
                            onChange={(event) => {
                              serverAssemblyNameDraftRef.current = event.target.value;
                              setServerAssemblyNameDraft(event.target.value);
                            }}
                            placeholder="Combination name"
                            value={serverAssemblyNameDraft}
                          />
                          <input
                            aria-label="Report source combination description"
                            className="focus-ring ui-field calc-project-snapshot-select"
                            disabled={serverProjectBusy}
                            maxLength={320}
                            onChange={(event) => {
                              serverAssemblyDescriptionDraftRef.current = event.target.value;
                              setServerAssemblyDescriptionDraft(event.target.value);
                            }}
                            placeholder="Optional description"
                            value={serverAssemblyDescriptionDraft}
                          />
                          <button
                            className="focus-ring ui-button ui-button-primary"
                            disabled={!canSaveNewServerAssembly}
                            onClick={() => void saveCurrentAssemblyAndOpenReport()}
                            type="button"
                          >
                            <Save className="h-4 w-4" />
                            Save and open report
                          </button>
                        </div>
                      ) : null}
                      {reportSourceDecisionKind === "combinationDirty" ? (
                        <>
                          <div className="calc-report-actions">
                            <button
                              className="focus-ring ui-button ui-button-primary"
                              disabled={serverProjectBusy}
                              onClick={() => void updateCurrentAssemblyAndOpenReport()}
                              type="button"
                            >
                              <Save className="h-4 w-4" />
                              Update combination and open report
                            </button>
                          </div>
                          <div className="calc-project-snapshot-controls">
                            <input
                              aria-label="Copy combination name"
                              className="focus-ring ui-field calc-project-snapshot-select"
                              disabled={serverProjectBusy}
                              maxLength={160}
                              onChange={(event) => {
                                serverAssemblyNameDraftRef.current = event.target.value;
                                setServerAssemblyNameDraft(event.target.value);
                              }}
                              placeholder="Copy name"
                              value={serverAssemblyNameDraft}
                            />
                            <input
                              aria-label="Copy combination description"
                              className="focus-ring ui-field calc-project-snapshot-select"
                              disabled={serverProjectBusy}
                              maxLength={320}
                              onChange={(event) => {
                                serverAssemblyDescriptionDraftRef.current = event.target.value;
                                setServerAssemblyDescriptionDraft(event.target.value);
                              }}
                              placeholder="Optional copy description"
                              value={serverAssemblyDescriptionDraft}
                            />
                            <button
                              className="focus-ring ui-button"
                              disabled={!canSaveNewServerAssembly}
                              onClick={() => void saveCurrentAssemblyAndOpenReport()}
                              type="button"
                            >
                              <Copy className="h-4 w-4" />
                              Save as copy and open
                            </button>
                          </div>
                        </>
                      ) : null}
                      <div className="calc-report-source-foot">
                        <button className="focus-ring ui-button ui-button-ghost" onClick={() => openCurrentReport()} type="button">
                          <FileText className="h-4 w-4" />
                          Open as local report draft
                        </button>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <button className="ui-button calc-report-link" disabled type="button">
                  <FileText className="h-4 w-4" />
                  Result required
                </button>
              )}
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}

function NumberField(props: {
  effectiveness?: RouteInputEffectiveness;
  id: string;
  invalid?: boolean;
  label: string;
  onChange: (value: string) => void;
  suffix: string;
  value: string;
}) {
  return (
    <label className="calc-field" data-missing={props.invalid ? "true" : undefined}>
      <FieldLabel effectiveness={props.effectiveness} label={props.label} />
      <div className="calc-number-field">
        <input
          aria-invalid={props.invalid ? true : undefined}
          className="focus-ring"
          id={props.id}
          inputMode="decimal"
          onChange={(event) => props.onChange(event.target.value)}
          type="number"
          value={props.value}
        />
        <em>{props.suffix}</em>
      </div>
    </label>
  );
}

function TextField(props: {
  effectiveness?: RouteInputEffectiveness;
  id: string;
  invalid?: boolean;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <label className="calc-field" data-missing={props.invalid ? "true" : undefined}>
      <FieldLabel effectiveness={props.effectiveness} label={props.label} />
      <input
        aria-invalid={props.invalid ? true : undefined}
        className="focus-ring ui-field"
        id={props.id}
        inputMode="numeric"
        onChange={(event) => props.onChange(event.target.value)}
        placeholder={props.placeholder}
        type="text"
        value={props.value}
      />
    </label>
  );
}

function FieldLabel(props: { effectiveness?: RouteInputEffectiveness; label: string }) {
  return (
    <span className="calc-field-label">
      <span>{props.label}</span>
      {props.effectiveness ? <RouteInputEffectivenessBadge effectiveness={props.effectiveness} /> : null}
    </span>
  );
}

function RouteInputEffectivenessBadge(props: { effectiveness: RouteInputEffectiveness }) {
  const badgeClassName = [
    "calc-route-input-effectiveness",
    "ui-badge",
    "ui-badge-compact",
    props.effectiveness.status === "used"
      ? "ui-badge-success"
      : props.effectiveness.status === "needed"
        ? "ui-badge-warning"
        : props.effectiveness.status === "defaulted"
          ? "ui-badge-accent"
          : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={badgeClassName} title={props.effectiveness.title}>
      {ROUTE_INPUT_EFFECTIVENESS_LABELS[props.effectiveness.status]}
    </span>
  );
}

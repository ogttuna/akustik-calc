import type { JsonValue } from "@dynecho/shared";

import {
  buildReportAssistantDocumentComparisonSummary,
  type ReportAssistantContext,
  type ReportAssistantDocumentComparisonSummary
} from "./report-assistant-context";
import {
  REPORT_ASSISTANT_PRESET_READ_TOOL_DEFINITIONS,
  buildReportAssistantPresetLibrarySummary,
  type ReportAssistantPresetLibrarySummary,
  type ReportAssistantPresetReadToolName,
  type ReportAssistantPresetSummary
} from "./report-assistant-preset-library";
import {
  REPORT_ASSISTANT_PROJECT_READ_TOOL_DEFINITIONS,
  runReportAssistantProjectReadTool,
  type ReportAssistantProjectReadInvocation,
  type ReportAssistantProjectReadResult,
  type ReportAssistantProjectReadToolName
} from "./report-assistant-project-tools";
import {
  mergeReportAssistantLayerStackDraftContinuation,
  type ReportAssistantLayerStackDraftContinuationRequest,
  type ReportAssistantLayerStackDraftContinuationResult
} from "./report-assistant-layer-stack-draft-continuation";
import {
  createReportAssistantWallCandidateComparison,
  previewReportAssistantWallCandidateComparison,
  type ReportAssistantWallCandidateComparisonPreview
} from "./report-assistant-wall-candidate-comparison";
import { calculatorPreviewToAssistantResult } from "./report-assistant-calculator-preview-result";
import {
  createReportAssistantResultEnvelope,
  type ReportAssistantResultEnvelope,
  type ReportAssistantResultRouteStatus,
  type ReportAssistantResultSourceTrace,
  type ReportAssistantResultTask
} from "./report-assistant-result-contract";
import {
  parseSimpleWorkbenchProposalDocument,
  type SimpleWorkbenchProposalDocument
} from "./simple-workbench-proposal";
import {
  previewReportAssistantLayerStackDraft,
  previewDescribedLayerConfiguration,
  type WorkbenchV2CalculatorAssistantPreview,
  type WorkbenchV2CalculatorAssistantToolName
} from "../workbench-rebuild/workbench-v2-calculator-assistant";
import type { ProjectOwnerScope } from "../../lib/server-project-storage";
import {
  createDefaultWorkbenchV2PresetRepository,
  type FileWorkbenchV2PresetRepository
} from "../../lib/workbench-v2-preset-storage";

export type ReportAssistantQueryEvidenceSource =
  | "calculator_preview"
  | "current_context"
  | "preset_summary"
  | "project_read"
  | "report_document"
  | "revision_summary";

export type ReportAssistantQueryEvidence = {
  label: string;
  referenceId?: string;
  source: ReportAssistantQueryEvidenceSource;
};

export type ReportAssistantQueryUsedRead = {
  action: ReportAssistantQueryReadActionName;
  mutates: false;
};

export type ReportAssistantQueryCalculatorPreview = {
  mutates: false;
  name: Extract<
    WorkbenchV2CalculatorAssistantToolName,
    "preview_described_layer_configuration" | "preview_layer_stack_draft"
  >;
  preview: WorkbenchV2CalculatorAssistantPreview;
  previewOnly: true;
};

export type ReportAssistantQueryLayerStackDraftState = NonNullable<
  WorkbenchV2CalculatorAssistantPreview["layerStackDraft"]
>;

export type ReportAssistantQuerySuccess = {
  answer: string;
  assistantResults: readonly ReportAssistantResultEnvelope[];
  calculatorPreview?: ReportAssistantQueryCalculatorPreview;
  evidence: readonly ReportAssistantQueryEvidence[];
  layerStackDraft?: ReportAssistantQueryLayerStackDraftState;
  mutates: false;
  ok: true;
  usedReads: readonly ReportAssistantQueryUsedRead[];
  warnings: readonly string[];
};

export type ReportAssistantQueryFailure = {
  assistantResults?: readonly ReportAssistantResultEnvelope[];
  code: string;
  errors: readonly string[];
  evidence: readonly ReportAssistantQueryEvidence[];
  mutates: false;
  ok: false;
  statusCode: number;
  usedReads: readonly ReportAssistantQueryUsedRead[];
  warnings: readonly string[];
};

export type ReportAssistantQueryResult = ReportAssistantQueryFailure | ReportAssistantQuerySuccess;

export type ReportAssistantQueryReadRunner = (
  invocation: ReportAssistantProjectReadInvocation
) => Promise<ReportAssistantProjectReadResult>;

export type ReportAssistantQueryPresetRepository = Pick<FileWorkbenchV2PresetRepository, "listPresets" | "readPreset">;

export type ReportAssistantQueryReadActionName = ReportAssistantProjectReadToolName | ReportAssistantPresetReadToolName;

export type ReportAssistantQueryInput = {
  allowedReadActions?: readonly ReportAssistantQueryReadActionName[];
  context: ReportAssistantContext;
  document?: SimpleWorkbenchProposalDocument;
  draftContinuation?: ReportAssistantLayerStackDraftContinuationRequest;
  instruction: string;
  owner: ProjectOwnerScope;
  presetRepository?: ReportAssistantQueryPresetRepository;
  readProject?: ReportAssistantQueryReadRunner;
};

type ReportAssistantSummaryReadPlan =
  | {
      name: "list_project_assemblies" | "list_project_reports" | "read_project_summary";
      projectId: string;
    }
  | {
      name: "list_project_report_revisions";
      projectId: string;
      reportId: string;
    };

export type ReportAssistantQueryAllowedReadActionParseResult =
  | {
      actions?: readonly ReportAssistantQueryReadActionName[];
      ok: true;
    }
  | {
      errors: readonly string[];
      ok: false;
    };

const PROJECT_READ_TOOL_NAMES = new Set<ReportAssistantProjectReadToolName>(
  REPORT_ASSISTANT_PROJECT_READ_TOOL_DEFINITIONS.map((tool) => tool.name)
);
const PRESET_READ_TOOL_NAMES = new Set<ReportAssistantPresetReadToolName>(
  REPORT_ASSISTANT_PRESET_READ_TOOL_DEFINITIONS.map((tool) => tool.name)
);

const DEFAULT_QUERY_READ_ACTIONS = new Set<ReportAssistantQueryReadActionName>([
  "list_common_preset_summaries",
  "list_project_assemblies",
  "list_project_report_revisions",
  "list_project_reports",
  "list_user_preset_summaries",
  "read_project_summary"
]);

const MAX_QUERY_READS = 3;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isProjectReadToolName(value: unknown): value is ReportAssistantProjectReadToolName {
  return typeof value === "string" && PROJECT_READ_TOOL_NAMES.has(value as ReportAssistantProjectReadToolName);
}

function isPresetReadToolName(value: unknown): value is ReportAssistantPresetReadToolName {
  return typeof value === "string" && PRESET_READ_TOOL_NAMES.has(value as ReportAssistantPresetReadToolName);
}

function isQueryReadActionName(value: unknown): value is ReportAssistantQueryReadActionName {
  return isProjectReadToolName(value) || isPresetReadToolName(value);
}

export function parseReportAssistantQueryAllowedReadActions(
  value: unknown
): ReportAssistantQueryAllowedReadActionParseResult {
  if (value === undefined) {
    return {
      ok: true
    };
  }

  if (!Array.isArray(value)) {
    return {
      errors: ["allowedReadActions must be an array of assistant project read action names."],
      ok: false
    };
  }

  const invalid = value.filter((entry) => !isQueryReadActionName(entry));
  if (invalid.length > 0) {
    return {
      errors: [`Unsupported assistant query read action: ${String(invalid[0])}.`],
      ok: false
    };
  }

  return {
    actions: [...new Set(value)] as ReportAssistantQueryReadActionName[],
    ok: true
  };
}

function normalizeQueryText(value: string): string {
  return value
    .replace(/[İIı]/gu, "i")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/gu, " ")
    .trim();
}

function hasMutationIntent(normalizedInstruction: string): boolean {
  return /\b(?:apply|append|create|delete|download|export|mutate|persist|reset|restore|save|update|write)\b/u
    .test(normalizedInstruction) ||
    /\b(?:disa aktar|geri yukle|guncelle|indir|kaydet|olustur|sil|uygula|yaz)\b/u
      .test(normalizedInstruction);
}

function wantsProjectRead(normalizedInstruction: string): boolean {
  return /\b(?:assembly|assemblies|combination|combinations|context|project|proje|report|reports|rapor|saved|workspace)\b/u
    .test(normalizedInstruction);
}

function wantsAssemblyList(normalizedInstruction: string): boolean {
  return /\b(?:assemblies|assembly|combination|combinations|kombinasyon|layer|layers|stack)\b/u
    .test(normalizedInstruction);
}

function wantsReportList(normalizedInstruction: string): boolean {
  return /\b(?:report|reports|rapor|saved report|which report)\b/u.test(normalizedInstruction);
}

function wantsRevisionInfo(normalizedInstruction: string): boolean {
  return /\b(?:changed|changes|compare|comparison|diff|difference|history|last revision|revision|revisions|revizyon|degisen|degisiklik)\b/u
    .test(normalizedInstruction);
}

function wantsSavedReportComparison(normalizedInstruction: string): boolean {
  return /\b(?:compare|comparison|diff|difference|saved current report|saved report|kayitli rapor)\b/u
    .test(normalizedInstruction);
}

function wantsRevisionDocumentComparison(normalizedInstruction: string): boolean {
  return /\b(?:last revision|previous revision|current revision|revision difference|revision diff|revizyon)\b/u
    .test(normalizedInstruction);
}

function wantsPresetRead(normalizedInstruction: string): boolean {
  return /\b(?:common|preset|presets|seed|starter|template|templates|sablon|sablonlar|presetler)\b/u
    .test(normalizedInstruction);
}

function wantsDescribedCalculatorPreview(normalizedInstruction: string): boolean {
  return /\b\d+(?:[.,]\d+)?\s*mm\b/u.test(normalizedInstruction) &&
    /\b(?:aiic|calculat\w*|calculator\w*|dn|dnt|duvar|estimate|hesapl\w*|iic|katman\w*|layer|layers|ln|predict|rw|stack|stc|wall)\b/u
      .test(normalizedInstruction);
}

function wantsWallCandidateComparison(normalizedInstruction: string): boolean {
  return /\b\d+(?:[.,]\d+)?\s*mm\b/u.test(normalizedInstruction) &&
    /\b(?:compare|comparison|karsilastir|karsilastirma|karşılaştır|kiyasla|kıyasla|vs)\b/u.test(normalizedInstruction) &&
    /\b(?:c|ctr|dn|dnt|duvar|rw|stc|wall)\b/u.test(normalizedInstruction) &&
    !/\b(?:aiic|ceiling|doseme|döşeme|floor|iic|impact|ln|slab|tavan)\b/u.test(normalizedInstruction);
}

function getContextProjectId(context: ReportAssistantContext): string | undefined {
  return context.projectWorkspace?.project?.id ??
    context.projectWorkspace?.activeDraftState?.projectId ??
    context.projectId;
}

function getContextReportId(context: ReportAssistantContext): string | undefined {
  return context.projectWorkspace?.report?.id ??
    context.projectWorkspace?.activeDraftState?.reportId;
}

function getAllowedActions(input: readonly ReportAssistantQueryReadActionName[] | undefined) {
  return new Set(input ?? [...DEFAULT_QUERY_READ_ACTIONS]);
}

function canRead(
  allowedActions: ReadonlySet<ReportAssistantQueryReadActionName>,
  action: ReportAssistantQueryReadActionName
): boolean {
  return allowedActions.has(action);
}

function queryFailure(input: {
  assistantResults?: readonly ReportAssistantResultEnvelope[];
  code: string;
  errors: readonly string[];
  evidence?: readonly ReportAssistantQueryEvidence[];
  statusCode: number;
  usedReads?: readonly ReportAssistantQueryUsedRead[];
  warnings?: readonly string[];
}): ReportAssistantQueryFailure {
  return {
    ...(input.assistantResults ? { assistantResults: input.assistantResults } : {}),
    code: input.code,
    errors: input.errors,
    evidence: input.evidence ?? [],
    mutates: false,
    ok: false,
    statusCode: input.statusCode,
    usedReads: input.usedReads ?? [],
    warnings: input.warnings ?? []
  };
}

function querySuccess(input: {
  answer: string;
  assistantResults?: readonly ReportAssistantResultEnvelope[];
  calculatorPreview?: ReportAssistantQueryCalculatorPreview;
  evidence: readonly ReportAssistantQueryEvidence[];
  layerStackDraft?: ReportAssistantQueryLayerStackDraftState;
  usedReads: readonly ReportAssistantQueryUsedRead[];
  warnings?: readonly string[];
}): ReportAssistantQuerySuccess {
  return {
    answer: input.answer,
    assistantResults: input.assistantResults ?? [
      queryAnswerToAssistantResult({
        evidence: input.evidence,
        usedReads: input.usedReads,
        warnings: input.warnings ?? []
      })
    ],
    ...(input.calculatorPreview ? { calculatorPreview: input.calculatorPreview } : {}),
    evidence: input.evidence,
    ...(input.layerStackDraft ? { layerStackDraft: input.layerStackDraft } : {}),
    mutates: false,
    ok: true,
    usedReads: input.usedReads,
    warnings: input.warnings ?? []
  };
}

function evidenceToSourceTrace(evidence: ReportAssistantQueryEvidence): ReportAssistantResultSourceTrace {
  if (evidence.source === "calculator_preview") {
    return {
      kind: "calculator_preview",
      label: evidence.label,
      detail: evidence.referenceId
    };
  }

  if (evidence.source === "preset_summary") {
    return {
      kind: "preset_read",
      label: evidence.label,
      detail: evidence.referenceId
    };
  }

  if (
    evidence.source === "project_read" ||
    evidence.source === "report_document" ||
    evidence.source === "revision_summary"
  ) {
    return {
      kind: "project_read",
      label: evidence.label,
      detail: evidence.referenceId
    };
  }

  return {
    kind: "deterministic",
    label: evidence.label,
    detail: evidence.referenceId
  };
}

function queryAnswerToAssistantResult(input: {
  evidence: readonly ReportAssistantQueryEvidence[];
  usedReads: readonly ReportAssistantQueryUsedRead[];
  warnings: readonly string[];
}): ReportAssistantResultEnvelope {
  const hasGroundedRead = input.usedReads.length > 0 || input.evidence.some((entry) => entry.source !== "current_context");

  return createReportAssistantResultEnvelope({
    authority: hasGroundedRead ? "deterministic_read" : "draft_only",
    capabilityName: "report_assistant_query_route",
    confidenceReason: hasGroundedRead
      ? "The answer is assembled from typed local read/context results."
      : "The answer is a read-only assistant response without a calculator-backed value.",
    evidence: input.evidence.map((entry) => ({
      label: entry.label,
      detail: entry.referenceId
    })),
    routeStatus: "ready",
    sourceTrace: input.evidence.map(evidenceToSourceTrace),
    warnings: input.warnings
  });
}

function draftContinuationTasks(
  result: ReportAssistantLayerStackDraftContinuationResult
): readonly ReportAssistantResultTask[] {
  if (!result.ok) {
    return result.errors.map((message) => ({
      code: result.status === "stale" ? "assistant_layer_stack_draft_stale" : "assistant_layer_stack_draft_invalid_answer",
      message,
      severity: result.status === "stale" ? "error" : "warning"
    }));
  }

  return result.validation.missingInputs.map((missingInput) => ({
    code: missingInput.code,
    message: `${missingInput.message} ${missingInput.question}`,
    severity: "warning"
  }));
}

function draftContinuationRouteStatus(
  result: ReportAssistantLayerStackDraftContinuationResult
): ReportAssistantResultRouteStatus {
  if (result.ok) {
    return result.status === "ready" ? "ready" : "needs_input";
  }

  return result.status === "stale" ? "stale" : "validation_failed";
}

function draftContinuationToAssistantResult(
  result: ReportAssistantLayerStackDraftContinuationResult
): ReportAssistantResultEnvelope {
  const routeStatus = draftContinuationRouteStatus(result);

  return createReportAssistantResultEnvelope({
    authority: result.ok
      ? result.status === "ready" ? "draft_only" : "needs_input"
      : result.status === "stale" ? "draft_only" : "error",
    capabilityName: "report_assistant_query_route",
    confidenceReason: result.ok
      ? "The assistant merged only structured clarification answers that matched unresolved typed draft inputs."
      : "The assistant rejected the draft continuation before calculator preview.",
    evidence: [
      {
        label: "Layer-stack draft continuation",
        detail: result.draft.draftId
      }
    ],
    routeStatus,
    sourceTrace: [
      {
        detail: result.draft.contextSignature,
        kind: "deterministic",
        label: "report_assistant_layer_stack_draft_continuation"
      }
    ],
    tasks: draftContinuationTasks(result),
    warnings: result.ok
      ? ["Draft continuation is read-only and did not mutate Workbench or calculator state."]
      : []
  });
}

function buildDraftContinuationAnswer(result: ReportAssistantLayerStackDraftContinuationResult): string {
  if (!result.ok) {
    return `Draft continuation rejected: ${result.errors.join(" ")}`;
  }

  if (result.validation.ok) {
    return "Draft continuation applied. The layer-stack draft is ready for calculator preview.";
  }

  return `Draft continuation applied. Remaining inputs: ${result.validation.clarifyingQuestions.join(" ")}`;
}

function buildCalculatorPreviewAnswer(preview: WorkbenchV2CalculatorAssistantPreview): string {
  const stack = preview.describedConfiguration?.layers.length
    ? preview.describedConfiguration.layers
      .map((layer) => `${layer.thicknessMm} mm ${layer.materialName}`)
      .join(" + ")
    : "not parsed";
  const outputs = preview.outputRows
    .slice(0, 8)
    .map((row) => `${row.label}: ${row.value} (${row.detail})`)
    .join("; ");
  const routeLabel = preview.engineSummary?.calculatorLabel ?? preview.engineSummary?.calculatorId ?? preview.engineSummary?.method;
  const taskSummary = preview.tasks.length
    ? ` Needs input: ${preview.tasks.slice(0, 4).map((task) => `${task.label}: ${task.detail}`).join("; ")}`
    : "";

  return [
    `Calculator preview is ${preview.calculationSummary.status}.`,
    `Parsed stack: ${stack}.`,
    `Outputs: ${outputs || "none"}.`,
    routeLabel ? `Route: ${routeLabel}.` : "",
    taskSummary
  ].filter(Boolean).join(" ");
}

function buildWallCandidateComparisonAnswer(preview: ReportAssistantWallCandidateComparisonPreview): string {
  const candidateSummary = preview.candidates
    .map((candidate) => `${candidate.label}: ${candidate.status}`)
    .join("; ");
  const rows = preview.outputRows
    .slice(0, 8)
    .map((row) => `${row.candidateId} ${row.label}: ${row.value} (${row.detail})`)
    .join("; ");
  const ranking = preview.ranking.status === "ready"
    ? ` Ranking: ${preview.ranking.rows.map((row) => `${row.rank}. ${row.label} ${row.valueLabel}`).join("; ")}.`
    : ` Ranking blocked: ${preview.ranking.reason}`;

  return [
    `Wall candidate comparison preview is ${preview.status}.`,
    `Candidates: ${candidateSummary}.`,
    `Outputs: ${rows || "none"}.`,
    ranking
  ].join(" ");
}

function wallCandidateComparisonTasks(
  preview: ReportAssistantWallCandidateComparisonPreview
): ReportAssistantResultTask[] {
  const tasks = preview.candidates.flatMap((candidate) =>
    candidate.tasks.map((task) => ({
      code: `${candidate.candidateId}:${task.code}`,
      message: `${candidate.label}: ${task.message}`,
      severity: "warning" as const
    }))
  );

  if (preview.ranking.status !== "ready") {
    tasks.push({
      code: "assistant_wall_candidate_comparison_ranking_blocked",
      message: preview.ranking.reason,
      severity: "warning"
    });
  }

  if (tasks.length === 0 && preview.status !== "ready") {
    tasks.push({
      code: "assistant_wall_candidate_comparison_not_ready",
      message: "Wall candidate comparison did not produce a live calculator-backed row.",
      severity: "warning"
    });
  }

  return tasks;
}

function wallCandidateComparisonToAssistantResult(
  preview: ReportAssistantWallCandidateComparisonPreview
): ReportAssistantResultEnvelope {
  const basis = preview.outputRows.flatMap((row) =>
    row.basis.map((basisRow) => ({
      basis: `${row.candidateId}:${basisRow.basis}`,
      metricId: basisRow.metricId,
      routeStatus: basisRow.routeStatus,
      unit: basisRow.unit,
      valueLabel: basisRow.valueLabel
    }))
  );
  const tasks = wallCandidateComparisonTasks(preview);
  const authority = basis.length > 0
    ? "calculator_backed"
    : preview.status === "unsupported"
      ? "unsupported"
      : "needs_input";

  return createReportAssistantResultEnvelope({
    authority,
    basis,
    capabilityName: "report_assistant_wall_candidate_comparison_preview",
    confidenceReason: basis.length > 0
      ? "Comparison rows copy only live values returned by the calculator preview route."
      : "The comparison stopped at a typed needs-input or unsupported boundary.",
    evidence: [
      {
        detail: `${String(preview.candidates.length)} candidate(s)`,
        label: "Wall candidate comparison"
      }
    ],
    routeStatus: preview.status,
    sourceTrace: [
      ...preview.outputRows.flatMap((row) =>
        row.sourceTrace.map((trace) => ({
          detail: `${row.candidateId}: ${trace.detail ?? row.label}`,
          kind: trace.kind,
          label: trace.label
        }))
      ),
      {
        detail: preview.comparisonId,
        kind: "deterministic" as const,
        label: "report_assistant_wall_candidate_comparison"
      }
    ],
    tasks,
    warnings: preview.warnings
  });
}

async function runQueryRead(input: {
  invocation: ReportAssistantProjectReadInvocation;
  readProject: ReportAssistantQueryReadRunner;
  usedReads: ReportAssistantQueryUsedRead[];
}): Promise<ReportAssistantProjectReadResult> {
  const result = await input.readProject(input.invocation);
  input.usedReads.push({
    action: input.invocation.name,
    mutates: false
  });
  return result;
}

function failureFromProjectRead(input: {
  evidence: readonly ReportAssistantQueryEvidence[];
  result: Extract<ReportAssistantProjectReadResult, { ok: false }>;
  usedReads: readonly ReportAssistantQueryUsedRead[];
  warnings: readonly string[];
}): ReportAssistantQueryFailure {
  return queryFailure({
    code: input.result.code,
    errors: input.result.errors,
    evidence: input.evidence,
    statusCode: input.result.statusCode,
    usedReads: input.usedReads,
    warnings: input.warnings
  });
}

function summarizeMetricChanges(summary: ReportAssistantDocumentComparisonSummary): string {
  if (summary.metricDisplayValueChanges.length === 0) {
    return "no metric display value changes";
  }

  const changes = summary.metricDisplayValueChanges.slice(0, 5).map((change) =>
    `${change.label}: ${change.beforeValue ?? "not present"} -> ${change.afterValue ?? "not present"}`
  );

  return `${changes.join("; ")}${summary.omittedMetricDisplayValueChangeCount > 0
    ? `; ${summary.omittedMetricDisplayValueChangeCount} more omitted`
    : ""}`;
}

function summarizeCountChanges(summary: ReportAssistantDocumentComparisonSummary): string {
  if (summary.countChanges.length === 0) {
    return "no count changes";
  }

  return summary.countChanges
    .slice(0, 6)
    .map((change) => `${change.field}: ${change.beforeCount} -> ${change.afterCount}`)
    .join("; ");
}

function summarizeComparison(summary: ReportAssistantDocumentComparisonSummary): string {
  const topLevel = summary.topLevelFieldChanges.length > 0
    ? summary.topLevelFieldChanges.slice(0, 8).join(", ")
    : "none";
  const textFields = summary.textFieldSummaries.length > 0
    ? summary.textFieldSummaries.map((entry) => `${entry.field} length ${entry.beforeLength} -> ${entry.afterLength}`).join("; ")
    : "none";
  const adjustment = summary.adjustmentSummary
    ? ` Assistant adjustments: ${summary.adjustmentSummary.assistantAdjustmentCount}/${summary.adjustmentSummary.totalAdjustmentCount}.`
    : "";

  return [
    `Comparison ${summary.kind} is ${summary.status}.`,
    `Metric display changes: ${summarizeMetricChanges(summary)}.`,
    `Count changes: ${summarizeCountChanges(summary)}.`,
    `Top-level fields changed: ${topLevel}.`,
    `Text fields summarized by length: ${textFields}.${adjustment}`
  ].join(" ");
}

function evidenceFromContext(context: ReportAssistantContext): ReportAssistantQueryEvidence[] {
  return [
    {
      label: "Current assistant context",
      referenceId: context.assistantContextSignature,
      source: "current_context"
    }
  ];
}

function getProjectReadResult(result: ReportAssistantProjectReadResult): JsonValue | undefined {
  return result.ok ? result.result : undefined;
}

function getRecordField(value: unknown, key: string): Record<string, unknown> | undefined {
  if (!isRecord(value)) {
    return undefined;
  }
  const field = value[key];
  return isRecord(field) ? field : undefined;
}

function getArrayField(value: unknown, key: string): unknown[] {
  return isRecord(value) && Array.isArray(value[key]) ? value[key] : [];
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function buildContextOnlyAnswer(input: {
  context: ReportAssistantContext;
  normalizedInstruction: string;
  warnings: string[];
}): string {
  const workspace = input.context.projectWorkspace;
  const selectedProject = workspace?.project?.name;
  const selectedReport = workspace?.report?.name;
  const selectedAssembly = workspace?.linkedAssembly?.name;
  const activeDraft = workspace?.activeDraftState;
  const comparison = input.context.documentComparisonSummaries[0];
  const presetSummary = input.context.presetLibrarySummary;

  if (wantsRevisionInfo(input.normalizedInstruction) && comparison) {
    return summarizeComparison(comparison);
  }

  if (wantsPresetRead(input.normalizedInstruction) && presetSummary) {
    return summarizePresetLibraryAnswer({
      context: input.context,
      presetLibrarySummary: presetSummary
    });
  }

  if (selectedProject || selectedReport || selectedAssembly) {
    return [
      selectedProject ? `Selected project: ${selectedProject}.` : "No saved project summary is selected.",
      selectedReport ? `Selected report: ${selectedReport}.` : "No saved report is selected.",
      selectedAssembly ? `Linked assembly: ${selectedAssembly}.` : "No linked assembly summary is available.",
      activeDraft ? `Active draft state: ${activeDraft.kind}, dirty=${String(activeDraft.dirty)}.` : "Active draft state is unavailable."
    ].join(" ");
  }

  input.warnings.push("No saved project is selected, so the answer uses only the current browser report context.");
  return `No saved project is selected. Current report ${input.context.reportId} has ${input.context.metrics.length} assistant-visible metrics and ${input.context.layersSummary.length} layer summary rows.`;
}

function buildSummaryReadPlan(input: {
  allowedActions: ReadonlySet<ReportAssistantQueryReadActionName>;
  context: ReportAssistantContext;
  normalizedInstruction: string;
}): ReportAssistantSummaryReadPlan[] {
  const projectId = getContextProjectId(input.context);
  const reportId = getContextReportId(input.context);
  if (!projectId || !wantsProjectRead(input.normalizedInstruction)) {
    return [];
  }

  const plan: ReportAssistantSummaryReadPlan[] = [];
  if (canRead(input.allowedActions, "read_project_summary")) {
    plan.push({
      name: "read_project_summary",
      projectId
    });
  }
  if (wantsAssemblyList(input.normalizedInstruction) && canRead(input.allowedActions, "list_project_assemblies")) {
    plan.push({
      name: "list_project_assemblies",
      projectId
    });
  }
  if (wantsReportList(input.normalizedInstruction) && canRead(input.allowedActions, "list_project_reports")) {
    plan.push({
      name: "list_project_reports",
      projectId
    });
  }
  if (reportId && wantsRevisionInfo(input.normalizedInstruction) && canRead(input.allowedActions, "list_project_report_revisions")) {
    plan.push({
      name: "list_project_report_revisions",
      projectId,
      reportId
    });
  }

  return plan.slice(0, MAX_QUERY_READS);
}

function withOwner(
  invocation: ReportAssistantSummaryReadPlan,
  owner: ProjectOwnerScope
): ReportAssistantProjectReadInvocation {
  return {
    ...invocation,
    owner
  };
}

function buildAnswerFromSummaryReads(input: {
  context: ReportAssistantContext;
  normalizedInstruction: string;
  readResults: readonly ReportAssistantProjectReadResult[];
  warnings: string[];
}): string {
  const lines = [buildContextOnlyAnswer({
    context: input.context,
    normalizedInstruction: input.normalizedInstruction,
    warnings: input.warnings
  })];

  for (const result of input.readResults) {
    const payload = getProjectReadResult(result);
    if (!payload) {
      continue;
    }

    if (result.name === "read_project_summary") {
      const project = getRecordField(payload, "project");
      const name = readString(project?.name) ?? input.context.projectWorkspace?.project?.name;
      const assemblyCount = typeof project?.assemblyCount === "number" ? project.assemblyCount : undefined;
      const reportCount = typeof project?.reportCount === "number" ? project.reportCount : undefined;
      lines.push(`Project read confirms ${name ?? "the selected project"} with ${assemblyCount ?? "unknown"} assemblies and ${reportCount ?? "unknown"} reports.`);
    }

    if (result.name === "list_project_assemblies") {
      lines.push(`Project read found ${getArrayField(payload, "assemblies").length} saved assembly summaries.`);
    }

    if (result.name === "list_project_reports") {
      lines.push(`Project read found ${getArrayField(payload, "reports").length} saved report summaries.`);
    }

    if (result.name === "list_project_report_revisions") {
      const revisions = getArrayField(payload, "revisions");
      const latest = revisions
        .filter(isRecord)
        .map((revision) => readString(revision.displayCode) ?? readString(revision.id))
        .filter((entry): entry is string => Boolean(entry))
        .at(-1);
      lines.push(`Project read found ${revisions.length} saved revision summaries${latest ? `; latest listed revision is ${latest}` : ""}.`);
    }
  }

  return lines.join(" ");
}

function getRevisionSummariesFromRead(result: ReportAssistantProjectReadResult): Record<string, unknown>[] {
  const payload = getProjectReadResult(result);
  return getArrayField(payload, "revisions").filter(isRecord);
}

function findCurrentAndPreviousRevision(input: {
  context: ReportAssistantContext;
  revisions: readonly Record<string, unknown>[];
}): {
  current?: Record<string, unknown>;
  previous?: Record<string, unknown>;
} {
  const currentRevisionId =
    input.context.projectWorkspace?.currentRevision?.id ??
    input.context.projectWorkspace?.report?.currentRevisionId;
  const ordered = input.revisions.slice().sort((left, right) =>
    String(left.createdAtIso ?? "").localeCompare(String(right.createdAtIso ?? ""))
  );
  const currentIndex = currentRevisionId
    ? ordered.findIndex((revision) => revision.id === currentRevisionId)
    : ordered.length - 1;

  if (currentIndex < 0) {
    return {};
  }

  return {
    current: ordered[currentIndex],
    previous: ordered[currentIndex - 1]
  };
}

function parseProjectReadDocument(result: ReportAssistantProjectReadResult): SimpleWorkbenchProposalDocument | null {
  const payload = getProjectReadResult(result);
  return isRecord(payload) ? parseSimpleWorkbenchProposalDocument(payload.document) : null;
}

async function answerSavedReportComparison(input: {
  allowedActions: ReadonlySet<ReportAssistantQueryReadActionName>;
  context: ReportAssistantContext;
  document?: SimpleWorkbenchProposalDocument;
  evidence: ReportAssistantQueryEvidence[];
  owner: ProjectOwnerScope;
  readProject: ReportAssistantQueryReadRunner;
  usedReads: ReportAssistantQueryUsedRead[];
  warnings: string[];
}): Promise<ReportAssistantQueryResult | null> {
  const projectId = getContextProjectId(input.context);
  const reportId = getContextReportId(input.context);
  if (
    !input.document ||
    !projectId ||
    !reportId ||
    !canRead(input.allowedActions, "read_project_report_document")
  ) {
    return null;
  }

  const readResult = await runQueryRead({
    invocation: {
      name: "read_project_report_document",
      owner: input.owner,
      projectId,
      reportId
    },
    readProject: input.readProject,
    usedReads: input.usedReads
  });
  if (!readResult.ok) {
    return failureFromProjectRead({
      evidence: input.evidence,
      result: readResult,
      usedReads: input.usedReads,
      warnings: input.warnings
    });
  }

  const savedDocument = parseProjectReadDocument(readResult);
  if (!savedDocument) {
    return queryFailure({
      code: "saved_report_document_unavailable",
      errors: ["Saved report document could not be parsed for bounded comparison."],
      evidence: input.evidence,
      statusCode: 422,
      usedReads: input.usedReads,
      warnings: input.warnings
    });
  }

  const comparison = buildReportAssistantDocumentComparisonSummary({
    afterDocument: input.document,
    beforeDocument: savedDocument,
    fromKind: "saved_current_report",
    kind: "current_draft_vs_saved_report",
    projectWorkspace: input.context.projectWorkspace,
    toKind: "current_browser_draft"
  });

  input.evidence.push({
    label: "Saved current report document summarized for comparison",
    referenceId: reportId,
    source: "report_document"
  });

  return querySuccess({
    answer: summarizeComparison(comparison),
    evidence: input.evidence,
    usedReads: input.usedReads,
    warnings: input.warnings
  });
}

async function answerRevisionDocumentComparison(input: {
  allowedActions: ReadonlySet<ReportAssistantQueryReadActionName>;
  context: ReportAssistantContext;
  evidence: ReportAssistantQueryEvidence[];
  owner: ProjectOwnerScope;
  readProject: ReportAssistantQueryReadRunner;
  usedReads: ReportAssistantQueryUsedRead[];
  warnings: string[];
}): Promise<ReportAssistantQueryResult | null> {
  const projectId = getContextProjectId(input.context);
  const reportId = getContextReportId(input.context);
  if (
    !projectId ||
    !reportId ||
    !canRead(input.allowedActions, "list_project_report_revisions") ||
    !canRead(input.allowedActions, "read_project_report_revision")
  ) {
    return null;
  }

  const revisionsResult = await runQueryRead({
    invocation: {
      name: "list_project_report_revisions",
      owner: input.owner,
      projectId,
      reportId
    },
    readProject: input.readProject,
    usedReads: input.usedReads
  });
  if (!revisionsResult.ok) {
    return failureFromProjectRead({
      evidence: input.evidence,
      result: revisionsResult,
      usedReads: input.usedReads,
      warnings: input.warnings
    });
  }

  const { current, previous } = findCurrentAndPreviousRevision({
    context: input.context,
    revisions: getRevisionSummariesFromRead(revisionsResult)
  });
  const currentRevisionId = readString(current?.id);
  const previousRevisionId = readString(previous?.id);
  if (!currentRevisionId || !previousRevisionId) {
    return queryFailure({
      code: "revision_comparison_unavailable",
      errors: ["At least two saved revisions are required for bounded revision comparison."],
      evidence: input.evidence,
      statusCode: 409,
      usedReads: input.usedReads,
      warnings: input.warnings
    });
  }

  const previousResult = await runQueryRead({
    invocation: {
      name: "read_project_report_revision",
      owner: input.owner,
      projectId,
      reportId,
      revisionId: previousRevisionId
    },
    readProject: input.readProject,
    usedReads: input.usedReads
  });
  if (!previousResult.ok) {
    return failureFromProjectRead({
      evidence: input.evidence,
      result: previousResult,
      usedReads: input.usedReads,
      warnings: input.warnings
    });
  }

  const currentResult = await runQueryRead({
    invocation: {
      name: "read_project_report_revision",
      owner: input.owner,
      projectId,
      reportId,
      revisionId: currentRevisionId
    },
    readProject: input.readProject,
    usedReads: input.usedReads
  });
  if (!currentResult.ok) {
    return failureFromProjectRead({
      evidence: input.evidence,
      result: currentResult,
      usedReads: input.usedReads,
      warnings: input.warnings
    });
  }

  const previousDocument = parseProjectReadDocument(previousResult);
  const currentDocument = parseProjectReadDocument(currentResult);
  if (!previousDocument || !currentDocument) {
    return queryFailure({
      code: "revision_document_unavailable",
      errors: ["Revision documents could not be parsed for bounded comparison."],
      evidence: input.evidence,
      statusCode: 422,
      usedReads: input.usedReads,
      warnings: input.warnings
    });
  }

  const comparison = buildReportAssistantDocumentComparisonSummary({
    afterDocument: currentDocument,
    beforeDocument: previousDocument,
    fromKind: "previous_revision",
    kind: "current_revision_vs_previous_revision",
    projectWorkspace: input.context.projectWorkspace,
    toKind: "current_revision"
  });
  const summary = {
    ...comparison,
    from: {
      ...comparison.from,
      revisionId: previousRevisionId,
      updatedAtIso: readString(previous?.createdAtIso)
    },
    to: {
      ...comparison.to,
      revisionId: currentRevisionId,
      updatedAtIso: readString(current?.createdAtIso)
    }
  };

  input.evidence.push(
    {
      label: "Saved report revision summaries",
      referenceId: reportId,
      source: "revision_summary"
    },
    {
      label: "Bounded revision documents summarized for comparison",
      referenceId: `${previousRevisionId}:${currentRevisionId}`,
      source: "report_document"
    }
  );

  return querySuccess({
    answer: summarizeComparison(summary),
    evidence: input.evidence,
    usedReads: input.usedReads,
    warnings: input.warnings
  });
}

function getPresetRouteForCurrentContext(context: ReportAssistantContext): "floor" | "wall" | "unknown" {
  if (context.traceSummary.route === "floor" || context.traceSummary.route === "wall") {
    return context.traceSummary.route;
  }

  return "unknown";
}

function scorePresetCloseness(input: {
  context: ReportAssistantContext;
  preset: ReportAssistantPresetSummary;
}): number {
  const route = getPresetRouteForCurrentContext(input.context);
  const routePenalty = route === "unknown" || route === input.preset.presetRoute ? 0 : 100;
  const layerPenalty = Math.abs(input.context.layersSummary.length - input.preset.layerCount);

  return routePenalty + layerPenalty;
}

function selectClosestPreset(input: {
  context: ReportAssistantContext;
  presets: readonly ReportAssistantPresetSummary[];
}): ReportAssistantPresetSummary | undefined {
  return input.presets
    .slice()
    .sort((left, right) =>
      scorePresetCloseness({ context: input.context, preset: left }) -
      scorePresetCloseness({ context: input.context, preset: right }) ||
      right.updatedAtIso.localeCompare(left.updatedAtIso)
    )[0];
}

function formatPresetSummary(preset: ReportAssistantPresetSummary): string {
  const source = preset.sourceLabel && preset.sourceMetric && preset.sourceTargetValueDb !== undefined
    ? `; source ${preset.sourceLabel} ${preset.sourceMetric} ${preset.sourceTargetValueDb} dB`
    : "";
  const extras = [
    preset.selectedOutputCount ? `${preset.selectedOutputCount} selected outputs` : undefined,
    preset.hasCustomMaterials ? "custom materials" : undefined,
    preset.hasVisualOverrides ? "visual overrides" : undefined
  ].filter((entry): entry is string => Boolean(entry));

  return `${preset.name} (${preset.kind}, ${preset.presetRoute}, ${preset.layerCount} layers${extras.length ? `, ${extras.join(", ")}` : ""}${source})`;
}

function summarizePresetLibraryAnswer(input: {
  context: ReportAssistantContext;
  presetLibrarySummary: ReportAssistantPresetLibrarySummary;
}): string {
  const presets = [
    ...input.presetLibrarySummary.recentUserPresets,
    ...input.presetLibrarySummary.commonPresets
  ];
  const closest = selectClosestPreset({
    context: input.context,
    presets
  });
  const userCount = input.presetLibrarySummary.userPresetCount ?? input.presetLibrarySummary.recentUserPresets.length;

  return [
    `Preset visibility is read-only: ${userCount} user templates and ${input.presetLibrarySummary.commonPresetCount} common templates are visible as summaries.`,
    closest ? `Closest summary match to the current report shape is ${formatPresetSummary(closest)}.` : "No preset summary match is available.",
    "Applying or saving a template is outside this query route."
  ].join(" ");
}

async function loadPresetLibrarySummary(input: {
  allowedActions: ReadonlySet<ReportAssistantQueryReadActionName>;
  owner: ProjectOwnerScope;
  presetRepository: ReportAssistantQueryPresetRepository;
  usedReads: ReportAssistantQueryUsedRead[];
}): Promise<ReportAssistantPresetLibrarySummary> {
  const commonPresets = canRead(input.allowedActions, "list_common_preset_summaries")
    ? undefined
    : [];
  if (canRead(input.allowedActions, "list_common_preset_summaries")) {
    input.usedReads.push({
      action: "list_common_preset_summaries",
      mutates: false
    });
  }

  if (!canRead(input.allowedActions, "list_user_preset_summaries")) {
    return buildReportAssistantPresetLibrarySummary({
      commonPresets
    });
  }

  const userPresets = await input.presetRepository.listPresets(input.owner);
  input.usedReads.push({
    action: "list_user_preset_summaries",
    mutates: false
  });

  return buildReportAssistantPresetLibrarySummary({
    commonPresets,
    userPresets
  });
}

async function answerPresetQuery(input: {
  allowedActions: ReadonlySet<ReportAssistantQueryReadActionName>;
  context: ReportAssistantContext;
  evidence: ReportAssistantQueryEvidence[];
  owner: ProjectOwnerScope;
  presetRepository: ReportAssistantQueryPresetRepository;
  usedReads: ReportAssistantQueryUsedRead[];
  warnings: string[];
}): Promise<ReportAssistantQueryResult | null> {
  const presetLibrarySummary = await loadPresetLibrarySummary({
    allowedActions: input.allowedActions,
    owner: input.owner,
    presetRepository: input.presetRepository,
    usedReads: input.usedReads
  });
  const mergedSummary = {
    commonPresetCount: presetLibrarySummary.commonPresetCount || input.context.presetLibrarySummary?.commonPresetCount || 0,
    commonPresets: presetLibrarySummary.commonPresets.length
      ? presetLibrarySummary.commonPresets
      : input.context.presetLibrarySummary?.commonPresets ?? [],
    recentUserPresets: presetLibrarySummary.recentUserPresets.length
      ? presetLibrarySummary.recentUserPresets
      : input.context.presetLibrarySummary?.recentUserPresets ?? [],
    userPresetCount: presetLibrarySummary.userPresetCount ?? input.context.presetLibrarySummary?.userPresetCount
  };

  input.evidence.push({
    label: "Preset library summaries",
    source: "preset_summary"
  });

  return querySuccess({
    answer: summarizePresetLibraryAnswer({
      context: input.context,
      presetLibrarySummary: mergedSummary
    }),
    evidence: input.evidence,
    usedReads: input.usedReads,
    warnings: input.warnings
  });
}

export async function answerReportAssistantQuery(
  input: ReportAssistantQueryInput
): Promise<ReportAssistantQueryResult> {
  const instruction = input.instruction.trim();
  if (instruction.length === 0) {
    return queryFailure({
      code: "empty_query_instruction",
      errors: ["Query instruction cannot be empty."],
      statusCode: 400
    });
  }

  const normalizedInstruction = normalizeQueryText(instruction);
  const evidence = evidenceFromContext(input.context);
  const usedReads: ReportAssistantQueryUsedRead[] = [];
  const warnings: string[] = [];

  if (input.draftContinuation) {
    const continuationResult = mergeReportAssistantLayerStackDraftContinuation(input.draftContinuation);
    const assistantResult = draftContinuationToAssistantResult(continuationResult);
    const continuationEvidence = [
      ...evidence,
      {
        label: "Layer-stack draft continuation",
        referenceId: input.draftContinuation.draft.draftId,
        source: "current_context" as const
      }
    ];

    if (!continuationResult.ok) {
      return queryFailure({
        assistantResults: [assistantResult],
        code: continuationResult.status === "stale"
          ? "stale_report_assistant_layer_stack_draft"
          : "invalid_report_assistant_layer_stack_draft_answer",
        errors: continuationResult.errors,
        evidence: continuationEvidence,
        statusCode: continuationResult.status === "stale" ? 409 : 400,
        usedReads,
        warnings
      });
    }

    warnings.push("Draft continuation is read-only and did not mutate Workbench or calculator state.");

    if (continuationResult.status === "ready") {
      const calculatorPreview = previewReportAssistantLayerStackDraft({
        draft: continuationResult.draft
      });

      if (!calculatorPreview.ok) {
        return queryFailure({
          assistantResults: [assistantResult],
          code: calculatorPreview.code,
          errors: calculatorPreview.errors,
          evidence: continuationEvidence,
          statusCode: calculatorPreview.statusCode,
          usedReads,
          warnings
        });
      }

      const queryCalculatorPreview = {
        mutates: false,
        name: "preview_layer_stack_draft",
        preview: calculatorPreview.preview,
        previewOnly: true
      } as const satisfies ReportAssistantQueryCalculatorPreview;
      warnings.push("Calculator preview is read-only and did not mutate the report or Workbench stack.");

      return querySuccess({
        answer: buildCalculatorPreviewAnswer(calculatorPreview.preview),
        assistantResults: [
          calculatorPreviewToAssistantResult(queryCalculatorPreview)
        ],
        calculatorPreview: queryCalculatorPreview,
        evidence: continuationEvidence,
        layerStackDraft: calculatorPreview.preview.layerStackDraft ?? {
          draft: continuationResult.draft,
          validation: continuationResult.validation
        },
        usedReads,
        warnings
      });
    }

    return querySuccess({
      answer: buildDraftContinuationAnswer(continuationResult),
      assistantResults: [assistantResult],
      evidence: continuationEvidence,
      layerStackDraft: {
        draft: continuationResult.draft,
        validation: continuationResult.validation
      },
      usedReads,
      warnings
    });
  }

  if (hasMutationIntent(normalizedInstruction)) {
    return queryFailure({
      code: "mutation_intent_not_supported",
      errors: ["Assistant query is read-only. Save, apply, export, restore, update, and delete requests are not supported here."],
      statusCode: 400
    });
  }

  const allowedActions = getAllowedActions(input.allowedReadActions);
  const readProject = input.readProject ?? runReportAssistantProjectReadTool;
  const presetRepository = input.presetRepository ?? createDefaultWorkbenchV2PresetRepository();

  if (wantsWallCandidateComparison(normalizedInstruction)) {
    const comparison = createReportAssistantWallCandidateComparison({
      instruction
    });

    if (!comparison.ok) {
      return queryFailure({
        code: comparison.code,
        errors: [comparison.message],
        evidence,
        statusCode: comparison.code === "unsupported_wall_candidate_comparison_route" ? 422 : 400,
        usedReads,
        warnings
      });
    }

    const comparisonPreview = previewReportAssistantWallCandidateComparison({
      comparison: comparison.comparison
    });

    evidence.push({
      label: "Wall candidate comparison preview",
      source: "calculator_preview"
    });
    warnings.push("Wall candidate comparison preview is read-only and did not mutate the report or Workbench stack.");

    return querySuccess({
      answer: buildWallCandidateComparisonAnswer(comparisonPreview),
      assistantResults: [
        wallCandidateComparisonToAssistantResult(comparisonPreview)
      ],
      evidence,
      usedReads,
      warnings
    });
  }

  if (wantsDescribedCalculatorPreview(normalizedInstruction)) {
    const calculatorPreview = previewDescribedLayerConfiguration({
      description: instruction
    });

    if (!calculatorPreview.ok) {
      return queryFailure({
        code: calculatorPreview.code,
        errors: calculatorPreview.errors,
        evidence,
        statusCode: calculatorPreview.statusCode,
        usedReads,
        warnings
      });
    }

    evidence.push({
      label: "Calculator preview from described layer configuration",
      source: "calculator_preview"
    });
    warnings.push("Calculator preview is read-only and did not mutate the report or Workbench stack.");

    const queryCalculatorPreview = {
      mutates: false,
      name: "preview_described_layer_configuration",
      preview: calculatorPreview.preview,
      previewOnly: true
    } as const satisfies ReportAssistantQueryCalculatorPreview;

    return querySuccess({
      answer: buildCalculatorPreviewAnswer(calculatorPreview.preview),
      assistantResults: [
        calculatorPreviewToAssistantResult(queryCalculatorPreview)
      ],
      calculatorPreview: queryCalculatorPreview,
      evidence,
      ...(calculatorPreview.preview.layerStackDraft
        ? { layerStackDraft: calculatorPreview.preview.layerStackDraft }
        : {}),
      usedReads,
      warnings
    });
  }

  if (wantsPresetRead(normalizedInstruction)) {
    const presetAnswer = await answerPresetQuery({
      allowedActions,
      context: input.context,
      evidence,
      owner: input.owner,
      presetRepository,
      usedReads,
      warnings
    });
    if (presetAnswer) {
      return presetAnswer;
    }
  }

  if (wantsRevisionDocumentComparison(normalizedInstruction)) {
    const revisionComparison = await answerRevisionDocumentComparison({
      allowedActions,
      context: input.context,
      evidence,
      owner: input.owner,
      readProject,
      usedReads,
      warnings
    });
    if (revisionComparison) {
      return revisionComparison;
    }
  }

  if (wantsSavedReportComparison(normalizedInstruction)) {
    const savedReportComparison = await answerSavedReportComparison({
      allowedActions,
      context: input.context,
      document: input.document,
      evidence,
      owner: input.owner,
      readProject,
      usedReads,
      warnings
    });
    if (savedReportComparison) {
      return savedReportComparison;
    }
  }

  const plan = buildSummaryReadPlan({
    allowedActions,
    context: input.context,
    normalizedInstruction
  });
  const readResults: ReportAssistantProjectReadResult[] = [];

  for (const plannedRead of plan) {
    const result = await runQueryRead({
      invocation: withOwner(plannedRead, input.owner),
      readProject,
      usedReads
    });
    if (!result.ok) {
      return failureFromProjectRead({
        evidence,
        result,
        usedReads,
        warnings
      });
    }
    readResults.push(result);
    evidence.push({
      label: `Project read: ${result.name}`,
      referenceId: getContextProjectId(input.context),
      source: result.name === "list_project_report_revisions" ? "revision_summary" : "project_read"
    });
  }

  if (plan.length === 0 && wantsProjectRead(normalizedInstruction) && !getContextProjectId(input.context)) {
    warnings.push("No selected project id is available for project reads.");
  }

  return querySuccess({
    answer: buildAnswerFromSummaryReads({
      context: input.context,
      normalizedInstruction,
      readResults,
      warnings
    }),
    evidence,
    usedReads,
    warnings
  });
}

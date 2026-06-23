import {
  isRequestedOutputId,
  normalizeReportAssistantMetricLabel,
  type ReportAssistantContext,
  type ReportAssistantDocumentComparisonAdjustmentSummary,
  type ReportAssistantDocumentComparisonCountChange,
  type ReportAssistantDocumentComparisonMetricChange,
  type ReportAssistantDocumentComparisonReference,
  type ReportAssistantDocumentComparisonSummary,
  type ReportAssistantDocumentComparisonTextFieldSummary,
  type ReportAssistantMetric,
  type ReportAssistantMetricLocation,
  type ReportAssistantOutputFact,
  type ReportAssistantOutputFactBasisCategory,
  type ReportAssistantProjectWorkspaceActiveDraftState,
  type ReportAssistantProjectWorkspaceAssembly,
  type ReportAssistantProjectWorkspaceReport,
  type ReportAssistantProjectWorkspaceRevision,
  type ReportAssistantProjectWorkspaceSnapshot,
  type ReportAssistantReportAdjustmentSummary,
  type ReportAssistantTraceSummary
} from "./report-assistant-context";
import { parseSimpleWorkbenchAssistantTraceSnapshot } from "./simple-workbench-assistant-trace-snapshot";
import type { SimpleWorkbenchProposalCoverageStatus } from "./simple-workbench-proposal";
import type { ReportAssistantPatch } from "./report-assistant-patch";
import { REPORT_ASSISTANT_PROJECT_READ_TOOL_DEFINITIONS } from "./report-assistant-project-read-contract";
import type {
  ReportAssistantPresetLibrarySummary,
  ReportAssistantPresetSummary
} from "./report-assistant-preset-library";

export type ReportAssistantInstructionPatchResult =
  | {
      errors: readonly string[];
      ok: false;
      warnings: readonly string[];
    }
  | {
      ok: true;
      patch: ReportAssistantPatch;
      warnings: readonly string[];
    };

const METRIC_STATUSES = new Set<string>(["bound", "live", "needs_input", "unsupported"]);
const METRIC_BASES = new Set<string>(["building_prediction", "field", "lab", "unknown"]);
const METRIC_DIRECTIONS = new Set<string>(["higher_is_better", "lower_is_better", "neutral"]);
const PROJECT_REPORT_STATUSES = new Set<string>(["archived", "draft", "issued"]);
const PROJECT_REVISION_SOURCES = new Set<string>(["assistant", "generated", "import", "manual"]);
const REPORT_ADJUSTMENT_SCOPES = new Set<string>(["export_only", "saved_snapshot"]);
const REPORT_ADJUSTMENT_SOURCES = new Set<string>(["assistant", "manual"]);
const DOCUMENT_COMPARISON_REFERENCE_KINDS = new Set<string>([
  "current_browser_draft",
  "current_revision",
  "generated_baseline",
  "previous_revision",
  "saved_current_report"
]);
const DOCUMENT_COMPARISON_KINDS = new Set<string>([
  "current_draft_vs_generated_baseline",
  "current_draft_vs_saved_report",
  "current_revision_vs_previous_revision"
]);
const DOCUMENT_COMPARISON_STATUSES = new Set<string>(["available", "stale", "unavailable"]);
const DOCUMENT_COMPARISON_SURFACES = new Set<string>(["coverage", "metric", "primary"]);
const DOCUMENT_COMPARISON_COUNT_FIELDS = new Set<string>([
  "assumptions",
  "citations",
  "decisionTrail",
  "issueRegister",
  "recommendations",
  "warnings"
]);
const DOCUMENT_COMPARISON_TEXT_FIELDS = new Set<string>([
  "briefNote",
  "dynamicBranchDetail",
  "executiveSummary",
  "validationDetail"
]);
const PRESET_KINDS = new Set<string>(["common", "user"]);
const PRESET_ROUTES = new Set<string>(["floor", "wall"]);
const OUTPUT_FACT_BASIS_CATEGORIES = new Set<string>([
  "bound",
  "exact_measured",
  "field_adapter",
  "formula_corridor",
  "needs_input",
  "published_anchor",
  "source_absent_estimate",
  "unknown",
  "unsupported"
]);
const FORBIDDEN_ACTION_HINTS = /\b(?:apply|export|download|save|reset|write|delete|read\s+file|tool|system|ignore)\b/iu;

function canCarryCalculatorBackedMetricValue(status: SimpleWorkbenchProposalCoverageStatus): boolean {
  return status === "live" || status === "bound";
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeInstructionText(value: string): string {
  return value
    .replace(/[İIı]/gu, "i")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function normalizeLooseMetricLabel(value: string): string {
  return normalizeReportAssistantMetricLabel(value).replace(/[^a-z0-9]/gu, "");
}

function parseMetricLocation(value: unknown): ReportAssistantMetricLocation | null {
  if (!isObjectRecord(value) || typeof value.kind !== "string") {
    return null;
  }

  if (value.kind === "primaryMetric") {
    return { kind: "primaryMetric" };
  }

  if ((value.kind === "metricRow" || value.kind === "coverageRow") && typeof value.index === "number" && Number.isInteger(value.index) && value.index >= 0) {
    return {
      index: value.index,
      kind: value.kind
    };
  }

  return null;
}

function parseTraceSummary(value: unknown): ReportAssistantTraceSummary | null {
  if (!isObjectRecord(value) || !Array.isArray(value.missingPhysicalInputs) || !Array.isArray(value.unsupportedOutputs) || !Array.isArray(value.warnings)) {
    return null;
  }

  const route = value.route === "wall" || value.route === "floor" || value.route === "unknown" ? value.route : "unknown";
  const unsupportedOutputs = value.unsupportedOutputs.filter(isRequestedOutputId);
  const warnings = value.warnings.filter((entry): entry is string => typeof entry === "string");
  const missingPhysicalInputs = value.missingPhysicalInputs.filter((entry): entry is string => typeof entry === "string");

  return {
    basis: typeof value.basis === "string" ? value.basis : undefined,
    dynamicAirborneFamily: typeof value.dynamicAirborneFamily === "string" ? value.dynamicAirborneFamily : undefined,
    dynamicImpactFamily: typeof value.dynamicImpactFamily === "string" ? value.dynamicImpactFamily : undefined,
    missingPhysicalInputs,
    route,
    selectedCandidateId: typeof value.selectedCandidateId === "string" ? value.selectedCandidateId : undefined,
    selectedOrigin: typeof value.selectedOrigin === "string" ? value.selectedOrigin : undefined,
    unsupportedOutputs,
    warnings
  };
}

function parseAssistantMetric(value: unknown): ReportAssistantMetric | null {
  if (!isObjectRecord(value) || !Array.isArray(value.locations)) {
    return null;
  }

  const locations = value.locations
    .map((entry) => parseMetricLocation(entry))
    .filter((entry): entry is ReportAssistantMetricLocation => entry !== null);

  if (
    typeof value.id !== "string" ||
    typeof value.label !== "string" ||
    typeof value.metric !== "string" ||
    typeof value.reportDisplayValue !== "string" ||
    !METRIC_STATUSES.has(String(value.status)) ||
    !METRIC_BASES.has(String(value.basis)) ||
    !METRIC_DIRECTIONS.has(String(value.direction)) ||
    locations.length === 0
  ) {
    return null;
  }

  const status = value.status as SimpleWorkbenchProposalCoverageStatus;
  const canCarryCalculatorValue = canCarryCalculatorBackedMetricValue(status);

  return {
    basis: value.basis as ReportAssistantMetric["basis"],
    direction: value.direction as ReportAssistantMetric["direction"],
    engineDisplayValue: canCarryCalculatorValue && typeof value.engineDisplayValue === "string" ? value.engineDisplayValue : undefined,
    id: value.id,
    label: value.label,
    locations,
    metric: value.metric,
    numericDb: canCarryCalculatorValue && typeof value.numericDb === "number" && Number.isFinite(value.numericDb) ? value.numericDb : undefined,
    outputId: isRequestedOutputId(value.outputId) ? value.outputId : undefined,
    reportDisplayValue: value.reportDisplayValue,
    status
  };
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
}

function fallbackOutputFactFromMetric(metric: ReportAssistantMetric): ReportAssistantOutputFact {
  return {
    basis: metric.basis,
    basisCategory:
      metric.status === "bound" || metric.status === "needs_input" || metric.status === "unsupported"
        ? metric.status
        : "unknown",
    engineDisplayValue: metric.engineDisplayValue,
    label: metric.label,
    metricId: metric.id,
    missingInputs: [],
    outputId: metric.outputId,
    reportDisplayValue: metric.reportDisplayValue,
    status: metric.status,
    usedInputs: [],
    warnings: []
  };
}

function parseAssistantOutputFact(value: unknown, metrics: readonly ReportAssistantMetric[]): ReportAssistantOutputFact | null {
  if (!isObjectRecord(value)) {
    return null;
  }

  const metric =
    typeof value.metricId === "string"
      ? metrics.find((entry) => entry.id === value.metricId)
      : undefined;
  const outputId = isRequestedOutputId(value.outputId) ? value.outputId : metric?.outputId;
  const basis = METRIC_BASES.has(String(value.basis))
    ? (value.basis as ReportAssistantMetric["basis"])
    : metric?.basis;
  const status = METRIC_STATUSES.has(String(value.status))
    ? (value.status as SimpleWorkbenchProposalCoverageStatus)
    : metric?.status;

  if (
    typeof value.metricId !== "string" ||
    typeof value.label !== "string" ||
    typeof value.reportDisplayValue !== "string" ||
    !basis ||
    !status
  ) {
    return null;
  }

  const canCarryCalculatorValue = canCarryCalculatorBackedMetricValue(status);
  const usedInputs = stringArray(value.usedInputs).filter(
    (entry) => canCarryCalculatorValue || !/\bvalue\s+pin\b/iu.test(entry)
  );

  return {
    basis,
    basisCategory: OUTPUT_FACT_BASIS_CATEGORIES.has(String(value.basisCategory))
      ? (value.basisCategory as ReportAssistantOutputFactBasisCategory)
      : fallbackOutputFactFromMetric(metric ?? {
          basis,
          direction: "neutral",
          id: value.metricId,
          label: value.label,
          locations: [],
          metric: outputId ?? value.label,
          outputId,
          reportDisplayValue: value.reportDisplayValue,
          status
        }).basisCategory,
    // Coordination note: old serialized contexts may contain blocked calculator values; preserve report text but drop numeric evidence.
    engineDisplayValue: canCarryCalculatorValue
      ? typeof value.engineDisplayValue === "string" ? value.engineDisplayValue : metric?.engineDisplayValue
      : undefined,
    formulaOrSupportNote: typeof value.formulaOrSupportNote === "string" ? value.formulaOrSupportNote : undefined,
    label: value.label,
    metricId: value.metricId,
    missingInputs: stringArray(value.missingInputs),
    outputId,
    parkedReason: typeof value.parkedReason === "string" ? value.parkedReason : undefined,
    reportDisplayValue: value.reportDisplayValue,
    selectedCandidateId: typeof value.selectedCandidateId === "string" ? value.selectedCandidateId : undefined,
    status,
    supportBucket: typeof value.supportBucket === "string" ? value.supportBucket : undefined,
    usedInputs,
    valuePinDb: canCarryCalculatorValue && typeof value.valuePinDb === "number" && Number.isFinite(value.valuePinDb) ? value.valuePinDb : undefined,
    warnings: stringArray(value.warnings)
  };
}

function parseReportAdjustmentSummary(value: unknown): ReportAssistantReportAdjustmentSummary | null {
  if (
    !isObjectRecord(value) ||
    typeof value.afterValue !== "string" ||
    typeof value.appliedAtIso !== "string" ||
    typeof value.beforeValue !== "string" ||
    value.engineValuePreserved !== true ||
    typeof value.label !== "string" ||
    typeof value.metricId !== "string" ||
    typeof value.reason !== "string" ||
    !REPORT_ADJUSTMENT_SCOPES.has(String(value.scope)) ||
    !REPORT_ADJUSTMENT_SOURCES.has(String(value.source))
  ) {
    return null;
  }

  return {
    afterValue: value.afterValue,
    appliedAtIso: value.appliedAtIso,
    beforeValue: value.beforeValue,
    engineValuePreserved: true,
    label: value.label,
    metricId: value.metricId,
    reason: value.reason,
    scope: value.scope as ReportAssistantReportAdjustmentSummary["scope"],
    source: value.source as ReportAssistantReportAdjustmentSummary["source"]
  };
}

function parseDocumentComparisonReference(value: unknown): ReportAssistantDocumentComparisonReference | null {
  if (!isObjectRecord(value) || !DOCUMENT_COMPARISON_REFERENCE_KINDS.has(String(value.kind))) {
    return null;
  }

  return {
    documentSignature: typeof value.documentSignature === "string" ? value.documentSignature : undefined,
    issuedOnIso: typeof value.issuedOnIso === "string" ? value.issuedOnIso : undefined,
    kind: value.kind as ReportAssistantDocumentComparisonReference["kind"],
    projectId: typeof value.projectId === "string" ? value.projectId : undefined,
    proposalReference: typeof value.proposalReference === "string" ? value.proposalReference : undefined,
    proposalRevision: typeof value.proposalRevision === "string" ? value.proposalRevision : undefined,
    reportId: typeof value.reportId === "string" ? value.reportId : undefined,
    revisionId: typeof value.revisionId === "string" ? value.revisionId : undefined,
    updatedAtIso: typeof value.updatedAtIso === "string" ? value.updatedAtIso : undefined
  };
}

function parseDocumentComparisonMetricChange(value: unknown): ReportAssistantDocumentComparisonMetricChange | null {
  if (
    !isObjectRecord(value) ||
    typeof value.label !== "string" ||
    typeof value.metricId !== "string" ||
    !DOCUMENT_COMPARISON_SURFACES.has(String(value.surface))
  ) {
    return null;
  }

  return {
    afterValue: typeof value.afterValue === "string" ? value.afterValue : undefined,
    beforeValue: typeof value.beforeValue === "string" ? value.beforeValue : undefined,
    label: value.label,
    metricId: value.metricId,
    outputId: isRequestedOutputId(value.outputId) ? value.outputId : undefined,
    surface: value.surface as ReportAssistantDocumentComparisonMetricChange["surface"]
  };
}

function parseDocumentComparisonCountChange(value: unknown): ReportAssistantDocumentComparisonCountChange | null {
  if (
    !isObjectRecord(value) ||
    !DOCUMENT_COMPARISON_COUNT_FIELDS.has(String(value.field)) ||
    typeof value.afterCount !== "number" ||
    typeof value.beforeCount !== "number" ||
    !Number.isFinite(value.afterCount) ||
    !Number.isFinite(value.beforeCount)
  ) {
    return null;
  }

  return {
    afterCount: value.afterCount,
    beforeCount: value.beforeCount,
    field: value.field as ReportAssistantDocumentComparisonCountChange["field"]
  };
}

function parseDocumentComparisonTextFieldSummary(value: unknown): ReportAssistantDocumentComparisonTextFieldSummary | null {
  if (
    !isObjectRecord(value) ||
    !DOCUMENT_COMPARISON_TEXT_FIELDS.has(String(value.field)) ||
    typeof value.afterLength !== "number" ||
    typeof value.beforeLength !== "number" ||
    !Number.isFinite(value.afterLength) ||
    !Number.isFinite(value.beforeLength)
  ) {
    return null;
  }

  return {
    afterLength: value.afterLength,
    beforeLength: value.beforeLength,
    field: value.field as ReportAssistantDocumentComparisonTextFieldSummary["field"]
  };
}

function parseDocumentComparisonAdjustmentSummary(value: unknown): ReportAssistantDocumentComparisonAdjustmentSummary | undefined {
  if (
    !isObjectRecord(value) ||
    typeof value.assistantAdjustmentCount !== "number" ||
    typeof value.totalAdjustmentCount !== "number" ||
    !Number.isFinite(value.assistantAdjustmentCount) ||
    !Number.isFinite(value.totalAdjustmentCount)
  ) {
    return undefined;
  }

  return {
    assistantAdjustmentCount: value.assistantAdjustmentCount,
    latestAppliedAtIso: typeof value.latestAppliedAtIso === "string" ? value.latestAppliedAtIso : undefined,
    totalAdjustmentCount: value.totalAdjustmentCount
  };
}

function parseDocumentComparisonSummary(value: unknown): ReportAssistantDocumentComparisonSummary | null {
  if (
    !isObjectRecord(value) ||
    typeof value.comparisonId !== "string" ||
    !DOCUMENT_COMPARISON_KINDS.has(String(value.kind)) ||
    !DOCUMENT_COMPARISON_STATUSES.has(String(value.status))
  ) {
    return null;
  }

  const from = parseDocumentComparisonReference(value.from);
  const to = parseDocumentComparisonReference(value.to);
  if (!from || !to) {
    return null;
  }

  return {
    adjustmentSummary: parseDocumentComparisonAdjustmentSummary(value.adjustmentSummary),
    comparisonId: value.comparisonId,
    countChanges: Array.isArray(value.countChanges)
      ? value.countChanges
          .map((entry) => parseDocumentComparisonCountChange(entry))
          .filter((entry): entry is ReportAssistantDocumentComparisonCountChange => entry !== null)
      : [],
    from,
    kind: value.kind as ReportAssistantDocumentComparisonSummary["kind"],
    metricDisplayValueChanges: Array.isArray(value.metricDisplayValueChanges)
      ? value.metricDisplayValueChanges
          .map((entry) => parseDocumentComparisonMetricChange(entry))
          .filter((entry): entry is ReportAssistantDocumentComparisonMetricChange => entry !== null)
      : [],
    omittedMetricDisplayValueChangeCount:
      typeof value.omittedMetricDisplayValueChangeCount === "number" &&
      Number.isFinite(value.omittedMetricDisplayValueChangeCount)
        ? value.omittedMetricDisplayValueChangeCount
        : 0,
    status: value.status as ReportAssistantDocumentComparisonSummary["status"],
    statusReason: typeof value.statusReason === "string" ? value.statusReason : undefined,
    textFieldSummaries: Array.isArray(value.textFieldSummaries)
      ? value.textFieldSummaries
          .map((entry) => parseDocumentComparisonTextFieldSummary(entry))
          .filter((entry): entry is ReportAssistantDocumentComparisonTextFieldSummary => entry !== null)
      : [],
    to,
    topLevelFieldChanges: stringArray(value.topLevelFieldChanges)
  };
}

function parsePresetSummary(value: unknown): ReportAssistantPresetSummary | null {
  if (
    !isObjectRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    !PRESET_KINDS.has(String(value.kind)) ||
    !PRESET_ROUTES.has(String(value.presetRoute)) ||
    typeof value.layerCount !== "number" ||
    !Number.isInteger(value.layerCount) ||
    value.layerCount < 0 ||
    typeof value.selectedOutputCount !== "number" ||
    !Number.isInteger(value.selectedOutputCount) ||
    value.selectedOutputCount < 0 ||
    typeof value.hasCustomMaterials !== "boolean" ||
    typeof value.hasVisualOverrides !== "boolean" ||
    typeof value.updatedAtIso !== "string"
  ) {
    return null;
  }

  return {
    description: typeof value.description === "string" ? value.description : undefined,
    hasCustomMaterials: value.hasCustomMaterials,
    hasVisualOverrides: value.hasVisualOverrides,
    id: value.id,
    kind: value.kind as ReportAssistantPresetSummary["kind"],
    layerCount: value.layerCount,
    name: value.name,
    presetRoute: value.presetRoute as ReportAssistantPresetSummary["presetRoute"],
    selectedOutputCount: value.selectedOutputCount,
    sourceLabel: typeof value.sourceLabel === "string" ? value.sourceLabel : undefined,
    sourceMetric: typeof value.sourceMetric === "string" ? value.sourceMetric : undefined,
    sourceTargetValueDb:
      typeof value.sourceTargetValueDb === "number" && Number.isFinite(value.sourceTargetValueDb)
        ? value.sourceTargetValueDb
        : undefined,
    tags: stringArray(value.tags).slice(0, 8),
    updatedAtIso: value.updatedAtIso
  };
}

function parsePresetLibrarySummary(value: unknown): ReportAssistantPresetLibrarySummary | undefined {
  if (
    !isObjectRecord(value) ||
    typeof value.commonPresetCount !== "number" ||
    !Number.isInteger(value.commonPresetCount) ||
    value.commonPresetCount < 0 ||
    !Array.isArray(value.commonPresets) ||
    !Array.isArray(value.recentUserPresets)
  ) {
    return undefined;
  }

  return {
    commonPresetCount: value.commonPresetCount,
    commonPresets: value.commonPresets
      .map((entry) => parsePresetSummary(entry))
      .filter((entry): entry is ReportAssistantPresetSummary => entry !== null),
    recentUserPresets: value.recentUserPresets
      .map((entry) => parsePresetSummary(entry))
      .filter((entry): entry is ReportAssistantPresetSummary => entry !== null),
    userPresetCount:
      typeof value.userPresetCount === "number" &&
      Number.isInteger(value.userPresetCount) &&
      value.userPresetCount >= 0
        ? value.userPresetCount
        : undefined
  };
}

function parseProjectWorkspaceReport(value: unknown): ReportAssistantProjectWorkspaceReport | undefined {
  if (!isObjectRecord(value) || typeof value.id !== "string" || typeof value.name !== "string") {
    return undefined;
  }

  return {
    assemblyId: typeof value.assemblyId === "string" ? value.assemblyId : undefined,
    currentRevisionId: typeof value.currentRevisionId === "string" ? value.currentRevisionId : undefined,
    description: typeof value.description === "string" ? value.description : undefined,
    displayCode: typeof value.displayCode === "string" ? value.displayCode : undefined,
    id: value.id,
    name: value.name,
    revisionCount: typeof value.revisionCount === "number" && Number.isFinite(value.revisionCount) ? value.revisionCount : undefined,
    status: PROJECT_REPORT_STATUSES.has(String(value.status)) ? value.status as ReportAssistantProjectWorkspaceReport["status"] : undefined,
    updatedAtIso: typeof value.updatedAtIso === "string" ? value.updatedAtIso : undefined
  };
}

function parseProjectWorkspaceAssembly(value: unknown): ReportAssistantProjectWorkspaceAssembly | undefined {
  if (
    !isObjectRecord(value) ||
    typeof value.id !== "string" ||
    (value.kind !== "floor" && value.kind !== "wall") ||
    typeof value.name !== "string" ||
    typeof value.version !== "number" ||
    !Number.isFinite(value.version)
  ) {
    return undefined;
  }

  const calculationStatus =
    value.calculationStatus === "error" ||
    value.calculationStatus === "needs_input" ||
    value.calculationStatus === "ready" ||
    value.calculationStatus === "unsupported"
      ? value.calculationStatus
      : undefined;

  return {
    calculationPrimaryOutput: typeof value.calculationPrimaryOutput === "string" ? value.calculationPrimaryOutput : undefined,
    calculationPrimaryValueLabel: typeof value.calculationPrimaryValueLabel === "string" ? value.calculationPrimaryValueLabel : undefined,
    calculationStatus,
    displayCode: typeof value.displayCode === "string" ? value.displayCode : undefined,
    id: value.id,
    kind: value.kind,
    name: value.name,
    updatedAtIso: typeof value.updatedAtIso === "string" ? value.updatedAtIso : undefined,
    version: value.version
  };
}

function parseProjectWorkspaceActiveDraftState(
  value: unknown
): ReportAssistantProjectWorkspaceActiveDraftState | undefined {
  if (!isObjectRecord(value) || typeof value.dirty !== "boolean") {
    return undefined;
  }

  const kind =
    value.kind === "combination_clean" ||
    value.kind === "combination_dirty" ||
    value.kind === "local_draft" ||
    value.kind === "project_draft" ||
    value.kind === "project_report_draft" ||
    value.kind === "template_draft"
      ? value.kind
      : undefined;
  if (!kind) {
    return undefined;
  }

  return {
    assemblyId: typeof value.assemblyId === "string" ? value.assemblyId : undefined,
    assemblyName: typeof value.assemblyName === "string" ? value.assemblyName : undefined,
    assemblyVersion: typeof value.assemblyVersion === "number" && Number.isFinite(value.assemblyVersion) ? value.assemblyVersion : undefined,
    dirty: value.dirty,
    kind,
    projectId: typeof value.projectId === "string" ? value.projectId : undefined,
    projectName: typeof value.projectName === "string" ? value.projectName : undefined,
    reportId: typeof value.reportId === "string" ? value.reportId : undefined,
    reportUpdatedAtIso: typeof value.reportUpdatedAtIso === "string" ? value.reportUpdatedAtIso : undefined
  };
}

function parseProjectWorkspaceRevision(value: unknown): ReportAssistantProjectWorkspaceRevision | null {
  if (
    !isObjectRecord(value) ||
    typeof value.createdAtIso !== "string" ||
    typeof value.id !== "string" ||
    !PROJECT_REVISION_SOURCES.has(String(value.source))
  ) {
    return null;
  }

  const assistantPatchSummary = isObjectRecord(value.assistantPatchSummary) &&
    typeof value.assistantPatchSummary.operationCount === "number" &&
    typeof value.assistantPatchSummary.validationStatus === "string" &&
    ["valid", "warning"].includes(value.assistantPatchSummary.validationStatus)
    ? {
        operationCount: value.assistantPatchSummary.operationCount,
        validationStatus: value.assistantPatchSummary.validationStatus as "valid" | "warning"
      }
    : undefined;

  return {
    assistantPatchSummary,
    changeSummary: typeof value.changeSummary === "string" ? value.changeSummary : undefined,
    createdAtIso: value.createdAtIso,
    displayCode: typeof value.displayCode === "string" ? value.displayCode : undefined,
    id: value.id,
    source: value.source as ReportAssistantProjectWorkspaceRevision["source"]
  };
}

function parseProjectWorkspaceSnapshot(value: unknown): ReportAssistantProjectWorkspaceSnapshot | undefined {
  if (!isObjectRecord(value) || !Array.isArray(value.revisionSummaries)) {
    return undefined;
  }

  const project = isObjectRecord(value.project) && typeof value.project.id === "string" && typeof value.project.name === "string"
    ? {
        assemblyCount: typeof value.project.assemblyCount === "number" ? value.project.assemblyCount : undefined,
        clientName: typeof value.project.clientName === "string" ? value.project.clientName : undefined,
        id: value.project.id,
        latestAssemblyUpdatedAtIso: typeof value.project.latestAssemblyUpdatedAtIso === "string" || value.project.latestAssemblyUpdatedAtIso === null
          ? value.project.latestAssemblyUpdatedAtIso
          : undefined,
        latestReportUpdatedAtIso: typeof value.project.latestReportUpdatedAtIso === "string" || value.project.latestReportUpdatedAtIso === null
          ? value.project.latestReportUpdatedAtIso
          : undefined,
        name: value.project.name,
        ownerLabel: typeof value.project.ownerLabel === "string" ? value.project.ownerLabel : undefined,
        reportCount: typeof value.project.reportCount === "number" ? value.project.reportCount : undefined,
        updatedAtIso: typeof value.project.updatedAtIso === "string" ? value.project.updatedAtIso : undefined
      }
    : undefined;
  const report = parseProjectWorkspaceReport(value.report);
  const linkedAssembly = parseProjectWorkspaceAssembly(value.linkedAssembly);
  const activeDraftState = parseProjectWorkspaceActiveDraftState(value.activeDraftState);
  const revisionSummaries = value.revisionSummaries
    .map((entry) => parseProjectWorkspaceRevision(entry))
    .filter((entry): entry is ReportAssistantProjectWorkspaceRevision => entry !== null);
  const currentRevision = parseProjectWorkspaceRevision(value.currentRevision);
  const scope =
    value.scope === "project_report" && report
      ? "project_report"
      : value.scope === "project" && project
        ? "project"
        : project
          ? "project"
          : "browser_local";

  return {
    activeDraftState,
    availableReadTools: REPORT_ASSISTANT_PROJECT_READ_TOOL_DEFINITIONS.map((tool) => ({
      mutates: tool.mutates,
      name: tool.name,
      requiredInputs: [...tool.requiredInputs]
    })),
    currentRevision: currentRevision ?? undefined,
    linkedAssembly,
    project,
    report,
    revisionSummaries,
    scope
  };
}

export function parseReportAssistantContextPayload(value: unknown): ReportAssistantContext | null {
  if (!isObjectRecord(value) || !Array.isArray(value.metrics) || !Array.isArray(value.layersSummary) || !Array.isArray(value.warnings)) {
    return null;
  }

  const metrics = value.metrics
    .map((entry) => parseAssistantMetric(entry))
    .filter((entry): entry is ReportAssistantMetric => entry !== null);
  const traceSummary = parseTraceSummary(value.traceSummary);

  if (
    typeof value.createdAtIso !== "string" ||
    typeof value.documentSignature !== "string" ||
    typeof value.reportId !== "string" ||
    metrics.length === 0 ||
    !traceSummary
  ) {
    return null;
  }

  const assistantOutputFacts = Array.isArray(value.assistantOutputFacts)
    ? value.assistantOutputFacts
        .map((entry) => parseAssistantOutputFact(entry, metrics))
        .filter((entry): entry is ReportAssistantOutputFact => entry !== null)
    : metrics.map(fallbackOutputFactFromMetric);
  const reportAdjustments = Array.isArray(value.reportAdjustments)
    ? value.reportAdjustments
        .map((entry) => parseReportAdjustmentSummary(entry))
        .filter((entry): entry is ReportAssistantReportAdjustmentSummary => entry !== null)
    : [];
  const documentComparisonSummaries = Array.isArray(value.documentComparisonSummaries)
    ? value.documentComparisonSummaries
        .map((entry) => parseDocumentComparisonSummary(entry))
        .filter((entry): entry is ReportAssistantDocumentComparisonSummary => entry !== null)
    : [];

  return {
    assistantContextSignature:
      typeof value.assistantContextSignature === "string"
        ? value.assistantContextSignature
        : value.documentSignature,
    documentComparisonSummaries,
    assistantOutputFacts,
    assistantTraceSnapshot: parseSimpleWorkbenchAssistantTraceSnapshot(value.assistantTraceSnapshot),
    createdAtIso: value.createdAtIso,
    documentSignature: value.documentSignature,
    layersSummary: value.layersSummary.filter((entry): entry is string => typeof entry === "string"),
    metrics,
    presetLibrarySummary: parsePresetLibrarySummary(value.presetLibrarySummary),
    projectId: typeof value.projectId === "string" ? value.projectId : undefined,
    projectWorkspace: parseProjectWorkspaceSnapshot(value.projectWorkspace),
    reportAdjustments,
    reportId: value.reportId,
    scenarioId: typeof value.scenarioId === "string" ? value.scenarioId : undefined,
    traceSummary,
    warnings: value.warnings.filter((entry): entry is string => typeof entry === "string")
  };
}

function getMetricAliases(metric: ReportAssistantMetric): string[] {
  return [
    metric.id,
    metric.id.replace(/^output:/u, ""),
    metric.label,
    metric.metric,
    metric.outputId
  ].filter((entry): entry is string => Boolean(entry));
}

export function resolveReportAssistantInstructionMetric(input: {
  context: ReportAssistantContext;
  instruction: string;
}): { errors: string[]; metric?: ReportAssistantMetric } {
  const normalizedInstruction = normalizeInstructionText(input.instruction);
  const exactMatches = input.context.metrics.filter((metric) =>
    getMetricAliases(metric).some((alias) => {
      const normalizedAlias = normalizeInstructionText(alias);
      return normalizedAlias.length > 0 && new RegExp(`(^|[^a-z0-9'])${escapeRegExp(normalizedAlias)}([^a-z0-9']|$)`, "u").test(normalizedInstruction);
    })
  );

  if (exactMatches.length === 1) {
    return { errors: [], metric: exactMatches[0] };
  }

  if (exactMatches.length > 1) {
    return {
      errors: [`Metric reference is ambiguous: ${exactMatches.map((metric) => metric.label).join(", ")}.`]
    };
  }

  const looseInstruction = normalizeLooseMetricLabel(normalizedInstruction);
  const looseMatches = input.context.metrics.filter((metric) =>
    getMetricAliases(metric).some((alias) => {
      const looseAlias = normalizeLooseMetricLabel(alias);
      return looseAlias.length > 1 && looseInstruction.includes(looseAlias);
    })
  );

  if (looseMatches.length === 1) {
    return { errors: [], metric: looseMatches[0] };
  }

  if (looseMatches.length > 1) {
    return {
      errors: [`Metric reference is ambiguous: ${looseMatches.map((metric) => metric.label).join(", ")}.`]
    };
  }

  return {
    errors: ["Instruction must name one current report metric such as Rw, R'w, DnT,w, Ln,w, or L'nT,w."]
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function parseInstructionNumber(instruction: string): number | null {
  const matches = [...instruction.matchAll(/(?:^|[^\d])([+-]?\d+(?:\.\d+)?)\s*(?:db)?(?:$|[^\d])/giu)];
  const match = matches[matches.length - 1];

  if (!match) {
    return null;
  }

  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

function hasSetIntent(instruction: string): boolean {
  return /\b(?:set|replace|target|to|make|value|ayarla|yap|deger|=)\b/iu.test(instruction);
}

function hasDecreaseIntent(instruction: string): boolean {
  return /\b(?:lower|reduce|decrease|down|azalt|dusur|dusuk)\b/iu.test(instruction);
}

function hasIncreaseIntent(instruction: string): boolean {
  return /\b(?:raise|increase|higher|up|artir|yukselt|yuksek)\b/iu.test(instruction);
}

function hasBetterIntent(instruction: string): boolean {
  return /\b(?:better|improve|iyilestir|daha\s+iyi)\b/iu.test(instruction);
}

function hasWorseIntent(instruction: string): boolean {
  return /\b(?:worse|weaken|kotu|daha\s+kotu)\b/iu.test(instruction);
}

function getSignedDelta(input: {
  instruction: string;
  metric: ReportAssistantMetric;
  numericValue: number;
}): number | null {
  if (hasDecreaseIntent(input.instruction)) {
    return -Math.abs(input.numericValue);
  }

  if (hasIncreaseIntent(input.instruction)) {
    return Math.abs(input.numericValue);
  }

  if (hasBetterIntent(input.instruction)) {
    if (input.metric.direction === "lower_is_better") {
      return -Math.abs(input.numericValue);
    }
    if (input.metric.direction === "higher_is_better") {
      return Math.abs(input.numericValue);
    }
    return null;
  }

  if (hasWorseIntent(input.instruction)) {
    if (input.metric.direction === "lower_is_better") {
      return Math.abs(input.numericValue);
    }
    if (input.metric.direction === "higher_is_better") {
      return -Math.abs(input.numericValue);
    }
    return null;
  }

  return null;
}

function getIgnoredActionWarnings(instruction: string): string[] {
  return FORBIDDEN_ACTION_HINTS.test(instruction)
    ? ["Only a report patch proposal can be generated here. Apply, export, save, reset, file, and tool requests are ignored."]
    : [];
}

export function createReportAssistantPatchFromInstruction(input: {
  context: ReportAssistantContext;
  instruction: string;
}): ReportAssistantInstructionPatchResult {
  const instruction = input.instruction.trim();
  const warnings = getIgnoredActionWarnings(instruction);

  if (instruction.length === 0) {
    return {
      errors: ["Instruction cannot be empty."],
      ok: false,
      warnings
    };
  }

  const metricResolution = resolveReportAssistantInstructionMetric({
    context: input.context,
    instruction
  });
  if (!metricResolution.metric) {
    return {
      errors: metricResolution.errors,
      ok: false,
      warnings
    };
  }

  const metric = metricResolution.metric;
  const normalizedInstruction = normalizeInstructionText(instruction);
  const numericValue = parseInstructionNumber(normalizedInstruction);

  if (numericValue === null) {
    return {
      errors: ["Instruction must include a numeric dB value or movement."],
      ok: false,
      warnings
    };
  }

  const deltaDb = getSignedDelta({
    instruction: normalizedInstruction,
    metric,
    numericValue
  });

  if (deltaDb !== null) {
    return {
      ok: true,
      patch: {
        documentSignature: input.context.documentSignature,
        operations: [
          {
            deltaDb,
            metricId: metric.id,
            reason: `User instruction: ${instruction}`,
            type: "adjust_metric_db"
          }
        ],
        summary: `${metric.label} ${deltaDb > 0 ? "increased" : "decreased"} by ${Math.abs(deltaDb)} dB for this report.`
      },
      warnings
    };
  }

  if (!hasSetIntent(normalizedInstruction)) {
    return {
      errors: ["Instruction must clearly say whether to set, lower, raise, improve, or worsen the report value."],
      ok: false,
      warnings
    };
  }

  const displayValue = `${numericValue} dB`;

  return {
    ok: true,
    patch: {
      documentSignature: input.context.documentSignature,
      operations: [
        {
          displayValue,
          metricId: metric.id,
          reason: `User instruction: ${instruction}`,
          type: "set_metric_display_value"
        }
      ],
      summary: `${metric.label} set to ${displayValue} for this report.`
    },
    warnings
  };
}

import {
  REQUESTED_OUTPUT_IDS,
  type AssemblyCalculation,
  type RequestedOutputId
} from "@dynecho/shared";

import type {
  SimpleWorkbenchProposalCoverageItem,
  SimpleWorkbenchProposalCoverageStatus,
  SimpleWorkbenchProposalDocument,
  SimpleWorkbenchProposalMetricBasis,
  SimpleWorkbenchProposalMetricDirection,
  SimpleWorkbenchProposalReportAdjustment
} from "./simple-workbench-proposal";
import {
  buildSimpleWorkbenchAssistantTraceSnapshot,
  type SimpleWorkbenchAssistantTraceSnapshot
} from "./simple-workbench-assistant-trace-snapshot";
import {
  REPORT_ASSISTANT_PROJECT_READ_TOOL_DEFINITIONS,
  type ReportAssistantProjectReadToolDefinition
} from "./report-assistant-project-read-contract";
import {
  getDefaultReportAssistantPresetLibrarySummary,
  type ReportAssistantPresetLibrarySummary,
  type ReportAssistantPresetSummary
} from "./report-assistant-preset-library";

export type ReportAssistantMetricLocation =
  | { kind: "primaryMetric" }
  | { index: number; kind: "metricRow" }
  | { index: number; kind: "coverageRow" };

export type ReportAssistantTraceSummary = {
  basis?: string;
  dynamicAirborneFamily?: string;
  dynamicImpactFamily?: string;
  missingPhysicalInputs: readonly string[];
  route: "floor" | "unknown" | "wall";
  selectedCandidateId?: string;
  selectedOrigin?: string;
  unsupportedOutputs: readonly RequestedOutputId[];
  warnings: readonly string[];
};

export type ReportAssistantMetric = {
  basis: SimpleWorkbenchProposalMetricBasis;
  direction: SimpleWorkbenchProposalMetricDirection;
  engineDisplayValue?: string;
  id: string;
  label: string;
  locations: readonly ReportAssistantMetricLocation[];
  metric: string;
  numericDb?: number;
  outputId?: RequestedOutputId;
  reportDisplayValue: string;
  status: SimpleWorkbenchProposalCoverageStatus;
};

export type ReportAssistantOutputFactBasisCategory =
  | "bound"
  | "exact_measured"
  | "field_adapter"
  | "formula_corridor"
  | "needs_input"
  | "published_anchor"
  | "source_absent_estimate"
  | "unknown"
  | "unsupported";

export type ReportAssistantOutputFact = {
  basis: SimpleWorkbenchProposalMetricBasis;
  basisCategory: ReportAssistantOutputFactBasisCategory;
  engineDisplayValue?: string;
  formulaOrSupportNote?: string;
  label: string;
  metricId: string;
  missingInputs: readonly string[];
  outputId?: RequestedOutputId;
  parkedReason?: string;
  reportDisplayValue: string;
  selectedCandidateId?: string;
  status: SimpleWorkbenchProposalCoverageStatus;
  supportBucket?: string;
  usedInputs: readonly string[];
  valuePinDb?: number;
  warnings: readonly string[];
};

export type ReportAssistantReportAdjustmentSummary = {
  afterValue: string;
  appliedAtIso: string;
  beforeValue: string;
  engineValuePreserved: true;
  label: string;
  metricId: string;
  reason: string;
  scope: SimpleWorkbenchProposalReportAdjustment["scope"];
  source: SimpleWorkbenchProposalReportAdjustment["source"];
};

export type ReportAssistantProjectWorkspaceProject = {
  assemblyCount?: number;
  clientName?: string;
  id: string;
  latestAssemblyUpdatedAtIso?: string | null;
  latestReportUpdatedAtIso?: string | null;
  name: string;
  ownerLabel?: string;
  reportCount?: number;
  updatedAtIso?: string;
};

export type ReportAssistantProjectWorkspaceReport = {
  assemblyId?: string;
  currentRevisionId?: string;
  description?: string;
  displayCode?: string;
  id: string;
  name: string;
  revisionCount?: number;
  status?: "archived" | "draft" | "issued";
  updatedAtIso?: string;
};

export type ReportAssistantProjectWorkspaceAssembly = {
  calculationPrimaryOutput?: string;
  calculationPrimaryValueLabel?: string;
  calculationStatus?: "error" | "needs_input" | "ready" | "unsupported";
  displayCode?: string;
  id: string;
  kind: "floor" | "wall";
  name: string;
  updatedAtIso?: string;
  version: number;
};

export type ReportAssistantProjectWorkspaceRevision = {
  assistantPatchSummary?: {
    operationCount: number;
    validationStatus: "valid" | "warning";
  };
  changeSummary?: string;
  createdAtIso: string;
  displayCode?: string;
  id: string;
  source: "assistant" | "generated" | "import" | "manual";
};

export type ReportAssistantProjectWorkspaceActiveDraftState = {
  assemblyId?: string;
  assemblyName?: string;
  assemblyVersion?: number;
  dirty: boolean;
  kind:
    | "combination_clean"
    | "combination_dirty"
    | "local_draft"
    | "project_draft"
    | "project_report_draft"
    | "template_draft";
  projectId?: string;
  projectName?: string;
  reportId?: string;
  reportUpdatedAtIso?: string;
};

export type ReportAssistantProjectWorkspaceSnapshot = {
  activeDraftState?: ReportAssistantProjectWorkspaceActiveDraftState;
  availableReadTools: readonly Pick<ReportAssistantProjectReadToolDefinition, "mutates" | "name" | "requiredInputs">[];
  currentRevision?: ReportAssistantProjectWorkspaceRevision;
  linkedAssembly?: ReportAssistantProjectWorkspaceAssembly;
  project?: ReportAssistantProjectWorkspaceProject;
  report?: ReportAssistantProjectWorkspaceReport;
  revisionSummaries: readonly ReportAssistantProjectWorkspaceRevision[];
  scope: "browser_local" | "project" | "project_report";
};

export type ReportAssistantDocumentComparisonReferenceKind =
  | "current_browser_draft"
  | "current_revision"
  | "generated_baseline"
  | "previous_revision"
  | "saved_current_report";

export type ReportAssistantDocumentComparisonReference = {
  documentSignature?: string;
  issuedOnIso?: string;
  kind: ReportAssistantDocumentComparisonReferenceKind;
  projectId?: string;
  proposalReference?: string;
  proposalRevision?: string;
  reportId?: string;
  revisionId?: string;
  updatedAtIso?: string;
};

export type ReportAssistantDocumentComparisonMetricChange = {
  afterValue?: string;
  beforeValue?: string;
  label: string;
  metricId: string;
  outputId?: RequestedOutputId;
  surface: "coverage" | "metric" | "primary";
};

export type ReportAssistantDocumentComparisonCountChange = {
  afterCount: number;
  beforeCount: number;
  field:
    | "assumptions"
    | "citations"
    | "decisionTrail"
    | "issueRegister"
    | "recommendations"
    | "warnings";
};

export type ReportAssistantDocumentComparisonTextFieldSummary = {
  afterLength: number;
  beforeLength: number;
  field:
    | "briefNote"
    | "dynamicBranchDetail"
    | "executiveSummary"
    | "validationDetail";
};

export type ReportAssistantDocumentComparisonAdjustmentSummary = {
  assistantAdjustmentCount: number;
  latestAppliedAtIso?: string;
  totalAdjustmentCount: number;
};

export type ReportAssistantDocumentComparisonSummary = {
  adjustmentSummary?: ReportAssistantDocumentComparisonAdjustmentSummary;
  comparisonId: string;
  countChanges: readonly ReportAssistantDocumentComparisonCountChange[];
  from: ReportAssistantDocumentComparisonReference;
  kind:
    | "current_draft_vs_generated_baseline"
    | "current_draft_vs_saved_report"
    | "current_revision_vs_previous_revision";
  metricDisplayValueChanges: readonly ReportAssistantDocumentComparisonMetricChange[];
  omittedMetricDisplayValueChangeCount: number;
  status: "available" | "stale" | "unavailable";
  statusReason?: string;
  textFieldSummaries: readonly ReportAssistantDocumentComparisonTextFieldSummary[];
  to: ReportAssistantDocumentComparisonReference;
  topLevelFieldChanges: readonly string[];
};

export type ReportAssistantContext = {
  assistantContextSignature: string;
  documentComparisonSummaries: readonly ReportAssistantDocumentComparisonSummary[];
  assistantOutputFacts: readonly ReportAssistantOutputFact[];
  assistantTraceSnapshot?: SimpleWorkbenchAssistantTraceSnapshot;
  createdAtIso: string;
  documentSignature: string;
  layersSummary: readonly string[];
  metrics: readonly ReportAssistantMetric[];
  presetLibrarySummary?: ReportAssistantPresetLibrarySummary;
  projectId?: string;
  projectWorkspace?: ReportAssistantProjectWorkspaceSnapshot;
  reportAdjustments: readonly ReportAssistantReportAdjustmentSummary[];
  reportId: string;
  scenarioId?: string;
  traceSummary: ReportAssistantTraceSummary;
  warnings: readonly string[];
};

type MutableReportAssistantMetric = Omit<ReportAssistantMetric, "locations"> & {
  locations: ReportAssistantMetricLocation[];
};

const REQUESTED_OUTPUT_ID_SET = new Set<string>(REQUESTED_OUTPUT_IDS);

const LOWER_IS_BETTER_OUTPUTS = new Set<RequestedOutputId>([
  "L'n,w",
  "L'nT,50",
  "L'nT,w",
  "Ln,w",
  "Ln,w+CI",
  "LnT,A"
]);

const NEUTRAL_OUTPUTS = new Set<RequestedOutputId>(["C", "CI", "CI,50-2500", "Ctr"]);

const FIELD_OUTPUTS = new Set<RequestedOutputId>([
  "AIIC",
  "Dn,A",
  "Dn,w",
  "DnT,A",
  "DnT,A,k",
  "DnT,w",
  "ISR",
  "L'n,w",
  "L'nT,50",
  "L'nT,w",
  "NISR",
  "R'w"
]);

const IMPACT_OUTPUTS = new Set<RequestedOutputId>([
  "AIIC",
  "CI",
  "CI,50-2500",
  "DeltaLw",
  "HIIC",
  "IIC",
  "L'n,w",
  "L'nT,50",
  "L'nT,w",
  "Ln,w",
  "Ln,w+CI",
  "LnT,A",
  "NISR"
]);

const OUTPUT_ID_BY_NORMALIZED_LABEL = new Map<string, RequestedOutputId>(
  REQUESTED_OUTPUT_IDS.map((output) => [normalizeReportAssistantMetricLabel(output), output])
);

export function normalizeReportAssistantMetricLabel(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/\s+/gu, "");
}

export function isRequestedOutputId(value: unknown): value is RequestedOutputId {
  return typeof value === "string" && REQUESTED_OUTPUT_ID_SET.has(value);
}

export function inferReportAssistantOutputId(input: {
  label: string;
  outputId?: RequestedOutputId;
}): RequestedOutputId | undefined {
  return input.outputId ?? OUTPUT_ID_BY_NORMALIZED_LABEL.get(normalizeReportAssistantMetricLabel(input.label));
}

export function getReportAssistantMetricId(outputId: RequestedOutputId): string {
  return `output:${outputId}`;
}

export function getReportAssistantMetricDirection(
  outputId: RequestedOutputId | undefined
): SimpleWorkbenchProposalMetricDirection {
  if (!outputId) {
    return "neutral";
  }

  if (LOWER_IS_BETTER_OUTPUTS.has(outputId)) {
    return "lower_is_better";
  }

  if (NEUTRAL_OUTPUTS.has(outputId)) {
    return "neutral";
  }

  return "higher_is_better";
}

export function getReportAssistantMetricBasis(
  outputId: RequestedOutputId | undefined,
  input?: { contextLabel?: string }
): SimpleWorkbenchProposalMetricBasis {
  if (!outputId) {
    return "unknown";
  }

  if (/building/i.test(input?.contextLabel ?? "") && FIELD_OUTPUTS.has(outputId)) {
    return "building_prediction";
  }

  return FIELD_OUTPUTS.has(outputId) ? "field" : "lab";
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableStringify(entry)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function hashSignature(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `report:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function createReportAssistantDocumentSignature(document: SimpleWorkbenchProposalDocument): string {
  return hashSignature(
    stableStringify({
      coverageItems: document.coverageItems.map((item) => ({
        label: item.label,
        outputId: item.outputId,
        reportMetricId: item.reportMetricId,
        status: item.status,
        value: item.value
      })),
      metrics: document.metrics.map((metric) => ({
        label: metric.label,
        outputId: metric.outputId,
        reportMetricId: metric.reportMetricId,
        value: metric.value,
        visible: metric.visible === false ? false : true
      })),
      primaryMetricLabel: document.primaryMetricLabel,
      primaryMetricValue: document.primaryMetricValue,
      warnings: document.warnings
    })
  );
}

const REPORT_ASSISTANT_PROJECT_WORKSPACE_READ_TOOLS: ReportAssistantProjectWorkspaceSnapshot["availableReadTools"] =
  REPORT_ASSISTANT_PROJECT_READ_TOOL_DEFINITIONS.map((tool) => ({
    mutates: tool.mutates,
    name: tool.name,
    requiredInputs: [...tool.requiredInputs]
  }));

function summarizeReportAdjustments(
  adjustments: readonly SimpleWorkbenchProposalReportAdjustment[] | undefined
): ReportAssistantReportAdjustmentSummary[] {
  return (adjustments ?? []).slice(-12).map((adjustment) => ({
    afterValue: adjustment.afterValue,
    appliedAtIso: adjustment.appliedAtIso,
    beforeValue: adjustment.beforeValue,
    engineValuePreserved: adjustment.engineValuePreserved,
    label: adjustment.label,
    metricId: adjustment.metricId,
    reason: adjustment.reason,
    scope: adjustment.scope,
    source: adjustment.source
  }));
}

function latestIso(values: readonly (string | undefined)[]): string | undefined {
  return values
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .sort()
    .at(-1);
}

function buildAdjustmentSummary(
  adjustments: readonly SimpleWorkbenchProposalReportAdjustment[] | undefined
): ReportAssistantDocumentComparisonAdjustmentSummary | undefined {
  if (!adjustments || adjustments.length === 0) {
    return undefined;
  }

  return {
    assistantAdjustmentCount: adjustments.filter((adjustment) => adjustment.source === "assistant").length,
    latestAppliedAtIso: latestIso(adjustments.map((adjustment) => adjustment.appliedAtIso)),
    totalAdjustmentCount: adjustments.length
  };
}

function buildDocumentComparisonReference(
  document: SimpleWorkbenchProposalDocument,
  kind: ReportAssistantDocumentComparisonReferenceKind,
  input?: {
    projectWorkspace?: ReportAssistantProjectWorkspaceSnapshot;
  }
): ReportAssistantDocumentComparisonReference {
  return {
    documentSignature: createReportAssistantDocumentSignature(document),
    issuedOnIso: document.issuedOnIso,
    kind,
    projectId: document.serverProjectId ?? input?.projectWorkspace?.project?.id,
    proposalReference: document.proposalReference,
    proposalRevision: document.proposalRevision,
    reportId: input?.projectWorkspace?.report?.id,
    revisionId:
      kind === "current_revision"
        ? input?.projectWorkspace?.currentRevision?.id
        : undefined,
    updatedAtIso:
      kind === "current_revision" || kind === "saved_current_report"
        ? input?.projectWorkspace?.report?.updatedAtIso ?? input?.projectWorkspace?.currentRevision?.createdAtIso
        : undefined
  };
}

function reportComparisonMetricKey(input: {
  label: string;
  outputId?: RequestedOutputId;
  reportMetricId?: string;
  surface: "coverage" | "metric" | "primary";
}): string {
  return input.reportMetricId ??
    (input.outputId ? getReportAssistantMetricId(input.outputId) : `${input.surface}:${normalizeReportAssistantMetricLabel(input.label)}`);
}

function collectReportComparisonMetricValues(
  document: SimpleWorkbenchProposalDocument
): Map<string, ReportAssistantDocumentComparisonMetricChange> {
  const values = new Map<string, ReportAssistantDocumentComparisonMetricChange>();
  const primaryOutputId = inferReportAssistantOutputId({
    label: document.primaryMetricLabel
  });

  values.set(
    reportComparisonMetricKey({
      label: document.primaryMetricLabel,
      outputId: primaryOutputId,
      surface: "primary"
    }),
    {
      afterValue: document.primaryMetricValue,
      label: document.primaryMetricLabel,
      metricId: primaryOutputId ? getReportAssistantMetricId(primaryOutputId) : `primary:${normalizeReportAssistantMetricLabel(document.primaryMetricLabel)}`,
      outputId: primaryOutputId,
      surface: "primary"
    }
  );

  for (const metric of document.metrics) {
    const outputId = inferReportAssistantOutputId({
      label: metric.label,
      outputId: metric.outputId
    });
    const key = reportComparisonMetricKey({
      label: metric.label,
      outputId,
      reportMetricId: metric.reportMetricId,
      surface: "metric"
    });
    values.set(key, {
      afterValue: metric.value,
      label: metric.label,
      metricId: metric.reportMetricId ?? (outputId ? getReportAssistantMetricId(outputId) : `metric:${normalizeReportAssistantMetricLabel(metric.label)}`),
      outputId,
      surface: "metric"
    });
  }

  for (const item of document.coverageItems) {
    const outputId = inferReportAssistantOutputId({
      label: item.label,
      outputId: item.outputId
    });
    const key = reportComparisonMetricKey({
      label: item.label,
      outputId,
      reportMetricId: item.reportMetricId,
      surface: "coverage"
    });
    values.set(key, {
      afterValue: item.value,
      label: item.label,
      metricId: item.reportMetricId ?? (outputId ? getReportAssistantMetricId(outputId) : `coverage:${normalizeReportAssistantMetricLabel(item.label)}`),
      outputId,
      surface: "coverage"
    });
  }

  return values;
}

function buildMetricDisplayValueChanges(input: {
  afterDocument: SimpleWorkbenchProposalDocument;
  beforeDocument: SimpleWorkbenchProposalDocument;
}): {
  changes: ReportAssistantDocumentComparisonMetricChange[];
  omittedCount: number;
} {
  const beforeValues = collectReportComparisonMetricValues(input.beforeDocument);
  const afterValues = collectReportComparisonMetricValues(input.afterDocument);
  const keys = [...new Set([...beforeValues.keys(), ...afterValues.keys()])];
  const changes = keys.flatMap((key): ReportAssistantDocumentComparisonMetricChange[] => {
    const before = beforeValues.get(key);
    const after = afterValues.get(key);
    const beforeValue = before?.afterValue;
    const afterValue = after?.afterValue;

    if (beforeValue === afterValue) {
      return [];
    }

    return [
      {
        afterValue,
        beforeValue,
        label: after?.label ?? before?.label ?? key,
        metricId: after?.metricId ?? before?.metricId ?? key,
        outputId: after?.outputId ?? before?.outputId,
        surface: after?.surface ?? before?.surface ?? "metric"
      }
    ];
  });
  const maxChanges = 12;

  return {
    changes: changes.slice(0, maxChanges),
    omittedCount: Math.max(0, changes.length - maxChanges)
  };
}

function buildCountChanges(input: {
  afterDocument: SimpleWorkbenchProposalDocument;
  beforeDocument: SimpleWorkbenchProposalDocument;
}): ReportAssistantDocumentComparisonCountChange[] {
  const fields: readonly {
    afterCount: number;
    beforeCount: number;
    field: ReportAssistantDocumentComparisonCountChange["field"];
  }[] = [
    {
      afterCount: input.afterDocument.assumptionItems.length,
      beforeCount: input.beforeDocument.assumptionItems.length,
      field: "assumptions"
    },
    {
      afterCount: input.afterDocument.citations.length,
      beforeCount: input.beforeDocument.citations.length,
      field: "citations"
    },
    {
      afterCount: input.afterDocument.decisionTrailItems.length,
      beforeCount: input.beforeDocument.decisionTrailItems.length,
      field: "decisionTrail"
    },
    {
      afterCount: input.afterDocument.issueRegisterItems.length,
      beforeCount: input.beforeDocument.issueRegisterItems.length,
      field: "issueRegister"
    },
    {
      afterCount: input.afterDocument.recommendationItems.length,
      beforeCount: input.beforeDocument.recommendationItems.length,
      field: "recommendations"
    },
    {
      afterCount: input.afterDocument.warnings.length,
      beforeCount: input.beforeDocument.warnings.length,
      field: "warnings"
    }
  ];

  return fields.filter((entry) => entry.beforeCount !== entry.afterCount);
}

function buildTextFieldSummaries(input: {
  afterDocument: SimpleWorkbenchProposalDocument;
  beforeDocument: SimpleWorkbenchProposalDocument;
}): ReportAssistantDocumentComparisonTextFieldSummary[] {
  const fields: readonly ReportAssistantDocumentComparisonTextFieldSummary["field"][] = [
    "briefNote",
    "dynamicBranchDetail",
    "executiveSummary",
    "validationDetail"
  ];

  return fields.flatMap((field): ReportAssistantDocumentComparisonTextFieldSummary[] => {
    const beforeLength = input.beforeDocument[field].length;
    const afterLength = input.afterDocument[field].length;
    if (input.beforeDocument[field] === input.afterDocument[field]) {
      return [];
    }

    return [
      {
        afterLength,
        beforeLength,
        field
      }
    ];
  });
}

function buildTopLevelFieldChanges(input: {
  afterDocument: SimpleWorkbenchProposalDocument;
  beforeDocument: SimpleWorkbenchProposalDocument;
}): string[] {
  const fields: readonly (keyof SimpleWorkbenchProposalDocument)[] = [
    "assemblyHeadline",
    "clientName",
    "consultantCompany",
    "contextLabel",
    "dynamicBranchLabel",
    "issuedOnIso",
    "issuedOnLabel",
    "issueBaseReference",
    "issueNextReference",
    "preparedBy",
    "primaryMetricLabel",
    "projectName",
    "proposalAttention",
    "proposalIssuePurpose",
    "proposalRecipient",
    "proposalReference",
    "proposalRevision",
    "proposalSubject",
    "proposalValidityNote",
    "reportProfileLabel",
    "studyContextLabel",
    "studyModeLabel",
    "validationLabel"
  ];

  return fields.filter((field) => input.beforeDocument[field] !== input.afterDocument[field]);
}

export function buildReportAssistantDocumentComparisonSummary(input: {
  afterDocument: SimpleWorkbenchProposalDocument;
  beforeDocument: SimpleWorkbenchProposalDocument;
  fromKind: ReportAssistantDocumentComparisonReferenceKind;
  kind: ReportAssistantDocumentComparisonSummary["kind"];
  projectWorkspace?: ReportAssistantProjectWorkspaceSnapshot;
  status?: ReportAssistantDocumentComparisonSummary["status"];
  statusReason?: string;
  toKind: ReportAssistantDocumentComparisonReferenceKind;
}): ReportAssistantDocumentComparisonSummary {
  const metricChanges = buildMetricDisplayValueChanges(input);
  const from = buildDocumentComparisonReference(input.beforeDocument, input.fromKind, {
    projectWorkspace: input.projectWorkspace
  });
  const to = buildDocumentComparisonReference(input.afterDocument, input.toKind, {
    projectWorkspace: input.projectWorkspace
  });

  return {
    adjustmentSummary: buildAdjustmentSummary(input.afterDocument.reportAdjustments),
    comparisonId: `${input.kind}:${from.documentSignature ?? "unknown"}:${to.documentSignature ?? "unknown"}`,
    countChanges: buildCountChanges(input),
    from,
    kind: input.kind,
    metricDisplayValueChanges: metricChanges.changes,
    omittedMetricDisplayValueChangeCount: metricChanges.omittedCount,
    status: input.status ?? "available",
    statusReason: input.statusReason,
    textFieldSummaries: buildTextFieldSummaries(input),
    to,
    topLevelFieldChanges: buildTopLevelFieldChanges(input)
  };
}

function buildReportAssistantDocumentComparisonSummaries(input: {
  baseDocument?: SimpleWorkbenchProposalDocument;
  document: SimpleWorkbenchProposalDocument;
  projectWorkspace?: ReportAssistantProjectWorkspaceSnapshot;
}): ReportAssistantDocumentComparisonSummary[] {
  if (!input.baseDocument) {
    return [];
  }

  return [
    buildReportAssistantDocumentComparisonSummary({
      afterDocument: input.document,
      beforeDocument: input.baseDocument,
      fromKind: "generated_baseline",
      kind: "current_draft_vs_generated_baseline",
      projectWorkspace: input.projectWorkspace,
      toKind: "current_browser_draft"
    })
  ];
}

function normalizePresetSummary(preset: ReportAssistantPresetSummary): ReportAssistantPresetSummary {
  return {
    description: preset.description,
    hasCustomMaterials: preset.hasCustomMaterials,
    hasVisualOverrides: preset.hasVisualOverrides,
    id: preset.id,
    kind: preset.kind,
    layerCount: preset.layerCount,
    name: preset.name,
    presetRoute: preset.presetRoute,
    selectedOutputCount: preset.selectedOutputCount,
    sourceLabel: preset.sourceLabel,
    sourceMetric: preset.sourceMetric,
    sourceTargetValueDb: preset.sourceTargetValueDb,
    tags: preset.tags?.slice(0, 8),
    updatedAtIso: preset.updatedAtIso
  };
}

function normalizePresetLibrarySummary(
  summary: ReportAssistantPresetLibrarySummary | undefined
): ReportAssistantPresetLibrarySummary | undefined {
  const source = summary ?? getDefaultReportAssistantPresetLibrarySummary();

  return {
    commonPresetCount: source.commonPresetCount,
    commonPresets: source.commonPresets.slice(0, 8).map(normalizePresetSummary),
    recentUserPresets: source.recentUserPresets.slice(0, 8).map(normalizePresetSummary),
    userPresetCount: source.userPresetCount
  };
}

function uniqueRecentRevisions(
  revisions: readonly ReportAssistantProjectWorkspaceRevision[],
  currentRevision?: ReportAssistantProjectWorkspaceRevision
): ReportAssistantProjectWorkspaceRevision[] {
  const ordered = [
    ...(currentRevision ? [currentRevision] : []),
    ...revisions.slice().reverse()
  ];
  const seen = new Set<string>();
  const result: ReportAssistantProjectWorkspaceRevision[] = [];

  for (const revision of ordered) {
    if (seen.has(revision.id)) {
      continue;
    }

    seen.add(revision.id);
    result.push(revision);
    if (result.length >= 8) {
      break;
    }
  }

  return result;
}

function normalizeProjectWorkspaceSnapshot(
  snapshot: ReportAssistantProjectWorkspaceSnapshot | undefined
): ReportAssistantProjectWorkspaceSnapshot | undefined {
  if (!snapshot) {
    return undefined;
  }

  const currentRevision =
    snapshot.currentRevision ??
    (snapshot.report?.currentRevisionId
      ? snapshot.revisionSummaries.find((revision) => revision.id === snapshot.report?.currentRevisionId)
      : undefined);
  const scope =
    snapshot.scope === "project_report" && snapshot.report
      ? "project_report"
      : snapshot.scope === "project" && snapshot.project
        ? "project"
        : snapshot.project
          ? "project"
          : "browser_local";

  return {
    activeDraftState: snapshot.activeDraftState,
    availableReadTools: REPORT_ASSISTANT_PROJECT_WORKSPACE_READ_TOOLS,
    currentRevision,
    linkedAssembly: snapshot.linkedAssembly,
    project: snapshot.project,
    report: snapshot.report,
    revisionSummaries: uniqueRecentRevisions(snapshot.revisionSummaries, currentRevision),
    scope
  };
}

export function createReportAssistantContextSignature(input: {
  assistantTraceSnapshot?: SimpleWorkbenchAssistantTraceSnapshot;
  document: SimpleWorkbenchProposalDocument;
  documentComparisonSummaries?: readonly ReportAssistantDocumentComparisonSummary[];
  presetLibrarySummary?: ReportAssistantPresetLibrarySummary;
  projectWorkspace?: ReportAssistantProjectWorkspaceSnapshot;
}): string {
  const { assistantTraceSnapshot, document, documentComparisonSummaries, presetLibrarySummary, projectWorkspace } = input;

  return hashSignature(
    stableStringify({
      assistantTraceSnapshot,
      contextLabel: document.contextLabel,
      coverageItems: document.coverageItems.map((item) => ({
        label: item.label,
        nextStep: item.nextStep,
        outputId: item.outputId,
        postureLabel: item.postureLabel,
        reportMetricId: item.reportMetricId,
        status: item.status,
        value: item.value
      })),
      documentComparisonSummaries,
      dynamicBranchLabel: document.dynamicBranchLabel,
      layers: document.layers.map((layer) => ({
        categoryLabel: layer.categoryLabel,
        densityLabel: layer.densityLabel,
        index: layer.index,
        label: layer.label,
        roleLabel: layer.roleLabel,
        surfaceMassLabel: layer.surfaceMassLabel,
        thicknessLabel: layer.thicknessLabel
      })),
      methodTraceGroups: document.methodTraceGroups.map((group) => ({
        detail: group.detail,
        label: group.label,
        notes: group.notes,
        value: group.value
      })),
      presetLibrarySummary,
      metrics: document.metrics.map((metric) => ({
        label: metric.label,
        outputId: metric.outputId,
        reportMetricId: metric.reportMetricId,
        value: metric.value,
        visible: metric.visible === false ? false : true
      })),
      primaryMetricLabel: document.primaryMetricLabel,
      primaryMetricValue: document.primaryMetricValue,
      projectWorkspace,
      reportAdjustments: summarizeReportAdjustments(document.reportAdjustments),
      reportProfile: document.reportProfile,
      reportProfileLabel: document.reportProfileLabel,
      studyContextLabel: document.studyContextLabel,
      studyModeLabel: document.studyModeLabel,
      validationLabel: document.validationLabel,
      warnings: document.warnings
    })
  ).replace(/^report:/u, "report-context:");
}

function findBaseDisplayValue(input: {
  baseDocument?: SimpleWorkbenchProposalDocument;
  label: string;
  metricId: string;
  outputId?: RequestedOutputId;
}): string | undefined {
  const { baseDocument, label, metricId, outputId } = input;
  if (!baseDocument) {
    return undefined;
  }

  const matchesMetric = (entry: {
    label: string;
    outputId?: RequestedOutputId;
    reportMetricId?: string;
  }) =>
    entry.reportMetricId === metricId ||
    (outputId && entry.outputId === outputId) ||
    normalizeReportAssistantMetricLabel(entry.label) === normalizeReportAssistantMetricLabel(label);

  if (matchesMetric({ label: baseDocument.primaryMetricLabel })) {
    return baseDocument.primaryMetricValue;
  }

  return (
    baseDocument.metrics.find(matchesMetric)?.value ??
    baseDocument.coverageItems.find(matchesMetric)?.value
  );
}

function parseFirstNumericDb(value: string): number | undefined {
  const match = /^\s*(?:(?:<=|>=|[<>]=?)\s*)?([+-]?\d+(?:\.\d+)?)/u.exec(value);
  if (!match) {
    return undefined;
  }

  const numericDb = Number(match[1]);
  return Number.isFinite(numericDb) ? numericDb : undefined;
}

function upsertMetric(
  metricsById: Map<string, MutableReportAssistantMetric>,
  input: {
    baseDocument?: SimpleWorkbenchProposalDocument;
    basis?: SimpleWorkbenchProposalMetricBasis;
    direction?: SimpleWorkbenchProposalMetricDirection;
    engineDisplayValue?: string;
    label: string;
    location: ReportAssistantMetricLocation;
    outputId?: RequestedOutputId;
    reportMetricId?: string;
    status: SimpleWorkbenchProposalCoverageStatus;
    value: string;
  }
): void {
  const outputId = inferReportAssistantOutputId({
    label: input.label,
    outputId: input.outputId
  });
  const metricId =
    input.reportMetricId ??
    (outputId ? getReportAssistantMetricId(outputId) : `label:${normalizeReportAssistantMetricLabel(input.label)}`);
  const existing = metricsById.get(metricId);

  if (existing) {
    existing.locations.push(input.location);
    if (existing.status !== "live" && input.status === "live" && input.location.kind === "coverageRow") {
      existing.status = "live";
    }
    return;
  }

  const basis = input.basis ?? getReportAssistantMetricBasis(outputId);
  const direction = input.direction ?? getReportAssistantMetricDirection(outputId);
  const engineDisplayValue =
    input.engineDisplayValue ??
    findBaseDisplayValue({
      baseDocument: input.baseDocument,
      label: input.label,
      metricId,
      outputId
    });

  metricsById.set(metricId, {
    basis,
    direction,
    engineDisplayValue,
    id: metricId,
    label: input.label,
    locations: [input.location],
    metric: outputId ?? input.label,
    numericDb: parseFirstNumericDb(input.value),
    outputId,
    reportDisplayValue: input.value,
    status: input.status
  });
}

function summarizeLayers(document: SimpleWorkbenchProposalDocument): string[] {
  return document.layers.map((layer) => {
    const fields = [
      `${String(layer.index)}. ${layer.label}`,
      layer.roleLabel,
      layer.thicknessLabel,
      layer.densityLabel,
      layer.surfaceMassLabel
    ].filter((entry): entry is string => Boolean(entry));

    return fields.join(" | ");
  });
}

function uniqueBoundedStrings(values: readonly (string | undefined)[], maxItems = 8): string[] {
  const unique: string[] = [];

  for (const value of values) {
    const normalized = value?.trim().replace(/\s+/gu, " ");
    if (!normalized || unique.includes(normalized)) {
      continue;
    }

    unique.push(normalized);
    if (unique.length >= maxItems) {
      break;
    }
  }

  return unique;
}

function formatBoundedList(label: string, values: readonly string[] | undefined): string | undefined {
  if (!values || values.length === 0) {
    return undefined;
  }

  return `${label}: ${values.slice(0, 5).join(", ")}${values.length > 5 ? ", ..." : ""}`;
}

function isImpactOutput(outputId: RequestedOutputId | undefined): boolean {
  return typeof outputId === "string" && IMPACT_OUTPUTS.has(outputId);
}

function getMetricCoverageItem(input: {
  document: SimpleWorkbenchProposalDocument;
  metric: ReportAssistantMetric;
}): SimpleWorkbenchProposalCoverageItem | undefined {
  const { document, metric } = input;
  return document.coverageItems.find((item) => {
    const itemOutputId = inferReportAssistantOutputId({
      label: item.label,
      outputId: item.outputId
    });

    return (
      item.reportMetricId === metric.id ||
      (itemOutputId && metric.outputId && itemOutputId === metric.outputId) ||
      normalizeReportAssistantMetricLabel(item.label) === normalizeReportAssistantMetricLabel(metric.label)
    );
  });
}

function getOutputFactValuePin(input: {
  metric: ReportAssistantMetric;
  snapshot?: SimpleWorkbenchAssistantTraceSnapshot;
}): number | undefined {
  return input.snapshot?.layerCombinationResolver?.valuePins?.find(
    (pin) => pin.metric === input.metric.metric || pin.metric === input.metric.outputId || pin.metric === input.metric.label
  )?.value;
}

function inferOutputFactBasisCategory(input: {
  metric: ReportAssistantMetric;
  snapshot?: SimpleWorkbenchAssistantTraceSnapshot;
}): ReportAssistantOutputFactBasisCategory {
  const { metric, snapshot } = input;
  if (metric.status === "unsupported") {
    return "unsupported";
  }
  if (metric.status === "needs_input") {
    return "needs_input";
  }
  if (metric.status === "bound") {
    return "bound";
  }

  const resolver = snapshot?.layerCombinationResolver;
  const candidateResolution = snapshot?.airborneCandidateResolution;
  const impact = snapshot?.impact;
  const impactSupport = snapshot?.impactSupport;
  const evidence = [
    metric.basis,
    resolver?.basis,
    resolver?.candidateKind,
    resolver?.supportBucket,
    candidateResolution?.selectedBasisOrigin,
    candidateResolution?.selectedOrigin,
    impact?.evidenceTier,
    impact?.impactBasis,
    impact?.selectionKind,
    impactSupport?.basis
  ].filter((entry): entry is string => typeof entry === "string").join(" ");

  if (/source[_\s-]*absent|absent[_\s-]*source/iu.test(evidence)) {
    return "source_absent_estimate";
  }
  if (/exact|measured/iu.test(evidence)) {
    return "exact_measured";
  }
  if (/published|anchor|catalog|source[_\s-]*row/iu.test(evidence)) {
    return "published_anchor";
  }
  if (FIELD_OUTPUTS.has(metric.outputId as RequestedOutputId) || metric.basis === "field") {
    return "field_adapter";
  }
  if (/formula|corridor|calibrated|estimate|family|solver/iu.test(evidence)) {
    return "formula_corridor";
  }

  return "unknown";
}

function buildOutputFactUsedInputs(input: {
  document: SimpleWorkbenchProposalDocument;
  metric: ReportAssistantMetric;
  snapshot?: SimpleWorkbenchAssistantTraceSnapshot;
}): string[] {
  const { document, metric, snapshot } = input;
  const resolver = snapshot?.layerCombinationResolver;
  const airborne = snapshot?.airborne;
  const candidateResolution = snapshot?.airborneCandidateResolution;
  const impact = snapshot?.impact;
  const impactSupport = snapshot?.impactSupport;
  const valuePinDb = getOutputFactValuePin({ metric, snapshot });
  const layerInputs = document.layers.slice(0, 4).map((layer) => {
    const details = [
      layer.roleLabel,
      layer.thicknessLabel,
      layer.densityLabel,
      layer.surfaceMassLabel
    ].filter((entry): entry is string => typeof entry === "string" && entry.length > 0);
    return `layer ${layer.index}: ${[layer.label, ...details].join(" | ")}`;
  });

  return uniqueBoundedStrings([
    resolver?.route ? `route: ${resolver.route}` : undefined,
    resolver?.selectedCandidateId ? `selected candidate: ${resolver.selectedCandidateId}` : undefined,
    candidateResolution?.selectedOrigin ? `selected origin: ${candidateResolution.selectedOrigin}` : undefined,
    resolver?.supportBucket ? `support bucket: ${resolver.supportBucket}` : undefined,
    valuePinDb !== undefined ? `value pin: ${metric.metric} ${valuePinDb} dB` : undefined,
    formatBoundedList("resolver required inputs", resolver?.requiredInputs),
    isImpactOutput(metric.outputId) ? (impact?.selectedLabel ? `impact lane: ${impact.selectedLabel}` : undefined) : undefined,
    isImpactOutput(metric.outputId)
      ? (impact?.supportFamilyLabel ?? impact?.supportFamily
          ? `impact support family: ${impact.supportFamilyLabel ?? impact.supportFamily}`
          : undefined)
      : undefined,
    isImpactOutput(metric.outputId) ? formatBoundedList("impact sources", impact?.selectedSourceLabels) : undefined,
    isImpactOutput(metric.outputId) && impactSupport?.referenceFloorType
      ? `reference floor: ${impactSupport.referenceFloorType}`
      : undefined,
    !isImpactOutput(metric.outputId) && airborne?.selectedLabel ? `airborne lane: ${airborne.selectedLabel}` : undefined,
    !isImpactOutput(metric.outputId) && airborne?.selectedMethod ? `airborne method: ${airborne.selectedMethod}` : undefined,
    !isImpactOutput(metric.outputId) && (airborne?.detectedFamilyLabel ?? airborne?.detectedFamily)
      ? `airborne family: ${airborne.detectedFamilyLabel ?? airborne.detectedFamily}`
      : undefined,
    ...layerInputs
  ]);
}

function buildOutputFactMissingInputs(input: {
  metric: ReportAssistantMetric;
  snapshot?: SimpleWorkbenchAssistantTraceSnapshot;
  traceSummary: ReportAssistantTraceSummary;
}): string[] {
  const resolver = input.snapshot?.layerCombinationResolver;
  return uniqueBoundedStrings([
    ...input.traceSummary.missingPhysicalInputs,
    ...(input.metric.status === "needs_input" ? resolver?.requiredInputs ?? [] : [])
  ]);
}

function buildOutputFactParkedReason(input: {
  coverageItem?: SimpleWorkbenchProposalCoverageItem;
  metric: ReportAssistantMetric;
  snapshot?: SimpleWorkbenchAssistantTraceSnapshot;
  traceSummary: ReportAssistantTraceSummary;
}): string | undefined {
  const { coverageItem, metric, snapshot, traceSummary } = input;
  if (metric.status === "needs_input") {
    return coverageItem?.nextStep ?? "Needs additional inputs before this output can be published.";
  }
  if (metric.status === "unsupported") {
    return coverageItem?.nextStep ?? coverageItem?.detail ?? "Unsupported for the selected assembly and study context.";
  }
  if (metric.outputId && traceSummary.unsupportedOutputs.includes(metric.outputId)) {
    return "Parked by the engine unsupported output set for this layer combination.";
  }
  if (
    metric.outputId &&
    snapshot?.layerCombinationResolver?.supportedMetrics &&
    !snapshot.layerCombinationResolver.supportedMetrics.includes(metric.outputId)
  ) {
    return "Not included in the selected layer resolver supported metric set.";
  }
  if (metric.status === "bound") {
    return coverageItem?.postureDetail ?? "Published as a bound or guarded report value.";
  }

  return undefined;
}

function buildReportAssistantOutputFacts(input: {
  document: SimpleWorkbenchProposalDocument;
  metrics: readonly ReportAssistantMetric[];
  snapshot?: SimpleWorkbenchAssistantTraceSnapshot;
  traceSummary: ReportAssistantTraceSummary;
}): ReportAssistantOutputFact[] {
  const { document, metrics, snapshot, traceSummary } = input;
  const resolver = snapshot?.layerCombinationResolver;
  const impactSupport = snapshot?.impactSupport;
  const impact = snapshot?.impact;
  const supportNote =
    impactSupport?.formulaNotes?.[0] ??
    impactSupport?.notes?.[0] ??
    impact?.notes?.[0] ??
    resolver?.surfaceDetail;

  return metrics.map((metric) => {
    const coverageItem = getMetricCoverageItem({ document, metric });

    return {
      basis: metric.basis,
      basisCategory: inferOutputFactBasisCategory({
        metric,
        snapshot
      }),
      engineDisplayValue: metric.engineDisplayValue,
      formulaOrSupportNote: supportNote,
      label: metric.label,
      metricId: metric.id,
      missingInputs: buildOutputFactMissingInputs({
        metric,
        snapshot,
        traceSummary
      }),
      outputId: metric.outputId,
      parkedReason: buildOutputFactParkedReason({
        coverageItem,
        metric,
        snapshot,
        traceSummary
      }),
      reportDisplayValue: metric.reportDisplayValue,
      selectedCandidateId: resolver?.selectedCandidateId ?? snapshot?.airborneCandidateResolution?.selectedCandidateId,
      status: metric.status,
      supportBucket: resolver?.supportBucket,
      usedInputs: buildOutputFactUsedInputs({
        document,
        metric,
        snapshot
      }),
      valuePinDb: getOutputFactValuePin({
        metric,
        snapshot
      }),
      warnings: uniqueBoundedStrings([
        ...traceSummary.warnings,
        ...document.warnings
      ], 6)
    };
  });
}

export function buildReportAssistantTraceSummary(input: {
  document: SimpleWorkbenchProposalDocument;
  result?: AssemblyCalculation | null;
}): ReportAssistantTraceSummary {
  const { document, result } = input;
  const boundaryRoute = result?.acousticAnswerBoundary?.route;
  const route =
    boundaryRoute === "wall" || boundaryRoute === "floor"
      ? boundaryRoute
      : /floor/i.test(document.studyModeLabel)
        ? "floor"
        : /wall/i.test(document.studyModeLabel)
          ? "wall"
          : "unknown";

  return {
    basis: result?.airborneBasis?.origin ?? result?.airborneCandidateResolution?.selectedBasis?.origin,
    dynamicAirborneFamily: result?.dynamicAirborneTrace?.detectedFamilyLabel,
    dynamicImpactFamily: result?.dynamicImpactTrace?.selectedLabel,
    missingPhysicalInputs: [
      ...(result?.acousticAnswerBoundary?.missingPhysicalInputs ?? []),
      ...(result?.airborneBasis?.missingPhysicalInputs ?? [])
    ],
    route,
    selectedCandidateId: result?.airborneCandidateResolution?.selectedCandidateId,
    selectedOrigin: result?.airborneCandidateResolution?.selectedOrigin,
    unsupportedOutputs: result?.unsupportedTargetOutputs ?? [],
    warnings: document.warnings
  };
}

export function buildReportAssistantContext(input: {
  activeDraftState?: ReportAssistantProjectWorkspaceActiveDraftState;
  baseDocument?: SimpleWorkbenchProposalDocument;
  createdAtIso?: string;
  document: SimpleWorkbenchProposalDocument;
  presetLibrarySummary?: ReportAssistantPresetLibrarySummary;
  projectWorkspace?: ReportAssistantProjectWorkspaceSnapshot;
  reportId?: string;
  result?: AssemblyCalculation | null;
}): ReportAssistantContext {
  const { baseDocument, document } = input;
  const metricsById = new Map<string, MutableReportAssistantMetric>();

  document.coverageItems.forEach((item, index) => {
    upsertMetric(metricsById, {
      baseDocument,
      basis: item.metricBasis,
      direction: item.metricDirection,
      engineDisplayValue: item.engineDisplayValue,
      label: item.label,
      location: { index, kind: "coverageRow" },
      outputId: item.outputId,
      reportMetricId: item.reportMetricId,
      status: item.status,
      value: item.value
    });
  });

  document.metrics.forEach((metric, index) => {
    upsertMetric(metricsById, {
      baseDocument,
      basis: metric.metricBasis,
      direction: metric.metricDirection,
      engineDisplayValue: metric.engineDisplayValue,
      label: metric.label,
      location: { index, kind: "metricRow" },
      outputId: metric.outputId,
      reportMetricId: metric.reportMetricId,
      status: "live",
      value: metric.value
    });
  });

  upsertMetric(metricsById, {
    baseDocument,
    label: document.primaryMetricLabel,
    location: { kind: "primaryMetric" },
    status: "live",
    value: document.primaryMetricValue
  });

  const assistantTraceSnapshot =
    document.assistantTraceSnapshot ?? buildSimpleWorkbenchAssistantTraceSnapshot(input.result);
  const traceSummary = buildReportAssistantTraceSummary({
    document,
    result: input.result
  });
  const metrics = [...metricsById.values()];
  const projectWorkspace = normalizeProjectWorkspaceSnapshot(
    input.projectWorkspace
      ? {
          ...input.projectWorkspace,
          activeDraftState: input.activeDraftState ?? input.projectWorkspace.activeDraftState
        }
      : input.activeDraftState
        ? {
            activeDraftState: input.activeDraftState,
            availableReadTools: [],
            revisionSummaries: [],
            scope: "browser_local"
          }
        : undefined
  );
  const documentComparisonSummaries = buildReportAssistantDocumentComparisonSummaries({
    baseDocument,
    document,
    projectWorkspace
  });
  const presetLibrarySummary = normalizePresetLibrarySummary(input.presetLibrarySummary);

  return {
    assistantContextSignature: createReportAssistantContextSignature({
      assistantTraceSnapshot,
      document,
      documentComparisonSummaries,
      presetLibrarySummary,
      projectWorkspace
    }),
    documentComparisonSummaries,
    assistantOutputFacts: buildReportAssistantOutputFacts({
      document,
      metrics,
      snapshot: assistantTraceSnapshot,
      traceSummary
    }),
    assistantTraceSnapshot,
    createdAtIso: input.createdAtIso ?? new Date().toISOString(),
    documentSignature: createReportAssistantDocumentSignature(document),
    layersSummary: summarizeLayers(document),
    metrics,
    presetLibrarySummary,
    projectId: document.serverProjectId ?? projectWorkspace?.project?.id,
    projectWorkspace,
    reportAdjustments: summarizeReportAdjustments(document.reportAdjustments),
    reportId: input.reportId ?? document.proposalReference,
    scenarioId: document.serverProjectScenarioId,
    traceSummary,
    warnings: document.warnings
  };
}

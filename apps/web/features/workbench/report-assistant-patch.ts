import type { RequestedOutputId } from "@dynecho/shared";

import type {
  SimpleWorkbenchProposalDocument,
  SimpleWorkbenchProposalReportAdjustment
} from "./simple-workbench-proposal";
import {
  createReportAssistantDocumentSignature,
  getReportAssistantMetricId,
  inferReportAssistantOutputId,
  type ReportAssistantContext,
  type ReportAssistantMetric,
  type ReportAssistantMetricLocation
} from "./report-assistant-context";

export type ReportAssistantPatchOperation =
  | {
      deltaDb: number;
      metricId: string;
      reason: string;
      type: "adjust_metric_db";
    }
  | {
      displayValue: string;
      metricId: string;
      reason: string;
      type: "set_metric_display_value";
    }
  | {
      afterValue: string;
      beforeText: string;
      beforeValue: string;
      path: string;
      reason: string;
      type: "replace_report_text_value";
    }
  | {
      reason: string;
      section: "assumptions" | "recommendations" | "warnings";
      text: string;
      type: "append_report_note";
    };

export type ReportAssistantPatch = {
  documentSignature?: string;
  operations: readonly ReportAssistantPatchOperation[];
  requiresUserConfirmation?: boolean;
  summary: string;
};

export type ReportAssistantPatchPreviewOperation =
  | {
      afterValue: string;
      beforeValue: string;
      label: string;
      locations: readonly ReportAssistantMetricLocation[];
      metricId: string;
      numericDeltaDb: number;
      outputId?: RequestedOutputId;
      reason: string;
      requiresUserConfirmation: boolean;
      type: "metric_value";
      warnings: readonly string[];
    }
  | {
      reason: string;
      section: "assumptions" | "recommendations" | "warnings";
      text: string;
      type: "report_note";
      warnings: readonly string[];
    }
  | {
      afterText: string;
      afterValue: string;
      beforeText: string;
      beforeValue: string;
      path: string;
      reason: string;
      replacementCount: number;
      type: "text_value";
      warnings: readonly string[];
    };

export type ReportAssistantPatchValidationResult = {
  documentSignature: string;
  errors: readonly string[];
  operations: readonly ReportAssistantPatchPreviewOperation[];
  patchSummary: string;
  requiresUserConfirmation: boolean;
  status: "rejected" | "requires_confirmation" | "valid";
  warnings: readonly string[];
};

export type ReportAssistantValueMention = {
  auditExempt?: boolean;
  path: string;
  replaceable?: boolean;
  surfacePolicy?: ReportConsistencySurfacePolicy;
  value: string;
};

export type ReportAssistantValueMentionClassification =
  | "ambiguous_numeric_only"
  | "audit_engine_value"
  | "evidence_source_value"
  | "exact_metric_label_value"
  | "semantic_metric_claim"
  | "unrelated_numeric_mention"
  | "unresolved";

export type ReportAssistantClassifiedValueMention = ReportAssistantValueMention & {
  afterValue: string;
  beforeValue: string;
  blocking: boolean;
  classification: ReportAssistantValueMentionClassification;
  label: string;
  metricId: string;
  reason: string;
};

export type ReportConsistencySurfacePolicy =
  | "audit_engine"
  | "client_narrative"
  | "evidence_source"
  | "issue_metadata"
  | "metric_value"
  | "non_report_metadata"
  | "technical_narrative";

export type ReportConsistencyTextPath = {
  auditExempt: boolean;
  path: string;
  replaceable: boolean;
  surfacePolicy: ReportConsistencySurfacePolicy;
  text: string;
};

type ParsedReportDbValue = {
  boundPrefix?: "<=" | ">=";
  decimals: number;
  numericDb: number;
  signed: boolean;
};

const SIGNED_OUTPUT_IDS = new Set(["C", "CI", "CI,50-2500", "Ctr"]);
const MAX_CONFIRMATION_FREE_MOVEMENT_DB = 5;
const MAX_ASSISTANT_MOVEMENT_DB = 10;
const DIRECT_TEXT_REPLACEMENT_FIELDS = new Set<keyof SimpleWorkbenchProposalDocument>([
  "assemblyHeadline",
  "briefNote",
  "corridorDossierHeadline",
  "decisionTrailHeadline",
  "dynamicBranchDetail",
  "executiveSummary",
  "methodDossierHeadline",
  "validationDetail"
]);
const SEMANTIC_STALE_CLAIM_PATTERNS = [
  /\bpass(?:es|ed|ing)?\b/u,
  /\bfail(?:s|ed|ing)?\b/u,
  /\btarget\b/u,
  /\bmargin\b/u,
  /\bclass\b/u,
  /\bcomfortably\b/u,
  /\bexceed(?:s|ed|ing)?\b/u,
  /\bstrong\b/u,
  /\bweak\b/u,
  /\boptimistic\b/u,
  /\bconservative\b/u,
  /\brecommend(?:s|ed|ing|ation)?\b/u,
  /\bno\s+change\b/u,
  /\bhigh\b/u,
  /\blow\b/u,
  /\bfazla\b/u,
  /\bdusuk\b/u,
  /\byuksek\b/u,
  /\biyi\b/u,
  /\bkotu\b/u,
  /\bmakul\b/u,
  /\bsinir\b/u,
  /\bhedef\b/u,
  /\bkarsil(?:ar|iyor|adi|amak|ayan)\b/u,
  /\bgecer(?:li)?\b/u,
  /\bkaldirir\b/u,
  /\brahat(?:ca)?\b/u,
  /\bmarj\b/u,
  /\boner(?:i|ilir|mek)\b/u
] as const;

type MetricValueSnapshot = {
  label: string;
  metricId: string;
  outputId?: RequestedOutputId;
  value: string;
};

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isMetricOperation(
  operation: ReportAssistantPatchPreviewOperation
): operation is Extract<ReportAssistantPatchPreviewOperation, { type: "metric_value" }> {
  return operation.type === "metric_value";
}

function isReportNoteOperation(
  operation: ReportAssistantPatchPreviewOperation
): operation is Extract<ReportAssistantPatchPreviewOperation, { type: "report_note" }> {
  return operation.type === "report_note";
}

function isTextValueOperation(
  operation: ReportAssistantPatchPreviewOperation
): operation is Extract<ReportAssistantPatchPreviewOperation, { type: "text_value" }> {
  return operation.type === "text_value";
}

function parseReportDbValue(value: string): ParsedReportDbValue | null {
  const match = /^\s*(?:(<=|>=)\s*)?([+-]?\d+(?:\.(\d+))?)\s*(?:dB)?/u.exec(value);
  if (!match) {
    return null;
  }

  const numericDb = Number(match[2]);
  if (!Number.isFinite(numericDb)) {
    return null;
  }

  const rawBoundPrefix = match[1];
  const boundPrefix = rawBoundPrefix === "<="
    ? "<="
    : rawBoundPrefix === ">="
      ? ">="
      : undefined;

  return {
    boundPrefix,
    decimals: match[3]?.length ?? 0,
    numericDb,
    signed: /^[+-]/u.test(match[2])
  };
}

function formatReportDbValue(input: {
  boundPrefix?: "<=" | ">=";
  decimals: number;
  numericDb: number;
  signed: boolean;
}): string {
  const rounded = Number(input.numericDb.toFixed(Math.min(Math.max(input.decimals, 0), 1)));
  const numericLabel = input.decimals > 0 && !Number.isInteger(rounded)
    ? rounded.toFixed(Math.min(input.decimals, 1))
    : String(rounded);
  const signedLabel = input.signed && rounded >= 0 ? `+${numericLabel}` : numericLabel;
  const prefix = input.boundPrefix ? `${input.boundPrefix} ` : "";

  return `${prefix}${signedLabel} dB`;
}

function validatePatchShape(patch: unknown): ReportAssistantPatch | null {
  if (!isObjectRecord(patch) || typeof patch.summary !== "string" || !Array.isArray(patch.operations)) {
    return null;
  }

  const operations: ReportAssistantPatchOperation[] = [];
  for (const operation of patch.operations) {
    if (!isObjectRecord(operation) || typeof operation.reason !== "string" || typeof operation.type !== "string") {
      return null;
    }

    if (
      operation.type === "adjust_metric_db" &&
      typeof operation.metricId === "string" &&
      typeof operation.deltaDb === "number" &&
      Number.isFinite(operation.deltaDb)
    ) {
      operations.push({
        deltaDb: operation.deltaDb,
        metricId: operation.metricId,
        reason: operation.reason,
        type: "adjust_metric_db"
      });
      continue;
    }

    if (
      operation.type === "set_metric_display_value" &&
      typeof operation.metricId === "string" &&
      typeof operation.displayValue === "string"
    ) {
      operations.push({
        displayValue: operation.displayValue,
        metricId: operation.metricId,
        reason: operation.reason,
        type: "set_metric_display_value"
      });
      continue;
    }

    if (
      operation.type === "append_report_note" &&
      typeof operation.text === "string" &&
      (operation.section === "assumptions" ||
        operation.section === "recommendations" ||
        operation.section === "warnings")
    ) {
      operations.push({
        reason: operation.reason,
        section: operation.section,
        text: operation.text,
        type: "append_report_note"
      });
      continue;
    }

    if (
      operation.type === "replace_report_text_value" &&
      typeof operation.path === "string" &&
      typeof operation.beforeText === "string" &&
      typeof operation.beforeValue === "string" &&
      typeof operation.afterValue === "string"
    ) {
      operations.push({
        afterValue: operation.afterValue,
        beforeText: operation.beforeText,
        beforeValue: operation.beforeValue,
        path: operation.path,
        reason: operation.reason,
        type: "replace_report_text_value"
      });
      continue;
    }

    return null;
  }

  return {
    documentSignature: typeof patch.documentSignature === "string" ? patch.documentSignature : undefined,
    operations,
    requiresUserConfirmation: patch.requiresUserConfirmation === true,
    summary: patch.summary
  };
}

function shouldUseSignedFormatting(metric: ReportAssistantMetric, parsed: ParsedReportDbValue): boolean {
  return parsed.signed || (metric.outputId ? SIGNED_OUTPUT_IDS.has(metric.outputId) : false);
}

function previewMetricOperation(input: {
  metric: ReportAssistantMetric;
  operation: Extract<ReportAssistantPatchOperation, { type: "adjust_metric_db" | "set_metric_display_value" }>;
}): { errors: string[]; operation?: ReportAssistantPatchPreviewOperation; warnings: string[] } {
  const { metric, operation } = input;
  const errors: string[] = [];
  const warnings: string[] = [];

  if (metric.status === "needs_input" || metric.status === "unsupported") {
    return {
      errors: [`${metric.label} is ${metric.status} and cannot be turned into a numeric report value.`],
      warnings
    };
  }

  const parsedCurrent = parseReportDbValue(metric.reportDisplayValue);
  if (!parsedCurrent) {
    return {
      errors: [`${metric.label} value "${metric.reportDisplayValue}" is not a parseable dB value.`],
      warnings
    };
  }

  let afterValue: string;
  let numericDeltaDb: number;

  if (operation.type === "adjust_metric_db") {
    numericDeltaDb = operation.deltaDb;
    afterValue = formatReportDbValue({
      boundPrefix: parsedCurrent.boundPrefix,
      decimals: parsedCurrent.decimals,
      numericDb: parsedCurrent.numericDb + operation.deltaDb,
      signed: shouldUseSignedFormatting(metric, parsedCurrent)
    });
  } else {
    const parsedTarget = parseReportDbValue(operation.displayValue);
    if (!parsedTarget) {
      return {
        errors: [`${metric.label} target value "${operation.displayValue}" is not a parseable dB value.`],
        warnings
      };
    }

    if (parsedCurrent.boundPrefix && parsedTarget.boundPrefix && parsedCurrent.boundPrefix !== parsedTarget.boundPrefix) {
      errors.push(`${metric.label} is a ${parsedCurrent.boundPrefix} bound and cannot be changed to ${parsedTarget.boundPrefix}.`);
    }
    if (!parsedCurrent.boundPrefix && parsedTarget.boundPrefix) {
      errors.push(`${metric.label} is not a bound value, so the assistant cannot add ${parsedTarget.boundPrefix}.`);
    }

    numericDeltaDb = Number((parsedTarget.numericDb - parsedCurrent.numericDb).toFixed(1));
    afterValue = formatReportDbValue({
      boundPrefix: parsedCurrent.boundPrefix,
      decimals: Math.max(parsedCurrent.decimals, parsedTarget.decimals),
      numericDb: parsedTarget.numericDb,
      signed: shouldUseSignedFormatting(metric, parsedTarget)
    });
    if (parsedCurrent.boundPrefix && !parsedTarget.boundPrefix) {
      warnings.push(`${metric.label} bound prefix ${parsedCurrent.boundPrefix} was preserved.`);
    }
  }

  const absoluteMovementDb = Math.abs(numericDeltaDb);
  if (absoluteMovementDb > MAX_ASSISTANT_MOVEMENT_DB) {
    errors.push(`${metric.label} movement ${absoluteMovementDb} dB is above the assistant limit of ${MAX_ASSISTANT_MOVEMENT_DB} dB.`);
  }

  const requiresUserConfirmation = absoluteMovementDb > MAX_CONFIRMATION_FREE_MOVEMENT_DB;
  if (requiresUserConfirmation) {
    warnings.push(`${metric.label} movement ${absoluteMovementDb} dB requires extra confirmation.`);
  }

  if (metric.direction === "lower_is_better" && numericDeltaDb < 0) {
    warnings.push(`${metric.label} is lower-is-better; this numeric decrease reads as an improvement.`);
  } else if (metric.direction === "higher_is_better" && numericDeltaDb > 0) {
    warnings.push(`${metric.label} is higher-is-better; this numeric increase reads as an improvement.`);
  }

  if (errors.length > 0) {
    return { errors, warnings };
  }

  return {
    errors,
    operation: {
      afterValue,
      beforeValue: metric.reportDisplayValue,
      label: metric.label,
      locations: metric.locations,
      metricId: metric.id,
      numericDeltaDb,
      outputId: metric.outputId,
      reason: operation.reason,
      requiresUserConfirmation,
      type: "metric_value",
      warnings
    },
    warnings
  };
}

function addConsistencyTextPath(
  records: ReportConsistencyTextPath[],
  input: {
    auditExempt?: boolean;
    path: string;
    replaceable: boolean;
    surfacePolicy: ReportConsistencySurfacePolicy;
    text?: string;
  }
): void {
  if (typeof input.text !== "string") {
    return;
  }

  records.push({
    auditExempt: input.auditExempt === true,
    path: input.path,
    replaceable: input.replaceable,
    surfacePolicy: input.surfacePolicy,
    text: input.text
  });
}

export function collectReportConsistencyTextPaths(
  document: SimpleWorkbenchProposalDocument
): ReportConsistencyTextPath[] {
  const records: ReportConsistencyTextPath[] = [];

  addConsistencyTextPath(records, {
    path: "assemblyHeadline",
    replaceable: true,
    surfacePolicy: "client_narrative",
    text: document.assemblyHeadline
  });
  addConsistencyTextPath(records, {
    path: "executiveSummary",
    replaceable: true,
    surfacePolicy: "client_narrative",
    text: document.executiveSummary
  });
  addConsistencyTextPath(records, {
    path: "briefNote",
    replaceable: true,
    surfacePolicy: "client_narrative",
    text: document.briefNote
  });
  addConsistencyTextPath(records, {
    path: "validationDetail",
    replaceable: true,
    surfacePolicy: "client_narrative",
    text: document.validationDetail
  });
  addConsistencyTextPath(records, {
    path: "dynamicBranchDetail",
    replaceable: true,
    surfacePolicy: "client_narrative",
    text: document.dynamicBranchDetail
  });
  addConsistencyTextPath(records, {
    path: "corridorDossierHeadline",
    replaceable: true,
    surfacePolicy: "technical_narrative",
    text: document.corridorDossierHeadline
  });
  addConsistencyTextPath(records, {
    path: "methodDossierHeadline",
    replaceable: true,
    surfacePolicy: "technical_narrative",
    text: document.methodDossierHeadline
  });
  addConsistencyTextPath(records, {
    path: "decisionTrailHeadline",
    replaceable: true,
    surfacePolicy: "technical_narrative",
    text: document.decisionTrailHeadline
  });

  document.warnings.forEach((warning, index) =>
    addConsistencyTextPath(records, {
      path: `warnings.${String(index)}`,
      replaceable: true,
      surfacePolicy: "client_narrative",
      text: warning
    })
  );
  document.assumptionItems.forEach((item, index) =>
    addConsistencyTextPath(records, {
      path: `assumptionItems.${String(index)}.detail`,
      replaceable: true,
      surfacePolicy: "client_narrative",
      text: item.detail
    })
  );
  document.recommendationItems.forEach((item, index) =>
    addConsistencyTextPath(records, {
      path: `recommendationItems.${String(index)}.detail`,
      replaceable: true,
      surfacePolicy: "client_narrative",
      text: item.detail
    })
  );
  document.metrics.forEach((metric, index) => {
    addConsistencyTextPath(records, {
      path: `metrics.${String(index)}.detail`,
      replaceable: true,
      surfacePolicy: "client_narrative",
      text: metric.detail
    });
    addConsistencyTextPath(records, {
      auditExempt: true,
      path: `metrics.${String(index)}.engineDisplayValue`,
      replaceable: false,
      surfacePolicy: "audit_engine",
      text: metric.engineDisplayValue
    });
  });
  document.coverageItems.forEach((item, index) => {
    addConsistencyTextPath(records, {
      path: `coverageItems.${String(index)}.detail`,
      replaceable: true,
      surfacePolicy: "client_narrative",
      text: item.detail
    });
    addConsistencyTextPath(records, {
      path: `coverageItems.${String(index)}.postureDetail`,
      replaceable: true,
      surfacePolicy: "client_narrative",
      text: item.postureDetail
    });
    addConsistencyTextPath(records, {
      path: `coverageItems.${String(index)}.nextStep`,
      replaceable: true,
      surfacePolicy: "client_narrative",
      text: item.nextStep
    });
    addConsistencyTextPath(records, {
      auditExempt: true,
      path: `coverageItems.${String(index)}.engineDisplayValue`,
      replaceable: false,
      surfacePolicy: "audit_engine",
      text: item.engineDisplayValue
    });
  });
  document.corridorDossierCards.forEach((card, index) => {
    addConsistencyTextPath(records, {
      path: `corridorDossierCards.${String(index)}.value`,
      replaceable: true,
      surfacePolicy: "technical_narrative",
      text: card.value
    });
    addConsistencyTextPath(records, {
      path: `corridorDossierCards.${String(index)}.detail`,
      replaceable: true,
      surfacePolicy: "technical_narrative",
      text: card.detail
    });
  });
  document.methodDossierCards.forEach((card, index) => {
    addConsistencyTextPath(records, {
      path: `methodDossierCards.${String(index)}.value`,
      replaceable: true,
      surfacePolicy: "technical_narrative",
      text: card.value
    });
    addConsistencyTextPath(records, {
      path: `methodDossierCards.${String(index)}.detail`,
      replaceable: true,
      surfacePolicy: "technical_narrative",
      text: card.detail
    });
  });
  document.methodTraceGroups.forEach((group, groupIndex) => {
    addConsistencyTextPath(records, {
      path: `methodTraceGroups.${String(groupIndex)}.value`,
      replaceable: true,
      surfacePolicy: "technical_narrative",
      text: group.value
    });
    addConsistencyTextPath(records, {
      path: `methodTraceGroups.${String(groupIndex)}.detail`,
      replaceable: true,
      surfacePolicy: "technical_narrative",
      text: group.detail
    });
    group.notes.forEach((note, noteIndex) =>
      addConsistencyTextPath(records, {
        path: `methodTraceGroups.${String(groupIndex)}.notes.${String(noteIndex)}`,
        replaceable: true,
        surfacePolicy: "technical_narrative",
        text: note
      })
    );
  });
  document.decisionTrailItems.forEach((item, index) =>
    addConsistencyTextPath(records, {
      path: `decisionTrailItems.${String(index)}.detail`,
      replaceable: true,
      surfacePolicy: "technical_narrative",
      text: item.detail
    })
  );
  document.issueRegisterItems.forEach((item, index) =>
    addConsistencyTextPath(records, {
      path: `issueRegisterItems.${String(index)}.detail`,
      replaceable: true,
      surfacePolicy: "issue_metadata",
      text: item.detail
    })
  );
  document.citations.forEach((citation, index) => {
    addConsistencyTextPath(records, {
      path: `citations.${String(index)}.label`,
      replaceable: false,
      surfacePolicy: "evidence_source",
      text: citation.label
    });
    addConsistencyTextPath(records, {
      path: `citations.${String(index)}.detail`,
      replaceable: false,
      surfacePolicy: "evidence_source",
      text: citation.detail
    });
    addConsistencyTextPath(records, {
      path: `citations.${String(index)}.href`,
      replaceable: false,
      surfacePolicy: "evidence_source",
      text: citation.href
    });
  });
  document.reportAdjustments?.forEach((adjustment, index) => {
    addConsistencyTextPath(records, {
      auditExempt: true,
      path: `reportAdjustments.${String(index)}.beforeValue`,
      replaceable: false,
      surfacePolicy: "audit_engine",
      text: adjustment.beforeValue
    });
    addConsistencyTextPath(records, {
      auditExempt: true,
      path: `reportAdjustments.${String(index)}.afterValue`,
      replaceable: false,
      surfacePolicy: "audit_engine",
      text: adjustment.afterValue
    });
  });

  return records;
}

function getStringAtPath(document: SimpleWorkbenchProposalDocument, path: string): string | null {
  if (DIRECT_TEXT_REPLACEMENT_FIELDS.has(path as keyof SimpleWorkbenchProposalDocument)) {
    const value = document[path as keyof SimpleWorkbenchProposalDocument];
    return typeof value === "string" ? value : null;
  }

  const warningMatch = /^warnings\.(\d+)$/u.exec(path);
  if (warningMatch) {
    const index = Number(warningMatch[1]);
    return Number.isInteger(index) ? document.warnings[index] ?? null : null;
  }

  const briefItemMatch = /^(assumptionItems|recommendationItems)\.(\d+)\.detail$/u.exec(path);
  if (briefItemMatch) {
    const collection = briefItemMatch[1] === "assumptionItems" ? document.assumptionItems : document.recommendationItems;
    const index = Number(briefItemMatch[2]);
    return Number.isInteger(index) ? collection[index]?.detail ?? null : null;
  }

  const metricMatch = /^metrics\.(\d+)\.detail$/u.exec(path);
  if (metricMatch) {
    const index = Number(metricMatch[1]);
    return Number.isInteger(index) ? document.metrics[index]?.detail ?? null : null;
  }

  const coverageMatch = /^coverageItems\.(\d+)\.(detail|postureDetail|nextStep)$/u.exec(path);
  if (coverageMatch) {
    const index = Number(coverageMatch[1]);
    const key = coverageMatch[2] as "detail" | "nextStep" | "postureDetail";
    return Number.isInteger(index) ? document.coverageItems[index]?.[key] ?? null : null;
  }

  const dossierCardMatch = /^(corridorDossierCards|methodDossierCards)\.(\d+)\.(detail|value)$/u.exec(path);
  if (dossierCardMatch) {
    const collection = dossierCardMatch[1] === "corridorDossierCards"
      ? document.corridorDossierCards
      : document.methodDossierCards;
    const index = Number(dossierCardMatch[2]);
    const key = dossierCardMatch[3] as "detail" | "value";
    return Number.isInteger(index) ? collection[index]?.[key] ?? null : null;
  }

  const traceGroupMatch = /^methodTraceGroups\.(\d+)\.(detail|value)$/u.exec(path);
  if (traceGroupMatch) {
    const index = Number(traceGroupMatch[1]);
    const key = traceGroupMatch[2] as "detail" | "value";
    return Number.isInteger(index) ? document.methodTraceGroups[index]?.[key] ?? null : null;
  }

  const traceNoteMatch = /^methodTraceGroups\.(\d+)\.notes\.(\d+)$/u.exec(path);
  if (traceNoteMatch) {
    const groupIndex = Number(traceNoteMatch[1]);
    const noteIndex = Number(traceNoteMatch[2]);
    return Number.isInteger(groupIndex) && Number.isInteger(noteIndex)
      ? document.methodTraceGroups[groupIndex]?.notes[noteIndex] ?? null
      : null;
  }

  const decisionTrailMatch = /^decisionTrailItems\.(\d+)\.detail$/u.exec(path);
  if (decisionTrailMatch) {
    const index = Number(decisionTrailMatch[1]);
    return Number.isInteger(index) ? document.decisionTrailItems[index]?.detail ?? null : null;
  }

  const issueRegisterMatch = /^issueRegisterItems\.(\d+)\.detail$/u.exec(path);
  if (issueRegisterMatch) {
    const index = Number(issueRegisterMatch[1]);
    return Number.isInteger(index) ? document.issueRegisterItems[index]?.detail ?? null : null;
  }

  const citationMatch = /^citations\.(\d+)\.(detail|href|label)$/u.exec(path);
  if (citationMatch) {
    const index = Number(citationMatch[1]);
    const key = citationMatch[2] as "detail" | "href" | "label";
    return Number.isInteger(index) ? document.citations[index]?.[key] ?? null : null;
  }

  return null;
}

function getReportTextAtPath(document: SimpleWorkbenchProposalDocument, path: string): string | null {
  const record = collectReportConsistencyTextPaths(document).find((entry) => entry.path === path);
  if (!record?.replaceable) {
    return null;
  }

  return getStringAtPath(document, path);
}

function setReportTextAtPath(
  document: SimpleWorkbenchProposalDocument,
  path: string,
  value: string
): SimpleWorkbenchProposalDocument {
  if (DIRECT_TEXT_REPLACEMENT_FIELDS.has(path as keyof SimpleWorkbenchProposalDocument)) {
    return {
      ...document,
      [path]: value
    };
  }

  const warningMatch = /^warnings\.(\d+)$/u.exec(path);
  if (warningMatch) {
    const index = Number(warningMatch[1]);
    return Number.isInteger(index)
      ? {
          ...document,
          warnings: document.warnings.map((warning, warningIndex) => (warningIndex === index ? value : warning))
        }
      : document;
  }

  const briefItemMatch = /^(assumptionItems|recommendationItems)\.(\d+)\.detail$/u.exec(path);
  if (briefItemMatch) {
    const collectionKey = briefItemMatch[1] as "assumptionItems" | "recommendationItems";
    const index = Number(briefItemMatch[2]);
    return Number.isInteger(index)
      ? {
          ...document,
          [collectionKey]: document[collectionKey].map((item, itemIndex) => (itemIndex === index ? { ...item, detail: value } : item))
        }
      : document;
  }

  const metricMatch = /^metrics\.(\d+)\.detail$/u.exec(path);
  if (metricMatch) {
    const index = Number(metricMatch[1]);
    return Number.isInteger(index)
      ? {
          ...document,
          metrics: document.metrics.map((metric, metricIndex) => (metricIndex === index ? { ...metric, detail: value } : metric))
        }
      : document;
  }

  const coverageMatch = /^coverageItems\.(\d+)\.(detail|postureDetail|nextStep)$/u.exec(path);
  if (coverageMatch) {
    const index = Number(coverageMatch[1]);
    const key = coverageMatch[2] as "detail" | "nextStep" | "postureDetail";
    return Number.isInteger(index)
      ? {
          ...document,
          coverageItems: document.coverageItems.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item))
        }
      : document;
  }

  const dossierCardMatch = /^(corridorDossierCards|methodDossierCards)\.(\d+)\.(detail|value)$/u.exec(path);
  if (dossierCardMatch) {
    const collectionKey = dossierCardMatch[1] as "corridorDossierCards" | "methodDossierCards";
    const index = Number(dossierCardMatch[2]);
    const key = dossierCardMatch[3] as "detail" | "value";
    return Number.isInteger(index)
      ? {
          ...document,
          [collectionKey]: document[collectionKey].map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item))
        }
      : document;
  }

  const traceGroupMatch = /^methodTraceGroups\.(\d+)\.(detail|value)$/u.exec(path);
  if (traceGroupMatch) {
    const index = Number(traceGroupMatch[1]);
    const key = traceGroupMatch[2] as "detail" | "value";
    return Number.isInteger(index)
      ? {
          ...document,
          methodTraceGroups: document.methodTraceGroups.map((group, groupIndex) => (groupIndex === index ? { ...group, [key]: value } : group))
        }
      : document;
  }

  const traceNoteMatch = /^methodTraceGroups\.(\d+)\.notes\.(\d+)$/u.exec(path);
  if (traceNoteMatch) {
    const groupIndex = Number(traceNoteMatch[1]);
    const noteIndex = Number(traceNoteMatch[2]);
    return Number.isInteger(groupIndex) && Number.isInteger(noteIndex)
      ? {
          ...document,
          methodTraceGroups: document.methodTraceGroups.map((group, index) =>
            index === groupIndex
              ? { ...group, notes: group.notes.map((note, nestedIndex) => (nestedIndex === noteIndex ? value : note)) }
              : group
          )
        }
      : document;
  }

  const decisionTrailMatch = /^decisionTrailItems\.(\d+)\.detail$/u.exec(path);
  if (decisionTrailMatch) {
    const index = Number(decisionTrailMatch[1]);
    return Number.isInteger(index)
      ? {
          ...document,
          decisionTrailItems: document.decisionTrailItems.map((item, itemIndex) => (itemIndex === index ? { ...item, detail: value } : item))
        }
      : document;
  }

  const issueRegisterMatch = /^issueRegisterItems\.(\d+)\.detail$/u.exec(path);
  if (issueRegisterMatch) {
    const index = Number(issueRegisterMatch[1]);
    return Number.isInteger(index)
      ? {
          ...document,
          issueRegisterItems: document.issueRegisterItems.map((item, itemIndex) => (itemIndex === index ? { ...item, detail: value } : item))
        }
      : document;
  }

  return document;
}

function countLiteralOccurrences(input: {
  haystack: string;
  needle: string;
}): number {
  if (input.needle.length === 0) {
    return 0;
  }

  let count = 0;
  let index = input.haystack.indexOf(input.needle);
  while (index !== -1) {
    count += 1;
    index = input.haystack.indexOf(input.needle, index + input.needle.length);
  }

  return count;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function previewTextValueOperation(input: {
  document: SimpleWorkbenchProposalDocument;
  operation: Extract<ReportAssistantPatchOperation, { type: "replace_report_text_value" }>;
}): { errors: string[]; operation?: ReportAssistantPatchPreviewOperation; warnings: string[] } {
  const { document, operation } = input;
  const errors: string[] = [];
  const warnings: string[] = [];
  const path = operation.path.trim();
  const beforeValue = operation.beforeValue.trim();
  const afterValue = operation.afterValue.trim();

  if (path.length === 0) {
    errors.push("Text replacement path cannot be empty.");
  }
  if (beforeValue.length === 0 || afterValue.length === 0) {
    errors.push("Text replacement beforeValue and afterValue cannot be empty.");
  }

  const currentText = getReportTextAtPath(document, path);
  if (currentText === null) {
    errors.push(`Text replacement path ${path} is not an allowed report text location.`);
  } else if (currentText !== operation.beforeText) {
    errors.push(`Text replacement path ${path} no longer matches the expected current text.`);
  } else if (!currentText.includes(beforeValue)) {
    errors.push(`Text replacement path ${path} does not contain ${beforeValue}.`);
  }

  if (errors.length > 0 || currentText === null) {
    return { errors, warnings };
  }

  const replacementCount = countLiteralOccurrences({
    haystack: currentText,
    needle: beforeValue
  });
  const afterText = currentText.split(beforeValue).join(afterValue);
  if (replacementCount > 1) {
    warnings.push(`Text replacement path ${path} contains ${replacementCount} occurrences of ${beforeValue}; all are replaced in this one text field.`);
  }
  if (afterText === currentText) {
    errors.push(`Text replacement path ${path} would not change the current report text.`);
    return { errors, warnings };
  }

  return {
    errors,
    operation: {
      afterText,
      afterValue,
      beforeText: currentText,
      beforeValue,
      path,
      reason: operation.reason,
      replacementCount,
      type: "text_value",
      warnings
    },
    warnings
  };
}

export function validateReportAssistantPatch(input: {
  context: ReportAssistantContext;
  document: SimpleWorkbenchProposalDocument;
  patch: unknown;
}): ReportAssistantPatchValidationResult {
  const documentSignature = createReportAssistantDocumentSignature(input.document);
  const patch = validatePatchShape(input.patch);
  const errors: string[] = [];
  const warnings: string[] = [];
  const operations: ReportAssistantPatchPreviewOperation[] = [];

  if (!patch) {
    return {
      documentSignature,
      errors: ["Report assistant patch does not match the expected operation schema."],
      operations,
      patchSummary: "",
      requiresUserConfirmation: false,
      status: "rejected",
      warnings
    };
  }

  if (input.context.documentSignature !== documentSignature) {
    errors.push("Current report document no longer matches the assistant context.");
  }
  if (patch.documentSignature && patch.documentSignature !== input.context.documentSignature) {
    errors.push("Patch was produced for a different report document signature.");
  }
  if (patch.operations.length === 0) {
    errors.push("Report assistant patch must include at least one operation.");
  }

  const metricById = new Map(input.context.metrics.map((metric) => [metric.id, metric]));

  for (const operation of patch.operations) {
    if (operation.type === "append_report_note") {
      const text = operation.text.trim();
      if (text.length === 0) {
        errors.push("Report note operation cannot append empty text.");
        continue;
      }
      operations.push({
        reason: operation.reason,
        section: operation.section,
        text,
        type: "report_note",
        warnings: []
      });
      continue;
    }

    if (operation.type === "replace_report_text_value") {
      const preview = previewTextValueOperation({
        document: input.document,
        operation
      });
      errors.push(...preview.errors);
      warnings.push(...preview.warnings);
      if (preview.operation) {
        operations.push(preview.operation);
      }
      continue;
    }

    const metric = metricById.get(operation.metricId);
    if (!metric) {
      errors.push(`Metric id ${operation.metricId} does not exist in the current report context.`);
      continue;
    }

    const preview = previewMetricOperation({
      metric,
      operation
    });
    errors.push(...preview.errors);
    warnings.push(...preview.warnings);
    if (preview.operation) {
      operations.push(preview.operation);
    }
  }

  const requiresUserConfirmation =
    patch.requiresUserConfirmation === true ||
    operations.some((operation) => isMetricOperation(operation) && operation.requiresUserConfirmation);

  return {
    documentSignature,
    errors,
    operations,
    patchSummary: patch.summary,
    requiresUserConfirmation,
    status: errors.length > 0 ? "rejected" : requiresUserConfirmation ? "requires_confirmation" : "valid",
    warnings
  };
}

function applyMetricValueAtLocation(
  document: SimpleWorkbenchProposalDocument,
  location: ReportAssistantMetricLocation,
  value: string
): SimpleWorkbenchProposalDocument {
  switch (location.kind) {
    case "primaryMetric":
      return {
        ...document,
        primaryMetricValue: value
      };
    case "metricRow":
      return {
        ...document,
        metrics: document.metrics.map((metric, index) => (index === location.index ? { ...metric, value } : metric))
      };
    case "coverageRow":
      return {
        ...document,
        coverageItems: document.coverageItems.map((item, index) => (index === location.index ? { ...item, value } : item))
      };
    default:
      return document;
  }
}

function appendReportNote(
  document: SimpleWorkbenchProposalDocument,
  operation: Extract<ReportAssistantPatchPreviewOperation, { type: "report_note" }>
): SimpleWorkbenchProposalDocument {
  switch (operation.section) {
    case "warnings":
      return {
        ...document,
        warnings: [...document.warnings, operation.text]
      };
    case "assumptions":
      return {
        ...document,
        assumptionItems: [
          ...document.assumptionItems,
          { detail: operation.text, label: "Report assistant note", tone: "neutral" }
        ]
      };
    case "recommendations":
      return {
        ...document,
        recommendationItems: [
          ...document.recommendationItems,
          { detail: operation.text, label: "Report assistant note", tone: "neutral" }
        ]
      };
    default:
      return document;
  }
}

function buildAdjustment(input: {
  appliedAtIso: string;
  index: number;
  operation: Extract<ReportAssistantPatchPreviewOperation, { type: "metric_value" }>;
  scope: "export_only" | "saved_snapshot";
  source: "assistant" | "manual";
}): SimpleWorkbenchProposalReportAdjustment {
  const timestamp = input.appliedAtIso.replace(/[^0-9A-Za-z]/gu, "");

  return {
    afterValue: input.operation.afterValue,
    appliedAtIso: input.appliedAtIso,
    beforeValue: input.operation.beforeValue,
    engineValuePreserved: true,
    id: `report-adjustment-${timestamp}-${String(input.index + 1)}`,
    label: input.operation.label,
    metricId: input.operation.metricId,
    outputId: input.operation.outputId,
    reason: input.operation.reason,
    scope: input.scope,
    source: input.source
  };
}

export function applyValidatedReportAssistantPatch(
  document: SimpleWorkbenchProposalDocument,
  validation: ReportAssistantPatchValidationResult,
  options?: {
    appliedAtIso?: string;
    confirmed?: boolean;
    scope?: "export_only" | "saved_snapshot";
    source?: "assistant" | "manual";
  }
): SimpleWorkbenchProposalDocument {
  if (validation.status === "rejected") {
    throw new Error(validation.errors.join(" "));
  }
  if (validation.requiresUserConfirmation && options?.confirmed !== true) {
    throw new Error("Report assistant patch requires user confirmation before it can be applied.");
  }

  const appliedAtIso = options?.appliedAtIso ?? new Date().toISOString();
  const source = options?.source ?? "assistant";
  const scope = options?.scope ?? "export_only";
  let nextDocument = document;
  const adjustments: SimpleWorkbenchProposalReportAdjustment[] = [];

  validation.operations.forEach((operation, index) => {
    if (isMetricOperation(operation)) {
      for (const location of operation.locations) {
        nextDocument = applyMetricValueAtLocation(nextDocument, location, operation.afterValue);
      }
      adjustments.push(buildAdjustment({ appliedAtIso, index, operation, scope, source }));
      return;
    }

    if (isReportNoteOperation(operation)) {
      nextDocument = appendReportNote(nextDocument, operation);
      return;
    }

    if (isTextValueOperation(operation)) {
      nextDocument = setReportTextAtPath(nextDocument, operation.path, operation.afterText);
    }
  });

  if (adjustments.length === 0) {
    return nextDocument;
  }

  return {
    ...nextDocument,
    reportAdjustments: [...(nextDocument.reportAdjustments ?? []), ...adjustments]
  };
}

function normalizeMentionLabel(value: string): string {
  return value
    .replace(/[İIı]/gu, "i")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "");
}

function normalizeSemanticText(value: string): string {
  return value
    .replace(/[İIı]/gu, "i")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9+-]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function includesSemanticStaleClaim(value: string): boolean {
  const normalized = normalizeSemanticText(value);
  return SEMANTIC_STALE_CLAIM_PATTERNS.some((pattern) => pattern.test(normalized));
}

function containsMetricLabel(input: {
  label: string;
  text: string;
}): boolean {
  const normalizedLabel = normalizeMentionLabel(input.label);
  if (normalizedLabel.length === 0) {
    return false;
  }

  return input.text
    .split(/[^A-Za-z0-9İIıĞÜŞÖÇğüşöç,+-]+/u)
    .some((token) => normalizeMentionLabel(token) === normalizedLabel);
}

function hasNearbyMetricLabelValue(input: {
  label: string;
  text: string;
  value: string;
}): boolean {
  const label = input.label.trim();
  const value = input.value.trim();
  if (label.length === 0 || value.length === 0) {
    return false;
  }

  const labelPattern = escapeRegExp(label).replace(/\\,/gu, "\\s*,\\s*");
  const valuePattern = escapeRegExp(value).replace(/\\ /gu, "\\s+");
  const between = "[^\\n.;:]{0,48}";
  return new RegExp(`(?:${labelPattern}${between}${valuePattern}|${valuePattern}${between}${labelPattern})`, "iu").test(input.text);
}

function getDocumentMetricIdForLabel(input: {
  label: string;
  outputId?: RequestedOutputId;
  reportMetricId?: string;
}): string {
  return getMetricSnapshotId({
    label: input.label,
    outputId: input.outputId,
    reportMetricId: input.reportMetricId
  });
}

function isMetricOwnedTextPath(input: {
  adjustment: SimpleWorkbenchProposalReportAdjustment;
  document: SimpleWorkbenchProposalDocument;
  path: string;
}): boolean {
  const metricMatch = /^metrics\.(\d+)\.detail$/u.exec(input.path);
  if (metricMatch) {
    const index = Number(metricMatch[1]);
    const metric = Number.isInteger(index) ? input.document.metrics[index] : undefined;
    return metric
      ? getDocumentMetricIdForLabel({
          label: metric.label,
          outputId: metric.outputId,
          reportMetricId: metric.reportMetricId
        }) === input.adjustment.metricId
      : false;
  }

  const coverageMatch = /^coverageItems\.(\d+)\.(detail|postureDetail|nextStep)$/u.exec(input.path);
  if (coverageMatch) {
    const index = Number(coverageMatch[1]);
    const item = Number.isInteger(index) ? input.document.coverageItems[index] : undefined;
    return item
      ? getDocumentMetricIdForLabel({
          label: item.label,
          outputId: item.outputId,
          reportMetricId: item.reportMetricId
        }) === input.adjustment.metricId
      : false;
  }

  return false;
}

function shouldFlagSemanticConsistencyClaim(input: {
  adjustment: SimpleWorkbenchProposalReportAdjustment;
  document: SimpleWorkbenchProposalDocument;
  record: ReportConsistencyTextPath;
}): boolean {
  if (!input.record.replaceable || input.record.auditExempt || input.record.surfacePolicy === "evidence_source") {
    return false;
  }

  if (input.record.text.includes(input.adjustment.beforeValue)) {
    return false;
  }

  if (!includesSemanticStaleClaim(input.record.text)) {
    return false;
  }

  return (
    isMetricOwnedTextPath({
      adjustment: input.adjustment,
      document: input.document,
      path: input.record.path
    }) ||
    containsMetricLabel({
      label: input.adjustment.label,
      text: input.record.text
    })
  );
}

function classifyReportAdjustmentMention(input: {
  adjustment: SimpleWorkbenchProposalReportAdjustment;
  document: SimpleWorkbenchProposalDocument;
  mention: ReportAssistantValueMention;
}): ReportAssistantClassifiedValueMention {
  const { adjustment, document, mention } = input;
  const currentLabelMatches = containsMetricLabel({
    label: adjustment.label,
    text: mention.value
  });
  const otherLabelMatches = [
    document.primaryMetricLabel,
    ...document.metrics.map((metric) => metric.label),
    ...document.coverageItems.map((item) => item.label)
  ].some((label) =>
    normalizeMentionLabel(label) !== normalizeMentionLabel(adjustment.label) &&
    containsMetricLabel({
      label,
      text: mention.value
    })
  );
  let classification: ReportAssistantValueMentionClassification;
  let blocking = true;
  let reason: string;

  if (mention.surfacePolicy === "audit_engine" || mention.auditExempt) {
    classification = "audit_engine_value";
    blocking = false;
    reason = `${adjustment.beforeValue} is preserved in an engine/audit field, not stale report copy.`;
  } else if (mention.surfacePolicy === "evidence_source") {
    classification = "evidence_source_value";
    blocking = false;
    reason = `${adjustment.beforeValue} appears in source/evidence text; review it as evidence instead of replacing it automatically.`;
  } else if (
    hasNearbyMetricLabelValue({
      label: adjustment.label,
      text: mention.value,
      value: adjustment.beforeValue
    })
  ) {
    classification = "exact_metric_label_value";
    reason = `${adjustment.label} old value ${adjustment.beforeValue} still appears in report text.`;
  } else if (currentLabelMatches) {
    classification = "unresolved";
    reason = `${adjustment.label} is mentioned with old value ${adjustment.beforeValue}, but the exact label/value relation needs review.`;
  } else if (otherLabelMatches) {
    classification = "unrelated_numeric_mention";
    blocking = false;
    reason = `${adjustment.beforeValue} appears with another metric label, so it is not automatically treated as stale ${adjustment.label} text.`;
  } else {
    classification = "ambiguous_numeric_only";
    reason = `${adjustment.beforeValue} appears without a metric label; resolve or confirm it before export.`;
  }

  return {
    ...mention,
    afterValue: adjustment.afterValue,
    beforeValue: adjustment.beforeValue,
    blocking,
    classification,
    label: adjustment.label,
    metricId: adjustment.metricId,
    reason
  };
}

export function findReportValueMentions(
  document: SimpleWorkbenchProposalDocument,
  needle: string
): ReportAssistantValueMention[] {
  const trimmedNeedle = needle.trim();
  if (trimmedNeedle.length === 0) {
    return [];
  }

  return collectReportConsistencyTextPaths(document)
    .filter((record) => record.replaceable && record.text.includes(trimmedNeedle))
    .map((record) => ({
      auditExempt: record.auditExempt,
      path: record.path,
      replaceable: record.replaceable,
      surfacePolicy: record.surfacePolicy,
      value: record.text
    }));
}

function findReportConsistencyValueMentions(
  document: SimpleWorkbenchProposalDocument,
  needle: string
): ReportAssistantValueMention[] {
  const trimmedNeedle = needle.trim();
  if (trimmedNeedle.length === 0) {
    return [];
  }

  return collectReportConsistencyTextPaths(document)
    .filter((record) => !record.auditExempt && record.text.includes(trimmedNeedle))
    .map((record) => ({
      auditExempt: record.auditExempt,
      path: record.path,
      replaceable: record.replaceable,
      surfacePolicy: record.surfacePolicy,
      value: record.text
    }));
}

function getMetricSnapshotId(input: {
  label: string;
  outputId?: RequestedOutputId;
  reportMetricId?: string;
}): string {
  const outputId = inferReportAssistantOutputId({
    label: input.label,
    outputId: input.outputId
  });

  return input.reportMetricId ?? (outputId ? getReportAssistantMetricId(outputId) : `label:${normalizeMentionLabel(input.label)}`);
}

function collectMetricValueSnapshots(document: SimpleWorkbenchProposalDocument): MetricValueSnapshot[] {
  const snapshots = new Map<string, MetricValueSnapshot>();
  const addSnapshot = (input: {
    label: string;
    outputId?: RequestedOutputId;
    reportMetricId?: string;
    value: string;
  }) => {
    const metricId = getMetricSnapshotId(input);
    if (snapshots.has(metricId)) {
      return;
    }

    snapshots.set(metricId, {
      label: input.label,
      metricId,
      outputId: input.outputId,
      value: input.value
    });
  };

  addSnapshot({
    label: document.primaryMetricLabel,
    value: document.primaryMetricValue
  });
  document.metrics.forEach((metric) =>
    addSnapshot({
      label: metric.label,
      outputId: metric.outputId,
      reportMetricId: metric.reportMetricId,
      value: metric.value
    })
  );
  document.coverageItems.forEach((item) =>
    addSnapshot({
      label: item.label,
      outputId: item.outputId,
      reportMetricId: item.reportMetricId,
      value: item.value
    })
  );

  return [...snapshots.values()];
}

function buildManualReportAdjustments(input: {
  baseDocument?: SimpleWorkbenchProposalDocument;
  document: SimpleWorkbenchProposalDocument;
}): SimpleWorkbenchProposalReportAdjustment[] {
  if (!input.baseDocument) {
    return [];
  }

  const baseByMetricId = new Map(collectMetricValueSnapshots(input.baseDocument).map((snapshot) => [snapshot.metricId, snapshot]));
  const adjustments: SimpleWorkbenchProposalReportAdjustment[] = [];

  collectMetricValueSnapshots(input.document).forEach((snapshot, index) => {
    const base = baseByMetricId.get(snapshot.metricId);
    if (!base || base.value === snapshot.value) {
      return;
    }

    adjustments.push({
      afterValue: snapshot.value,
      appliedAtIso: "manual-current-snapshot",
      beforeValue: base.value,
      engineValuePreserved: true,
      id: `manual-report-adjustment-${snapshot.metricId.replace(/[^0-9A-Za-z]+/gu, "-")}-${String(index + 1)}`,
      label: snapshot.label,
      metricId: snapshot.metricId,
      outputId: snapshot.outputId,
      reason: "Manual report metric value differs from the packaged calculator snapshot.",
      scope: "export_only",
      source: "manual"
    });
  });

  return adjustments;
}

function collectEffectiveReportAdjustments(input: {
  baseDocument?: SimpleWorkbenchProposalDocument;
  document: SimpleWorkbenchProposalDocument;
}): SimpleWorkbenchProposalReportAdjustment[] {
  const adjustmentByKey = new Map<string, SimpleWorkbenchProposalReportAdjustment>();

  [...(input.document.reportAdjustments ?? []), ...buildManualReportAdjustments(input)].forEach((adjustment) => {
    const key = `${adjustment.metricId}\u0000${adjustment.beforeValue}\u0000${adjustment.afterValue}`;
    if (!adjustmentByKey.has(key)) {
      adjustmentByKey.set(key, adjustment);
    }
  });

  return [...adjustmentByKey.values()];
}

function findSemanticReportConsistencyMentions(input: {
  adjustment: SimpleWorkbenchProposalReportAdjustment;
  document: SimpleWorkbenchProposalDocument;
}): ReportAssistantClassifiedValueMention[] {
  return collectReportConsistencyTextPaths(input.document)
    .filter((record) =>
      shouldFlagSemanticConsistencyClaim({
        adjustment: input.adjustment,
        document: input.document,
        record
      })
    )
    .map((record) => ({
      afterValue: input.adjustment.afterValue,
      auditExempt: record.auditExempt,
      beforeValue: input.adjustment.beforeValue,
      blocking: true,
      classification: "semantic_metric_claim" as const,
      label: input.adjustment.label,
      metricId: input.adjustment.metricId,
      path: record.path,
      reason:
        `${input.adjustment.label} changed from ${input.adjustment.beforeValue} to ${input.adjustment.afterValue}, ` +
        `but this text contains qualitative target/pass/margin wording that may no longer be true. Review and rewrite it manually.`,
      replaceable: record.replaceable,
      surfacePolicy: record.surfacePolicy,
      value: record.text
    }));
}

export function findReportAdjustmentConsistencyMentions(
  document: SimpleWorkbenchProposalDocument,
  options?: {
    baseDocument?: SimpleWorkbenchProposalDocument;
  }
): ReportAssistantClassifiedValueMention[] {
  const classified: ReportAssistantClassifiedValueMention[] = [];

  for (const adjustment of collectEffectiveReportAdjustments({
    baseDocument: options?.baseDocument,
    document
  })) {
    if (adjustment.beforeValue.trim().length === 0 || adjustment.beforeValue === adjustment.afterValue) {
      continue;
    }

    for (const mention of findReportConsistencyValueMentions(document, adjustment.beforeValue)) {
      classified.push(classifyReportAdjustmentMention({
        adjustment,
        document,
        mention
      }));
    }

    classified.push(...findSemanticReportConsistencyMentions({
      adjustment,
      document
    }));
  }

  return classified;
}

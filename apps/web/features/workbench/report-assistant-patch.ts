import type { RequestedOutputId } from "@dynecho/shared";

import type {
  SimpleWorkbenchProposalDocument,
  SimpleWorkbenchProposalReportAdjustment
} from "./simple-workbench-proposal";
import {
  createReportAssistantDocumentSignature,
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
  path: string;
  value: string;
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

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isMetricOperation(
  operation: ReportAssistantPatchPreviewOperation
): operation is Extract<ReportAssistantPatchPreviewOperation, { type: "metric_value" }> {
  return operation.type === "metric_value";
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

    nextDocument = appendReportNote(nextDocument, operation);
  });

  if (adjustments.length === 0) {
    return nextDocument;
  }

  return {
    ...nextDocument,
    reportAdjustments: [...(nextDocument.reportAdjustments ?? []), ...adjustments]
  };
}

function collectStringMentions(input: {
  mentions: ReportAssistantValueMention[];
  path: string;
  value: string;
  needle: string;
}): void {
  if (input.needle.trim().length > 0 && input.value.includes(input.needle)) {
    input.mentions.push({
      path: input.path,
      value: input.value
    });
  }
}

export function findReportValueMentions(
  document: SimpleWorkbenchProposalDocument,
  needle: string
): ReportAssistantValueMention[] {
  const mentions: ReportAssistantValueMention[] = [];

  collectStringMentions({ mentions, needle, path: "executiveSummary", value: document.executiveSummary });
  collectStringMentions({ mentions, needle, path: "briefNote", value: document.briefNote });
  collectStringMentions({ mentions, needle, path: "validationDetail", value: document.validationDetail });
  document.warnings.forEach((warning, index) =>
    collectStringMentions({ mentions, needle, path: `warnings.${String(index)}`, value: warning })
  );
  document.assumptionItems.forEach((item, index) =>
    collectStringMentions({ mentions, needle, path: `assumptionItems.${String(index)}.detail`, value: item.detail })
  );
  document.recommendationItems.forEach((item, index) =>
    collectStringMentions({ mentions, needle, path: `recommendationItems.${String(index)}.detail`, value: item.detail })
  );

  return mentions;
}

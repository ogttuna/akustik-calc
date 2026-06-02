import type { ReportAssistantContext } from "./report-assistant-context";
import type { PlausibilitySourceSummary } from "./report-assistant-finding";
import type { ReportAssistantPatch } from "./report-assistant-patch";

export type ReportAssistantPlausibilityVerdict =
  | "insufficient_context"
  | "likely_wrong"
  | "plausible"
  | "suspicious";

export type ReportAssistantPlausibilitySeverity = "high" | "low" | "medium";

export type ReportAssistantPlausibilityRequest = {
  metricId: string;
  research?: boolean;
  sources?: readonly PlausibilitySourceSummary[];
  suggestPatch?: boolean;
  userInstruction?: string;
};

export type ReportAssistantPlausibilityReview = {
  engineDisplayValue?: string;
  metric: string;
  metricId: string;
  rationale: readonly string[];
  severity: ReportAssistantPlausibilitySeverity;
  sources: readonly PlausibilitySourceSummary[];
  suggestedReportPatch?: ReportAssistantPatch;
  valueReviewed: string;
  verdict: ReportAssistantPlausibilityVerdict;
};

export type ReportAssistantPlausibilityReviewResult =
  | {
      errors: readonly string[];
      ok: false;
    }
  | {
      ok: true;
      review: ReportAssistantPlausibilityReview;
    };

type ParsedDbValue = {
  numericDb: number;
};

const MAX_CONTEXT_ONLY_SUGGESTED_PATCH_MOVEMENT_DB = 10;
const MIN_CONTEXT_ONLY_SUGGESTED_PATCH_MOVEMENT_DB = 5;

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function normalizeSource(value: unknown): PlausibilitySourceSummary | null {
  if (!isObjectRecord(value) || typeof value.title !== "string" || typeof value.url !== "string") {
    return null;
  }

  const title = value.title.trim();
  const url = value.url.trim();
  if (title.length === 0 || !/^https?:\/\//iu.test(url)) {
    return null;
  }

  return {
    accessedAtIso: normalizeOptionalString(value.accessedAtIso),
    note: normalizeOptionalString(value.note),
    title,
    url
  };
}

export function parseReportAssistantPlausibilityRequest(value: unknown): ReportAssistantPlausibilityRequest | null {
  if (!isObjectRecord(value) || typeof value.metricId !== "string") {
    return null;
  }

  const sources = Array.isArray(value.sources)
    ? value.sources.map((entry) => normalizeSource(entry)).filter((entry): entry is PlausibilitySourceSummary => entry !== null)
    : [];

  return {
    metricId: value.metricId,
    research: value.research === true,
    sources,
    suggestPatch: value.suggestPatch !== false,
    userInstruction: normalizeOptionalString(value.userInstruction)
  };
}

function parseDbValue(value: string | undefined): ParsedDbValue | null {
  if (!value) {
    return null;
  }

  const match = /^\s*(?:(?:<=|>=|[<>]=?)\s*)?([+-]?\d+(?:\.\d+)?)/u.exec(value);
  if (!match) {
    return null;
  }

  const numericDb = Number(match[1]);
  return Number.isFinite(numericDb) ? { numericDb } : null;
}

function isMoreFavorable(input: {
  deltaDb: number;
  direction: "higher_is_better" | "lower_is_better" | "neutral";
}): boolean | null {
  if (input.direction === "higher_is_better") {
    return input.deltaDb > 0;
  }
  if (input.direction === "lower_is_better") {
    return input.deltaDb < 0;
  }

  return null;
}

function reviewFromContextOnly(input: {
  absoluteDeltaDb: number;
}): {
  severity: ReportAssistantPlausibilitySeverity;
  verdict: ReportAssistantPlausibilityVerdict;
} {
  if (input.absoluteDeltaDb > 10) {
    return {
      severity: "high",
      verdict: "likely_wrong"
    };
  }

  if (input.absoluteDeltaDb > 5) {
    return {
      severity: "medium",
      verdict: "suspicious"
    };
  }

  if (input.absoluteDeltaDb > 2) {
    return {
      severity: "low",
      verdict: "suspicious"
    };
  }

  return {
    severity: "low",
    verdict: "plausible"
  };
}

function buildRestoreEnginePatch(input: {
  context: ReportAssistantContext;
  engineDisplayValue: string;
  metricId: string;
  metricLabel: string;
}): ReportAssistantPatch {
  return {
    documentSignature: input.context.documentSignature,
    operations: [
      {
        displayValue: input.engineDisplayValue,
        metricId: input.metricId,
        reason: `Plausibility review suggested restoring ${input.metricLabel} to the captured engine value.`,
        type: "set_metric_display_value"
      }
    ],
    summary: `Restore ${input.metricLabel} to the captured engine value ${input.engineDisplayValue}.`
  };
}

export function reviewReportAssistantMetricPlausibility(input: {
  context: ReportAssistantContext;
  request: ReportAssistantPlausibilityRequest;
}): ReportAssistantPlausibilityReviewResult {
  const metric = input.context.metrics.find((entry) => entry.id === input.request.metricId);
  if (!metric) {
    return {
      errors: [`Metric id ${input.request.metricId} does not exist in the current report context.`],
      ok: false
    };
  }

  const sources = input.request.sources ?? [];
  const rationale: string[] = [
    `Review mode: context-only${sources.length > 0 ? " with user-supplied source metadata" : "; no external web research is attached"}.`,
    `Metric ${metric.label} is ${metric.status}, basis ${metric.basis}, direction ${metric.direction}.`
  ];

  if (input.context.traceSummary.selectedCandidateId || input.context.traceSummary.selectedOrigin) {
    rationale.push(
      `Trace: ${input.context.traceSummary.selectedCandidateId ?? "candidate unknown"} / ${input.context.traceSummary.selectedOrigin ?? "origin unknown"}.`
    );
  }

  if (metric.status === "needs_input" || metric.status === "unsupported") {
    rationale.push(`${metric.label} is ${metric.status}, so the assistant cannot judge or publish it as a numeric report value.`);
    return {
      ok: true,
      review: {
        engineDisplayValue: metric.engineDisplayValue,
        metric: metric.metric,
        metricId: metric.id,
        rationale,
        severity: "medium",
        sources,
        valueReviewed: metric.reportDisplayValue,
        verdict: "insufficient_context"
      }
    };
  }

  const reportValue = parseDbValue(metric.reportDisplayValue);
  if (!reportValue) {
    rationale.push(`The report value "${metric.reportDisplayValue}" is not a parseable dB value.`);
    return {
      ok: true,
      review: {
        engineDisplayValue: metric.engineDisplayValue,
        metric: metric.metric,
        metricId: metric.id,
        rationale,
        severity: "medium",
        sources,
        valueReviewed: metric.reportDisplayValue,
        verdict: "insufficient_context"
      }
    };
  }

  const engineValue = parseDbValue(metric.engineDisplayValue);
  if (!engineValue) {
    rationale.push("No parseable captured engine value is available in this report context.");
    return {
      ok: true,
      review: {
        engineDisplayValue: metric.engineDisplayValue,
        metric: metric.metric,
        metricId: metric.id,
        rationale,
        severity: sources.length > 0 ? "low" : "medium",
        sources,
        valueReviewed: metric.reportDisplayValue,
        verdict: sources.length > 0 ? "plausible" : "insufficient_context"
      }
    };
  }

  const deltaDb = Number((reportValue.numericDb - engineValue.numericDb).toFixed(1));
  const absoluteDeltaDb = Math.abs(deltaDb);
  const favorable = isMoreFavorable({
    deltaDb,
    direction: metric.direction
  });
  const contextReview = reviewFromContextOnly({
    absoluteDeltaDb
  });

  rationale.push(`Report value ${metric.reportDisplayValue} differs from captured engine value ${metric.engineDisplayValue} by ${absoluteDeltaDb} dB.`);
  if (favorable === true) {
    rationale.push("The report value is more favorable than the captured engine value for this metric direction.");
  } else if (favorable === false) {
    rationale.push("The report value is less favorable than the captured engine value for this metric direction.");
  }
  if (sources.length > 0) {
    rationale.push("Attached source metadata is retained as review evidence only and is not used as calculator calibration.");
  }
  if (absoluteDeltaDb > MAX_CONTEXT_ONLY_SUGGESTED_PATCH_MOVEMENT_DB) {
    rationale.push(
      `The ${absoluteDeltaDb} dB drift is above the assistant patch limit of ${MAX_CONTEXT_ONLY_SUGGESTED_PATCH_MOVEMENT_DB} dB, so this review should be logged as a finding instead of auto-loading a restore patch.`
    );
  }

  const suggestedEngineDisplayValue = metric.engineDisplayValue;
  const shouldSuggestPatch =
    input.request.suggestPatch !== false &&
    absoluteDeltaDb > MIN_CONTEXT_ONLY_SUGGESTED_PATCH_MOVEMENT_DB &&
    absoluteDeltaDb <= MAX_CONTEXT_ONLY_SUGGESTED_PATCH_MOVEMENT_DB &&
    typeof suggestedEngineDisplayValue === "string";

  return {
    ok: true,
    review: {
      engineDisplayValue: metric.engineDisplayValue,
      metric: metric.metric,
      metricId: metric.id,
      rationale,
      severity: contextReview.severity,
      sources,
      suggestedReportPatch: shouldSuggestPatch
        ? buildRestoreEnginePatch({
            context: input.context,
            engineDisplayValue: suggestedEngineDisplayValue,
            metricId: metric.id,
            metricLabel: metric.label
          })
        : undefined,
      valueReviewed: metric.reportDisplayValue,
      verdict: contextReview.verdict
    }
  };
}

import type { ReportAssistantContext } from "./report-assistant-context";
import type { ReportAssistantCurrentCalculatorReviewPacket } from "./report-assistant-current-calculator-review-packet";
import {
  sanitizeReportAssistantResearchReviewPacket,
  type ReportAssistantResearchReviewPacket
} from "./report-assistant-conversation-storage";
import type { PlausibilitySourceSummary } from "./report-assistant-finding";
import type { ReportAssistantPatch } from "./report-assistant-patch";
import {
  appendReportAssistantTraceExplanation,
  buildReportAssistantTraceExplanationLines
} from "./report-assistant-trace-explanation";

export type ReportAssistantPlausibilityVerdict =
  | "insufficient_context"
  | "likely_wrong"
  | "plausible"
  | "suspicious";

export type ReportAssistantPlausibilitySeverity = "high" | "low" | "medium";

export type ReportAssistantPlausibilityComparability =
  | "direct"
  | "partial"
  | "same_family"
  | "not_comparable";

export type ReportAssistantPlausibilityConfidence = "high" | "low" | "medium";

export type ReportAssistantPlausibilitySourceQuality =
  | "mixed"
  | "none"
  | "strong"
  | "weak";

export type ReportAssistantPlausibilityValueRange = {
  maxDb?: number;
  minDb?: number;
  note?: string;
};

export type ReportAssistantPlausibilityValueRecommendation = {
  displayValue?: string;
  maxDb?: number;
  minDb?: number;
  note?: string;
  targetDb?: number;
};

export type ReportAssistantComparableAssembly = {
  comparisonNote?: string;
  description?: string;
  label: string;
  matchingLayers: readonly string[];
  metricValues: readonly string[];
  sourceTitle?: string;
  sourceUrl?: string;
  weakeningDifferences: readonly string[];
};

export type ReportAssistantPlausibilityRequest = {
  metricId: string;
  previousReview?: ReportAssistantResearchReviewPacket;
  research?: boolean;
  sources?: readonly PlausibilitySourceSummary[];
  suggestPatch?: boolean;
  userChallengeText?: string;
  userInstruction?: string;
};

export type ReportAssistantPlausibilityReview = {
  answerText?: string;
  comparableAssemblies: readonly ReportAssistantComparableAssembly[];
  comparability: ReportAssistantPlausibilityComparability;
  confidence: ReportAssistantPlausibilityConfidence;
  engineDisplayValue?: string;
  insufficientSourcesReason?: string;
  missingEvidence: readonly string[];
  metric: string;
  metricId: string;
  rationale: readonly string[];
  recommendedActionText?: string;
  severity: ReportAssistantPlausibilitySeverity;
  sourceQuality: ReportAssistantPlausibilitySourceQuality;
  sources: readonly PlausibilitySourceSummary[];
  suggestedReportPatch?: ReportAssistantPatch;
  valueRecommendation?: ReportAssistantPlausibilityValueRecommendation;
  valueRange?: ReportAssistantPlausibilityValueRange;
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
    previousReview: sanitizeReportAssistantResearchReviewPacket(value.previousReview),
    research: value.research === true,
    sources,
    suggestPatch: value.suggestPatch !== false,
    userChallengeText: normalizeOptionalString(value.userChallengeText),
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

function getContextOnlyConfidence(input: {
  engineDisplayValue?: string;
  sources: readonly PlausibilitySourceSummary[];
  verdict: ReportAssistantPlausibilityVerdict;
}): ReportAssistantPlausibilityConfidence {
  if (input.verdict === "insufficient_context") {
    return "low";
  }

  if (input.engineDisplayValue) {
    return input.sources.length > 0 ? "medium" : "low";
  }

  return "low";
}

function getContextOnlyComparability(input: {
  engineDisplayValue?: string;
  sources: readonly PlausibilitySourceSummary[];
  verdict: ReportAssistantPlausibilityVerdict;
}): ReportAssistantPlausibilityComparability {
  if (input.verdict === "insufficient_context") {
    return "not_comparable";
  }

  return input.sources.length > 0 ? "partial" : "not_comparable";
}

function getContextOnlySourceQuality(sources: readonly PlausibilitySourceSummary[]): ReportAssistantPlausibilitySourceQuality {
  return sources.length > 0 ? "weak" : "none";
}

function getContextOnlyMissingEvidence(input: {
  engineDisplayValue?: string;
  sources: readonly PlausibilitySourceSummary[];
}): string[] {
  const missingEvidence: string[] = [];

  if (!input.engineDisplayValue) {
    missingEvidence.push("A captured engine value for this metric in the current report context.");
  }
  if (input.sources.length === 0) {
    missingEvidence.push("Comparable external acoustic sources for the exact or closely matched layer combination.");
  }

  return missingEvidence;
}

function getContextOnlyInsufficientSourcesReason(sources: readonly PlausibilitySourceSummary[]): string | undefined {
  return sources.length === 0
    ? "No external web/source research is attached to this context-only metric review."
    : undefined;
}

function getContextOnlyEvidenceFields(input: {
  engineDisplayValue?: string;
  status?: string;
  sources: readonly PlausibilitySourceSummary[];
  verdict: ReportAssistantPlausibilityVerdict;
}): Pick<
  ReportAssistantPlausibilityReview,
  "comparableAssemblies" | "comparability" | "confidence" | "insufficientSourcesReason" | "missingEvidence" | "sourceQuality" | "valueRecommendation"
> {
  const engineValue = parseDbValue(input.engineDisplayValue);
  const canRecommendEngineValue =
    input.status !== "needs_input" &&
    input.status !== "unsupported" &&
    input.verdict !== "insufficient_context" &&
    typeof input.engineDisplayValue === "string";

  return {
    comparableAssemblies: [],
    comparability: getContextOnlyComparability(input),
    confidence: getContextOnlyConfidence(input),
    insufficientSourcesReason: getContextOnlyInsufficientSourcesReason(input.sources),
    missingEvidence: getContextOnlyMissingEvidence(input),
    sourceQuality: getContextOnlySourceQuality(input.sources),
    valueRecommendation: canRecommendEngineValue
      ? {
          displayValue: input.engineDisplayValue,
          note: "Captured engine value from the current report context; not an external source-backed recommendation.",
          targetDb: engineValue?.numericDb
        }
      : {
          note: "No source-backed numeric recommendation is available from this context-only review."
        }
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

function sourceBackedRecommendationDisplayValue(
  review: ReportAssistantPlausibilityReview
): string | undefined {
  const recommendation = review.valueRecommendation;
  if (!recommendation) {
    return undefined;
  }

  if (recommendation.displayValue?.trim()) {
    return recommendation.displayValue.trim();
  }

  if (typeof recommendation.targetDb === "number" && Number.isFinite(recommendation.targetDb)) {
    return `${recommendation.targetDb} dB`;
  }

  return undefined;
}

export function buildReportAssistantSourceBackedReportOverridePatch(input: {
  context: ReportAssistantContext;
  review: ReportAssistantPlausibilityReview;
}): ReportAssistantPatch | null {
  const metric = input.context.metrics.find((entry) => entry.id === input.review.metricId);
  const displayValue = sourceBackedRecommendationDisplayValue(input.review);
  if (
    !metric ||
    !displayValue ||
    metric.status === "needs_input" ||
    metric.status === "unsupported" ||
    input.review.sources.length === 0 ||
    input.review.sourceQuality === "none" ||
    input.review.comparability === "not_comparable" ||
    displayValue === metric.reportDisplayValue
  ) {
    return null;
  }

  const sourceCount = input.review.sources.length;
  const calculatorText = input.review.engineDisplayValue
    ? ` Calculator value remains ${input.review.engineDisplayValue}.`
    : "";

  return {
    documentSignature: input.context.documentSignature,
    operations: [
      {
        displayValue,
        metricId: metric.id,
        reason: [
          `Source-backed plausibility review suggested a report-only ${metric.label} value of ${displayValue}.`,
          `Comparability ${input.review.comparability}; source quality ${input.review.sourceQuality}; sources ${sourceCount}.`,
          calculatorText.trim()
        ].filter((entry) => entry.length > 0).join(" "),
        type: "set_metric_display_value"
      }
    ],
    requiresUserConfirmation: true,
    summary: `Propose report-only ${metric.label} value ${displayValue} from source-backed review.`
  };
}

function metricStatusFromCurrentCalculatorPacket(
  packet: ReportAssistantCurrentCalculatorReviewPacket
): ReportAssistantContext["metrics"][number]["status"] {
  return packet.metric.status === "pending" ? "needs_input" : packet.metric.status;
}

function basisCategoryFromCurrentCalculatorPacket(
  packet: ReportAssistantCurrentCalculatorReviewPacket
): ReportAssistantContext["assistantOutputFacts"][number]["basisCategory"] {
  if (packet.metric.basisCategory) {
    return packet.metric.basisCategory;
  }

  if (packet.reviewStatus === "needs_input") {
    return "needs_input";
  }

  if (packet.reviewStatus === "unsupported") {
    return "unsupported";
  }

  return "unknown";
}

function currentCalculatorPacketContextSignature(packet: ReportAssistantCurrentCalculatorReviewPacket): string {
  return packet.contextSignature ??
    packet.snapshotSignature ??
    packet.documentSignature ??
    `current-calculator-review:${packet.source}:${packet.sourceName}:${packet.metric.metricId}`;
}

function currentCalculatorPacketDisplayValue(packet: ReportAssistantCurrentCalculatorReviewPacket): string {
  return packet.metric.calculatorDisplayValue ??
    packet.metric.reportDisplayValue ??
    packet.numericReviewBlocker ??
    "Not ready";
}

function uniqueReviewStrings(values: readonly (string | undefined)[]): string[] {
  const out: string[] = [];

  for (const value of values) {
    const normalized = value?.trim().replace(/\s+/gu, " ");
    if (!normalized || out.includes(normalized)) {
      continue;
    }
    out.push(normalized);
  }

  return out;
}

export function buildReportAssistantContextFromCurrentCalculatorReviewPacket(
  packet: ReportAssistantCurrentCalculatorReviewPacket
): ReportAssistantContext {
  const status = metricStatusFromCurrentCalculatorPacket(packet);
  const displayValue = currentCalculatorPacketDisplayValue(packet);
  const signature = currentCalculatorPacketContextSignature(packet);
  const outputId = packet.metric.outputId;
  const parsedDisplayValue = parseDbValue(packet.metric.calculatorDisplayValue ?? displayValue);
  const warnings = uniqueReviewStrings([
    ...packet.warnings,
    packet.numericReviewBlocker,
    packet.numericReviewAllowed
      ? undefined
      : "Current calculator review is non-numeric until the blocked route is resolved.",
    `Calculator value authority: ${packet.metric.valueAuthority}.`
  ]);
  const missingInputs = uniqueReviewStrings([
    ...packet.missingInputs,
    packet.reviewStatus === "needs_input" ? packet.numericReviewBlocker : undefined
  ]);

  return {
    assistantContextSignature: signature,
    assistantOutputFacts: [
      {
        basis: packet.metric.basis,
        basisCategory: basisCategoryFromCurrentCalculatorPacket(packet),
        ...(packet.metric.calculatorDisplayValue ? { engineDisplayValue: packet.metric.calculatorDisplayValue } : {}),
        label: packet.metric.label,
        metricId: packet.metric.metricId,
        missingInputs,
        ...(outputId ? { outputId } : {}),
        ...(packet.numericReviewBlocker ? { parkedReason: packet.numericReviewBlocker } : {}),
        reportDisplayValue: displayValue,
        status,
        usedInputs: [
          `Calculator packet source: ${packet.source}.`,
          `Review status: ${packet.reviewStatus}.`,
          ...packet.layers.map((layer) => layer.sourceText)
        ],
        warnings
      }
    ],
    createdAtIso: packet.createdAtIso ?? "1970-01-01T00:00:00.000Z",
    documentComparisonSummaries: [],
    documentSignature: packet.documentSignature ?? signature,
    layersSummary: packet.layers.map((layer) => layer.sourceText),
    metrics: [
      {
        basis: packet.metric.basis,
        direction: packet.metric.direction,
        ...(packet.metric.calculatorDisplayValue ? { engineDisplayValue: packet.metric.calculatorDisplayValue } : {}),
        id: packet.metric.metricId,
        label: packet.metric.label,
        locations: [],
        metric: packet.metric.outputId ?? packet.metric.label,
        ...(parsedDisplayValue ? { numericDb: parsedDisplayValue.numericDb } : {}),
        ...(outputId ? { outputId } : {}),
        reportDisplayValue: displayValue,
        status
      }
    ],
    reportAdjustments: [],
    reportId: packet.sourceName,
    traceSummary: {
      ...(packet.routeBasis ? { basis: packet.routeBasis } : {}),
      missingPhysicalInputs: missingInputs,
      route: packet.route,
      unsupportedOutputs: packet.unsupportedOutputs,
      warnings
    },
    warnings
  };
}

export function reviewReportAssistantCurrentCalculatorPacketPlausibility(input: {
  packet: ReportAssistantCurrentCalculatorReviewPacket;
  request: ReportAssistantPlausibilityRequest;
}): ReportAssistantPlausibilityReviewResult {
  if (input.request.metricId !== input.packet.metric.metricId) {
    return {
      errors: [
        `Review metric id ${input.request.metricId} does not match calculator packet metric ${input.packet.metric.metricId}.`
      ],
      ok: false
    };
  }

  return reviewReportAssistantMetricPlausibility({
    context: buildReportAssistantContextFromCurrentCalculatorReviewPacket(input.packet),
    request: {
      ...input.request,
      suggestPatch: false
    }
  });
}

function buildContextOnlyAnswer(input: {
  absoluteDeltaDb?: number;
  engineDisplayValue?: string;
  metricLabel: string;
  reportDisplayValue: string;
  status?: string;
  traceLines?: readonly string[];
  verdict: ReportAssistantPlausibilityVerdict;
}): string {
  let answerText: string;

  if (input.status === "needs_input" || input.status === "unsupported") {
    answerText = `${input.metricLabel} is ${input.status}; I cannot verify or publish it as a numeric value from the current context.`;
  } else if (!input.engineDisplayValue) {
    answerText = `I could not compare ${input.metricLabel} against a captured engine value, so the current context is not enough for a numeric plausibility answer.`;
  } else if (typeof input.absoluteDeltaDb !== "number") {
    answerText = `I could not parse the report value for ${input.metricLabel}, so the current context is not enough for a numeric plausibility answer.`;
  } else {
    answerText = `I compared ${input.metricLabel}: report ${input.reportDisplayValue} against engine ${input.engineDisplayValue}. The difference is ${input.absoluteDeltaDb} dB, so the context-only verdict is ${input.verdict}.`;
  }

  return appendReportAssistantTraceExplanation({
    answerText,
    lines: input.traceLines ?? []
  });
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

  const traceExplanationLines = buildReportAssistantTraceExplanationLines({
    context: input.context,
    metric
  });
  const sources = input.request.sources ?? [];
  const rationale: string[] = [
    `Review mode: context-only${sources.length > 0 ? " with user-supplied source metadata" : "; no external web research is attached"}.`,
    `Metric ${metric.label} is ${metric.status}, basis ${metric.basis}, direction ${metric.direction}.`,
    ...traceExplanationLines
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
        answerText: buildContextOnlyAnswer({
          metricLabel: metric.label,
          reportDisplayValue: metric.reportDisplayValue,
          status: metric.status,
          traceLines: traceExplanationLines,
          verdict: "insufficient_context"
        }),
        ...getContextOnlyEvidenceFields({
          engineDisplayValue: metric.engineDisplayValue,
          status: metric.status,
          sources,
          verdict: "insufficient_context"
        }),
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
        answerText: buildContextOnlyAnswer({
          engineDisplayValue: metric.engineDisplayValue,
          metricLabel: metric.label,
          reportDisplayValue: metric.reportDisplayValue,
          traceLines: traceExplanationLines,
          verdict: "insufficient_context"
        }),
        ...getContextOnlyEvidenceFields({
          engineDisplayValue: metric.engineDisplayValue,
          status: metric.status,
          sources,
          verdict: "insufficient_context"
        }),
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
        answerText: buildContextOnlyAnswer({
          metricLabel: metric.label,
          reportDisplayValue: metric.reportDisplayValue,
          traceLines: traceExplanationLines,
          verdict: sources.length > 0 ? "plausible" : "insufficient_context"
        }),
        ...getContextOnlyEvidenceFields({
          engineDisplayValue: metric.engineDisplayValue,
          status: metric.status,
          sources,
          verdict: sources.length > 0 ? "plausible" : "insufficient_context"
        }),
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
      answerText: buildContextOnlyAnswer({
        absoluteDeltaDb,
        engineDisplayValue: metric.engineDisplayValue,
        metricLabel: metric.label,
        reportDisplayValue: metric.reportDisplayValue,
        traceLines: traceExplanationLines,
        verdict: contextReview.verdict
      }),
      ...getContextOnlyEvidenceFields({
        engineDisplayValue: metric.engineDisplayValue,
        status: metric.status,
        sources,
        verdict: contextReview.verdict
      }),
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

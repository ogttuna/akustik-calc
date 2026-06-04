import {
  normalizeReportAssistantMetricLabel,
  type ReportAssistantContext,
  type ReportAssistantMetric
} from "./report-assistant-context";
import type { PlausibilitySourceSummary } from "./report-assistant-finding";
import type { ReportAssistantPatch } from "./report-assistant-patch";
import { getReportAssistantModelSettings } from "./report-assistant-model";
import {
  type ReportAssistantPlausibilityRequest,
  type ReportAssistantComparableAssembly,
  type ReportAssistantPlausibilityReview,
  type ReportAssistantPlausibilityComparability,
  type ReportAssistantPlausibilityConfidence,
  type ReportAssistantPlausibilitySeverity,
  type ReportAssistantPlausibilitySourceQuality,
  type ReportAssistantPlausibilityValueRecommendation,
  type ReportAssistantPlausibilityValueRange,
  type ReportAssistantPlausibilityVerdict,
  reviewReportAssistantMetricPlausibility
} from "./report-assistant-plausibility";
import { buildReportAssistantTraceExplanationLines } from "./report-assistant-trace-explanation";

export type ReportAssistantPlausibilityReviewSource = "context" | "research_provider";

export type ReportAssistantPlausibilityResearchProvider =
  | "custom_research_provider"
  | "system_llm_gemini_grounded_research";

export type ReportAssistantPlausibilityResearchSettings = {
  apiKey?: string;
  endpoint: string;
  model?: string;
  provider?: ReportAssistantPlausibilityResearchProvider;
  proxyKey?: string;
  timeoutMs: number;
};

export type ReportAssistantPlausibilityReviewProposalResult =
  | {
      errors: readonly string[];
      ok: false;
      source: ReportAssistantPlausibilityReviewSource;
      warnings: readonly string[];
    }
  | {
      ok: true;
      review: ReportAssistantPlausibilityReview;
      source: ReportAssistantPlausibilityReviewSource;
      warnings: readonly string[];
    };

const DEFAULT_RESEARCH_TIMEOUT_MS = 15000;
const DEFAULT_SYSTEM_LLM_GEMINI_RESEARCH_MODEL = "gemini-3-flash-preview";
const MAX_RESEARCH_TIMEOUT_MS = 45000;
const RESEARCH_MAX_OUTPUT_TOKENS = 2048;
const MIN_RESEARCH_TIMEOUT_MS = 1000;
const TRANSIENT_RESEARCH_PROVIDER_ATTEMPTS = 2;
const PLAUSIBILITY_SEVERITIES = new Set<string>(["high", "low", "medium"]);
const PLAUSIBILITY_VERDICTS = new Set<string>(["insufficient_context", "likely_wrong", "plausible", "suspicious"]);
const PLAUSIBILITY_COMPARABILITY = new Set<string>(["direct", "not_comparable", "partial", "same_family"]);
const PLAUSIBILITY_CONFIDENCE = new Set<string>(["high", "low", "medium"]);
const PLAUSIBILITY_SOURCE_QUALITY = new Set<string>(["mixed", "none", "strong", "weak"]);

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function normalizeResearchEnumText(value: unknown): string {
  return typeof value === "string"
    ? value
        .replace(/[İIı]/gu, "i")
        .normalize("NFKD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/gu, "_")
        .replace(/^_+|_+$/gu, "")
    : "";
}

function normalizePlausibilityVerdict(value: unknown): ReportAssistantPlausibilityVerdict | null {
  const normalized = normalizeResearchEnumText(value);
  if (PLAUSIBILITY_VERDICTS.has(normalized)) {
    return normalized as ReportAssistantPlausibilityVerdict;
  }

  if (["valid", "reasonable", "likely_plausible", "correct", "dogru", "makul", "uygun"].includes(normalized)) {
    return "plausible";
  }

  if (["wrong", "incorrect", "invalid", "implausible", "not_plausible", "likely_incorrect", "yanlis"].includes(normalized)) {
    return "likely_wrong";
  }

  if (["unknown", "insufficient", "insufficient_sources", "not_enough_information", "unclear", "yetersiz"].includes(normalized)) {
    return "insufficient_context";
  }

  if (["questionable", "needs_review", "uncertain", "possible_issue", "supheli", "kontrol_gerekli"].includes(normalized)) {
    return "suspicious";
  }

  return null;
}

function normalizePlausibilitySeverity(input: {
  severity: unknown;
  verdict: ReportAssistantPlausibilityVerdict | null;
}): ReportAssistantPlausibilitySeverity | null {
  const normalized = normalizeResearchEnumText(input.severity);
  if (PLAUSIBILITY_SEVERITIES.has(normalized)) {
    return normalized as ReportAssistantPlausibilitySeverity;
  }

  if (["minor", "weak", "dusuk"].includes(normalized)) {
    return "low";
  }

  if (["moderate", "medium_confidence", "orta"].includes(normalized)) {
    return "medium";
  }

  if (["major", "critical", "severe", "yuksek"].includes(normalized)) {
    return "high";
  }

  if (input.verdict === "plausible") {
    return "low";
  }

  if (input.verdict === "likely_wrong") {
    return "high";
  }

  if (input.verdict === "suspicious" || input.verdict === "insufficient_context") {
    return "medium";
  }

  return null;
}

function normalizePlausibilityComparability(value: unknown, fallbackSources: readonly PlausibilitySourceSummary[]): ReportAssistantPlausibilityComparability {
  const normalized = normalizeResearchEnumText(value);
  if (PLAUSIBILITY_COMPARABILITY.has(normalized)) {
    return normalized as ReportAssistantPlausibilityComparability;
  }

  if (["exact", "same", "high", "strong"].includes(normalized)) {
    return "direct";
  }
  if (["same_family", "samefamily", "same_assembly_family", "family", "similar_family", "same_type"].includes(normalized)) {
    return "same_family";
  }
  if (["similar", "medium", "moderate", "likely_comparable", "weak", "limited", "indirect", "low"].includes(normalized)) {
    return "partial";
  }
  if (["none", "no_sources", "insufficient", "insufficient_sources", "not_comparable", "not_comparable_enough", "not_enough_information"].includes(normalized)) {
    return "not_comparable";
  }

  return fallbackSources.length > 0 ? "partial" : "not_comparable";
}

function normalizePlausibilityConfidence(input: {
  confidence: unknown;
  severity: ReportAssistantPlausibilitySeverity | null;
  verdict: ReportAssistantPlausibilityVerdict | null;
}): ReportAssistantPlausibilityConfidence {
  const normalized = normalizeResearchEnumText(input.confidence);
  if (PLAUSIBILITY_CONFIDENCE.has(normalized)) {
    return normalized as ReportAssistantPlausibilityConfidence;
  }

  if (["certain", "reliable", "strong"].includes(normalized)) {
    return "high";
  }
  if (["moderate", "medium_confidence"].includes(normalized)) {
    return "medium";
  }
  if (["uncertain", "limited", "weak"].includes(normalized)) {
    return "low";
  }

  if (input.verdict === "insufficient_context") {
    return "low";
  }
  if (input.severity === "high") {
    return "medium";
  }

  return "low";
}

function normalizePlausibilitySourceQuality(value: unknown, fallbackSources: readonly PlausibilitySourceSummary[]): ReportAssistantPlausibilitySourceQuality {
  const normalized = normalizeResearchEnumText(value);
  if (PLAUSIBILITY_SOURCE_QUALITY.has(normalized)) {
    return normalized as ReportAssistantPlausibilitySourceQuality;
  }

  if (["high", "good", "reliable"].includes(normalized)) {
    return "strong";
  }
  if (["medium", "moderate"].includes(normalized)) {
    return "mixed";
  }
  if (["low", "limited"].includes(normalized)) {
    return "weak";
  }

  return fallbackSources.length > 0 ? "mixed" : "none";
}

function normalizePlausibilityValueRange(value: unknown): ReportAssistantPlausibilityValueRange | undefined {
  if (!isObjectRecord(value)) {
    return undefined;
  }

  const minDb = typeof value.minDb === "number" && Number.isFinite(value.minDb) ? value.minDb : undefined;
  const maxDb = typeof value.maxDb === "number" && Number.isFinite(value.maxDb) ? value.maxDb : undefined;
  const note =
    normalizeOptionalString(value.note) ??
    normalizeOptionalString(value.rationale) ??
    normalizeOptionalString(value.comparisonNote);

  if (typeof minDb !== "number" && typeof maxDb !== "number" && !note) {
    return undefined;
  }

  return {
    maxDb,
    minDb,
    note
  };
}

function normalizePlausibilityValueRecommendation(value: unknown): ReportAssistantPlausibilityValueRecommendation | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? { displayValue: trimmed, note: trimmed } : undefined;
  }

  if (!isObjectRecord(value)) {
    return undefined;
  }

  const displayValue =
    normalizeOptionalString(value.displayValue) ??
    normalizeOptionalString(value.value) ??
    normalizeOptionalString(value.recommendedValue) ??
    normalizeOptionalString(value.targetValue);
  const targetDb =
    typeof value.targetDb === "number" && Number.isFinite(value.targetDb)
      ? value.targetDb
      : typeof value.recommendedDb === "number" && Number.isFinite(value.recommendedDb)
        ? value.recommendedDb
        : undefined;
  const minDb =
    typeof value.minDb === "number" && Number.isFinite(value.minDb)
      ? value.minDb
      : typeof value.min === "number" && Number.isFinite(value.min)
        ? value.min
        : undefined;
  const maxDb =
    typeof value.maxDb === "number" && Number.isFinite(value.maxDb)
      ? value.maxDb
      : typeof value.max === "number" && Number.isFinite(value.max)
        ? value.max
        : undefined;
  const note =
    normalizeOptionalString(value.note) ??
    normalizeOptionalString(value.rationale) ??
    normalizeOptionalString(value.reason) ??
    normalizeOptionalString(value.comparisonNote);

  return displayValue || typeof targetDb === "number" || typeof minDb === "number" || typeof maxDb === "number" || note
    ? {
        displayValue,
        maxDb,
        minDb,
        note,
        targetDb
      }
    : undefined;
}

function normalizeStringArray(value: unknown, maxItems = 8): string[] {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? [trimmed] : [];
  }

  return Array.isArray(value)
    ? value
        .filter((entry): entry is string => typeof entry === "string")
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0)
        .slice(0, maxItems)
    : [];
}

function normalizeComparableAssembly(value: unknown): ReportAssistantComparableAssembly | null {
  if (!isObjectRecord(value)) {
    return null;
  }

  const label =
    normalizeOptionalString(value.label) ??
    normalizeOptionalString(value.name) ??
    normalizeOptionalString(value.title) ??
    normalizeOptionalString(value.assembly);
  if (!label) {
    return null;
  }

  const sourceUrl = normalizeOptionalString(value.sourceUrl) ?? normalizeOptionalString(value.url) ?? normalizeOptionalString(value.uri) ?? normalizeOptionalString(value.link);
  const safeSourceUrl = sourceUrl && /^https?:\/\//iu.test(sourceUrl) ? sourceUrl : undefined;

  return {
    comparisonNote:
      normalizeOptionalString(value.comparisonNote) ??
      normalizeOptionalString(value.note) ??
      normalizeOptionalString(value.rationale),
    description: normalizeOptionalString(value.description),
    label,
    matchingLayers: normalizeStringArray(value.matchingLayers ?? value.similarLayers ?? value.layerMatches),
    metricValues: normalizeStringArray(value.metricValues ?? value.metrics ?? value.values ?? value.publishedMetricValues),
    sourceTitle: normalizeOptionalString(value.sourceTitle) ?? normalizeOptionalString(value.source),
    sourceUrl: safeSourceUrl,
    weakeningDifferences: normalizeStringArray(value.weakeningDifferences ?? value.differences ?? value.limitations ?? value.nonMatchingLayers)
  };
}

function normalizeComparableAssemblies(value: unknown): ReportAssistantComparableAssembly[] {
  return Array.isArray(value)
    ? value
        .map((entry) => normalizeComparableAssembly(entry))
        .filter((entry): entry is ReportAssistantComparableAssembly => entry !== null)
        .slice(0, 6)
    : [];
}

function normalizeSourcesFromComparableAssemblies(
  assemblies: readonly ReportAssistantComparableAssembly[]
): PlausibilitySourceSummary[] {
  return assemblies
    .map((assembly) =>
      normalizeSource({
        note: assembly.comparisonNote,
        title: assembly.sourceTitle ?? assembly.label,
        url: assembly.sourceUrl
      })
    )
    .filter((entry): entry is PlausibilitySourceSummary => entry !== null);
}

function downgradeComparabilityForEvidence(input: {
  comparableAssemblies: readonly ReportAssistantComparableAssembly[];
  comparability: ReportAssistantPlausibilityComparability;
  sources: readonly PlausibilitySourceSummary[];
}): ReportAssistantPlausibilityComparability {
  if (input.sources.length === 0) {
    return "not_comparable";
  }

  if (input.comparableAssemblies.length === 0 && input.comparability === "direct") {
    return "partial";
  }

  return input.comparability;
}

function downgradeConfidenceForEvidence(input: {
  comparableAssemblies: readonly ReportAssistantComparableAssembly[];
  confidence: ReportAssistantPlausibilityConfidence;
  sources: readonly PlausibilitySourceSummary[];
}): ReportAssistantPlausibilityConfidence {
  if (input.sources.length === 0) {
    return "low";
  }

  if (input.comparableAssemblies.length === 0 && input.confidence === "high") {
    return "medium";
  }

  return input.confidence;
}

function uniqueStrings(values: readonly (string | undefined)[], maxItems = 10): string[] {
  const out: string[] = [];

  for (const value of values) {
    const normalized = value?.trim().replace(/\s+/gu, " ");
    if (!normalized || out.includes(normalized)) {
      continue;
    }

    out.push(normalized);
    if (out.length >= maxItems) {
      break;
    }
  }

  return out;
}

function getParkedMetricReason(input: {
  context: ReportAssistantContext;
  metric: ReportAssistantMetric;
}): string {
  const outputFact = input.context.assistantOutputFacts.find((fact) => fact.metricId === input.metric.id);
  if (outputFact?.parkedReason) {
    return outputFact.parkedReason;
  }

  if (outputFact?.missingInputs.length) {
    return `Missing inputs: ${outputFact.missingInputs.join(", ")}.`;
  }

  return input.metric.status === "needs_input"
    ? "Required physical inputs are missing for this output."
    : "The selected assembly/context does not currently support this output.";
}

function sanitizeParkedMetricResearchReview(input: {
  context: ReportAssistantContext;
  metric: ReportAssistantMetric;
  review: ReportAssistantPlausibilityReview;
}): ReportAssistantPlausibilityReview {
  if (input.metric.status !== "needs_input" && input.metric.status !== "unsupported") {
    return input.review;
  }

  const reason = getParkedMetricReason(input);
  const outputFact = input.context.assistantOutputFacts.find((fact) => fact.metricId === input.metric.id);
  const missingEvidence = uniqueStrings([
    ...input.review.missingEvidence,
    ...(outputFact?.missingInputs ?? []),
    reason,
    `${input.metric.label} is ${input.metric.status}, so web/source research cannot publish or recommend a numeric value for this output.`
  ]);
  const rationale = uniqueStrings([
    ...input.review.rationale,
    `Metric ${input.metric.label} is ${input.metric.status}; provider numeric advice was ignored.`,
    reason,
    "Research sources are retained as context only and are not calculator calibration."
  ], 14);

  return {
    ...input.review,
    answerText: `${input.metric.label} is ${input.metric.status}; I cannot verify, publish, or recommend a numeric value from source research for this output. ${reason}`,
    comparableAssemblies: [],
    comparability: "not_comparable",
    confidence: "low",
    insufficientSourcesReason: reason,
    missingEvidence,
    rationale,
    recommendedActionText: `Resolve ${input.metric.label} ${input.metric.status === "needs_input" ? "missing inputs" : "support"} before asking for a numeric plausibility recommendation.`,
    severity: "medium",
    sourceQuality: input.review.sources.length > 0 ? "weak" : "none",
    suggestedReportPatch: undefined,
    valueRecommendation: {
      note: `No numeric recommendation is allowed while ${input.metric.label} is ${input.metric.status}. ${reason}`
    },
    valueRange: undefined,
    verdict: "insufficient_context"
  };
}

function normalizeTimeoutMs(value: unknown): number {
  if (typeof value !== "string" || value.trim().length === 0) {
    return DEFAULT_RESEARCH_TIMEOUT_MS;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return DEFAULT_RESEARCH_TIMEOUT_MS;
  }

  return Math.min(Math.max(Math.round(parsed), MIN_RESEARCH_TIMEOUT_MS), MAX_RESEARCH_TIMEOUT_MS);
}

function getResearchProviderRetryDelayMs(timeoutMs: number): number {
  return Math.min(1000, Math.max(25, Math.round(timeoutMs * 0.05)));
}

function isTransientResearchProviderStatus(status: number): boolean {
  return status === 408 || status === 429 || status >= 500;
}

function isTransientResearchProviderError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return true;
  }

  return error.name === "AbortError" || error.name === "TypeError";
}

async function waitForResearchProviderRetry(timeoutMs: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, getResearchProviderRetryDelayMs(timeoutMs)));
}

function normalizeSource(value: unknown): PlausibilitySourceSummary | null {
  if (!isObjectRecord(value) || typeof value.title !== "string") {
    return null;
  }

  const title = value.title.trim();
  const url = normalizeOptionalString(value.url) ?? normalizeOptionalString(value.uri) ?? normalizeOptionalString(value.link);
  if (title.length === 0 || !url || !/^https?:\/\//iu.test(url)) {
    return null;
  }

  return {
    accessedAtIso: normalizeOptionalString(value.accessedAtIso),
    note:
      normalizeOptionalString(value.note) ??
      normalizeOptionalString(value.comparisonNote) ??
      normalizeOptionalString(value.comparisonNotes),
    title,
    url
  };
}

function normalizeRationale(value: unknown): string[] {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? [trimmed] : [];
  }

  return Array.isArray(value)
    ? value
        .filter((entry): entry is string => typeof entry === "string")
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0)
        .slice(0, 12)
    : [];
}

function normalizeTextLike(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (!isObjectRecord(value)) {
    return undefined;
  }

  for (const key of ["answerText", "answer", "summary", "text", "content", "message", "response", "finalAnswer"]) {
    const nested = normalizeTextLike(value[key]);
    if (nested) {
      return nested;
    }
  }

  return undefined;
}

function normalizeSourcesFromValue(value: unknown): PlausibilitySourceSummary[] {
  return Array.isArray(value)
    ? value
        .map((entry) => normalizeSource(entry))
        .filter((entry): entry is PlausibilitySourceSummary => entry !== null)
        .slice(0, 8)
    : [];
}

function normalizeSourceFromLooseValue(value: unknown): PlausibilitySourceSummary | null {
  const directSource = normalizeSource(value);
  if (directSource) {
    return directSource;
  }

  if (!isObjectRecord(value)) {
    return null;
  }

  return normalizeSource({
    note:
      normalizeOptionalString(value.note) ??
      normalizeOptionalString(value.comparisonNote) ??
      normalizeOptionalString(value.comparisonNotes),
    title:
      normalizeOptionalString(value.sourceTitle) ??
      normalizeOptionalString(value.title) ??
      normalizeOptionalString(value.label) ??
      normalizeOptionalString(value.name) ??
      "Research source",
    url:
      normalizeOptionalString(value.sourceUrl) ??
      normalizeOptionalString(value.url) ??
      normalizeOptionalString(value.uri) ??
      normalizeOptionalString(value.link)
  });
}

function collectLooseSources(value: unknown, depth = 0): PlausibilitySourceSummary[] {
  if (depth > 5) {
    return [];
  }

  const source = normalizeSourceFromLooseValue(value);
  if (source) {
    return [source];
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => collectLooseSources(entry, depth + 1));
  }

  if (!isObjectRecord(value)) {
    return [];
  }

  return Object.values(value).flatMap((entry) => collectLooseSources(entry, depth + 1));
}

function extractHttpSourcesFromText(value: string): PlausibilitySourceSummary[] {
  const urls = Array.from(value.matchAll(/https?:\/\/[^\s),\]}"]+/giu), (match) => match[0]);

  return urls
    .map((url) => {
      try {
        const parsed = new URL(url);
        return normalizeSource({
          note: "URL extracted from a malformed source research response.",
          title: parsed.hostname,
          url
        });
      } catch {
        return null;
      }
    })
    .filter((entry): entry is PlausibilitySourceSummary => entry !== null);
}

function getMetricReferenceAliases(metric: ReportAssistantMetric): string[] {
  const aliases = [metric.id, metric.label, metric.metric, metric.outputId].filter(
    (entry): entry is string => typeof entry === "string" && entry.trim().length > 0
  );

  return [...new Set(aliases)];
}

function normalizeLooseMetricReference(value: string): string {
  return value
    .trim()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "");
}

function metricReferenceMatches(input: {
  metric: ReportAssistantMetric;
  mode: "loose" | "strict";
  value: string;
}): boolean {
  const normalizedValue =
    input.mode === "strict"
      ? normalizeReportAssistantMetricLabel(input.value)
      : normalizeLooseMetricReference(input.value);

  return getMetricReferenceAliases(input.metric).some((alias) => {
    const normalizedAlias =
      input.mode === "strict"
        ? normalizeReportAssistantMetricLabel(alias)
        : normalizeLooseMetricReference(alias);
    return normalizedAlias === normalizedValue;
  });
}

function resolveProviderMetricId(input: {
  context: ReportAssistantContext;
  metric: ReportAssistantMetric;
  value: unknown;
}): string | null {
  const rawMetricId = normalizeOptionalString(input.value);
  if (!rawMetricId) {
    return input.metric.id;
  }

  if (metricReferenceMatches({ metric: input.metric, mode: "strict", value: rawMetricId })) {
    return input.metric.id;
  }

  if (!metricReferenceMatches({ metric: input.metric, mode: "loose", value: rawMetricId })) {
    return null;
  }

  const conflictsWithAnotherMetric = input.context.metrics.some(
    (metric) =>
      metric.id !== input.metric.id &&
      (metricReferenceMatches({ metric, mode: "strict", value: rawMetricId }) ||
        metricReferenceMatches({ metric, mode: "loose", value: rawMetricId }))
  );

  return conflictsWithAnotherMetric ? null : input.metric.id;
}

function mergeSources(sources: readonly PlausibilitySourceSummary[]): PlausibilitySourceSummary[] {
  const seen = new Set<string>();
  const out: PlausibilitySourceSummary[] = [];

  for (const source of sources) {
    const key = source.url.trim();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    out.push(source);
    if (out.length >= 8) {
      break;
    }
  }

  return out;
}

function looksLikeReportAssistantPatch(value: unknown): value is ReportAssistantPatch {
  return isObjectRecord(value) && typeof value.summary === "string" && Array.isArray(value.operations);
}

function parseJsonText(value: string): unknown {
  const trimmed = value.trim();
  const withoutFence = trimmed
    .replace(/^```(?:json)?\s*/iu, "")
    .replace(/\s*```$/u, "")
    .trim();

  try {
    return JSON.parse(withoutFence) as unknown;
  } catch {
    const start = withoutFence.indexOf("{");
    const end = withoutFence.lastIndexOf("}");
    if (start === -1 || end <= start) {
      return null;
    }

    try {
      return JSON.parse(withoutFence.slice(start, end + 1)) as unknown;
    } catch {
      return null;
    }
  }
}

function getNestedText(value: unknown): string | null {
  if (!isObjectRecord(value)) {
    return null;
  }

  if (typeof value.text === "string") {
    return value.text;
  }

  const choices = Array.isArray(value.choices) ? value.choices : [];
  const firstChoice = choices.find(isObjectRecord);
  if (firstChoice && isObjectRecord(firstChoice.message) && typeof firstChoice.message.content === "string") {
    return firstChoice.message.content;
  }

  const candidates = Array.isArray(value.candidates) ? value.candidates : [];
  const firstCandidate = candidates.find(isObjectRecord);
  const parts =
    firstCandidate && isObjectRecord(firstCandidate.content) && Array.isArray(firstCandidate.content.parts)
      ? firstCandidate.content.parts
      : [];
  const firstTextPart = parts.find((part): part is { text: string } => isObjectRecord(part) && typeof part.text === "string");

  return firstTextPart?.text ?? null;
}

function getNestedReview(value: unknown): unknown {
  if (Array.isArray(value)) {
    for (const entry of value) {
      const nested = getNestedReview(entry);
      if (nested) {
        return nested;
      }
    }

    return null;
  }

  if (!isObjectRecord(value)) {
    return null;
  }

  if (typeof value.verdict === "string" || typeof value.assessment === "string") {
    return value;
  }

  for (const key of ["review", "plausibility", "plausibilityReview", "plausibilityAssessment", "result", "data", "assessment", "answer"]) {
    const nested = getNestedReview(value[key]);
    if (nested) {
      return nested;
    }
  }

  const text = getNestedText(value);
  if (!text) {
    return null;
  }

  return getNestedReview(parseJsonText(text));
}

function extractGeminiGroundingSources(value: unknown): PlausibilitySourceSummary[] {
  if (!isObjectRecord(value)) {
    return [];
  }

  const candidates = Array.isArray(value.candidates) ? value.candidates : [];
  const firstCandidate = candidates.find(isObjectRecord);
  const groundingMetadata =
    firstCandidate && isObjectRecord(firstCandidate.groundingMetadata)
      ? firstCandidate.groundingMetadata
      : null;
  const chunks =
    groundingMetadata && Array.isArray(groundingMetadata.groundingChunks)
      ? groundingMetadata.groundingChunks
      : [];

  return mergeSources(
    chunks
      .map((chunk) => {
        if (!isObjectRecord(chunk) || !isObjectRecord(chunk.web)) {
          return null;
        }

        const title = normalizeOptionalString(chunk.web.title) ?? "Grounded web source";
        const url = normalizeOptionalString(chunk.web.uri);
        if (!url) {
          return null;
        }

        return normalizeSource({
          note: "Grounded source returned by Gemini Google Search.",
          title,
          url
        });
      })
      .filter((entry): entry is PlausibilitySourceSummary => entry !== null)
  );
}

export function getReportAssistantPlausibilityResearchSettings(
  env: Record<string, string | undefined> = process.env
): ReportAssistantPlausibilityResearchSettings | null {
  const endpoint = normalizeOptionalString(env.DYNECHO_REPORT_ASSISTANT_RESEARCH_ENDPOINT);
  if (endpoint) {
    if (!/^https?:\/\//iu.test(endpoint)) {
      return null;
    }

    return {
      apiKey: normalizeOptionalString(env.DYNECHO_REPORT_ASSISTANT_RESEARCH_API_KEY),
      endpoint,
      model: normalizeOptionalString(env.DYNECHO_REPORT_ASSISTANT_RESEARCH_MODEL),
      provider: "custom_research_provider",
      timeoutMs: normalizeTimeoutMs(env.DYNECHO_REPORT_ASSISTANT_RESEARCH_TIMEOUT_MS)
    };
  }

  const modelSettings = getReportAssistantModelSettings(env);
  if (!modelSettings || modelSettings.provider !== "system_llm_gemini_proxy") {
    return null;
  }

  return {
    endpoint: modelSettings.endpoint,
    model: normalizeOptionalString(env.DYNECHO_REPORT_ASSISTANT_RESEARCH_MODEL) ?? modelSettings.model ?? DEFAULT_SYSTEM_LLM_GEMINI_RESEARCH_MODEL,
    provider: "system_llm_gemini_grounded_research",
    proxyKey: modelSettings.proxyKey,
    timeoutMs: normalizeTimeoutMs(env.DYNECHO_REPORT_ASSISTANT_RESEARCH_TIMEOUT_MS ?? env.DYNECHO_REPORT_ASSISTANT_MODEL_TIMEOUT_MS)
  };
}

export function extractReportAssistantPlausibilityReviewFromResearchResponse(input: {
  context: ReportAssistantContext;
  request: ReportAssistantPlausibilityRequest;
  response: unknown;
}): ReportAssistantPlausibilityReview | null {
  const metric = input.context.metrics.find((entry) => entry.id === input.request.metricId);
  const rawReview = getNestedReview(input.response);
  if (!metric || !isObjectRecord(rawReview)) {
    return null;
  }

  const verdict = normalizePlausibilityVerdict(rawReview.verdict ?? rawReview.assessment);
  const severity = normalizePlausibilitySeverity({
    severity: rawReview.severity,
    verdict
  });
  const metricId = resolveProviderMetricId({
    context: input.context,
    metric,
    value: rawReview.metricId
  });

  if (!verdict || !severity || metricId !== input.request.metricId) {
    return null;
  }

  const comparableAssemblies = normalizeComparableAssemblies(
    rawReview.comparableAssemblies ??
      rawReview.similarAssemblies ??
      rawReview.assemblies ??
      rawReview.comparableSystems
  );
  const sources = mergeSources([
    ...normalizeSourcesFromValue(rawReview.sources),
    ...(isObjectRecord(rawReview.research) ? normalizeSourcesFromValue(rawReview.research.sources) : [])
  ]);
  const comparableAssemblySources = normalizeSourcesFromComparableAssemblies(comparableAssemblies);
  const groundingSources = extractGeminiGroundingSources(input.response);
  const mergedSources = mergeSources([...sources, ...comparableAssemblySources, ...groundingSources]);
  const comparability = downgradeComparabilityForEvidence({
    comparableAssemblies,
    comparability: normalizePlausibilityComparability(rawReview.comparability, mergedSources),
    sources: mergedSources
  });
  const confidence = downgradeConfidenceForEvidence({
    comparableAssemblies,
    confidence: normalizePlausibilityConfidence({
      confidence: rawReview.confidence,
      severity,
      verdict
    }),
    sources: mergedSources
  });
  const sourceQuality = normalizePlausibilitySourceQuality(rawReview.sourceQuality, mergedSources);
  const valueRecommendation = normalizePlausibilityValueRecommendation(
    rawReview.valueRecommendation ??
      rawReview.recommendedValue ??
      rawReview.recommendedRange ??
      rawReview.recommendationValue
  );
  const valueRange = normalizePlausibilityValueRange(
    rawReview.valueRange ??
      rawReview.plausibleRange ??
      rawReview.expectedRange ??
      rawReview.comparableValueRange
  );
  const traceExplanationLines = buildReportAssistantTraceExplanationLines({
    context: input.context,
    metric
  });
  const rationale = [
    "Review mode: source-bounded provider response.",
    ...traceExplanationLines,
    ...normalizeRationale(
      rawReview.rationale ??
        rawReview.explanation ??
        rawReview.reasoning ??
        rawReview.reason ??
        rawReview.analysis ??
        rawReview.researchNotes ??
        rawReview.comparisonNotes ??
        rawReview.notes
    ),
    mergedSources.length > 0
      ? "Attached sources are retained as plausibility evidence only and are not calculator calibration."
      : "No acceptable http/https source metadata was returned by the research provider."
  ];
  const answerText =
    normalizeTextLike(rawReview.answerText) ??
    normalizeTextLike(rawReview.answer) ??
    normalizeTextLike(rawReview.summary) ??
    normalizeTextLike(rawReview.response) ??
    normalizeTextLike(rawReview.finalAnswer);
  const recommendedActionText = normalizeOptionalString(rawReview.recommendedActionText) ?? normalizeOptionalString(rawReview.recommendation);
  const shouldAllowSuggestedPatch = input.request.research !== true && input.request.suggestPatch !== false;

  const review: ReportAssistantPlausibilityReview = {
    answerText,
    comparableAssemblies,
    comparability,
    confidence,
    engineDisplayValue: metric.engineDisplayValue,
    insufficientSourcesReason: normalizeOptionalString(rawReview.insufficientSourcesReason),
    missingEvidence: normalizeRationale(rawReview.missingEvidence ?? rawReview.evidenceGaps),
    metric: metric.metric,
    metricId: metric.id,
    rationale,
    recommendedActionText,
    severity,
    sourceQuality,
    sources: mergedSources,
    suggestedReportPatch:
      shouldAllowSuggestedPatch && looksLikeReportAssistantPatch(rawReview.suggestedReportPatch)
        ? rawReview.suggestedReportPatch
        : undefined,
    valueRecommendation,
    valueRange,
    valueReviewed: metric.reportDisplayValue,
    verdict
  };

  return sanitizeParkedMetricResearchReview({
    context: input.context,
    metric,
    review
  });
}

function getLooseResearchResponseText(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  const nestedText = getNestedText(value);
  if (nestedText?.trim()) {
    return nestedText.trim();
  }

  return normalizeTextLike(value);
}

function extractReportAssistantFallbackReviewFromResearchResponse(input: {
  context: ReportAssistantContext;
  request: ReportAssistantPlausibilityRequest;
  response: unknown;
}): ReportAssistantPlausibilityReview | null {
  const metric = input.context.metrics.find((entry) => entry.id === input.request.metricId);
  if (!metric) {
    return null;
  }

  const looseText = getLooseResearchResponseText(input.response);
  const looseParsedText = looseText ? parseJsonText(looseText) : null;
  const looseTextAnswer =
    looseParsedText && looseParsedText !== input.response
      ? normalizeTextLike(looseParsedText) ?? looseText
      : looseText;
  const sources = mergeSources([
    ...collectLooseSources(input.response),
    ...(looseParsedText && looseParsedText !== input.response ? collectLooseSources(looseParsedText) : []),
    ...extractGeminiGroundingSources(input.response),
    ...(looseText ? extractHttpSourcesFromText(looseText) : [])
  ]);

  if (!looseTextAnswer || sources.length === 0) {
    return null;
  }

  const traceExplanationLines = buildReportAssistantTraceExplanationLines({
    context: input.context,
    metric
  });
  const review: ReportAssistantPlausibilityReview = {
    answerText: looseTextAnswer.slice(0, 1600),
    comparableAssemblies: [],
    comparability: "partial",
    confidence: "low",
    engineDisplayValue: metric.engineDisplayValue,
    insufficientSourcesReason:
      "The research provider returned source evidence but did not return the full structured plausibility contract.",
    missingEvidence: [
      "Structured verdict fields were missing from the provider response.",
      "Exact tested evidence for the full layer combination still needs manual review."
    ],
    metric: metric.metric,
    metricId: metric.id,
    rationale: [
      "Review mode: source-bounded provider response with fallback shape.",
      ...traceExplanationLines,
      "The provider did not return the complete PlausibilityReview contract after strict JSON retry; retained source URLs as weak plausibility evidence only.",
      "Attached sources are retained as plausibility evidence only and are not calculator calibration."
    ],
    recommendedActionText:
      "Treat this as source-gathering only. Ask a follow-up research question or give an explicit report edit instruction before changing the report.",
    severity: "medium",
    sourceQuality: "weak",
    sources,
    suggestedReportPatch: undefined,
    valueRecommendation: {
      note: "No numeric recommendation is published from a malformed provider response."
    },
    valueReviewed: metric.reportDisplayValue,
    verdict: "insufficient_context"
  };

  return sanitizeParkedMetricResearchReview({
    context: input.context,
    metric,
    review
  });
}

function buildResearchRequestBody(input: {
  context: ReportAssistantContext;
  request: ReportAssistantPlausibilityRequest;
  settings: ReportAssistantPlausibilityResearchSettings;
  strictJsonRetry?: boolean;
}) {
  const metric = input.context.metrics.find((entry) => entry.id === input.request.metricId);
  const previousReview =
    metric &&
    input.request.previousReview?.assistantContextSignature === input.context.assistantContextSignature &&
    input.request.previousReview.metricId === metric.id
      ? input.request.previousReview
      : undefined;
  const exactMetricIdRule = metric
    ? `Set metricId exactly to "${metric.id}". The visible metric label may be "${metric.metric}", but metricId must remain "${metric.id}".`
    : `Set metricId exactly to the requested metricId "${input.request.metricId}".`;
  const challengeRules = previousReview
    ? [
        "review.previousReview is the previous structured assistant research answer for this same metric/context.",
        "Address review.userChallengeText directly and say whether the previous verdict, value recommendation, comparability, or missing evidence should change.",
        "Reuse previousReview sources only as prior evidence; add or correct sources when web research finds better comparable assemblies."
      ]
    : [];

  return {
    context: {
      assistantOutputFacts: input.context.assistantOutputFacts,
      assistantTraceSnapshot: input.context.assistantTraceSnapshot,
      createdAtIso: input.context.createdAtIso,
      documentSignature: input.context.documentSignature,
      layersSummary: input.context.layersSummary,
      metric,
      reportId: input.context.reportId,
      traceSummary: input.context.traceSummary,
      warnings: input.context.warnings
    },
    contract: {
      output: "PlausibilityReview JSON only",
      rules: [
        exactMetricIdRule,
        "Use only these verdict values: plausible, suspicious, likely_wrong, insufficient_context.",
        "Use only these severity values: low, medium, high.",
        "Use confidence with one of: low, medium, high.",
        "Use sourceQuality with one of: none, weak, mixed, strong.",
        "Use comparability with one of: direct, same_family, partial, not_comparable.",
        "Treat older words weak, limited, insufficient, and same family as aliases, but return only the product-facing comparability values.",
        "Use valueRange when sources support a plausible dB range; include minDb, maxDb, or note.",
        "Use valueRecommendation when evidence supports a value or range recommendation; include targetDb, minDb, maxDb, displayValue, or note.",
        "Use comparableAssemblies as a list of similar assemblies with label, metricValues, matchingLayers, weakeningDifferences, sourceTitle/sourceUrl, and comparisonNote.",
        "Use missingEvidence and insufficientSourcesReason when exact layer-combination evidence is missing.",
        "Sources without comparableAssemblies must not claim direct comparability or high confidence.",
        "Use reputable acoustic sources where web/source research is available.",
        "Return source URLs, titles, and comparison notes; use http/https URLs only.",
        "Return answerText as a concise natural-language answer for the user, preferably in the same language as userInstruction.",
        ...challengeRules,
        "Use context.assistantTraceSnapshot to explain the selected engine lane, candidate, route, support/formula notes, and value pins when relevant.",
        "If external sources do not match the exact layer combination, say that clearly and keep the comparison as plausibility evidence only.",
        "Treat sources as plausibility evidence, not calculator calibration.",
        "Do not turn needs_input or unsupported outputs into numeric claims.",
        "Do not return suggestedReportPatch for research requests.",
        "Use recommendedActionText for non-mutating advice such as consider lowering Rw by 1-2 dB.",
        ...(input.strictJsonRetry
          ? [
              "Retry contract: return one top-level JSON object, not an array or prose.",
              "The object must include metricId, verdict, severity, confidence, sourceQuality, comparability, rationale, valueReviewed, answerText, recommendedActionText, valueRecommendation, comparableAssemblies, missingEvidence, and insufficientSourcesReason."
            ]
          : [])
      ]
    },
    model: input.settings.model,
    review: {
      ...input.request,
      previousReview,
      userChallengeText: previousReview ? input.request.userChallengeText : undefined
    },
    task: "dynecho.report_assistant.plausibility_research"
  };
}

export function buildSystemLlmGeminiGroundedResearchRequest(input: {
  context: ReportAssistantContext;
  request: ReportAssistantPlausibilityRequest;
  settings: ReportAssistantPlausibilityResearchSettings;
  strictJsonRetry?: boolean;
}): {
  body: {
    contents: readonly {
      parts: readonly { text: string }[];
      role: "user";
    }[];
    generationConfig: {
      maxOutputTokens: number;
      responseMimeType: "application/json";
      temperature: number;
    };
    systemInstruction: {
      parts: readonly { text: string }[];
    };
    tools: readonly { googleSearch: Record<string, never> }[];
  };
  headers: Record<string, string>;
  url: string;
} {
  const endpoint = new URL(input.settings.endpoint);
  endpoint.search = "";
  endpoint.hash = "";

  const base = endpoint.toString().replace(/\/$/u, "");
  const model = input.settings.model ?? DEFAULT_SYSTEM_LLM_GEMINI_RESEARCH_MODEL;
  const headers: Record<string, string> = {
    "content-type": "application/json"
  };

  if (input.settings.proxyKey) {
    headers.Authorization = `Bearer ${input.settings.proxyKey}`;
    headers["x-goog-api-key"] = input.settings.proxyKey;
  }

  return {
    body: {
      contents: [
        {
          parts: [
            {
              text: JSON.stringify(buildResearchRequestBody({
                ...input,
                request: {
                  ...input.request,
                  suggestPatch: false
                }
              }))
            }
          ],
          role: "user"
        }
      ],
      generationConfig: {
        maxOutputTokens: RESEARCH_MAX_OUTPUT_TOKENS,
        responseMimeType: "application/json",
        temperature: input.strictJsonRetry ? 0 : 0.1
      },
      systemInstruction: {
        parts: [
          {
            text: [
              "You are the Akustikhesap acoustic report research assistant.",
              "Use Google Search grounding when useful and return only one PlausibilityReview JSON object.",
              "Include answerText so the UI can show the user a readable research answer.",
              "Do not return suggestedReportPatch, do not apply changes, do not save or export.",
              "Give concise recommendation text in recommendedActionText when sources support it.",
              "If sources are weak, return insufficient_context or suspicious with low confidence wording.",
              input.strictJsonRetry
                ? "This is a retry after an invalid shape: return exactly one JSON object with metricId, verdict, severity, confidence, sourceQuality, comparability, rationale, sources, valueReviewed, valueRecommendation, comparableAssemblies, missingEvidence, insufficientSourcesReason, and recommendedActionText."
                : ""
            ].join(" ")
          }
        ]
      },
      tools: [{ googleSearch: {} }]
    },
    headers,
    url: `${base}/v1beta/models/${encodeURIComponent(model)}:generateContent`
  };
}

function buildResearchFetchRequest(input: {
  context: ReportAssistantContext;
  request: ReportAssistantPlausibilityRequest;
  settings: ReportAssistantPlausibilityResearchSettings;
  strictJsonRetry?: boolean;
}): {
  body: unknown;
  headers: Record<string, string>;
  url: string;
} {
  if (input.settings.provider === "system_llm_gemini_grounded_research") {
    return buildSystemLlmGeminiGroundedResearchRequest(input);
  }

  return {
    body: buildResearchRequestBody(input),
    headers: {
      ...(input.settings.apiKey ? { Authorization: `Bearer ${input.settings.apiKey}` } : {}),
      "content-type": "application/json"
    },
    url: input.settings.endpoint
  };
}

async function fetchResearchReview(input: {
  context: ReportAssistantContext;
  request: ReportAssistantPlausibilityRequest;
  settings: ReportAssistantPlausibilityResearchSettings;
}): Promise<ReportAssistantPlausibilityReviewProposalResult> {
  let invalidReviewResponseSeen = false;
  const invalidReviewResponses: unknown[] = [];

  for (const strictJsonRetry of [false, true]) {
    for (let attempt = 1; attempt <= TRANSIENT_RESEARCH_PROVIDER_ATTEMPTS; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), input.settings.timeoutMs);

      try {
        const request = buildResearchFetchRequest({
          ...input,
          strictJsonRetry
        });
        const response = await fetch(request.url, {
          body: JSON.stringify(request.body),
          headers: request.headers,
          method: "POST",
          signal: controller.signal
        });
        const bodyText = await response.text();

        if (!response.ok) {
          if (isTransientResearchProviderStatus(response.status) && attempt < TRANSIENT_RESEARCH_PROVIDER_ATTEMPTS) {
            await waitForResearchProviderRetry(input.settings.timeoutMs);
            continue;
          }

          return {
            errors: [`Plausibility research provider returned HTTP ${response.status}.`],
            ok: false,
            source: "research_provider",
            warnings: bodyText.trim().length > 0 ? [`Research provider response: ${bodyText.slice(0, 300)}`] : []
          };
        }

        const parsed = parseJsonText(bodyText);
        const review = extractReportAssistantPlausibilityReviewFromResearchResponse({
          context: input.context,
          request: input.request,
          response: parsed
        });

        if (!review) {
          invalidReviewResponseSeen = true;
          invalidReviewResponses.push(parsed ?? bodyText);
          break;
        }

        return {
          ok: true,
          review,
          source: "research_provider",
          warnings: []
        };
      } catch (error) {
        if (isTransientResearchProviderError(error) && attempt < TRANSIENT_RESEARCH_PROVIDER_ATTEMPTS) {
          await waitForResearchProviderRetry(input.settings.timeoutMs);
          continue;
        }

        return {
          errors: [error instanceof Error ? error.message : "Plausibility research provider request failed."],
          ok: false,
          source: "research_provider",
          warnings: []
        };
      } finally {
        clearTimeout(timeout);
      }
    }
  }

  for (const response of invalidReviewResponses) {
    const review = extractReportAssistantFallbackReviewFromResearchResponse({
      context: input.context,
      request: input.request,
      response
    });

    if (review) {
      return {
        ok: true,
        review,
        source: "research_provider",
        warnings: [
          "Source research provider returned source evidence without the full structured review contract; a low-confidence source fallback was used."
        ]
      };
    }
  }

  return {
    errors: [
      invalidReviewResponseSeen
        ? "Plausibility research provider did not return a valid review after a strict JSON retry."
        : "Plausibility research provider did not return a valid review for the selected metric."
    ],
    ok: false,
    source: "research_provider",
    warnings: []
  };
}

function contextOnlyResult(input: {
  context: ReportAssistantContext;
  request: ReportAssistantPlausibilityRequest;
  warnings?: readonly string[];
}): ReportAssistantPlausibilityReviewProposalResult {
  const result = reviewReportAssistantMetricPlausibility(input);
  if (!result.ok) {
    return {
      errors: result.errors,
      ok: false,
      source: "context",
      warnings: input.warnings ?? []
    };
  }

  return {
    ok: true,
    review: {
      ...result.review,
      rationale: [...result.review.rationale, ...(input.warnings ?? [])]
    },
    source: "context",
    warnings: input.warnings ?? []
  };
}

function previousResearchFallbackResult(input: {
  context: ReportAssistantContext;
  errors: readonly string[];
  request: ReportAssistantPlausibilityRequest;
}): ReportAssistantPlausibilityReviewProposalResult | null {
  const metric = input.context.metrics.find((entry) => entry.id === input.request.metricId);
  const previousReview = input.request.previousReview;
  if (
    !metric ||
    !previousReview ||
    previousReview.assistantContextSignature !== input.context.assistantContextSignature ||
    previousReview.metricId !== metric.id ||
    previousReview.sources.length === 0
  ) {
    return null;
  }

  const sources = mergeSources(previousReview.sources);
  const comparableAssemblies = previousReview.comparableAssemblies.slice(0, 4);
  const traceExplanationLines = buildReportAssistantTraceExplanationLines({
    context: input.context,
    metric
  });
  const providerErrorText = input.errors.join(" ");

  return {
    ok: true,
    review: sanitizeParkedMetricResearchReview({
      context: input.context,
      metric,
      review: {
        answerText: [
          "Fresh source retry did not complete with a valid structured review.",
          "I am keeping the previous source-backed evidence for this same report metric and context instead of silently downgrading to a context-only answer.",
          input.request.userChallengeText ? `User challenge: ${input.request.userChallengeText}` : undefined
        ].filter((line): line is string => Boolean(line)).join(" "),
        comparableAssemblies,
        comparability: normalizePlausibilityComparability(previousReview.comparability, sources),
        confidence: "low",
        engineDisplayValue: metric.engineDisplayValue,
        insufficientSourcesReason:
          "Fresh retry failed or returned an invalid structured shape; previous same-context source evidence was retained only as prior evidence.",
        missingEvidence: uniqueStrings([
          ...previousReview.missingEvidence,
          "Fresh source retry did not return a valid structured review.",
          "Do not change the report from this fallback alone."
        ]),
        metric: metric.metric,
        metricId: metric.id,
        rationale: [
          "Review mode: previous source-backed research fallback after failed challenge/retry.",
          ...traceExplanationLines,
          `Provider retry error: ${providerErrorText}`,
          "Previous sources are retained as prior plausibility evidence only and are not calculator calibration."
        ],
        recommendedActionText:
          "No report patch is recommended from this failed retry fallback. Use Retry research for a fresh source pass, or give an explicit dB edit instruction if you already accept the previous evidence.",
        severity: "medium",
        sourceQuality: normalizePlausibilitySourceQuality(previousReview.sourceQuality, sources),
        sources,
        suggestedReportPatch: undefined,
        valueRecommendation: previousReview.valueRecommendation
          ? {
              ...previousReview.valueRecommendation,
              note: previousReview.valueRecommendation.note
                ? `${previousReview.valueRecommendation.note} Prior source-backed recommendation only; fresh retry did not complete.`
                : "Prior source-backed recommendation only; fresh retry did not complete."
            }
          : {
              note: "No new numeric recommendation is published from a failed retry fallback."
            },
        valueRange: previousReview.valueRange,
        valueReviewed: metric.reportDisplayValue,
        verdict: "insufficient_context"
      }
    }),
    source: "research_provider",
    warnings: [
      `Source research retry failed; previous same-context source-backed evidence was retained instead of using context-only review. ${providerErrorText}`
    ]
  };
}

export async function createReportAssistantPlausibilityReview(input: {
  context: ReportAssistantContext;
  request: ReportAssistantPlausibilityRequest;
  settings?: ReportAssistantPlausibilityResearchSettings | null;
}): Promise<ReportAssistantPlausibilityReviewProposalResult> {
  const wantsResearch = input.request.research === true;
  const settings = input.settings === undefined ? getReportAssistantPlausibilityResearchSettings() : input.settings;
  const request = wantsResearch
    ? {
        ...input.request,
        suggestPatch: false
      }
    : input.request;

  if (!wantsResearch) {
    return contextOnlyResult({
      ...input,
      request
    });
  }

  if (!settings) {
    return contextOnlyResult({
      ...input,
      request,
      warnings: ["Source research was requested, but no DYNECHO_REPORT_ASSISTANT_RESEARCH_ENDPOINT is configured."]
    });
  }

  const researchResult = await fetchResearchReview({
    context: input.context,
    request,
    settings
  });

  if (researchResult.ok) {
    return researchResult;
  }

  const previousFallback = previousResearchFallbackResult({
    context: input.context,
    errors: researchResult.errors,
    request
  });
  if (previousFallback) {
    return previousFallback;
  }

  return contextOnlyResult({
    ...input,
    request,
    warnings: [`Source research provider unavailable; context-only review was used. ${researchResult.errors.join(" ")}`]
  });
}

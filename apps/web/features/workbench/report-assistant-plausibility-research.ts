import type { ReportAssistantContext } from "./report-assistant-context";
import type { PlausibilitySourceSummary } from "./report-assistant-finding";
import type { ReportAssistantPatch } from "./report-assistant-patch";
import {
  type ReportAssistantPlausibilityRequest,
  type ReportAssistantPlausibilityReview,
  type ReportAssistantPlausibilitySeverity,
  type ReportAssistantPlausibilityVerdict,
  reviewReportAssistantMetricPlausibility
} from "./report-assistant-plausibility";

export type ReportAssistantPlausibilityReviewSource = "context" | "research_provider";

export type ReportAssistantPlausibilityResearchSettings = {
  apiKey?: string;
  endpoint: string;
  model?: string;
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
const MAX_RESEARCH_TIMEOUT_MS = 45000;
const MIN_RESEARCH_TIMEOUT_MS = 1000;
const PLAUSIBILITY_SEVERITIES = new Set<string>(["high", "low", "medium"]);
const PLAUSIBILITY_VERDICTS = new Set<string>(["insufficient_context", "likely_wrong", "plausible", "suspicious"]);

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
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

function normalizeRationale(value: unknown): string[] {
  return Array.isArray(value)
    ? value
        .filter((entry): entry is string => typeof entry === "string")
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0)
        .slice(0, 12)
    : [];
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
  if (!isObjectRecord(value)) {
    return null;
  }

  if (typeof value.metricId === "string" && typeof value.verdict === "string") {
    return value;
  }

  for (const key of ["review", "plausibilityReview", "result", "data"]) {
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

export function getReportAssistantPlausibilityResearchSettings(
  env: Record<string, string | undefined> = process.env
): ReportAssistantPlausibilityResearchSettings | null {
  const endpoint = normalizeOptionalString(env.DYNECHO_REPORT_ASSISTANT_RESEARCH_ENDPOINT);
  if (!endpoint || !/^https?:\/\//iu.test(endpoint)) {
    return null;
  }

  return {
    apiKey: normalizeOptionalString(env.DYNECHO_REPORT_ASSISTANT_RESEARCH_API_KEY),
    endpoint,
    model: normalizeOptionalString(env.DYNECHO_REPORT_ASSISTANT_RESEARCH_MODEL),
    timeoutMs: normalizeTimeoutMs(env.DYNECHO_REPORT_ASSISTANT_RESEARCH_TIMEOUT_MS)
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

  const verdict = PLAUSIBILITY_VERDICTS.has(String(rawReview.verdict))
    ? rawReview.verdict as ReportAssistantPlausibilityVerdict
    : null;
  const severity = PLAUSIBILITY_SEVERITIES.has(String(rawReview.severity))
    ? rawReview.severity as ReportAssistantPlausibilitySeverity
    : null;
  const metricId = typeof rawReview.metricId === "string" ? rawReview.metricId : input.request.metricId;

  if (!verdict || !severity || metricId !== input.request.metricId) {
    return null;
  }

  const sources = Array.isArray(rawReview.sources)
    ? rawReview.sources
        .map((entry) => normalizeSource(entry))
        .filter((entry): entry is PlausibilitySourceSummary => entry !== null)
        .slice(0, 8)
    : [];
  const rationale = [
    "Review mode: source-bounded provider response.",
    ...normalizeRationale(rawReview.rationale),
    sources.length > 0
      ? "Attached sources are retained as plausibility evidence only and are not calculator calibration."
      : "No acceptable http/https source metadata was returned by the research provider."
  ];

  return {
    engineDisplayValue: metric.engineDisplayValue,
    metric: metric.metric,
    metricId: metric.id,
    rationale,
    severity,
    sources,
    suggestedReportPatch:
      input.request.suggestPatch !== false && looksLikeReportAssistantPatch(rawReview.suggestedReportPatch)
        ? rawReview.suggestedReportPatch
        : undefined,
    valueReviewed: metric.reportDisplayValue,
    verdict
  };
}

function buildResearchRequestBody(input: {
  context: ReportAssistantContext;
  request: ReportAssistantPlausibilityRequest;
  settings: ReportAssistantPlausibilityResearchSettings;
}) {
  const metric = input.context.metrics.find((entry) => entry.id === input.request.metricId);

  return {
    context: {
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
        "Use reputable acoustic sources where web/source research is available.",
        "Return source URLs, titles, and comparison notes; use http/https URLs only.",
        "Treat sources as plausibility evidence, not calculator calibration.",
        "Do not turn needs_input or unsupported outputs into numeric claims.",
        "Any suggestedReportPatch is only a proposal and will be validated by the app."
      ]
    },
    model: input.settings.model,
    review: input.request,
    task: "dynecho.report_assistant.plausibility_research"
  };
}

async function fetchResearchReview(input: {
  context: ReportAssistantContext;
  request: ReportAssistantPlausibilityRequest;
  settings: ReportAssistantPlausibilityResearchSettings;
}): Promise<ReportAssistantPlausibilityReviewProposalResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), input.settings.timeoutMs);

  try {
    const response = await fetch(input.settings.endpoint, {
      body: JSON.stringify(buildResearchRequestBody(input)),
      headers: {
        ...(input.settings.apiKey ? { Authorization: `Bearer ${input.settings.apiKey}` } : {}),
        "content-type": "application/json"
      },
      method: "POST",
      signal: controller.signal
    });
    const bodyText = await response.text();

    if (!response.ok) {
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
      return {
        errors: ["Plausibility research provider did not return a valid review for the selected metric."],
        ok: false,
        source: "research_provider",
        warnings: []
      };
    }

    return {
      ok: true,
      review,
      source: "research_provider",
      warnings: []
    };
  } catch (error) {
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

export async function createReportAssistantPlausibilityReview(input: {
  context: ReportAssistantContext;
  request: ReportAssistantPlausibilityRequest;
  settings?: ReportAssistantPlausibilityResearchSettings | null;
}): Promise<ReportAssistantPlausibilityReviewProposalResult> {
  const wantsResearch = input.request.research === true;
  const settings = input.settings === undefined ? getReportAssistantPlausibilityResearchSettings() : input.settings;

  if (!wantsResearch) {
    return contextOnlyResult(input);
  }

  if (!settings) {
    return contextOnlyResult({
      ...input,
      warnings: ["Source research was requested, but no DYNECHO_REPORT_ASSISTANT_RESEARCH_ENDPOINT is configured."]
    });
  }

  const researchResult = await fetchResearchReview({
    context: input.context,
    request: input.request,
    settings
  });

  if (researchResult.ok) {
    return researchResult;
  }

  return contextOnlyResult({
    ...input,
    warnings: [`Source research provider unavailable; context-only review was used. ${researchResult.errors.join(" ")}`]
  });
}

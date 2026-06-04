import type { ReportAssistantContext } from "./report-assistant-context";
import type { PlausibilitySourceSummary } from "./report-assistant-finding";
import {
  getReportAssistantPlausibilityResearchSettings,
  type ReportAssistantPlausibilityResearchSettings
} from "./report-assistant-plausibility-research";

export type ReportAssistantAssemblyAlternativeReviewSource = "context" | "research_provider";

export type ReportAssistantAssemblyAlternativeComparability =
  | "direct"
  | "insufficient"
  | "partial"
  | "weak";

export type ReportAssistantAssemblyAlternativeExpectedMetricDirection =
  | "higher_airborne_insulation"
  | "higher_impact_noise"
  | "lower_airborne_insulation"
  | "lower_impact_noise"
  | "neutral_or_unknown";

export type ReportAssistantAssemblyAlternativeSourceQuality =
  | "mixed"
  | "none"
  | "strong"
  | "weak";

export type ReportAssistantComparableAssembly = {
  comparisonNote?: string;
  description: string;
  metrics: readonly string[];
  sourceTitle?: string;
  sourceUrl?: string;
};

export type ReportAssistantAssemblyAlternativeSuggestion = {
  affectedLayers: readonly string[];
  expectedMetricDirection: ReportAssistantAssemblyAlternativeExpectedMetricDirection;
  expectedTradeoffs: readonly string[];
  label: string;
  rationale: readonly string[];
};

export type ReportAssistantAssemblyAlternativeRequest = {
  research?: boolean;
  targetLayerText?: string;
  userInstruction?: string;
};

export type ReportAssistantAssemblyAlternativeReview = {
  affectedLayers: readonly string[];
  answerText: string;
  comparableAssemblies: readonly ReportAssistantComparableAssembly[];
  comparability: ReportAssistantAssemblyAlternativeComparability;
  expectedMetricDirection: ReportAssistantAssemblyAlternativeExpectedMetricDirection;
  expectedTradeoffs: readonly string[];
  insufficientSourcesReason?: string;
  missingEvidence: readonly string[];
  rationale: readonly string[];
  recommendedActionText?: string;
  sourceQuality: ReportAssistantAssemblyAlternativeSourceQuality;
  sources: readonly PlausibilitySourceSummary[];
  suggestedAlternatives: readonly ReportAssistantAssemblyAlternativeSuggestion[];
};

export type ReportAssistantAssemblyAlternativeReviewResult =
  | {
      errors: readonly string[];
      ok: false;
      source: ReportAssistantAssemblyAlternativeReviewSource;
      warnings: readonly string[];
    }
  | {
      ok: true;
      review: ReportAssistantAssemblyAlternativeReview;
      source: ReportAssistantAssemblyAlternativeReviewSource;
      warnings: readonly string[];
    };

const ASSEMBLY_RESEARCH_MAX_OUTPUT_TOKENS = 2048;
const DEFAULT_SYSTEM_LLM_GEMINI_ASSEMBLY_RESEARCH_MODEL = "gemini-3-flash-preview";
const COMPARABILITY_VALUES = new Set<string>(["direct", "insufficient", "partial", "weak"]);
const EXPECTED_DIRECTION_VALUES = new Set<string>([
  "higher_airborne_insulation",
  "higher_impact_noise",
  "lower_airborne_insulation",
  "lower_impact_noise",
  "neutral_or_unknown"
]);
const SOURCE_QUALITY_VALUES = new Set<string>(["mixed", "none", "strong", "weak"]);

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function normalizeEnumText(value: unknown): string {
  return typeof value === "string"
    ? value
        .replace(/[Ii]/gu, "i")
        .normalize("NFKD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/gu, "_")
        .replace(/^_+|_+$/gu, "")
    : "";
}

function normalizeStringArray(value: unknown, maxItems = 10): string[] {
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

function normalizeSourcesFromValue(value: unknown): PlausibilitySourceSummary[] {
  return Array.isArray(value)
    ? value
        .map((entry) => normalizeSource(entry))
        .filter((entry): entry is PlausibilitySourceSummary => entry !== null)
        .slice(0, 8)
    : [];
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

function getNestedAssemblyReview(value: unknown): unknown {
  if (Array.isArray(value)) {
    for (const entry of value) {
      const nested = getNestedAssemblyReview(entry);
      if (nested) {
        return nested;
      }
    }

    return null;
  }

  if (!isObjectRecord(value)) {
    return null;
  }

  if (Array.isArray(value.suggestedAlternatives) || typeof value.sourceQuality === "string" || typeof value.comparability === "string") {
    return value;
  }

  for (const key of ["assemblyAlternatives", "assemblyAlternativeReview", "review", "result", "data", "answer"]) {
    const nested = getNestedAssemblyReview(value[key]);
    if (nested) {
      return nested;
    }
  }

  const text = getNestedText(value);
  if (!text) {
    return null;
  }

  return getNestedAssemblyReview(parseJsonText(text));
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

function normalizeComparability(value: unknown): ReportAssistantAssemblyAlternativeComparability {
  const normalized = normalizeEnumText(value);
  if (COMPARABILITY_VALUES.has(normalized)) {
    return normalized as ReportAssistantAssemblyAlternativeComparability;
  }

  if (["exact", "same", "high", "strong"].includes(normalized)) {
    return "direct";
  }
  if (["similar", "medium", "moderate"].includes(normalized)) {
    return "partial";
  }
  if (["low", "limited", "indirect"].includes(normalized)) {
    return "weak";
  }

  return "insufficient";
}

function normalizeExpectedMetricDirection(value: unknown): ReportAssistantAssemblyAlternativeExpectedMetricDirection {
  const normalized = normalizeEnumText(value);
  if (EXPECTED_DIRECTION_VALUES.has(normalized)) {
    return normalized as ReportAssistantAssemblyAlternativeExpectedMetricDirection;
  }

  if (["better_airborne", "higher_rw", "improve_rw", "improved_airborne", "raise_rw"].includes(normalized)) {
    return "higher_airborne_insulation";
  }
  if (["worse_airborne", "lower_rw", "reduce_rw"].includes(normalized)) {
    return "lower_airborne_insulation";
  }
  if (["better_impact", "lower_lnw", "lower_ln_w", "reduce_impact_noise", "improve_lnw"].includes(normalized)) {
    return "lower_impact_noise";
  }
  if (["worse_impact", "higher_lnw", "raise_lnw"].includes(normalized)) {
    return "higher_impact_noise";
  }

  return "neutral_or_unknown";
}

function normalizeSourceQuality(value: unknown): ReportAssistantAssemblyAlternativeSourceQuality {
  const normalized = normalizeEnumText(value);
  if (SOURCE_QUALITY_VALUES.has(normalized)) {
    return normalized as ReportAssistantAssemblyAlternativeSourceQuality;
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

  return "none";
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

function normalizeComparableAssembly(value: unknown): ReportAssistantComparableAssembly | null {
  if (!isObjectRecord(value)) {
    return null;
  }

  const description =
    normalizeOptionalString(value.description) ??
    normalizeOptionalString(value.assembly) ??
    normalizeOptionalString(value.name);
  if (!description) {
    return null;
  }

  return {
    comparisonNote:
      normalizeOptionalString(value.comparisonNote) ??
      normalizeOptionalString(value.note) ??
      normalizeOptionalString(value.comparisonNotes),
    description,
    metrics: normalizeStringArray(value.metrics ?? value.metricValues ?? value.values, 8),
    sourceTitle: normalizeOptionalString(value.sourceTitle) ?? normalizeOptionalString(value.title),
    sourceUrl: normalizeOptionalString(value.sourceUrl) ?? normalizeOptionalString(value.url) ?? normalizeOptionalString(value.link)
  };
}

function normalizeSuggestion(value: unknown): ReportAssistantAssemblyAlternativeSuggestion | null {
  if (!isObjectRecord(value)) {
    return null;
  }

  const label =
    normalizeOptionalString(value.label) ??
    normalizeOptionalString(value.name) ??
    normalizeOptionalString(value.alternative);
  if (!label) {
    return null;
  }

  return {
    affectedLayers: normalizeStringArray(value.affectedLayers ?? value.layers, 8),
    expectedMetricDirection: normalizeExpectedMetricDirection(value.expectedMetricDirection ?? value.metricDirection),
    expectedTradeoffs: normalizeStringArray(value.expectedTradeoffs ?? value.tradeoffs, 8),
    label,
    rationale: normalizeStringArray(value.rationale ?? value.reasoning ?? value.reason, 8)
  };
}

function normalizeAffectedLayers(input: {
  context: ReportAssistantContext;
  rawAffectedLayers: unknown;
  targetLayerText?: string;
}): string[] {
  const explicitLayers = normalizeStringArray(input.rawAffectedLayers, 12);
  if (explicitLayers.length > 0) {
    return explicitLayers;
  }

  const target = input.targetLayerText?.trim();
  if (target) {
    const normalizedTarget = normalizeEnumText(target);
    const matches = input.context.layersSummary.filter((layer) => normalizeEnumText(layer).includes(normalizedTarget));
    if (matches.length > 0) {
      return matches.slice(0, 8);
    }
    return [target];
  }

  return input.context.layersSummary.slice(0, 8);
}

function buildContextTraceLines(context: ReportAssistantContext): string[] {
  const lines = [`Engine route: ${context.traceSummary.route}.`];

  if (context.traceSummary.selectedCandidateId) {
    lines.push(`Selected candidate: ${context.traceSummary.selectedCandidateId}.`);
  }
  if (context.traceSummary.selectedOrigin) {
    lines.push(`Selected origin: ${context.traceSummary.selectedOrigin}.`);
  }
  if (context.traceSummary.basis) {
    lines.push(`Basis: ${context.traceSummary.basis}.`);
  }
  if (context.traceSummary.missingPhysicalInputs.length > 0) {
    lines.push(`Missing physical inputs remain: ${context.traceSummary.missingPhysicalInputs.join(", ")}.`);
  }
  if (context.traceSummary.unsupportedOutputs.length > 0) {
    lines.push(`Unsupported outputs remain: ${context.traceSummary.unsupportedOutputs.join(", ")}.`);
  }

  return lines;
}

export function parseReportAssistantAssemblyAlternativeRequest(
  value: unknown
): ReportAssistantAssemblyAlternativeRequest | null {
  if (!isObjectRecord(value)) {
    return null;
  }

  const userInstruction = normalizeOptionalString(value.userInstruction);
  const targetLayerText = normalizeOptionalString(value.targetLayerText);
  if (!userInstruction && !targetLayerText) {
    return null;
  }

  return {
    research: value.research === true,
    targetLayerText,
    userInstruction
  };
}

export function extractReportAssistantAssemblyAlternativeReviewFromResearchResponse(input: {
  context: ReportAssistantContext;
  request: ReportAssistantAssemblyAlternativeRequest;
  response: unknown;
}): ReportAssistantAssemblyAlternativeReview | null {
  const rawReview = getNestedAssemblyReview(input.response);
  if (!isObjectRecord(rawReview)) {
    return null;
  }

  const sources = mergeSources([
    ...normalizeSourcesFromValue(rawReview.sources),
    ...(isObjectRecord(rawReview.research) ? normalizeSourcesFromValue(rawReview.research.sources) : []),
    ...extractGeminiGroundingSources(input.response)
  ]);
  const suggestedAlternatives = Array.isArray(rawReview.suggestedAlternatives)
    ? rawReview.suggestedAlternatives
        .map((entry) => normalizeSuggestion(entry))
        .filter((entry): entry is ReportAssistantAssemblyAlternativeSuggestion => entry !== null)
        .slice(0, 8)
    : [];
  const comparableAssemblies = Array.isArray(rawReview.comparableAssemblies)
    ? rawReview.comparableAssemblies
        .map((entry) => normalizeComparableAssembly(entry))
        .filter((entry): entry is ReportAssistantComparableAssembly => entry !== null)
        .slice(0, 8)
    : [];
  const comparability = normalizeComparability(rawReview.comparability);
  const sourceQuality = normalizeSourceQuality(rawReview.sourceQuality);
  const affectedLayers = normalizeAffectedLayers({
    context: input.context,
    rawAffectedLayers: rawReview.affectedLayers,
    targetLayerText: input.request.targetLayerText
  });
  const rationale = [
    "Review mode: source-bounded assembly/layer alternative research.",
    ...buildContextTraceLines(input.context),
    ...normalizeStringArray(
      rawReview.rationale ??
        rawReview.reasoning ??
        rawReview.reason ??
        rawReview.analysis ??
        rawReview.comparisonNotes ??
        rawReview.notes,
      12
    ),
    sources.length > 0
      ? "Attached sources are retained as comparison evidence only and are not calculator calibration."
      : "No acceptable http/https source metadata was returned by the research provider."
  ];
  const answerText =
    normalizeTextLike(rawReview.answerText) ??
    normalizeTextLike(rawReview.answer) ??
    normalizeTextLike(rawReview.summary) ??
    (suggestedAlternatives.length > 0
      ? `I found ${suggestedAlternatives.length} non-mutating layer alternative suggestion${suggestedAlternatives.length === 1 ? "" : "s"} for the current assembly.`
      : "I could not extract a source-backed layer alternative from the provider response.");

  return {
    affectedLayers,
    answerText,
    comparableAssemblies,
    comparability,
    expectedMetricDirection: normalizeExpectedMetricDirection(rawReview.expectedMetricDirection ?? rawReview.metricDirection),
    expectedTradeoffs: normalizeStringArray(rawReview.expectedTradeoffs ?? rawReview.tradeoffs, 10),
    insufficientSourcesReason: normalizeOptionalString(rawReview.insufficientSourcesReason),
    missingEvidence: normalizeStringArray(rawReview.missingEvidence ?? rawReview.evidenceGaps, 10),
    rationale,
    recommendedActionText: normalizeOptionalString(rawReview.recommendedActionText) ?? normalizeOptionalString(rawReview.recommendation),
    sourceQuality,
    sources,
    suggestedAlternatives
  };
}

function buildAssemblyAlternativeResearchRequestBody(input: {
  context: ReportAssistantContext;
  request: ReportAssistantAssemblyAlternativeRequest;
  settings: ReportAssistantPlausibilityResearchSettings;
  strictJsonRetry?: boolean;
}) {
  return {
    context: {
      assistantTraceSnapshot: input.context.assistantTraceSnapshot,
      createdAtIso: input.context.createdAtIso,
      documentSignature: input.context.documentSignature,
      layersSummary: input.context.layersSummary,
      metrics: input.context.metrics,
      reportId: input.context.reportId,
      traceSummary: input.context.traceSummary,
      warnings: input.context.warnings
    },
    contract: {
      output: "AssemblyAlternativeReview JSON only",
      rules: [
        "Return only non-mutating advice. Do not return report patches, do not apply changes, and do not change calculator outputs.",
        "Use suggestedAlternatives for layer/material alternatives; each item must include label, affectedLayers, expectedMetricDirection, expectedTradeoffs, and rationale.",
        "Use affectedLayers for the current layer rows touched by the question.",
        "Use expectedMetricDirection with one of: higher_airborne_insulation, lower_airborne_insulation, lower_impact_noise, higher_impact_noise, neutral_or_unknown.",
        "Use sourceQuality with one of: none, weak, mixed, strong.",
        "Use comparability with one of: direct, partial, weak, insufficient.",
        "Use comparableAssemblies only for source-backed or clearly comparable build-ups.",
        "Return source URLs, titles, and comparison notes; use http/https URLs only.",
        "If sources do not match the exact layer combination, say that clearly through comparability, missingEvidence, or insufficientSourcesReason.",
        "Do not turn needs_input or unsupported outputs into numeric claims.",
        "Return answerText as a concise natural-language answer for the user, preferably in the same language as userInstruction.",
        "Use recommendedActionText for non-mutating next steps only. A separate explicit edit command is required before any report patch.",
        ...(input.strictJsonRetry
          ? [
              "Retry contract: return one top-level JSON object, not an array or prose.",
              "The object must include answerText, suggestedAlternatives, affectedLayers, expectedMetricDirection, expectedTradeoffs, sourceQuality, comparability, comparableAssemblies, missingEvidence, sources, and insufficientSourcesReason."
            ]
          : [])
      ]
    },
    model: input.settings.model,
    request: {
      ...input.request,
      research: true
    },
    task: "dynecho.report_assistant.assembly_alternative_research"
  };
}

export function buildSystemLlmGeminiGroundedAssemblyAlternativeResearchRequest(input: {
  context: ReportAssistantContext;
  request: ReportAssistantAssemblyAlternativeRequest;
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
  const model = input.settings.model ?? DEFAULT_SYSTEM_LLM_GEMINI_ASSEMBLY_RESEARCH_MODEL;
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
              text: JSON.stringify(buildAssemblyAlternativeResearchRequestBody(input))
            }
          ],
          role: "user"
        }
      ],
      generationConfig: {
        maxOutputTokens: ASSEMBLY_RESEARCH_MAX_OUTPUT_TOKENS,
        responseMimeType: "application/json",
        temperature: input.strictJsonRetry ? 0 : 0.1
      },
      systemInstruction: {
        parts: [
          {
            text: [
              "You are the Akustikhesap acoustic report assistant.",
              "Use Google Search grounding when useful and return only one AssemblyAlternativeReview JSON object.",
              "Give source-backed, non-mutating layer/material alternatives for the current assembly.",
              "Do not return report patches, do not apply changes, do not save or export.",
              "If sources are weak or not comparable, say so explicitly.",
              input.strictJsonRetry
                ? "This is a retry after an invalid shape: return exactly one JSON object with all required AssemblyAlternativeReview fields."
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

function buildAssemblyAlternativeFetchRequest(input: {
  context: ReportAssistantContext;
  request: ReportAssistantAssemblyAlternativeRequest;
  settings: ReportAssistantPlausibilityResearchSettings;
  strictJsonRetry?: boolean;
}): {
  body: unknown;
  headers: Record<string, string>;
  url: string;
} {
  if (input.settings.provider === "system_llm_gemini_grounded_research") {
    return buildSystemLlmGeminiGroundedAssemblyAlternativeResearchRequest(input);
  }

  return {
    body: buildAssemblyAlternativeResearchRequestBody(input),
    headers: {
      ...(input.settings.apiKey ? { Authorization: `Bearer ${input.settings.apiKey}` } : {}),
      "content-type": "application/json"
    },
    url: input.settings.endpoint
  };
}

async function fetchAssemblyAlternativeReview(input: {
  context: ReportAssistantContext;
  request: ReportAssistantAssemblyAlternativeRequest;
  settings: ReportAssistantPlausibilityResearchSettings;
}): Promise<ReportAssistantAssemblyAlternativeReviewResult> {
  let invalidReviewResponseSeen = false;

  for (const strictJsonRetry of [false, true]) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), input.settings.timeoutMs);

    try {
      const request = buildAssemblyAlternativeFetchRequest({
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
        return {
          errors: [`Assembly alternative research provider returned HTTP ${response.status}.`],
          ok: false,
          source: "research_provider",
          warnings: bodyText.trim().length > 0 ? [`Research provider response: ${bodyText.slice(0, 300)}`] : []
        };
      }

      const parsed = parseJsonText(bodyText);
      const review = extractReportAssistantAssemblyAlternativeReviewFromResearchResponse({
        context: input.context,
        request: input.request,
        response: parsed
      });

      if (!review) {
        invalidReviewResponseSeen = true;
        continue;
      }

      return {
        ok: true,
        review,
        source: "research_provider",
        warnings: []
      };
    } catch (error) {
      return {
        errors: [error instanceof Error ? error.message : "Assembly alternative research provider request failed."],
        ok: false,
        source: "research_provider",
        warnings: []
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  return {
    errors: [
      invalidReviewResponseSeen
        ? "Assembly alternative research provider did not return a valid review after a strict JSON retry."
        : "Assembly alternative research provider did not return a valid review."
    ],
    ok: false,
    source: "research_provider",
    warnings: []
  };
}

function contextOnlyAssemblyAlternativeReview(input: {
  context: ReportAssistantContext;
  request: ReportAssistantAssemblyAlternativeRequest;
  warnings?: readonly string[];
}): ReportAssistantAssemblyAlternativeReviewResult {
  const affectedLayers = normalizeAffectedLayers({
    context: input.context,
    rawAffectedLayers: null,
    targetLayerText: input.request.targetLayerText
  });
  const layerText = affectedLayers.length > 0 ? affectedLayers.join("; ") : "No layer rows are available in the current report context.";
  const warnings = input.warnings ?? [];
  const insufficientSourcesReason =
    warnings.length > 0
      ? warnings.join(" ")
      : "No external source research was requested or configured for this assembly/layer alternative answer.";

  return {
    ok: true,
    review: {
      affectedLayers,
      answerText: `I can inspect the current layer context (${layerText}), but I cannot name a source-backed replacement from context alone. No report value was changed.`,
      comparableAssemblies: [],
      comparability: "insufficient",
      expectedMetricDirection: "neutral_or_unknown",
      expectedTradeoffs: [],
      insufficientSourcesReason,
      missingEvidence: [
        "Exact comparable assembly evidence with matching layer order, material properties, thicknesses, and requested acoustic metric.",
        "Source-backed metric direction for the proposed replacement layer."
      ],
      rationale: [
        "Review mode: context-only assembly/layer alternative review.",
        ...buildContextTraceLines(input.context),
        "Context-only mode does not invent alternative materials or calibrate report values."
      ],
      sourceQuality: "none",
      sources: [],
      suggestedAlternatives: []
    },
    source: "context",
    warnings
  };
}

export async function createReportAssistantAssemblyAlternativeReview(input: {
  context: ReportAssistantContext;
  request: ReportAssistantAssemblyAlternativeRequest;
  settings?: ReportAssistantPlausibilityResearchSettings | null;
}): Promise<ReportAssistantAssemblyAlternativeReviewResult> {
  const wantsResearch = input.request.research === true;
  const settings = input.settings === undefined ? getReportAssistantPlausibilityResearchSettings() : input.settings;

  if (!wantsResearch) {
    return contextOnlyAssemblyAlternativeReview(input);
  }

  if (!settings) {
    return contextOnlyAssemblyAlternativeReview({
      ...input,
      warnings: ["Source research was requested, but no DYNECHO_REPORT_ASSISTANT_RESEARCH_ENDPOINT is configured."]
    });
  }

  const researchResult = await fetchAssemblyAlternativeReview({
    context: input.context,
    request: {
      ...input.request,
      research: true
    },
    settings
  });

  if (researchResult.ok) {
    return researchResult;
  }

  return contextOnlyAssemblyAlternativeReview({
    ...input,
    warnings: [`Source research provider unavailable; context-only assembly alternative review was used. ${researchResult.errors.join(" ")}`]
  });
}

import { createReportAssistantPatchFromInstruction } from "./report-assistant-instruction";
import type { ReportAssistantContext } from "./report-assistant-context";
import type { ReportAssistantPatch } from "./report-assistant-patch";

export type ReportAssistantPatchProposalSource = "deterministic" | "model";

export type ReportAssistantModelProvider = "custom_patch_provider" | "system_llm_gemini_proxy";

export type ReportAssistantModelSettings = {
  apiKey?: string;
  endpoint: string;
  model?: string;
  provider: ReportAssistantModelProvider;
  proxyKey?: string;
  timeoutMs: number;
};

export type ReportAssistantPatchProposalResult =
  | {
      errors: readonly string[];
      ok: false;
      source: ReportAssistantPatchProposalSource;
      warnings: readonly string[];
    }
  | {
      ok: true;
      patch: ReportAssistantPatch;
      source: ReportAssistantPatchProposalSource;
      warnings: readonly string[];
    };

const DEFAULT_MODEL_TIMEOUT_MS = 12000;
const DEFAULT_SYSTEM_LLM_GEMINI_MODEL = "gemini-3-flash-preview";
const MAX_MODEL_TIMEOUT_MS = 30000;
const MODEL_MAX_OUTPUT_TOKENS = 2048;
const MIN_MODEL_TIMEOUT_MS = 1000;
const MODEL_PROVIDER_VALUES = new Set<string>(["custom_patch_provider", "system_llm_gemini_proxy"]);

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function normalizeTimeoutMs(value: unknown): number {
  if (typeof value !== "string" || value.trim().length === 0) {
    return DEFAULT_MODEL_TIMEOUT_MS;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return DEFAULT_MODEL_TIMEOUT_MS;
  }

  return Math.min(Math.max(Math.round(parsed), MIN_MODEL_TIMEOUT_MS), MAX_MODEL_TIMEOUT_MS);
}

function normalizeModelProvider(value: unknown): ReportAssistantModelProvider | null {
  if (value === undefined || value === null || String(value).trim().length === 0) {
    return "custom_patch_provider";
  }

  const normalized = String(value).trim();
  return MODEL_PROVIDER_VALUES.has(normalized) ? normalized as ReportAssistantModelProvider : null;
}

export function getReportAssistantModelSettings(
  env: Record<string, string | undefined> = process.env
): ReportAssistantModelSettings | null {
  const provider = normalizeModelProvider(env.DYNECHO_REPORT_ASSISTANT_MODEL_PROVIDER);
  if (!provider) {
    return null;
  }

  const endpoint = normalizeOptionalString(env.DYNECHO_REPORT_ASSISTANT_MODEL_ENDPOINT);
  if (!endpoint || !/^https?:\/\//iu.test(endpoint)) {
    return null;
  }

  const model = normalizeOptionalString(env.DYNECHO_REPORT_ASSISTANT_MODEL);
  return {
    endpoint,
    ...(provider === "custom_patch_provider"
      ? { apiKey: normalizeOptionalString(env.DYNECHO_REPORT_ASSISTANT_MODEL_API_KEY), model }
      : {
          model: model ?? DEFAULT_SYSTEM_LLM_GEMINI_MODEL,
          proxyKey: normalizeOptionalString(env.DYNECHO_REPORT_ASSISTANT_MODEL_PROXY_KEY)
        }),
    provider,
    timeoutMs: normalizeTimeoutMs(env.DYNECHO_REPORT_ASSISTANT_MODEL_TIMEOUT_MS)
  };
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

export function extractReportAssistantPatchFromModelResponse(value: unknown): ReportAssistantPatch | null {
  if (looksLikeReportAssistantPatch(value)) {
    return value;
  }

  if (isObjectRecord(value)) {
    for (const key of ["patch", "reportAssistantPatch", "result", "data"]) {
      const nested = extractReportAssistantPatchFromModelResponse(value[key]);
      if (nested) {
        return nested;
      }
    }
  }

  const text = typeof value === "string" ? value : getNestedText(value);
  if (!text) {
    return null;
  }

  const parsed = parseJsonText(text);
  if (parsed === value) {
    return null;
  }

  return extractReportAssistantPatchFromModelResponse(parsed);
}

function buildModelRequestBody(input: {
  context: ReportAssistantContext;
  instruction: string;
  settings: ReportAssistantModelSettings;
}) {
  return {
    context: {
      assistantTraceSnapshot: input.context.assistantTraceSnapshot,
      createdAtIso: input.context.createdAtIso,
      documentComparisonSummaries: input.context.documentComparisonSummaries,
      documentSignature: input.context.documentSignature,
      layersSummary: input.context.layersSummary,
      metrics: input.context.metrics.map((metric) => ({
        basis: metric.basis,
        direction: metric.direction,
        engineDisplayValue: metric.engineDisplayValue,
        id: metric.id,
        label: metric.label,
        reportDisplayValue: metric.reportDisplayValue,
        status: metric.status
      })),
      presetLibrarySummary: input.context.presetLibrarySummary,
      projectId: input.context.projectId,
      projectWorkspace: input.context.projectWorkspace,
      reportAdjustments: input.context.reportAdjustments,
      reportId: input.context.reportId,
      scenarioId: input.context.scenarioId,
      traceSummary: input.context.traceSummary,
      warnings: input.context.warnings
    },
    contract: {
      output: "ReportAssistantPatch JSON only",
      rules: [
        "Return operations only; do not apply, export, save, reset, or write files.",
        "Use only metric ids present in context.metrics.",
        "Do not turn needs_input or unsupported outputs into numeric values.",
        "For adjust_metric_db, the numeric movement field must be named deltaDb; never use value, amount, or db.",
        "Numeric movement above 10 dB will be rejected by the app validator.",
        "Project workspace and revision data are read-only context; do not claim that you saved, restored, or updated a project.",
        "Listed project read tools are a read-only manifest for the host app; this patch route is not a tool-calling loop.",
        "The app validator and user confirmation layer own all mutations."
      ],
      schema: {
        documentSignature: input.context.documentSignature,
        operations: [
          {
            deltaDb: -2,
            metricId: "output:Rw",
            reason: "User requested a report-only 2 dB reduction.",
            type: "adjust_metric_db"
          },
          {
            displayValue: "55 dB",
            metricId: "output:Rw",
            reason: "User requested an explicit report display value.",
            type: "set_metric_display_value"
          },
          {
            reason: "User requested a bounded explanatory note.",
            section: "assumptions",
            text: "Short report-only note.",
            type: "append_report_note"
          }
        ],
        summary: "short string"
      }
    },
    instruction: input.instruction,
    model: input.settings.model,
    task: "dynecho.report_assistant.patch_proposal"
  };
}

export function buildSystemLlmGeminiProxyRequest(input: {
  context: ReportAssistantContext;
  instruction: string;
  settings: ReportAssistantModelSettings;
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
  };
  headers: Record<string, string>;
  url: string;
} {
  const endpoint = new URL(input.settings.endpoint);
  endpoint.search = "";
  endpoint.hash = "";

  const base = endpoint.toString().replace(/\/$/u, "");
  const model = input.settings.model ?? DEFAULT_SYSTEM_LLM_GEMINI_MODEL;
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
              text: JSON.stringify(buildModelRequestBody(input))
            }
          ],
          role: "user"
        }
      ],
      generationConfig: {
        maxOutputTokens: MODEL_MAX_OUTPUT_TOKENS,
        responseMimeType: "application/json",
        temperature: 0
      },
      systemInstruction: {
        parts: [
          {
            text: [
              "You are the Akustikhesap report assistant.",
              "Return only one ReportAssistantPatch JSON object.",
              "Allowed operation types are adjust_metric_db, set_metric_display_value, and append_report_note.",
              "For adjust_metric_db use the exact key deltaDb for numeric dB movement.",
              "Do not apply, export, save, reset, write files, call tools, or rewrite the full report.",
              "The Akustikhesap app validates and applies any accepted patch."
            ].join(" ")
          }
        ]
      }
    },
    headers,
    url: `${base}/v1beta/models/${encodeURIComponent(model)}:generateContent`
  };
}

function buildModelFetchRequest(input: {
  context: ReportAssistantContext;
  instruction: string;
  settings: ReportAssistantModelSettings;
}): {
  body: unknown;
  headers: Record<string, string>;
  url: string;
} {
  if (input.settings.provider === "system_llm_gemini_proxy") {
    return buildSystemLlmGeminiProxyRequest(input);
  }

  return {
    body: buildModelRequestBody(input),
    headers: {
      ...(input.settings.apiKey ? { Authorization: `Bearer ${input.settings.apiKey}` } : {}),
      "content-type": "application/json"
    },
    url: input.settings.endpoint
  };
}

async function fetchModelPatch(input: {
  context: ReportAssistantContext;
  instruction: string;
  settings: ReportAssistantModelSettings;
}): Promise<ReportAssistantPatchProposalResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), input.settings.timeoutMs);

  try {
    const request = buildModelFetchRequest(input);
    const response = await fetch(request.url, {
      body: JSON.stringify(request.body),
      headers: request.headers,
      method: "POST",
      signal: controller.signal
    });

    const bodyText = await response.text();
    if (!response.ok) {
      return {
        errors: [`Model patch provider returned HTTP ${response.status}.`],
        ok: false,
        source: "model",
        warnings: bodyText.trim().length > 0 ? [`Model provider response: ${bodyText.slice(0, 300)}`] : []
      };
    }

    const parsed = parseJsonText(bodyText);
    const patch = extractReportAssistantPatchFromModelResponse(parsed);
    if (!patch) {
      return {
        errors: ["Model patch provider did not return a parseable ReportAssistantPatch."],
        ok: false,
        source: "model",
        warnings: []
      };
    }

    return {
      ok: true,
      patch,
      source: "model",
      warnings: []
    };
  } catch (error) {
    return {
      errors: [error instanceof Error ? error.message : "Model patch provider request failed."],
      ok: false,
      source: "model",
      warnings: []
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function createReportAssistantPatchProposal(input: {
  context: ReportAssistantContext;
  instruction: string;
  settings?: ReportAssistantModelSettings | null;
}): Promise<ReportAssistantPatchProposalResult> {
  const settings = input.settings === undefined ? getReportAssistantModelSettings() : input.settings;

  if (settings) {
    const modelResult = await fetchModelPatch({
      context: input.context,
      instruction: input.instruction,
      settings
    });

    if (modelResult.ok) {
      return modelResult;
    }

    const deterministic = createReportAssistantPatchFromInstruction(input);
    if (deterministic.ok) {
      return {
        ok: true,
        patch: deterministic.patch,
        source: "deterministic",
        warnings: [`Model patch provider unavailable; deterministic parser was used. ${modelResult.errors.join(" ")}`, ...deterministic.warnings]
      };
    }

    return {
      errors: [...modelResult.errors, ...deterministic.errors],
      ok: false,
      source: "model",
      warnings: [...modelResult.warnings, ...deterministic.warnings]
    };
  }

  const deterministic = createReportAssistantPatchFromInstruction(input);
  return deterministic.ok
    ? {
        ok: true,
        patch: deterministic.patch,
        source: "deterministic",
        warnings: deterministic.warnings
      }
    : {
        errors: deterministic.errors,
        ok: false,
        source: "deterministic",
        warnings: deterministic.warnings
      };
}

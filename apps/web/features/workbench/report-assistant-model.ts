import { createReportAssistantPatchFromInstruction } from "./report-assistant-instruction";
import type { ReportAssistantContext } from "./report-assistant-context";
import type { ReportAssistantPatch } from "./report-assistant-patch";

export type ReportAssistantPatchProposalSource = "deterministic" | "model";

export type ReportAssistantModelSettings = {
  apiKey?: string;
  endpoint: string;
  model?: string;
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
const MAX_MODEL_TIMEOUT_MS = 30000;
const MIN_MODEL_TIMEOUT_MS = 1000;

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

export function getReportAssistantModelSettings(
  env: Record<string, string | undefined> = process.env
): ReportAssistantModelSettings | null {
  const endpoint = normalizeOptionalString(env.DYNECHO_REPORT_ASSISTANT_MODEL_ENDPOINT);
  if (!endpoint || !/^https?:\/\//iu.test(endpoint)) {
    return null;
  }

  return {
    apiKey: normalizeOptionalString(env.DYNECHO_REPORT_ASSISTANT_MODEL_API_KEY),
    endpoint,
    model: normalizeOptionalString(env.DYNECHO_REPORT_ASSISTANT_MODEL),
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
      createdAtIso: input.context.createdAtIso,
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
      reportId: input.context.reportId,
      traceSummary: input.context.traceSummary,
      warnings: input.context.warnings
    },
    contract: {
      output: "ReportAssistantPatch JSON only",
      rules: [
        "Return operations only; do not apply, export, save, reset, or write files.",
        "Use only metric ids present in context.metrics.",
        "Do not turn needs_input or unsupported outputs into numeric values.",
        "Numeric movement above 10 dB will be rejected by the app validator.",
        "The app validator and user confirmation layer own all mutations."
      ],
      schema: {
        documentSignature: input.context.documentSignature,
        operations: "array of adjust_metric_db, set_metric_display_value, or append_report_note operations",
        summary: "short string"
      }
    },
    instruction: input.instruction,
    model: input.settings.model,
    task: "dynecho.report_assistant.patch_proposal"
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
    const response = await fetch(input.settings.endpoint, {
      body: JSON.stringify(buildModelRequestBody(input)),
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

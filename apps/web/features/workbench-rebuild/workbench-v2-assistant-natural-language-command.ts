import type {
  MaterialDefinition,
  RequestedOutputId
} from "@dynecho/shared";

import {
  getReportAssistantModelSettings,
  type ReportAssistantModelSettings
} from "../workbench/report-assistant-model";
import type {
  WorkbenchV2DraftLayer,
  WorkbenchV2StudyMode
} from "./workbench-v2-project-snapshot";

export type WorkbenchV2AssistantNaturalLanguageCommandConfidence = "high" | "low" | "medium";

export type WorkbenchV2AssistantNaturalLanguageCommandDecision =
  | {
      confidence: WorkbenchV2AssistantNaturalLanguageCommandConfidence;
      explanation: string;
      normalizedCommand: string;
      ok: true;
      status: "apply";
      warnings: readonly string[];
    }
  | {
      confidence: WorkbenchV2AssistantNaturalLanguageCommandConfidence;
      explanation: string;
      message: string;
      ok: true;
      status: "clarify" | "reject";
      warnings: readonly string[];
    };

export type WorkbenchV2AssistantNaturalLanguageCommandResult =
  | {
      decision: WorkbenchV2AssistantNaturalLanguageCommandDecision;
      ok: true;
      source: "model";
    }
  | {
      code: string;
      errors: readonly string[];
      ok: false;
      source: "model" | "settings";
      statusCode: number;
      warnings: readonly string[];
    };

const MODEL_MAX_OUTPUT_TOKENS = 1024;

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

function normalizeConfidence(value: unknown): WorkbenchV2AssistantNaturalLanguageCommandConfidence {
  return value === "high" || value === "low" || value === "medium" ? value : "medium";
}

function normalizeWarnings(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0).map((entry) => entry.trim())
    : [];
}

function extractDecisionObject(value: unknown): WorkbenchV2AssistantNaturalLanguageCommandDecision | null {
  if (!isObjectRecord(value)) {
    return null;
  }

  for (const key of ["decision", "calculatorCommandDecision", "result", "data"]) {
    const nested = extractDecisionObject(value[key]);
    if (nested) {
      return nested;
    }
  }

  const status = typeof value.status === "string" ? value.status : null;
  if (status !== "apply" && status !== "clarify" && status !== "reject") {
    return null;
  }

  const confidence = normalizeConfidence(value.confidence);
  const explanation = typeof value.explanation === "string" && value.explanation.trim()
    ? value.explanation.trim()
    : "Assistant interpreted the natural-language calculator request.";
  const warnings = normalizeWarnings(value.warnings);

  if (status === "apply") {
    const normalizedCommand = typeof value.normalizedCommand === "string" ? value.normalizedCommand.trim() : "";
    if (!normalizedCommand) {
      return null;
    }

    return {
      confidence,
      explanation,
      normalizedCommand,
      ok: true,
      status,
      warnings
    };
  }

  const message = typeof value.message === "string" && value.message.trim()
    ? value.message.trim()
    : status === "clarify"
      ? "I need one more physical input before changing the calculator draft."
      : "That calculator change is not physically meaningful for the current draft.";

  return {
    confidence,
    explanation,
    message,
    ok: true,
    status,
    warnings
  };
}

export function extractWorkbenchV2AssistantNaturalLanguageCommandDecision(
  value: unknown
): WorkbenchV2AssistantNaturalLanguageCommandDecision | null {
  const direct = extractDecisionObject(value);
  if (direct) {
    return direct;
  }

  const text = typeof value === "string" ? value : getNestedText(value);
  if (!text) {
    return null;
  }

  const parsed = parseJsonText(text);
  if (parsed === value) {
    return null;
  }

  return extractDecisionObject(parsed);
}

function buildCommandIntentRequestBody(input: {
  currentLayers: readonly WorkbenchV2DraftLayer[];
  currentMode: WorkbenchV2StudyMode;
  currentSelectedOutputs: readonly RequestedOutputId[];
  instruction: string;
  materials: readonly MaterialDefinition[];
}) {
  const materialNamesById = new Map(input.materials.map((material) => [material.id, material.name]));

  return {
    calculatorContext: {
      currentMode: input.currentMode,
      currentSelectedOutputs: input.currentSelectedOutputs,
      visibleLayers: input.currentLayers.map((layer, index) => ({
        index: index + 1,
        materialId: layer.materialId,
        materialName: materialNamesById.get(layer.materialId) ?? layer.materialId,
        role: layer.role,
        thicknessMm: layer.thicknessMm
      }))
    },
    catalog: input.materials.slice(0, 120).map((material) => ({
      category: material.category,
      id: material.id,
      name: material.name,
      tags: material.tags
    })),
    contract: {
      output: "CalculatorCommandDecision JSON only",
      schema: {
        apply: {
          confidence: "high | medium | low",
          explanation: "short reason",
          normalizedCommand: "one safe command that the calculator parser can validate",
          status: "apply",
          warnings: ["optional caveat"]
        },
        clarify: {
          confidence: "high | medium | low",
          explanation: "why more input is needed",
          message: "short user-facing clarification question",
          status: "clarify",
          warnings: []
        },
        reject: {
          confidence: "high | medium | low",
          explanation: "why this is physically invalid or outside this calculator draft editor",
          message: "short user-facing refusal",
          status: "reject",
          warnings: []
        }
      },
      safeNormalizedCommandExamples: [
        "12.5 mm gypsum + 50 mm rock wool + 12.5 mm gypsum diz",
        "gypsum board araya rock wool sonra aynı gypsumdan seç inputları makul doldur",
        "ekrandaki layerların kalınlıklarını mantıklı şekilde gir",
        "hepsinin kalınlığını 10 mm artır",
        "rock wool'u ortaya taşı",
        "kombinasyon yap",
        "Rw ve STC seç",
        "hesapla"
      ]
    },
    instruction: input.instruction,
    task: "dynecho.workbench_v2.calculator_command_intent"
  };
}

export function buildWorkbenchV2AssistantNaturalLanguageCommandModelRequest(input: {
  currentLayers: readonly WorkbenchV2DraftLayer[];
  currentMode: WorkbenchV2StudyMode;
  currentSelectedOutputs: readonly RequestedOutputId[];
  instruction: string;
  materials: readonly MaterialDefinition[];
  settings: ReportAssistantModelSettings;
}): {
  body: unknown;
  headers: Record<string, string>;
  url: string;
} {
  const requestBody = buildCommandIntentRequestBody(input);

  if (input.settings.provider !== "system_llm_gemini_proxy") {
    return {
      body: requestBody,
      headers: {
        ...(input.settings.apiKey ? { Authorization: `Bearer ${input.settings.apiKey}` } : {}),
        "content-type": "application/json"
      },
      url: input.settings.endpoint
    };
  }

  const endpoint = new URL(input.settings.endpoint);
  endpoint.search = "";
  endpoint.hash = "";

  const base = endpoint.toString().replace(/\/$/u, "");
  const model = input.settings.model ?? "gemini-3-flash-preview";
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
              text: JSON.stringify(requestBody)
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
              "You are the Akustikhesap calculator draft assistant.",
              "Interpret messy Turkish or English user text into one safe calculator draft command.",
              "Return only CalculatorCommandDecision JSON.",
              "Do not calculate or invent Rw, STC, DnT, Ln, IIC, AIIC, or any dB value.",
              "Do not claim web research was done.",
              "If the user asks for source/web/Rw verification, reject or clarify that this is research/report-review work, not a draft mutation.",
              "If the user asks whether a calculator value is too high/low, asks for internet/source-backed review, or asks whether a report value should be overridden after confirmation, reject or clarify instead of returning an apply command.",
              "If the requested change is physically meaningless, destructive, or underspecified, explain that briefly instead of forcing a command.",
              "Use only material ids/names visible in the supplied catalog, but tolerate typos, family words, and mixed Turkish/English wording.",
              "Do not reject clear material-family wording just because it is not an exact catalog label: gypsum/gypsium/plasterboard means the general gypsum board catalog item, and rock wool/rockwool/mineral wool means the general rockwool catalog item when those items exist.",
              "When the user says 'hangisi farketmez', 'en uygunu', or asks to fill reasonable inputs, choose the general safe catalog item and write a normalized command that asks the host app to fill reasonable draft inputs.",
              "The host app will validate the normalizedCommand before applying anything."
            ].join(" ")
          }
        ]
      }
    },
    headers,
    url: `${base}/v1beta/models/${encodeURIComponent(model)}:generateContent`
  };
}

export async function createWorkbenchV2AssistantNaturalLanguageCommandDecision(input: {
  currentLayers: readonly WorkbenchV2DraftLayer[];
  currentMode: WorkbenchV2StudyMode;
  currentSelectedOutputs: readonly RequestedOutputId[];
  instruction: string;
  materials: readonly MaterialDefinition[];
  settings?: ReportAssistantModelSettings | null;
}): Promise<WorkbenchV2AssistantNaturalLanguageCommandResult> {
  const settings = input.settings === undefined ? getReportAssistantModelSettings() : input.settings;
  if (!settings) {
    return {
      code: "calculator_command_model_unavailable",
      errors: ["Natural-language calculator command interpretation is not configured."],
      ok: false,
      source: "settings",
      statusCode: 503,
      warnings: []
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), settings.timeoutMs);

  try {
    const request = buildWorkbenchV2AssistantNaturalLanguageCommandModelRequest({
      ...input,
      settings
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
        code: "calculator_command_model_failed",
        errors: [`Natural-language calculator command model returned HTTP ${response.status}.`],
        ok: false,
        source: "model",
        statusCode: 502,
        warnings: bodyText.trim().length > 0 ? [`Model response: ${bodyText.slice(0, 300)}`] : []
      };
    }

    const parsed = parseJsonText(bodyText);
    const decision = extractWorkbenchV2AssistantNaturalLanguageCommandDecision(parsed);
    if (!decision) {
      return {
        code: "calculator_command_model_unparseable",
        errors: ["Natural-language calculator command model did not return a valid decision."],
        ok: false,
        source: "model",
        statusCode: 502,
        warnings: []
      };
    }

    return {
      decision,
      ok: true,
      source: "model"
    };
  } catch (error) {
    return {
      code: "calculator_command_model_failed",
      errors: [error instanceof Error ? error.message : "Natural-language calculator command request failed."],
      ok: false,
      source: "model",
      statusCode: 502,
      warnings: []
    };
  } finally {
    clearTimeout(timeout);
  }
}

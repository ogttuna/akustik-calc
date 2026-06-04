import {
  isRequestedOutputId,
  normalizeReportAssistantMetricLabel,
  type ReportAssistantContext,
  type ReportAssistantMetric,
  type ReportAssistantMetricLocation,
  type ReportAssistantOutputFact,
  type ReportAssistantOutputFactBasisCategory,
  type ReportAssistantTraceSummary
} from "./report-assistant-context";
import { parseSimpleWorkbenchAssistantTraceSnapshot } from "./simple-workbench-assistant-trace-snapshot";
import type { SimpleWorkbenchProposalCoverageStatus } from "./simple-workbench-proposal";
import type { ReportAssistantPatch } from "./report-assistant-patch";

export type ReportAssistantInstructionPatchResult =
  | {
      errors: readonly string[];
      ok: false;
      warnings: readonly string[];
    }
  | {
      ok: true;
      patch: ReportAssistantPatch;
      warnings: readonly string[];
    };

const METRIC_STATUSES = new Set<string>(["bound", "live", "needs_input", "unsupported"]);
const METRIC_BASES = new Set<string>(["building_prediction", "field", "lab", "unknown"]);
const METRIC_DIRECTIONS = new Set<string>(["higher_is_better", "lower_is_better", "neutral"]);
const OUTPUT_FACT_BASIS_CATEGORIES = new Set<string>([
  "bound",
  "exact_measured",
  "field_adapter",
  "formula_corridor",
  "needs_input",
  "published_anchor",
  "source_absent_estimate",
  "unknown",
  "unsupported"
]);
const FORBIDDEN_ACTION_HINTS = /\b(?:apply|export|download|save|reset|write|delete|read\s+file|tool|system|ignore)\b/iu;

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeInstructionText(value: string): string {
  return value
    .replace(/[İIı]/gu, "i")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function normalizeLooseMetricLabel(value: string): string {
  return normalizeReportAssistantMetricLabel(value).replace(/[^a-z0-9]/gu, "");
}

function parseMetricLocation(value: unknown): ReportAssistantMetricLocation | null {
  if (!isObjectRecord(value) || typeof value.kind !== "string") {
    return null;
  }

  if (value.kind === "primaryMetric") {
    return { kind: "primaryMetric" };
  }

  if ((value.kind === "metricRow" || value.kind === "coverageRow") && typeof value.index === "number" && Number.isInteger(value.index) && value.index >= 0) {
    return {
      index: value.index,
      kind: value.kind
    };
  }

  return null;
}

function parseTraceSummary(value: unknown): ReportAssistantTraceSummary | null {
  if (!isObjectRecord(value) || !Array.isArray(value.missingPhysicalInputs) || !Array.isArray(value.unsupportedOutputs) || !Array.isArray(value.warnings)) {
    return null;
  }

  const route = value.route === "wall" || value.route === "floor" || value.route === "unknown" ? value.route : "unknown";
  const unsupportedOutputs = value.unsupportedOutputs.filter(isRequestedOutputId);
  const warnings = value.warnings.filter((entry): entry is string => typeof entry === "string");
  const missingPhysicalInputs = value.missingPhysicalInputs.filter((entry): entry is string => typeof entry === "string");

  return {
    basis: typeof value.basis === "string" ? value.basis : undefined,
    dynamicAirborneFamily: typeof value.dynamicAirborneFamily === "string" ? value.dynamicAirborneFamily : undefined,
    dynamicImpactFamily: typeof value.dynamicImpactFamily === "string" ? value.dynamicImpactFamily : undefined,
    missingPhysicalInputs,
    route,
    selectedCandidateId: typeof value.selectedCandidateId === "string" ? value.selectedCandidateId : undefined,
    selectedOrigin: typeof value.selectedOrigin === "string" ? value.selectedOrigin : undefined,
    unsupportedOutputs,
    warnings
  };
}

function parseAssistantMetric(value: unknown): ReportAssistantMetric | null {
  if (!isObjectRecord(value) || !Array.isArray(value.locations)) {
    return null;
  }

  const locations = value.locations
    .map((entry) => parseMetricLocation(entry))
    .filter((entry): entry is ReportAssistantMetricLocation => entry !== null);

  if (
    typeof value.id !== "string" ||
    typeof value.label !== "string" ||
    typeof value.metric !== "string" ||
    typeof value.reportDisplayValue !== "string" ||
    !METRIC_STATUSES.has(String(value.status)) ||
    !METRIC_BASES.has(String(value.basis)) ||
    !METRIC_DIRECTIONS.has(String(value.direction)) ||
    locations.length === 0
  ) {
    return null;
  }

  return {
    basis: value.basis as ReportAssistantMetric["basis"],
    direction: value.direction as ReportAssistantMetric["direction"],
    engineDisplayValue: typeof value.engineDisplayValue === "string" ? value.engineDisplayValue : undefined,
    id: value.id,
    label: value.label,
    locations,
    metric: value.metric,
    numericDb: typeof value.numericDb === "number" && Number.isFinite(value.numericDb) ? value.numericDb : undefined,
    outputId: isRequestedOutputId(value.outputId) ? value.outputId : undefined,
    reportDisplayValue: value.reportDisplayValue,
    status: value.status as SimpleWorkbenchProposalCoverageStatus
  };
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
}

function fallbackOutputFactFromMetric(metric: ReportAssistantMetric): ReportAssistantOutputFact {
  return {
    basis: metric.basis,
    basisCategory:
      metric.status === "bound" || metric.status === "needs_input" || metric.status === "unsupported"
        ? metric.status
        : "unknown",
    engineDisplayValue: metric.engineDisplayValue,
    label: metric.label,
    metricId: metric.id,
    missingInputs: [],
    outputId: metric.outputId,
    reportDisplayValue: metric.reportDisplayValue,
    status: metric.status,
    usedInputs: [],
    warnings: []
  };
}

function parseAssistantOutputFact(value: unknown, metrics: readonly ReportAssistantMetric[]): ReportAssistantOutputFact | null {
  if (!isObjectRecord(value)) {
    return null;
  }

  const metric =
    typeof value.metricId === "string"
      ? metrics.find((entry) => entry.id === value.metricId)
      : undefined;
  const outputId = isRequestedOutputId(value.outputId) ? value.outputId : metric?.outputId;
  const basis = METRIC_BASES.has(String(value.basis))
    ? (value.basis as ReportAssistantMetric["basis"])
    : metric?.basis;
  const status = METRIC_STATUSES.has(String(value.status))
    ? (value.status as SimpleWorkbenchProposalCoverageStatus)
    : metric?.status;

  if (
    typeof value.metricId !== "string" ||
    typeof value.label !== "string" ||
    typeof value.reportDisplayValue !== "string" ||
    !basis ||
    !status
  ) {
    return null;
  }

  return {
    basis,
    basisCategory: OUTPUT_FACT_BASIS_CATEGORIES.has(String(value.basisCategory))
      ? (value.basisCategory as ReportAssistantOutputFactBasisCategory)
      : fallbackOutputFactFromMetric(metric ?? {
          basis,
          direction: "neutral",
          id: value.metricId,
          label: value.label,
          locations: [],
          metric: outputId ?? value.label,
          outputId,
          reportDisplayValue: value.reportDisplayValue,
          status
        }).basisCategory,
    engineDisplayValue: typeof value.engineDisplayValue === "string" ? value.engineDisplayValue : metric?.engineDisplayValue,
    formulaOrSupportNote: typeof value.formulaOrSupportNote === "string" ? value.formulaOrSupportNote : undefined,
    label: value.label,
    metricId: value.metricId,
    missingInputs: stringArray(value.missingInputs),
    outputId,
    parkedReason: typeof value.parkedReason === "string" ? value.parkedReason : undefined,
    reportDisplayValue: value.reportDisplayValue,
    selectedCandidateId: typeof value.selectedCandidateId === "string" ? value.selectedCandidateId : undefined,
    status,
    supportBucket: typeof value.supportBucket === "string" ? value.supportBucket : undefined,
    usedInputs: stringArray(value.usedInputs),
    valuePinDb: typeof value.valuePinDb === "number" && Number.isFinite(value.valuePinDb) ? value.valuePinDb : undefined,
    warnings: stringArray(value.warnings)
  };
}

export function parseReportAssistantContextPayload(value: unknown): ReportAssistantContext | null {
  if (!isObjectRecord(value) || !Array.isArray(value.metrics) || !Array.isArray(value.layersSummary) || !Array.isArray(value.warnings)) {
    return null;
  }

  const metrics = value.metrics
    .map((entry) => parseAssistantMetric(entry))
    .filter((entry): entry is ReportAssistantMetric => entry !== null);
  const traceSummary = parseTraceSummary(value.traceSummary);

  if (
    typeof value.createdAtIso !== "string" ||
    typeof value.documentSignature !== "string" ||
    typeof value.reportId !== "string" ||
    metrics.length === 0 ||
    !traceSummary
  ) {
    return null;
  }

  const assistantOutputFacts = Array.isArray(value.assistantOutputFacts)
    ? value.assistantOutputFacts
        .map((entry) => parseAssistantOutputFact(entry, metrics))
        .filter((entry): entry is ReportAssistantOutputFact => entry !== null)
    : metrics.map(fallbackOutputFactFromMetric);

  return {
    assistantContextSignature:
      typeof value.assistantContextSignature === "string"
        ? value.assistantContextSignature
        : value.documentSignature,
    assistantOutputFacts,
    assistantTraceSnapshot: parseSimpleWorkbenchAssistantTraceSnapshot(value.assistantTraceSnapshot),
    createdAtIso: value.createdAtIso,
    documentSignature: value.documentSignature,
    layersSummary: value.layersSummary.filter((entry): entry is string => typeof entry === "string"),
    metrics,
    projectId: typeof value.projectId === "string" ? value.projectId : undefined,
    reportId: value.reportId,
    scenarioId: typeof value.scenarioId === "string" ? value.scenarioId : undefined,
    traceSummary,
    warnings: value.warnings.filter((entry): entry is string => typeof entry === "string")
  };
}

function getMetricAliases(metric: ReportAssistantMetric): string[] {
  return [
    metric.id,
    metric.id.replace(/^output:/u, ""),
    metric.label,
    metric.metric,
    metric.outputId
  ].filter((entry): entry is string => Boolean(entry));
}

export function resolveReportAssistantInstructionMetric(input: {
  context: ReportAssistantContext;
  instruction: string;
}): { errors: string[]; metric?: ReportAssistantMetric } {
  const normalizedInstruction = normalizeInstructionText(input.instruction);
  const exactMatches = input.context.metrics.filter((metric) =>
    getMetricAliases(metric).some((alias) => {
      const normalizedAlias = normalizeInstructionText(alias);
      return normalizedAlias.length > 0 && new RegExp(`(^|[^a-z0-9'])${escapeRegExp(normalizedAlias)}([^a-z0-9']|$)`, "u").test(normalizedInstruction);
    })
  );

  if (exactMatches.length === 1) {
    return { errors: [], metric: exactMatches[0] };
  }

  if (exactMatches.length > 1) {
    return {
      errors: [`Metric reference is ambiguous: ${exactMatches.map((metric) => metric.label).join(", ")}.`]
    };
  }

  const looseInstruction = normalizeLooseMetricLabel(normalizedInstruction);
  const looseMatches = input.context.metrics.filter((metric) =>
    getMetricAliases(metric).some((alias) => {
      const looseAlias = normalizeLooseMetricLabel(alias);
      return looseAlias.length > 1 && looseInstruction.includes(looseAlias);
    })
  );

  if (looseMatches.length === 1) {
    return { errors: [], metric: looseMatches[0] };
  }

  if (looseMatches.length > 1) {
    return {
      errors: [`Metric reference is ambiguous: ${looseMatches.map((metric) => metric.label).join(", ")}.`]
    };
  }

  return {
    errors: ["Instruction must name one current report metric such as Rw, R'w, DnT,w, Ln,w, or L'nT,w."]
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function parseInstructionNumber(instruction: string): number | null {
  const matches = [...instruction.matchAll(/(?:^|[^\d])([+-]?\d+(?:\.\d+)?)\s*(?:db)?(?:$|[^\d])/giu)];
  const match = matches[matches.length - 1];

  if (!match) {
    return null;
  }

  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

function hasSetIntent(instruction: string): boolean {
  return /\b(?:set|replace|target|to|make|value|ayarla|yap|deger|=)\b/iu.test(instruction);
}

function hasDecreaseIntent(instruction: string): boolean {
  return /\b(?:lower|reduce|decrease|down|azalt|dusur|dusuk)\b/iu.test(instruction);
}

function hasIncreaseIntent(instruction: string): boolean {
  return /\b(?:raise|increase|higher|up|artir|yukselt|yuksek)\b/iu.test(instruction);
}

function hasBetterIntent(instruction: string): boolean {
  return /\b(?:better|improve|iyilestir|daha\s+iyi)\b/iu.test(instruction);
}

function hasWorseIntent(instruction: string): boolean {
  return /\b(?:worse|weaken|kotu|daha\s+kotu)\b/iu.test(instruction);
}

function getSignedDelta(input: {
  instruction: string;
  metric: ReportAssistantMetric;
  numericValue: number;
}): number | null {
  if (hasDecreaseIntent(input.instruction)) {
    return -Math.abs(input.numericValue);
  }

  if (hasIncreaseIntent(input.instruction)) {
    return Math.abs(input.numericValue);
  }

  if (hasBetterIntent(input.instruction)) {
    if (input.metric.direction === "lower_is_better") {
      return -Math.abs(input.numericValue);
    }
    if (input.metric.direction === "higher_is_better") {
      return Math.abs(input.numericValue);
    }
    return null;
  }

  if (hasWorseIntent(input.instruction)) {
    if (input.metric.direction === "lower_is_better") {
      return Math.abs(input.numericValue);
    }
    if (input.metric.direction === "higher_is_better") {
      return -Math.abs(input.numericValue);
    }
    return null;
  }

  return null;
}

function getIgnoredActionWarnings(instruction: string): string[] {
  return FORBIDDEN_ACTION_HINTS.test(instruction)
    ? ["Only a report patch proposal can be generated here. Apply, export, save, reset, file, and tool requests are ignored."]
    : [];
}

export function createReportAssistantPatchFromInstruction(input: {
  context: ReportAssistantContext;
  instruction: string;
}): ReportAssistantInstructionPatchResult {
  const instruction = input.instruction.trim();
  const warnings = getIgnoredActionWarnings(instruction);

  if (instruction.length === 0) {
    return {
      errors: ["Instruction cannot be empty."],
      ok: false,
      warnings
    };
  }

  const metricResolution = resolveReportAssistantInstructionMetric({
    context: input.context,
    instruction
  });
  if (!metricResolution.metric) {
    return {
      errors: metricResolution.errors,
      ok: false,
      warnings
    };
  }

  const metric = metricResolution.metric;
  const normalizedInstruction = normalizeInstructionText(instruction);
  const numericValue = parseInstructionNumber(normalizedInstruction);

  if (numericValue === null) {
    return {
      errors: ["Instruction must include a numeric dB value or movement."],
      ok: false,
      warnings
    };
  }

  const deltaDb = getSignedDelta({
    instruction: normalizedInstruction,
    metric,
    numericValue
  });

  if (deltaDb !== null) {
    return {
      ok: true,
      patch: {
        documentSignature: input.context.documentSignature,
        operations: [
          {
            deltaDb,
            metricId: metric.id,
            reason: `User instruction: ${instruction}`,
            type: "adjust_metric_db"
          }
        ],
        summary: `${metric.label} ${deltaDb > 0 ? "increased" : "decreased"} by ${Math.abs(deltaDb)} dB for this report.`
      },
      warnings
    };
  }

  if (!hasSetIntent(normalizedInstruction)) {
    return {
      errors: ["Instruction must clearly say whether to set, lower, raise, improve, or worsen the report value."],
      ok: false,
      warnings
    };
  }

  const displayValue = `${numericValue} dB`;

  return {
    ok: true,
    patch: {
      documentSignature: input.context.documentSignature,
      operations: [
        {
          displayValue,
          metricId: metric.id,
          reason: `User instruction: ${instruction}`,
          type: "set_metric_display_value"
        }
      ],
      summary: `${metric.label} set to ${displayValue} for this report.`
    },
    warnings
  };
}

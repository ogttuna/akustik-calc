import type { RequestedOutputId } from "@dynecho/shared";

import type {
  ReportAssistantContext,
  ReportAssistantMetric,
  ReportAssistantOutputFact,
  ReportAssistantOutputFactBasisCategory,
  ReportAssistantTraceSummary
} from "./report-assistant-context";
import type {
  SimpleWorkbenchProposalCoverageStatus,
  SimpleWorkbenchProposalMetricBasis,
  SimpleWorkbenchProposalMetricDirection
} from "./simple-workbench-proposal";
import type { WorkbenchV2CalculatorAssistantPreview } from "../workbench-rebuild/workbench-v2-calculator-assistant";

export type ReportAssistantCurrentCalculatorReviewPacketSource =
  | "calculator_preview"
  | "report_context";

export type ReportAssistantCurrentCalculatorReviewStatus =
  | "needs_input"
  | "ready"
  | "unsupported";

export type ReportAssistantCurrentCalculatorReviewValueAuthority =
  | "calculator_preview"
  | "captured_engine_value"
  | "report_metric_without_engine_capture";

export type ReportAssistantCurrentCalculatorReviewLayer = {
  index: number;
  label: string;
  materialId?: string;
  materialName?: string;
  role?: string;
  sourceText: string;
  thicknessMm?: number;
};

export type ReportAssistantCurrentCalculatorReviewMetric = {
  basis: SimpleWorkbenchProposalMetricBasis | "unknown";
  basisCategory?: ReportAssistantOutputFactBasisCategory;
  calculatorDisplayValue?: string;
  direction: SimpleWorkbenchProposalMetricDirection | "neutral";
  label: string;
  metricId: string;
  outputId?: RequestedOutputId;
  reportDisplayValue?: string;
  status: SimpleWorkbenchProposalCoverageStatus | "pending";
  valueAuthority: ReportAssistantCurrentCalculatorReviewValueAuthority;
};

export type ReportAssistantCurrentCalculatorReviewPacket = {
  calculatorMethod?: string;
  contextSignature?: string;
  createdAtIso?: string;
  documentSignature?: string;
  layers: readonly ReportAssistantCurrentCalculatorReviewLayer[];
  metric: ReportAssistantCurrentCalculatorReviewMetric;
  missingInputs: readonly string[];
  numericReviewAllowed: boolean;
  numericReviewBlocker?: string;
  requestedOutputs: readonly RequestedOutputId[];
  reviewStatus: ReportAssistantCurrentCalculatorReviewStatus;
  route: "floor" | "unknown" | "wall";
  routeBasis?: string;
  snapshotSignature?: string;
  source: ReportAssistantCurrentCalculatorReviewPacketSource;
  sourceName: string;
  tasks: readonly string[];
  unsupportedOutputs: readonly RequestedOutputId[];
  warnings: readonly string[];
};

export type ReportAssistantCurrentCalculatorReviewPacketResult =
  | {
      ok: true;
      packet: ReportAssistantCurrentCalculatorReviewPacket;
    }
  | {
      code: "metric_not_found" | "output_not_found";
      errors: readonly string[];
      ok: false;
    };

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function optionalStringField(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function optionalNumberField(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function parseStringArray(value: unknown, maxItems = 20): string[] {
  return Array.isArray(value)
    ? value
        .filter((entry): entry is string => typeof entry === "string")
        .map((entry) => entry.trim())
        .filter((entry, index, all) => entry.length > 0 && all.indexOf(entry) === index)
        .slice(0, maxItems)
    : [];
}

function parseRequestedOutputArray(value: unknown): RequestedOutputId[] {
  return parseStringArray(value, 16) as RequestedOutputId[];
}

function parsePacketLayer(value: unknown, index: number): ReportAssistantCurrentCalculatorReviewLayer | null {
  if (!isObjectRecord(value)) {
    return null;
  }

  const label = optionalStringField(value.label) ?? optionalStringField(value.sourceText);
  const sourceText = optionalStringField(value.sourceText) ?? label;
  if (!label || !sourceText) {
    return null;
  }
  const materialId = optionalStringField(value.materialId);
  const materialName = optionalStringField(value.materialName);
  const role = optionalStringField(value.role);
  const thicknessMm = optionalNumberField(value.thicknessMm);

  return {
    index: optionalNumberField(value.index) ?? index + 1,
    label,
    ...(materialId ? { materialId } : {}),
    ...(materialName ? { materialName } : {}),
    ...(role ? { role } : {}),
    sourceText,
    ...(thicknessMm ? { thicknessMm } : {})
  };
}

function parsePacketMetric(value: unknown): ReportAssistantCurrentCalculatorReviewMetric | null {
  if (!isObjectRecord(value)) {
    return null;
  }

  const label = optionalStringField(value.label);
  const metricId = optionalStringField(value.metricId);
  const valueAuthority = optionalStringField(value.valueAuthority);
  const basis = optionalStringField(value.basis) ?? "unknown";
  const direction = optionalStringField(value.direction) ?? "neutral";
  const status = optionalStringField(value.status);
  const basisCategory = optionalStringField(value.basisCategory);
  const calculatorDisplayValue = optionalStringField(value.calculatorDisplayValue);
  const outputId = optionalStringField(value.outputId);
  const reportDisplayValue = optionalStringField(value.reportDisplayValue);
  if (
    !label ||
    !metricId ||
    !["calculator_preview", "captured_engine_value", "report_metric_without_engine_capture"].includes(valueAuthority ?? "") ||
    !["building_prediction", "field", "lab", "unknown"].includes(basis) ||
    !["higher_is_better", "lower_is_better", "neutral"].includes(direction) ||
    !["bound", "live", "needs_input", "pending", "unsupported"].includes(status ?? "")
  ) {
    return null;
  }

  return {
    basis: basis as ReportAssistantCurrentCalculatorReviewMetric["basis"],
    ...(basisCategory ? { basisCategory: basisCategory as ReportAssistantOutputFactBasisCategory } : {}),
    ...(calculatorDisplayValue ? { calculatorDisplayValue } : {}),
    direction: direction as ReportAssistantCurrentCalculatorReviewMetric["direction"],
    label,
    metricId,
    ...(outputId ? { outputId: outputId as RequestedOutputId } : {}),
    ...(reportDisplayValue ? { reportDisplayValue } : {}),
    status: status as ReportAssistantCurrentCalculatorReviewMetric["status"],
    valueAuthority: valueAuthority as ReportAssistantCurrentCalculatorReviewValueAuthority
  };
}

export function parseReportAssistantCurrentCalculatorReviewPacket(
  value: unknown
): ReportAssistantCurrentCalculatorReviewPacket | null {
  if (!isObjectRecord(value)) {
    return null;
  }

  const source = optionalStringField(value.source);
  const sourceName = optionalStringField(value.sourceName);
  const route = optionalStringField(value.route);
  const reviewStatus = optionalStringField(value.reviewStatus);
  const calculatorMethod = optionalStringField(value.calculatorMethod);
  const contextSignature = optionalStringField(value.contextSignature);
  const createdAtIso = optionalStringField(value.createdAtIso);
  const documentSignature = optionalStringField(value.documentSignature);
  const metric = parsePacketMetric(value.metric);
  const numericReviewBlocker = optionalStringField(value.numericReviewBlocker);
  const routeBasis = optionalStringField(value.routeBasis);
  const snapshotSignature = optionalStringField(value.snapshotSignature);
  const layers = Array.isArray(value.layers)
    ? value.layers
        .map((entry, index) => parsePacketLayer(entry, index))
        .filter((entry): entry is ReportAssistantCurrentCalculatorReviewLayer => entry !== null)
    : [];

  if (
    !["calculator_preview", "report_context"].includes(source ?? "") ||
    !sourceName ||
    !["floor", "unknown", "wall"].includes(route ?? "") ||
    !["needs_input", "ready", "unsupported"].includes(reviewStatus ?? "") ||
    typeof value.numericReviewAllowed !== "boolean" ||
    !metric
  ) {
    return null;
  }

  return {
    ...(calculatorMethod ? { calculatorMethod } : {}),
    ...(contextSignature ? { contextSignature } : {}),
    ...(createdAtIso ? { createdAtIso } : {}),
    ...(documentSignature ? { documentSignature } : {}),
    layers,
    metric,
    missingInputs: parseStringArray(value.missingInputs),
    numericReviewAllowed: value.numericReviewAllowed,
    ...(numericReviewBlocker ? { numericReviewBlocker } : {}),
    requestedOutputs: parseRequestedOutputArray(value.requestedOutputs),
    reviewStatus: reviewStatus as ReportAssistantCurrentCalculatorReviewStatus,
    route: route as ReportAssistantCurrentCalculatorReviewPacket["route"],
    ...(routeBasis ? { routeBasis } : {}),
    ...(snapshotSignature ? { snapshotSignature } : {}),
    source: source as ReportAssistantCurrentCalculatorReviewPacketSource,
    sourceName,
    tasks: parseStringArray(value.tasks),
    unsupportedOutputs: parseRequestedOutputArray(value.unsupportedOutputs),
    warnings: parseStringArray(value.warnings)
  };
}

function normalizeMetricId(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/gu, "");
}

function outputIdFromMetricId(metricId: string): RequestedOutputId | undefined {
  return metricId.startsWith("output:") ? metricId.slice("output:".length) as RequestedOutputId : undefined;
}

function metricMatches(input: {
  metric: ReportAssistantMetric;
  metricId?: string;
  outputId?: RequestedOutputId;
}): boolean {
  if (input.metricId && input.metric.id === input.metricId) {
    return true;
  }

  if (input.outputId && input.metric.outputId === input.outputId) {
    return true;
  }

  return input.metricId
    ? normalizeMetricId(input.metric.label) === normalizeMetricId(input.metricId)
    : false;
}

function outputFactMatches(input: {
  fact: ReportAssistantOutputFact;
  metric: ReportAssistantMetric;
}): boolean {
  return input.fact.metricId === input.metric.id ||
    (input.metric.outputId !== undefined && input.fact.outputId === input.metric.outputId);
}

function firstRequestedMetric(input: {
  context: ReportAssistantContext;
  metricId?: string;
  outputId?: RequestedOutputId;
}): ReportAssistantMetric | undefined {
  if (input.metricId || input.outputId) {
    return input.context.metrics.find((metric) => metricMatches({
      metric,
      metricId: input.metricId,
      outputId: input.outputId
    }));
  }

  return input.context.metrics[0];
}

function reviewStatusFromCoverageStatus(status: SimpleWorkbenchProposalCoverageStatus): ReportAssistantCurrentCalculatorReviewStatus {
  if (status === "needs_input") {
    return "needs_input";
  }

  if (status === "unsupported") {
    return "unsupported";
  }

  return "ready";
}

function numericReviewBlocker(input: {
  calculatorDisplayValue?: string;
  missingInputs: readonly string[];
  reviewStatus: ReportAssistantCurrentCalculatorReviewStatus;
  unsupportedOutputs: readonly RequestedOutputId[];
}): string | undefined {
  if (input.reviewStatus === "needs_input") {
    return input.missingInputs.length
      ? `Missing calculator inputs: ${input.missingInputs.join(", ")}.`
      : "Calculator output needs input before numeric source review.";
  }

  if (input.reviewStatus === "unsupported") {
    return input.unsupportedOutputs.length
      ? `Unsupported calculator outputs: ${input.unsupportedOutputs.join(", ")}.`
      : "Calculator output is unsupported for this route.";
  }

  if (!input.calculatorDisplayValue) {
    return "No calculator-backed display value is available for numeric source review.";
  }

  return undefined;
}

function contextLayers(context: ReportAssistantContext): ReportAssistantCurrentCalculatorReviewLayer[] {
  return context.layersSummary.map((sourceText, index) => ({
    index: index + 1,
    label: sourceText,
    sourceText
  }));
}

function contextTasks(input: {
  fact?: ReportAssistantOutputFact;
  traceSummary: ReportAssistantTraceSummary;
}): string[] {
  return [
    ...(input.fact?.missingInputs ?? []),
    ...(input.fact?.parkedReason ? [input.fact.parkedReason] : []),
    ...input.traceSummary.missingPhysicalInputs
  ].filter((entry, index, all) => entry.trim().length > 0 && all.indexOf(entry) === index);
}

export function buildReportAssistantCurrentCalculatorReviewPacketFromContext(input: {
  context: ReportAssistantContext;
  metricId?: string;
  outputId?: RequestedOutputId;
}): ReportAssistantCurrentCalculatorReviewPacketResult {
  const metric = firstRequestedMetric(input);
  if (!metric) {
    return {
      code: "metric_not_found",
      errors: ["No assistant-visible metric matched the requested calculator review target."],
      ok: false
    };
  }

  const fact = input.context.assistantOutputFacts.find((entry) => outputFactMatches({
    fact: entry,
    metric
  }));
  const calculatorDisplayValue = metric.engineDisplayValue ?? fact?.engineDisplayValue ?? (metric.status === "live" ? metric.reportDisplayValue : undefined);
  const valueAuthority: ReportAssistantCurrentCalculatorReviewValueAuthority =
    metric.engineDisplayValue || fact?.engineDisplayValue
      ? "captured_engine_value"
      : "report_metric_without_engine_capture";
  const missingInputs = [
    ...(fact?.missingInputs ?? []),
    ...input.context.traceSummary.missingPhysicalInputs
  ].filter((entry, index, all) => entry.trim().length > 0 && all.indexOf(entry) === index);
  const unsupportedOutputs = [
    ...(fact?.outputId && fact.status === "unsupported" ? [fact.outputId] : []),
    ...input.context.traceSummary.unsupportedOutputs
  ].filter((entry, index, all) => all.indexOf(entry) === index);
  const status = reviewStatusFromCoverageStatus(metric.status);
  const blocker = numericReviewBlocker({
    calculatorDisplayValue,
    missingInputs,
    reviewStatus: status,
    unsupportedOutputs
  });

  return {
    ok: true,
    packet: {
      contextSignature: input.context.assistantContextSignature,
      createdAtIso: input.context.createdAtIso,
      documentSignature: input.context.documentSignature,
      layers: contextLayers(input.context),
      metric: {
        basis: metric.basis,
        ...(fact?.basisCategory ? { basisCategory: fact.basisCategory } : {}),
        ...(calculatorDisplayValue ? { calculatorDisplayValue } : {}),
        direction: metric.direction,
        label: metric.label,
        metricId: metric.id,
        ...(metric.outputId ? { outputId: metric.outputId } : {}),
        reportDisplayValue: metric.reportDisplayValue,
        status: metric.status,
        valueAuthority
      },
      missingInputs,
      numericReviewAllowed: blocker === undefined,
      ...(blocker ? { numericReviewBlocker: blocker } : {}),
      requestedOutputs: input.context.assistantOutputFacts
        .map((fact) => fact.outputId)
        .filter((outputId): outputId is RequestedOutputId => outputId !== undefined),
      reviewStatus: status,
      route: input.context.traceSummary.route,
      ...(input.context.traceSummary.basis ? { routeBasis: input.context.traceSummary.basis } : {}),
      source: "report_context",
      sourceName: input.context.reportId,
      tasks: contextTasks({
        fact,
        traceSummary: input.context.traceSummary
      }),
      unsupportedOutputs,
      warnings: [
        ...input.context.warnings,
        ...(fact?.warnings ?? []),
        ...input.context.traceSummary.warnings
      ].filter((entry, index, all) => entry.trim().length > 0 && all.indexOf(entry) === index)
    }
  };
}

function previewLayerSummary(preview: WorkbenchV2CalculatorAssistantPreview): ReportAssistantCurrentCalculatorReviewLayer[] {
  if (preview.describedConfiguration?.layers.length) {
    return preview.describedConfiguration.layers.map((layer, index) => ({
      index: index + 1,
      label: `${layer.materialName} ${layer.thicknessMm} mm`,
      materialId: layer.materialId,
      materialName: layer.materialName,
      role: layer.role,
      sourceText: `${layer.role}: ${layer.materialName} ${layer.thicknessMm} mm`,
      thicknessMm: layer.thicknessMm
    }));
  }

  if (preview.layerStackDraft?.draft.layers.length) {
    return preview.layerStackDraft.draft.layers.map((layer, index) => ({
      index: index + 1,
      label: `${layer.materialName ?? layer.materialId ?? layer.originalPhrase}${layer.thicknessMm ? ` ${layer.thicknessMm} mm` : ""}`,
      ...(layer.materialId ? { materialId: layer.materialId } : {}),
      ...(layer.materialName ? { materialName: layer.materialName } : {}),
      role: layer.role,
      sourceText: layer.originalPhrase,
      ...(layer.thicknessMm ? { thicknessMm: layer.thicknessMm } : {})
    }));
  }

  const materialNames = new Map((preview.estimatePayload?.materialCatalog ?? []).map((material) => [material.id, material.name]));
  return (preview.estimatePayload?.layers ?? []).map((layer, index) => ({
    index: index + 1,
    label: `${materialNames.get(layer.materialId) ?? layer.materialId} ${layer.thicknessMm} mm`,
    materialId: layer.materialId,
    ...(materialNames.get(layer.materialId) ? { materialName: materialNames.get(layer.materialId) } : {}),
    ...(layer.floorRole ? { role: layer.floorRole } : {}),
    sourceText: `${materialNames.get(layer.materialId) ?? layer.materialId} ${layer.thicknessMm} mm`,
    thicknessMm: layer.thicknessMm
  }));
}

function previewStatusFromRow(status: WorkbenchV2CalculatorAssistantPreview["outputRows"][number]["status"]): ReportAssistantCurrentCalculatorReviewStatus {
  if (status === "needs_input" || status === "pending") {
    return "needs_input";
  }

  if (status === "unsupported") {
    return "unsupported";
  }

  return "ready";
}

export function buildReportAssistantCurrentCalculatorReviewPacketFromCalculatorPreview(input: {
  contextSignature?: string;
  metricId?: string;
  outputId?: RequestedOutputId;
  preview: WorkbenchV2CalculatorAssistantPreview;
  snapshotSignature?: string;
}): ReportAssistantCurrentCalculatorReviewPacketResult {
  const outputId = input.outputId ?? outputIdFromMetricId(input.metricId ?? "") ?? input.preview.calculationSummary.primaryOutput ?? input.preview.calculationSummary.selectedOutputs[0];
  const row = input.preview.outputRows.find((entry) => entry.label === outputId);
  if (!outputId || !row) {
    return {
      code: "output_not_found",
      errors: ["No calculator preview output row matched the requested review target."],
      ok: false
    };
  }

  const status = previewStatusFromRow(row.status);
  const calculatorDisplayValue = row.status === "live" ? row.value : undefined;
  const missingInputs = [
    ...(input.preview.engineSummary?.acousticBoundary?.missingPhysicalInputs ?? []),
    ...input.preview.tasks.map((task) => task.label)
  ].filter((entry, index, all) => entry.trim().length > 0 && all.indexOf(entry) === index);
  const unsupportedOutputs = [
    ...(row.status === "unsupported" ? [row.label] : []),
    ...(input.preview.engineSummary?.acousticBoundary?.unsupportedOutputs ?? []),
    ...(input.preview.engineSummary?.unsupportedTargetOutputs ?? [])
  ].filter((entry, index, all) => all.indexOf(entry) === index);
  const blocker = numericReviewBlocker({
    calculatorDisplayValue,
    missingInputs,
    reviewStatus: status,
    unsupportedOutputs
  });

  return {
    ok: true,
    packet: {
      ...(input.contextSignature ? { contextSignature: input.contextSignature } : {}),
      ...(input.preview.engineSummary?.method ? { calculatorMethod: input.preview.engineSummary.method } : {}),
      layers: previewLayerSummary(input.preview),
      metric: {
        basis: "unknown",
        ...(calculatorDisplayValue ? { calculatorDisplayValue } : {}),
        direction: "neutral",
        label: row.label,
        metricId: `output:${row.label}`,
        outputId: row.label,
        status: row.status === "live" ? "live" : row.status === "unsupported" ? "unsupported" : "needs_input",
        valueAuthority: "calculator_preview"
      },
      missingInputs,
      numericReviewAllowed: blocker === undefined,
      ...(blocker ? { numericReviewBlocker: blocker } : {}),
      requestedOutputs: input.preview.calculationSummary.selectedOutputs,
      reviewStatus: status,
      route: input.preview.engineSummary?.acousticBoundary?.route ?? input.preview.requestedSnapshot.mode,
      ...(input.preview.engineSummary?.acousticBoundary?.method
        ? { routeBasis: input.preview.engineSummary.acousticBoundary.method }
        : input.preview.engineSummary?.method
          ? { routeBasis: input.preview.engineSummary.method }
          : {}),
      ...(input.snapshotSignature ? { snapshotSignature: input.snapshotSignature } : {}),
      source: "calculator_preview",
      sourceName: input.preview.requestedSnapshot.name,
      tasks: input.preview.tasks.map((task) => `${task.label}: ${task.detail}`),
      unsupportedOutputs,
      warnings: input.preview.engineSummary?.warnings ?? []
    }
  };
}

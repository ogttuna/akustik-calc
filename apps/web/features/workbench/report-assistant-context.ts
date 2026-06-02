import {
  REQUESTED_OUTPUT_IDS,
  type AssemblyCalculation,
  type RequestedOutputId
} from "@dynecho/shared";

import type {
  SimpleWorkbenchProposalCoverageStatus,
  SimpleWorkbenchProposalDocument,
  SimpleWorkbenchProposalMetricBasis,
  SimpleWorkbenchProposalMetricDirection
} from "./simple-workbench-proposal";

export type ReportAssistantMetricLocation =
  | { kind: "primaryMetric" }
  | { index: number; kind: "metricRow" }
  | { index: number; kind: "coverageRow" };

export type ReportAssistantTraceSummary = {
  basis?: string;
  dynamicAirborneFamily?: string;
  dynamicImpactFamily?: string;
  missingPhysicalInputs: readonly string[];
  route: "floor" | "unknown" | "wall";
  selectedCandidateId?: string;
  selectedOrigin?: string;
  unsupportedOutputs: readonly RequestedOutputId[];
  warnings: readonly string[];
};

export type ReportAssistantMetric = {
  basis: SimpleWorkbenchProposalMetricBasis;
  direction: SimpleWorkbenchProposalMetricDirection;
  engineDisplayValue?: string;
  id: string;
  label: string;
  locations: readonly ReportAssistantMetricLocation[];
  metric: string;
  numericDb?: number;
  outputId?: RequestedOutputId;
  reportDisplayValue: string;
  status: SimpleWorkbenchProposalCoverageStatus;
};

export type ReportAssistantContext = {
  createdAtIso: string;
  documentSignature: string;
  layersSummary: readonly string[];
  metrics: readonly ReportAssistantMetric[];
  projectId?: string;
  reportId: string;
  scenarioId?: string;
  traceSummary: ReportAssistantTraceSummary;
  warnings: readonly string[];
};

type MutableReportAssistantMetric = Omit<ReportAssistantMetric, "locations"> & {
  locations: ReportAssistantMetricLocation[];
};

const REQUESTED_OUTPUT_ID_SET = new Set<string>(REQUESTED_OUTPUT_IDS);

const LOWER_IS_BETTER_OUTPUTS = new Set<RequestedOutputId>([
  "L'n,w",
  "L'nT,50",
  "L'nT,w",
  "Ln,w",
  "Ln,w+CI",
  "LnT,A"
]);

const NEUTRAL_OUTPUTS = new Set<RequestedOutputId>(["C", "CI", "CI,50-2500", "Ctr"]);

const FIELD_OUTPUTS = new Set<RequestedOutputId>([
  "AIIC",
  "Dn,A",
  "Dn,w",
  "DnT,A",
  "DnT,A,k",
  "DnT,w",
  "ISR",
  "L'n,w",
  "L'nT,50",
  "L'nT,w",
  "NISR",
  "R'w"
]);

const OUTPUT_ID_BY_NORMALIZED_LABEL = new Map<string, RequestedOutputId>(
  REQUESTED_OUTPUT_IDS.map((output) => [normalizeReportAssistantMetricLabel(output), output])
);

export function normalizeReportAssistantMetricLabel(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/\s+/gu, "");
}

export function isRequestedOutputId(value: unknown): value is RequestedOutputId {
  return typeof value === "string" && REQUESTED_OUTPUT_ID_SET.has(value);
}

export function inferReportAssistantOutputId(input: {
  label: string;
  outputId?: RequestedOutputId;
}): RequestedOutputId | undefined {
  return input.outputId ?? OUTPUT_ID_BY_NORMALIZED_LABEL.get(normalizeReportAssistantMetricLabel(input.label));
}

export function getReportAssistantMetricId(outputId: RequestedOutputId): string {
  return `output:${outputId}`;
}

export function getReportAssistantMetricDirection(
  outputId: RequestedOutputId | undefined
): SimpleWorkbenchProposalMetricDirection {
  if (!outputId) {
    return "neutral";
  }

  if (LOWER_IS_BETTER_OUTPUTS.has(outputId)) {
    return "lower_is_better";
  }

  if (NEUTRAL_OUTPUTS.has(outputId)) {
    return "neutral";
  }

  return "higher_is_better";
}

export function getReportAssistantMetricBasis(
  outputId: RequestedOutputId | undefined,
  input?: { contextLabel?: string }
): SimpleWorkbenchProposalMetricBasis {
  if (!outputId) {
    return "unknown";
  }

  if (/building/i.test(input?.contextLabel ?? "") && FIELD_OUTPUTS.has(outputId)) {
    return "building_prediction";
  }

  return FIELD_OUTPUTS.has(outputId) ? "field" : "lab";
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableStringify(entry)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function hashSignature(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `report:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function createReportAssistantDocumentSignature(document: SimpleWorkbenchProposalDocument): string {
  return hashSignature(
    stableStringify({
      coverageItems: document.coverageItems.map((item) => ({
        label: item.label,
        outputId: item.outputId,
        reportMetricId: item.reportMetricId,
        status: item.status,
        value: item.value
      })),
      metrics: document.metrics.map((metric) => ({
        label: metric.label,
        outputId: metric.outputId,
        reportMetricId: metric.reportMetricId,
        value: metric.value,
        visible: metric.visible === false ? false : true
      })),
      primaryMetricLabel: document.primaryMetricLabel,
      primaryMetricValue: document.primaryMetricValue,
      warnings: document.warnings
    })
  );
}

function findBaseDisplayValue(input: {
  baseDocument?: SimpleWorkbenchProposalDocument;
  label: string;
  metricId: string;
  outputId?: RequestedOutputId;
}): string | undefined {
  const { baseDocument, label, metricId, outputId } = input;
  if (!baseDocument) {
    return undefined;
  }

  const matchesMetric = (entry: {
    label: string;
    outputId?: RequestedOutputId;
    reportMetricId?: string;
  }) =>
    entry.reportMetricId === metricId ||
    (outputId && entry.outputId === outputId) ||
    normalizeReportAssistantMetricLabel(entry.label) === normalizeReportAssistantMetricLabel(label);

  if (matchesMetric({ label: baseDocument.primaryMetricLabel })) {
    return baseDocument.primaryMetricValue;
  }

  return (
    baseDocument.metrics.find(matchesMetric)?.value ??
    baseDocument.coverageItems.find(matchesMetric)?.value
  );
}

function parseFirstNumericDb(value: string): number | undefined {
  const match = /^\s*(?:(?:<=|>=|[<>]=?)\s*)?([+-]?\d+(?:\.\d+)?)/u.exec(value);
  if (!match) {
    return undefined;
  }

  const numericDb = Number(match[1]);
  return Number.isFinite(numericDb) ? numericDb : undefined;
}

function upsertMetric(
  metricsById: Map<string, MutableReportAssistantMetric>,
  input: {
    baseDocument?: SimpleWorkbenchProposalDocument;
    basis?: SimpleWorkbenchProposalMetricBasis;
    direction?: SimpleWorkbenchProposalMetricDirection;
    engineDisplayValue?: string;
    label: string;
    location: ReportAssistantMetricLocation;
    outputId?: RequestedOutputId;
    reportMetricId?: string;
    status: SimpleWorkbenchProposalCoverageStatus;
    value: string;
  }
): void {
  const outputId = inferReportAssistantOutputId({
    label: input.label,
    outputId: input.outputId
  });
  const metricId =
    input.reportMetricId ??
    (outputId ? getReportAssistantMetricId(outputId) : `label:${normalizeReportAssistantMetricLabel(input.label)}`);
  const existing = metricsById.get(metricId);

  if (existing) {
    existing.locations.push(input.location);
    if (existing.status !== "live" && input.status === "live" && input.location.kind === "coverageRow") {
      existing.status = "live";
    }
    return;
  }

  const basis = input.basis ?? getReportAssistantMetricBasis(outputId);
  const direction = input.direction ?? getReportAssistantMetricDirection(outputId);
  const engineDisplayValue =
    input.engineDisplayValue ??
    findBaseDisplayValue({
      baseDocument: input.baseDocument,
      label: input.label,
      metricId,
      outputId
    });

  metricsById.set(metricId, {
    basis,
    direction,
    engineDisplayValue,
    id: metricId,
    label: input.label,
    locations: [input.location],
    metric: outputId ?? input.label,
    numericDb: parseFirstNumericDb(input.value),
    outputId,
    reportDisplayValue: input.value,
    status: input.status
  });
}

function summarizeLayers(document: SimpleWorkbenchProposalDocument): string[] {
  return document.layers.map((layer) => {
    const fields = [
      `${String(layer.index)}. ${layer.label}`,
      layer.roleLabel,
      layer.thicknessLabel,
      layer.densityLabel,
      layer.surfaceMassLabel
    ].filter((entry): entry is string => Boolean(entry));

    return fields.join(" | ");
  });
}

export function buildReportAssistantTraceSummary(input: {
  document: SimpleWorkbenchProposalDocument;
  result?: AssemblyCalculation | null;
}): ReportAssistantTraceSummary {
  const { document, result } = input;
  const boundaryRoute = result?.acousticAnswerBoundary?.route;
  const route =
    boundaryRoute === "wall" || boundaryRoute === "floor"
      ? boundaryRoute
      : /floor/i.test(document.studyModeLabel)
        ? "floor"
        : /wall/i.test(document.studyModeLabel)
          ? "wall"
          : "unknown";

  return {
    basis: result?.airborneBasis?.origin ?? result?.airborneCandidateResolution?.selectedBasis?.origin,
    dynamicAirborneFamily: result?.dynamicAirborneTrace?.detectedFamilyLabel,
    dynamicImpactFamily: result?.dynamicImpactTrace?.selectedLabel,
    missingPhysicalInputs: [
      ...(result?.acousticAnswerBoundary?.missingPhysicalInputs ?? []),
      ...(result?.airborneBasis?.missingPhysicalInputs ?? [])
    ],
    route,
    selectedCandidateId: result?.airborneCandidateResolution?.selectedCandidateId,
    selectedOrigin: result?.airborneCandidateResolution?.selectedOrigin,
    unsupportedOutputs: result?.unsupportedTargetOutputs ?? [],
    warnings: document.warnings
  };
}

export function buildReportAssistantContext(input: {
  baseDocument?: SimpleWorkbenchProposalDocument;
  createdAtIso?: string;
  document: SimpleWorkbenchProposalDocument;
  reportId?: string;
  result?: AssemblyCalculation | null;
}): ReportAssistantContext {
  const { baseDocument, document } = input;
  const metricsById = new Map<string, MutableReportAssistantMetric>();

  document.coverageItems.forEach((item, index) => {
    upsertMetric(metricsById, {
      baseDocument,
      basis: item.metricBasis,
      direction: item.metricDirection,
      engineDisplayValue: item.engineDisplayValue,
      label: item.label,
      location: { index, kind: "coverageRow" },
      outputId: item.outputId,
      reportMetricId: item.reportMetricId,
      status: item.status,
      value: item.value
    });
  });

  document.metrics.forEach((metric, index) => {
    upsertMetric(metricsById, {
      baseDocument,
      basis: metric.metricBasis,
      direction: metric.metricDirection,
      engineDisplayValue: metric.engineDisplayValue,
      label: metric.label,
      location: { index, kind: "metricRow" },
      outputId: metric.outputId,
      reportMetricId: metric.reportMetricId,
      status: "live",
      value: metric.value
    });
  });

  upsertMetric(metricsById, {
    baseDocument,
    label: document.primaryMetricLabel,
    location: { kind: "primaryMetric" },
    status: "live",
    value: document.primaryMetricValue
  });

  return {
    createdAtIso: input.createdAtIso ?? new Date().toISOString(),
    documentSignature: createReportAssistantDocumentSignature(document),
    layersSummary: summarizeLayers(document),
    metrics: [...metricsById.values()],
    projectId: document.serverProjectId,
    reportId: input.reportId ?? document.proposalReference,
    scenarioId: document.serverProjectScenarioId,
    traceSummary: buildReportAssistantTraceSummary({
      document,
      result: input.result
    }),
    warnings: document.warnings
  };
}

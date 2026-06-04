import {
  REQUESTED_OUTPUT_IDS,
  type AssemblyCalculation,
  type RequestedOutputId
} from "@dynecho/shared";

import type {
  SimpleWorkbenchProposalCoverageItem,
  SimpleWorkbenchProposalCoverageStatus,
  SimpleWorkbenchProposalDocument,
  SimpleWorkbenchProposalMetricBasis,
  SimpleWorkbenchProposalMetricDirection
} from "./simple-workbench-proposal";
import {
  buildSimpleWorkbenchAssistantTraceSnapshot,
  type SimpleWorkbenchAssistantTraceSnapshot
} from "./simple-workbench-assistant-trace-snapshot";

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

export type ReportAssistantOutputFactBasisCategory =
  | "bound"
  | "exact_measured"
  | "field_adapter"
  | "formula_corridor"
  | "needs_input"
  | "published_anchor"
  | "source_absent_estimate"
  | "unknown"
  | "unsupported";

export type ReportAssistantOutputFact = {
  basis: SimpleWorkbenchProposalMetricBasis;
  basisCategory: ReportAssistantOutputFactBasisCategory;
  engineDisplayValue?: string;
  formulaOrSupportNote?: string;
  label: string;
  metricId: string;
  missingInputs: readonly string[];
  outputId?: RequestedOutputId;
  parkedReason?: string;
  reportDisplayValue: string;
  selectedCandidateId?: string;
  status: SimpleWorkbenchProposalCoverageStatus;
  supportBucket?: string;
  usedInputs: readonly string[];
  valuePinDb?: number;
  warnings: readonly string[];
};

export type ReportAssistantContext = {
  assistantContextSignature: string;
  assistantOutputFacts: readonly ReportAssistantOutputFact[];
  assistantTraceSnapshot?: SimpleWorkbenchAssistantTraceSnapshot;
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

const IMPACT_OUTPUTS = new Set<RequestedOutputId>([
  "AIIC",
  "CI",
  "CI,50-2500",
  "DeltaLw",
  "HIIC",
  "IIC",
  "L'n,w",
  "L'nT,50",
  "L'nT,w",
  "Ln,w",
  "Ln,w+CI",
  "LnT,A",
  "NISR"
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

export function createReportAssistantContextSignature(input: {
  assistantTraceSnapshot?: SimpleWorkbenchAssistantTraceSnapshot;
  document: SimpleWorkbenchProposalDocument;
}): string {
  const { assistantTraceSnapshot, document } = input;

  return hashSignature(
    stableStringify({
      assistantTraceSnapshot,
      contextLabel: document.contextLabel,
      coverageItems: document.coverageItems.map((item) => ({
        label: item.label,
        nextStep: item.nextStep,
        outputId: item.outputId,
        postureLabel: item.postureLabel,
        reportMetricId: item.reportMetricId,
        status: item.status,
        value: item.value
      })),
      dynamicBranchLabel: document.dynamicBranchLabel,
      layers: document.layers.map((layer) => ({
        categoryLabel: layer.categoryLabel,
        densityLabel: layer.densityLabel,
        index: layer.index,
        label: layer.label,
        roleLabel: layer.roleLabel,
        surfaceMassLabel: layer.surfaceMassLabel,
        thicknessLabel: layer.thicknessLabel
      })),
      methodTraceGroups: document.methodTraceGroups.map((group) => ({
        detail: group.detail,
        label: group.label,
        notes: group.notes,
        value: group.value
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
      reportProfile: document.reportProfile,
      reportProfileLabel: document.reportProfileLabel,
      studyContextLabel: document.studyContextLabel,
      studyModeLabel: document.studyModeLabel,
      validationLabel: document.validationLabel,
      warnings: document.warnings
    })
  ).replace(/^report:/u, "report-context:");
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

function uniqueBoundedStrings(values: readonly (string | undefined)[], maxItems = 8): string[] {
  const unique: string[] = [];

  for (const value of values) {
    const normalized = value?.trim().replace(/\s+/gu, " ");
    if (!normalized || unique.includes(normalized)) {
      continue;
    }

    unique.push(normalized);
    if (unique.length >= maxItems) {
      break;
    }
  }

  return unique;
}

function formatBoundedList(label: string, values: readonly string[] | undefined): string | undefined {
  if (!values || values.length === 0) {
    return undefined;
  }

  return `${label}: ${values.slice(0, 5).join(", ")}${values.length > 5 ? ", ..." : ""}`;
}

function isImpactOutput(outputId: RequestedOutputId | undefined): boolean {
  return typeof outputId === "string" && IMPACT_OUTPUTS.has(outputId);
}

function getMetricCoverageItem(input: {
  document: SimpleWorkbenchProposalDocument;
  metric: ReportAssistantMetric;
}): SimpleWorkbenchProposalCoverageItem | undefined {
  const { document, metric } = input;
  return document.coverageItems.find((item) => {
    const itemOutputId = inferReportAssistantOutputId({
      label: item.label,
      outputId: item.outputId
    });

    return (
      item.reportMetricId === metric.id ||
      (itemOutputId && metric.outputId && itemOutputId === metric.outputId) ||
      normalizeReportAssistantMetricLabel(item.label) === normalizeReportAssistantMetricLabel(metric.label)
    );
  });
}

function getOutputFactValuePin(input: {
  metric: ReportAssistantMetric;
  snapshot?: SimpleWorkbenchAssistantTraceSnapshot;
}): number | undefined {
  return input.snapshot?.layerCombinationResolver?.valuePins?.find(
    (pin) => pin.metric === input.metric.metric || pin.metric === input.metric.outputId || pin.metric === input.metric.label
  )?.value;
}

function inferOutputFactBasisCategory(input: {
  metric: ReportAssistantMetric;
  snapshot?: SimpleWorkbenchAssistantTraceSnapshot;
}): ReportAssistantOutputFactBasisCategory {
  const { metric, snapshot } = input;
  if (metric.status === "unsupported") {
    return "unsupported";
  }
  if (metric.status === "needs_input") {
    return "needs_input";
  }
  if (metric.status === "bound") {
    return "bound";
  }

  const resolver = snapshot?.layerCombinationResolver;
  const candidateResolution = snapshot?.airborneCandidateResolution;
  const impact = snapshot?.impact;
  const impactSupport = snapshot?.impactSupport;
  const evidence = [
    metric.basis,
    resolver?.basis,
    resolver?.candidateKind,
    resolver?.supportBucket,
    candidateResolution?.selectedBasisOrigin,
    candidateResolution?.selectedOrigin,
    impact?.evidenceTier,
    impact?.impactBasis,
    impact?.selectionKind,
    impactSupport?.basis
  ].filter((entry): entry is string => typeof entry === "string").join(" ");

  if (/source[_\s-]*absent|absent[_\s-]*source/iu.test(evidence)) {
    return "source_absent_estimate";
  }
  if (/exact|measured/iu.test(evidence)) {
    return "exact_measured";
  }
  if (/published|anchor|catalog|source[_\s-]*row/iu.test(evidence)) {
    return "published_anchor";
  }
  if (FIELD_OUTPUTS.has(metric.outputId as RequestedOutputId) || metric.basis === "field") {
    return "field_adapter";
  }
  if (/formula|corridor|calibrated|estimate|family|solver/iu.test(evidence)) {
    return "formula_corridor";
  }

  return "unknown";
}

function buildOutputFactUsedInputs(input: {
  document: SimpleWorkbenchProposalDocument;
  metric: ReportAssistantMetric;
  snapshot?: SimpleWorkbenchAssistantTraceSnapshot;
}): string[] {
  const { document, metric, snapshot } = input;
  const resolver = snapshot?.layerCombinationResolver;
  const airborne = snapshot?.airborne;
  const candidateResolution = snapshot?.airborneCandidateResolution;
  const impact = snapshot?.impact;
  const impactSupport = snapshot?.impactSupport;
  const valuePinDb = getOutputFactValuePin({ metric, snapshot });
  const layerInputs = document.layers.slice(0, 4).map((layer) => {
    const details = [
      layer.roleLabel,
      layer.thicknessLabel,
      layer.densityLabel,
      layer.surfaceMassLabel
    ].filter((entry): entry is string => typeof entry === "string" && entry.length > 0);
    return `layer ${layer.index}: ${[layer.label, ...details].join(" | ")}`;
  });

  return uniqueBoundedStrings([
    resolver?.route ? `route: ${resolver.route}` : undefined,
    resolver?.selectedCandidateId ? `selected candidate: ${resolver.selectedCandidateId}` : undefined,
    candidateResolution?.selectedOrigin ? `selected origin: ${candidateResolution.selectedOrigin}` : undefined,
    resolver?.supportBucket ? `support bucket: ${resolver.supportBucket}` : undefined,
    valuePinDb !== undefined ? `value pin: ${metric.metric} ${valuePinDb} dB` : undefined,
    formatBoundedList("resolver required inputs", resolver?.requiredInputs),
    isImpactOutput(metric.outputId) ? (impact?.selectedLabel ? `impact lane: ${impact.selectedLabel}` : undefined) : undefined,
    isImpactOutput(metric.outputId)
      ? (impact?.supportFamilyLabel ?? impact?.supportFamily
          ? `impact support family: ${impact.supportFamilyLabel ?? impact.supportFamily}`
          : undefined)
      : undefined,
    isImpactOutput(metric.outputId) ? formatBoundedList("impact sources", impact?.selectedSourceLabels) : undefined,
    isImpactOutput(metric.outputId) && impactSupport?.referenceFloorType
      ? `reference floor: ${impactSupport.referenceFloorType}`
      : undefined,
    !isImpactOutput(metric.outputId) && airborne?.selectedLabel ? `airborne lane: ${airborne.selectedLabel}` : undefined,
    !isImpactOutput(metric.outputId) && airborne?.selectedMethod ? `airborne method: ${airborne.selectedMethod}` : undefined,
    !isImpactOutput(metric.outputId) && (airborne?.detectedFamilyLabel ?? airborne?.detectedFamily)
      ? `airborne family: ${airborne.detectedFamilyLabel ?? airborne.detectedFamily}`
      : undefined,
    ...layerInputs
  ]);
}

function buildOutputFactMissingInputs(input: {
  metric: ReportAssistantMetric;
  snapshot?: SimpleWorkbenchAssistantTraceSnapshot;
  traceSummary: ReportAssistantTraceSummary;
}): string[] {
  const resolver = input.snapshot?.layerCombinationResolver;
  return uniqueBoundedStrings([
    ...input.traceSummary.missingPhysicalInputs,
    ...(input.metric.status === "needs_input" ? resolver?.requiredInputs ?? [] : [])
  ]);
}

function buildOutputFactParkedReason(input: {
  coverageItem?: SimpleWorkbenchProposalCoverageItem;
  metric: ReportAssistantMetric;
  snapshot?: SimpleWorkbenchAssistantTraceSnapshot;
  traceSummary: ReportAssistantTraceSummary;
}): string | undefined {
  const { coverageItem, metric, snapshot, traceSummary } = input;
  if (metric.status === "needs_input") {
    return coverageItem?.nextStep ?? "Needs additional inputs before this output can be published.";
  }
  if (metric.status === "unsupported") {
    return coverageItem?.nextStep ?? coverageItem?.detail ?? "Unsupported for the selected assembly and study context.";
  }
  if (metric.outputId && traceSummary.unsupportedOutputs.includes(metric.outputId)) {
    return "Parked by the engine unsupported output set for this layer combination.";
  }
  if (
    metric.outputId &&
    snapshot?.layerCombinationResolver?.supportedMetrics &&
    !snapshot.layerCombinationResolver.supportedMetrics.includes(metric.outputId)
  ) {
    return "Not included in the selected layer resolver supported metric set.";
  }
  if (metric.status === "bound") {
    return coverageItem?.postureDetail ?? "Published as a bound or guarded report value.";
  }

  return undefined;
}

function buildReportAssistantOutputFacts(input: {
  document: SimpleWorkbenchProposalDocument;
  metrics: readonly ReportAssistantMetric[];
  snapshot?: SimpleWorkbenchAssistantTraceSnapshot;
  traceSummary: ReportAssistantTraceSummary;
}): ReportAssistantOutputFact[] {
  const { document, metrics, snapshot, traceSummary } = input;
  const resolver = snapshot?.layerCombinationResolver;
  const impactSupport = snapshot?.impactSupport;
  const impact = snapshot?.impact;
  const supportNote =
    impactSupport?.formulaNotes?.[0] ??
    impactSupport?.notes?.[0] ??
    impact?.notes?.[0] ??
    resolver?.surfaceDetail;

  return metrics.map((metric) => {
    const coverageItem = getMetricCoverageItem({ document, metric });

    return {
      basis: metric.basis,
      basisCategory: inferOutputFactBasisCategory({
        metric,
        snapshot
      }),
      engineDisplayValue: metric.engineDisplayValue,
      formulaOrSupportNote: supportNote,
      label: metric.label,
      metricId: metric.id,
      missingInputs: buildOutputFactMissingInputs({
        metric,
        snapshot,
        traceSummary
      }),
      outputId: metric.outputId,
      parkedReason: buildOutputFactParkedReason({
        coverageItem,
        metric,
        snapshot,
        traceSummary
      }),
      reportDisplayValue: metric.reportDisplayValue,
      selectedCandidateId: resolver?.selectedCandidateId ?? snapshot?.airborneCandidateResolution?.selectedCandidateId,
      status: metric.status,
      supportBucket: resolver?.supportBucket,
      usedInputs: buildOutputFactUsedInputs({
        document,
        metric,
        snapshot
      }),
      valuePinDb: getOutputFactValuePin({
        metric,
        snapshot
      }),
      warnings: uniqueBoundedStrings([
        ...traceSummary.warnings,
        ...document.warnings
      ], 6)
    };
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

  const assistantTraceSnapshot =
    document.assistantTraceSnapshot ?? buildSimpleWorkbenchAssistantTraceSnapshot(input.result);
  const traceSummary = buildReportAssistantTraceSummary({
    document,
    result: input.result
  });
  const metrics = [...metricsById.values()];

  return {
    assistantContextSignature: createReportAssistantContextSignature({
      assistantTraceSnapshot,
      document
    }),
    assistantOutputFacts: buildReportAssistantOutputFacts({
      document,
      metrics,
      snapshot: assistantTraceSnapshot,
      traceSummary
    }),
    assistantTraceSnapshot,
    createdAtIso: input.createdAtIso ?? new Date().toISOString(),
    documentSignature: createReportAssistantDocumentSignature(document),
    layersSummary: summarizeLayers(document),
    metrics,
    projectId: document.serverProjectId,
    reportId: input.reportId ?? document.proposalReference,
    scenarioId: document.serverProjectScenarioId,
    traceSummary,
    warnings: document.warnings
  };
}

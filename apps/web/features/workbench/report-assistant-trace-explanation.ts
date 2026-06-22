import type {
  ReportAssistantContext,
  ReportAssistantMetric,
  ReportAssistantOutputFact
} from "./report-assistant-context";

const IMPACT_OUTPUT_IDS = new Set<string>([
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

function normalizeTraceToken(value: string): string {
  return value.replace(/_/gu, " ").replace(/\s+/gu, " ").trim();
}

function formatTraceList(values: readonly string[] | undefined, maxItems = 4): string | undefined {
  if (!values || values.length === 0) {
    return undefined;
  }

  const visible = values.slice(0, maxItems);
  const hiddenCount = values.length - visible.length;
  return `${visible.map(normalizeTraceToken).join(", ")}${hiddenCount > 0 ? `, +${hiddenCount} more` : ""}`;
}

function formatPhysicalInputTraceList(values: readonly string[] | undefined, maxItems = 4): string | undefined {
  // AGENT COORDINATION 2026-06-22: Human-facing trace copy only; raw ids remain on trace objects.
  if (!values || values.length === 0) {
    return undefined;
  }

  const visible = values.slice(0, maxItems);
  const hiddenCount = values.length - visible.length;
  return `${visible.map(formatPhysicalInputTraceToken).join(", ")}${hiddenCount > 0 ? `, +${hiddenCount} more` : ""}`;
}

function formatPhysicalInputTraceToken(value: string): string {
  const normalized = value.toLowerCase().replace(/[^a-z0-9]/gu, "");

  if (normalized.includes("flooraream2")) return "floor area";
  if (normalized.includes("partitionaream2")) return "partition width and height";
  if (normalized.includes("receivingroomvolumem3")) return "receiving-room volume";
  if (normalized.includes("receivingroomrt60s")) return "receiving-room RT60";
  if (normalized.includes("loadbasiskgm2")) return "load basis";
  if (normalized.includes("resilientlayerdynamicstiffnessmnm3")) return "dynamic stiffness";
  if (normalized === "impactfieldcontext") return "impact field context";
  if (normalized.includes("fieldkdb")) return "K correction";
  if (normalized.includes("ci502500db")) return "CI,50-2500";
  if (normalized.includes("cidb")) return "CI";
  if (normalized.includes("flowresistivitypasm2")) return "flow resistivity";
  if (normalized.includes("surfacemasskgm2")) return "leaf surface mass";
  if (normalized.includes("cavity1depthmm")) return "first cavity depth";
  if (normalized.includes("sidealeafgroup")) return "side A leaf group";
  if (normalized.includes("sidebleafgroup")) return "side B leaf group";
  if (normalized.includes("supportspacingmm") || normalized.includes("studspacingmm")) return "support spacing";
  if (normalized.includes("resilientbarsidecount")) return "resilient bar side count";

  return normalizeTraceToken(value).replace(/\b\w/gu, (match) => match.toUpperCase());
}

function formatTraceNumber(value: number | undefined, suffix: string): string | undefined {
  return typeof value === "number" && Number.isFinite(value) ? `${value}${suffix}` : undefined;
}

function pushUniqueLine(lines: string[], line: string | undefined) {
  const normalized = line?.trim();
  if (!normalized || lines.includes(normalized)) {
    return;
  }

  lines.push(normalized);
}

function joinTraceParts(parts: readonly (string | undefined)[]): string {
  return parts.filter((part): part is string => typeof part === "string" && part.trim().length > 0).join("; ");
}

function getOutputFact(input: {
  context: ReportAssistantContext;
  metric?: ReportAssistantMetric;
}): ReportAssistantOutputFact | undefined {
  if (!input.metric) {
    return undefined;
  }

  return input.context.assistantOutputFacts.find(
    (fact) =>
      fact.metricId === input.metric?.id ||
      (fact.outputId && fact.outputId === input.metric?.outputId) ||
      normalizeTraceToken(fact.label).toLowerCase() === normalizeTraceToken(input.metric?.label ?? "").toLowerCase()
  );
}

function isImpactMetric(metric: ReportAssistantMetric | undefined): boolean {
  return typeof metric?.outputId === "string" && IMPACT_OUTPUT_IDS.has(metric.outputId);
}

function buildRouteLine(input: {
  context: ReportAssistantContext;
}): string | undefined {
  const snapshot = input.context.assistantTraceSnapshot;
  const candidateResolution = snapshot?.airborneCandidateResolution;
  const resolver = snapshot?.layerCombinationResolver;
  const route = resolver?.route ?? input.context.traceSummary.route;
  const basis = resolver?.basis ?? input.context.traceSummary.basis;
  const candidateId =
    resolver?.selectedCandidateId ??
    candidateResolution?.selectedCandidateId ??
    input.context.traceSummary.selectedCandidateId;
  const origin =
    candidateResolution?.selectedOrigin ??
    candidateResolution?.selectedBasisOrigin ??
    input.context.traceSummary.selectedOrigin;
  const detail = joinTraceParts([
    route ? `route ${normalizeTraceToken(route)}` : undefined,
    basis ? `basis ${normalizeTraceToken(basis)}` : undefined,
    candidateId ? `selected candidate ${candidateId}` : undefined,
    origin ? `origin ${normalizeTraceToken(origin)}` : undefined
  ]);

  return detail.length > 0 ? `Engine route: ${detail}.` : undefined;
}

function buildAirborneLine(input: {
  context: ReportAssistantContext;
}): string | undefined {
  const airborne = input.context.assistantTraceSnapshot?.airborne;
  const selectedCandidate = airborne?.candidateMethods?.find((candidate) => candidate.selected === true);
  const label = airborne?.selectedLabel ?? selectedCandidate?.label;
  const method = airborne?.selectedMethod ?? selectedCandidate?.method;
  const family = airborne?.detectedFamilyLabel ?? airborne?.detectedFamily ?? input.context.traceSummary.dynamicAirborneFamily;
  const detail = joinTraceParts([
    label ? `lane ${label}` : undefined,
    method ? `method ${method}` : undefined,
    family ? `family ${normalizeTraceToken(family)}` : undefined,
    airborne?.confidenceClass ? `confidence ${normalizeTraceToken(airborne.confidenceClass)}` : undefined,
    formatTraceNumber(airborne?.solverSpreadRwDb, " dB solver spread")
  ]);

  return detail.length > 0 ? `Airborne calculation: ${detail}.` : undefined;
}

function buildImpactLine(input: {
  context: ReportAssistantContext;
}): string | undefined {
  const impact = input.context.assistantTraceSnapshot?.impact;
  const basis = impact?.impactBasisLabel ?? impact?.impactBasis;
  const supportFamily = impact?.supportFamilyLabel ?? impact?.supportFamily;
  const evidenceTier = impact?.evidenceTierLabel ?? impact?.evidenceTier;
  const fieldContinuation = impact?.fieldContinuationLabel ?? impact?.fieldContinuation;
  const detail = joinTraceParts([
    impact?.selectedLabel ? `lane ${impact.selectedLabel}` : undefined,
    basis ? `basis ${normalizeTraceToken(basis)}` : undefined,
    supportFamily ? `support ${normalizeTraceToken(supportFamily)}` : undefined,
    evidenceTier ? `evidence ${normalizeTraceToken(evidenceTier)}` : undefined,
    fieldContinuation ? `field continuation ${normalizeTraceToken(fieldContinuation)}` : undefined,
    formatTraceNumber(impact?.fitPercent, "% fit")
  ]);

  return detail.length > 0 ? `Impact calculation: ${detail}.` : undefined;
}

function buildImpactSupportLine(input: {
  context: ReportAssistantContext;
}): string | undefined {
  const support = input.context.assistantTraceSnapshot?.impactSupport;
  const formulaNote = support?.formulaNotes?.[0] ?? support?.notes?.[0];
  const detail = joinTraceParts([
    support?.basis ? `basis ${normalizeTraceToken(support.basis)}` : undefined,
    support?.labOrField ? `side ${normalizeTraceToken(support.labOrField)}` : undefined,
    support?.referenceFloorType ? `reference floor ${support.referenceFloorType}` : undefined,
    support?.primaryCurveType ? `primary curve ${normalizeTraceToken(support.primaryCurveType)}` : undefined,
    support?.primaryCurveUnaffected === true ? "primary curve unaffected" : undefined,
    formulaNote
  ]);

  return detail.length > 0 ? `Impact formula/support: ${detail}.` : undefined;
}

function buildResolverLine(input: {
  context: ReportAssistantContext;
  metric?: ReportAssistantMetric;
}): string | undefined {
  const resolver = input.context.assistantTraceSnapshot?.layerCombinationResolver;
  if (!resolver) {
    return undefined;
  }

  const metricPin = input.metric
    ? resolver.valuePins?.find((pin) => pin.metric === input.metric?.metric || pin.metric === input.metric?.outputId)
    : undefined;
  const detail = joinTraceParts([
    resolver.surfaceLabel ? `surface ${resolver.surfaceLabel}` : undefined,
    resolver.surfaceDetail,
    resolver.candidateKind ? `candidate kind ${normalizeTraceToken(resolver.candidateKind)}` : undefined,
    resolver.supportBucket ? `support bucket ${normalizeTraceToken(resolver.supportBucket)}` : undefined,
    resolver.supportedMetrics ? `supported ${formatTraceList(resolver.supportedMetrics)}` : undefined,
    resolver.requiredInputs ? `required inputs ${formatPhysicalInputTraceList(resolver.requiredInputs)}` : undefined,
    metricPin ? `value pin ${metricPin.metric} ${metricPin.value} dB` : undefined
  ]);

  return detail.length > 0 ? `Layer resolver: ${detail}.` : undefined;
}

function buildOutputFactLine(input: {
  fact?: ReportAssistantOutputFact;
}): string | undefined {
  const { fact } = input;
  if (!fact) {
    return undefined;
  }

  const usedInputs = formatTraceList(fact.usedInputs, 3);
  const missingInputs = formatPhysicalInputTraceList(fact.missingInputs, 3);
  const detail = joinTraceParts([
    `basis category ${normalizeTraceToken(fact.basisCategory)}`,
    fact.status !== "live" ? `status ${normalizeTraceToken(fact.status)}` : undefined,
    fact.selectedCandidateId ? `selected candidate ${fact.selectedCandidateId}` : undefined,
    fact.supportBucket ? `support bucket ${normalizeTraceToken(fact.supportBucket)}` : undefined,
    typeof fact.valuePinDb === "number" ? `value pin ${fact.valuePinDb} dB` : undefined,
    usedInputs ? `used inputs ${usedInputs}` : undefined,
    missingInputs ? `missing inputs ${missingInputs}` : undefined,
    fact.parkedReason ? `parked reason ${fact.parkedReason}` : undefined,
    fact.formulaOrSupportNote ? `support note ${fact.formulaOrSupportNote}` : undefined
  ]);

  return detail.length > 0 ? `Output fact ${fact.label}: ${detail}.` : undefined;
}

function getBasisCategoryMeaning(fact: ReportAssistantOutputFact): string {
  switch (fact.basisCategory) {
    case "published_anchor":
      return "published/source anchor selected, so the report value is tied to a known source row or catalog-like reference.";
    case "formula_corridor":
      return "formula corridor selected, so the report value comes from the selected family/support calculation corridor rather than a direct catalog anchor.";
    case "exact_measured":
      return "exact measured assembly selected, so the report value is anchored to a matching measured candidate.";
    case "bound":
      return "bound output selected, so the report value is a guarded published bound instead of a fully live calculated value.";
    case "field_adapter":
      return "field adapter selected, so the output uses the selected assembly result with building/field continuation logic.";
    case "needs_input":
      return "needs input, so the engine parked this output until required physical inputs are available.";
    case "unsupported":
      return "unsupported, so the selected assembly/context does not currently publish this output.";
    case "source_absent_estimate":
      return "source absent estimate, so the value is an estimate made without a direct comparable source anchor.";
    case "unknown":
      return "basis category is unknown, so the assistant can only report the available context without stronger provenance.";
  }
}

function buildBasisCategoryLine(input: {
  fact?: ReportAssistantOutputFact;
}): string | undefined {
  return input.fact
    ? `Basis category ${input.fact.basisCategory}: ${getBasisCategoryMeaning(input.fact)}`
    : undefined;
}

function formatReportAndEngineValue(fact: ReportAssistantOutputFact): string {
  return [
    `report ${fact.reportDisplayValue}`,
    fact.engineDisplayValue ? `engine ${fact.engineDisplayValue}` : undefined,
    typeof fact.valuePinDb === "number" ? `value pin ${fact.valuePinDb} dB` : undefined
  ].filter((entry): entry is string => typeof entry === "string").join(", ");
}

function buildMetricIntermediateLogicLine(input: {
  fact?: ReportAssistantOutputFact;
  metric?: ReportAssistantMetric;
}): string | undefined {
  const { fact, metric } = input;
  if (!fact || !metric) {
    return undefined;
  }

  const valueText = formatReportAndEngineValue(fact);
  const support = joinTraceParts([
    fact.selectedCandidateId ? `candidate ${fact.selectedCandidateId}` : undefined,
    fact.supportBucket ? `support ${normalizeTraceToken(fact.supportBucket)}` : undefined
  ]);

  if (metric.outputId === "Rw") {
    return `Rw intermediate logic: airborne lane/candidate selection feeds the weighted sound reduction value; ${support}; ${valueText}.`;
  }

  if (metric.outputId === "Ln,w") {
    return `Ln,w intermediate logic: impact lane/support selection feeds the normalized impact level; lower values are better; ${support}; ${valueText}.`;
  }

  if (metric.outputId === "DeltaLw") {
    return `DeltaLw intermediate logic: selected impact support estimates the floor covering improvement before it is reported as DeltaLw; higher improvement values are better; ${support}; ${valueText}.`;
  }

  if (metric.outputId === "Ln,w+CI") {
    const parked = fact.parkedReason ? ` Parked reason: ${fact.parkedReason}` : "";
    return `Ln,w+CI intermediate logic: this combined output needs the normalized impact level plus CI adaptation evidence before publication; ${support}; ${valueText}.${parked}`;
  }

  if (isImpactMetric(metric)) {
    return `${metric.outputId ?? metric.label} intermediate logic: impact/field support selection feeds this ${normalizeTraceToken(metric.direction)} output; ${support}; ${valueText}.`;
  }

  return `${metric.label} intermediate logic: selected candidate and basis feed the report value; ${support}; ${valueText}.`;
}

function buildInputCoverageLine(input: {
  fact?: ReportAssistantOutputFact;
}): string | undefined {
  const { fact } = input;
  if (!fact) {
    return undefined;
  }

  const usedInputs = formatTraceList(fact.usedInputs, 5);
  const missingInputs = formatPhysicalInputTraceList(fact.missingInputs, 5);
  const detail = joinTraceParts([
    usedInputs ? `used ${usedInputs}` : undefined,
    missingInputs ? `missing ${missingInputs}` : undefined
  ]);

  return detail.length > 0 ? `Input coverage ${fact.label}: ${detail}.` : undefined;
}

function buildParkedOutputLines(input: {
  context: ReportAssistantContext;
  metric?: ReportAssistantMetric;
}): string[] {
  const facts = input.context.assistantOutputFacts.filter((fact) => {
    if (input.metric) {
      return fact.metricId === input.metric.id && (fact.parkedReason || fact.status !== "live");
    }

    return fact.parkedReason || fact.status === "needs_input" || fact.status === "unsupported";
  });

  return facts.slice(0, 4).map((fact) => {
    const reason = fact.parkedReason ?? `${normalizeTraceToken(fact.status)} output`;
    return `Parked output ${fact.label}: ${reason}`;
  });
}

export function buildReportAssistantTraceExplanationLines(input: {
  context: ReportAssistantContext;
  maxLines?: number;
  metric?: ReportAssistantMetric;
}): string[] {
  const lines: string[] = [];
  const maxLines = input.maxLines ?? 9;
  const impactMetric = isImpactMetric(input.metric);
  const outputFact = getOutputFact(input);

  pushUniqueLine(lines, buildRouteLine(input));
  pushUniqueLine(lines, buildOutputFactLine({ fact: outputFact }));
  pushUniqueLine(lines, buildBasisCategoryLine({ fact: outputFact }));
  pushUniqueLine(lines, buildMetricIntermediateLogicLine({
    fact: outputFact,
    metric: input.metric
  }));
  pushUniqueLine(lines, buildInputCoverageLine({ fact: outputFact }));
  if (impactMetric) {
    pushUniqueLine(lines, buildImpactLine(input));
    pushUniqueLine(lines, buildImpactSupportLine(input));
  } else {
    pushUniqueLine(lines, buildAirborneLine(input));
  }
  pushUniqueLine(lines, buildResolverLine(input));
  buildParkedOutputLines({
    context: input.context,
    metric: input.metric
  }).forEach((line) => pushUniqueLine(lines, line));

  return lines.slice(0, maxLines);
}

export function appendReportAssistantTraceExplanation(input: {
  answerText: string;
  lines: readonly string[];
}): string {
  if (input.lines.length === 0) {
    return input.answerText;
  }

  return [
    input.answerText,
    `Engine trace:\n${input.lines.map((line) => `- ${line}`).join("\n")}`
  ].join("\n\n");
}

function formatMetricContextLine(metric: ReportAssistantMetric, fact?: ReportAssistantOutputFact): string {
  return [
    `${metric.label}: report ${metric.reportDisplayValue}`,
    metric.engineDisplayValue ? `engine ${metric.engineDisplayValue}` : undefined,
    `status ${normalizeTraceToken(metric.status)}`,
    `basis ${normalizeTraceToken(metric.basis)}`,
    fact ? `basis category ${normalizeTraceToken(fact.basisCategory)}` : undefined,
    `direction ${normalizeTraceToken(metric.direction)}`,
    fact?.parkedReason ? `parked ${fact.parkedReason}` : undefined
  ].filter((part): part is string => typeof part === "string").join("; ");
}

export function buildReportAssistantContextTraceAnswer(input: {
  context: ReportAssistantContext;
  instruction?: string;
  metric?: ReportAssistantMetric;
}): {
  detail: string;
  metricId?: string;
  summary: string;
} {
  const factByMetricId = new Map(input.context.assistantOutputFacts.map((fact) => [fact.metricId, fact]));
  const metricLines = input.metric
    ? [formatMetricContextLine(input.metric, factByMetricId.get(input.metric.id))]
    : input.context.metrics.slice(0, 5).map((metric) => formatMetricContextLine(metric, factByMetricId.get(metric.id)));
  const traceLines = buildReportAssistantTraceExplanationLines({
    context: input.context,
    maxLines: input.metric ? 9 : 6,
    metric: input.metric
  });
  const parkedOutputLines = input.metric
    ? []
    : buildParkedOutputLines({
        context: input.context
      });
  const warningLines = [...input.context.traceSummary.warnings, ...input.context.warnings].slice(0, 4);
  const layers = input.context.layersSummary.slice(0, 5);
  const lines: string[] = [
    input.metric
      ? `Current report context for ${input.metric.label}:`
      : "Current report context:",
    ...metricLines.map((line) => `- ${line}`)
  ];

  if (traceLines.length > 0) {
    lines.push("", "Engine trace:", ...traceLines.map((line) => `- ${line}`));
  }

  if (parkedOutputLines.length > 0) {
    lines.push("", "Parked outputs:", ...parkedOutputLines.map((line) => `- ${line}`));
  }

  if (layers.length > 0) {
    lines.push("", "Layer combination:", ...layers.map((line) => `- ${line}`));
  }

  if (warningLines.length > 0) {
    lines.push("", "Warnings:", ...warningLines.map((line) => `- ${line}`));
  }

  lines.push("", "No report value was changed.");

  return {
    detail: lines.join("\n"),
    metricId: input.metric?.id,
    summary: input.metric
      ? `${input.metric.label}: engine trace context`
      : "Engine trace context"
  };
}

import type {
  AssemblyCalculation,
  ImpactOnlyCalculation,
  LayerCombinationResolverTrace
} from "@dynecho/shared";

export function getLayerCombinationResolverCandidateSurface(
  result: AssemblyCalculation | ImpactOnlyCalculation | null | undefined
): LayerCombinationResolverTrace | null {
  return result?.layerCombinationResolverTrace ?? null;
}

function formatList(values: readonly string[]): string {
  return values.length > 0 ? values.join(", ") : "none";
}

function formatPins(trace: LayerCombinationResolverTrace): string {
  return trace.valuePins.length > 0
    ? trace.valuePins.map((pin) => `${pin.metric} ${pin.value}`).join(", ")
    : "none";
}

export function getLayerCombinationResolverCandidateReportLines(
  result: AssemblyCalculation | null | undefined
): string[] {
  const trace = getLayerCombinationResolverCandidateSurface(result);

  if (!trace) {
    return [];
  }

  return [
    `- Resolver candidate id: ${trace.selectedCandidateId}`,
    `- Resolver candidate label: ${trace.surfaceLabel}`,
    `- Resolver candidate kind: ${trace.candidateKind}`,
    `- Resolver support bucket: ${trace.supportBucket}`,
    `- Resolver route / basis: ${trace.route} / ${trace.requestedBasis}`,
    `- Resolver runtime basis: ${trace.runtimeBasisId ?? "none"}`,
    `- Resolver supported metrics: ${formatList(trace.supportedMetrics)}`,
    `- Resolver error-budget metrics: ${formatList(trace.errorBudgetMetrics)}`,
    `- Resolver value pins: ${formatPins(trace)}`,
    `- Resolver boundary candidates: ${formatList(trace.boundaryCandidateIds)}`,
    `- Resolver rejected candidates: ${trace.rejectedCandidateIds.length}`,
    `- Resolver detail: ${trace.surfaceDetail}`
  ];
}

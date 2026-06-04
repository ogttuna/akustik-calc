import type { AssemblyCalculation } from "@dynecho/shared";

export type SimpleWorkbenchAssistantTraceSnapshot = {
  airborne?: {
    candidateMethods?: readonly {
      label: string;
      method?: string;
      rwDb?: number;
      selected?: boolean;
    }[];
    confidenceClass?: string;
    confidenceScore?: number;
    detectedFamily?: string;
    detectedFamilyLabel?: string;
    notes?: readonly string[];
    selectedLabel?: string;
    selectedMethod?: string;
    solverSpreadRwDb?: number;
    strategy?: string;
  };
  airborneCandidateResolution?: {
    candidateSummaries?: readonly {
      id: string;
      metricIds?: readonly string[];
      origin?: string;
      outputIds?: readonly string[];
      rejectionCodes?: readonly string[];
      selected?: boolean;
    }[];
    rejectedCandidateIds?: readonly string[];
    runtimeValueMovement?: boolean;
    selectedBasisOrigin?: string;
    selectedCandidateId?: string;
    selectedOrigin?: string;
  };
  impact?: {
    availableMetricLabels?: readonly string[];
    candidateRowCount?: number;
    confidenceClass?: string;
    confidenceScore?: number;
    evidenceTier?: string;
    evidenceTierLabel?: string;
    fieldContinuation?: string;
    fieldContinuationLabel?: string;
    fitPercent?: number;
    impactBasis?: string;
    impactBasisLabel?: string;
    notes?: readonly string[];
    selectedLabel?: string;
    selectedSourceIds?: readonly string[];
    selectedSourceLabels?: readonly string[];
    selectionKind?: string;
    selectionKindLabel?: string;
    supportFamily?: string;
    supportFamilyLabel?: string;
    systemType?: string;
    systemTypeLabel?: string;
  };
  impactSupport?: {
    basis?: string;
    formulaNotes?: readonly string[];
    labOrField?: string;
    notes?: readonly string[];
    primaryCurveType?: string;
    primaryCurveUnaffected?: boolean;
    referenceFloorType?: string;
  };
  layerCombinationResolver?: {
    basis?: string;
    boundaryCandidateIds?: readonly string[];
    candidateKind?: string;
    errorBudgetMetrics?: readonly string[];
    rejectedCandidateIds?: readonly string[];
    requestedBasis?: string;
    requiredInputs?: readonly string[];
    route?: string;
    runtimeBasisId?: string;
    selectedCandidateId?: string;
    supportBucket?: string;
    supportedMetrics?: readonly string[];
    surfaceDetail?: string;
    surfaceLabel?: string;
    valuePins?: readonly {
      metric: string;
      value: number;
    }[];
  };
};

type SnapshotRecord = Record<string, unknown>;

type AirborneCandidateSnapshotInput = {
  id: string;
  metricIds: readonly string[];
  origin: string;
  outputIds: readonly string[];
  rejectionReasons: readonly {
    code: string;
  }[];
  selected: boolean;
};

const MAX_ITEMS = 8;
const MAX_NOTES = 6;
const MAX_TEXT_LENGTH = 240;

function isObjectRecord(value: unknown): value is SnapshotRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeString(value: unknown, maxLength = MAX_TEXT_LENGTH): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return undefined;
  }

  return trimmed.length > maxLength ? trimmed.slice(0, maxLength) : trimmed;
}

function normalizeNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function normalizeBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function normalizeStringArray(value: unknown, maxItems = MAX_ITEMS): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const out = value
    .map((entry) => normalizeString(entry))
    .filter((entry): entry is string => entry !== undefined)
    .slice(0, maxItems);

  return out.length > 0 ? out : undefined;
}

function compactRecord<T extends SnapshotRecord>(record: T): T | undefined {
  const out: SnapshotRecord = {};

  for (const [key, value] of Object.entries(record)) {
    if (value === undefined) {
      continue;
    }

    if (Array.isArray(value) && value.length === 0) {
      continue;
    }

    out[key] = value;
  }

  return Object.keys(out).length > 0 ? (out as T) : undefined;
}

function normalizeCandidateMethod(value: unknown) {
  if (!isObjectRecord(value)) {
    return undefined;
  }

  const label = normalizeString(value.label);
  if (!label) {
    return undefined;
  }

  return compactRecord({
    label,
    method: normalizeString(value.method),
    rwDb: normalizeNumber(value.rwDb),
    selected: normalizeBoolean(value.selected)
  });
}

function normalizeCandidateSummary(value: unknown) {
  if (!isObjectRecord(value)) {
    return undefined;
  }

  const id = normalizeString(value.id);
  if (!id) {
    return undefined;
  }

  return compactRecord({
    id,
    metricIds: normalizeStringArray(value.metricIds, 6),
    origin: normalizeString(value.origin),
    outputIds: normalizeStringArray(value.outputIds, 6),
    rejectionCodes: normalizeStringArray(value.rejectionCodes, 6),
    selected: normalizeBoolean(value.selected)
  });
}

function normalizeValuePin(value: unknown) {
  if (!isObjectRecord(value)) {
    return undefined;
  }

  const metric = normalizeString(value.metric);
  const pinValue = normalizeNumber(value.value);
  if (!metric || pinValue === undefined) {
    return undefined;
  }

  return {
    metric,
    value: pinValue
  };
}

function normalizeArray<T>(
  value: unknown,
  normalizer: (entry: unknown) => T | undefined,
  maxItems = MAX_ITEMS
): T[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const out = value
    .map((entry) => normalizer(entry))
    .filter((entry): entry is T => entry !== undefined)
    .slice(0, maxItems);

  return out.length > 0 ? out : undefined;
}

function normalizeAirborneSnapshot(value: unknown): SimpleWorkbenchAssistantTraceSnapshot["airborne"] | undefined {
  if (!isObjectRecord(value)) {
    return undefined;
  }

  return compactRecord({
    candidateMethods: normalizeArray(value.candidateMethods, normalizeCandidateMethod, 6),
    confidenceClass: normalizeString(value.confidenceClass),
    confidenceScore: normalizeNumber(value.confidenceScore),
    detectedFamily: normalizeString(value.detectedFamily),
    detectedFamilyLabel: normalizeString(value.detectedFamilyLabel),
    notes: normalizeStringArray(value.notes, MAX_NOTES),
    selectedLabel: normalizeString(value.selectedLabel),
    selectedMethod: normalizeString(value.selectedMethod),
    solverSpreadRwDb: normalizeNumber(value.solverSpreadRwDb),
    strategy: normalizeString(value.strategy)
  });
}

function normalizeAirborneCandidateResolutionSnapshot(
  value: unknown
): SimpleWorkbenchAssistantTraceSnapshot["airborneCandidateResolution"] | undefined {
  if (!isObjectRecord(value)) {
    return undefined;
  }

  return compactRecord({
    candidateSummaries: normalizeArray(value.candidateSummaries, normalizeCandidateSummary, 6),
    rejectedCandidateIds: normalizeStringArray(value.rejectedCandidateIds, MAX_ITEMS),
    runtimeValueMovement: normalizeBoolean(value.runtimeValueMovement),
    selectedBasisOrigin: normalizeString(value.selectedBasisOrigin),
    selectedCandidateId: normalizeString(value.selectedCandidateId),
    selectedOrigin: normalizeString(value.selectedOrigin)
  });
}

function normalizeImpactSnapshot(value: unknown): SimpleWorkbenchAssistantTraceSnapshot["impact"] | undefined {
  if (!isObjectRecord(value)) {
    return undefined;
  }

  return compactRecord({
    availableMetricLabels: normalizeStringArray(value.availableMetricLabels, MAX_ITEMS),
    candidateRowCount: normalizeNumber(value.candidateRowCount),
    confidenceClass: normalizeString(value.confidenceClass),
    confidenceScore: normalizeNumber(value.confidenceScore),
    evidenceTier: normalizeString(value.evidenceTier),
    evidenceTierLabel: normalizeString(value.evidenceTierLabel),
    fieldContinuation: normalizeString(value.fieldContinuation),
    fieldContinuationLabel: normalizeString(value.fieldContinuationLabel),
    fitPercent: normalizeNumber(value.fitPercent),
    impactBasis: normalizeString(value.impactBasis),
    impactBasisLabel: normalizeString(value.impactBasisLabel),
    notes: normalizeStringArray(value.notes, MAX_NOTES),
    selectedLabel: normalizeString(value.selectedLabel),
    selectedSourceIds: normalizeStringArray(value.selectedSourceIds, MAX_ITEMS),
    selectedSourceLabels: normalizeStringArray(value.selectedSourceLabels, MAX_ITEMS),
    selectionKind: normalizeString(value.selectionKind),
    selectionKindLabel: normalizeString(value.selectionKindLabel),
    supportFamily: normalizeString(value.supportFamily),
    supportFamilyLabel: normalizeString(value.supportFamilyLabel),
    systemType: normalizeString(value.systemType),
    systemTypeLabel: normalizeString(value.systemTypeLabel)
  });
}

function normalizeImpactSupportSnapshot(value: unknown): SimpleWorkbenchAssistantTraceSnapshot["impactSupport"] | undefined {
  if (!isObjectRecord(value)) {
    return undefined;
  }

  return compactRecord({
    basis: normalizeString(value.basis),
    formulaNotes: normalizeStringArray(value.formulaNotes, MAX_NOTES),
    labOrField: normalizeString(value.labOrField),
    notes: normalizeStringArray(value.notes, MAX_NOTES),
    primaryCurveType: normalizeString(value.primaryCurveType),
    primaryCurveUnaffected: normalizeBoolean(value.primaryCurveUnaffected),
    referenceFloorType: normalizeString(value.referenceFloorType)
  });
}

function normalizeLayerCombinationResolverSnapshot(
  value: unknown
): SimpleWorkbenchAssistantTraceSnapshot["layerCombinationResolver"] | undefined {
  if (!isObjectRecord(value)) {
    return undefined;
  }

  return compactRecord({
    basis: normalizeString(value.basis),
    boundaryCandidateIds: normalizeStringArray(value.boundaryCandidateIds, MAX_ITEMS),
    candidateKind: normalizeString(value.candidateKind),
    errorBudgetMetrics: normalizeStringArray(value.errorBudgetMetrics, MAX_ITEMS),
    rejectedCandidateIds: normalizeStringArray(value.rejectedCandidateIds, MAX_ITEMS),
    requestedBasis: normalizeString(value.requestedBasis),
    requiredInputs: normalizeStringArray(value.requiredInputs, MAX_ITEMS),
    route: normalizeString(value.route),
    runtimeBasisId: normalizeString(value.runtimeBasisId),
    selectedCandidateId: normalizeString(value.selectedCandidateId),
    supportBucket: normalizeString(value.supportBucket),
    supportedMetrics: normalizeStringArray(value.supportedMetrics, MAX_ITEMS),
    surfaceDetail: normalizeString(value.surfaceDetail, 360),
    surfaceLabel: normalizeString(value.surfaceLabel),
    valuePins: normalizeArray(value.valuePins, normalizeValuePin, MAX_ITEMS)
  });
}

export function parseSimpleWorkbenchAssistantTraceSnapshot(
  value: unknown
): SimpleWorkbenchAssistantTraceSnapshot | undefined {
  if (!isObjectRecord(value)) {
    return undefined;
  }

  return compactRecord({
    airborne: normalizeAirborneSnapshot(value.airborne),
    airborneCandidateResolution: normalizeAirborneCandidateResolutionSnapshot(value.airborneCandidateResolution),
    impact: normalizeImpactSnapshot(value.impact),
    impactSupport: normalizeImpactSupportSnapshot(value.impactSupport),
    layerCombinationResolver: normalizeLayerCombinationResolverSnapshot(value.layerCombinationResolver)
  });
}

export function buildSimpleWorkbenchAssistantTraceSnapshot(
  result: AssemblyCalculation | null | undefined
): SimpleWorkbenchAssistantTraceSnapshot | undefined {
  if (!result) {
    return undefined;
  }

  return parseSimpleWorkbenchAssistantTraceSnapshot({
    airborne: result.dynamicAirborneTrace
      ? {
          candidateMethods: result.dynamicAirborneTrace.candidateMethods,
          confidenceClass: result.dynamicAirborneTrace.confidenceClass,
          confidenceScore: result.dynamicAirborneTrace.confidenceScore,
          detectedFamily: result.dynamicAirborneTrace.detectedFamily,
          detectedFamilyLabel: result.dynamicAirborneTrace.detectedFamilyLabel,
          notes: result.dynamicAirborneTrace.notes,
          selectedLabel: result.dynamicAirborneTrace.selectedLabel,
          selectedMethod: result.dynamicAirborneTrace.selectedMethod,
          solverSpreadRwDb: result.dynamicAirborneTrace.solverSpreadRwDb,
          strategy: result.dynamicAirborneTrace.strategy
        }
      : undefined,
    airborneCandidateResolution: result.airborneCandidateResolution
      ? {
          candidateSummaries: (result.airborneCandidateResolution.candidates as readonly AirborneCandidateSnapshotInput[]).map((candidate) => ({
            id: candidate.id,
            metricIds: candidate.metricIds,
            origin: candidate.origin,
            outputIds: candidate.outputIds,
            rejectionCodes: candidate.rejectionReasons.map((reason) => reason.code),
            selected: candidate.selected
          })),
          rejectedCandidateIds: result.airborneCandidateResolution.rejectedCandidateIds,
          runtimeValueMovement: result.airborneCandidateResolution.runtimeValueMovement,
          selectedBasisOrigin: result.airborneCandidateResolution.selectedBasis?.origin,
          selectedCandidateId: result.airborneCandidateResolution.selectedCandidateId,
          selectedOrigin: result.airborneCandidateResolution.selectedOrigin
        }
      : undefined,
    impact: result.dynamicImpactTrace
      ? {
          availableMetricLabels: result.dynamicImpactTrace.availableMetricLabels,
          candidateRowCount: result.dynamicImpactTrace.candidateRowCount,
          confidenceClass: result.dynamicImpactTrace.confidenceClass,
          confidenceScore: result.dynamicImpactTrace.confidenceScore,
          evidenceTier: result.dynamicImpactTrace.evidenceTier,
          evidenceTierLabel: result.dynamicImpactTrace.evidenceTierLabel,
          fieldContinuation: result.dynamicImpactTrace.fieldContinuation,
          fieldContinuationLabel: result.dynamicImpactTrace.fieldContinuationLabel,
          fitPercent: result.dynamicImpactTrace.fitPercent,
          impactBasis: result.dynamicImpactTrace.impactBasis,
          impactBasisLabel: result.dynamicImpactTrace.impactBasisLabel,
          notes: result.dynamicImpactTrace.notes,
          selectedLabel: result.dynamicImpactTrace.selectedLabel,
          selectedSourceIds: result.dynamicImpactTrace.selectedSourceIds,
          selectedSourceLabels: result.dynamicImpactTrace.selectedSourceLabels,
          selectionKind: result.dynamicImpactTrace.selectionKind,
          selectionKindLabel: result.dynamicImpactTrace.selectionKindLabel,
          supportFamily: result.dynamicImpactTrace.detectedSupportFamily,
          supportFamilyLabel: result.dynamicImpactTrace.detectedSupportFamilyLabel,
          systemType: result.dynamicImpactTrace.systemType,
          systemTypeLabel: result.dynamicImpactTrace.systemTypeLabel
        }
      : undefined,
    impactSupport: result.impactSupport
      ? {
          basis: result.impactSupport.basis,
          formulaNotes: result.impactSupport.formulaNotes,
          labOrField: result.impactSupport.labOrField,
          notes: result.impactSupport.notes,
          primaryCurveType: result.impactSupport.primaryCurveType,
          primaryCurveUnaffected: result.impactSupport.primaryCurveUnaffected,
          referenceFloorType: result.impactSupport.referenceFloorType
        }
      : undefined,
    layerCombinationResolver: result.layerCombinationResolverTrace
      ? {
          basis: result.layerCombinationResolverTrace.basis,
          boundaryCandidateIds: result.layerCombinationResolverTrace.boundaryCandidateIds,
          candidateKind: result.layerCombinationResolverTrace.candidateKind,
          errorBudgetMetrics: result.layerCombinationResolverTrace.errorBudgetMetrics,
          rejectedCandidateIds: result.layerCombinationResolverTrace.rejectedCandidateIds,
          requestedBasis: result.layerCombinationResolverTrace.requestedBasis,
          requiredInputs: result.layerCombinationResolverTrace.requiredInputs,
          route: result.layerCombinationResolverTrace.route,
          runtimeBasisId: result.layerCombinationResolverTrace.runtimeBasisId ?? undefined,
          selectedCandidateId: result.layerCombinationResolverTrace.selectedCandidateId,
          supportBucket: result.layerCombinationResolverTrace.supportBucket,
          supportedMetrics: result.layerCombinationResolverTrace.supportedMetrics,
          surfaceDetail: result.layerCombinationResolverTrace.surfaceDetail,
          surfaceLabel: result.layerCombinationResolverTrace.surfaceLabel,
          valuePins: result.layerCombinationResolverTrace.valuePins
        }
      : undefined
  });
}

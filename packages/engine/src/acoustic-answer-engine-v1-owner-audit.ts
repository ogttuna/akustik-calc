import type {
  AssemblyCalculation,
  FloorSystemAirborneRatings,
  ImpactCalculation,
  LayerCombinationResolverTrace,
  RequestedOutputId
} from "@dynecho/shared";
import { getFloorSystemC, getFloorSystemCtr } from "@dynecho/shared";

export const ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_OWNER_AUDIT_WARNING_PREFIX =
  "Acoustic Calculator Answer Engine V1 owner audit parked ownerless supported outputs";

export type AcousticAnswerEngineV1OwnerAuditResultKind = "assembly" | "impact_only";

export type AcousticAnswerEngineV1OwnerAuditInput = {
  readonly allowedCompanionOutputs?: readonly RequestedOutputId[];
  readonly answerStopActive?: boolean;
  readonly answerStopOutputs?: readonly RequestedOutputId[];
  readonly layerCombinationResolverTrace: LayerCombinationResolverTrace | undefined;
  readonly resultKind: AcousticAnswerEngineV1OwnerAuditResultKind;
  readonly supportedTargetOutputs: readonly RequestedOutputId[];
};

export type AcousticAnswerEngineV1OwnerAuditResult = {
  readonly ownerlessSupportedOutputs: readonly RequestedOutputId[];
  readonly warning: string | null;
};

type FloorLabCompanionCarrier = {
  readonly floorSystemRatings?: FloorSystemAirborneRatings | null;
  readonly impact?: Pick<
    ImpactCalculation,
    | "CI"
    | "CI50_2500"
    | "DeltaLw"
    | "LPrimeNT50"
    | "LPrimeNTw"
    | "LPrimeNW"
    | "LnTA"
    | "LnW"
    | "LnWPlusCI"
  > | null;
  readonly layerCombinationResolverTrace: LayerCombinationResolverTrace | undefined;
  readonly metrics?: Partial<
    Pick<
      AssemblyCalculation["metrics"],
      | "estimatedDnADb"
      | "estimatedDnTADb"
      | "estimatedDnTAkDb"
      | "estimatedDnTwDb"
      | "estimatedDnWDb"
      | "estimatedRwPrimeDb"
    >
  >;
  readonly supportedTargetOutputs: readonly RequestedOutputId[];
};

function uniqueRequestedOutputs(outputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  return [...new Set(outputs)];
}

function isFiniteNumber(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function hasOwnedFloorLabCompanionValue(
  input: FloorLabCompanionCarrier,
  output: RequestedOutputId
): boolean {
  const floorRatings = input.floorSystemRatings;
  const impact = input.impact;

  switch (output) {
    case "Rw":
      return isFiniteNumber(floorRatings?.Rw);
    case "C":
      return Boolean(floorRatings && isFiniteNumber(getFloorSystemC(floorRatings)));
    case "Ctr":
      return Boolean(floorRatings && isFiniteNumber(getFloorSystemCtr(floorRatings)));
    case "Ln,w":
      return isFiniteNumber(impact?.LnW);
    case "CI":
      return isFiniteNumber(impact?.CI);
    case "CI,50-2500":
      return isFiniteNumber(impact?.CI50_2500);
    case "Ln,w+CI":
      return isFiniteNumber(impact?.LnWPlusCI);
    case "DeltaLw":
      return isFiniteNumber(impact?.DeltaLw);
    case "R'w":
      return isFiniteNumber(input.metrics?.estimatedRwPrimeDb);
    case "Dn,w":
      return isFiniteNumber(input.metrics?.estimatedDnWDb);
    case "Dn,A":
      return isFiniteNumber(input.metrics?.estimatedDnADb);
    case "DnT,w":
      return isFiniteNumber(input.metrics?.estimatedDnTwDb);
    case "DnT,A":
      return isFiniteNumber(input.metrics?.estimatedDnTADb);
    case "DnT,A,k":
      return isFiniteNumber(input.metrics?.estimatedDnTAkDb);
    case "L'n,w":
      return isFiniteNumber(impact?.LPrimeNW);
    case "L'nT,w":
      return isFiniteNumber(impact?.LPrimeNTw);
    case "L'nT,50":
      return isFiniteNumber(impact?.LPrimeNT50);
    case "LnT,A":
      return isFiniteNumber(impact?.LnTA);
    default:
      return false;
  }
}

export function getAcousticCalculatorAnswerEngineV1FloorLabCompanionOutputs(
  input: FloorLabCompanionCarrier
): RequestedOutputId[] {
  const trace = input.layerCombinationResolverTrace;
  if (trace?.route !== "floor") {
    return [];
  }
  if (trace.selectedCandidateId === "floor.exact_impact_band_source.metric_basis") {
    return [];
  }

  return uniqueRequestedOutputs(
    input.supportedTargetOutputs.filter((output) =>
      hasOwnedFloorLabCompanionValue(input, output)
    )
  );
}

function shouldEnforceOwnerAudit(
  input: AcousticAnswerEngineV1OwnerAuditInput,
  trace: LayerCombinationResolverTrace
): boolean {
  if (
    trace.supportBucket === "exact" ||
    trace.candidateKind === "exact_measured_override"
  ) {
    return trace.supportedMetrics.length > 0;
  }

  if (!input.answerStopActive) {
    return trace.route === "floor" && trace.supportedMetrics.length > 0;
  }

  return (
    trace.supportBucket === "needs_input" ||
    trace.supportBucket === "unsupported" ||
    trace.supportBucket === "basis_boundary" ||
    trace.candidateKind === "needs_input_boundary" ||
    trace.candidateKind === "unsupported_boundary" ||
    trace.candidateKind === "basis_boundary"
  );
}

export function auditAcousticCalculatorAnswerEngineV1OutputOwnership(
  input: AcousticAnswerEngineV1OwnerAuditInput
): AcousticAnswerEngineV1OwnerAuditResult {
  const trace = input.layerCombinationResolverTrace;
  if (!trace) {
    return {
      ownerlessSupportedOutputs: [],
      warning: null
    };
  }

  if (!shouldEnforceOwnerAudit(input, trace)) {
    return {
      ownerlessSupportedOutputs: [],
      warning: null
    };
  }

  const ownedMetricSet = new Set<RequestedOutputId>(trace.supportedMetrics);
  const allowedCompanionSet = new Set<RequestedOutputId>(input.allowedCompanionOutputs ?? []);
  const answerStopOutputSet = new Set<RequestedOutputId>(input.answerStopOutputs ?? []);
  const auditedSupportedOutputs =
    input.answerStopActive && trace.supportBucket !== "exact" && answerStopOutputSet.size > 0
      ? input.supportedTargetOutputs.filter((output) => answerStopOutputSet.has(output))
      : input.supportedTargetOutputs;
  const ownerlessSupportedOutputs = uniqueRequestedOutputs(
    auditedSupportedOutputs.filter(
      (output) => !ownedMetricSet.has(output) && !allowedCompanionSet.has(output)
    )
  );

  if (ownerlessSupportedOutputs.length === 0) {
    return {
      ownerlessSupportedOutputs,
      warning: null
    };
  }

  return {
    ownerlessSupportedOutputs,
    warning:
      `${ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_OWNER_AUDIT_WARNING_PREFIX} ` +
      `${ownerlessSupportedOutputs.join(", ")} for ${input.resultKind}; ` +
      `selected candidate ${trace.selectedCandidateId} owns ${trace.supportedMetrics.join(", ") || "no metrics"} ` +
      `on ${trace.basis}.`
  };
}
